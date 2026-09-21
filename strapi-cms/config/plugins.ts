/**
 * Plugins Configuration
 *
 * Configures Strapi plugins including the preview-button plugin.
 */

export default ({ env }) => ({
  "better-blocks": {
    enabled: true,
  },
  "docx-importer": {
    enabled: true,
    resolve: "./src/plugins/docx-importer",
  },
  // Retain Webtools for its existing admin utilities; sitemap ownership lives
  // exclusively in the SEO Manager.
  webtools: {
    enabled: true,
  },

  "backup-manager": {
    enabled: true,
    resolve: "./src/plugins/backup-manager",
  },
  "seo-manager": {
    enabled: true,
    resolve: "./src/plugins/seo-manager",
  },

  // i18n Plugin Configuration
  i18n: {
    enabled: true,
    config: {
      defaultLocale: "en",
      locales: ["en"],
    },
  },

  // Upload Plugin Security Configuration
  upload: {
    config: {
      security: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
        ],
      },
    },
  },

  // Preview Button Plugin Configuration
  "preview-button": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::page.page",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: {
              type: "page",
              slug: "{slug}",
              secret: env(
                "PREVIEW_SECRET",
                "your-secure-preview-secret-change-in-production",
              ),
            },
          },
          published: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/{slug}`,
          },
        },
        {
          uid: "api::homepage.homepage",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: { type: "homepage", secret: env("PREVIEW_SECRET", "") },
          },
          published: { url: `${env("FRONTEND_URL", "http://localhost:3000")}/` },
        },
        {
          uid: "api::about-page.about-page",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: { type: "about-page", secret: env("PREVIEW_SECRET", "") },
          },
          published: { url: `${env("FRONTEND_URL", "http://localhost:3000")}/about-us` },
        },
        {
          uid: "api::contact-page.contact-page",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: { type: "contact-page", secret: env("PREVIEW_SECRET", "") },
          },
          published: { url: `${env("FRONTEND_URL", "http://localhost:3000")}/contact` },
        },
        {
          uid: "api::services-overview.services-overview",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: { type: "services-overview", secret: env("PREVIEW_SECRET", "") },
          },
          published: { url: `${env("FRONTEND_URL", "http://localhost:3000")}/services` },
        },
        {
          uid: "api::blog.blog",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: { type: "blog", slug: "{slug}", secret: env("PREVIEW_SECRET", "") },
          },
          published: { url: `${env("FRONTEND_URL", "http://localhost:3000")}/news/{slug}` },
        },
        {
          uid: "api::service-detail.service-detail",
          draft: {
            url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
            query: { type: "service-detail", slug: "{slug}", secret: env("PREVIEW_SECRET", "") },
          },
          published: { url: `${env("FRONTEND_URL", "http://localhost:3000")}/services/{slug}` },
        },
      ],
    },
  },
});
