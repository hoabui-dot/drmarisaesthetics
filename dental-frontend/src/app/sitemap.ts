import type { MetadataRoute } from "next";
import { apiClient } from "@/src/lib/api/client";
import { SITEMAP_CACHE_TAG } from "@/src/lib/seo/sitemap-cache";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
const FREQUENCIES = new Set<ChangeFrequency>(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]);
const SAFE_DEFAULT_FREQUENCY: ChangeFrequency = "weekly";
const SAFE_DEFAULT_PRIORITY = 0.5;

interface SitemapDefaults { sitemap_enabled?: boolean; sitemap_default_change_frequency?: unknown; sitemap_default_priority?: unknown; }
interface Entry {
  slug?: string;
  updatedAt?: string;
  publishedAt?: string;
  no_index?: boolean;
  seo?: {
    no_index?: boolean;
    canonical_url?: string | null;
  } | { data?: { attributes?: Entry["seo"] } | null } | null;
}
interface CanonicalRule { source_path?: string; canonical_url?: string; is_active?: boolean; }

const origin = () => (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:1234").replace(/\/$/, "");
type StaticRoute = { path: string; endpoint?: string };
const staticRoutes: StaticRoute[] = [
  { path: "/", endpoint: "/api/homepage" },
  { path: "/about-us", endpoint: "/api/about-page" },
  { path: "/services", endpoint: "/api/services-overview" },
  { path: "/contact", endpoint: "/api/contact-page" },
  { path: "/news" },
  { path: "/customers", endpoint: "/api/customer" },
];

function normalizePath(value: string): string { const path = value.split(/[?#]/)[0].replace(/\/{2,}/g, "/").replace(/\/$/, ""); return path || "/"; }
function normalizeSeo(value: Entry["seo"]): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  const candidate = value as { data?: { attributes?: Record<string, unknown> } | null } & Record<string, unknown>;
  return (candidate.data?.attributes || candidate) as Record<string, unknown>;
}
function validFrequency(value: unknown): ChangeFrequency | undefined { return typeof value === "string" && FREQUENCIES.has(value as ChangeFrequency) ? value as ChangeFrequency : undefined; }
function validPriority(value: unknown): number | undefined { const priority = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN; return Number.isFinite(priority) && priority >= 0 && priority <= 1 ? priority : undefined; }
function isoDate(value?: string): string | undefined { if (!value) return undefined; const date = new Date(value); return Number.isNaN(date.getTime()) ? undefined : date.toISOString(); }
function canonicalUrl(path: string, entry: Entry, rules: Map<string, string>): string {
  const seo = normalizeSeo(entry.seo);
  const pageCanonical = typeof seo.canonical_url === "string" && /^https:\/\//i.test(seo.canonical_url) ? seo.canonical_url : undefined;
  const ruleCanonical = rules.get(normalizePath(path));
  return pageCanonical || (ruleCanonical && /^https:\/\//i.test(ruleCanonical) ? ruleCanonical : `${origin()}${normalizePath(path)}`);
}

function resolveEntry(path: string, entry: Entry, settings: SitemapDefaults, rules: Map<string, string>): MetadataRoute.Sitemap[number] | null {
  const seo = normalizeSeo(entry.seo);
  if (entry.no_index || seo.no_index === true || settings.sitemap_enabled === false) return null;
  const frequency = validFrequency(settings.sitemap_default_change_frequency) ?? SAFE_DEFAULT_FREQUENCY;
  const priority = validPriority(settings.sitemap_default_priority) ?? SAFE_DEFAULT_PRIORITY;
  return { url: canonicalUrl(path, entry, rules), lastModified: isoDate(entry.updatedAt || entry.publishedAt), changeFrequency: frequency, priority };
}

async function fetchAll<T>(endpoint: string, params: Record<string, unknown>, tags: string[]): Promise<T[]> {
  const results: T[] = [];
  for (let page = 1; page <= 100; page += 1) {
    try {
      const response = await apiClient<{ data?: T[]; meta?: { pagination?: { pageCount?: number } } }>(endpoint, { params: { ...params, pagination: { page, pageSize: 100 } }, tags: [...new Set([...tags, SITEMAP_CACHE_TAG])] });
      results.push(...(response.data || []));
      if (!response.meta?.pagination?.pageCount || page >= response.meta.pagination.pageCount) break;
    } catch { break; }
  }
  return results;
}
async function getSettings(): Promise<SitemapDefaults> {
  try {
    const response = await apiClient<{ data?: SitemapDefaults }>("/api/seo-manager-settings", { params: { populate: "*" }, tags: ["seo-manager-settings", SITEMAP_CACHE_TAG] });
    return response.data || {};
  } catch {
    return {};
  }
}
async function getCanonicalRules(): Promise<Map<string, string>> { const rules = await fetchAll<CanonicalRule>("/api/canonical-rules", { filters: { is_active: { $eq: true } } }, ["canonical-rules"]); return new Map(rules.filter((rule) => rule.source_path && rule.canonical_url).map((rule) => [normalizePath(rule.source_path!), rule.canonical_url!])); }
async function getSingleEntry(endpoint?: string): Promise<Entry> { if (!endpoint) return {}; try { const response = await apiClient<{ data?: Entry }>(endpoint, { params: { populate: { seo: true } }, tags: [endpoint || "static-page", SITEMAP_CACHE_TAG] }); return response.data || {}; } catch { return {}; } }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, canonicalRules] = await Promise.all([getSettings(), getCanonicalRules()]);
  if (settings.sitemap_enabled === false) return [];
  const entries: MetadataRoute.Sitemap = [];
  const staticEntries = await Promise.all(staticRoutes.map(async (route) => ({ route, entry: await getSingleEntry(route.endpoint) })));
  for (const { route, entry } of staticEntries) { const item = resolveEntry(route.path, entry, settings, canonicalRules); if (item) entries.push(item); }

  const reservedSlugs = new Set(staticRoutes.map((route) => route.path.replace(/^\//, "")).filter(Boolean));
  const pages = await fetchAll<Entry>("/api/pages", { populate: { seo: true } }, ["pages"]);
  for (const page of pages) { if (!page.slug || reservedSlugs.has(page.slug)) continue; const item = resolveEntry(`/${page.slug}`, page, settings, canonicalRules); if (item) entries.push(item); }
  const services = await fetchAll<Entry>("/api/service-details", { populate: { seo: true } }, ["service-details"]);
  for (const service of services) { if (!service.slug) continue; const item = resolveEntry(`/services/${service.slug}`, service, settings, canonicalRules); if (item) entries.push(item); }
  const blogs = await fetchAll<Entry>("/api/blogs", { populate: { seo: true } }, ["blogs"]);
  for (const blog of blogs) { if (!blog.slug) continue; const item = resolveEntry(`/news/${blog.slug}`, blog, settings, canonicalRules); if (item) entries.push(item); }
  return entries;
}

export const dynamic = "force-dynamic";
export const revalidate = 300;
