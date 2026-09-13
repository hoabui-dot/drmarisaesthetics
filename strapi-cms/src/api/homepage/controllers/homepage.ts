/**
 * Editorial homepage controller.
 *
 * Homepage sections are managed as an ordered dynamic zone, matching the
 * Content Manager pattern used by About Page.
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
          populate: {
            seo: { populate: ["meta_image"] },
            metadata_image: true,
            sections: {
              on: {
                "homepage.hero-section": { populate: ["image", "trust_labels"] },
                "homepage.signature-procedures-section": { populate: { items: { populate: ["image"] } } },
                "homepage.maris-method-section": { populate: ["image", "steps"] },
                "homepage.revision-surgery-section": { populate: ["image"] },
                "homepage.doctor-assessment-section": { populate: ["image"] },
                "homepage.hospital-based-surgery-section": { populate: ["image", "proof_items"] },
                "homepage.international-patients-section": { populate: ["review_items"] },
                "homepage.international-journey-section": { populate: { steps: { populate: ["image"] } } },
                "homepage.patient-results-section": { populate: "*" },
                "homepage.consultation-section": { populate: "*" },
                "homepage.frequently-asked-questions-section": { populate: ["items"] },
              },
            },
          },
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
