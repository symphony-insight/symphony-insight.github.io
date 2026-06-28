#!/usr/bin/env bash
set -Eeuo pipefail

APP_ROOT="/home/data/xuyijie/symphony-insight"
APP_PARENT="/home/data/xuyijie"
REPO_URL="https://github.com/symphony-insight/symphony-insight.github.io.git"
ENV_FILE="$APP_ROOT/backend/.env.local"

log() {
  printf '[symphony-deploy] %s\n' "$*"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  fi
}

ensure_repo() {
  mkdir -p "$APP_PARENT"
  if [ -d "$APP_ROOT/.git" ]; then
    log "Updating existing repo at $APP_ROOT"
    git -C "$APP_ROOT" fetch origin
    git -C "$APP_ROOT" checkout main
    git -C "$APP_ROOT" pull --ff-only origin main
  else
    log "Cloning repo to $APP_ROOT"
    git clone "$REPO_URL" "$APP_ROOT"
  fi
}

ensure_env_file() {
  cd "$APP_ROOT"
  cp -n backend/.env.example "$ENV_FILE"
  chmod 600 "$ENV_FILE"

  python3 - <<'PY'
from pathlib import Path

path = Path("/home/data/xuyijie/symphony-insight/backend/.env.local")
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

current = {}
if path.exists():
    for line in path.read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            current[key] = value
current.update(values)
path.write_text("\n".join(f"{key}={value}" for key, value in current.items()) + "\n", encoding="utf-8")
PY

  if ! grep -q '^SYMPHONY_LLM_API_KEY=.\+' "$ENV_FILE"; then
    if [ -n "${SYMPHONY_LLM_API_KEY:-}" ]; then
      log "Writing DeepSeek key from SYMPHONY_LLM_API_KEY environment variable"
      python3 - <<'PY'
import os
from pathlib import Path

path = Path("/home/data/xuyijie/symphony-insight/backend/.env.local")
lines = [line for line in path.read_text(encoding="utf-8").splitlines() if not line.startswith("SYMPHONY_LLM_API_KEY=")]
lines.append(f"SYMPHONY_LLM_API_KEY={os.environ['SYMPHONY_LLM_API_KEY']}")
path.write_text("\n".join(lines) + "\n", encoding="utf-8")
PY
    else
      read -rsp 'DeepSeek key for backend/.env.local: ' entered_key
      printf '\n'
      export entered_key
      python3 - <<'PY'
import os
from pathlib import Path

path = Path("/home/data/xuyijie/symphony-insight/backend/.env.local")
lines = [line for line in path.read_text(encoding="utf-8").splitlines() if not line.startswith("SYMPHONY_LLM_API_KEY=")]
lines.append(f"SYMPHONY_LLM_API_KEY={os.environ['entered_key']}")
path.write_text("\n".join(lines) + "\n", encoding="utf-8")
PY
      unset entered_key
    fi
  fi

  if git -C "$APP_ROOT" status --short -- backend/.env.local | grep -q .; then
    printf 'backend/.env.local is not ignored; refusing to continue.\n' >&2
    exit 1
  fi
}

install_and_build() {
  cd "$APP_ROOT"
  npm ci
  npm run test:all
  npm run build:server
}

start_service() {
  cd "$APP_ROOT"
  if command -v systemctl >/dev/null 2>&1 && systemctl --user list-units >/dev/null 2>&1; then
    log "Starting user-level systemd service"
    mkdir -p "$HOME/.config/systemd/user"
    cp deploy/symphony-insight.service "$HOME/.config/systemd/user/"
    systemctl --user daemon-reload
    systemctl --user enable symphony-insight
    systemctl --user restart symphony-insight
    systemctl --user status symphony-insight --no-pager
  else
    require_cmd tmux
    log "Starting tmux fallback service"
    tmux kill-session -t symphony-insight 2>/dev/null || true
    tmux new -ds symphony-insight "cd $APP_ROOT && npm run start:server"
    sleep 2
    tmux capture-pane -pt symphony-insight -S -80
  fi
}

verify_local() {
  cd "$APP_ROOT"
  python3 scripts/server-smoke-check.py \
    http://127.0.0.1:8090/ \
    http://127.0.0.1:8090/api/v1/health
}

main() {
  require_cmd git
  require_cmd npm
  require_cmd python3
  ensure_repo
  ensure_env_file
  install_and_build
  start_service
  verify_local
  log "Local server is ready at http://127.0.0.1:8090. Next run scripts/configure-cloudflared-symphony.sh."
}

main "$@"
