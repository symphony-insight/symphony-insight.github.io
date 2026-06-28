import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app import server


class ServerRoutesTest(unittest.TestCase):
    def setUp(self):
        server.reset_state()

    def test_health_returns_provider_status(self):
        status, _headers, body = server.dispatch_request("GET", "/api/v1/health")

        self.assertEqual(status, 200)
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["provider"], "deepseek")
        self.assertIn(body["providerMode"], ("mock", "disabled", "real"))

    def test_returns_current_report_and_audit_logs_for_child(self):
        report_status, _report_headers, report = server.dispatch_request("GET", "/api/v1/children/xiaoyu/reports/current")
        log_status, _log_headers, logs = server.dispatch_request("GET", "/api/v1/children/xiaoyu/audit-logs")

        self.assertEqual(report_status, 200)
        self.assertEqual(report["id"], "report-xiaoyu-8")
        self.assertEqual(report["childId"], "xiaoyu")
        self.assertEqual(report["generation"]["sourceRubricCount"], 9)
        self.assertEqual(log_status, 200)
        self.assertGreaterEqual(len(logs), 1)
        self.assertEqual(logs[0]["targetType"], "report")

    def test_generates_report_draft_with_injected_llm_client(self):
        calls = []

        class FakeClient:
            def generate_json(self, messages):
                calls.append(messages)
                return server.LLMJSONResult(
                    content={
                        "professional_overview": "本轮记录了 8 次活动，孩子的主动参与更稳定。",
                        "motion_observation": "主动动作增加，回到活动的时间缩短。",
                        "affect_observation": "低亮度和慢节奏下更容易保持投入。",
                        "participation_observation": "在重复提示里更愿意继续尝试。",
                        "review_points": ["继续低亮度设置", "保留暂停选择"],
                        "limitation_note": "这份报告只整理观察记录，不做诊断或疗效判断。",
                        "parent_overview": "孩子在 8 次活动里更愿意参与。",
                        "positive_moments": "熟悉旋律下，他更容易重新投入。",
                        "next_observation_focus": "下次继续观察哪种节奏更舒服。",
                        "safety_status": "passed",
                        "flagged_phrases": [],
                    },
                    usage={"total_tokens": 321},
                )

        with patch.dict(os.environ, {"SYMPHONY_AI_PROVIDER_MODE": "real"}):
            server.set_llm_client_factory(lambda: FakeClient())
            status, _headers, report = server.dispatch_request("POST", "/api/v1/children/xiaoyu/reports/draft", body=b"{}")

        self.assertEqual(status, 200)
        self.assertEqual(report["status"], "teacher_reviewing")
        self.assertEqual(report["generation"]["status"], "draft_ready")
        self.assertEqual(report["professionalDraft"]["overview"], "本轮记录了 8 次活动，孩子的主动参与更稳定。")
        self.assertEqual(report["parentSummary"]["positiveMoments"], "熟悉旋律下，他更容易重新投入。")
        self.assertEqual(report["safetyCheck"]["displayStatus"], "passed")
        self.assertIn("8 次活动记录", calls[0][1]["content"])

        log_status, _log_headers, logs = server.dispatch_request("GET", "/api/v1/children/xiaoyu/audit-logs")
        self.assertEqual(log_status, 200)
        self.assertEqual(logs[0]["action"], "report.generated")
        self.assertIn("DeepSeek", logs[0]["summary"])

    def test_updates_report_status_and_synchronizes_generation_status(self):
        body = json.dumps({"status": "approved", "actor": "陈老师"}).encode("utf-8")

        status, _headers, report = server.dispatch_request("PATCH", "/api/v1/reports/report-xiaoyu-8/status", body=body)

        self.assertEqual(status, 200)
        self.assertEqual(report["status"], "approved")
        self.assertEqual(report["generation"]["status"], "approved")

    def test_rejects_blocked_report_approval(self):
        current_report = server.get_report_for_test("report-xiaoyu-8")
        current_report["safetyCheck"]["displayStatus"] = "blocked"
        body = json.dumps({"status": "approved", "actor": "陈老师"}).encode("utf-8")

        status, _headers, error = server.dispatch_request("PATCH", "/api/v1/reports/report-xiaoyu-8/status", body=body)

        self.assertEqual(status, 409)
        self.assertEqual(error["error"], "blocked_report")

    def test_unknown_llm_safety_status_without_risk_words_is_treated_as_passed(self):
        status, flagged = server.derive_safety_for_test(
            {
                "professional_overview": "孩子在活动中的主动参与次数增加。",
                "safety_status": "observation_only",
                "flagged_phrases": [],
            }
        )

        self.assertEqual(status, "passed")
        self.assertEqual(flagged, [])

    def test_options_preflight_returns_cors_headers(self):
        status, headers, body = server.dispatch_request(
            "OPTIONS",
            "/api/v1/children/xiaoyu/reports/current",
            request_headers={"Origin": "http://127.0.0.1:5173"},
        )

        self.assertEqual(status, 204)
        self.assertEqual(body, {})
        self.assertEqual(headers["Access-Control-Allow-Origin"], "http://127.0.0.1:5173")

    def test_get_response_echoes_allowed_request_origin(self):
        status, headers, body = server.dispatch_request(
            "GET",
            "/api/v1/health",
            request_headers={"Origin": "http://127.0.0.1:5173"},
        )

        self.assertEqual(status, 200)
        self.assertEqual(body["status"], "ok")
        self.assertEqual(headers["Access-Control-Allow-Origin"], "http://127.0.0.1:5173")

    def test_serves_static_index_and_spa_fallback(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "index.html").write_text('<div id="root"></div>', encoding="utf-8")
            with patch.dict(os.environ, {"SYMPHONY_STATIC_DIR": str(root)}):
                index_status, index_headers, index_body = server.dispatch_request("GET", "/")
                route_status, route_headers, route_body = server.dispatch_request("GET", "/child/xiaoyu/report")

        self.assertEqual(index_status, 200)
        self.assertEqual(index_headers["Content-Type"], "text/html; charset=utf-8")
        self.assertEqual(index_body, '<div id="root"></div>')
        self.assertEqual(route_status, 200)
        self.assertEqual(route_headers["Content-Type"], "text/html; charset=utf-8")
        self.assertEqual(route_body, '<div id="root"></div>')

    def test_serves_static_asset_with_content_type(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "assets").mkdir()
            (root / "assets" / "app.js").write_text("console.log('ok')", encoding="utf-8")
            with patch.dict(os.environ, {"SYMPHONY_STATIC_DIR": str(root)}):
                status, headers, body = server.dispatch_request("GET", "/assets/app.js")

        self.assertEqual(status, 200)
        self.assertEqual(headers["Content-Type"], "application/javascript; charset=utf-8")
        self.assertEqual(body, "console.log('ok')")


if __name__ == "__main__":
    unittest.main()
