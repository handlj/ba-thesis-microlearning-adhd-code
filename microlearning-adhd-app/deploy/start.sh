#!/usr/bin/env bash
# Start one or all study conditions using deploy/hosts.conf.
#
# Usage:
#   ./deploy/start.sh A|B|C|all|status
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DEPLOY_DIR/lib.sh"

usage() {
  echo "Usage: $0 A|B|C|all|status" >&2
  exit 1
}

[[ $# -eq 1 ]] || usage

load_hosts_config
ensure_backend_ready
ensure_runtime_dirs

case "$1" in
  A|B|C)
    start_condition "$1"
    ;;
  all)
    for condition in "${CONDITIONS[@]}"; do
      start_condition "$condition"
    done
    echo ""
    echo "All conditions started."
    ;;
  status)
    echo "Deployment status:"
    print_status
    exit 0
    ;;
  *)
    usage
    ;;
esac

echo ""
print_status
