# Server Deployment

Production runs from `/home/data/xuyijie/symphony-insight` and is exposed at `https://symphony.yjx.me` through cloudflared.

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

On the `3090x8` server, the preferred path is:

```bash
cd /home/data/xuyijie/symphony-insight
bash scripts/deploy-remote-server.sh
bash scripts/configure-cloudflared-symphony.sh
```

If the repository is not cloned yet, use the manual bootstrap below.

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
systemctl --user status symphony-insight --no-pager
```

For tmux fallback:

```bash
tmux new -ds symphony-insight 'cd /home/data/xuyijie/symphony-insight && npm run build:server && npm run start:server'
```

## Cloudflare Tunnel

Find the existing tunnel config that serves `construction-rag.yjx.me`:

```bash
CONFIG_FILE=$(find ~/.cloudflared /etc/cloudflared -maxdepth 2 -type f \( -name '*.yml' -o -name '*.yaml' -o -name 'config' \) 2>/dev/null | while read -r file; do grep -q 'construction-rag.yjx.me' "$file" && echo "$file" && break; done)
test -n "$CONFIG_FILE"
```

Add this ingress entry before the final catch-all rule:

```yaml
- hostname: symphony.yjx.me
  service: http://127.0.0.1:8090
```

Then route DNS through the same tunnel:

```bash
TUNNEL_ID=$(awk '/^tunnel:/{print $2; exit}' "$CONFIG_FILE")
test -n "$TUNNEL_ID"
cloudflared tunnel route dns "$TUNNEL_ID" symphony.yjx.me
```

Restart the cloudflared service that currently serves `construction-rag.yjx.me`.

## Verify

```bash
python3 scripts/server-smoke-check.py
```
