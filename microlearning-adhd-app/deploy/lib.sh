#!/usr/bin/env bash
# Shared helpers for deploy/*.sh — source this file, do not execute directly.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
RUN_DIR="$DEPLOY_DIR/run"
NGINX_TEMPLATE="$DEPLOY_DIR/nginx/condition.conf.template"
HOSTS_FILE="${HOSTS_FILE:-$DEPLOY_DIR/hosts.conf}"

VENV_PYTHON="$BACKEND_DIR/.venv/bin/python"
VENV_UVICORN="$BACKEND_DIR/.venv/bin/uvicorn"

# Backends listen only on loopback; nginx is the public entrypoint per condition.
BACKEND_BIND_HOST="${BACKEND_BIND_HOST:-127.0.0.1}"

CONDITIONS=(A B C)

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

condition_slug() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

condition_setting() {
  local condition="$1"
  local suffix="$2"
  local var="CONDITION_${condition}_${suffix}"
  echo "${!var:-}"
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

public_host_for() {
  local condition="$1"
  local per_condition
  per_condition="$(condition_setting "$condition" PUBLIC_HOST)"
  if [[ -n "$per_condition" ]]; then
    echo "$per_condition"
    return
  fi

  if [[ -n "${SPARK_PUBLIC_IP:-}" ]]; then
    echo "$SPARK_PUBLIC_IP"
    return
  fi

  local bind_host
  bind_host="$(condition_setting "$condition" BIND_HOST)"
  if [[ -n "$bind_host" && "$bind_host" != "0.0.0.0" && "$bind_host" != "::" ]]; then
    echo "$bind_host"
    return
  fi

  detect_primary_ip
}

frontend_origin_for() {
  local condition="$1"
  local public_host frontend_port
  public_host="$(public_host_for "$condition")"
  frontend_port="$(condition_setting "$condition" FRONTEND_PORT)"
  echo "http://${public_host}:${frontend_port}"
}

api_base_for() {
  # Same-origin: browser calls /api on the nginx frontend port; backend stays on loopback.
  echo ""
}

dist_dir_for() {
  local condition="$1"
  echo "dist-condition-$(condition_slug "$condition")"
}

nginx_config_for() {
  local condition="$1"
  echo "$RUN_DIR/nginx-condition-$(condition_slug "$condition").conf"
}

pid_file_for() {
  local condition="$1"
  local role="$2"
  echo "$RUN_DIR/condition-$(condition_slug "$condition")-${role}.pid"
}

log_file_for() {
  local condition="$1"
  local role="$2"
  echo "$RUN_DIR/condition-$(condition_slug "$condition")-${role}.log"
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

  local env_file="$BACKEND_DIR/.env"
  local env_example="$BACKEND_DIR/.env.example"
  if [[ ! -f "$env_file" && -f "$env_example" ]]; then
    echo "Creating backend/.env from .env.example..."
    cp "$env_example" "$env_file"
    echo "  → Edit backend/.env and add OPENAI_API_KEY for Socratic grading (Condition C)."
  fi

  local frontend_env="$FRONTEND_DIR/.env"
  local frontend_env_example="$FRONTEND_DIR/.env.example"
  if [[ ! -f "$frontend_env" && -f "$frontend_env_example" ]]; then
    echo "Creating frontend/.env from .env.example..."
    cp "$frontend_env_example" "$frontend_env"
    echo "  → Edit frontend/.env and add your Prolific completion URLs."
  fi
}

build_condition_frontend() {
  local condition="$1"
  local out_dir
  out_dir="$(dist_dir_for "$condition")"

  echo "Building frontend for condition ${condition} → ${FRONTEND_DIR}/${out_dir}"
  echo "  API: same-origin via nginx (/api → loopback backend)"

  (
    cd "$FRONTEND_DIR"
    VITE_STUDY_CONDITION="$condition" \
    VITE_API_BASE="" \
    npm run build -- --outDir "$out_dir"
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
  local condition="$1"
  local bind_host frontend_port backend_port out_dir config_path static_root
  bind_host="$(condition_setting "$condition" BIND_HOST)"
  frontend_port="$(sanitize_port "$(condition_setting "$condition" FRONTEND_PORT)")"
  backend_port="$(sanitize_port "$(condition_setting "$condition" BACKEND_PORT)")"
  out_dir="$(dist_dir_for "$condition")"
  config_path="$(nginx_config_for "$condition")"
  static_root="$FRONTEND_DIR/$out_dir"

  local listen_directive error_log access_log pid_file
  listen_directive="$(nginx_listen_directive "$bind_host" "$frontend_port")"
  error_log="$(log_file_for "$condition" nginx-error)"
  access_log="$(log_file_for "$condition" nginx-access)"
  pid_file="$(pid_file_for "$condition" nginx)"

  sed \
    -e "s|{{LISTEN_DIRECTIVE}}|${listen_directive}|g" \
    -e "s|{{STATIC_ROOT}}|${static_root}|g" \
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

is_condition_running() {
  local condition="$1"
  local backend_pid nginx_pid
  backend_pid="$(read_pid "$condition" backend || true)"
  nginx_pid="$(read_pid "$condition" nginx || true)"

  process_alive "$backend_pid" && process_alive "$nginx_pid"
}

read_pid() {
  local condition="$1"
  local role="$2"
  local file
  file="$(pid_file_for "$condition" "$role")"
  if [[ -f "$file" ]]; then
    cat "$file"
  fi
}

stop_condition() {
  local condition="$1"
  local role pid file

  for role in nginx backend; do
    file="$(pid_file_for "$condition" "$role")"
    pid="$(read_pid "$condition" "$role" || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "Stopping condition ${condition} ${role} (pid ${pid})..."
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
    rm -f "$file"
  done

  rm -f "$(nginx_config_for "$condition")"
  rm -f "$(log_file_for "$condition" nginx-error)"
}

start_condition() {
  local condition="$1"
  local bind_host frontend_port backend_port cors_origin out_dir
  bind_host="$(condition_setting "$condition" BIND_HOST)"
  frontend_port="$(sanitize_port "$(condition_setting "$condition" FRONTEND_PORT)")"
  backend_port="$(sanitize_port "$(condition_setting "$condition" BACKEND_PORT)")"
  cors_origin="$(frontend_origin_for "$condition")"
  out_dir="$(dist_dir_for "$condition")"

  if [[ -z "$bind_host" || -z "$frontend_port" || -z "$backend_port" ]]; then
    echo "Error: condition ${condition} is missing BIND_HOST, FRONTEND_PORT, or BACKEND_PORT in ${HOSTS_FILE}" >&2
    exit 1
  fi

  if [[ ! -d "$FRONTEND_DIR/$out_dir" ]]; then
    echo "Error: frontend build not found for condition ${condition} (${FRONTEND_DIR}/${out_dir})." >&2
    echo "  Run: ./deploy/setup.sh" >&2
    exit 1
  fi

  if is_condition_running "$condition"; then
    echo "Condition ${condition} is already running."
    return 0
  fi

  stop_condition "$condition"

  ensure_runtime_dirs
  write_nginx_config "$condition"

  local backend_log nginx_log backend_pid_file nginx_pid_file nginx_config
  backend_log="$(log_file_for "$condition" backend)"
  nginx_log="$(log_file_for "$condition" nginx)"
  backend_pid_file="$(pid_file_for "$condition" backend)"
  nginx_pid_file="$(pid_file_for "$condition" nginx)"
  nginx_config="$(nginx_config_for "$condition")"

  echo "Starting condition ${condition}:"
  echo "  Participant URL: $(frontend_origin_for "$condition")"
  echo "  Backend:         http://${BACKEND_BIND_HOST}:${backend_port} (loopback only)"

  (
    cd "$BACKEND_DIR"
    CORS_ORIGINS="$cors_origin" \
      nohup "$VENV_UVICORN" main:app \
        --host "$BACKEND_BIND_HOST" \
        --port "$backend_port" \
        >"$backend_log" 2>&1 &
    echo $! >"$backend_pid_file"
  )

  rm -f "$nginx_pid_file"
  if ! nginx -c "$nginx_config" >>"$nginx_log" 2>&1; then
    echo "Error: nginx failed to start for condition ${condition}." >&2
    echo "  See: $(log_file_for "$condition" nginx-error)" >&2
    echo "  See: ${nginx_log}" >&2
    exit 1
  fi

  sleep 1

  if ! is_condition_running "$condition"; then
    local backend_pid nginx_pid
    backend_pid="$(read_pid "$condition" backend || true)"
    nginx_pid="$(read_pid "$condition" nginx || true)"
    echo "Error: failed to start condition ${condition}." >&2
    if ! process_alive "$backend_pid"; then
      echo "  backend: not running (pid file: ${backend_pid:-empty})" >&2
      echo "  log: ${backend_log}" >&2
    fi
    if ! process_alive "$nginx_pid"; then
      echo "  nginx: not running (pid file: ${nginx_pid:-empty})" >&2
      echo "  log: ${nginx_log}" >&2
      echo "  error log: $(log_file_for "$condition" nginx-error)" >&2
    fi
    exit 1
  fi

  echo "  → Running (logs in deploy/run/)"
}

print_status() {
  local condition origin backend_pid nginx_pid
  for condition in "${CONDITIONS[@]}"; do
    origin="$(frontend_origin_for "$condition")"
    backend_pid="$(read_pid "$condition" backend || true)"
    nginx_pid="$(read_pid "$condition" nginx || true)"

    if is_condition_running "$condition"; then
      echo "  ${condition}: UP   ${origin}  (API proxied internally)"
    else
      echo "  ${condition}: down ${origin}"
      if process_alive "$backend_pid"; then
        echo "           backend: up (pid ${backend_pid})"
      else
        echo "           backend: down (pid file: ${backend_pid:-empty})"
      fi
      if process_alive "$nginx_pid"; then
        echo "           nginx:   up (pid ${nginx_pid})"
      else
        echo "           nginx:   down (pid file: ${nginx_pid:-empty})"
      fi
    fi
  done
}
