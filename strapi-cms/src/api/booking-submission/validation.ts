export const SUBMISSION_TYPES = ["booking", "promotion", "newsletter"] as const;

export const SUBMISSION_SOURCES = [
  "homepage",
  "about_us",
  "contact",
  "booking_modal",
  "service_detail",
  "promotion_popup",
  "blog_newsletter",
] as const;

export const BOOKING_STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "completed",
  "cancelled",
] as const;

type SubmissionType = (typeof SUBMISSION_TYPES)[number];
type SubmissionSource = (typeof SUBMISSION_SOURCES)[number];
type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingSubmissionInput = Record<string, unknown> & {
  submission_type?: unknown;
  submission_source?: unknown;
  booking_status?: unknown;
};

export function normalizeBookingSubmission(
  input: BookingSubmissionInput,
  partial = false,
): { data?: Record<string, unknown>; error?: string } {
  const data = { ...input } as Record<string, unknown>;
  const type = data.submission_type;
  const source = data.submission_source;
  const status = data.booking_status;

  if (!partial || type !== undefined) {
    const normalizedType = (type || "booking") as string;
    if (!SUBMISSION_TYPES.includes(normalizedType as SubmissionType)) {
      return {
        error: `Invalid submission_type. Must be one of: ${SUBMISSION_TYPES.join(", ")}`,
      };
    }
    data.submission_type = normalizedType;
  }

  if (!partial || source !== undefined) {
    const normalizedSource = (source || "booking_modal") as string;
    if (!SUBMISSION_SOURCES.includes(normalizedSource as SubmissionSource)) {
      return {
        error: `Invalid submission_source. Must be one of: ${SUBMISSION_SOURCES.join(", ")}`,
      };
    }
    data.submission_source = normalizedSource;
  }

  if (!partial || status !== undefined) {
    const normalizedStatus = (status || "new") as string;
    if (!BOOKING_STATUSES.includes(normalizedStatus as BookingStatus)) {
      return {
        error: `Invalid booking_status. Must be one of: ${BOOKING_STATUSES.join(", ")}`,
      };
    }
    data.booking_status = normalizedStatus;
  }

  return { data };
}
