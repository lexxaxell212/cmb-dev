#!/usr/bin/env bash
set -euo pipefail

# Build + deploy coffee frontends into /var/www (nginx web roots)
# Usage: sudo bash deploy.sh   (needs write access to /var/www)

cd "$(dirname "$0")/.."

echo "== building coffee web =="
(cd web && npm run build >/dev/null)
sudo mkdir -p /var/www/coffee-web.dzfee.id
sudo cp -r web/dist /var/www/coffee-web.dzfee.id/dist
sudo chown -R www-data:www-data /var/www/coffee-web.dzfee.id

echo "== building coffee admin =="
(cd admin && npm run build >/dev/null)
sudo mkdir -p /var/www/coffee-admin.dzfee.id
sudo cp -r admin/dist /var/www/coffee-admin.dzfee.id/dist
sudo chown -R www-data:www-data /var/www/coffee-admin.dzfee.id

echo "== done =="