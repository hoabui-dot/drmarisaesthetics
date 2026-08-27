/**
 * Migration 059: Final i18n Fix - Remove locale and Update Strapi Schemas
 *
 * This migration:
 * 1. Removes locale column from contact_pages
 * 2. Removes locale column from clinic_locations
 * 3. Updates Strapi database schemas to mark these as non-localized
 * 4. Clears any i18n-related metadata
 */

const { Client } = require("pg");

const config = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function migrate() {
  const client = new Client(config);

  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Start transaction
    await client.query("BEGIN");

    // 1. Remove locale column from contact_pages
    console.log("\n📋 Step 1: Removing locale column from contact_pages...");
    await client.query(`
      ALTER TABLE contact_pages DROP COLUMN IF EXISTS locale CASCADE;
    `);
    console.log("✅ Locale column removed from contact_pages");

    // 2. Remove locale column from clinic_locations
    console.log("\n📋 Step 2: Removing locale column from clinic_locations...");
    await client.query(`
      ALTER TABLE clinic_locations DROP COLUMN IF EXISTS locale CASCADE;
    `);
    console.log("✅ Locale column removed from clinic_locations");

    // 3. Drop the documents index that includes locale
    console.log("\n📋 Step 3: Dropping locale-based indexes...");
    await client.query(`
      DROP INDEX IF EXISTS contact_pages_documents_idx;
    `);
    await client.query(`
      DROP INDEX IF EXISTS clinic_locations_documents_idx;
    `);
    console.log("✅ Locale-based indexes dropped");

    // 4. Create new indexes without locale
    console.log("\n📋 Step 4: Creating new indexes without locale...");
    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_pages_documents_idx 
      ON contact_pages(document_id, published_at);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_documents_idx 
      ON clinic_locations(document_id, published_at);
    `);
    console.log("✅ New indexes created");

    // 5. Clear Strapi database schema cache
    console.log("\n📋 Step 5: Clearing Strapi database schema cache...");

    // Check if strapi_database_schema table exists
    const schemaTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'strapi_database_schema'
      );
    `);

    if (schemaTableCheck.rows[0].exists) {
      // Delete all schema cache - Strapi will rebuild on restart
      await client.query(`
        DELETE FROM strapi_database_schema;
      `);
      console.log(
        "✅ Strapi database schema cache cleared (will rebuild on restart)",
      );
    } else {
      console.log("ℹ️  strapi_database_schema table does not exist");
    }

    // 6. Update Content Manager configuration to ensure no localizations
    console.log("\n📋 Step 6: Updating Content Manager configurations...");

    await client.query(`
      UPDATE strapi_core_store_settings
      SET value = jsonb_set(
        value::jsonb,
        '{pluginOptions,i18n,localized}',
        'false'::jsonb
      )
      WHERE key IN (
        'plugin_content_manager_configuration_content_types::api::contact-page.contact-page',
        'plugin_content_manager_configuration_content_types::api::clinic-location.clinic-location'
      );
    `);
    console.log("✅ Content Manager configurations updated");

    // Commit transaction
    await client.query("COMMIT");
    console.log("\n✅ Migration 059 completed successfully!");

    // Verify results
    console.log("\n📊 Verification:");

    const contactPagesCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages'
      ORDER BY ordinal_position;
    `);
    console.log(`\ncontact_pages columns (${contactPagesCheck.rows.length}):`);
    contactPagesCheck.rows.forEach((row) =>
      console.log(`  - ${row.column_name}`),
    );

    const hasLocale = contactPagesCheck.rows.some(
      (row) => row.column_name === "locale",
    );
    if (hasLocale) {
      console.log("\n⚠️  WARNING: locale column still exists!");
    } else {
      console.log("\n✅ No locale column (as expected)");
    }

    const indexCheck = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'contact_pages' AND indexname LIKE '%documents%';
    `);
    console.log(`\ncontact_pages document indexes:`);
    indexCheck.rows.forEach((row) => {
      console.log(`  - ${row.indexname}`);
      console.log(`    ${row.indexdef}`);
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

// Run migration
migrate()
  .then(() => {
    console.log("\n✅ All done!");
    console.log("\n⚠️  IMPORTANT: You MUST clear Strapi cache and restart:");
    console.log("   rm -rf .cache .strapi build");
    console.log("   npm run build");
    console.log("   pm2 restart strapi");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
