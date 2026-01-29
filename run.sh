#!/bin/bash
php artisan optimize
php artisan config:clear
php artisan route:list
