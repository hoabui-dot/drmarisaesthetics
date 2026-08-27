#!/usr/bin/env node

/**
 * Migration Script 056: Complete Reset - Contact Page
 *
 * This script completely removes and recreates the contact page from scratch
 * WITHOUT i18n support.
 *
 * Steps:
 *  1. DROP all contact page tables
 *  2. DROP all contact component tables
 *  3. DELETE Strapi metadata
 *  4. RECREATE tables without locale column
 *  5. INSERT default data
 *
 * Run (dev):
 *   node migration_scripts/056-complete-reset-contact-page.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/056-complete-reset-contact-page.js
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
  console.log("MIGRATION 056: Complete Reset - Contact Page");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Drop all existing tables ─────────────────────────────────
    console.log("STEP 1: Dropping all contact page tables...");

    const tablesToDrop = [
      "contact_pages_localizations_lnk",
      "contact_pages_quick_contact_cards_lnk",
      "contact_pages_cmps",
      "contact_pages",
      "components_contact_ctas_stats_lnk",
      "components_contact_forms_fields_lnk",
      "components_contact_ctas",
      "components_contact_cta_stats",
      "components_contact_forms",
      "components_contact_form_fields",
      "components_contact_quick_contact_cards",
      "components_contact_heroes",
    ];

    for (const table of tablesToDrop) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`  [OK] Dropped ${table}`);
      } catch (err) {
        console.log(`  [SKIP] ${table} (${err.message})`);
      }
    }
    console.log();

    // ── STEP 2: Delete Strapi metadata ───────────────────────────────────
    console.log("STEP 2: Deleting Strapi metadata...");

    await client.query(`
      DELETE FROM strapi_core_store_settings 
      WHERE key LIKE '%contact-page%'
    `);
    console.log("  [OK] Deleted contact-page metadata\n");

    // ── STEP 3: Create contact_pages table (NO locale column) ────────────
    console.log("STEP 3: Creating contact_pages table (without locale)...");

    await client.query(`
      CREATE TABLE contact_pages (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255) UNIQUE,
        title VARCHAR(255) NOT NULL DEFAULT 'Contact Us',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER
      )
    `);
    console.log("  [OK] Table created (NO locale column)\n");

    // ── STEP 4: Create component tables ──────────────────────────────────
    console.log("STEP 4: Creating component tables...");

    // Hero
    await client.query(`
      CREATE TABLE components_contact_heroes (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        subtitle TEXT
      )
    `);
    console.log("  [OK] components_contact_heroes");

    // Quick contact cards
    await client.query(`
      CREATE TABLE components_contact_quick_contact_cards (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255)
      )
    `);
    console.log("  [OK] components_contact_quick_contact_cards");

    // Form fields
    await client.query(`
      CREATE TABLE components_contact_form_fields (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        label VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        required BOOLEAN DEFAULT false,
        placeholder VARCHAR(255),
        rows INTEGER,
        options JSONB
      )
    `);
    console.log("  [OK] components_contact_form_fields");

    // Forms
    await client.query(`
      CREATE TABLE components_contact_forms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        badge_title VARCHAR(255),
        badge_subtitle VARCHAR(255)
      )
    `);
    console.log("  [OK] components_contact_forms");

    // CTA stats
    await client.query(`
      CREATE TABLE components_contact_cta_stats (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL,
        label VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] components_contact_cta_stats");

    // CTAs
    await client.query(`
      CREATE TABLE components_contact_ctas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        primary_button_text VARCHAR(100),
        primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(100),
        secondary_button_link VARCHAR(255)
      )
    `);
    console.log("  [OK] components_contact_ctas\n");

    // ── STEP 5: Create link tables ───────────────────────────────────────
    console.log("STEP 5: Creating link tables...");

    // Main components link
    await client.query(`
      CREATE TABLE contact_pages_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);
    console.log("  [OK] contact_pages_cmps");

    // Quick contact cards link
    await client.query(`
      CREATE TABLE contact_pages_quick_contact_cards_lnk (
        id SERIAL PRIMARY KEY,
        contact_page_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        card_id INTEGER REFERENCES components_contact_quick_contact_cards(id) ON DELETE CASCADE,
        card_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] contact_pages_quick_contact_cards_lnk");

    // Form fields link
    await client.query(`
      CREATE TABLE components_contact_forms_fields_lnk (
        id SERIAL PRIMARY KEY,
        form_id INTEGER REFERENCES components_contact_forms(id) ON DELETE CASCADE,
        field_id INTEGER REFERENCES components_contact_form_fields(id) ON DELETE CASCADE,
        field_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] components_contact_forms_fields_lnk");

    // CTA stats link
    await client.query(`
      CREATE TABLE components_contact_ctas_stats_lnk (
        id SERIAL PRIMARY KEY,
        cta_id INTEGER REFERENCES components_contact_ctas(id) ON DELETE CASCADE,
        stat_id INTEGER REFERENCES components_contact_cta_stats(id) ON DELETE CASCADE,
        stat_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] components_contact_ctas_stats_lnk\n");

    // ── STEP 6: Insert default data ──────────────────────────────────────
    console.log("STEP 6: Inserting default data...");

    // Insert contact page
    const contactPageResult = await client.query(`
      INSERT INTO contact_pages (
        document_id, title, description, published_at
      ) VALUES (
        'contact-page',
        'Contact Us',
        'Get in touch with Saigon International Dental Clinic',
        CURRENT_TIMESTAMP
      ) RETURNING id
    `);
    const contactPageId = contactPageResult.rows[0].id;
    console.log(`  [OK] Contact page created (ID: ${contactPageId})`);

    // Insert hero
    const heroResult = await client.query(`
      INSERT INTO components_contact_heroes (icon, title, subtitle)
      VALUES (
        'MessageCircle',
        'Get in Touch',
        'We''re here to answer your questions and help you achieve your perfect smile'
      ) RETURNING id
    `);
    await client.query(
      `INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, 'contact.hero', 'hero', 1)`,
      [contactPageId, heroResult.rows[0].id],
    );
    console.log("  [OK] Hero inserted");

    // Insert quick contact cards
    const cards = [
      {
        icon: "Phone",
        title: "Call Us",
        content: "+84 1900 8089",
        subtitle: "Mon-Sat: 8AM - 8PM",
      },
      {
        icon: "Mail",
        title: "Email Us",
        content: "info@saigondental.com",
        subtitle: "We reply within 24 hours",
      },
      {
        icon: "Clock",
        title: "Opening Hours",
        content: "Mon-Sat: 8AM - 8PM",
        subtitle: "Sunday: 9AM - 5PM",
      },
      {
        icon: "MapPin",
        title: "Visit Us",
        content: "2 Locations",
        subtitle: "District 1 & District 7",
      },
    ];

    let cardOrder = 1;
    for (const card of cards) {
      const cardResult = await client.query(
        `INSERT INTO components_contact_quick_contact_cards (icon, title, content, subtitle)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [card.icon, card.title, card.content, card.subtitle],
      );
      await client.query(
        `INSERT INTO contact_pages_quick_contact_cards_lnk (contact_page_id, card_id, card_ord)
         VALUES ($1, $2, $3)`,
        [contactPageId, cardResult.rows[0].id, cardOrder++],
      );
    }
    console.log("  [OK] Quick contact cards inserted (4 cards)");

    // Insert form
    const formResult = await client.query(`
      INSERT INTO components_contact_forms (title, description, badge_title, badge_subtitle)
      VALUES (
        'Send Us a Message',
        'Fill out the form below and we''ll get back to you as soon as possible',
        '24/7 Support',
        'We''re always here to help'
      ) RETURNING id
    `);
    const formId = formResult.rows[0].id;
    await client.query(
      `INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, 'contact.form', 'contact_form', 2)`,
      [contactPageId, formId],
    );

    // Insert form fields
    const fields = [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "John Doe",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+84 XXX XXX XXX",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "john@example.com",
      },
      {
        name: "service",
        label: "Service Interested",
        type: "select",
        required: true,
        placeholder: "Select a service",
        options: JSON.stringify([
          { value: "general", label: "General Checkup" },
          { value: "implants", label: "Dental Implants" },
          { value: "orthodontics", label: "Orthodontics" },
          { value: "cosmetic", label: "Cosmetic Dentistry" },
          { value: "emergency", label: "Emergency Care" },
        ]),
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Tell us about your dental needs...",
        rows: 5,
      },
    ];

    let fieldOrder = 1;
    for (const field of fields) {
      const fieldResult = await client.query(
        `INSERT INTO components_contact_form_fields (name, label, type, required, placeholder, rows, options)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          field.name,
          field.label,
          field.type,
          field.required,
          field.placeholder,
          field.rows || null,
          field.options || null,
        ],
      );
      await client.query(
        `INSERT INTO components_contact_forms_fields_lnk (form_id, field_id, field_ord)
         VALUES ($1, $2, $3)`,
        [formId, fieldResult.rows[0].id, fieldOrder++],
      );
    }
    console.log("  [OK] Contact form and fields inserted");

    // Insert CTA
    const ctaResult = await client.query(`
      INSERT INTO components_contact_ctas (
        title, description, 
        primary_button_text, primary_button_link,
        secondary_button_text, secondary_button_link
      ) VALUES (
        'Ready to Transform Your Smile?',
        'Book your consultation today and take the first step towards a healthier, more confident smile',
        'Book Appointment',
        '/contact',
        'Call Now',
        'tel:+8419008089'
      ) RETURNING id
    `);
    const ctaId = ctaResult.rows[0].id;
    await client.query(
      `INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, 'contact.cta', 'cta', 3)`,
      [contactPageId, ctaId],
    );

    // Insert CTA stats
    const stats = [
      { value: "15+", label: "Years Experience" },
      { value: "50K+", label: "Happy Patients" },
      { value: "98%", label: "Success Rate" },
    ];

    let statOrder = 1;
    for (const stat of stats) {
      const statResult = await client.query(
        `INSERT INTO components_contact_cta_stats (value, label)
         VALUES ($1, $2) RETURNING id`,
        [stat.value, stat.label],
      );
      await client.query(
        `INSERT INTO components_contact_ctas_stats_lnk (cta_id, stat_id, stat_ord)
         VALUES ($1, $2, $3)`,
        [ctaId, statResult.rows[0].id, statOrder++],
      );
    }
    console.log("  [OK] CTA and stats inserted\n");

    // ── STEP 7: Verify ────────────────────────────────────────────────────
    console.log("STEP 7: Verifying...");

    const verifyPage = await client.query(`
      SELECT id, document_id, title, published_at FROM contact_pages
    `);
    console.log(`  [OK] Contact page: ${verifyPage.rows[0].title}`);

    const verifyColumns = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'contact_pages' AND column_name = 'locale'
    `);
    if (verifyColumns.rows.length === 0) {
      console.log("  [OK] NO locale column (correct!)");
    } else {
      console.log("  [ERROR] locale column exists!");
    }

    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 056 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nIMPORTANT NEXT STEPS:");
    console.log("  1. Verify schema file has:");
    console.log('     "pluginOptions": { "i18n": { "localized": false } }');
    console.log("  2. Clear Strapi cache: rm -rf .cache .strapi build");
    console.log("  3. Restart Strapi: pm2 restart strapi");
    console.log("  4. Test Strapi Admin: Content Manager → Contact Page");
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
