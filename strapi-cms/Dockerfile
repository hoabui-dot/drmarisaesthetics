# ============================================
# Multi-Stage Dockerfile for Strapi CMS v5
# ============================================
#
# Optimized for production deployment.
# Uses multi-stage builds for minimal image size.
# ============================================

# ============================================
# Stage 1: Build
# ============================================
FROM node:22-alpine AS build

# Install native dependencies required by Strapi plugins
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    postgresql16-client > /dev/null 2>&1

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}
ARG STRAPI_ADMIN_BACKEND_URL
ENV STRAPI_ADMIN_BACKEND_URL=${STRAPI_ADMIN_BACKEND_URL}

WORKDIR /opt/

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

WORKDIR /opt/app
# Copy source code
COPY . .

# Build the Strapi admin and server
RUN npm run build

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM node:22-alpine

# Install native runtime dependencies
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    postgresql16-client \
    su-exec > /dev/null 2>&1

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

# Copy necessary files from the build stage
COPY --chown=node:node --from=build /opt/node_modules ./node_modules
COPY --chown=node:node --from=build /opt/app ./
COPY --chown=root:root docker-entrypoint.sh /usr/local/bin/strapi-entrypoint
RUN chmod 755 /usr/local/bin/strapi-entrypoint

ENV PATH /opt/node_modules/.bin:$PATH

ENTRYPOINT ["/usr/local/bin/strapi-entrypoint"]

# Expose port
EXPOSE 22345

# Start Strapi
CMD ["npm", "run", "start"]
