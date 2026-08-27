/**
 * Server Configuration
 *
 * Configures Strapi server settings including:
 * - Host and port (internal binding — Cloudflare tunnel connects to these)
 * - Public URL (the https:// Cloudflare URL Strapi advertises externally)
 * - CORS for Next.js frontend
 *
 * How Cloudflare tunnel works with this config:
 *   HOST=0.0.0.0, PORT=1337   ← Strapi binds here internally (always required)
 *   PUBLIC_URL=https://guild-biblical-expectations-easily.trycloudflare.com
 *     ← Strapi uses this for absolute URLs, admin panel, media links
 *   CLOUDFLARE_TUNNEL_HOST=guild-biblical-expectations-easily.trycloudflare.com
 *     ← hostname only (no https://) → added to Vite allowedHosts so the
 *       admin panel is not blocked when accessed via the tunnel
 *
 * NO hardcoded defaults — missing vars throw at startup.
 */

export default ({ env }) => ({
  // Internal binding — always 0.0.0.0:1337 inside the container/host
  host: env("HOST"),
  port: env.int("PORT"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  // Public-facing URL (the Cloudflare https:// URL)
  url: env("PUBLIC_URL"),
  // Vite host-header check — add Cloudflare hostname so admin panel loads
  allowedHosts: [
    "localhost",
    "127.0.0.1",
    "100.68.50.41",
    // e.g. "guild-biblical-expectations-easily.trycloudflare.com"
    env("CLOUDFLARE_TUNNEL_HOST", ""),
  ].filter(Boolean),
  // CORS: allow requests from these origins
  cors: {
    enabled: true,
    origin: [
      // The Strapi public URL itself (e.g. the Cloudflare https:// URL)
      env("PUBLIC_URL"),
      // The Next.js frontend domain
      env("FRONTEND_URL"),
    ].filter(Boolean),
    credentials: true,
  },
});
