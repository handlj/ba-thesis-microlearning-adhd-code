#!/usr/bin/env bash
# Start the study using deploy/hosts.conf.
#
# Usage:
#   ./deploy/start.sh [status]
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DEPLOY_DIR/lib.sh"

usage() {
  echo "Usage: $0 [status]" >&2
  exit 1
}

[[ $# -le 1 ]] || usage

load_hosts_config
ensure_backend_ready
ensure_runtime_dirs

case "${1:-}" in
  "")
    start
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
