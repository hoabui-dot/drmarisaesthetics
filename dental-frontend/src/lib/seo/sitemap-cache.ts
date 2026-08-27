/** Shared cache tag for the runtime-generated sitemap and all of its source data. */
export const SITEMAP_CACHE_TAG = "sitemap";

export const SITEMAP_WEBHOOK_EVENTS = new Set([
  "entry.create",
  "entry.update",
  "entry.publish",
  "entry.unpublish",
  "entry.delete",
]);
