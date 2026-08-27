/**
 * API Client
 *
 * Provides a wrapper around fetch for making requests to the CMS API.
 * Handles authentication, error handling, and response parsing.
 * Supports draft mode for preview functionality.
 *
 * Retry strategy: On network errors (ETIMEDOUT, ECONNRESET, fetch failed)
 * we retry up to MAX_RETRIES times with exponential back-off.
 * This prevents first-load failures when the Strapi tunnel/server is slow.
 */

import { unstable_noStore as noStore } from "next/cache";
import qs from "qs";
import { STRAPI_URL, STRAPI_API_TOKEN } from "@/src/lib/env";

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
  isDraftMode?: boolean;
  tags?: string[]; // Cache tags for revalidation
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 300;

/** Sleep helper */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns true if the error looks like a transient network failure */
function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("fetch failed") ||
    msg.includes("etimedout") ||
    msg.includes("econnreset") ||
    msg.includes("econnrefused") ||
    msg.includes("network") ||
    msg.includes("socket hang up")
  );
}

/**
 * Fetch data from CMS API
 *
 * @param endpoint - API endpoint (e.g., '/api/pages')
 * @param options - Fetch options including params and draft mode
 * @returns Parsed JSON response
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, isDraftMode, tags, ...fetchOptions } = options;

  // CRITICAL: Opt out of caching for draft mode
  if (isDraftMode) {
    noStore();
  }

  // Build URL with query parameters
  const url = new URL(endpoint, STRAPI_URL);
  const queryObj: Record<string, any> = { ...params };

  if (isDraftMode) {
    queryObj.status = "draft";
    queryObj._t = Date.now().toString();
  } else {
    queryObj.status = "published";
  }

  url.search = qs.stringify(queryObj, { encodeValuesOnly: true });

  // Set default headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authentication token if available
  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  // Merge with custom headers
  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }

  // Build fetch config once — avoid revalidate:0 + force-cache conflict
  const fetchConfig: RequestInit & { next?: NextFetchRequestConfig } = {
    ...fetchOptions,
    headers,
    // Draft mode: never cache. Production: static + webhook + 60s fallback revalidation.
    cache: isDraftMode ? "no-store" : "force-cache",
    next: isDraftMode
      ? undefined
      : {
          tags: tags || [],
          revalidate: 60, // Fallback: revalidate every 60 seconds even if webhook fails
          ...fetchOptions.next,
        },
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url.toString(), fetchConfig);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES && isRetryable(error)) {
        const delay = BASE_DELAY_MS * attempt; // 300ms, 600ms, 900ms
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  // Should never reach here, but satisfy TypeScript
  throw lastError;
}
