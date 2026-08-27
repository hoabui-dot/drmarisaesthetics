#!/bin/sh
set -eu

mkdir -p /opt/app/public/uploads /opt/app/.cache
chown -R node:node /opt/app/public/uploads /opt/app/.cache

exec su-exec node "$@"
