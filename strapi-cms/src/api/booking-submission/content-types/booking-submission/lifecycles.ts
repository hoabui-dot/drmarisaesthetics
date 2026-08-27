/**
 * Booking Submission Lifecycles
 *
 * Lifecycle hooks for booking submission content type
 */

export default {
  /**
   * Before update hook
   * Logs and validates the update data
   */
  async beforeUpdate(event: any) {
    const { data } = event.params;

    // Log the update attempt
    console.log("[Booking Submission Lifecycle] beforeUpdate triggered", {
      documentId: event.params.where?.documentId,
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
        console.error(
          "[Booking Submission Lifecycle] Invalid booking_status value",
          {
            provided: data.booking_status,
            valid: validStatuses,
          },
        );

        throw new Error(
          `Invalid booking_status. Must be one of: ${validStatuses.join(", ")}`,
        );
      }

      console.log("[Booking Submission Lifecycle] Status validation passed", {
        booking_status: data.booking_status,
      });
    }
  },

  /**
   * After update hook
   * Logs successful updates
   */
  async afterUpdate(event: any) {
    const { result } = event;

    console.log("[Booking Submission Lifecycle] afterUpdate - Success", {
      id: result?.id,
      documentId: result?.documentId,
      booking_status: result?.booking_status,
    });
  },
};
