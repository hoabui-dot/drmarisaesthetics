/**
 * contact-method controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-method.contact-method",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        // Populate icon media
        const populate: any = {
          icon: true,
        };

        const sanitizedQuery = await this.sanitizeQuery(ctx);

        // Determine status - use 'published' as default, or 'draft' if explicitly requested
        const status: "draft" | "published" =
          ctx.query.status === "draft" ? "draft" : "published";

        // Fetch all contact methods
        const entities = await strapi
          .documents("api::contact-method.contact-method")
          .findMany({
            ...sanitizedQuery,
            populate,
            status,
            sort: { order: "asc" }, // Sort by order field
          });

        return this.transformResponse(entities);
      } catch (error: any) {
        strapi.log.error("[contact-method.find] Error:", error);
        ctx.status = 500;
        return ctx.internalServerError("Internal server error");
      }
    },

    async findOne(ctx) {
      try {
        const { id } = ctx.params;

        // Populate icon media
        const populate: any = {
          icon: true,
        };

        const sanitizedQuery = await this.sanitizeQuery(ctx);

        // Determine status - use 'published' as default, or 'draft' if explicitly requested
        const status: "draft" | "published" =
          ctx.query.status === "draft" ? "draft" : "published";

        const entity = await strapi
          .documents("api::contact-method.contact-method")
          .findOne({
            documentId: id,
            ...sanitizedQuery,
            populate,
            status,
          });

        if (!entity) {
          return ctx.notFound("Contact method not found");
        }

        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("[contact-method.findOne] Error:", error);
        ctx.status = 500;
        return ctx.internalServerError("Internal server error");
      }
    },
  }),
);
