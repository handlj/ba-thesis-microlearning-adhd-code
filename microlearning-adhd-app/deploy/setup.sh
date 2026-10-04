#!/usr/bin/env bash
# First-time setup on a deployment host (e.g. NVIDIA DGX Spark).
# Installs dependencies and builds the production frontend bundle.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DEPLOY_DIR/lib.sh"

load_hosts_config
ensure_backend_ready
ensure_runtime_dirs

echo ""
echo "Building production frontend..."
build_frontend

echo ""
echo "Setup complete."
echo ""
echo "Next steps:"
echo "  1. If you have not yet, set SPARK_PUBLIC_IP / ports in deploy/hosts.conf"
echo "  2. Start the study:  ./deploy/start.sh"
echo "  3. Check status:     ./deploy/start.sh status"
echo "  4. Stop:             ./deploy/stop.sh"
echo ""
print_status
