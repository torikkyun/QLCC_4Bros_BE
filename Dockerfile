FROM node:22-slim AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g yarn
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build

FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000

CMD ["yarn", "start:prod"]
