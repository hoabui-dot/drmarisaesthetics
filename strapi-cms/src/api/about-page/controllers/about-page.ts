/**
 * about-page controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::about-page.about-page" as any,
  ({ strapi }) => ({
    async find(ctx) {
      const populate: any = {
        seo: { populate: ["meta_image"] },
        sections: {
          on: {
            "about.hero": { populate: ["backgroundImage", "statistics", "statistics.icon_image"] },
            "about.mission-vision": { populate: ["backgroundImage", "missionIcon", "visionIcon"] },
            "about.core-values": { populate: { center_icon: { populate: "*" }, values: { populate: { icon_image: { populate: "*" } } } } },
            "about.doctors": { populate: { doctors: { populate: "*" } } },
            // Featured service cards are resolved from the blog collection
            // in the frontend; this component only stores the section presentation data.
            "about.featured-services": { populate: "*" },
            "about.why-choose-us": { populate: { toothImage: { populate: "*" }, statistics: { populate: "*" }, features: { populate: { icon_image: { populate: "*" } } }, accreditations: { populate: { logo: { populate: "*" } } } } },
            "about.booking": { populate: { clinic_image: { populate: "*" } } },
          },
        },
      };

      const sanitizedQuery = await this.sanitizeQuery(ctx);

      const entity = await strapi
        .documents("api::about-page.about-page" as any)
        .findFirst({
          ...sanitizedQuery,
          populate,
          status: ctx.query.status === "draft" ? "draft" : "published",
        });

      return this.transformResponse(entity);
    },
  }),
);
