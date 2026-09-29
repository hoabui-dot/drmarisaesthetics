/**
 * booking-submission controller
 */

import { factories } from "@strapi/strapi";
import { normalizeBookingSubmission } from "../validation";

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
        const data = ctx.request.body?.data;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          ctx.status = 400;
          return {
            error: { status: 400, name: "ValidationError", message: "Submission data is required" },
          };
        }

        const normalized = normalizeBookingSubmission(data as Record<string, unknown>);
        if (normalized.error || !normalized.data) {
          ctx.status = 400;
          return {
            error: { status: 400, name: "ValidationError", message: normalized.error },
          };
        }

        // Create the submission using Strapi's document service
        const entity = await strapi
          .documents("api::booking-submission.booking-submission")
          .create({
            data: normalized.data as any,
          });

        // Log success
        strapi.log.info("[Booking Submission] Created successfully", {
          id: entity.id,
          submission_type: entity.submission_type,
          submission_source: entity.submission_source,
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

        const data = ctx.request.body?.data;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          ctx.status = 400;
          return {
            error: { status: 400, name: "ValidationError", message: "Submission data is required" },
          };
        }

        const normalized = normalizeBookingSubmission(data as Record<string, unknown>, true);
        if (normalized.error || !normalized.data) {
          ctx.status = 400;
          return {
            error: { status: 400, name: "ValidationError", message: normalized.error },
          };
        }

        // Update the submission
        const entity = await strapi
          .documents("api::booking-submission.booking-submission")
          .update({
            documentId: id,
            data: normalized.data as any,
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

        // Check if it is a validation error from one of the discriminators.
        if (error.message && /submission_type|submission_source|booking_status/.test(error.message)) {
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
