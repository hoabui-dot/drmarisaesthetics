/**
 * customer controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::customer.customer",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        strapi.log.info("[Customer Controller] find() called");

        // Define custom population for all blocks in the dynamic zone
        const populate: any = {
          layout: {
            on: {
              "customer.hero": {
                populate: ["image1", "image2", "image3", "image4"],
              },
              "customer.combined-testimonial-result": {
                populate: {
                  items: {
                    populate: ["beforeImage", "afterImage"],
                  },
                },
              },
              "customer.success-stories": {
                populate: {
                  stories: {
                    populate: ["avatar"],
                  },
                },
              },
              "customer.why-choose-us": {
                populate: {
                  features: {
                    populate: ["icon"],
                  },
                },
              },
              "customer.reviews": {
                populate: {
                  checklist: {
                    populate: ["icon"],
                  },
                },
              },
            },
          },
        };

        const sanitizedQuery = await this.sanitizeQuery(ctx);
        strapi.log.info(
          "[Customer Controller] sanitizedQuery:",
          JSON.stringify(sanitizedQuery),
        );

        // Get status from query params (draft or published)
        // Default to published if not specified
        const requestedStatus = ctx.query.status;
        const status: "draft" | "published" =
          requestedStatus === "draft" ? "draft" : "published";

        strapi.log.info("[Customer Controller] Requested status:", status);

        // For single types, use findFirst
        const entity = await strapi
          .documents("api::customer.customer")
          .findFirst({
            ...sanitizedQuery,
            populate,
            status, // Use typed status
          });

        strapi.log.info("[Customer Controller] entity found:", !!entity);

        if (!entity) {
          strapi.log.warn(
            "[Customer Controller] No entity found, returning 404",
          );
          return ctx.notFound("Customer page not found");
        }

        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("Error in customer controller find:", error);
        ctx.body = {
          error: error.message,
          details: error.details || error.stack,
        };
        ctx.status = 500;
      }
    },
  }),
);
