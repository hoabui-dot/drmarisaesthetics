import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = (process.env.STRAPI_URL || "http://drmaris-strapi:22345").replace(/\/$/, "");

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Serves public Strapi uploads through the frontend origin.
 *
 * Browser requests use /api/strapi-media/... while the server fetches
 * STRAPI_URL (http://strapi:22345 in production Docker). This is required because
 * localhost:22345 is the host's address in a browser, but is the frontend
 * container itself when Next Image optimizes an image server-side.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  if (!path?.length || path[0] !== "uploads" || path.length < 2 || path.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"))) {
    return NextResponse.json({ error: "Media path is required" }, { status: 400 });
  }

  const upstreamPath = path.map(encodeURIComponent).join("/");
  const upstreamUrl = `${STRAPI_URL}/${upstreamPath}${request.nextUrl.search}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: request.headers.get("accept") || "image/*",
      },
      // Strapi upload URLs are generated per uploaded asset (normally with a
      // unique suffix), so they can be cached for repeat visits.
      next: { revalidate: 31_536_000 },
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse("Strapi media not found", { status: upstream.status || 404 });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    if (contentType) headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    headers.set("cache-control", "public, max-age=31536000, s-maxage=31536000, immutable");

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (error) {
    console.error("[Strapi media proxy] failed", { error });
    return NextResponse.json({ error: "Unable to fetch Strapi media" }, { status: 502 });
  }
}
