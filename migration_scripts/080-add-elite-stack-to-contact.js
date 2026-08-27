#!/usr/bin/env node

const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    await client.query("BEGIN");
    console.log("Connected to PostgreSQL");

    // 1. Create Elite Stack Card component table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_elite_stack_cards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon_string VARCHAR(255),
        cta_label VARCHAR(255)
      )
    `);

    // 2. Create Elite Stack main component table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_elite_stacks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    // 3. Create Link table between Elite Stack and Elite Stack Cards
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_elite_stacks_cards_links (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER NOT NULL REFERENCES components_contact_elite_stacks(id) ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL REFERENCES components_contact_elite_stack_cards(id) ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);

    console.log("Tables created.");

    // 4. Prepopulate Elite Stack main component
    const resStack = await client.query(`
      INSERT INTO components_contact_elite_stacks (title, description)
      VALUES (
        'Professional Dental Clinic for International Patients',
        'At Saigon International Dental Clinic, our goal is to deliver world-class dental care combining advanced technology with the warmest hospitality. We provide seamless, premium journeys tailored exclusively for our global community visiting Ho Chi Minh City.'
      ) RETURNING id
    `);
    const stackId = resStack.rows[0].id;

    // 5. Prepopulate the 3 Cards
    const cards = [
      {
        title: "Location & Logistics",
        description: "PhÃº Nhuáº­n Ward, Heart of HCMC. Extremely accessible for international stays and tourism.",
        icon_string: "MapPin",
        cta_label: ""
      },
      {
        title: "24/7 Priority Support",
        description: "Personalized Assistance for International Inquiries, ensuring language barriers never hinder the perfect treatment.",
        icon_string: "MessageCircle",
        cta_label: ""
      },
      {
        title: "Expert Guidance",
        description: "Complimentary Consultation with Dental Specialists before you fly.",
        icon_string: "Phone",
        cta_label: "Verify Availability"
      }
    ];

    let order = 1;
    for (const card of cards) {
      const resCard = await client.query(`
        INSERT INTO components_contact_elite_stack_cards (title, description, icon_string, cta_label)
        VALUES ($1, $2, $3, $4) RETURNING id
      `, [card.title, card.description, card.icon_string, card.cta_label]);
      
      const cardId = resCard.rows[0].id;
      
      await client.query(`
        INSERT INTO components_contact_elite_stacks_cards_links (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `, [stackId, cardId, 'contact.elite-stack-card', 'cards', order]);
      
      order++;
    }

    console.log("Prepopulated 3 cards and linked to Elite Stack.");

    // 6. Link to contact_pages (Single type usually has ID 1 or the first row)
    const resPage = await client.query(`SELECT id FROM contact_pages ORDER BY id ASC LIMIT 1`);
    if (resPage.rows.length > 0) {
      const pageId = resPage.rows[0].id;
      
      // Clean up any existing mapping for elite_stack to avoid duplicates when re-running
      await client.query(`DELETE FROM contact_pages_components WHERE entity_id = $1 AND field = 'elite_stack'`, [pageId]);

      await client.query(`
        INSERT INTO contact_pages_components (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `, [pageId, stackId, 'contact.elite-stack', 'elite_stack', 1]);
      console.log(`Linked Elite Stack to Contact Page ID ${pageId}`);
    } else {
      console.warn("Could not find contact_pages entry. You will need to create and link manually in CMS.");
    }

    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
