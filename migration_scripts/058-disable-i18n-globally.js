/**
 * Migration 058: Disable i18n Globally and Clean Database
 *
 * This migration:
 * 1. Removes locale columns from contact_pages and clinic_locations
 * 2. Drops localizations link tables
 * 3. Updates Strapi metadata to disable i18n
 * 4. Adds i18n plugin configuration to disable it globally
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

    // 1. Drop localizations link tables if they exist
    console.log("\n📋 Step 1: Dropping localizations link tables...");
    await client.query(`
      DROP TABLE IF EXISTS contact_pages_localizations_lnk CASCADE;
    `);
    await client.query(`
      DROP TABLE IF EXISTS clinic_locations_localizations_lnk CASCADE;
    `);
    console.log("✅ Localizations link tables dropped");

    // 2. Remove locale column from contact_pages
    console.log("\n📋 Step 2: Removing locale column from contact_pages...");
    const contactPagesColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' AND column_name = 'locale';
    `);

    if (contactPagesColumns.rows.length > 0) {
      await client.query(`
        ALTER TABLE contact_pages DROP COLUMN IF EXISTS locale CASCADE;
      `);
      console.log("✅ Locale column removed from contact_pages");
    } else {
      console.log("ℹ️  Locale column does not exist in contact_pages");
    }

    // 3. Remove locale column from clinic_locations
    console.log("\n📋 Step 3: Removing locale column from clinic_locations...");
    const clinicLocationsColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations' AND column_name = 'locale';
    `);

    if (clinicLocationsColumns.rows.length > 0) {
      await client.query(`
        ALTER TABLE clinic_locations DROP COLUMN IF EXISTS locale CASCADE;
      `);
      console.log("✅ Locale column removed from clinic_locations");
    } else {
      console.log("ℹ️  Locale column does not exist in clinic_locations");
    }

    // 4. Update Strapi metadata to disable i18n for contact-page
    console.log("\n📋 Step 4: Updating Strapi metadata...");
    await client.query(`
      UPDATE strapi_core_store_settings
      SET value = jsonb_set(
        value::jsonb,
        '{pluginOptions}',
        '{"i18n": {"localized": false}}'::jsonb
      )
      WHERE key = 'plugin_content_manager_configuration_content_types::api::contact-page.contact-page';
    `);
    console.log("✅ Contact page metadata updated");

    // 5. Update Strapi metadata to disable i18n for clinic-location
    await client.query(`
      UPDATE strapi_core_store_settings
      SET value = jsonb_set(
        value::jsonb,
        '{pluginOptions}',
        '{"i18n": {"localized": false}}'::jsonb
      )
      WHERE key = 'plugin_content_manager_configuration_content_types::api::clinic-location.clinic-location';
    `);
    console.log("✅ Clinic location metadata updated");

    // 6. Remove i18n from Content Manager edit layouts
    console.log("\n📋 Step 5: Cleaning Content Manager configurations...");

    // Contact Page
    await client.query(`
      UPDATE strapi_core_store_settings
      SET value = jsonb_set(
        value::jsonb,
        '{layouts,edit}',
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements(value::jsonb->'layouts'->'edit') elem
          WHERE elem::jsonb @> '[{"name": "localizations"}]' = false
        )
      )
      WHERE key = 'plugin_content_manager_configuration_content_types::api::contact-page.contact-page'
      AND value::jsonb->'layouts'->'edit' IS NOT NULL;
    `);

    // Clinic Location
    await client.query(`
      UPDATE strapi_core_store_settings
      SET value = jsonb_set(
        value::jsonb,
        '{layouts,edit}',
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements(value::jsonb->'layouts'->'edit') elem
          WHERE elem::jsonb @> '[{"name": "localizations"}]' = false
        )
      )
      WHERE key = 'plugin_content_manager_configuration_content_types::api::clinic-location.clinic-location'
      AND value::jsonb->'layouts'->'edit' IS NOT NULL;
    `);
    console.log("✅ Content Manager configurations cleaned");

    // Commit transaction
    await client.query("COMMIT");
    console.log("\n✅ Migration 058 completed successfully!");

    // Verify results
    console.log("\n📊 Verification:");

    const contactPagesCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages';
    `);
    console.log(`\ncontact_pages columns (${contactPagesCheck.rows.length}):`);
    contactPagesCheck.rows.forEach((row) =>
      console.log(`  - ${row.column_name}`),
    );

    const localizationsCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%localizations%';
    `);
    console.log(`\nLocalizations tables (${localizationsCheck.rows.length}):`);
    if (localizationsCheck.rows.length === 0) {
      console.log("  ✅ None (as expected)");
    } else {
      localizationsCheck.rows.forEach((row) =>
        console.log(`  - ${row.table_name}`),
      );
    }
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
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
