FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/node_modules/.bin/drizzle-kit ./node_modules/.bin/drizzle-kit
COPY --from=builder /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY --from=builder /app/node_modules/@drizzle-team ./node_modules/@drizzle-team
COPY --from=builder /app/node_modules/@esbuild-kit ./node_modules/@esbuild-kit
COPY --from=builder /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=builder /app/node_modules/esbuild-register ./node_modules/esbuild-register

COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/main"]
