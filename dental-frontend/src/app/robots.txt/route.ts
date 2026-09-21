import { NextResponse } from "next/server";
import { apiClient } from "@/src/lib/api/client";

interface RobotsRule { user_agent?: string; allow?: string; disallow?: string; }
interface RobotsSettings { indexingEnabled?: boolean; rules?: RobotsRule[]; additionalDirectives?: string; }
function lines(value?: string): string[] { return (value || "").split(/\r?\n|,/).map((line) => line.trim()).filter(Boolean); }

export async function GET() {
  let settings: RobotsSettings = {};
  try {
    const response = await apiClient<{ data?: RobotsSettings }>("/api/seo/robots", { tags: ["robots-settings"] });
    settings = response.data || {};
  } catch { /* Safe defaults below keep robots.txt available during CMS outages. */ }
  const configuredOrigin = process.env.NEXT_PUBLIC_SERVER_URL || process.env.FRONTEND_URL || "http://localhost:3000";
  const origin = new URL(configuredOrigin).origin;
  const output: string[] = [];
  const deploymentAllowsIndexing = process.env.SITE_INDEXING_ENABLED === undefined
    ? process.env.NODE_ENV === "production"
    : !["false", "0", "no", "off"].includes(process.env.SITE_INDEXING_ENABLED.toLowerCase());
  if (!deploymentAllowsIndexing || settings.indexingEnabled === false) {
    output.push("User-agent: *", "Disallow: /");
  } else {
    const configured = settings.rules?.length ? settings.rules : [{ user_agent: "*", allow: "/", disallow: "/admin/\n/api/\n/_next/" }];
    configured.forEach((rule) => {
      const userAgent = (rule.user_agent || "*").replace(/[^a-zA-Z0-9_*.-]/g, "");
      output.push(`User-agent: ${userAgent || "*"}`);
      lines(rule.allow).filter((path) => path.startsWith("/") && !path.startsWith("//")).forEach((path) => output.push(`Allow: ${path}`));
      lines(rule.disallow).filter((path) => path.startsWith("/") && !path.startsWith("//")).forEach((path) => output.push(`Disallow: ${path}`));
      output.push("");
    });
  }
  // The sitemap's public origin is deployment configuration, not editor
  // content. Ignore legacy CMS overrides so internal/tunnel URLs never leak.
  output.push(`Sitemap: ${origin}/sitemap.xml`);
  if (deploymentAllowsIndexing && settings.indexingEnabled !== false && settings.additionalDirectives) {
    output.push(...lines(settings.additionalDirectives).filter((directive) => /^(?:Clean-param|Host):\s*[^\r\n]+$/i.test(directive)));
  }
  return new NextResponse(`${output.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
}

export const dynamic = "force-dynamic";
export const revalidate = 300;
