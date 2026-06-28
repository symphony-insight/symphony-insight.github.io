# SymPhony Insight Independent Server Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 SymPhony Insight 从 GitHub Pages mock/外部后端模式迁移为 `symphony.yjx.me` 上的独立服务器同源前后端应用。

**Architecture:** 生产环境由同一个 Python 后端进程监听 `127.0.0.1:8090`，同时服务 `/api/v1/*` JSON API 和 Vite 构建产物。Cloudflare Tunnel 把 `symphony.yjx.me` 指向这个本地端口，DeepSeek key 只保存在服务器 `backend/.env.local`。

**Tech Stack:** Vite, React, TypeScript, Python 3 standard library HTTP server, DeepSeek chat-completions adapter, npm scripts, cloudflared, optional user-level systemd or tmux.

## Global Constraints

- 生产前端必须使用 `VITE_API_MODE=backend` 和 `VITE_API_BASE_URL=/api/v1`。
- 生产浏览器不得接收 `SYMPHONY_LLM_API_KEY`、DeepSeek key 或任何 provider key。
- 后端生产监听地址固定为 `127.0.0.1:8090`，公网入口只通过 cloudflared。
- 服务器项目路径固定为 `/home/data/xuyijie/symphony-insight`。
- 域名固定为 `https://symphony.yjx.me`。
- LLM 仍只生成报告草稿和语言整理，不参与 rubric 评分、诊断或疗效判断。
- 所有本地代码改动必须通过 `npm run test:all`。
- 远端验收必须同时验证 `/`、`/api/v1/health`、`/#/child/xiaoyu/report`。

---

### Task 1: Add Production Server Build Configuration

**Files:**
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/package.json`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/backendApi.test.ts`

**Interfaces:**
- Produces npm script `build:server`.
- Produces npm script `start:server`.
- `getApiClient({ mode: "backend", baseUrl: "/api/v1" })` must call relative URLs such as `/api/v1/children/xiaoyu/reports/current`.

- [x] **Step 1: Add a backend API test for relative API base**

Add this test to `src/api/backendApi.test.ts`:

```ts
it("supports a same-origin relative backend base URL for server deployment", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return {
      ok: true,
      json: async () => ({
        id: "report-xiaoyu-8",
        childId: "xiaoyu",
        status: "teacher_reviewing",
        generation: { status: "draft_ready" },
        safetyCheck: { displayStatus: "passed" }
      })
    } as Response;
  });
  const api = createBackendApi({ baseUrl: "/api/v1", fetcher });

  await api.getReportDraftByChild("xiaoyu");

  expect(calls[0].url).toBe("/api/v1/children/xiaoyu/reports/current");
});
```

- [x] **Step 2: Run the targeted test and verify it passes**

Run:

```bash
npm test -- src/api/backendApi.test.ts
```

Expected: all `backendApi` tests pass.

- [x] **Step 3: Add production scripts**

Update `package.json` scripts to include:

```json
{
  "build:server": "VITE_API_MODE=backend VITE_API_BASE_URL=/api/v1 npm run build",
  "start:server": "cd backend && python3 -m app.server"
}
```

- [x] **Step 4: Verify production build command**

Run:

```bash
npm run build:server
```

Expected: `tsc -b && vite build` succeeds and `dist/index.html` exists.

- [x] **Step 5: Commit**

Run:

```bash
git add package.json src/api/backendApi.test.ts
git commit -m "chore: add same-origin server build scripts"
```

---

### Task 2: Serve Vite Static Files From The Python Backend

**Files:**
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/server.py`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_server_routes.py`

**Interfaces:**
- Consumes `SYMPHONY_STATIC_DIR`.
- Produces static responses for `GET /`, `GET /assets/*`, and SPA fallback routes.
- Keeps `GET /api/v1/health` unchanged.

- [x] **Step 1: Add static route tests**

Add imports to `backend/tests/test_server_routes.py`:

```python
import tempfile
from pathlib import Path
```

Add this test:

```python
def test_serves_static_index_and_spa_fallback(self):
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        (root / "index.html").write_text("<div id=\"root\"></div>", encoding="utf-8")
        with patch.dict(os.environ, {"SYMPHONY_STATIC_DIR": str(root)}):
            index_status, index_headers, index_body = server.dispatch_request("GET", "/")
            route_status, route_headers, route_body = server.dispatch_request("GET", "/child/xiaoyu/report")

    self.assertEqual(index_status, 200)
    self.assertEqual(index_headers["Content-Type"], "text/html; charset=utf-8")
    self.assertEqual(index_body, "<div id=\"root\"></div>")
    self.assertEqual(route_status, 200)
    self.assertEqual(route_headers["Content-Type"], "text/html; charset=utf-8")
    self.assertEqual(route_body, "<div id=\"root\"></div>")
```

Add this test:

```python
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
```

- [x] **Step 2: Run tests and verify the new tests fail**

Run:

```bash
cd backend && python3 -m unittest tests.test_server_routes.ServerRoutesTest.test_serves_static_index_and_spa_fallback tests.test_server_routes.ServerRoutesTest.test_serves_static_asset_with_content_type
```

Expected: both tests fail because static serving is not implemented yet.

- [x] **Step 3: Implement static dispatch**

In `backend/app/server.py`, add static handling after API route checks and before the final JSON 404:

```python
        if method == "GET":
            static_response = _static_response(path, headers)
            if static_response is not None:
                return static_response
```

Add helper functions:

```python
def _static_response(path: str, headers: dict[str, str]) -> tuple[int, dict[str, str], str] | None:
    static_root = os.environ.get("SYMPHONY_STATIC_DIR")
    if not static_root:
        return None
    root = Path(static_root).resolve()
    index_path = root / "index.html"
    if path == "/" or (not path.startswith(f"{API_PREFIX}/") and "." not in Path(path).name):
        return _read_static_file(index_path, headers)
    requested = (root / path.lstrip("/")).resolve()
    if root not in requested.parents and requested != root:
        return 403, _static_headers(headers, "text/plain; charset=utf-8"), "Forbidden"
    if not requested.is_file():
        return 404, _static_headers(headers, "text/plain; charset=utf-8"), "Not found"
    return _read_static_file(requested, headers)


def _read_static_file(file_path: Path, headers: dict[str, str]) -> tuple[int, dict[str, str], str]:
    if not file_path.is_file():
        return 404, _static_headers(headers, "text/plain; charset=utf-8"), "Not found"
    return 200, _static_headers(headers, _content_type(file_path)), file_path.read_text(encoding="utf-8")


def _static_headers(headers: dict[str, str], content_type: str) -> dict[str, str]:
    return {**headers, "Content-Type": content_type}


def _content_type(file_path: Path) -> str:
    suffix = file_path.suffix.lower()
    return {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
    }.get(suffix, "application/octet-stream")
```

Update `_RequestHandler._send_response` so it does not overwrite a static `Content-Type`:

```python
content_type = headers.get("Content-Type", "application/json; charset=utf-8")
self.send_header("Content-Type", content_type)
...
for key, value in headers.items():
    if key.lower() != "content-type":
        self.send_header(key, value)
```

- [x] **Step 4: Run backend tests**

Run:

```bash
cd backend && python3 -m unittest discover -s tests
```

Expected: 16 backend tests pass.

- [x] **Step 5: Run full verification**

Run:

```bash
npm run test:all
```

Expected: frontend tests, build, and backend tests pass.

- [x] **Step 6: Commit**

Run:

```bash
git add backend/app/server.py backend/tests/test_server_routes.py
git commit -m "feat: serve frontend from backend"
```

---

### Task 3: Add Server Deployment Artifacts

**Files:**
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/deploy/symphony-insight.service`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/deploy/cloudflared-symphony-ingress.yml`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/scripts/server-smoke-check.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/docs/server-deployment.md`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/README.md`

**Interfaces:**
- Produces reusable service template for `/home/data/xuyijie/symphony-insight`.
- Produces exact cloudflared ingress addition for `symphony.yjx.me`.
- Produces smoke check script that verifies local and public URLs without printing page bodies.

- [ ] **Step 1: Create systemd user service template**

Create `deploy/symphony-insight.service`:

```ini
[Unit]
Description=SymPhony Insight web app
After=network-online.target

[Service]
Type=simple
WorkingDirectory=/home/data/xuyijie/symphony-insight
EnvironmentFile=/home/data/xuyijie/symphony-insight/backend/.env.local
ExecStart=/usr/bin/env bash -lc 'npm run build:server && npm run start:server'
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

- [ ] **Step 2: Create cloudflared ingress addition**

Create `deploy/cloudflared-symphony-ingress.yml`:

```yaml
- hostname: symphony.yjx.me
  service: http://127.0.0.1:8090
```

- [ ] **Step 3: Create smoke check script**

Create `scripts/server-smoke-check.py`:

```python
from __future__ import annotations

import json
import sys
from urllib.request import Request, urlopen


def check(url: str) -> dict[str, object]:
    request = Request(url, headers={"User-Agent": "symphony-smoke-check"})
    with urlopen(request, timeout=10) as response:
        content_type = response.headers.get("content-type")
        body = response.read(512)
        preview = body.decode("utf-8", errors="replace")
        return {
            "url": url,
            "status": response.status,
            "content_type": content_type,
            "looks_like_health": "\"status\"" in preview and "\"ok\"" in preview,
            "looks_like_html": "<html" in preview.lower() or "<div id=\"root\"" in preview.lower(),
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
    failures = [item for item in results if item["status"] != 200]
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Create deployment documentation**

Create `docs/server-deployment.md` with:

```markdown
# Server Deployment

Production runs from `/home/data/xuyijie/symphony-insight` and is exposed at
`https://symphony.yjx.me` through cloudflared.

## Server Environment

Copy `backend/.env.example` to `backend/.env.local` on the server and set:

```env
SYMPHONY_BACKEND_HOST=127.0.0.1
SYMPHONY_BACKEND_PORT=8090
SYMPHONY_STATIC_DIR=/home/data/xuyijie/symphony-insight/dist
SYMPHONY_AI_PROVIDER_MODE=real
SYMPHONY_LLM_PROVIDER=deepseek
SYMPHONY_LLM_ENDPOINT=https://api.deepseek.com/chat/completions
SYMPHONY_LLM_API_KEY=...
SYMPHONY_LLM_MODEL=deepseek-v4-flash
SYMPHONY_CORS_ORIGINS=https://symphony.yjx.me,http://localhost:5173,http://127.0.0.1:5173
```

Never commit `backend/.env.local`.

## Deploy

```bash
cd /home/data/xuyijie
git clone https://github.com/symphony-insight/symphony-insight.github.io.git symphony-insight
cd symphony-insight
npm ci
npm run test:all
npm run build:server
npm run start:server
```

For user-level systemd:

```bash
mkdir -p ~/.config/systemd/user
cp deploy/symphony-insight.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now symphony-insight
systemctl --user status symphony-insight
```

For tmux fallback:

```bash
tmux new -ds symphony-insight 'cd /home/data/xuyijie/symphony-insight && npm run build:server && npm run start:server'
```

## Cloudflare Tunnel

Add this ingress entry to the existing tunnel used by `construction-rag.yjx.me`:

```yaml
- hostname: symphony.yjx.me
  service: http://127.0.0.1:8090
```

Then route DNS from the same config file:

```bash
CONFIG_FILE=$(find ~/.cloudflared /etc/cloudflared -maxdepth 2 -type f \( -name '*.yml' -o -name '*.yaml' -o -name 'config' \) 2>/dev/null | while read -r file; do grep -q 'construction-rag.yjx.me' "$file" && echo "$file" && break; done)
test -n "$CONFIG_FILE"
TUNNEL_ID=$(awk '/^tunnel:/{print $2; exit}' "$CONFIG_FILE")
test -n "$TUNNEL_ID"
cloudflared tunnel route dns "$TUNNEL_ID" symphony.yjx.me
```

## Verify

```bash
python3 scripts/server-smoke-check.py
```
```

- [ ] **Step 5: Link the server deployment doc from README**

Add one sentence to `README.md`:

```markdown
For production, deploy the same-origin server version at `symphony.yjx.me`; see `docs/server-deployment.md`.
```

- [ ] **Step 6: Run documentation and script checks**

Run:

```bash
python3 scripts/server-smoke-check.py http://127.0.0.1:9/
```

Expected: command exits non-zero because the smoke checker reports connection failure for a closed port.

- [ ] **Step 7: Commit**

Run:

```bash
git add deploy scripts/server-smoke-check.py docs/server-deployment.md README.md
git commit -m "docs: add server deployment artifacts"
```

---

### Task 4: Deploy On 3090x8 And Verify symphony.yjx.me

**Files:**
- Remote path: `/home/data/xuyijie/symphony-insight`
- Remote env: `/home/data/xuyijie/symphony-insight/backend/.env.local`
- Remote cloudflared config: existing `construction-rag.yjx.me` tunnel config on `3090x8`

**Interfaces:**
- Consumes GitHub remote `https://github.com/symphony-insight/symphony-insight.github.io.git`.
- Produces public service `https://symphony.yjx.me`.

- [ ] **Step 1: Enter the 3090x8 shell**

Use the VS Code Remote Tunnel terminal for machine `3090x8`, or an equivalent SSH shell. Verify:

```bash
hostname
whoami
pwd
mkdir -p /home/data/xuyijie
```

Expected: commands run on the remote server, not the local Mac.

- [ ] **Step 2: Clone or update the project**

Run:

```bash
cd /home/data/xuyijie
if [ -d symphony-insight/.git ]; then
  cd symphony-insight
  git fetch origin
  git checkout main
  git pull --ff-only origin main
else
  git clone https://github.com/symphony-insight/symphony-insight.github.io.git symphony-insight
  cd symphony-insight
fi
```

Expected: `/home/data/xuyijie/symphony-insight` contains the latest `main`.

- [ ] **Step 3: Configure backend secrets**

Run:

```bash
cp -n backend/.env.example backend/.env.local
chmod 600 backend/.env.local
```

Edit `backend/.env.local` so it contains real values:

```bash
python3 - <<'PY'
from pathlib import Path
path = Path("backend/.env.local")
values = {
    "SYMPHONY_BACKEND_HOST": "127.0.0.1",
    "SYMPHONY_BACKEND_PORT": "8090",
    "SYMPHONY_STATIC_DIR": "/home/data/xuyijie/symphony-insight/dist",
    "SYMPHONY_AI_PROVIDER_MODE": "real",
    "SYMPHONY_LLM_PROVIDER": "deepseek",
    "SYMPHONY_LLM_ENDPOINT": "https://api.deepseek.com/chat/completions",
    "SYMPHONY_LLM_MODEL": "deepseek-v4-flash",
    "SYMPHONY_CORS_ORIGINS": "https://symphony.yjx.me,http://localhost:5173,http://127.0.0.1:5173",
}
lines = path.read_text(encoding="utf-8").splitlines() if path.exists() else []
current = {}
for line in lines:
    if "=" in line and not line.lstrip().startswith("#"):
        key, value = line.split("=", 1)
        current[key] = value
current.update(values)
path.write_text("\n".join(f"{key}={value}" for key, value in current.items()) + "\n", encoding="utf-8")
PY
read -rsp 'DeepSeek key: ' SYMPHONY_KEY
printf '\n'
export SYMPHONY_KEY
python3 - <<'PY'
import os
from pathlib import Path
path = Path("backend/.env.local")
key = os.environ["SYMPHONY_KEY"]
lines = [line for line in path.read_text(encoding="utf-8").splitlines() if not line.startswith("SYMPHONY_LLM_API_KEY=")]
lines.append(f"SYMPHONY_LLM_API_KEY={key}")
path.write_text("\n".join(lines) + "\n", encoding="utf-8")
PY
unset SYMPHONY_KEY
```

Expected: `git status --short backend/.env.local` shows nothing because it is ignored.

- [ ] **Step 4: Install and verify on the server**

Run:

```bash
npm ci
npm run test:all
npm run build:server
```

Expected: tests pass and `dist/index.html` exists.

- [ ] **Step 5: Start the service**

Try user-level systemd:

```bash
mkdir -p ~/.config/systemd/user
cp deploy/symphony-insight.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now symphony-insight
systemctl --user status symphony-insight --no-pager
```

If user-level systemd is unavailable, use tmux:

```bash
tmux kill-session -t symphony-insight 2>/dev/null || true
tmux new -ds symphony-insight 'cd /home/data/xuyijie/symphony-insight && npm run start:server'
tmux capture-pane -pt symphony-insight -S -80
```

Expected: service listens on `127.0.0.1:8090`.

- [ ] **Step 6: Verify local server response**

Run:

```bash
python3 scripts/server-smoke-check.py \
  http://127.0.0.1:8090/ \
  http://127.0.0.1:8090/api/v1/health
```

Expected: both URLs return status `200`; root looks like HTML and health looks like JSON.

- [ ] **Step 7: Configure cloudflared**

Find existing tunnel config:

```bash
find ~/.cloudflared /etc/cloudflared -maxdepth 2 -type f \( -name '*.yml' -o -name '*.yaml' -o -name 'config' \) 2>/dev/null
```

Add ingress:

```yaml
- hostname: symphony.yjx.me
  service: http://127.0.0.1:8090
```

Route DNS from the same config file:

```bash
CONFIG_FILE=$(find ~/.cloudflared /etc/cloudflared -maxdepth 2 -type f \( -name '*.yml' -o -name '*.yaml' -o -name 'config' \) 2>/dev/null | while read -r file; do grep -q 'construction-rag.yjx.me' "$file" && echo "$file" && break; done)
test -n "$CONFIG_FILE"
TUNNEL_ID=$(awk '/^tunnel:/{print $2; exit}' "$CONFIG_FILE")
test -n "$TUNNEL_ID"
cloudflared tunnel route dns "$TUNNEL_ID" symphony.yjx.me
```

Restart cloudflared using whichever service currently runs the `construction-rag.yjx.me` tunnel.

- [ ] **Step 8: Verify public domain**

Run:

```bash
python3 scripts/server-smoke-check.py \
  https://symphony.yjx.me/ \
  https://symphony.yjx.me/api/v1/health
```

Expected: both URLs return status `200`.

- [ ] **Step 9: Verify report route and LLM path**

Open:

```text
https://symphony.yjx.me/#/child/xiaoyu/report
```

Click `重新整理草稿`. Expected:

- Page does not stay at `报告加载中`.
- Draft generation reaches `teacher_reviewing`.
- Backend logs show a report generation request.
- No DeepSeek key appears in browser source, network response, or built JS bundle.

- [ ] **Step 10: Final security check**

Run on the server:

```bash
cd /home/data/xuyijie/symphony-insight
rg -n "(sk-|SYMPHONY_LLM_API_KEY=.*[^.]|VITE_.*API_KEY|DEEPSEEK_API_KEY)" \
  -g '!node_modules' -g '!dist' -g '!backend/.env.local' .
```

Expected: only documentation redactions and tests are reported; no real key appears.
