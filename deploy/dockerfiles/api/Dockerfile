ARG REGISTRY_PATH
ARG TAG

#### PHP
FROM ${REGISTRY_PATH}/laravel-app:${TAG} as laravel

#### Web service (Nginx + PHP-FPM)
FROM ghcr.io/sun-asterisk-research/laravel-base:8.1-alpine3.16

ARG APPLICATION_ROOT=/srv/app/public

WORKDIR ${APPLICATION_ROOT}

COPY --from=laravel /composer/vendor vendor
COPY --from=laravel ${APPLICATION_ROOT} .
COPY --from=laravel /composer-autoload vendor

ENV APPLICATION_ROOT=${APPLICATION_ROOT}
