/**
 * Resolve Strapi media values to the same-origin media proxy.
 * Kept separate from the server API client so client components can use it
 * without importing server environment validation or API credentials.
 */
type MediaRecord = Record<string, unknown>;

function asRecord(value: unknown): MediaRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as MediaRecord
    : undefined;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function getMediaUrl(media: unknown, size?: string): string {
  if (!media) return "";

  if (typeof media === "string") {
    if (media.startsWith("/api/strapi-media/")) return media;
    return media.startsWith("/") ? `/api/strapi-media${media}` : media;
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
  if (url.startsWith("/")) return `/api/strapi-media${url}`;
  return url;
}
