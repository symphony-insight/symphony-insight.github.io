from __future__ import annotations

import json
import os
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.llm.deepseek import DeepSeekClient, config_from_env, load_env_file


def main() -> int:
    env_file = BACKEND_ROOT / ".env.local"
    for key, value in load_env_file(env_file).items():
        os.environ.setdefault(key, value)

    provider = os.environ.get("SYMPHONY_LLM_PROVIDER", "deepseek")
    mode = os.environ.get("SYMPHONY_AI_PROVIDER_MODE", "mock")
    if provider != "deepseek" or mode != "real":
        print("Set SYMPHONY_LLM_PROVIDER=deepseek and SYMPHONY_AI_PROVIDER_MODE=real in backend/.env.local", file=sys.stderr)
        return 2

    config = config_from_env()
    client = DeepSeekClient(config)
    result = client.generate_json(
        [
            {
                "role": "system",
                "content": (
                    "你是 SymPhony Insight 的报告整理助手。"
                    "只能根据结构化观察证据整理草稿，不做诊断、治疗建议或疗效判断。"
                    "必须只输出一个 JSON object。"
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "child_id": "xiaoyu",
                        "source_session_count": 8,
                        "source_rubric_count": 9,
                        "source_domain_count": 6,
                        "evidence": [
                            "主动参加从第1次4次增加到第8次30次",
                            "回到活动用时从约180秒缩短到约76秒",
                        ],
                        "expected_schema": {
                            "professional_overview": "string",
                            "parent_summary": "string",
                            "safety_status": "passed | needs_edit | blocked",
                            "notes": ["string"],
                        },
                    },
                    ensure_ascii=False,
                ),
            },
        ]
    )
    print(json.dumps({"content": result.content, "usage": result.usage}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
