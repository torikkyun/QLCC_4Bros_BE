# Quản lý chung cư (nhóm 4Bros) (Back-end)

## Setup dự án

```bash
$ yarn
$ cp .env.sample .env
```

## Chạy dự án

```bash
$ yarn run start:dev
```

## Deploy production

Cập nhật lại URL database trong file .env

```
# localhost thành postgres
DATABASE_URL=postgres://postgres:postgres@postgres:5433/data_QLCC_4Bros_BE?sslmode=disable
```

```bash
docker-compose up -d --build
```
