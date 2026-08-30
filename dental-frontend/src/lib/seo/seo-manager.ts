import type { Metadata } from "next";
import { apiClient } from "@/src/lib/api/client";

type MediaValue = unknown;

export interface PageSeoInput {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_image?: MediaValue;
  canonical_url?: string | null;
  no_index?: boolean | null;
  no_follow?: boolean | null;
  open_graph_title?: string | null;
  open_graph_description?: string | null;
  structured_data_enabled?: boolean | null;
  structured_data_json?: unknown;
}

interface SeoDefaults {
  default_meta_title?: string;
  meta_title_template?: string;
  default_meta_description?: string;
  default_open_graph_image?: MediaValue;
  site_name?: string;
  default_open_graph_title?: string;
  default_open_graph_description?: string;
}

const FALLBACKS = {
  title: "DR. MARIS AESTHETICS | Plastic Surgery in Vietnam",
  description: "Surgeon-led, hospital-based cosmetic surgery in Ho Chi Minh City for international patients.",
  siteName: "DR. MARIS AESTHETICS",
};

function first<T>(...values: Array<T | null | undefined | "">): T | undefined {
  return values.find((value): value is T => Boolean(value));
}

function mediaPath(media: MediaValue): string | undefined {
  if (typeof media === "string") return media;
  if (!media || typeof media !== "object") return undefined;
  const candidate = media as { url?: unknown; data?: { attributes?: { url?: unknown } | null } | null };
  const value = candidate.data?.attributes || candidate;
  return typeof value.url === "string" ? value.url : undefined;
}

function publicUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:1234").replace(/\/$/, "");
  if (path.startsWith("/uploads/")) return `${origin}/api/strapi-media${path}`;
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function normalizePath(value: string): string {
  try {
    const parsed = new URL(value, "https://canonical.invalid");
    const path = parsed.pathname.replace(/\/+/g, "/").replace(/\/$/, "");
    return path || "/";
  } catch {
    const path = value.split(/[?#]/)[0].replace(/\/+/g, "/").replace(/\/$/, "");
    return path || "/";
  }
}

function productionOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:1234";
  return configured.replace(/\/$/, "");
}

function absoluteCanonical(path: string): string {
  return `${productionOrigin()}${path === "/" ? "/" : path}`;
}

export async function resolveCanonicalUrl(path: string, pageSeo?: PageSeoInput | null): Promise<string> {
  const pageCanonical = typeof pageSeo?.canonical_url === "string" && /^https:\/\//i.test(pageSeo.canonical_url)
    ? pageSeo.canonical_url
    : undefined;
  return pageCanonical || (await getCanonicalOverride(path)) || absoluteCanonical(normalizePath(path));
}

function applyTitleTemplate(title: string, template?: string): string {
  if (!template || !template.includes("%page_title%") || title.includes("|") || title === FALLBACKS.title) return title;
  return template.replaceAll("%page_title%", title);
}

async function getDefaults(): Promise<SeoDefaults> {
  try {
    const response = await apiClient<{ data?: SeoDefaults }>("/api/seo-manager-settings", {
      params: { populate: "*" },
      tags: ["seo-manager-settings"],
    });
    return response.data || {};
  } catch {
    return {};
  }
}

async function getCanonicalOverride(path: string): Promise<string | undefined> {
  try {
    const response = await apiClient<{ data?: Array<{ source_path?: string; canonical_url?: string }> }>("/api/canonical-rules", {
      params: {
        "filters[source_path][$eq]": normalizePath(path),
        "filters[is_active][$eq]": true,
        "pagination[pageSize]": 1,
      },
      tags: ["canonical-rules"],
    });
    return response.data?.[0]?.canonical_url || undefined;
  } catch {
    return undefined;
  }
}

export async function buildSeoMetadata(options: {
  path: string;
  pageSeo?: PageSeoInput | null;
  title?: string | null;
  description?: string | null;
  image?: MediaValue;
  type?: "website" | "article";
}): Promise<Metadata> {
  const [defaults, canonicalOverride] = await Promise.all([
    getDefaults(),
    getCanonicalOverride(options.path),
  ]);
  const pageSeo = options.pageSeo || {};
  const title = applyTitleTemplate(
    first(pageSeo.meta_title, options.title, defaults.default_meta_title, FALLBACKS.title)!,
    defaults.meta_title_template,
  );
  const description = first(pageSeo.meta_description, options.description, defaults.default_meta_description, FALLBACKS.description)!;
  const image = first(mediaPath(pageSeo.meta_image), mediaPath(options.image), mediaPath(defaults.default_open_graph_image));
  const pageCanonical = typeof pageSeo.canonical_url === "string" && /^https:\/\//i.test(pageSeo.canonical_url) ? pageSeo.canonical_url : undefined;
  const canonicalPath = normalizePath(pageCanonical || canonicalOverride || options.path);
  const canonical = pageCanonical || canonicalOverride || absoluteCanonical(canonicalPath);
  const openGraphTitle = first(pageSeo.open_graph_title, defaults.default_open_graph_title, title)!;
  const openGraphDescription = first(pageSeo.open_graph_description, defaults.default_open_graph_description, description)!;
  const imageMetadata = image ? [{ url: publicUrl(image) }] : undefined;

  return {
    metadataBase: new URL(productionOrigin()),
    title,
    description,
    alternates: { canonical },
    robots: {
      index: pageSeo.no_index !== true,
      follow: pageSeo.no_follow !== true,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      siteName: defaults.site_name || FALLBACKS.siteName,
      type: options.type || "website",
      url: canonical,
      images: imageMetadata,
    },
  };
}

export { normalizePath, publicUrl };
