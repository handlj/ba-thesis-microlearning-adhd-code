#!/usr/bin/env bash
# First-time setup on a deployment host (e.g. NVIDIA DGX Spark).
# Installs dependencies and builds one production frontend bundle per condition.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DEPLOY_DIR/lib.sh"

load_hosts_config
ensure_backend_ready
ensure_runtime_dirs

echo ""
echo "Building production frontends (one locked bundle per condition)..."
for condition in "${CONDITIONS[@]}"; do
  build_condition_frontend "$condition"
done

echo ""
echo "Setup complete."
echo ""
echo "Next steps:"
echo "  1. If you have not yet, set SPARK_PUBLIC_IP / ports in deploy/hosts.conf"
echo "  2. Edit backend/.env (OPENAI_API_KEY required for Condition C grading)"
echo "  3. Edit frontend/.env (Prolific completion URLs — then re-run ./deploy/setup.sh)"
echo "  4. Start all conditions:  ./deploy/start.sh all"
echo "     Or one condition:      ./deploy/start.sh A"
echo "  5. Check status:           ./deploy/start.sh status"
echo "  6. Stop:                   ./deploy/stop.sh"
echo ""
print_status
