#!/bin/bash
set -e

# Gera APP_KEY se não estiver definida
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    php artisan key:generate --force
fi

# Aguarda banco ficar pronto
echo "Aguardando banco de dados..."
until php artisan db:show --json > /dev/null 2>&1; do
    sleep 1
done
echo "Banco de dados pronto."

# Migrations + cache de configuração
php artisan migrate --force --no-interaction
php artisan config:cache
php artisan route:cache

# Start PHP-FPM em background
php-fpm -D

# Start Caddy em foreground na porta 80
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
