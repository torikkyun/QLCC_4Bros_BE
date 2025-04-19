#!/bin/sh

set -e

wait_for_postgres() {
  until pg_isready -h postgres -p 5432 -U postgres -d data_QLCC_4Bros_BE; do
    echo "Waiting for PostgreSQL to become available..."
    sleep 2
  done
}

if [ "$1" = "node" ]; then
  echo "Checking database connection..."
  wait_for_postgres

  echo "Running database migrations..."
  yarn drizzle-kit push:pg
fi

echo "Starting application..."
exec "$@"
