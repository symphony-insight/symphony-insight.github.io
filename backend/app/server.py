from __future__ import annotations

import json
import os
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Callable, Mapping
from urllib.parse import urlparse

from app.llm.deepseek import DeepSeekAPIError, DeepSeekClient, DeepSeekResponseError, config_from_env, load_env_file
from app.seed_data import build_seed_audit_logs, build_seed_reports


BACKEND_ROOT = Path(__file__).resolve().parents[1]
API_PREFIX = "/api/v1"
ALLOWED_REPORT_STATUSES = frozenset({"draft", "teacher_reviewing", "approved", "rejected", "exported"})
MEDICAL_RISK_PHRASES = ("诊断", "疗效", "病情好转", "病情恶化", "康复有效", "恢复正常")
MEDICAL_BOUNDARY_NEGATIONS = ("不做", "不用于", "不代表", "不判断", "不输出", "不会")


@dataclass(frozen=True)
class LLMJSONResult:
    content: Mapping[str, Any]
    usage: Mapping[str, Any]


_reports: list[dict[str, Any]] = []
_audit_logs: list[dict[str, Any]] = []
_llm_client_factory: Callable[[], Any] | None = None


def reset_state() -> None:
    global _reports, _audit_logs, _llm_client_factory
    _reports = build_seed_reports()
    _audit_logs = build_seed_audit_logs()
    _llm_client_factory = None


def set_llm_client_factory(factory: Callable[[], Any]) -> None:
    global _llm_client_factory
    _llm_client_factory = factory


def get_report_for_test(report_id: str) -> dict[str, Any]:
    report = _find_report_by_id(report_id)
    if report is None:
        raise KeyError(report_id)
    return report


def derive_safety_for_test(content: Mapping[str, Any]) -> tuple[str, list[str]]:
    return _derive_safety(content)


def dispatch_request(
    method: str,
    raw_path: str,
    body: bytes | None = None,
    request_headers: Mapping[str, str] | None = None,
) -> tuple[int, dict[str, str], Any]:
    path = urlparse(raw_path).path
    headers = _cors_headers(request_headers)
    if method == "OPTIONS":
        return 204, headers, {}

    try:
        if method == "GET" and path == f"{API_PREFIX}/health":
            return 200, headers, _health_payload()

        if method == "GET" and path.startswith(f"{API_PREFIX}/children/") and path.endswith("/reports/current"):
            child_id = path.removeprefix(f"{API_PREFIX}/children/").removesuffix("/reports/current").strip("/")
            report = _find_report_by_child(child_id)
            if report is None:
                return _json_error(404, "report_not_found", "这份报告暂时没有准备好。", headers)
            return 200, headers, deepcopy(report)

        if method == "GET" and path.startswith(f"{API_PREFIX}/children/") and path.endswith("/audit-logs"):
            child_id = path.removeprefix(f"{API_PREFIX}/children/").removesuffix("/audit-logs").strip("/")
            logs = [deepcopy(log) for log in _audit_logs if log["childId"] == child_id]
            return 200, headers, logs

        if method == "POST" and path.startswith(f"{API_PREFIX}/children/") and path.endswith("/reports/draft"):
            child_id = path.removeprefix(f"{API_PREFIX}/children/").removesuffix("/reports/draft").strip("/")
            report = _find_report_by_child(child_id)
            if report is None:
                return _json_error(404, "child_not_found", "暂时没取到这位孩子的记录。", headers)
            return 200, headers, _generate_report_draft(report)

        if method == "PATCH" and path.startswith(f"{API_PREFIX}/reports/") and path.endswith("/status"):
            report_id = path.removeprefix(f"{API_PREFIX}/reports/").removesuffix("/status").strip("/")
            payload = _read_json_body(body)
            return _update_report_status(report_id, payload, headers)

        return _json_error(404, "not_found", "暂时没找到这个本地接口。", headers)
    except DeepSeekAPIError as error:
        return _json_error(error.status_code, "llm_api_error", "报告整理服务暂时不可用，请稍后再试。", headers)
    except DeepSeekResponseError:
        return _json_error(502, "llm_response_error", "报告整理结果格式不完整，请重新整理一次。", headers)
    except ValueError as error:
        return _json_error(400, "bad_request", str(error), headers)


def run(host: str | None = None, port: int | None = None) -> None:
    _load_local_env()
    reset_state()
    selected_host = host or os.environ.get("SYMPHONY_BACKEND_HOST", "127.0.0.1")
    selected_port = port or int(os.environ.get("SYMPHONY_BACKEND_PORT", "8000"))
    httpd = ThreadingHTTPServer((selected_host, selected_port), _RequestHandler)
    print(f"SymPhony backend listening on http://{selected_host}:{selected_port}{API_PREFIX}")
    httpd.serve_forever()


class _RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self) -> None:
        self._send_response(*dispatch_request("OPTIONS", self.path, request_headers=self.headers))

    def do_GET(self) -> None:
        self._send_response(*dispatch_request("GET", self.path, request_headers=self.headers))

    def do_POST(self) -> None:
        self._send_response(*dispatch_request("POST", self.path, self._read_body(), request_headers=self.headers))

    def do_PATCH(self) -> None:
        self._send_response(*dispatch_request("PATCH", self.path, self._read_body(), request_headers=self.headers))

    def log_message(self, format: str, *args: Any) -> None:
        return

    def _read_body(self) -> bytes:
        content_length = int(self.headers.get("Content-Length", "0"))
        return self.rfile.read(content_length) if content_length else b""

    def _send_response(self, status: int, headers: Mapping[str, str], body: Any) -> None:
        encoded = b"" if status == 204 else json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        for key, value in headers.items():
            self.send_header(key, value)
        self.end_headers()
        if encoded:
            self.wfile.write(encoded)


def _health_payload() -> dict[str, Any]:
    _load_local_env()
    return {
        "status": "ok",
        "service": "symphony-insight-backend",
        "provider": os.environ.get("SYMPHONY_LLM_PROVIDER", "deepseek"),
        "providerMode": os.environ.get("SYMPHONY_AI_PROVIDER_MODE", "mock"),
    }


def _generate_report_draft(report: dict[str, Any]) -> dict[str, Any]:
    generated_at = _now_iso()
    llm_result = _generate_with_provider(report)
    content = dict(llm_result.content)
    safety_status, flagged_phrases = _derive_safety(content)

    report["status"] = "teacher_reviewing"
    report["generation"] = {
        **report["generation"],
        "status": "draft_ready" if safety_status == "passed" else safety_status,
        "generatedAt": generated_at,
        "modelLabel": "DeepSeek 报告整理助手",
        "modelLabelEn": "DeepSeek report assistant",
    }
    report["professionalDraft"] = {
        **report["professionalDraft"],
        "overview": _text(content, "professional_overview", report["professionalDraft"]["overview"]),
        "motionObservation": _text(content, "motion_observation", report["professionalDraft"]["motionObservation"]),
        "affectObservation": _text(content, "affect_observation", report["professionalDraft"]["affectObservation"]),
        "participationObservation": _text(content, "participation_observation", report["professionalDraft"]["participationObservation"]),
        "reviewPoints": _list(content, "review_points", report["professionalDraft"]["reviewPoints"]),
        "limitationNote": _text(content, "limitation_note", report["professionalDraft"]["limitationNote"]),
    }
    report["parentSummary"] = {
        **report["parentSummary"],
        "overview": _text(content, "parent_overview", report["parentSummary"]["overview"]),
        "positiveMoments": _text(content, "positive_moments", report["parentSummary"]["positiveMoments"]),
        "nextObservationFocus": _text(content, "next_observation_focus", report["parentSummary"]["nextObservationFocus"]),
    }
    report["safetyCheck"] = {
        **report["safetyCheck"],
        "containsMedicalClaim": bool(flagged_phrases),
        "flaggedPhrases": flagged_phrases,
        "checkedAt": generated_at,
        "displayStatus": safety_status,
        "plainSummary": "没有发现不适合直接使用的表述。"
        if safety_status == "passed"
        else "这版草稿需要老师先修改标出的表述。",
        "plainSummaryEn": "No wording was found that should be held back from parent-facing use."
        if safety_status == "passed"
        else "This draft needs teacher edits before it can be shared.",
    }

    _prepend_audit_log(
        {
            "id": f"audit-generated-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            "childId": report["childId"],
            "actor": "报告整理助手",
            "actorEn": "Report assistant",
            "action": "report.generated",
            "targetType": "report",
            "targetId": report["id"],
            "createdAt": generated_at,
            "summary": f"DeepSeek 整理了一版报告草稿，等老师确认。",
            "summaryEn": "DeepSeek prepared a report draft for teacher review.",
        }
    )
    return deepcopy(report)


def _generate_with_provider(report: Mapping[str, Any]) -> LLMJSONResult:
    _load_local_env()
    mode = os.environ.get("SYMPHONY_AI_PROVIDER_MODE", "mock")
    if mode == "disabled":
        raise ValueError("报告整理服务当前没有开启。")
    if mode != "real":
        return _mock_llm_result(report)

    client = _llm_client_factory() if _llm_client_factory else DeepSeekClient(config_from_env())
    result = client.generate_json(_build_report_messages(report))
    return LLMJSONResult(content=result.content, usage=result.usage)


def _build_report_messages(report: Mapping[str, Any]) -> list[dict[str, str]]:
    source = report["generation"]
    user_payload = {
        "child_id": report["childId"],
        "source_summary": [
            f"{source['sourceSessionCount']} 次活动记录",
            f"{source['sourceRubricCount']} 项观察问题",
            f"{source['sourceDomainCount']} 个观察方向",
        ],
        "evidence": [
            "主动参加从第1次4次增加到第8次30次",
            "回到活动用时从约180秒缩短到约76秒",
            "低亮度、慢节奏和熟悉旋律下更容易保持投入",
        ],
        "required_json_keys": [
            "professional_overview",
            "motion_observation",
            "affect_observation",
            "participation_observation",
            "review_points",
            "limitation_note",
            "parent_overview",
            "positive_moments",
            "next_observation_focus",
            "safety_status",
            "flagged_phrases",
        ],
        "safety_rule": "不做诊断、治疗建议、疗效判断、病情好转、康复有效或恢复正常等表达。",
    }
    return [
        {
            "role": "system",
            "content": (
                "你是 SymPhony Insight 的报告整理助手。只能使用结构化观察证据写报告草稿。"
                "不要做诊断、治疗建议、疗效判断或病情变化判断。"
                "必须只输出 JSON object，不要输出 Markdown。"
            ),
        },
        {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False)},
    ]


def _mock_llm_result(report: Mapping[str, Any]) -> LLMJSONResult:
    child_label = {"xiaoyu": "小宇", "lele": "乐乐", "anan": "安安"}.get(str(report["childId"]), "孩子")
    return LLMJSONResult(
        content={
            "professional_overview": f"本轮记录了 8 次音乐共创活动。{child_label}在熟悉旋律、慢节奏和低亮度画面下更容易进入活动。",
            "motion_observation": "主动动作和可用创作片段逐步增加，回到活动的时间也缩短。",
            "affect_observation": "低亮度、慢节奏和熟悉旋律下，更常看到平静或投入的状态。",
            "participation_observation": "在重复提示和可暂停的设置里，更愿意继续尝试。",
            "review_points": ["继续低亮度设置", "保留暂停和重新开始选择", "观察哪种节奏更容易进入活动"],
            "limitation_note": "这份报告只整理活动观察记录，不做诊断或疗效判断。",
            "parent_overview": f"{child_label}在 8 次活动里逐步更愿意参与音乐共创。",
            "positive_moments": "熟悉旋律和慢一点的节奏下，更容易重新投入活动。",
            "next_observation_focus": "下次继续观察低亮度画面和不同节奏带来的差异。",
            "safety_status": "passed",
            "flagged_phrases": [],
        },
        usage={"total_tokens": 0, "provider": "mock"},
    )


def _update_report_status(report_id: str, payload: Mapping[str, Any], headers: dict[str, str]) -> tuple[int, dict[str, str], Any]:
    report = _find_report_by_id(report_id)
    if report is None:
        return _json_error(404, "report_not_found", "暂时没取到这份报告。", headers)

    status = payload.get("status")
    if status not in ALLOWED_REPORT_STATUSES:
        return _json_error(400, "invalid_report_status", "这份报告状态暂时不能这样更新。", headers)

    if report["safetyCheck"]["displayStatus"] == "blocked" and status in ("approved", "exported"):
        return _json_error(409, "blocked_report", "这份报告还需要老师先修改表述。", headers)

    report["status"] = status
    report["generation"] = {**report["generation"], "status": _generation_status_for_report(status)}
    actor = str(payload.get("actor") or "陈老师")
    created_at = _now_iso()
    _prepend_audit_log(
        {
            "id": f"audit-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            "childId": report["childId"],
            "actor": actor,
            "actorEn": "Teacher Chen" if actor == "陈老师" else actor,
            "action": f"report.{status}",
            "targetType": "report",
            "targetId": report_id,
            "createdAt": created_at,
            "summary": "老师已确认这份报告。" if status == "approved" else "老师更新了报告。",
            "summaryEn": _status_summary_en(status),
        }
    )
    return 200, headers, deepcopy(report)


def _generation_status_for_report(status: str) -> str:
    return {
        "draft": "not_started",
        "teacher_reviewing": "needs_teacher_review",
        "rejected": "needs_teacher_review",
        "approved": "approved",
        "exported": "exported",
    }[status]


def _status_summary_en(status: str) -> str:
    return {
        "approved": "Teacher confirmed this report.",
        "rejected": "Teacher returned this report for revision.",
        "exported": "Teacher exported the parent-facing summary.",
    }.get(status, "Teacher updated this report.")


def _derive_safety(content: Mapping[str, Any]) -> tuple[str, list[str]]:
    raw_status = str(content.get("safety_status") or "passed")
    output_text = json.dumps(content, ensure_ascii=False)
    flagged = sorted({phrase for phrase in MEDICAL_RISK_PHRASES if _has_risky_medical_occurrence(output_text, phrase)})
    explicit = content.get("flagged_phrases")
    if isinstance(explicit, list):
        flagged.extend(str(item) for item in explicit if item)
    flagged = sorted(set(flagged))
    status = raw_status if raw_status in ("passed", "needs_edit", "blocked") else "passed"
    if flagged and status == "passed":
        status = "needs_edit"
    return status, flagged


def _has_risky_medical_occurrence(text: str, phrase: str) -> bool:
    start = 0
    while True:
        index = text.find(phrase, start)
        if index == -1:
            return False
        window = text[max(0, index - 12) : index]
        if not any(negation in window for negation in MEDICAL_BOUNDARY_NEGATIONS):
            return True
        start = index + len(phrase)


def _read_json_body(body: bytes | None) -> Mapping[str, Any]:
    if not body:
        return {}
    parsed = json.loads(body.decode("utf-8"))
    if not isinstance(parsed, Mapping):
        raise ValueError("Request body must be a JSON object.")
    return parsed


def _text(content: Mapping[str, Any], key: str, fallback: str) -> str:
    value = content.get(key)
    return value.strip() if isinstance(value, str) and value.strip() else fallback


def _list(content: Mapping[str, Any], key: str, fallback: list[str]) -> list[str]:
    value = content.get(key)
    if not isinstance(value, list):
        return fallback
    cleaned = [str(item).strip() for item in value if str(item).strip()]
    return cleaned or fallback


def _find_report_by_child(child_id: str) -> dict[str, Any] | None:
    return next((report for report in _reports if report["childId"] == child_id), None)


def _find_report_by_id(report_id: str) -> dict[str, Any] | None:
    return next((report for report in _reports if report["id"] == report_id), None)


def _prepend_audit_log(log: dict[str, Any]) -> None:
    _audit_logs.insert(0, log)


def _json_error(status: int, code: str, message: str, headers: dict[str, str]) -> tuple[int, dict[str, str], dict[str, str]]:
    return status, headers, {"error": code, "message": message}


def _cors_headers(request_headers: Mapping[str, str] | None = None) -> dict[str, str]:
    origins = os.environ.get("SYMPHONY_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    allowed_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
    request_origin = request_headers.get("Origin") if request_headers else None
    selected_origin = request_origin if request_origin in allowed_origins else (allowed_origins[0] if allowed_origins else "http://localhost:5173")
    return {
        "Access-Control-Allow-Origin": selected_origin,
        "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def _load_local_env() -> None:
    for key, value in load_env_file(BACKEND_ROOT / ".env.local").items():
        os.environ.setdefault(key, value)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


reset_state()


if __name__ == "__main__":
    run()
