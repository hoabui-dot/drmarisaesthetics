#!/usr/bin/env node

/**
 * Migration Script 048: Add Contact Form and Final CTA to Contact Page
 *
 * Changes:
 *  1. Create components_contact_contact_forms table
 *  2. Create components_contact_final_ctas table
 *  3. Insert default contact form configuration
 *  4. Insert default final CTA configuration
 *  5. Link components to contact page via contact_pages_cmps table
 *  6. Handle Draft & Publish (duplicate rows with same document_id)
 *
 * Run (dev):
 *   node migration_scripts/048-add-contact-form-and-final-cta.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/048-add-contact-form-and-final-cta.js
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
  console.log("MIGRATION 048: Add Contact Form and Final CTA");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create contact_forms component table ──────────────────────
    console.log("STEP 1: Creating components_contact_contact_forms table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_contact_forms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT 'Request Consultation',
        description TEXT,
        name_label VARCHAR(255) DEFAULT 'Full Name',
        name_placeholder VARCHAR(255) DEFAULT 'Enter your full name',
        phone_label VARCHAR(255) DEFAULT 'Phone Number',
        phone_placeholder VARCHAR(255) DEFAULT '+84 xxx xxx xxx',
        service_label VARCHAR(255) DEFAULT 'Service of Interest',
        service_placeholder VARCHAR(255) DEFAULT 'Select a service',
        service_options JSONB DEFAULT '["Dental Implants", "Veneers", "Teeth Whitening", "Braces", "General Dentistry", "Other"]'::jsonb,
        message_label VARCHAR(255) DEFAULT 'Message (Optional)',
        message_placeholder VARCHAR(255) DEFAULT 'Tell us about your dental needs...',
        submit_button_text VARCHAR(255) DEFAULT 'Request Consultation',
        success_message TEXT DEFAULT 'Thank you! We''ll contact you within 24 hours.',
        error_message TEXT DEFAULT 'Something went wrong. Please try again or call us directly.'
      )
    `);

    console.log("  [OK] Table created\n");

    // ── STEP 2: Create final_ctas component table ─────────────────────────
    console.log("STEP 2: Creating components_contact_final_ctas table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_final_ctas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT 'Ready to book your appointment?',
        subtitle TEXT,
        primary_button_text VARCHAR(255) DEFAULT 'Book Consultation',
        primary_button_link VARCHAR(255) DEFAULT '/contact',
        secondary_button_text VARCHAR(255) DEFAULT 'Call Now',
        secondary_button_link VARCHAR(255) DEFAULT 'tel:+84xxxxxxxxx',
        background_color VARCHAR(255) DEFAULT 'gradient'
      )
    `);

    console.log("  [OK] Table created\n");

    // ── STEP 3: Insert default contact form data ──────────────────────────
    console.log("STEP 3: Inserting default contact form data...");

    const contactFormResult = await client.query(`
      INSERT INTO components_contact_contact_forms (
        title,
        description,
        name_label,
        name_placeholder,
        phone_label,
        phone_placeholder,
        service_label,
        service_placeholder,
        service_options,
        message_label,
        message_placeholder,
        submit_button_text,
        success_message,
        error_message
      ) VALUES (
        'Request Consultation',
        'Fill out the form below and our team will contact you within 24 hours to schedule your appointment.',
        'Full Name',
        'Enter your full name',
        'Phone Number',
        '+84 xxx xxx xxx',
        'Service of Interest',
        'Select a service',
        '["Dental Implants", "Veneers", "Teeth Whitening", "Braces", "General Dentistry", "Other"]'::jsonb,
        'Message (Optional)',
        'Tell us about your dental needs...',
        'Request Consultation',
        'Thank you! We''ll contact you within 24 hours.',
        'Something went wrong. Please try again or call us directly.'
      )
      RETURNING id
    `);

    const contactFormId = contactFormResult.rows[0].id;
    console.log(`  [OK] Contact form created with ID: ${contactFormId}\n`);

    // ── STEP 4: Insert default final CTA data ─────────────────────────────
    console.log("STEP 4: Inserting default final CTA data...");

    const finalCtaResult = await client.query(`
      INSERT INTO components_contact_final_ctas (
        title,
        subtitle,
        primary_button_text,
        primary_button_link,
        secondary_button_text,
        secondary_button_link,
        background_color
      ) VALUES (
        'Ready to book your appointment?',
        'Our team is standing by to help you achieve your perfect smile.',
        'Book Consultation',
        '/contact',
        'Call Now',
        'tel:+84xxxxxxxxx',
        'gradient'
      )
      RETURNING id
    `);

    const finalCtaId = finalCtaResult.rows[0].id;
    console.log(`  [OK] Final CTA created with ID: ${finalCtaId}\n`);

    // ── STEP 5: Get contact page records (Draft & Published) ──────────────
    console.log("STEP 5: Linking components to contact page...");

    const contactPagesResult = await client.query(`
      SELECT id, document_id, published_at
      FROM contact_pages
      ORDER BY id
    `);

    if (contactPagesResult.rows.length === 0) {
      console.log(
        "  [WARN] No contact pages found. Skipping component linking.\n",
      );
    } else {
      console.log(
        `  [INFO] Found ${contactPagesResult.rows.length} contact page record(s)\n`,
      );

      // Get the highest order value for each entity_id
      for (const page of contactPagesResult.rows) {
        const isDraft = page.published_at === null;
        const status = isDraft ? "DRAFT" : "PUBLISHED";

        console.log(`  Processing contact page ID ${page.id} (${status})...`);

        // Get current max order for this entity
        const maxOrderResult = await client.query(
          `
          SELECT COALESCE(MAX("order"), 0) as max_order
          FROM contact_pages_cmps
          WHERE entity_id = $1
        `,
          [page.id],
        );

        let currentOrder = maxOrderResult.rows[0].max_order;

        // Link contact_form component
        currentOrder += 1;
        await client.query(
          `
          INSERT INTO contact_pages_cmps (
            entity_id,
            cmp_id,
            component_type,
            field,
            "order"
          ) VALUES ($1, $2, $3, $4, $5)
        `,
          [
            page.id,
            contactFormId,
            "contact.contact-form",
            "contact_form",
            currentOrder,
          ],
        );

        console.log(`    [OK] Linked contact_form (order: ${currentOrder})`);

        // Link final_cta component
        currentOrder += 1;
        await client.query(
          `
          INSERT INTO contact_pages_cmps (
            entity_id,
            cmp_id,
            component_type,
            field,
            "order"
          ) VALUES ($1, $2, $3, $4, $5)
        `,
          [page.id, finalCtaId, "contact.final-cta", "final_cta", currentOrder],
        );

        console.log(`    [OK] Linked final_cta (order: ${currentOrder})`);
      }

      console.log();
    }

    // ── STEP 6: Verify results ────────────────────────────────────────────
    console.log("STEP 6: Verifying results...");

    // Check contact_forms table
    const contactFormsCount = await client.query(`
      SELECT COUNT(*) as count FROM components_contact_contact_forms
    `);
    console.log(
      `  [OK] Contact forms count: ${contactFormsCount.rows[0].count}`,
    );

    // Check final_ctas table
    const finalCtasCount = await client.query(`
      SELECT COUNT(*) as count FROM components_contact_final_ctas
    `);
    console.log(`  [OK] Final CTAs count: ${finalCtasCount.rows[0].count}`);

    // Check links
    const linksCount = await client.query(`
      SELECT COUNT(*) as count 
      FROM contact_pages_cmps 
      WHERE component_type IN ('contact.contact-form', 'contact.final-cta')
    `);
    console.log(`  [OK] Component links count: ${linksCount.rows[0].count}`);

    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 048 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi: cd strapi-cms && npm run develop");
    console.log("  2. Verify in Strapi admin panel");
    console.log("  3. Update frontend queries.ts to fetch new components");
    console.log("  4. Update ContactPageClient.tsx to render new sections\n");
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
