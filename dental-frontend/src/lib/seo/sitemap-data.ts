import { apiClient } from "@/src/lib/api/client";
import { SITEMAP_CACHE_TAG } from "@/src/lib/seo/sitemap-cache";

export interface SitemapItem {
  url: string;
  path: string;
  label: string;
  group: string;
  sitemapKey: "service" | "news" | "page";
  contentType: string;
  locale: string;
  lastModified?: string;
  adminEditUrl?: string;
}

export interface SitemapGroup {
  key: SitemapItem["sitemapKey"];
  label: string;
  path: string;
  enabled: boolean;
  urlCount: number;
  lastModified?: string;
}

export interface SitemapData {
  generatedAt: string;
  locale: string;
  locales: string[];
  sitemapGroups: SitemapGroup[];
  items: SitemapItem[];
}

export async function getSitemapData(group?: SitemapItem["sitemapKey"]): Promise<SitemapData> {
  const response = await apiClient<{ data?: SitemapData }>("/api/seo/sitemap", {
    params: group ? { group } : undefined,
    tags: [SITEMAP_CACHE_TAG],
  });
  const data = response?.data;
  if (!data || !Array.isArray(data.items) || !Array.isArray(data.sitemapGroups)) {
    throw new Error("Strapi returned an invalid sitemap payload.");
  }
  return data;
}
