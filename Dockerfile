FROM node:current-alpine3.10 AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base as build
RUN apk add --no-cache --virtual /tmp/.gyp \
    python \
    make \
    g++

RUN npm config set scripts-prepend-node-path true \
    && yarn install --frozen-lockfile \
    && apk del /tmp/.gyp
COPY . .
RUN  yarn build

FROM base as release

RUN npm config set scripts-prepend-node-path true
RUN yarn install --production
COPY --from=build /app/dist /app/dist
COPY --from=build /app/views /app/views

EXPOSE  3000
RUN apk add --no-cache chromium

CMD yarn start
