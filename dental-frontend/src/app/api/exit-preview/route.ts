/**
 * Exit Preview Mode API Route
 *
 * Disables draft mode and returns user to normal published content.
 * Called when user clicks "Exit Preview" button.
 */

import { NextRequest, NextResponse } from "next/server";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Next's draftMode().disable() uses Secure in production. The current
  // deployment is accessed over HTTP, so that deletion cookie is ignored by
  // the browser and the draft cookie survives navigation. Delete it with the
  // same attributes as the preview route for the actual origin.
  const isHttps = request.nextUrl.protocol === "https:";
  // Use a relative Location header so reverse proxies do not expose the
  // container's internal 0.0.0.0:3000 address.
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: `/?_t=${Date.now()}` },
  });
  response.cookies.set("__prerender_bypass", "", {
    expires: new Date(0),
    httpOnly: true,
    maxAge: 0,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
    path: "/",
  });

  return response;
}
