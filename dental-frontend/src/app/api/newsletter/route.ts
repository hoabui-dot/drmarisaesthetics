import { NextRequest, NextResponse } from "next/server";
import { sendBookingNotifications } from "@/src/lib/email/notifications";
import {
  isRecaptchaEnabled,
  shouldVerifyRecaptcha,
  verifyRecaptchaToken,
} from "@/src/lib/security/recaptcha";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    if (shouldVerifyRecaptcha()) {
      if (
        typeof body.recaptchaToken !== "string" ||
        !(await verifyRecaptchaToken(body.recaptchaToken))
      ) {
        return NextResponse.json({ success: false, error: "Security verification failed." }, { status: 400 });
      }
    } else if (!isRecaptchaEnabled()) {
      console.info("[Newsletter API] recaptcha-disabled");
    }

    const token = process.env.STRAPI_API_TOKEN;
    const strapiUrl = process.env.STRAPI_URL;
    if (!token || !strapiUrl) {
      return NextResponse.json({ success: false, error: "Server configuration error." }, { status: 500 });
    }

    const response = await fetch(`${strapiUrl}/api/booking-submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        data: {
          full_name: null,
          phone_number: null,
          country: typeof body.country === "string" ? body.country : null,
          email,
          service: null,
          message: null,
          submission_type: "newsletter",
          submission_source: "blog_newsletter",
          booking_status: "new",
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
          user_agent: request.headers.get("user-agent"),
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Failed to save your subscription." }, { status: 500 });
    }

    void sendBookingNotifications({ email, submissionType: "newsletter", submissionSource: "blog_newsletter" }).catch((error) => {
      console.error("[Newsletter API] email-notification-failed", error instanceof Error ? error.message : "unknown");
    });
    return NextResponse.json({ success: true, message: "You are subscribed." });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
