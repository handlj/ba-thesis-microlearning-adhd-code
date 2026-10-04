#!/usr/bin/env bash
# Stop all condition backends/frontends started by deploy/start.sh.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DEPLOY_DIR/lib.sh"

load_hosts_config
ensure_runtime_dirs

for condition in "${CONDITIONS[@]}"; do
  stop_condition "$condition"
done

echo "All deployment processes stopped."
