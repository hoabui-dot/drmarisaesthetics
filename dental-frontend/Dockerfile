# ============================================
# Multi-Stage Dockerfile for Next.js Frontend
# ============================================
# Optimized for production with minimal size and fast builds.
#
# Build-time vs Runtime split:
#   - NEXT_PUBLIC_* vars MUST be passed as ARGs here — Next.js inlines them
#     into the JS bundle at build time.
#   - All server-side vars (STRAPI_URL, SMTP_*, EMAIL_*, etc.) are NOT passed
#     as ARGs. They are injected by docker-compose at container start (runtime).
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    npm cache clean --force

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files and install all deps (including dev for build)
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY next.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY src ./src
COPY public ./public

# ── Build-time environment variables ────────────────────────────────────────
# Only NEXT_PUBLIC_* vars belong here — they are baked into the JS bundle.
# Server-side vars (STRAPI_URL, SMTP_*, etc.) do NOT belong here; they are
# provided at runtime via docker-compose environment section.
# ────────────────────────────────────────────────────────────────────────────
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_STRAPI_API_TOKEN
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_STRAPI_URL=${NEXT_PUBLIC_STRAPI_URL}
ENV NEXT_PUBLIC_STRAPI_API_TOKEN=${NEXT_PUBLIC_STRAPI_API_TOKEN}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}

# Validate required build-time args are present
RUN if [ -z "$NEXT_PUBLIC_STRAPI_URL" ]; then \
      echo "❌ NEXT_PUBLIC_STRAPI_URL build arg is required" && exit 1; \
    fi && \
    if [ -z "$NEXT_PUBLIC_STRAPI_API_TOKEN" ]; then \
      echo "❌ NEXT_PUBLIC_STRAPI_API_TOKEN build arg is required" && exit 1; \
    fi && \
    if [ -z "$NEXT_PUBLIC_SERVER_URL" ]; then \
      echo "❌ NEXT_PUBLIC_SERVER_URL build arg is required" && exit 1; \
    fi && \
    if [ -z "$NEXT_PUBLIC_RECAPTCHA_SITE_KEY" ]; then \
      echo "❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY build arg is required" && exit 1; \
    fi

# Build Next.js application
RUN npm run build

# ============================================
# Stage 3: Runner (Production)
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

# Static environment — everything else comes from docker-compose at runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=2234
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 2234

# Switch to non-root user
USER nextjs

# Start application
CMD ["node", "server.js"]
