import { NextResponse } from "next/server";
import { apiClient } from "@/src/lib/api/client";

interface RobotsRule { user_agent?: string; allow?: string; disallow?: string; }
interface RobotsSettings { indexing_enabled?: boolean; rules?: RobotsRule[]; sitemap_url?: string; additional_directives?: string; }
function lines(value?: string): string[] { return (value || "").split(/\r?\n|,/).map((line) => line.trim()).filter(Boolean); }

export async function GET() {
  let settings: RobotsSettings = {};
  try {
    const response = await apiClient<{ data?: RobotsSettings }>("/api/robots-settings", { params: { populate: "*" }, tags: ["robots-settings"] });
    settings = response.data || {};
  } catch { /* Safe defaults below keep robots.txt available during CMS outages. */ }
  const origin = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:1234").replace(/\/$/, "");
  const output: string[] = [];
  if (settings.indexing_enabled === false) {
    output.push("User-agent: *", "Disallow: /");
  } else {
    const configured = settings.rules?.length ? settings.rules : [{ user_agent: "*", allow: "/", disallow: "/admin/\n/api/\n/_next/" }];
    configured.forEach((rule) => {
      output.push(`User-agent: ${rule.user_agent || "*"}`);
      lines(rule.allow).forEach((path) => output.push(`Allow: ${path}`));
      lines(rule.disallow).forEach((path) => output.push(`Disallow: ${path}`));
      output.push("");
    });
  }
  output.push(`Sitemap: ${settings.sitemap_url || `${origin}/sitemap.xml`}`);
  if (settings.additional_directives) output.push(...lines(settings.additional_directives));
  return new NextResponse(`${output.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
}

export const dynamic = "force-dynamic";
export const revalidate = 300;
