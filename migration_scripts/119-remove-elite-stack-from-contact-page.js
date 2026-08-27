#!/usr/bin/env node

/**
 * Migration Script 119: Remove Elite Stack from Contact Page
 *
 * Changes:
 *  1. Remove all rows from contact_pages_cmps where component_type = 'contact.elite-stack'
 *  2. Remove icon_image media links from files_related_mph for elite-stack-card
 *  3. DROP components_contact_elite_stacks_cards_cmps link table
 *  4. DROP components_contact_elite_stack_cards table
 *  5. DROP components_contact_elite_stacks table
 *
 * Schema files removed separately:
 *  - strapi-cms/src/components/contact/elite-stack.json
 *  - strapi-cms/src/components/contact/elite-stack-card.json
 *  (Keep the JSON files for now — Strapi will ignore them once removed from the dynamic zone)
 *
 * Run (dev):
 *   node migration_scripts/119-remove-elite-stack-from-contact-page.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/119-remove-elite-stack-from-contact-page.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function tableExists(client, tableName) {
  const res = await client.query(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_name = $1
     ) AS exists`,
    [tableName],
  );
  return res.rows[0].exists;
}

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 119: Remove Elite Stack from Contact Page");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Remove from contact_pages_cmps ────────────────────────────
    console.log("STEP 1: Removing elite-stack blocks from contact_pages_cmps...");
    if (await tableExists(client, "contact_pages_cmps")) {
      const deleted = await client.query(`
        DELETE FROM contact_pages_cmps
        WHERE component_type = 'contact.elite-stack'
        RETURNING id, entity_id, cmp_id
      `);
      if (deleted.rowCount > 0) {
        console.log(`  [OK] Removed ${deleted.rowCount} row(s) from contact_pages_cmps`);
        deleted.rows.forEach((r) =>
          console.log(`    entity_id=${r.entity_id}, cmp_id=${r.cmp_id}`),
        );
      } else {
        console.log("  [OK] No elite-stack rows found in contact_pages_cmps (already clean)");
      }
    } else {
      console.log("  [SKIP] contact_pages_cmps table does not exist");
    }
    console.log("");

    // ── STEP 2: Remove media links for elite-stack-card icon_image ─────────
    console.log("STEP 2: Removing icon_image media links from files_related_mph...");
    if (await tableExists(client, "files_related_mph")) {
      const deletedMedia = await client.query(`
        DELETE FROM files_related_mph
        WHERE related_type IN ('contact.elite-stack', 'contact.elite-stack-card')
        RETURNING id, file_id, related_type, field
      `);
      if (deletedMedia.rowCount > 0) {
        console.log(`  [OK] Removed ${deletedMedia.rowCount} media link(s) from files_related_mph`);
        deletedMedia.rows.forEach((r) =>
          console.log(`    file_id=${r.file_id}, type=${r.related_type}, field=${r.field}`),
        );
      } else {
        console.log("  [OK] No elite-stack media links found (already clean)");
      }
    } else {
      console.log("  [SKIP] files_related_mph table does not exist");
    }
    console.log("");

    // ── STEP 3: Drop elite-stack cards link table ──────────────────────────
    console.log("STEP 3: Dropping components_contact_elite_stacks_cards_cmps...");
    const linkTable = "components_contact_elite_stacks_cards_cmps";
    if (await tableExists(client, linkTable)) {
      await client.query(`DROP TABLE IF EXISTS ${linkTable} CASCADE`);
      console.log(`  [OK] Dropped ${linkTable}`);
    } else {
      console.log(`  [SKIP] ${linkTable} does not exist`);
    }
    console.log("");

    // Also try the underscore variant naming Strapi sometimes uses
    const linkTable2 = "components_contact_elite_stacks_cmps";
    if (await tableExists(client, linkTable2)) {
      await client.query(`DROP TABLE IF EXISTS ${linkTable2} CASCADE`);
      console.log(`  [OK] Dropped ${linkTable2}`);
    }

    // ── STEP 4: Drop elite-stack-cards table ──────────────────────────────
    console.log("STEP 4: Dropping components_contact_elite_stack_cards...");
    if (await tableExists(client, "components_contact_elite_stack_cards")) {
      await client.query(
        `DROP TABLE IF EXISTS components_contact_elite_stack_cards CASCADE`,
      );
      console.log("  [OK] Dropped components_contact_elite_stack_cards");
    } else {
      console.log("  [SKIP] components_contact_elite_stack_cards does not exist");
    }
    console.log("");

    // ── STEP 5: Drop elite-stacks table ───────────────────────────────────
    console.log("STEP 5: Dropping components_contact_elite_stacks...");
    if (await tableExists(client, "components_contact_elite_stacks")) {
      await client.query(
        `DROP TABLE IF EXISTS components_contact_elite_stacks CASCADE`,
      );
      console.log("  [OK] Dropped components_contact_elite_stacks");
    } else {
      console.log("  [SKIP] components_contact_elite_stacks does not exist");
    }
    console.log("");

    // ── STEP 6: Verify remaining contact_pages_cmps ───────────────────────
    console.log("STEP 6: Verifying remaining contact_pages_cmps entries...");
    if (await tableExists(client, "contact_pages_cmps")) {
      const remaining = await client.query(`
        SELECT component_type, COUNT(*) AS count
        FROM contact_pages_cmps
        GROUP BY component_type
        ORDER BY component_type
      `);
      if (remaining.rowCount === 0) {
        console.log("  [WARN] contact_pages_cmps is now empty");
      } else {
        remaining.rows.forEach((r) =>
          console.log(`  ${r.component_type}: ${r.count} row(s)`),
        );
      }
    }
    console.log("");

    console.log("=".repeat(70));
    console.log("MIGRATION 119 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi: cd strapi-cms && npm run develop");
    console.log("  2. Verify Contact Page in Strapi Admin — Elite Stack should be gone");
    console.log("  3. Save & Publish the Contact Page in Strapi\n");
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
