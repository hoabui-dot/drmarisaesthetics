import { NextRequest, NextResponse } from "next/server";
import { sendPromotionNotification } from "@/src/lib/email/notifications";
import {
  isRecaptchaEnabled,
  shouldVerifyRecaptcha,
  verifyRecaptchaToken,
} from "@/src/lib/security/recaptcha";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, promotion_name, country, recaptchaToken } = body;

    if (!phone_number) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }

    // Verify reCAPTCHA only when the production runtime flag is enabled.
    if (shouldVerifyRecaptcha()) {
      if (
        typeof recaptchaToken !== "string" ||
        !(await verifyRecaptchaToken(recaptchaToken))
      ) {
        return NextResponse.json(
          { success: false, error: "Security verification failed." },
          { status: 400 },
        );
      }
    } else if (!isRecaptchaEnabled()) {
      console.info("[Promotion API] recaptcha-disabled");
    }

    // Submit to Strapi API
    const strapiUrl = process.env.STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiToken) {
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
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
          full_name: null,
          phone_number,
          country: country || null,
          email: null,
          service: null,
          message: promotion_name ? `Claim Your Offer: ${promotion_name}` : "Claim Your Offer",
          submission_type: "promotion",
          submission_source: "promotion_popup",
          booking_status: "new",
          ip_address:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown",
          user_agent: request.headers.get("user-agent"),
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: "Failed to save your submission.", details: errorData },
        { status: 500 },
      );
    }

    // Send email notifications (non-blocking)
    sendPromotionNotification({
      phoneNumber: phone_number,
      promotionName: promotion_name || "Special Offer",
    }).catch(() => {});

    return NextResponse.json(
      { success: true, message: "Thank you! We'll send your voucher shortly." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
