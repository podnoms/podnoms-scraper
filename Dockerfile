FROM node:12.13.0-alpine AS base
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

FROM base as build
RUN apk add --no-cache --virtual /tmp/.gyp \
    python \
    make \
    g++ \
    && npm config set scripts-prepend-node-path true \
    && yarn install --frozen-lockfile \
    && apk del /tmp/.gyp
COPY . .
RUN  yarn build

FROM base as release

RUN npm config set scripts-prepend-node-path true
RUN yarn install --production
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/views /usr/src/app/views
EXPOSE  3000
CMD yarn start
