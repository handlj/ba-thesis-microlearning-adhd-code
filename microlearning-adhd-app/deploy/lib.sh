#!/usr/bin/env bash
# Shared helpers for deploy/*.sh — source this file, do not execute directly.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
MEDIA_DIR="$BACKEND_DIR/media"
DIST_DIR="$FRONTEND_DIR/dist"
RUN_DIR="$DEPLOY_DIR/run"
NGINX_TEMPLATE="$DEPLOY_DIR/nginx/condition.conf.template"
HOSTS_FILE="${HOSTS_FILE:-$DEPLOY_DIR/hosts.conf}"

VENV_PYTHON="$BACKEND_DIR/.venv/bin/python"
VENV_UVICORN="$BACKEND_DIR/.venv/bin/uvicorn"

# Backend listens only on loopback; nginx is the public entrypoint.
BACKEND_BIND_HOST="${BACKEND_BIND_HOST:-127.0.0.1}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

load_hosts_config() {
  if [[ ! -f "$HOSTS_FILE" ]]; then
    if [[ -f "$DEPLOY_DIR/hosts.conf.example" ]]; then
      cp "$DEPLOY_DIR/hosts.conf.example" "$HOSTS_FILE"
      echo "Created ${HOSTS_FILE} from example — review IP addresses and ports."
    else
      echo "Error: $HOSTS_FILE not found." >&2
      exit 1
    fi
  fi

  # shellcheck disable=SC1090
  source "$HOSTS_FILE"
}

detect_primary_ip() {
  if command -v hostname >/dev/null 2>&1; then
    local detected
    detected="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
    if [[ -n "$detected" ]]; then
      echo "$detected"
      return
    fi
  fi

  echo "127.0.0.1"
}

public_host() {
  if [[ -n "${SPARK_PUBLIC_IP:-}" ]]; then
    echo "$SPARK_PUBLIC_IP"
    return
  fi

  local bind_host="${BIND_HOST:-}"
  if [[ -n "$bind_host" && "$bind_host" != "0.0.0.0" && "$bind_host" != "::" ]]; then
    echo "$bind_host"
    return
  fi

  detect_primary_ip
}

frontend_origin() {
  echo "http://$(public_host):${FRONTEND_PORT:-}"
}

nginx_config_file() {
  echo "$RUN_DIR/nginx.conf"
}

pid_file_for() {
  local role="$1"
  echo "$RUN_DIR/${role}.pid"
}

log_file_for() {
  local role="$1"
  echo "$RUN_DIR/${role}.log"
}

ensure_runtime_dirs() {
  mkdir -p "$RUN_DIR"
}

ensure_backend_ready() {
  require_cmd python3
  require_cmd npm
  require_cmd nginx

  if [[ ! -d "$BACKEND_DIR/.venv" ]]; then
    echo "Creating backend virtual environment..."
    python3 -m venv "$BACKEND_DIR/.venv"
  fi

  if [[ ! -x "$VENV_UVICORN" ]]; then
    echo "Installing backend dependencies..."
    "$VENV_PYTHON" -m pip install -r "$BACKEND_DIR/requirements.txt"
  fi

  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    echo "Installing frontend dependencies..."
    (cd "$FRONTEND_DIR" && npm install)
  fi
}

build_frontend() {
  echo "Building frontend → ${DIST_DIR}"
  echo "  API: same-origin via nginx (/api → loopback backend)"

  (
    cd "$FRONTEND_DIR"
    npm run build
  )
}

nginx_listen_directive() {
  local bind_host="$1"
  local port="$2"
  if [[ "$bind_host" == "0.0.0.0" || "$bind_host" == "::" ]]; then
    echo "$port"
    return
  fi
  echo "${bind_host}:${port}"
}

sanitize_port() {
  local raw="$1"
  local cleaned
  cleaned="$(printf '%s' "$raw" | tr -cd '0-9')"
  if [[ -z "$cleaned" ]]; then
    echo "Error: invalid port value: ${raw}" >&2
    exit 1
  fi
  if [[ "$cleaned" != "$raw" ]]; then
    echo "Warning: cleaned port value '${raw}' → '${cleaned}'" >&2
  fi
  echo "$cleaned"
}

write_nginx_config() {
  local frontend_port backend_port config_path
  frontend_port="$(sanitize_port "${FRONTEND_PORT:-}")"
  backend_port="$(sanitize_port "${BACKEND_PORT:-}")"
  config_path="$(nginx_config_file)"

  local listen_directive error_log access_log pid_file
  listen_directive="$(nginx_listen_directive "$BIND_HOST" "$frontend_port")"
  error_log="$(log_file_for nginx-error)"
  access_log="$(log_file_for nginx-access)"
  pid_file="$(pid_file_for nginx)"

  sed \
    -e "s|{{LISTEN_DIRECTIVE}}|${listen_directive}|g" \
    -e "s|{{STATIC_ROOT}}|${DIST_DIR}|g" \
    -e "s|{{MEDIA_DIR}}|${MEDIA_DIR}|g" \
    -e "s|{{BACKEND_PORT}}|${backend_port}|g" \
    -e "s|{{ERROR_LOG}}|${error_log}|g" \
    -e "s|{{ACCESS_LOG}}|${access_log}|g" \
    -e "s|{{PID_FILE}}|${pid_file}|g" \
    "$NGINX_TEMPLATE" >"$config_path"
}

process_alive() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

read_pid() {
  local role="$1"
  local file
  file="$(pid_file_for "$role")"
  if [[ -f "$file" ]]; then
    cat "$file"
  fi
}

is_running() {
  local backend_pid nginx_pid
  backend_pid="$(read_pid backend || true)"
  nginx_pid="$(read_pid nginx || true)"

  process_alive "$backend_pid" && process_alive "$nginx_pid"
}

stop() {
  local role pid file

  for role in nginx backend; do
    file="$(pid_file_for "$role")"
    pid="$(read_pid "$role" || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "Stopping ${role} (pid ${pid})..."
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
    rm -f "$file"
  done

  rm -f "$(nginx_config_file)"
  rm -f "$(log_file_for nginx-error)"
}

start() {
  local frontend_port backend_port cors_origin

  if [[ -z "${BIND_HOST:-}" || -z "${FRONTEND_PORT:-}" || -z "${BACKEND_PORT:-}" ]]; then
    echo "Error: BIND_HOST, FRONTEND_PORT, or BACKEND_PORT is missing in ${HOSTS_FILE}" >&2
    exit 1
  fi

  frontend_port="$(sanitize_port "$FRONTEND_PORT")"
  backend_port="$(sanitize_port "$BACKEND_PORT")"
  cors_origin="$(frontend_origin)"

  if [[ ! -d "$DIST_DIR" ]]; then
    echo "Error: frontend build not found (${DIST_DIR})." >&2
    echo "  Run: ./deploy/setup.sh" >&2
    exit 1
  fi

  if is_running; then
    echo "Study is already running."
    return 0
  fi

  stop

  ensure_runtime_dirs
  write_nginx_config

  local backend_log nginx_log backend_pid_file nginx_pid_file nginx_config
  backend_log="$(log_file_for backend)"
  nginx_log="$(log_file_for nginx)"
  backend_pid_file="$(pid_file_for backend)"
  nginx_pid_file="$(pid_file_for nginx)"
  nginx_config="$(nginx_config_file)"

  echo "Starting study:"
  echo "  Participant URL: $(frontend_origin)"
  echo "  Backend:         http://${BACKEND_BIND_HOST}:${backend_port} (loopback only)"

  (
    cd "$BACKEND_DIR"
    STUDY_ENV=production \
    CORS_ORIGINS="$cors_origin" \
      nohup "$VENV_UVICORN" main:app \
        --host "$BACKEND_BIND_HOST" \
        --port "$backend_port" \
        >"$backend_log" 2>&1 &
    echo $! >"$backend_pid_file"
  )

  rm -f "$nginx_pid_file"
  if ! nginx -c "$nginx_config" >>"$nginx_log" 2>&1; then
    echo "Error: nginx failed to start." >&2
    echo "  See: $(log_file_for nginx-error)" >&2
    echo "  See: ${nginx_log}" >&2
    exit 1
  fi

  sleep 1

  if ! is_running; then
    local backend_pid nginx_pid
    backend_pid="$(read_pid backend || true)"
    nginx_pid="$(read_pid nginx || true)"
    echo "Error: failed to start the study." >&2
    if ! process_alive "$backend_pid"; then
      echo "  backend: not running (pid file: ${backend_pid:-empty})" >&2
      echo "  log: ${backend_log}" >&2
    fi
    if ! process_alive "$nginx_pid"; then
      echo "  nginx: not running (pid file: ${nginx_pid:-empty})" >&2
      echo "  log: ${nginx_log}" >&2
      echo "  error log: $(log_file_for nginx-error)" >&2
    fi
    exit 1
  fi

  echo "  → Running (logs in deploy/run/)"
}

print_status() {
  local origin backend_pid nginx_pid
  origin="$(frontend_origin)"
  backend_pid="$(read_pid backend || true)"
  nginx_pid="$(read_pid nginx || true)"

  if is_running; then
    echo "  UP   ${origin}  (API proxied internally)"
  else
    echo "  down ${origin}"
    if process_alive "$backend_pid"; then
      echo "       backend: up (pid ${backend_pid})"
    else
      echo "       backend: down (pid file: ${backend_pid:-empty})"
    fi
    if process_alive "$nginx_pid"; then
      echo "       nginx:   up (pid ${nginx_pid})"
    else
      echo "       nginx:   down (pid file: ${nginx_pid:-empty})"
    fi
  fi
}
