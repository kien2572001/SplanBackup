FROM composer:2.3.5

WORKDIR /composer

COPY composer.json composer.lock ./

RUN composer install \
    --no-interaction \
    --ansi \
    --no-progress \
    --no-dev \
    --ignore-platform-reqs \
    --no-autoloader \
    --no-scripts

WORKDIR /srv/app

COPY . .

# Dump autoload & isolate autoload files so the vendor cache won't be invalidated next time
RUN ln -s /composer/vendor \
    && composer dump-autoload --optimize --no-dev --no-scripts \
    && rm vendor \
    && mkdir /composer-autoload \
    && mv /composer/vendor/autoload.php /composer/vendor/composer /composer-autoload
