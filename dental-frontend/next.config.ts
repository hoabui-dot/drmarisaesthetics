import type { NextConfig } from "next";
import path from "path";

const strapiPublicUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
const frontendUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Keep the established profile URLs as permanent aliases while the
  // canonical doctor profiles live under the Our Team route.
  async redirects() {
    return [
      { source: "/our-team", destination: "/our-team/dr-huy", permanent: true },
      { source: "/deep-plane-facelift-specialist", destination: "/our-team/dr-cuong", permanent: true },
    ];
  },

  // Webpack configuration to help resolve modules in Docker
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];
    return config;
  },

  // Security & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── Content Security Policy ──────────────────────────────────────
          // unsafe-eval is required by Three.js / React Three Fiber for GLSL
          // shader compilation. Restrict all other sources strictly.
          {
            key: "Content-Security-Policy",
            value: [
              `default-src 'self'`,
              // Scripts: self + inline (Next.js) + unsafe-eval (Three.js/WebGL) + Google reCAPTCHA
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`,
              // Styles: self + inline (Tailwind / CSS-in-JS)
              `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
              // Fonts
              `font-src 'self' https://fonts.gstatic.com`,
              // Images: self + Strapi uploads + data URIs + blob (Next.js image opt)
              `img-src 'self' data: blob: ${strapiPublicUrl} https://*.trycloudflare.com https://*.unsplash.com https://*.s3.amazonaws.com https://api.dicebear.com https://cdn-icons-png.flaticon.com https://nhakhoaquoctesg.vn https://lh3.googleusercontent.com`,
              // API connections: self + Strapi + Google reCAPTCHA
              `connect-src 'self' ${strapiPublicUrl} https://*.trycloudflare.com https://www.google.com`,
              // Media: self + Strapi
              `media-src 'self' ${strapiPublicUrl} https://*.trycloudflare.com`,
              // Workers: self + blob (Next.js)
              `worker-src 'self' blob:`,
              // Frames: Google Maps + Google reCAPTCHA
              `frame-src 'self' https://maps.google.com https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/`,
              // Objects: none
              `object-src 'none'`,
            ]
              .filter(Boolean)
              .join("; "),
          },
          // ── Other security headers ────────────────────────────────────────
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      // Parse NEXT_PUBLIC_STRAPI_URL from environment
      ...(strapiPublicUrl
        ? (() => {
            try {
              const url = new URL(strapiPublicUrl);
              return [
                {
                  protocol: url.protocol.replace(":", "") as "http" | "https",
                  hostname: url.hostname,
                  ...(url.port ? { port: url.port } : {}),
                },
              ];
            } catch {
              return [];
            }
          })()
        : []),
      // Cloudflare tunnel domain
      {
        protocol: "https",
        hostname: "*.trycloudflare.com",
      },
      // Fallback for local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1234",
      },
      {
        protocol: "http",
        hostname: "strapi",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "smilux-strapi",
        port: "1337",
      },
      // Unsplash images (for placeholder/demo images)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // S3 and other cloud storage
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      // Dicebear avatars
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      // Flaticon images
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      // Legacy icon from external domain (referenced in nav CMS data)
      {
        protocol: "https",
        hostname: "nhakhoaquoctesg.vn",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
