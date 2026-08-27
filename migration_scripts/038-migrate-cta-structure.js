#!/usr/bin/env node

/**
 * Migration Script: CTA Component Structure Update
 *
 * Purpose:
 * - Migrate CTA component data from old structure to new structure
 * - Combines title_line1 + title_line2 into heading
 * - Sets default highlight_text
 * - Preserves button configuration
 * - Converts transformation_image to background_image
 *
 * OLD STRUCTURE:
 * - urgency_badge_text, title_line1, title_line2, subtitle, text
 * - button_label, button_link
 * - transformation_image, badge_label, badge_value, trust_items
 *
 * NEW STRUCTURE:
 * - heading (combines title_line1 + title_line2)
 * - highlight_text (default: "đánh giá")
 * - button_label, button_link
 * - background_image (from transformation_image)
 *
 * This script is IDEMPOTENT - safe to run multiple times
 *
 * Usage:
 *   node migration_scripts/038-migrate-cta-structure.js
 */

const { Client } = require("pg");
const axios = require("axios");

// Database configuration - same as other migration scripts
const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

// Strapi API configuration
const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN;

async function migrateCTAStructure() {
  console.log("\n" + "=".repeat(80));
  console.log("MIGRATION: CTA Component Structure Update");
  console.log("=".repeat(80) + "\n");

  const client = new Client(DB_CONFIG);

  try {
    // Connect to database
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Step 1: Check if new columns exist
    console.log("Step 1: Checking database schema...");

    const tableInfo = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_ctas'
      ORDER BY column_name;
    `);

    const columns = tableInfo.rows.map((row) => row.column_name);
    const hasOldColumns =
      columns.includes("title_line1") || columns.includes("title_line2");
    const hasNewColumns = columns.includes("heading");

    console.log("  Current columns:", columns.join(", "));

    if (!hasNewColumns) {
      console.log("\n❌ New schema not detected!");
      console.log("   Please ensure:");
      console.log("   1. The new cta.json schema is deployed");
      console.log("   2. Strapi has been restarted to sync the schema");
      console.log("   3. The database has the new columns");
      await client.end();
      process.exit(1);
    }

    console.log("  ✅ New schema detected (heading column exists)");

    if (!hasOldColumns) {
      console.log(
        "  ℹ️  Old columns not found (may have been removed by Strapi)",
      );
    }

    // Step 2: Get all CTA components
    console.log("\nStep 2: Fetching CTA components...");

    const ctaComponents = await client.query(`
      SELECT * FROM components_homepage_ctas
      ORDER BY id;
    `);

    if (ctaComponents.rows.length === 0) {
      console.log("  ℹ️  No CTA components found. Nothing to migrate.");
      await client.end();
      process.exit(0);
    }

    console.log(`  Found ${ctaComponents.rows.length} CTA component(s)\n`);

    // Step 3: Migrate each CTA component
    console.log("Step 3: Migrating CTA data...\n");

    let migratedCount = 0;
    let skippedCount = 0;

    for (const cta of ctaComponents.rows) {
      console.log(`  Processing CTA ID: ${cta.id}`);

      // Check if already migrated
      if (cta.heading && !cta.title_line1 && !cta.title_line2) {
        console.log(`    ⏭️  Already migrated, skipping\n`);
        skippedCount++;
        continue;
      }

      // Build update data
      const updates = [];
      const values = [];
      let paramIndex = 1;

      // Combine title_line1 and title_line2 into heading
      if (!cta.heading && (cta.title_line1 || cta.title_line2)) {
        const heading = [cta.title_line1, cta.title_line2]
          .filter(Boolean)
          .join(" ");
        updates.push(`heading = $${paramIndex++}`);
        values.push(
          heading ||
            "Niềng răng bằng khay trong suốt có phù hợp với tình trạng răng của bạn?",
        );
        console.log(`    ✏️  Heading: "${heading.substring(0, 50)}..."`);
      }

      // Set highlight_text if not exists
      if (!cta.highlight_text) {
        updates.push(`highlight_text = $${paramIndex++}`);
        values.push("đánh giá");
        console.log(`    ✏️  Highlight text: "đánh giá"`);
      }

      // Ensure button_label exists
      if (!cta.button_label) {
        updates.push(`button_label = $${paramIndex++}`);
        values.push("Đăng ký ngay");
        console.log(`    ✏️  Button label: "Đăng ký ngay"`);
      }

      // Ensure button_link exists
      if (!cta.button_link) {
        updates.push(`button_link = $${paramIndex++}`);
        values.push("/contact");
        console.log(`    ✏️  Button link: "/contact"`);
      }

      // Convert transformation_image to background_image
      if (
        cta.transformation_image &&
        !cta.background_image &&
        columns.includes("background_image")
      ) {
        updates.push(`background_image = $${paramIndex++}`);
        values.push(cta.transformation_image);
        console.log(
          `    🖼️  Background image: Converted from transformation_image`,
        );
      }

      // Perform update if there are changes
      if (updates.length > 0) {
        values.push(cta.id);
        const query = `
          UPDATE components_homepage_ctas 
          SET ${updates.join(", ")}
          WHERE id = $${paramIndex}
        `;

        await client.query(query, values);
        console.log(`    ✅ Migrated successfully\n`);
        migratedCount++;
      } else {
        console.log(`    ⏭️  No changes needed\n`);
        skippedCount++;
      }
    }

    // Step 4: Verify migration using Strapi API
    console.log("Step 4: Verifying migration via Strapi API...");

    if (STRAPI_TOKEN) {
      try {
        const api = axios.create({
          baseURL: STRAPI_URL,
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const response = await api.get("/api/homepage", {
          params: {
            "populate[layout][on][homepage.cta][populate]": "*",
          },
        });

        const homepage = response.data?.data;
        const ctaBlock = homepage?.layout?.find(
          (block) => block.__component === "homepage.cta",
        );

        if (ctaBlock) {
          console.log("  ✅ CTA block found in homepage");
          console.log(
            `     Heading: "${ctaBlock.heading?.substring(0, 50)}..."`,
          );
          console.log(`     Highlight: "${ctaBlock.highlight_text}"`);
          console.log(
            `     Button: "${ctaBlock.button_label}" → ${ctaBlock.button_link}`,
          );
        } else {
          console.log("  ⚠️  No CTA block found in homepage layout");
        }
      } catch (apiError) {
        console.log("  ⚠️  Could not verify via API:", apiError.message);
        console.log(
          "     (This is not critical - database migration completed)",
        );
      }
    } else {
      console.log("  ⏭️  Skipping API verification (no STRAPI_API_TOKEN)");
    }

    // Summary
    console.log("\n" + "=".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${ctaComponents.rows.length}`);
    console.log("\n📝 Next steps:");
    console.log("   1. Verify the CTA section in Strapi Admin");
    console.log(
      "   2. Update the content if needed (especially Vietnamese text)",
    );
    console.log("   3. Publish the changes");
    console.log("   4. Deploy the frontend");
    console.log("\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("✅ Database connection closed\n");
  }
}

// Run migration
migrateCTAStructure();
