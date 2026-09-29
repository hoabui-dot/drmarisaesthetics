/**
 * Booking Submission Lifecycles
 *
 * Lifecycle hooks for booking submission content type.
 */

import { normalizeBookingSubmission } from "../../validation";

export default {
  /**
   * Before update hook
   * Logs and validates the update data
   */
  async beforeUpdate(event: any) {
    const { data } = event.params;

    const normalized = normalizeBookingSubmission(data || {}, true);
    if (normalized.error) {
      throw new Error(normalized.error);
    }

    event.params.data = normalized.data;
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
