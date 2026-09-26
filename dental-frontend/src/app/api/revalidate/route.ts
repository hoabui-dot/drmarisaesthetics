/**
 * On-Demand Revalidation API Route
 *
 * Handles webhook requests from Strapi CMS to invalidate Next.js cache.
 * Triggered when content is created, updated, published, or deleted.
 *
 * Security:
 * - Validates webhook secret from Strapi
 * - Rejects unauthorized requests
 * - Logs all revalidation attempts
 *
 * Flow:
 * 1. Strapi content changes
 * 2. Strapi sends webhook to this endpoint
 * 3. Validate secret
 * 4. Revalidate cache tags/paths
 * 5. Return success response
 */

import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { SITEMAP_CACHE_TAG, SITEMAP_WEBHOOK_EVENTS } from "@/src/lib/seo/sitemap-cache";

// Webhook secret from environment
const WEBHOOK_SECRET = process.env.STRAPI_WEBHOOK_SECRET;

// Model to tag mapping
const MODEL_TAG_MAP: Record<string, string[]> = {
  page: ["pages", "page"],
  article: ["articles", "article"],
  "bai-viet": ["articles", "bai-viet", "blogs"],
  blog: ["blogs", "article"],
  category: ["categories", "category"],
  navigation: ["navigation"],
  footer: ["footer"],
  homepage: ["homepage"],
  "about-page": ["about-page"],
  "contact-page": ["contact-page"],
  news: ["blogs", "news"],
  "seo-manager-settings": ["seo-manager-settings", "structured-data-settings"],
  service: ["services", "service"],
  "service-category": ["services", "service-categories"],
  "our-team": ["our-team"],
  result: ["result"],
  "treatments-page": ["treatments-page"],
  "deep-plane-facelift-specialist": ["deep-plane-facelift-specialist"],
  "robots-settings": ["robots-settings"],
  redirect: ["redirects"],
  "canonical-rule": ["canonical-rules"],
};

// Model to path mapping for specific revalidation
const MODEL_PATH_MAP: Record<string, string[]> = {
  page: ["/"],
  article: ["/", "/news"],
  "bai-viet": ["/", "/news"],
  blog: ["/", "/news"],
  "about-page": ["/about-us"],
  "contact-page": ["/contact"],
  homepage: ["/"],
  "seo-manager-settings": ["/robots.txt", "/sitemap.xml", "/"],
  service: ["/services"],
  "service-category": ["/services"],
  "our-team": ["/our-team", "/our-team/dr-huy"],
  result: ["/results"],
  "treatments-page": ["/treatments"],
  "deep-plane-facelift-specialist": ["/deep-plane-facelift-specialist", "/our-team/dr-cuong"],
  "robots-settings": ["/robots.txt"],
  "sitemap-manager-settings": ["/sitemap.xml"],
  "canonical-rule": ["/sitemap.xml"],
};

/** Only these Strapi models can change the set or metadata of public sitemap URLs. */
const SITEMAP_RELEVANT_MODELS = new Set([
  "homepage",
  "about-page",
  "contact-page",
  "page",
  "blog",
  "service",
  "our-team",
  "result",
  "treatments-page",
  "deep-plane-facelift-specialist",
  "news",
  "seo-manager-settings",
  "robots-settings",
  "canonical-rule",
]);

const SITEMAP_PUBLIC_PATHS = ["/sitemap.xml", "/service-sitemap.xml", "/news-sitemap.xml", "/page-sitemap.xml"];

interface WebhookPayload {
  event: string;
  model?: string;
  uid?: string;
  contentType?: string;
  type?: string;
  entry?: {
    id?: number;
    documentId?: string;
    slug?: string;
    [key: string]: unknown;
  };
  // Strapi v4 payload structure
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/**
 * Extract model name from Strapi webhook payload
 * Strapi sends model in format: "api::page.page" or just "page"
 */
function extractModelName(payload: WebhookPayload): string | null {
  // Try direct model field
  if (payload.model) {
    // Extract from "api::page.page" format
    const match = payload.model.match(/api::([^.]+)\./);
    return match ? match[1] : payload.model;
  }

  for (const candidate of [payload.uid, payload.contentType, payload.type]) {
    if (candidate && candidate !== "entry") return candidate;
  }

  // Check if entry has __type or similar field
  if (payload.entry && typeof payload.entry === "object") {
    const entry = payload.entry as Record<string, unknown>;
    if (entry.__type) {
      return String(entry.__type);
    }
  }

  return null;
}

function normalizeEvent(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return SITEMAP_WEBHOOK_EVENTS.has(value) ? value : null;
}

function normalizeModelName(value: string): string {
  const match = value.match(/(?:api|content)::([^\.]+)\./);
  return (match ? match[1] : value).replace(/_/g, "-");
}

function isSitemapRelevant(modelName: string): boolean {
  return SITEMAP_RELEVANT_MODELS.has(normalizeModelName(modelName));
}

function sitemapEntryPath(modelName: string, slug?: string): string | null {
  if (!slug) return null;
  const model = normalizeModelName(modelName);
  if (model === "blog" || model === "news") return `/news/${slug}`;
  if (model === "service") return `/services/${slug}`;
  return `/${slug}`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    if (!WEBHOOK_SECRET) {
      console.error("[Webhook] STRAPI_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
    }

    // 1. Validate webhook secret (Strapi UI "Headers" or built-in "Secret")
    const secret = request.headers.get("x-strapi-secret") || 
                   request.headers.get("authorization")?.replace("Bearer ", "");

    if (!secret || secret !== WEBHOOK_SECRET) {
      console.warn("[Webhook] Unauthorized request. Missing or invalid secret.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse webhook payload
    const payload: WebhookPayload = await request.json();

    // 3. Validate the Strapi lifecycle event. Media events do not change the URL set.
    const event = normalizeEvent(payload.event);
    if (!event) {
      console.info(`[Webhook] Ignored unsupported event: ${String(payload.event || "unknown")}`);
      return NextResponse.json({ revalidated: false, ignored: true, reason: "unsupported-event" }, { status: 202 });
    }

    // 4. Extract model name
    const modelName = extractModelName(payload);

    // 5. Unknown models must not be able to trigger arbitrary cache invalidation.
    if (!modelName) {
      return NextResponse.json({
        revalidated: false,
        ignored: true,
        reason: "missing-model",
        timestamp: new Date().toISOString(),
      }, { status: 202 });
    }

    const normalizedModel = normalizeModelName(modelName);
    if (!isSitemapRelevant(normalizedModel)) {
      console.info(`[Webhook] Ignored non-sitemap model: ${normalizedModel}`);
      return NextResponse.json({ revalidated: false, ignored: true, model: normalizedModel, event }, { status: 202 });
    }

    // 6. Revalidate existing model tags plus the shared sitemap data cache.
    const tags = [...new Set([...(MODEL_TAG_MAP[normalizedModel] || [normalizedModel]), SITEMAP_CACHE_TAG])];
    const revalidatedTags: string[] = [];

    const revalidationErrors: string[] = [];
    for (const tag of tags) {
      try {
        revalidateTag(tag);
        revalidatedTags.push(tag);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown tag revalidation error";
        revalidationErrors.push(`tag:${tag}:${message}`);
        console.error(`[Webhook] Failed to revalidate tag ${tag}:`, error);
      }
    }

    // 7. Revalidate the sitemap index, child documents, human page, and model paths.
    const paths = [...new Set([...(MODEL_PATH_MAP[normalizedModel] || []), ...SITEMAP_PUBLIC_PATHS])];
    const revalidatedPaths: string[] = [];

    // Revalidate model-specific paths
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown path revalidation error";
        revalidationErrors.push(`path:${path}:${message}`);
        console.error(`[Webhook] Failed to revalidate path ${path}:`, error);
      }
    }

    // 8. Revalidate entry-specific path using the model's public route prefix.
    const entryPath = sitemapEntryPath(normalizedModel, payload.entry?.slug);
    if (entryPath) {
      try {
        revalidatePath(entryPath);
        revalidatedPaths.push(entryPath);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown entry path revalidation error";
        revalidationErrors.push(`path:${entryPath}:${message}`);
        console.error(`[Webhook] Failed to revalidate entry path ${entryPath}:`, error);
      }
    }

    // 8. Calculate execution time
    const executionTime = Date.now() - startTime;

    // 9. Return success response
    const response = {
      revalidated: true,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      model: modelName,
      event,
      entryId: payload.entry?.documentId || payload.entry?.id,
      slug: payload.entry?.slug,
      errors: revalidationErrors.length > 0 ? revalidationErrors : undefined,
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString(),
    };

    console.log(`[Webhook] Successfully revalidated: ${JSON.stringify({
      model: modelName,
      tags: revalidatedTags,
      paths: revalidatedPaths
    })}`);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;
