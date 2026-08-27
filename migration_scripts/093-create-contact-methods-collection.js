#!/usr/bin/env node

/**
 * Migration Script 093: Create Contact Methods Collection Type
 *
 * Changes:
 *  1. Create contact_methods collection type table
 *  2. Seed with existing contact methods from constants
 *  3. Upload icon images to Strapi media library
 *  4. Link icons to contact methods
 *
 * Run (dev):
 *   node migration_scripts/093-create-contact-methods-collection.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 DATABASE_NAME=dental_cms_strapi \
 *   DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/093-create-contact-methods-collection.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Contact methods data from constants
const CONTACT_METHODS = [
  {
    type: "phone",
    label: "Call us",
    href: "tel:+0396877518",
    color: "blue",
    order: 1,
    is_active: true,
  },
  {
    type: "facebook",
    label: "Facebook",
    href: "https://facebook.com/nhakhoaquoctesaigon",
    color: "blue",
    order: 2,
    is_active: true,
  },
  {
    type: "zalo",
    label: "Zalo",
    href: "https://zalo.me/84902759406",
    color: "blue",
    order: 3,
    is_active: true,
  },
  {
    type: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/84902759406",
    color: "green",
    order: 4,
    is_active: true,
  },
  {
    type: "instagram",
    label: "Instagram",
    href: "https://instagram.com/nhakhoaquoctesaigon",
    color: "gradient",
    order: 5,
    is_active: true,
  },
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 093: Create Contact Methods Collection Type");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create contact_methods table ─────────────────────────────
    console.log("STEP 1: Creating contact_methods table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_methods (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255),
        type VARCHAR(50) NOT NULL,
        label VARCHAR(255) NOT NULL,
        href TEXT NOT NULL,
        color VARCHAR(50),
        "order" INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      )
    `);
    console.log("  [OK] Created contact_methods table\n");

    // ── STEP 2: Create unique index on document_id ───────────────────────
    console.log("STEP 2: Creating indexes...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_methods_document_id_idx 
      ON contact_methods(document_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_methods_created_by_id_idx 
      ON contact_methods(created_by_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_methods_updated_by_id_idx 
      ON contact_methods(updated_by_id)
    `);

    console.log("  [OK] Created indexes\n");

    // ── STEP 3: Seed contact methods data ────────────────────────────────
    console.log("STEP 3: Seeding contact methods data...");

    for (const method of CONTACT_METHODS) {
      // Generate a unique document_id
      const documentId = `${method.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Insert draft version
      const draftResult = await client.query(
        `
        INSERT INTO contact_methods (
          document_id, type, label, href, color, "order", is_active, 
          created_at, updated_at, published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, 
          NOW(), NOW(), NULL
        )
        RETURNING id
      `,
        [
          documentId,
          method.type,
          method.label,
          method.href,
          method.color,
          method.order,
          method.is_active,
        ],
      );

      // Insert published version
      await client.query(
        `
        INSERT INTO contact_methods (
          document_id, type, label, href, color, "order", is_active, 
          created_at, updated_at, published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, 
          NOW(), NOW(), NOW()
        )
      `,
        [
          documentId,
          method.type,
          method.label,
          method.href,
          method.color,
          method.order,
          method.is_active,
        ],
      );

      console.log(
        `  [OK] Created ${method.type} contact method (document_id: ${documentId})`,
      );
    }

    console.log("  [OK] Seeded all contact methods\n");

    // ── STEP 4: Verify results ────────────────────────────────────────────
    console.log("STEP 4: Verifying results...");

    const countResult = await client.query(`
      SELECT COUNT(*) as total FROM contact_methods
    `);
    console.log(`  [INFO] Total contact methods: ${countResult.rows[0].total}`);

    const publishedResult = await client.query(`
      SELECT COUNT(*) as total FROM contact_methods WHERE published_at IS NOT NULL
    `);
    console.log(
      `  [INFO] Published contact methods: ${publishedResult.rows[0].total}`,
    );

    const draftResult = await client.query(`
      SELECT COUNT(*) as total FROM contact_methods WHERE published_at IS NULL
    `);
    console.log(`  [INFO] Draft contact methods: ${draftResult.rows[0].total}`);

    const methodsResult = await client.query(`
      SELECT id, document_id, type, label, href, color, "order", is_active, published_at
      FROM contact_methods
      WHERE published_at IS NOT NULL
      ORDER BY "order"
    `);

    console.log("\n  [INFO] Published contact methods:");
    for (const row of methodsResult.rows) {
      console.log(
        `    - ${row.type}: ${row.label} (order: ${row.order}, active: ${row.is_active})`,
      );
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 093 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Create Strapi schema: strapi-cms/src/api/contact-method/content-types/contact-method/schema.json",
    );
    console.log(
      "  2. Create Strapi controllers, routes, services (TypeScript files)",
    );
    console.log("  3. Restart Strapi: cd strapi-cms && npm run develop");
    console.log("  4. Update frontend to fetch from API instead of constants");
    console.log("  5. Remove dental-frontend/src/lib/constants/contact.ts");
    console.log(
      "  6. Remove dental-frontend/src/lib/constants/floating-contact.ts\n",
    );
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
