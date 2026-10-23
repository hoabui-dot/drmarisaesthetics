/**
 * Resolve Strapi media values to the same-origin media proxy.
 * Kept separate from the server API client so client components can use it
 * without importing server environment validation or API credentials.
 */
type MediaRecord = Record<string, unknown>;
const MEDIA_PROXY_PREFIX = "/api/strapi-media";
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "strapi", "drmaris-strapi"]);

function asRecord(value: unknown): MediaRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as MediaRecord
    : undefined;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function configuredStrapiHostname(): string | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!configuredUrl) return undefined;
  try {
    return new URL(configuredUrl).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

/** Normalize only Strapi upload URLs; leave unrelated/external assets untouched. */
export function normalizeStrapiMediaUrl(value: string): string {
  if (!value || value.startsWith(`${MEDIA_PROXY_PREFIX}/`)) return value;
  if (value.startsWith("/uploads/")) return `${MEDIA_PROXY_PREFIX}${value}`;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return value;
  }

  if (!parsed.pathname.startsWith("/uploads/")) return value;
  const hostname = parsed.hostname.toLowerCase();
  if (hostname !== configuredStrapiHostname() && !LOOPBACK_HOSTS.has(hostname)) return value;

  // Keep the exact upload path (including encoded filenames) and query string.
  return `${MEDIA_PROXY_PREFIX}${parsed.pathname}${parsed.search}`;
}

/** Recursively normalize media URLs in Strapi API payloads before adapters consume them. */
export function normalizeStrapiMediaUrls<T>(value: T): T {
  if (typeof value === "string") {
    return (value.includes("/uploads/") ? normalizeStrapiMediaUrl(value) : value) as T;
  }
  if (Array.isArray(value)) return value.map((item) => normalizeStrapiMediaUrls(item)) as T;
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, normalizeStrapiMediaUrls(child)]),
  ) as T;
}

export function getMediaUrl(media: unknown, size?: string): string {
  if (!media) return "";

  if (typeof media === "string") {
    return normalizeStrapiMediaUrl(media);
  }

  let url = "";
  const source = asRecord(Array.isArray(media) ? media[0] : media);
  if (!source) return "";

  const entity = asRecord(source.data) || source;
  const attributes = asRecord(entity.attributes) || entity;
  const formats = asRecord(attributes.formats) || asRecord(entity.formats) || asRecord(source.formats);
  const sizeUrl = size && formats ? stringValue(asRecord(formats[size])?.url) : undefined;

  if (sizeUrl) url = sizeUrl;
  else url = stringValue(attributes.url) || stringValue(entity.url) || "";
  if (!url) url = stringValue(source.url) || "";
  if (!url) return "";
  return normalizeStrapiMediaUrl(url);
}
