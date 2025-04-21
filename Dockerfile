FROM node:22-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile && \
    yarn build

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/main"]
