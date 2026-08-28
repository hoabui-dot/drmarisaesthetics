/**
 * Editorial homepage controller.
 *
 * Homepage sections are stored as JSON fields rather than the removed legacy
 * dynamic zone. This keeps the Content Manager aligned with the Stitch UI.
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::homepage.homepage",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const sanitizedQuery = await this.sanitizeQuery(ctx);
        const entities = await strapi.documents("api::homepage.homepage").findMany({
          ...sanitizedQuery,
          populate: { seo: { populate: ["meta_image"] }, metadata_image: true },
          status: ctx.query.status === "draft" ? "draft" : "published",
        });
        const entity = entities?.[0];
        if (!entity) {
          ctx.status = 404;
          return { data: null, error: "Homepage not found" };
        }
        return { data: entity, meta: {} };
      } catch (error: any) {
        strapi.log.error(`[homepage.find] ${error.message}`);
        ctx.status = 500;
        return { error: error.message, details: error.details };
      }
    },
  }),
);
