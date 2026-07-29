#!/bin/bash
# Poll GitHub for new commits on the tracked branch; deploy only if changed.
# Designed to run from cron every few minutes. Safe to run when nothing changed
# (it exits early and cheaply).
#
# Cron (every 3 minutes):
#   */3 * * * * /home/bitnami/projects/api-guiahotelera/scripts/auto-deploy.sh
set -uo pipefail

REPO_DIR=/home/bitnami/projects/api-guiahotelera
BRANCH=master
LOG=/home/bitnami/logs/auto-deploy.log

# Never prompt interactively (a stale host key etc. would hang forever in cron).
# BatchMode makes ssh fail fast instead, so it gets logged rather than blocking.
export GIT_SSH_COMMAND="ssh -o BatchMode=yes"

cd "$REPO_DIR" || exit 1
mkdir -p "$(dirname "$LOG")"

# Prevent overlapping runs (a slow deploy + fast cron interval would collide).
exec 9>/home/bitnami/logs/.auto-deploy.lock
flock -n 9 || exit 0   # another run holds the lock; skip this tick silently

# Only fetch remote metadata -- cheap, no working-tree changes.
git fetch origin "$BRANCH" --quiet || { echo "$(date) fetch failed" >> "$LOG"; exit 1; }

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

# Nothing new -> exit quietly (keeps the log clean).
[ "$LOCAL" = "$REMOTE" ] && exit 0

{
  echo "=== $(date) new commit detected: ${LOCAL:0:7} -> ${REMOTE:0:7} ==="
  # deploy.sh does the pull, install, build, and pm2 reload.
  ./scripts/deploy.sh
  echo "=== $(date) deploy finished (exit $?) ==="
} >> "$LOG" 2>&1
