from __future__ import annotations

import json
import sys
from urllib.error import URLError
from urllib.request import Request, urlopen


def check(url: str) -> dict[str, object]:
    request = Request(url, headers={"User-Agent": "symphony-smoke-check"})
    try:
        with urlopen(request, timeout=10) as response:
            content_type = response.headers.get("content-type")
            body = response.read(512)
            preview = body.decode("utf-8", errors="replace")
            return {
                "url": url,
                "ok": response.status == 200,
                "status": response.status,
                "content_type": content_type,
                "looks_like_health": "\"status\"" in preview and "\"ok\"" in preview,
                "looks_like_html": "<html" in preview.lower() or '<div id="root"' in preview.lower(),
            }
    except (TimeoutError, URLError, OSError) as error:
        return {
            "url": url,
            "ok": False,
            "status": None,
            "content_type": None,
            "error": str(error),
            "looks_like_health": False,
            "looks_like_html": False,
        }


def main() -> int:
    urls = sys.argv[1:] or [
        "http://127.0.0.1:8090/",
        "http://127.0.0.1:8090/api/v1/health",
        "https://symphony.yjx.me/",
        "https://symphony.yjx.me/api/v1/health",
    ]
    results = [check(url) for url in urls]
    print(json.dumps(results, ensure_ascii=False, indent=2))
    return 0 if all(item["ok"] for item in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
