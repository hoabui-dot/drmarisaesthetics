#!/usr/bin/env node

/**
 * Remove the superseded service-detail implementation.
 *
 * Deliberately preserves `service_details` and every
 * `components_service_detail_*` tables power `/services/[slug]`.
 */
const { Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST || "dental-postgres",
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
});

async function run() {
  await client.connect();
  try {
    await client.query("BEGIN");

    // Remove media links owned by the deleted single type before dropping its tables.
    await client.query(
      "DELETE FROM files_related_mph WHERE related_type = 'api::dental-bleaching.dental-bleaching'",
    );

    // Remove the old Page collection records that represented the former detail pages.
    const legacyPages = await client.query(
      "SELECT id FROM pages WHERE slug = ANY($1)",
      [["implant", "invisalign", "veneer", "whitening"]],
    );
    if (legacyPages.rows.length) {
      const ids = legacyPages.rows.map((row) => row.id);
      await client.query(
        "DELETE FROM files_related_mph WHERE related_type = 'api::page.page' AND related_id = ANY($1)",
        [ids],
      );
      await client.query("DELETE FROM pages WHERE id = ANY($1)", [ids]);
    }

    // Drop only the old dental-bleaching content type and its component tables.
    await client.query("DROP TABLE IF EXISTS dental_bleachings_cmps CASCADE");
    await client.query("DROP TABLE IF EXISTS dental_bleachings CASCADE");
    await client.query("DROP TABLE IF EXISTS components_dental_bleaching_ctas CASCADE");
    await client.query("DROP TABLE IF EXISTS components_services_overview_service_items CASCADE");

    // Remove stale public permissions for the deleted API, when present.
    await client.query(
      "DELETE FROM up_permissions WHERE action LIKE 'api::dental-bleaching.%'",
    );

    await client.query("COMMIT");
    const oldType = await client.query(
      "SELECT to_regclass('public.dental_bleachings') AS table_name",
    );
    const newType = await client.query(
      "SELECT COUNT(*)::int AS count FROM service_details",
    );
    console.log(
      `[LEGACY SERVICE CLEANUP] old table: ${oldType.rows[0].table_name || "removed"}; preserved service_details: ${newType.rows[0].count}`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[LEGACY SERVICE CLEANUP] failed: ${error.message}`);
  process.exitCode = 1;
});
