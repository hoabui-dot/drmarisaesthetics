#!/usr/bin/env node

/**
 * Migration Script 055: Fix Content Manager configuration
 *
 * This script updates the Content Manager configuration to remove any
 * localizations-related metadata that might be causing the 400 error.
 *
 * Run (dev):
 *   node migration_scripts/055-fix-content-manager-config.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/055-fix-content-manager-config.js
 */

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
  console.log("MIGRATION 055: Fix Content Manager configuration");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Get current configuration ────────────────────────────────
    console.log("STEP 1: Getting current Content Manager configuration...");

    const configResult = await client.query(`
      SELECT value 
      FROM strapi_core_store_settings 
      WHERE key = 'plugin_content_manager_configuration_content_types::api::contact-page.contact-page'
    `);

    if (configResult.rows.length === 0) {
      console.log("  [ERROR] No configuration found for contact-page");
      return;
    }

    const config = JSON.parse(configResult.rows[0].value);
    console.log("  [OK] Configuration loaded\n");

    // ── STEP 2: Remove localizations from metadatas ──────────────────────
    console.log("STEP 2: Removing localizations from metadatas...");

    let modified = false;

    if (config.metadatas && config.metadatas.localizations) {
      delete config.metadatas.localizations;
      modified = true;
      console.log("  [OK] Removed localizations from metadatas");
    } else {
      console.log("  [SKIP] No localizations found in metadatas");
    }

    // ── STEP 3: Remove localizations from layouts ────────────────────────
    console.log("STEP 3: Checking layouts...");

    if (config.layouts) {
      if (
        config.layouts.list &&
        config.layouts.list.includes("localizations")
      ) {
        config.layouts.list = config.layouts.list.filter(
          (field) => field !== "localizations",
        );
        modified = true;
        console.log("  [OK] Removed localizations from list layout");
      }

      if (config.layouts.edit) {
        config.layouts.edit = config.layouts.edit.filter((row) => {
          return (
            row.filter((field) => field.name !== "localizations").length > 0
          );
        });
        modified = true;
        console.log("  [OK] Removed localizations from edit layout");
      }
    }

    // ── STEP 4: Update configuration ─────────────────────────────────────
    if (modified) {
      console.log("\nSTEP 4: Updating configuration...");

      await client.query(
        `
        UPDATE strapi_core_store_settings 
        SET value = $1 
        WHERE key = 'plugin_content_manager_configuration_content_types::api::contact-page.contact-page'
      `,
        [JSON.stringify(config)],
      );

      console.log("  [OK] Configuration updated\n");
    } else {
      console.log("\nSTEP 4: No changes needed\n");
    }

    // ── STEP 5: Do the same for clinic-location ──────────────────────────
    console.log("STEP 5: Checking clinic-location configuration...");

    const configResult2 = await client.query(`
      SELECT value 
      FROM strapi_core_store_settings 
      WHERE key = 'plugin_content_manager_configuration_content_types::api::clinic-location.clinic-location'
    `);

    if (configResult2.rows.length > 0) {
      const config2 = JSON.parse(configResult2.rows[0].value);
      let modified2 = false;

      if (config2.metadatas && config2.metadatas.localizations) {
        delete config2.metadatas.localizations;
        modified2 = true;
      }

      if (modified2) {
        await client.query(
          `
          UPDATE strapi_core_store_settings 
          SET value = $1 
          WHERE key = 'plugin_content_manager_configuration_content_types::api::clinic-location.clinic-location'
        `,
          [JSON.stringify(config2)],
        );
        console.log("  [OK] Updated clinic-location configuration");
      } else {
        console.log("  [SKIP] No changes needed for clinic-location");
      }
    } else {
      console.log("  [SKIP] No clinic-location configuration found");
    }

    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 055 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nIMPORTANT:");
    console.log("  1. Clear Strapi cache: rm -rf .cache");
    console.log("  2. Restart Strapi: pm2 restart strapi");
    console.log("  3. Test Strapi Admin: Content Manager → Contact Page");
    console.log("  4. The 400 error should be resolved");
    console.log("\n");
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
