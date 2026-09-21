import { NEXT_PUBLIC_SERVER_URL } from "@/src/lib/env";
import type { SitemapGroup, SitemapItem } from "@/src/lib/seo/sitemap-data";

const XML_STYLESHEET_PI = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';

export function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

function validLastModified(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function publicOrigin(): string {
  const parsed = new URL(NEXT_PUBLIC_SERVER_URL);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Sitemap public origin must use HTTP or HTTPS.");
  }
  return parsed.origin;
}

function absolutePublicUrl(value: string, origin: string): string {
  const parsed = new URL(value, origin);
  if ((parsed.protocol !== "https:" && parsed.protocol !== "http:") || parsed.origin !== origin) {
    throw new Error("Sitemap URLs must be absolute or same-origin HTTP(S) URLs.");
  }
  return parsed.href;
}

export function renderSitemapIndex(groups: SitemapGroup[]): string {
  const origin = publicOrigin();
  const entries = groups.filter((group) => group.enabled && group.urlCount > 0).map((group) => {
    const loc = absolutePublicUrl(group.path, origin);
    const lastmod = validLastModified(group.lastModified);
    return `  <sitemap><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</sitemap>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n${XML_STYLESHEET_PI}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;
}

export function renderUrlSet(items: SitemapItem[]): string {
  const origin = publicOrigin();
  const entries = items.map((item) => {
    const loc = absolutePublicUrl(item.url, origin);
    const lastmod = validLastModified(item.lastModified);
    return `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n${XML_STYLESHEET_PI}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
}
