import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = (process.env.STRAPI_URL || "http://drmaris-strapi:22345").replace(/\/$/, "");
const configuredToken = process.env.STRAPI_API_TOKEN;
// A local placeholder must not be sent as a Bearer token. Strapi treats an
// invalid token as 401 before evaluating the public read permission.
const STRAPI_TOKEN = configuredToken && configuredToken !== "local-api-token"
  ? configuredToken
  : undefined;

function normalize(path: string): string { return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/"; }
function safeDestination(source: string, destination: string): string | null {
  if (!destination) return null;
  try {
    const target = new URL(destination, "https://redirect.invalid");
    if (target.origin === "https://redirect.invalid") {
      const path = normalize(`${target.pathname}${target.search}`);
      return path === source || path.startsWith(`${source}/`) ? null : path;
    }
    return target.protocol === "http:" || target.protocol === "https:" ? destination : null;
  } catch { return null; }
}

export async function middleware(request: NextRequest) {
  const path = normalize(request.nextUrl.pathname);
  if (path.startsWith("/_next") || path.startsWith("/api") || path === "/robots.txt" || path === "/sitemap.xml") return NextResponse.next();
  try {
    const query = new URLSearchParams({
      "filters[source_path][$eq]": path,
      "filters[is_active][$eq]": "true",
      "pagination[pageSize]": "1",
    });
    const response = await fetch(`${STRAPI_URL}/api/redirects?${query.toString()}`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : undefined,
      next: { revalidate: 300, tags: ["redirects"] },
    });
    if (!response.ok) return NextResponse.next();
    const payload = await response.json() as { data?: Array<{ source_path?: string; destination_path?: string; status_code?: string | number }> };
    const redirect = payload.data?.[0];
    const destination = safeDestination(path, redirect?.destination_path || "");
    if (!redirect || !destination) return NextResponse.next();
    const statusCode = Number(String(redirect.status_code || "").match(/30[1278]/)?.[0] || 301) as 301 | 302 | 307 | 308;
    return NextResponse.redirect(new URL(destination, request.url), statusCode);
  } catch { return NextResponse.next(); }
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
