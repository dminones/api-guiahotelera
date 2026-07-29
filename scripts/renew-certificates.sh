#!/bin/bash
# Renew TLS certificates via lego and restart Apache.
# lego only renews certs within 30 days of expiry, so this is safe to run daily.
# Apache's server.crt/server.key are symlinks into /etc/lego/certificates/,
# which lego updates in place -- no need to move/relink files each run.
#
# Intended to run from cron:
#   1 0 * * * /home/bitnami/projects/api-guiahotelera/scripts/renew-certificates.sh
set -uo pipefail

LOG=/home/bitnami/logs/renew-certificates.log
mkdir -p "$(dirname "$LOG")"
exec >> "$LOG" 2>&1
echo "=== $(date) cert renewal ==="

# Guarantee Apache comes back up no matter how this script exits (renew failure,
# network error, etc). This is the key resilience property.
trap 'sudo /opt/bitnami/ctlscript.sh start apache' EXIT

# lego needs port 80 free for the HTTP-01 challenge.
sudo /opt/bitnami/ctlscript.sh stop apache

sudo lego --email="info@guiahoteleraargentina.com" \
  --domains="guiahoteleraargentina.com" \
  --domains="www.guiahoteleraargentina.com" \
  --domains="api.guiahoteleraargentina.com" \
  --domains="www.guiahotelerabolivia.com" \
  --domains="guiahotelerabolivia.com" \
  --domains="imagenes.guiahoteleraargentina.com" \
  --domains="imagenes.guiahotelerabolivia.com" \
  --path="/etc/lego" renew
