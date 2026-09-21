import { NextResponse } from "next/server";
import { getSitemapData, type SitemapItem } from "@/src/lib/seo/sitemap-data";
import { renderSitemapIndex, renderUrlSet } from "@/src/lib/seo/sitemap-xml";

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
};

export async function sitemapIndexResponse() {
  const data = await getSitemapData();
  return new NextResponse(renderSitemapIndex(data.sitemapGroups), { headers: XML_HEADERS });
}

export async function childSitemapResponse(group: SitemapItem["sitemapKey"]) {
  const data = await getSitemapData(group);
  const descriptor = data.sitemapGroups.find((candidate) => candidate.key === group);
  if (!descriptor?.enabled || descriptor.urlCount === 0 || data.items.length === 0) {
    return new NextResponse("Sitemap group is disabled or has no eligible URLs.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return new NextResponse(renderUrlSet(data.items), { headers: XML_HEADERS });
}
