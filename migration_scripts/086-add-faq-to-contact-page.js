#!/usr/bin/env node
const { Pool } = require("pg");
const path = require("path");

// Load .env from strapi-cms directory
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

const pool = new Pool({
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: parseInt(process.env.DATABASE_PORT || '5437'),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const FAQ_DATA = [
  {
    q: "What is the best option for missing teeth?",
    a: "Dental implants are often the best long-term solution as they replace both the root and crown, providing stability and preventing bone loss."
  },
  {
    q: "How long do porcelain crowns last?",
    a: "With proper care, porcelain crowns can last from 10–20 years or even longer."
  },
  {
    q: "How much do porcelain crowns cost?",
    a: "The cost depends on the material and case complexity. We offer various options to suit different budgets while maintaining high quality."
  },
  {
    q: "How much does a dental implant cost?",
    a: "Implant costs vary based on the implant brand, bone condition, and treatment plan. A detailed quote will be provided after consultation."
  },
  {
    q: "Is the procedure painful?",
    a: "Modern techniques and anesthesia ensure minimal discomfort during and after the procedure."
  }
];

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("[INFO] Started Dedicated Contact FAQ Migration (Strapi 5)...");

    // 1. Get ALL Contact Page IDs (Draft and Published)
    const contactPageRes = await client.query('SELECT id FROM contact_pages');
    if (contactPageRes.rows.length === 0) {
      throw new Error("Contact Page records not found.");
    }
    const contactPageIds = contactPageRes.rows.map(r => r.id);
    console.log(`[OK] Target Contact Page IDs: ${contactPageIds.join(', ')}`);

    // 2. CLEANUP: Remove old links in both legacy and active tables
    await client.query(
      "DELETE FROM contact_pages_components WHERE entity_id = ANY($1) AND field = 'faq'",
      [contactPageIds]
    );
    await client.query(
      "DELETE FROM contact_pages_cmps WHERE entity_id = ANY($1) AND field = 'faq'",
      [contactPageIds]
    );
    console.log("[OK] Cleaned up existing FAQ links.");

    // 3. Insert FAQ Section Header (Dedicated contact category)
    const faqSectionRes = await client.query(
      "INSERT INTO components_contact_faqs (title, subtitle) VALUES ($1, $2) RETURNING id",
      ["Frequently Asked Questions", "Find answers to your common dental concerns and clinic procedures."]
    );
    const faqSectionId = faqSectionRes.rows[0].id;
    console.log(`[OK] Created Dedicated Contact FAQ Section (ID: ${faqSectionId})`);

    // 4. Insert Items and link to section (Dedicated contact category)
    for (let i = 0; i < FAQ_DATA.length; i++) {
      const item = FAQ_DATA[i];
      const itemRes = await client.query(
        "INSERT INTO components_contact_faq_items (question, answer) VALUES ($1, $2) RETURNING id",
        [item.q, item.a]
      );
      const itemId = itemRes.rows[0].id;

      // Note: Using components_contact_faqs_cmps (Strapi 5 pattern)
      await client.query(
        'INSERT INTO components_contact_faqs_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)',
        [faqSectionId, itemId, 'contact.faq-item', 'questions', i + 1]
      );
    }
    console.log(`[OK] Inserted 5 dedicated FAQ items into section ${faqSectionId}.`);

    // 5. Link Section to ALL Contact Page versions using the ACTIVE Strapi 5 table: contact_pages_cmps
    for (const pageId of contactPageIds) {
      await client.query(
        'INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)',
        [pageId, faqSectionId, 'contact.faq', 'faq', 4]
      );
    }
    console.log("[OK] Linked Dedicated FAQ Section via contact_pages_cmps.");

    await client.query("COMMIT");
    console.log("\n[SUCCESS] Dedicated FAQ Migration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n[ERROR] Migration failed. Transaction rolled back.");
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
