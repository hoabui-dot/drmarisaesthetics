#!/usr/bin/env node

/** Remove the obsolete About Us → Featured Services service_slug references. */
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
    await client.query("DROP TABLE IF EXISTS components_about_featured_services_cmps CASCADE");
    await client.query("DROP TABLE IF EXISTS components_about_featured_service_references CASCADE");
    await client.query("COMMIT");

    const featured = await client.query(
      "SELECT COUNT(*)::int AS count FROM components_about_featured_services",
    );
    console.log(
      `[ABOUT FEATURED SERVICES CLEANUP] preserved ${featured.rows[0].count} presentation components; service cards now come from service_details`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[ABOUT FEATURED SERVICES CLEANUP] failed: ${error.message}`);
  process.exitCode = 1;
});
