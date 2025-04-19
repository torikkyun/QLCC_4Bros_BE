FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

RUN mkdir -p /tmp/node_modules && \
    cp -r node_modules/.bin/drizzle-kit /tmp/node_modules/.bin/drizzle-kit && \
    cp -r node_modules/drizzle-kit /tmp/node_modules/drizzle-kit && \
    cp -r node_modules/@drizzle-team /tmp/node_modules/@drizzle-team && \
    cp -r node_modules/@esbuild-kit /tmp/node_modules/@esbuild-kit && \
    cp -r node_modules/esbuild /tmp/node_modules/esbuild && \
    cp -r node_modules/esbuild-register /tmp/node_modules/esbuild-register

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /tmp/node_modules ./node_modules

COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/main"]
