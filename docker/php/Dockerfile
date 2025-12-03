FROM php:8.3-fpm

# Dependências básicas + libs necessárias para GD com JPEG, WebP e FreeType
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl gnupg ca-certificates \
    libpng-dev libjpeg-dev libfreetype6-dev libwebp-dev \
    libonig-dev libxml2-dev zlib1g-dev libzip-dev libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala PCOV para code coverage
RUN pecl install pcov && docker-php-ext-enable pcov
RUN pecl install redis && docker-php-ext-enable redis

# Configura GD com JPEG, FreeType e WebP antes de instalar
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instala Caddy sem GPG quebrado
RUN curl -LO https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_amd64.deb \
    && dpkg -i caddy_2.7.6_linux_amd64.deb \
    && rm caddy_2.7.6_linux_amd64.deb

# Configurações PHP e Caddy
COPY ./docker/php/custom-php.ini /usr/local/etc/php/conf.d/99-custom.ini
COPY ./docker/Caddyfile /etc/caddy/Caddyfile
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /var/www
ENTRYPOINT ["/entrypoint.sh"]
