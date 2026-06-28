from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Mapping, Sequence, Tuple, Union


DEFAULT_DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions"
SUPPORTED_DEEPSEEK_MODELS = frozenset(
    {
        "deepseek-v4-flash",
        "deepseek-v4-pro",
        "deepseek-chat",
        "deepseek-reasoner",
    }
)
SUPPORTED_THINKING_TYPES = frozenset({"disabled", "enabled"})
SUPPORTED_REASONING_EFFORTS = frozenset({"high", "max"})


class DeepSeekAPIError(RuntimeError):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        super().__init__(f"DeepSeek API error {status_code}: {message}")


class DeepSeekResponseError(RuntimeError):
    pass


@dataclass(frozen=True)
class DeepSeekConfig:
    api_key: str
    endpoint: str = DEFAULT_DEEPSEEK_ENDPOINT
    model: str = "deepseek-v4-flash"
    timeout_seconds: float = 45
    temperature: float = 0.2
    max_tokens: int = 1600
    thinking_type: str = "disabled"
    reasoning_effort: str = "high"

    def __post_init__(self) -> None:
        if not self.api_key or self.api_key == "replace_with_your_api_key":
            raise ValueError("DeepSeek API key is required")
        if self.model not in SUPPORTED_DEEPSEEK_MODELS:
            raise ValueError(f"Unsupported DeepSeek model: {self.model}")
        if self.thinking_type not in SUPPORTED_THINKING_TYPES:
            raise ValueError(f"Unsupported DeepSeek thinking type: {self.thinking_type}")
        if self.reasoning_effort not in SUPPORTED_REASONING_EFFORTS:
            raise ValueError(f"Unsupported DeepSeek reasoning effort: {self.reasoning_effort}")
        if self.timeout_seconds <= 0:
            raise ValueError("DeepSeek timeout must be positive")
        if self.max_tokens <= 0:
            raise ValueError("DeepSeek max_tokens must be positive")


@dataclass(frozen=True)
class DeepSeekJSONResult:
    content: dict[str, Any]
    usage: Mapping[str, Any]
    raw_response: Mapping[str, Any]


TransportResponse = Union[Mapping[str, Any], Tuple[int, Mapping[str, Any]]]
Transport = Callable[[str, Mapping[str, str], bytes, float], TransportResponse]


def build_chat_completion_payload(config: DeepSeekConfig, messages: Sequence[Mapping[str, str]]) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": config.model,
        "messages": [dict(message) for message in messages],
        "stream": False,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "response_format": {"type": "json_object"},
        "thinking": {"type": config.thinking_type},
    }
    if config.thinking_type == "enabled":
        payload["reasoning_effort"] = config.reasoning_effort
    return payload


def load_env_file(path: str | Path) -> dict[str, str]:
    env_path = Path(path)
    if not env_path.exists():
        return {}

    values: dict[str, str] = {}
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def config_from_env(env: Mapping[str, str] | None = None) -> DeepSeekConfig:
    source = env or os.environ
    return DeepSeekConfig(
        api_key=source.get("SYMPHONY_LLM_API_KEY", ""),
        endpoint=source.get("SYMPHONY_LLM_ENDPOINT", DEFAULT_DEEPSEEK_ENDPOINT),
        model=source.get("SYMPHONY_LLM_MODEL", "deepseek-v4-flash"),
        timeout_seconds=float(source.get("SYMPHONY_LLM_TIMEOUT_SECONDS", "45")),
        temperature=float(source.get("SYMPHONY_LLM_TEMPERATURE", "0.2")),
        max_tokens=int(source.get("SYMPHONY_LLM_MAX_OUTPUT_TOKENS", "1600")),
        thinking_type=source.get("SYMPHONY_LLM_THINKING_TYPE", "disabled"),
        reasoning_effort=source.get("SYMPHONY_LLM_REASONING_EFFORT", "high"),
    )


class DeepSeekClient:
    def __init__(self, config: DeepSeekConfig, transport: Transport | None = None):
        self._config = config
        self._transport = transport or _urllib_transport

    def generate_json(self, messages: Sequence[Mapping[str, str]]) -> DeepSeekJSONResult:
        payload = build_chat_completion_payload(self._config, messages)
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers = {
            "Authorization": f"Bearer {self._config.api_key}",
            "Content-Type": "application/json",
        }

        response = self._transport(self._config.endpoint, headers, body, self._config.timeout_seconds)
        status_code, data = response if isinstance(response, tuple) else (200, response)
        if status_code != 200:
            raise DeepSeekAPIError(status_code, _extract_error_message(data))
        return _parse_json_response(data)


def _urllib_transport(url: str, headers: Mapping[str, str], body: bytes, timeout: float) -> Mapping[str, Any] | tuple[int, Mapping[str, Any]]:
    request = urllib.request.Request(url, data=body, headers=dict(headers), method="POST")
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        raw_body = error.read().decode("utf-8")
        try:
            return error.code, json.loads(raw_body)
        except json.JSONDecodeError:
            return error.code, {"error": {"message": raw_body or error.reason}}


def _parse_json_response(data: Mapping[str, Any]) -> DeepSeekJSONResult:
    choices = data.get("choices")
    if not isinstance(choices, list) or not choices:
        raise DeepSeekResponseError("DeepSeek response did not include choices")

    choice = choices[0]
    if not isinstance(choice, Mapping):
        raise DeepSeekResponseError("DeepSeek response choice has an invalid shape")

    finish_reason = choice.get("finish_reason")
    if finish_reason not in (None, "stop"):
        raise DeepSeekResponseError(f"DeepSeek response did not finish cleanly: {finish_reason}")

    message = choice.get("message")
    if not isinstance(message, Mapping):
        raise DeepSeekResponseError("DeepSeek response did not include a message")

    content = message.get("content")
    if not isinstance(content, str) or not content.strip():
        raise DeepSeekResponseError("DeepSeek response content was empty")

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as error:
        raise DeepSeekResponseError(f"DeepSeek response content was not valid JSON: {error.msg}") from error

    if not isinstance(parsed, dict):
        raise DeepSeekResponseError("DeepSeek JSON mode returned a non-object value")

    usage = data.get("usage") if isinstance(data.get("usage"), Mapping) else {}
    return DeepSeekJSONResult(content=parsed, usage=usage, raw_response=data)


def _extract_error_message(data: Mapping[str, Any]) -> str:
    error = data.get("error")
    if isinstance(error, Mapping) and isinstance(error.get("message"), str):
        return error["message"]
    if isinstance(data.get("message"), str):
        return str(data["message"])
    return json.dumps(data, ensure_ascii=False)
