/**
 * Admin Panel Configuration
 *
 * Configures the Strapi admin panel settings including preview mode.
 * NO hardcoded defaults — all values must be set via environment variables.
 */

export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
  // Vite configuration for admin panel
  vite: (config) => {
    const isCloudflare =
      env("CLOUDFLARE_TUNNEL_HOST", "") &&
      env("CLOUDFLARE_TUNNEL_HOST", "") !== "localhost";

    return {
      ...config,
      server: {
        ...config.server,
        host: env("HOST"),
        strictPort: false,
        // Disable HMR when using Cloudflare tunnel to prevent connection issues
        hmr: isCloudflare ? false : true,
        // Allow all hosts for Cloudflare tunnels
        allowedHosts: true,
      },
    };
  },
});
