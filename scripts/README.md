# Server scripts

Operational scripts for the Bitnami/Lightsail host. All assume Node is managed
via `nvm` and pinned to the version in `.nvmrc` (Node 16).

| Script | Purpose |
|---|---|
| `restart.sh` | Force-restart the API under pm2 (low-downtime `reload`). |
| `deploy.sh` | Pull latest code, install deps, build, restart. |
| `auto-deploy.sh` | Poll GitHub for new commits and run `deploy.sh` if changed (cron). |
| `renew-certificates.sh` | Renew TLS certs via lego; always restarts Apache. |

## Logs

All operational logs are written to a single directory outside the repos, so
they survive `git reset --hard` and aren't scattered:

```
/home/bitnami/logs/
├── auto-deploy.log          # deploy history (only written when a deploy runs)
└── renew-certificates.log   # cert renewal output + errors
```

Each script creates this directory (`mkdir -p`) if it doesn't exist -- no sudo
needed since it lives under the home dir. View with:

```bash
tail -f /home/bitnami/logs/auto-deploy.log
tail -n 50 /home/bitnami/logs/renew-certificates.log
```

## One-time pm2 setup (survives crashes AND reboots)

```bash
cd ~/projects/api-guiahotelera
pm2 start index.js --name index --max-memory-restart 300M
pm2 save
# Generate the boot hook (prints a sudo command -- run what it outputs):
pm2 startup systemd -u bitnami --hp /home/bitnami
pm2 save

# Rotate pm2 logs so they don't fill the disk:
pm2 install pm2-logrotate
```

- pm2 restarts the app automatically if it **crashes**.
- `--max-memory-restart 300M` restarts it if it leaks past 300 MB (important on
  a 512 MB instance) instead of being OOM-killed.
- The systemd hook restarts pm2 (and the app) after a **reboot**.

## Crontab

Install with `crontab -e`:

```cron
# Auto-deploy: check GitHub for new commits every 3 minutes, deploy if changed
*/3 * * * * /home/bitnami/projects/api-guiahotelera/scripts/auto-deploy.sh

# Renew TLS certs daily at 00:01 (only renews if near expiry; restarts Apache itself)
1 0 * * * /home/bitnami/projects/api-guiahotelera/scripts/renew-certificates.sh

# Daily Apache restart at 04:00 -- band-aid for gradual memory pressure on the 512MB box.
# See "Real fix" below; remove once memory is addressed.
0 4 * * * /opt/bitnami/ctlscript.sh restart apache >> /home/bitnami/logs/restart-apache.log 2>&1
```

> The `renew-certificates.sh` and `auto-deploy.sh` lines are bare (no `>>`
> redirect) because each script redirects its own output to `/home/bitnami/logs/`
> internally. The Apache restart line has no self-redirect, so it appends there
> explicitly.

> Replaces the previous three cron entries, which collided at `04:00` and mixed
> the OS `apache2` unit with Bitnami's `ctlscript` Apache.

## Real fix for the "restart makes it work again" symptom

The daily Apache restart masks **memory exhaustion** on the 512 MB instance. To
address the root cause:

- Ensure adequate swap (2 GB swap file) so spikes don't OOM-kill processes.
- Cap Apache worker count/memory (tune `MaxRequestWorkers` in the Bitnami Apache
  config) so it can't balloon.
- Cap the Node app with `--max-memory-restart` (above).
- Consider bumping the Lightsail instance to 1 GB RAM -- the most reliable fix.

Once memory is under control, the `04:00` restart cron can be removed.
