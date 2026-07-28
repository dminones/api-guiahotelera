#!/bin/bash
# Force-restart the API under pm2 (Node managed via nvm).
# Usage: ./scripts/restart.sh
set -uo pipefail

# Load nvm so `pm2`/`node` resolve to the version pinned in .nvmrc (Node 16).
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm use >/dev/null 2>&1 || nvm use 16 >/dev/null

# reload = zero/low-downtime restart; fall back to a hard restart if the
# process isn't running under that name yet.
pm2 reload index || pm2 restart index || pm2 start index.js --name index
pm2 save
