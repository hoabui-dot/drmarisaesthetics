/**
 * promotion-submission controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::promotion-submission.promotion-submission" as any,
  ({ strapi }) => ({
    /**
     * Create a new promotion submission
     *
     * This endpoint is called directly by the Next.js frontend
     */
    async create(ctx) {
      try {
        // Log incoming request for debugging
        strapi.log.info("[Promotion Submission] New submission received", {
          ip: ctx.request.ip,
          userAgent: ctx.request.headers["user-agent"],
        });

        // Get the request body data
        const { data } = ctx.request.body;

        // Ensure status is set to "new" if not provided
        const submissionData = {
          ...data,
          status: data.status || "new",
        };

        // Create the submission using Strapi's document service
        const entity = await strapi
          .documents("api::promotion-submission.promotion-submission")
          .create({
            data: submissionData,
          });

        // Log success
        strapi.log.info("[Promotion Submission] Created successfully", {
          id: entity.id,
          phone_number: entity.phone_number,
          status: entity.promotion_status,
        });

        // Return the created entity
        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("[Promotion Submission] Error creating submission:", {
          error: error.message,
          stack: error.stack,
        });

        // Return error response
        ctx.status = 500;
        return {
          error: {
            status: 500,
            name: "InternalServerError",
            message: "Failed to create promotion submission",
          },
        };
      }
    },
  })
);
