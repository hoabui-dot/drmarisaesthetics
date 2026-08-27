#!/usr/bin/env node

/**
 * Migration Script 049: Create Contact Page Single Type in Strapi
 *
 * This script creates a comprehensive Contact page single type with all sections:
 *  1. Hero section
 *  2. Quick contact cards
 *  3. Contact form configuration
 *  4. CTA section
 *
 * Changes:
 *  1. CREATE contact_pages table (single type)
 *  2. CREATE contact_pages_cmps table (for components)
 *  3. CREATE component tables for hero, quick_contact_cards, contact_form, cta
 *  4. INSERT default contact page data
 *
 * Run (dev):
 *   node migration_scripts/049-create-contact-page-single-type.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/049-create-contact-page-single-type.js
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
  console.log("MIGRATION 049: Create Contact Page Single Type");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  /**
   * Helper to insert a component and return its ID
   */
  async function insertComponent(client, table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`;
    const result = await client.query(query, values);
    return result.rows[0].id;
  }

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create contact_pages table (Single Type) ─────────────────
    console.log("STEP 1: Creating contact_pages table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_pages (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER
      )
    `);
    console.log("  [OK] Table contact_pages created\n");

    // ── STEP 2: Create component tables ──────────────────────────────────
    console.log("STEP 2: Creating component tables...");

    // Hero component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_heroes (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        subtitle TEXT
      )
    `);
    console.log("  [OK] components_contact_heroes created");

    // Quick contact card component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_quick_contact_cards (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255)
      )
    `);
    console.log("  [OK] components_contact_quick_contact_cards created");

    // Contact form field component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_form_fields (
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
    console.log("  [OK] components_contact_form_fields created");

    // Contact form component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_forms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        badge_title VARCHAR(255),
        badge_subtitle VARCHAR(255)
      )
    `);
    console.log("  [OK] components_contact_forms created");

    // CTA stats component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_cta_stats (
        id SERIAL PRIMARY KEY,
        value VARCHAR(50) NOT NULL,
        label VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] components_contact_cta_stats created");

    // CTA component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_ctas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        primary_button_text VARCHAR(100),
        primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(100),
        secondary_button_link VARCHAR(255)
      )
    `);
    console.log("  [OK] components_contact_ctas created\n");

    // ── STEP 3: Create link tables ───────────────────────────────────────
    console.log("STEP 3: Creating link tables...");

    // Main components link table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_pages_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);
    console.log("  [OK] contact_pages_cmps created");

    // Quick contact cards link table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_pages_quick_contact_cards_lnk (
        id SERIAL PRIMARY KEY,
        contact_page_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        card_id INTEGER REFERENCES components_contact_quick_contact_cards(id) ON DELETE CASCADE,
        card_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] contact_pages_quick_contact_cards_lnk created");

    // Contact form fields link table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_forms_form_fields_lnk (
        id SERIAL PRIMARY KEY,
        form_id INTEGER REFERENCES components_contact_forms(id) ON DELETE CASCADE,
        field_id INTEGER REFERENCES components_contact_form_fields(id) ON DELETE CASCADE,
        field_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] components_contact_forms_fields_lnk created");

    // CTA stats link table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_ctas_stats_lnk (
        id SERIAL PRIMARY KEY,
        cta_id INTEGER REFERENCES components_contact_ctas(id) ON DELETE CASCADE,
        stat_id INTEGER REFERENCES components_contact_cta_stats(id) ON DELETE CASCADE,
        stat_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] components_contact_ctas_stats_lnk created\n");

    // ── STEP 4: Insert default data ──────────────────────────────────────
    console.log("STEP 4: Inserting default contact page data...");

    const checkExisting = await client.query(`
      SELECT COUNT(*) as count FROM contact_pages
    `);

    if (parseInt(checkExisting.rows[0].count) === 0) {
      // Insert main contact page
      const contactPageResult = await client.query(`
        INSERT INTO contact_pages (
          document_id, published_at
        ) VALUES (
          'contact-page',
          CURRENT_TIMESTAMP
        ) RETURNING id
      `);
      const contactPageId = contactPageResult.rows[0].id;
      console.log(`  [OK] Contact page created (ID: ${contactPageId})`);

      // Insert hero
      const heroId = await insertComponent(client, "components_contact_heroes", {
        icon: "Sparkles",
        title: "Contact Us",
        subtitle:
          "We are here to help you achieve a healthy and confident smile.",
      });

      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'contact.hero', 'hero', 1)
      `,
        [contactPageId, heroId],
      );
      console.log("  [OK] Hero section inserted");

      // Insert quick contact cards
      const cards = [
        {
          icon: "Phone",
          title: "Hotline",
          content: "1900 8059",
          subtitle: "hotline 24/7",
        },
        {
          icon: "Mail",
          title: "Email",
          content: "contact@nhakhoaquoctesaigon.vn",
          subtitle: "We'll reply within 24h",
        },
        {
          icon: "Clock",
          title: "Working Hours",
          content: "Mon-Fri: 08:00 - 18:00",
          subtitle: "Sat-Sun: 08:00 - 12:00",
        },
        {
          icon: "MessageCircle",
          title: "Live Chat",
          content: "Chat with us",
          subtitle: "Online Support",
        },
      ];

      let cardOrder = 1;
      for (const card of cards) {
        const cardResult = await client.query(
          `
          INSERT INTO components_contact_quick_contact_cards (icon, title, content, subtitle)
          VALUES ($1, $2, $3, $4) RETURNING id
        `,
          [card.icon, card.title, card.content, card.subtitle],
        );

        await client.query(
          `
          INSERT INTO contact_pages_quick_contact_cards_lnk (contact_page_id, card_id, card_ord)
          VALUES ($1, $2, $3)
        `,
          [contactPageId, cardResult.rows[0].id, cardOrder++],
        );
      }
      console.log("  [OK] Quick contact cards inserted (4 cards)");

      // Insert contact form
      const formId = await insertComponent(client, "components_contact_forms", {
        title: "Send us a message",
        description:
          "Fill out the form below and we'll get back to you as soon as possible.",
        badge_title: "24/7 Support",
        badge_subtitle: "Expert dental advice whenever you need it",
      });

      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'contact.form', 'contact_form', 2)
      `,
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
          rows: null,
          options: null,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
          placeholder: "+84 XXX XXX XXX",
          rows: null,
          options: null,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "john@example.com",
          rows: null,
          options: null,
        },
        {
          name: "service",
          label: "Service Interested",
          type: "select",
          required: true,
          placeholder: "Select a service",
          rows: null,
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
          options: null,
        },
      ];

      let fieldOrder = 1;
      for (const field of fields) {
        const fieldResult = await client.query(
          `
          INSERT INTO components_contact_form_fields (
            name, label, type, required, placeholder, rows, options
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `,
          [
            field.name,
            field.label,
            field.type,
            field.required,
            field.placeholder,
            field.rows,
            field.options,
          ],
        );

        await client.query(
          `
          INSERT INTO components_contact_forms_form_fields_lnk (form_id, field_id, field_ord)
          VALUES ($1, $2, $3)
        `,
          [formId, fieldResult.rows[0].id, fieldOrder++],
        );
      }
      console.log("  [OK] Contact form and formFields inserted");

      // Insert CTA
      const ctaResult = await client.query(`
        INSERT INTO components_contact_ctas (
          title, description, primary_button_text, primary_button_link, 
          secondary_button_text, secondary_button_link
        ) VALUES (
          'ĐỒNG HÀNH CÙNG NỤ CƯỜI TỎA SÁNG CỦA BẠN',
          'Nha khoa Quốc tế Sài Gòn mang đến giải pháp chăm sóc răng miệng toàn diện với công nghệ hiện đại và đội ngũ chuyên gia tận tâm.',
          'Book Appointment',
          '/booking',
          'Call Us: 1900 8059',
          'tel:19008059'
        ) RETURNING id
      `);
      const ctaId = ctaResult.rows[0].id;

      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'contact.cta', 'cta', 3)
      `,
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
          `
          INSERT INTO components_contact_cta_stats (value, label)
          VALUES ($1, $2) RETURNING id
        `,
          [stat.value, stat.label],
        );

        await client.query(
          `
          INSERT INTO components_contact_ctas_stats_lnk (cta_id, stat_id, stat_ord)
          VALUES ($1, $2, $3)
        `,
          [ctaId, statResult.rows[0].id, statOrder++],
        );
      }
      console.log("  [OK] CTA section and stats inserted\n");
    } else {
      console.log(`  [SKIP] Contact page already exists\n`);
    }

    // ── STEP 5: Verify ────────────────────────────────────────────────────
    console.log("STEP 5: Verifying...");
    const verify = await client.query(`
      SELECT id, published_at FROM contact_pages
    `);

    if (verify.rows.length > 0) {
      console.log(`  [OK] Contact page exists:`);
      verify.rows.forEach((row) => {
        console.log(`    - ID: ${row.id}`);
      });
    }
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 049 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Create Strapi schema files:");
    console.log(
      "     - strapi-cms/src/api/contact-page/content-types/contact-page/schema.json",
    );
    console.log("     - strapi-cms/src/components/contact/*.json");
    console.log("  2. Restart Strapi to register the new single type");
    console.log("  3. Update Contact page query in dental-frontend");
    console.log("  4. Update ContactPageClient.tsx to use Strapi data");
    console.log("  5. Test the contact page\n");
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
