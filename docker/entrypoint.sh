#!/bin/bash

# Start PHP-FPM em background
php-fpm -D

# Start Caddy em foreground na porta 80
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile