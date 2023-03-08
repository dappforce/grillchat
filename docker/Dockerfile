FROM node:18-slim as builder

ARG GH_SERVER_MNEMONIC
ARG GH_CAPTCHA_SECRET
ARG GH_NEXT_PUBLIC_CAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_CAPTCHA_SITE_KEY=${GH_NEXT_PUBLIC_CAPTCHA_SITE_KEY} \
    CAPTCHA_SECRET=${GH_CAPTCHA_SECRET} \
    SERVER_MNEMONIC=${GH_SERVER_MNEMONIC}

COPY . /opt/subsocial/app

WORKDIR /opt/subsocial/app

RUN set -x \
    && mv ci.env .env \
    && yarn install && \
    yarn build

ENTRYPOINT [ "yarn", "start" ]
