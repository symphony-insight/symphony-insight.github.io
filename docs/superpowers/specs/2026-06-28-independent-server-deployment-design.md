# SymPhony Insight 独立服务器部署设计

## 背景

GitHub Pages 只能托管静态文件，不能安全运行后端，也不能保存 DeepSeek API key。当前项目已经有 Vite 前端、Python 后端和 DeepSeek provider，但 Pages 只能运行 mock 或调用外部后端。为了让平台完整工作，需要把前端静态文件和后端 API 放到同一台服务器上，通过 `symphony.yjx.me` 统一访问。

目标服务器通过 VS Code Tunnel 暴露，机器名为 `3090x8`。项目最终放在服务器 `/home/data/xuyijie/symphony-insight`。域名使用 Cloudflare Tunnel，对已有 `construction-rag.yjx.me` 的配置方式进行复用，不把 DeepSeek key 写入前端、GitHub Actions 或仓库文件。

## 目标架构

```text
用户浏览器
  -> https://symphony.yjx.me
  -> Cloudflare DNS
  -> cloudflared tunnel
  -> 服务器 127.0.0.1:8090
  -> SymPhony Python 服务
       - /api/v1/* 返回后端 JSON
       - /* 返回 Vite build 后的前端静态文件
       - #/child/xiaoyu/report 等 hash route 由前端接管
       - DeepSeek key 只从服务器环境变量读取
```

这个方案把前后端部署为“同源应用”：浏览器只访问 `https://symphony.yjx.me`，前端 API base 使用 `/api/v1`，不再需要 GitHub Pages，也不需要跨域 CORS 作为主路径。CORS 仍保留本地开发源，方便 `localhost:5173` 调试。

## 运行时边界

- 前端：继续使用 Vite + React，生产构建时设置 `VITE_API_MODE=backend` 和 `VITE_API_BASE_URL=/api/v1`。
- 后端：继续使用现有 Python 标准库 HTTP server 和 DeepSeek adapter；增加静态文件服务和 SPA fallback。
- 进程端口：后端生产端口固定为 `127.0.0.1:8090`，不直接暴露公网端口。
- 域名入口：`symphony.yjx.me` 由 cloudflared ingress 指到 `http://127.0.0.1:8090`。
- 项目路径：服务器上使用 `/home/data/xuyijie/symphony-insight`。
- 密钥：服务器本地 `.env.local` 保存 `SYMPHONY_LLM_API_KEY`，`.env.local` 必须被 `.gitignore` 忽略。

## 代码改动设计

### 后端静态文件服务

当前 `backend/app/server.py` 只返回 API JSON。需要扩展请求分发：

- `GET /api/v1/*` 保持现有 API 行为。
- `GET /assets/*` 从 `SYMPHONY_STATIC_DIR/assets` 读取文件。
- `GET /` 返回 `SYMPHONY_STATIC_DIR/index.html`。
- 其他非 API GET 路径返回 `index.html`，支持前端路由刷新。
- 未找到的静态资源返回 404，不返回 API JSON。
- 静态响应应设置基本 `Content-Type`：`text/html`、`text/css`、`application/javascript`、`font/woff2`、`image/*`。

### 生产构建配置

新增脚本：

```bash
npm run build:server
```

它等价于：

```bash
VITE_API_MODE=backend VITE_API_BASE_URL=/api/v1 npm run build
```

新增启动脚本：

```bash
npm run start:server
```

它等价于：

```bash
cd backend && python3 -m app.server
```

服务器 `.env.local` 中至少包含：

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

### 服务器进程管理

优先使用用户级 systemd，因为它比 tmux 更适合长期服务：

```text
~/.config/systemd/user/symphony-insight.service
```

服务工作目录：

```text
/home/data/xuyijie/symphony-insight
```

启动命令：

```bash
/usr/bin/env bash -lc 'npm run build:server && npm run start:server'
```

如果服务器不支持 user systemd，则退回 tmux：

```bash
tmux new -ds symphony-insight 'cd /home/data/xuyijie/symphony-insight && npm run build:server && npm run start:server'
```

不使用 GitHub Pages 部署工作流作为生产入口。GitHub Actions 可以保留测试，但发布以服务器拉取代码、构建、重启服务为准。

## Cloudflare Tunnel 设计

如果服务器已有 `construction-rag.yjx.me` 的 cloudflared tunnel，复用同一个 tunnel。保留原有 `construction-rag.yjx.me` ingress 条目，只新增：

```yaml
- hostname: symphony.yjx.me
  service: http://127.0.0.1:8090
```

如果 `symphony.yjx.me` 还没有 DNS route，需要执行：

```bash
CONFIG_FILE=$(find ~/.cloudflared /etc/cloudflared -maxdepth 2 -type f \( -name '*.yml' -o -name '*.yaml' -o -name 'config' \) 2>/dev/null | while read -r file; do grep -q 'construction-rag.yjx.me' "$file" && echo "$file" && break; done)
test -n "$CONFIG_FILE"
TUNNEL_ID=$(awk '/^tunnel:/{print $2; exit}' "$CONFIG_FILE")
test -n "$TUNNEL_ID"
cloudflared tunnel route dns "$TUNNEL_ID" symphony.yjx.me
```

如果已有 tunnel 是 systemd 服务，修改配置后重启 cloudflared：

```bash
sudo systemctl restart cloudflared
```

如果是用户级服务，则使用：

```bash
systemctl --user restart cloudflared
```

## 部署流程

1. 在服务器创建目录：

```bash
mkdir -p /home/data/xuyijie
cd /home/data/xuyijie
```

2. 获取代码：

```bash
git clone https://github.com/symphony-insight/symphony-insight.github.io.git symphony-insight
cd symphony-insight
```

如果目录已存在：

```bash
cd /home/data/xuyijie/symphony-insight
git fetch origin
git checkout main
git pull --ff-only origin main
```

3. 安装依赖并验证：

```bash
npm ci
npm run test:all
```

4. 配置后端环境：

```bash
cp backend/.env.example backend/.env.local
```

手动填写真实 `SYMPHONY_LLM_API_KEY`，不要提交。

5. 构建并启动：

```bash
npm run build:server
npm run start:server
```

6. 本机验证：

```bash
python3 - <<'PY'
import json, urllib.request
print(urllib.request.urlopen("http://127.0.0.1:8090/api/v1/health", timeout=5).read().decode())
print(urllib.request.urlopen("http://127.0.0.1:8090/", timeout=5).status)
PY
```

7. 域名验证：

```bash
python3 - <<'PY'
import urllib.request
print(urllib.request.urlopen("https://symphony.yjx.me", timeout=10).status)
print(urllib.request.urlopen("https://symphony.yjx.me/api/v1/health", timeout=10).read().decode())
PY
```

## 安全约束

- 禁止把 `SYMPHONY_LLM_API_KEY`、DeepSeek key 或其他 provider key 写入 `VITE_*` 环境变量。
- 禁止把 `.env.local` 上传到 Git。
- 浏览器只允许看到 `/api/v1` 这样的相对 API 路径。
- LLM 仍然只负责报告草稿和语言整理，不参与 rubric 评分。
- 后端输出继续保留“不做诊断/疗效判断”的边界。
- 若 cloudflared 配置里包含 credential file 路径或 token，只在服务器本机保留，不写入仓库。

## 验收标准

- 服务器 `/home/data/xuyijie/symphony-insight` 存在项目文件。
- `npm run test:all` 在服务器通过。
- `http://127.0.0.1:8090/` 返回前端页面。
- `http://127.0.0.1:8090/api/v1/health` 返回 `status: ok`。
- `https://symphony.yjx.me/` 返回前端页面。
- `https://symphony.yjx.me/api/v1/health` 返回后端健康检查。
- 打开 `https://symphony.yjx.me/#/child/xiaoyu/report` 后，活动报告页能加载。
- 点击“重新整理草稿”时，后端在 `real` 模式下调用 DeepSeek；在 `mock` 模式下返回确定性草稿。
- 仓库搜索不到真实 API key。

## 当前阻塞项

当前本地 Codex 不能直接进入 `3090x8`：

- `ssh 3090x8` 无法解析主机名。
- Codex 项目列表没有暴露 `3090x8` 远程项目。
- 本机 `code tunnel` 命令只能把当前机器注册成 tunnel，不能从命令行进入另一台 tunnel 机器。

需要在 VS Code Remote Tunnel 的 `3090x8` 窗口中运行 Codex，或提供等价 SSH/网页终端入口。拿到远端 shell 后，按本设计实施。
