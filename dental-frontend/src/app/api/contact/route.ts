import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/src/lib/validations/contact-form";
import { sendBookingNotifications } from "@/src/lib/email/notifications";
import { normalizeBookingSubmissionSource } from "@/src/lib/submissions";
import {
  isRecaptchaEnabled,
  shouldVerifyRecaptcha,
  verifyRecaptchaToken,
} from "@/src/lib/security/recaptcha";

/**
 * Contact Form Submission API Route
 *
 * Handles POST requests for contact form submissions
 *
 * Flow:
 * 1. Validate form data with Zod
 * 2. Verify reCAPTCHA token
 * 3. Submit to Strapi API
 * 4. Return success/error response
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate data
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;
    console.info("[Contact API] validation-passed", {
      service: data.service,
      hasEmail: Boolean(data.email),
      messageLength: data.message?.length || 0,
    });

    // Verify reCAPTCHA only when the production runtime flag is enabled.
    let isValidRecaptcha = true;
    if (shouldVerifyRecaptcha()) {
      isValidRecaptcha = await verifyRecaptchaToken(data.recaptchaToken);
    } else if (!isRecaptchaEnabled()) {
      console.info("[Contact API] recaptcha-disabled");
    }

    if (!isValidRecaptcha) {
      console.warn("[Contact API] recaptcha-rejected");
      return NextResponse.json(
        {
          success: false,
          error:
            "Security verification failed. Please try again or contact us directly.",
        },
        { status: 400 },
      );
    }

    // Submit to Strapi API
    const strapiUrl = process.env.STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Please contact support.",
        },
        { status: 500 },
      );
    }

    const strapiResponse = await fetch(`${strapiUrl}/api/booking-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          full_name: data.fullName,
          email: data.email || null,
          phone_number: data.phoneNumber,
          country: data.country || null,
          service: data.service,
          other_service: data.otherService || null,
          message: data.message || null,
          ip_address:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown",
          user_agent: request.headers.get("user-agent"),
          submission_type: "booking",
          submission_source: normalizeBookingSubmissionSource(data.submissionSource),
          booking_status: "new",
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error("[Contact API] strapi-save-failed", {
        status: strapiResponse.status,
        error: errorData?.error?.message || "unknown",
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to save your submission. Please try again or call us directly.",
          details: errorData,
        },
        { status: 500 },
      );
    }

    const strapiData = await strapiResponse.json();

    // Send email notifications (non-blocking)
    // Don't wait for emails to complete - send them in background
    console.info("[Contact API] strapi-save-succeeded", {
      submissionId: strapiData?.data?.id || strapiData?.data?.documentId || "unknown",
    });

    sendBookingNotifications({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      country: data.country,
      email: data.email || undefined,
      service: data.service,
      otherService: data.otherService,
      message: data.message,
      submissionType: "booking",
      submissionSource: normalizeBookingSubmissionSource(data.submissionSource),
    }).then((sent) => {
      console.info("[Contact API] email-notification-completed", { sent });
    }).catch((emailError) => {
      console.error("[Contact API] email-notification-failed", {
        error: emailError instanceof Error ? emailError.message : "unknown",
      });
    });

    // Return success response immediately (don't wait for emails)
    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll contact you within 24 hours.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Contact API] request-failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again or call us directly.",
      },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
