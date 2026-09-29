export const BOOKING_SUBMISSION_SOURCES = [
  "homepage",
  "about_us",
  "contact",
  "booking_modal",
  "service_detail",
  "promotion_popup",
  "blog_newsletter",
] as const;

export type BookingSubmissionSource = (typeof BOOKING_SUBMISSION_SOURCES)[number];

export function normalizeBookingSubmissionSource(
  value: unknown,
  fallback: BookingSubmissionSource = "booking_modal",
): BookingSubmissionSource {
  return typeof value === "string" &&
    (BOOKING_SUBMISSION_SOURCES as readonly string[]).includes(value)
    ? (value as BookingSubmissionSource)
    : fallback;
}
