#!/usr/bin/env node

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 100: Remove Footer Social Links");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Remove social_links from footer ──────────────────────────
    console.log("STEP 1: Removing social_links from footer...");
    const deleteLinks = await client.query(`
      DELETE FROM footers_cmps
      WHERE component_type = 'footer.social-link'
      RETURNING id
    `);
    console.log(
      `  [OK] Deleted ${deleteLinks.rows.length} social link relations\n`,
    );

    // ── STEP 2: Drop social links component table ────────────────────────
    console.log("STEP 2: Dropping social links component table...");
    await client.query(`
      DROP TABLE IF EXISTS components_footer_social_links CASCADE
    `);
    console.log("  [OK] Dropped components_footer_social_links table\n");

    // ── STEP 3: Verify footer structure ──────────────────────────────────
    console.log("STEP 3: Verifying footer structure...");
    const footerComponents = await client.query(`
      SELECT component_type, COUNT(*) as count
      FROM footers_cmps
      GROUP BY component_type
      ORDER BY component_type
    `);

    console.log("  Footer components:");
    footerComponents.rows.forEach((row) => {
      console.log(`    - ${row.component_type}: ${row.count}`);
    });
    console.log();

    console.log("=".repeat(70));
    console.log("MIGRATION 100 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to reload schema");
    console.log("  2. Social links now managed in frontend constants");
    console.log("  3. Test footer display\n");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
