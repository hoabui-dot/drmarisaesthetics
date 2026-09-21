import { childSitemapResponse } from "@/src/lib/seo/sitemap-route";

export async function GET() {
  try { return await childSitemapResponse("page"); }
  catch { return new Response("Sitemap is temporarily unavailable.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
}

export const dynamic = "force-dynamic";
export const revalidate = 300;
