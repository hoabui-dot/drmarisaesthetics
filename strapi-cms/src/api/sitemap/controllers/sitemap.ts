// Strapi compiles TypeScript controllers into /dist, while this shared helper
// intentionally remains plain JavaScript for both Strapi and Node tests. Load
// it from the application source tree so the path works in dev and production.
const path = require("node:path");
const { getSitemapReport, getRobotsConfiguration, SITEMAP_GROUPS } = require(path.resolve(process.cwd(), "src/lib/sitemap.js"));

export default {
  async find(ctx) {
    try {
      const requestedGroup = typeof ctx.query.group === "string" ? ctx.query.group : undefined;
      if (requestedGroup && !SITEMAP_GROUPS.some((group: { key: string }) => group.key === requestedGroup)) {
        return ctx.badRequest("Unknown sitemap group.");
      }
      const report = await getSitemapReport(strapi);
      const items = requestedGroup ? report.items.filter((item: { sitemapKey: string }) => item.sitemapKey === requestedGroup) : report.items;
      ctx.body = {
        data: {
          generatedAt: report.generatedAt,
          locale: report.locale,
          locales: report.locales,
          sitemapGroups: report.sitemapGroups,
          items: items.map(({ url, path, label, group, sitemapKey, contentType, locale, lastModified }) => ({
            url,
            path,
            label,
            group,
            sitemapKey,
            contentType,
            locale,
            ...(lastModified ? { lastModified } : {}),
          })),
        },
      };
    } catch (error) {
      strapi.log.error(`[sitemap] Public sitemap data request failed: ${error instanceof Error ? error.message : "unknown error"}`);
      ctx.internalServerError("Sitemap data is temporarily unavailable.");
    }
  },
  async robots(ctx) {
    try {
      ctx.body = { data: await getRobotsConfiguration(strapi) };
    } catch (error) {
      strapi.log.error(`[sitemap] Public robots configuration request failed: ${error instanceof Error ? error.message : "unknown error"}`);
      ctx.internalServerError("Robots configuration is temporarily unavailable.");
    }
  },
};
