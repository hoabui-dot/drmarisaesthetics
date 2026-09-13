/**
 * contact-page controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-page.contact-page" as any,
  ({ strapi }) => ({
    async find(ctx) {
      // Define explicit population for all components.
      // NOTE: Keep this list in sync with the contact-page schema.
      // Current schema attributes: layout with hero, consultation, location, and FAQ sections.
      const populate: any = {
        seo: { populate: ["meta_image"] },
        layout: {
          on: {
            "contact.hero": {
              populate: {
                hero_image: { populate: "*" },
                contact_cards: { populate: "*" },
              },
            },
            "contact.consultation-section": {
              populate: {
                location_options: { populate: "*" },
                advisor_image: { populate: "*" },
              },
            },
            "contact.map-section": {
              populate: {
                benefits: { populate: "*" },
              },
            },
            "contact.expectation": {
              populate: {
                items: { populate: "*" },
              },
            },
            "contact.faq": {
              populate: {
                questions: { populate: "*" },
              },
            },
          },
        },
      };

      // Sanitize the incoming query
      const sanitizedQuery = await this.sanitizeQuery(ctx);

      // Respect the preview query. The frontend sends status=draft while Next
      // draft mode is enabled; without this, Strapi silently returns published.
      const entity = await strapi
        .documents("api::contact-page.contact-page" as any)
        .findFirst({
          ...sanitizedQuery,
          populate,
          status: ctx.query.status === "draft" ? "draft" : "published",
        });

      // Return transformed response
      return this.transformResponse(entity);
    },
  }),
);
