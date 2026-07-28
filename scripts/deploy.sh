#!/bin/bash
# Deploy latest code: pull, install deps, build, restart under pm2.
# Usage: ./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

# Load nvm so we build/run with the pinned Node version (.nvmrc -> Node 16).
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm use >/dev/null 2>&1 || nvm use 16 >/dev/null

echo "=== node $(node --version) ==="

git reset --hard
git pull

# --jobs 1 keeps peak memory low on the 512MB instance.
npm ci --no-audit --no-fund --jobs 1
npm run build

pm2 reload index || pm2 restart index || pm2 start index.js --name index
pm2 save
