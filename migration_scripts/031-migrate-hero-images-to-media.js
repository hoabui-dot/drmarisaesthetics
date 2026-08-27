#!/usr/bin/env node

/**
 * Migration Script: Migrate Hero Images to Strapi Media Library
 */

const { Client } = require("pg");
const crypto = require("crypto");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

const IMAGES = [
  { name: "happy_customers_hero.jpg", url: "/uploads/happy_customers_hero.jpg", alt: "Happy dental patients" },
  { name: "patient_smile.jpg", url: "/uploads/patient_smile.jpg", alt: "Patient with beautiful smile" },
  { name: "family_dental.jpg", url: "/uploads/family_dental.jpg", alt: "Family dental care" },
  { name: "patient_consultation.jpg", url: "/uploads/patient_consultation.jpg", alt: "Patient consultation" }
];

async function migrateImagesToMedia() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(80));
  console.log("MIGRATION: Migrate Hero Images to Media Library");
  console.log("=".repeat(80));

  try {
    await client.connect();
    console.log("[OK] Connected to database\n");

    // 1. Ensure files exist in 'files' table
    console.log("PART 1: Registering files in media library...");
    const fileIds = [];

    for (const img of IMAGES) {
      const existingFile = await client.query("SELECT id FROM files WHERE url = $1", [img.url]);

      if (existingFile.rows.length === 0) {
        const documentId = crypto.randomBytes(12).toString('hex');
        const insertFile = await client.query(
          `INSERT INTO files (name, alternative_text, url, mime, ext, size, document_id, created_at, updated_at, published_at, provider)
           VALUES ($1, $2, $3, 'image/jpeg', '.jpg', 100, $4, NOW(), NOW(), NOW(), 'local') RETURNING id`,
          [img.name, img.alt, img.url, documentId]
        );
        fileIds.push(insertFile.rows[0].id);
        console.log(`  [OK] Registered file: ${img.name} (ID: ${insertFile.rows[0].id})`);
      } else {
        fileIds.push(existingFile.rows[0].id);
        console.log(`  [SKIP] File already exists: ${img.name} (ID: ${existingFile.rows[0].id})`);
      }
    }

    // 2. Identify Hero components
    console.log("\nPART 2: Linking files to hero components...");
    const heroRecords = await client.query("SELECT id FROM components_customer_hero");
    
    if (heroRecords.rows.length === 0) {
      console.log("  [ERROR] No hero components found in 'components_customer_hero'.");
      return;
    }

    // 3. Clear existing relations to avoid duplicates
    const fields = ['image1', 'image2', 'image3', 'image4'];
    await client.query(
      "DELETE FROM files_related_mph WHERE related_type = 'customer.hero' AND field IN ($1, $2, $3, $4)",
      fields
    );

    // 4. Insert relations into files_related_mph
    for (const hero of heroRecords.rows) {
      console.log(`  Linking 4 separate images to Hero ID: ${hero.id}...`);
      for (let i = 0; i < fileIds.length && i < fields.length; i++) {
        await client.query(
          `INSERT INTO files_related_mph (file_id, related_id, related_type, field, \"order\")
           VALUES ($1, $2, 'customer.hero', $3, 1)`,
          [fileIds[i], hero.id, fields[i]]
        );
        console.log(`    [OK] Linked ${IMAGES[i].name} to field: ${fields[i]}`);
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    
  } catch (error) {
    console.error("\n[ERROR] Migration failed:", error.message);
  } finally {
    await client.end();
  }
}

migrateImagesToMedia();
