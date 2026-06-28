#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="symphony.yjx.me"
REFERENCE_DOMAIN="construction-rag.yjx.me"
SERVICE_URL="http://127.0.0.1:8090"

log() {
  printf '[symphony-cloudflared] %s\n' "$*"
}

find_config_file() {
  find "$HOME/.cloudflared" /etc/cloudflared -maxdepth 2 -type f \
    \( -name '*.yml' -o -name '*.yaml' -o -name 'config' \) 2>/dev/null |
    while read -r file; do
      if grep -q "$REFERENCE_DOMAIN" "$file"; then
        printf '%s\n' "$file"
        break
      fi
    done
}

write_config() {
  local config_file="$1"
  local temp_file
  temp_file="$(mktemp)"
  CONFIG_FILE="$config_file" python3 - <<'PY' >"$temp_file"
import os
from pathlib import Path

domain = "symphony.yjx.me"
service = "http://127.0.0.1:8090"
path = Path(os.environ["CONFIG_FILE"])
lines = path.read_text(encoding="utf-8").splitlines()

if any(domain in line for line in lines):
    print("\n".join(lines))
    raise SystemExit

entry = [f"  - hostname: {domain}", f"    service: {service}"]
insert_at = None
for index, line in enumerate(lines):
    if line.strip().startswith("- service: http_status:"):
        insert_at = index
        break

if insert_at is None:
    for index, line in enumerate(lines):
        if line.strip() == "ingress:":
            insert_at = index + 1
            break

if insert_at is None:
    raise SystemExit("Could not find ingress section in cloudflared config.")

updated = lines[:insert_at] + entry + lines[insert_at:]
print("\n".join(updated))
PY

  if [ -w "$config_file" ]; then
    cat "$temp_file" >"$config_file"
  else
    sudo tee "$config_file" <"$temp_file" >/dev/null
  fi
  rm -f "$temp_file"
}

route_dns() {
  local config_file="$1"
  local tunnel_id
  tunnel_id="$(awk '/^tunnel:/{print $2; exit}' "$config_file")"
  if [ -z "$tunnel_id" ]; then
    printf 'Could not find tunnel id in %s\n' "$config_file" >&2
    exit 1
  fi
  if ! cloudflared tunnel route dns "$tunnel_id" "$DOMAIN"; then
    log "DNS route command failed; continuing only if the route already exists in Cloudflare."
  fi
}

restart_cloudflared() {
  if command -v systemctl >/dev/null 2>&1 && systemctl list-units --type=service --all 2>/dev/null | grep -q 'cloudflared'; then
    log "Restarting system cloudflared service"
    sudo systemctl restart cloudflared
    sudo systemctl status cloudflared --no-pager
    return
  fi

  if command -v systemctl >/dev/null 2>&1 && systemctl --user list-units --type=service --all 2>/dev/null | grep -q 'cloudflared'; then
    log "Restarting user cloudflared service"
    systemctl --user restart cloudflared
    systemctl --user status cloudflared --no-pager
    return
  fi

  log "No cloudflared systemd unit detected. Restart the existing $REFERENCE_DOMAIN cloudflared process manually."
}

verify_public() {
  if [ -x /home/data/xuyijie/symphony-insight/scripts/server-smoke-check.py ]; then
    python3 /home/data/xuyijie/symphony-insight/scripts/server-smoke-check.py \
      "https://$DOMAIN/" \
      "https://$DOMAIN/api/v1/health"
  else
    log "Smoke checker not found; open https://$DOMAIN/ and https://$DOMAIN/api/v1/health manually."
  fi
}

main() {
  if ! command -v cloudflared >/dev/null 2>&1; then
    printf 'cloudflared is not installed or not on PATH.\n' >&2
    exit 1
  fi

  local config_file
  config_file="${1:-}"
  if [ -z "$config_file" ]; then
    config_file="$(find_config_file)"
  fi
  if [ -z "$config_file" ]; then
    printf 'Could not find a cloudflared config containing %s.\n' "$REFERENCE_DOMAIN" >&2
    exit 1
  fi

  log "Using cloudflared config: $config_file"
  write_config "$config_file"
  route_dns "$config_file"
  restart_cloudflared
  verify_public
}

main "$@"
