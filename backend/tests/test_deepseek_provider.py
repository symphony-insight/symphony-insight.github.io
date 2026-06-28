import json
import unittest

from app.llm.deepseek import (
    DeepSeekAPIError,
    DeepSeekClient,
    DeepSeekConfig,
    DeepSeekResponseError,
    build_chat_completion_payload,
)


class DeepSeekProviderTest(unittest.TestCase):
    def test_builds_official_chat_completion_payload(self):
        config = DeepSeekConfig(
            api_key="test-key",
            model="deepseek-v4-pro",
            thinking_type="disabled",
            temperature=0.2,
            max_tokens=900,
        )

        payload = build_chat_completion_payload(
            config,
            [
                {"role": "system", "content": "Return JSON only."},
                {"role": "user", "content": "Summarize the activity evidence."},
            ],
        )

        self.assertEqual(payload["model"], "deepseek-v4-pro")
        self.assertEqual(payload["messages"][0]["role"], "system")
        self.assertEqual(payload["response_format"], {"type": "json_object"})
        self.assertEqual(payload["thinking"], {"type": "disabled"})
        self.assertEqual(payload["stream"], False)
        self.assertEqual(payload["max_tokens"], 900)
        self.assertEqual(payload["temperature"], 0.2)
        self.assertNotIn("top_p", payload)

    def test_accepts_current_deepseek_models_and_deprecated_aliases(self):
        for model in ("deepseek-v4-flash", "deepseek-v4-pro", "deepseek-chat", "deepseek-reasoner"):
            config = DeepSeekConfig(api_key="test-key", model=model)
            self.assertEqual(config.model, model)

    def test_rejects_models_outside_deepseek_chat_api(self):
        with self.assertRaises(ValueError):
            DeepSeekConfig(api_key="test-key", model="not-a-deepseek-model")

    def test_posts_to_deepseek_chat_completions_with_bearer_auth(self):
        calls = []

        def fake_transport(url, headers, body, timeout):
            calls.append((url, headers, json.loads(body.decode("utf-8")), timeout))
            return {
                "choices": [
                    {
                        "finish_reason": "stop",
                        "message": {"role": "assistant", "content": '{"safety_status":"passed"}'},
                    }
                ],
                "usage": {"prompt_tokens": 11, "completion_tokens": 7, "total_tokens": 18},
            }

        client = DeepSeekClient(
            DeepSeekConfig(api_key="test-key", model="deepseek-v4-flash", timeout_seconds=12),
            transport=fake_transport,
        )

        result = client.generate_json(
            [
                {"role": "system", "content": "You must output JSON."},
                {"role": "user", "content": "Return a safety_status field."},
            ]
        )

        self.assertEqual(result.content, {"safety_status": "passed"})
        self.assertEqual(result.usage["total_tokens"], 18)
        url, headers, payload, timeout = calls[0]
        self.assertEqual(url, "https://api.deepseek.com/chat/completions")
        self.assertEqual(headers["Authorization"], "Bearer test-key")
        self.assertEqual(headers["Content-Type"], "application/json")
        self.assertEqual(payload["model"], "deepseek-v4-flash")
        self.assertEqual(timeout, 12)

    def test_raises_on_filtered_or_empty_content(self):
        client = DeepSeekClient(
            DeepSeekConfig(api_key="test-key"),
            transport=lambda _url, _headers, _body, _timeout: {
                "choices": [{"finish_reason": "content_filter", "message": {"content": ""}}],
            },
        )

        with self.assertRaises(DeepSeekResponseError):
            client.generate_json([{"role": "user", "content": "Return JSON."}])

    def test_raises_api_error_with_status_code_and_message(self):
        client = DeepSeekClient(
            DeepSeekConfig(api_key="test-key"),
            transport=lambda _url, _headers, _body, _timeout: (
                401,
                {"error": {"message": "Authentication failed"}},
            ),
        )

        with self.assertRaises(DeepSeekAPIError) as context:
            client.generate_json([{"role": "user", "content": "Return JSON."}])

        self.assertEqual(context.exception.status_code, 401)
        self.assertIn("Authentication failed", str(context.exception))


if __name__ == "__main__":
    unittest.main()
