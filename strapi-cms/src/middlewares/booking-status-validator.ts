/**
 * Booking Status Validator Middleware
 *
 * Intercepts PUT requests to booking submissions and validates the booking_status field
 * before it reaches the database. This is necessary because the Content-Manager
 * plugin bypasses custom controllers and lifecycle hooks.
 */

export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    // Only intercept PUT requests to booking submissions
    const isBookingUpdate =
      ctx.method === "PUT" &&
      ctx.url.includes(
        "/content-manager/collection-types/api::booking-submission.booking-submission/",
      );

    if (isBookingUpdate) {
      const { data } = ctx.request.body;

      strapi.log.info("[Booking Status Validator] Intercepted update request", {
        url: ctx.url,
        method: ctx.method,
        data: data,
        booking_status: data?.booking_status,
      });

      // Validate booking_status if provided
      if (data && data.booking_status !== undefined) {
        const validStatuses = [
          "new",
          "contacted",
          "scheduled",
          "completed",
          "cancelled",
        ];

        // Trim whitespace and convert to lowercase for comparison
        const statusValue = String(data.booking_status).trim();

        if (!validStatuses.includes(statusValue)) {
          strapi.log.error(
            "[Booking Status Validator] Invalid booking_status value",
            {
              provided: data.booking_status,
              trimmed: statusValue,
              valid: validStatuses,
            },
          );

          ctx.status = 400;
          ctx.body = {
            error: {
              status: 400,
              name: "ValidationError",
              message: `Invalid booking_status. Must be one of: ${validStatuses.join(", ")}`,
              details: {
                errors: [
                  {
                    path: ["booking_status"],
                    message: `Invalid booking_status value: "${data.booking_status}"`,
                    name: "ValidationError",
                  },
                ],
              },
            },
          };
          return; // Stop here, don't call next()
        }

        strapi.log.info("[Booking Status Validator] Status validation passed", {
          booking_status: statusValue,
        });
      }
    }

    // Continue to next middleware
    await next();
  };
};
