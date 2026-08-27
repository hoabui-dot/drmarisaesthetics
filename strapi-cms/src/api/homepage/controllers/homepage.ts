/**
 * homepage controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::homepage.homepage",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        // 1. Define custom population for all blocks in the dynamic zone
        const populate: any = {
          seo: { populate: ["meta_image"] },
          metadata_image: true,
          layout: {
            on: {
              "homepage.hero": {
                populate: {
                  background_image: {
                    populate: "*",
                  },
                  patient_avatars: {
                    populate: "*",
                  },
                },
              },
              "homepage.services": {
                populate: {
                  items: {
                    populate: ["image"],
                  },
                },
              },
              "homepage.doctor": {
                populate: {
                  doctors: {
                    populate: ["image", "badges", "stats"],
                  },
                },
              },
              "homepage.certification": {
                populate: {
                  bundles: {
                    populate: ["organization_logo", "certificate_image"],
                  },
                },
              },
              "homepage.results-section": {
                populate: {
                  stories: {
                    populate: ["before_image", "after_image", "patient_portrait"],
                  },
                },
              },
              "homepage.testimonials-section": {
                populate: {
                  section_image: true,
                  testimonials: {
                    populate: ["patient_avatar"],
                  },
                },
              },
              "homepage.press-section": {
                populate: ["logos"],
              },
              "homepage.blog-collection-section": {
                populate: {
                  posts: {
                    populate: ["coverImage"],
                  },
                },
              },
              "homepage.proof-showcase": {
                populate: { primary_image: true, secondary_image: true, primary_team_image: true, technology_image: true, patient_story_image: true, patient_stat_image: true, benefits: true, metrics: { populate: ["icon"] } },
              },
              "homepage.technology-feature": {
                populate: { background_image: true, image: true, features: { populate: ["icon"] }, technologies: { populate: ["image", "thumbnail"] } },
              },
              "homepage.equipment-showcase": {
                populate: { items: { populate: ["image"] } },
              },
              "homepage.consultation": {
                populate: { expert_image: true },
              },
            },
          },
        };

        const sanitizedQuery = await this.sanitizeQuery(ctx);

        strapi.log.info("[homepage.find] Fetching homepage...");

        // Strapi v5: findFirst returns null when no published document exists.
        // Using findMany + [0] to also pass `status` filter safely.
        const entities = await strapi
          .documents("api::homepage.homepage")
          .findMany({
            ...sanitizedQuery,
            populate,
            status: ctx.query.status === "draft" ? "draft" : "published",
          });

        strapi.log.info(
          `[homepage.find] Found ${entities?.length ?? 0} entities`,
        );

        const entity = entities && entities.length > 0 ? entities[0] : null;

        if (!entity) {
          strapi.log.warn("[homepage.find] No published homepage found.");
          ctx.status = 404;
          return { data: null, error: "Homepage not found" };
        }

        strapi.log.info("[homepage.find] Returning entity");

        // Return entity directly — Strapi v5 Document API returns flat structure.
        // Do NOT use this.transformResponse(entity) when entity may be null;
        // transformResponse crashes with "Cannot read properties of undefined (reading 'attributes')".
        return { data: entity, meta: {} };
      } catch (error: any) {
        strapi.log.error("Error in homepage controller find:", error);
        ctx.body = {
          error: error.message,
          details: error.details,
        };
        ctx.status = 500;
      }
    },
  }),
);
