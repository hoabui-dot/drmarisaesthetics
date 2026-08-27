import { NextRequest, NextResponse } from "next/server";
import { sendPromotionNotification } from "@/src/lib/email/notifications";

/**
 * Verify reCAPTCHA token with Google API
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return false;

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
    console.log("[reCAPTCHA Verify Promotion] Full Response:", data);

    if (!data.success) {
      console.error("[reCAPTCHA Verify Promotion] Failed! Error codes:", data["error-codes"]);
      return false;
    }
    
    if (data.score < 0.5) {
      console.warn(`[reCAPTCHA Verify Promotion] Score too low (${data.score}). Failing request.`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[reCAPTCHA Verify Promotion] Fetch Error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, promotion_name, recaptchaToken } = body;

    if (!phone_number) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }

    // Verify reCAPTCHA token
    let isValidRecaptcha = true;
    if (process.env.NODE_ENV === "production" && recaptchaToken) {
      isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    }

    if (!isValidRecaptcha && recaptchaToken) {
      return NextResponse.json(
        { success: false, error: "Security verification failed." },
        { status: 400 },
      );
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

    const strapiResponse = await fetch(`${strapiUrl}/api/promotion-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          phone_number: phone_number,
          promotion_status: "new",
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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
