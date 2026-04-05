#!/bin/bash

#php artisan migrate
php artisan optimize:clear
php artisan optimize
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan route:list
