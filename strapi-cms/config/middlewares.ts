/**
 * Middleware Configuration
 *
 * Configures Strapi middlewares including security settings and rate limiting.
 */

export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "res.cloudinary.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "res.cloudinary.com",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      // Keep the Strapi parser limit aligned with the reverse proxy upload
      // limit. Without this, larger admin uploads fail after reaching the
      // application even when Nginx accepts the request.
      formLimit: "50mb",
      jsonLimit: "50mb",
      textLimit: "50mb",
      formidable: {
        maxFileSize: 50 * 1024 * 1024,
      },
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  // Keep unassigned services at the end of the navigationOrder list.
  "global::service-navigation-list",
  // Rate limiting for booking submissions
  "global::rate-limit",
  // Booking status validator (must come after body parser)
  "global::booking-status-validator",
];
