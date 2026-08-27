/**
 * booking-submission controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::booking-submission.booking-submission" as any,
  ({ strapi }) => ({
    /**
     * Create a new booking submission
     *
     * This endpoint is called by the Next.js frontend API route
     * after reCAPTCHA verification.
     */
    async create(ctx) {
      try {
        // Log incoming request for debugging
        strapi.log.info("[Booking Submission] New submission received", {
          ip: ctx.request.ip,
          userAgent: ctx.request.headers["user-agent"],
        });

        // Get the request body data
        const { data } = ctx.request.body;

        // Ensure booking_status is set to "new" if not provided
        const submissionData = {
          ...data,
          booking_status: data.booking_status || "new",
        };

        // Create the submission using Strapi's document service
        const entity = await strapi
          .documents("api::booking-submission.booking-submission")
          .create({
            data: submissionData,
          });

        // Log success
        strapi.log.info("[Booking Submission] Created successfully", {
          id: entity.id,
          service: entity.service,
          booking_status: entity.booking_status,
        });

        // Return the created entity
        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("[Booking Submission] Error creating submission:", {
          error: error.message,
          stack: error.stack,
        });

        // Return error response
        ctx.status = 500;
        return {
          error: {
            status: 500,
            name: "InternalServerError",
            message: "Failed to create booking submission",
          },
        };
      }
    },

    /**
     * Find all booking submissions with pagination
     *
     * This is used by the Strapi admin panel
     */
    async find(ctx) {
      try {
        // Sanitize query parameters
        const sanitizedQuery = await this.sanitizeQuery(ctx);

        // Fetch submissions with pagination
        const results = await strapi
          .documents("api::booking-submission.booking-submission")
          .findMany({
            ...sanitizedQuery,
            sort: { createdAt: "desc" }, // Most recent first
          });

        // Transform and return
        return this.transformResponse(results);
      } catch (error: any) {
        strapi.log.error("[Booking Submission] Error fetching submissions:", {
          error: error.message,
        });

        ctx.status = 500;
        return {
          error: {
            status: 500,
            name: "InternalServerError",
            message: "Failed to fetch booking submissions",
          },
        };
      }
    },

    /**
     * Find one booking submission by ID
     */
    async findOne(ctx) {
      try {
        const { id } = ctx.params;

        // Sanitize query
        const sanitizedQuery = await this.sanitizeQuery(ctx);

        // Fetch single submission
        const entity = await strapi
          .documents("api::booking-submission.booking-submission")
          .findOne({
            documentId: id,
            ...sanitizedQuery,
          });

        if (!entity) {
          return ctx.notFound("Booking submission not found");
        }

        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("[Booking Submission] Error fetching submission:", {
          error: error.message,
        });

        ctx.status = 500;
        return {
          error: {
            status: 500,
            name: "InternalServerError",
            message: "Failed to fetch booking submission",
          },
        };
      }
    },

    /**
     * Update booking submission (e.g., change status)
     */
    async update(ctx) {
      try {
        const { id } = ctx.params;

        // Get the request body data
        const { data } = ctx.request.body;

        // Log the incoming update request for debugging
        strapi.log.info("[Booking Submission] Update request received", {
          documentId: id,
          data: data,
          booking_status: data?.booking_status,
        });

        // Validate booking_status if provided
        if (data.booking_status) {
          const validStatuses = [
            "new",
            "contacted",
            "scheduled",
            "completed",
            "cancelled",
          ];
          if (!validStatuses.includes(data.booking_status)) {
            strapi.log.error(
              "[Booking Submission] Invalid booking_status value",
              {
                provided: data.booking_status,
                valid: validStatuses,
              },
            );
            ctx.status = 400;
            return {
              error: {
                status: 400,
                name: "ValidationError",
                message: `Invalid booking_status. Must be one of: ${validStatuses.join(", ")}`,
                details: {
                  errors: [
                    {
                      path: ["booking_status"],
                      message: `Invalid booking_status value: ${data.booking_status}`,
                      name: "ValidationError",
                    },
                  ],
                },
              },
            };
          }
        }

        // Update the submission
        const entity = await strapi
          .documents("api::booking-submission.booking-submission")
          .update({
            documentId: id,
            data: data,
          });

        if (!entity) {
          return ctx.notFound("Booking submission not found");
        }

        strapi.log.info("[Booking Submission] Updated successfully", {
          id: entity.id,
          documentId: entity.documentId,
          booking_status: entity.booking_status,
        });

        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("[Booking Submission] Error updating submission:", {
          error: error.message,
          stack: error.stack,
          details: error.details || {},
        });

        // Check if it's a validation error
        if (error.message && error.message.includes("booking_status")) {
          ctx.status = 400;
          return {
            error: {
              status: 400,
              name: "ValidationError",
              message:
                error.message || "Validation error: Invalid booking_status",
              details: error.details || {},
            },
          };
        }

        ctx.status = 500;
        return {
          error: {
            status: 500,
            name: "InternalServerError",
            message: "Failed to update booking submission",
            details: error.message,
          },
        };
      }
    },

    /**
     * Delete booking submission
     */
    async delete(ctx) {
      try {
        const { id } = ctx.params;

        // Delete the submission
        const entity = await strapi
          .documents("api::booking-submission.booking-submission")
          .delete({
            documentId: id,
          });

        if (!entity) {
          return ctx.notFound("Booking submission not found");
        }

        strapi.log.info("[Booking Submission] Deleted successfully", {
          documentId: entity.documentId,
        });

        return this.transformResponse(entity);
      } catch (error: any) {
        strapi.log.error("[Booking Submission] Error deleting submission:", {
          error: error.message,
        });

        ctx.status = 500;
        return {
          error: {
            status: 500,
            name: "InternalServerError",
            message: "Failed to delete booking submission",
          },
        };
      }
    },
  }),
);
