#!/usr/bin/env bash
# Stop the backend and nginx started by deploy/start.sh.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DEPLOY_DIR/lib.sh"

load_hosts_config
ensure_runtime_dirs

stop

echo "All deployment processes stopped."
