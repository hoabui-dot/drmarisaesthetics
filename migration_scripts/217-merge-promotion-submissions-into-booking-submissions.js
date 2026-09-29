#!/usr/bin/env node

/**
 * Manual data migration for the unified Form Submissions collection.
 *
 * Default mode is a dry run. Use --write to create booking submissions and
 * --delete-source only after the copied records have been verified.
 */

const baseUrl = (process.env.STRAPI_MIGRATION_URL || "http://127.0.0.1:22345").replace(/\/$/, "");
const token = process.env.STRAPI_API_TOKEN;
const shouldWrite = process.argv.includes("--write");
const shouldDelete = process.argv.includes("--delete-source");

if (!token) {
  console.error("STRAPI_API_TOKEN is required for this manual migration.");
  process.exit(1);
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path} failed (${response.status}): ${body?.error?.message || "unknown error"}`);
  return body;
}

const unwrap = (item) => item?.attributes ? { id: item.id, documentId: item.documentId, ...item.attributes } : item;

async function getAll(path) {
  const records = [];
  for (let page = 1; ; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const result = await request(`${path}${separator}pagination[page]=${page}&pagination[pageSize]=100`);
    const pageData = Array.isArray(result.data) ? result.data : [];
    records.push(...pageData.map(unwrap));
    if (pageData.length < 100) return records;
  }
}

const keyFor = (record) => `${String(record.phone_number || "").trim()}|${String(record.message || record.promotion_name || "").trim()}`;

async function main() {
  const legacy = await getAll("/api/promotion-submissions");
  const existing = await getAll("/api/booking-submissions?filters[submission_type][$eq]=promotion");
  const existingKeys = new Set(existing.map(keyFor));
  const candidates = legacy.filter((record) => !existingKeys.has(keyFor(record)));

  console.log(`Legacy promotion records: ${legacy.length}`);
  console.log(`Existing unified promotion records: ${existing.length}`);
  console.log(`Records to merge: ${candidates.length}`);
  if (!candidates.length) return;
  if (!shouldWrite) {
    console.log("Dry run only. Re-run with --write to create these records.");
    return;
  }

  for (const record of candidates) {
    const promotionName = record.promotion_name || record.promotionName;
    const created = await request("/api/booking-submissions", {
      method: "POST",
      body: JSON.stringify({ data: {
        full_name: null,
        phone_number: record.phone_number || null,
        country: null,
        email: null,
        service: null,
        other_service: null,
        message: promotionName ? `Claim Your Offer: ${promotionName}` : "Claim Your Offer",
        submission_type: "promotion",
        submission_source: "promotion_popup",
        booking_status: "new",
        ip_address: record.ip_address || null,
        user_agent: record.user_agent || null,
      } }),
    });
    const createdId = created?.data?.documentId || created?.data?.id;
    console.log(`Merged legacy record ${record.documentId || record.id} as ${createdId}`);

    if (shouldDelete && (record.documentId || record.id)) {
      await request(`/api/promotion-submissions/${record.documentId || record.id}`, { method: "DELETE" });
      console.log(`Deleted legacy record ${record.documentId || record.id}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
