import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/src/lib/validations/contact-form";
import { sendBookingNotifications } from "@/src/lib/email/notifications";

/**
 * Verify reCAPTCHA token with Google API
 *
 * @param token - reCAPTCHA token from frontend
 * @returns Promise<boolean> - true if verification succeeds and score >= 0.5
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return false;
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      },
    );

    const data = await response.json();
    console.log("[reCAPTCHA Verify Contact] Full Response:", data);

    if (!data.success) {
      console.error("[reCAPTCHA Verify Contact] Failed! Error codes:", data["error-codes"]);
      return false;
    }
    
    if (data.score < 0.5) {
      console.warn(`[reCAPTCHA Verify Contact] Score too low (${data.score}). Failing request.`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[reCAPTCHA Verify Contact] Fetch Error:", error);
    return false;
  }
}

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

    // Verify reCAPTCHA token
    let isValidRecaptcha = true;
    
    // Only verify reCAPTCHA in production to avoid localhost issues
    if (process.env.NODE_ENV === "production") {
      isValidRecaptcha = await verifyRecaptcha(data.recaptchaToken);
    }

    if (!isValidRecaptcha) {
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
          service: data.service,
          other_service: data.otherService || null,
          message: data.message || null,
          ip_address:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown",
          user_agent: request.headers.get("user-agent"),
          booking_status: "new",
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));

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
    sendBookingNotifications({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      service: data.service,
      otherService: data.otherService,
      message: data.message,
    }).catch((emailError) => {
      // Log email errors but don't fail the request
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
