#!/usr/bin/env bash

set -Eeuo pipefail

# Build the exact production image names declared by docker-compose.yml.
# Run from deployment/ (or invoke this file by absolute path). The script
# deliberately does not change image tags; docker-compose.yml is the source
# of truth for the current release tag.

DEPLOYMENT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${DEPLOYMENT_DIR}/.." && pwd)"
COMPOSE_FILE="${DEPLOYMENT_DIR}/docker-compose.yml"
STRAPI_ENV_FILE="${DEPLOYMENT_DIR}/drmaris-env/drmaris.production.strapi.env"
FRONTEND_ENV_FILE="${DEPLOYMENT_DIR}/drmaris-env/drmaris.production.frontend.env"

cd "${DEPLOYMENT_DIR}"

env_value() {
  local file="$1"
  local key="$2"
  awk -F= -v wanted_key="${key}" '$1 == wanted_key { sub(/^[^=]*=/, ""); print; exit }' "${file}"
}

required_env_value() {
  local file="$1"
  local key="$2"
  local value
  value="$(env_value "${file}" "${key}")"
  if [[ -z "${value}" ]]; then
    echo "Missing ${key} in ${file}" >&2
    exit 1
  fi
  printf '%s' "${value}"
}

for required_file in "${COMPOSE_FILE}" "${STRAPI_ENV_FILE}" "${FRONTEND_ENV_FILE}"; do
  if [[ ! -f "${required_file}" ]]; then
    echo "Missing required deployment file: ${required_file}" >&2
    exit 1
  fi
done

CMS_IMAGE="$(docker compose -f "${COMPOSE_FILE}" config --images | grep -m1 'drmaris_aesthetics_cms:')"
FRONTEND_IMAGE="$(docker compose -f "${COMPOSE_FILE}" config --images | grep -m1 'drmaris_aesthetics_frontend:')"

if [[ -z "${CMS_IMAGE}" || -z "${FRONTEND_IMAGE}" ]]; then
  echo "Could not resolve CMS/frontend image tags from ${COMPOSE_FILE}" >&2
  exit 1
fi

PUBLIC_URL="$(required_env_value "${STRAPI_ENV_FILE}" PUBLIC_URL)"
STRAPI_ADMIN_BACKEND_URL="$(env_value "${STRAPI_ENV_FILE}" STRAPI_ADMIN_BACKEND_URL)"
STRAPI_ADMIN_BACKEND_URL="${STRAPI_ADMIN_BACKEND_URL:-${PUBLIC_URL}}"

NEXT_PUBLIC_STRAPI_URL="$(required_env_value "${FRONTEND_ENV_FILE}" NEXT_PUBLIC_STRAPI_URL)"
NEXT_PUBLIC_STRAPI_API_TOKEN="$(required_env_value "${FRONTEND_ENV_FILE}" NEXT_PUBLIC_STRAPI_API_TOKEN)"
NEXT_PUBLIC_SERVER_URL="$(required_env_value "${FRONTEND_ENV_FILE}" NEXT_PUBLIC_SERVER_URL)"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="$(required_env_value "${FRONTEND_ENV_FILE}" NEXT_PUBLIC_RECAPTCHA_SITE_KEY)"
NEXT_PUBLIC_RECAPTCHA_ENABLED="$(required_env_value "${FRONTEND_ENV_FILE}" NEXT_PUBLIC_RECAPTCHA_ENABLED)"

echo "Building CMS image: ${CMS_IMAGE}"
docker build \
  --platform linux/amd64 \
  -f "${REPO_ROOT}/strapi-cms/Dockerfile" \
  -t "${CMS_IMAGE}" \
  --build-arg PUBLIC_URL="${PUBLIC_URL}" \
  --build-arg STRAPI_ADMIN_BACKEND_URL="${STRAPI_ADMIN_BACKEND_URL}" \
  "${REPO_ROOT}/strapi-cms"

echo "Building frontend image: ${FRONTEND_IMAGE}"
docker build \
  --platform linux/amd64 \
  -f "${REPO_ROOT}/dental-frontend/Dockerfile" \
  -t "${FRONTEND_IMAGE}" \
  --build-arg NEXT_PUBLIC_STRAPI_URL="${NEXT_PUBLIC_STRAPI_URL}" \
  --build-arg NEXT_PUBLIC_STRAPI_API_TOKEN="${NEXT_PUBLIC_STRAPI_API_TOKEN}" \
  --build-arg NEXT_PUBLIC_SERVER_URL="${NEXT_PUBLIC_SERVER_URL}" \
  --build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY="${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}" \
  --build-arg NEXT_PUBLIC_RECAPTCHA_ENABLED="${NEXT_PUBLIC_RECAPTCHA_ENABLED}" \
  "${REPO_ROOT}/dental-frontend"

if [[ "${PUSH_IMAGES:-0}" == "1" ]]; then
  echo "Pushing ${CMS_IMAGE}"
  docker push "${CMS_IMAGE}"
  echo "Pushing ${FRONTEND_IMAGE}"
  docker push "${FRONTEND_IMAGE}"
else
  echo "Images built locally. Set PUSH_IMAGES=1 to push the same compose tags to Docker Hub."
fi

echo "Production image build completed with tags unchanged."
