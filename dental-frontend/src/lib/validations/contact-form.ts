import { z } from "zod";

/**
 * Contact Form Validation Schema
 *
 * Validates contact/booking form submissions
 *
 * Fields:
 * - fullName: Required, min 2 characters
 * - phoneNumber: Required, valid phone format
 * - email: Required, valid email format
 * - service: Required, must be one of the predefined options
 * - otherService: Conditional - required only if service is "Other"
 * - message: Optional
 * - recaptchaToken: Required for bot protection
 */
export const contactFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .trim(),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        "Please enter a valid phone number",
      )
      .trim(),

    email: z.union([z.string().email("Please enter a valid email"), z.literal("")]).optional(),

    service: z.string().min(1, "Please select a service"),

    otherService: z.string().optional(),

    message: z
      .string()
      .max(1000, "Message must be less than 1000 characters")
      .optional(),

    recaptchaToken: z.string().min(1, "reCAPTCHA verification required"),
  })
  .refine(
    (data) => {
      // If service is "Other", otherService must be provided
      if (
        data.service === "Other" &&
        (!data.otherService || data.otherService.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify the service",
      path: ["otherService"],
    },
  );

export type ContactFormData = z.infer<typeof contactFormSchema>;
