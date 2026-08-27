/**
 * Rate Limiting Middleware
 *
 * Protects API endpoints from abuse by limiting the number of requests
 * per IP address within a time window.
 *
 * Configuration:
 * - 5 requests per 15 minutes per IP
 * - Applies to booking-submissions endpoint
 * - Whitelists internal requests (localhost)
 */

import rateLimit from "koa-ratelimit";

export default (config, { strapi }) => {
  // In-memory store for development
  // For production with multiple instances, use Redis
  const db = new Map();

  const rateLimitMiddleware = rateLimit({
    driver: "memory",
    db: db,
    duration: 15 * 60 * 1000, // 15 minutes in milliseconds
    errorMessage: {
      error: {
        status: 429,
        name: "TooManyRequests",
        message:
          "Too many requests. Please try again in a few minutes or call us directly.",
        details: {
          limit: 5,
          window: "15 minutes",
        },
      },
    },
    id: (ctx) => {
      // Use IP address as identifier
      return ctx.ip || ctx.request.ip || "unknown";
    },
    headers: {
      remaining: "RateLimit-Remaining",
      reset: "RateLimit-Reset",
      total: "RateLimit-Limit",
    },
    max: 5, // Maximum 5 requests
    disableHeader: false,
    whitelist: (ctx) => {
      // Whitelist internal requests
      const ip = ctx.ip || ctx.request.ip;
      const isInternal =
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip === "localhost" ||
        ip?.startsWith("192.168.") ||
        ip?.startsWith("10.");

      if (isInternal) {
        strapi.log.debug(
          `[Rate Limit] Whitelisted internal request from ${ip}`,
        );
      }

      return isInternal;
    },
  });

  return async (ctx, next) => {
    // Only apply rate limiting to booking-submissions POST requests
    if (ctx.method === "POST" && ctx.path === "/api/booking-submissions") {
      strapi.log.info(
        `[Rate Limit] Applying rate limit to ${ctx.method} ${ctx.path}`,
      );
      return rateLimitMiddleware(ctx, next);
    }

    // For all other requests, just continue
    return next();
  };
};
