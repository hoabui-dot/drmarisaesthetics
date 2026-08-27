#!/usr/bin/env node

/**
 * Migration Script 053: Add titleLines to Certification Section
 *
 * Changes:
 *  1. Create components_homepage_title_lines table (if not exists)
 *  2. Create link table components_homepage_certifications_title_lines_cmps
 *  3. Remove old title column from components_homepage_certifications
 *  4. Migrate existing title data to titleLines (split by line breaks)
 *
 * Run (dev):
 *   node migration_scripts/053-add-title-lines-to-certification.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/053-add-title-lines-to-certification.js
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
  console.log("MIGRATION 053: Add titleLines to Certification Section");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check if title_lines table exists ────────────────────────
    console.log("STEP 1: Checking if title_lines table exists...");
    const titleLinesTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_title_lines'
      );
    `);

    if (!titleLinesTableCheck.rows[0].exists) {
      console.log("  Creating components_homepage_title_lines table...");
      await client.query(`
        CREATE TABLE components_homepage_title_lines (
          id SERIAL PRIMARY KEY,
          text VARCHAR(255) NOT NULL
        );
      `);
      console.log("  [OK] Created components_homepage_title_lines table");
    } else {
      console.log("  [OK] Table already exists");
    }

    // ── STEP 2: Create link table ────────────────────────────────────────
    console.log("\nSTEP 2: Creating link table...");
    const linkTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_certifications_title_lines_cmps'
      );
    `);

    if (!linkTableCheck.rows[0].exists) {
      await client.query(`
        CREATE TABLE components_homepage_certifications_title_lines_cmps (
          id SERIAL PRIMARY KEY,
          entity_id INTEGER NOT NULL
            REFERENCES components_homepage_certifications(id)
            ON DELETE CASCADE,
          cmp_id INTEGER NOT NULL
            REFERENCES components_homepage_title_lines(id)
            ON DELETE CASCADE,
          component_type VARCHAR(255) NOT NULL DEFAULT 'homepage.title-line',
          field VARCHAR(255) NOT NULL DEFAULT 'titleLines',
          "order" DOUBLE PRECISION
        );
      `);
      console.log("  [OK] Created link table");
    } else {
      console.log("  [OK] Link table already exists");
    }

    // ── STEP 3: Migrate existing title data ──────────────────────────────
    console.log("\nSTEP 3: Migrating existing title data...");

    const existingCerts = await client.query(`
      SELECT id, title FROM components_homepage_certifications
      WHERE title IS NOT NULL AND title != ''
    `);

    console.log(
      `  Found ${existingCerts.rows.length} certifications with titles`,
    );

    for (const cert of existingCerts.rows) {
      // Split title by newlines or use as single line
      const lines = cert.title.split("\n").filter((line) => line.trim() !== "");

      console.log(`  Migrating certification ${cert.id}: "${cert.title}"`);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Insert title line
        const titleLineResult = await client.query(
          `
          INSERT INTO components_homepage_title_lines (text)
          VALUES ($1)
          RETURNING id
        `,
          [line],
        );

        const titleLineId = titleLineResult.rows[0].id;

        // Link to certification
        await client.query(
          `
          INSERT INTO components_homepage_certifications_title_lines_cmps
          (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'homepage.title-line', 'titleLines', $3)
        `,
          [cert.id, titleLineId, i + 1],
        );

        console.log(`    Created title line ${i + 1}: "${line}"`);
      }
    }

    console.log("  [OK] Migration completed");

    // ── STEP 4: Drop old title column ────────────────────────────────────
    console.log("\nSTEP 4: Dropping old title column...");

    const titleColumnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'components_homepage_certifications'
        AND column_name = 'title'
      );
    `);

    if (titleColumnCheck.rows[0].exists) {
      await client.query(`
        ALTER TABLE components_homepage_certifications 
        DROP COLUMN title
      `);
      console.log("  [OK] Dropped title column");
    } else {
      console.log("  [OK] Title column already removed");
    }

    // ── STEP 5: Verify results ────────────────────────────────────────────
    console.log("\nSTEP 5: Verifying results...");

    const titleLinesCount = await client.query(`
      SELECT COUNT(*) FROM components_homepage_title_lines
    `);
    console.log(`  Title lines created: ${titleLinesCount.rows[0].count}`);

    const linksCount = await client.query(`
      SELECT COUNT(*) FROM components_homepage_certifications_title_lines_cmps
    `);
    console.log(`  Links created: ${linksCount.rows[0].count}`);

    const remainingColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_certifications'
      ORDER BY ordinal_position
    `);
    console.log("  Remaining columns in certifications table:");
    remainingColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 053 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Update strapi-cms/src/components/homepage/certification.json",
    );
    console.log("  2. Restart Strapi to pick up schema changes");
    console.log("  3. Update dental-frontend/src/types/strapi.ts");
    console.log(
      "  4. Update dental-frontend/src/components/blocks/CertificationSection.tsx",
    );
    console.log("  5. Update dental-frontend/src/lib/api/queries.ts\n");
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
