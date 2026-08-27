#!/usr/bin/env node

/**
 * Migration Script: Create Customer Single Type Database Structure
 *
 * This script follows the approach of 023-create-about-us-single-type-db.js
 * to create a proper Single Type structure for the Customer page.
 *
 * The migration:
 * 1. Creates component tables for customer page sections
 * 2. Creates the customers single-type table
 * 3. Fetches existing customer page data from pages table
 * 4. Migrates content to the new single-type structure
 *
 * Run: node migration_scripts/025-create-customer-single-type-db.js
 */

const { Client } = require("pg");
const axios = require("axios");
const https = require("https");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN =
  process.env.STRAPI_API_TOKEN;

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function createCustomerSingleType() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION: Create Customer Single Type Database Structure");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`,
  );
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL database\n");

    // =========================================================================
    // STEP 1: Create component tables for customer page
    // =========================================================================
    console.log("STEP 1: Creating component tables...\n");

    // Components customer hero
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_hero (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT,
        images JSONB
      );
    `);
    console.log("  [OK] Created components_customer_hero table");

    // Components customer story item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_story_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        location VARCHAR(255),
        treatment VARCHAR(255),
        quote TEXT,
        rating INTEGER DEFAULT 5,
        before_after BOOLEAN DEFAULT false,
        icon VARCHAR(255)
      );
    `);
    console.log("  [OK] Created components_customer_story_items table");

    // Components customer success stories section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_success_stories (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("  [OK] Created components_customer_success_stories table");

    // Components customer benefit item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_benefit_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("  [OK] Created components_customer_benefit_items table");

    // Components customer benefits section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_benefits (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("  [OK] Created components_customer_benefits table");

    // Components customer stat item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_stat_items (
        id SERIAL PRIMARY KEY,
        number VARCHAR(255),
        label VARCHAR(255),
        suffix VARCHAR(255),
        icon VARCHAR(255)
      );
    `);
    console.log("  [OK] Created components_customer_stat_items table");

    // Components customer statistics section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_statistics (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255)
      );
    `);
    console.log("  [OK] Created components_customer_statistics table");

    // Components customer faq item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_faq_items (
        id SERIAL PRIMARY KEY,
        question TEXT,
        answer TEXT
      );
    `);
    console.log("  [OK] Created components_customer_faq_items table");

    // Components customer faq section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_faq (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("  [OK] Created components_customer_faq table");

    // Components customer contact info item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_contact_info_items (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255)
      );
    `);
    console.log("  [OK] Created components_customer_contact_info_items table");

    // Components customer cta
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_cta (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT,
        primary_button_text VARCHAR(255),
        primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(255),
        secondary_button_link VARCHAR(255)
      );
    `);
    console.log("  [OK] Created components_customer_cta table");

    // =========================================================================
    // STEP 2: Create customers single-type table
    // =========================================================================
    console.log("\nSTEP 2: Creating customers single-type table...\n");

    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255) UNIQUE,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      );
    `);
    console.log("  [OK] Created customers table");

    // Create components dynamic zone table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION
      );
    `);
    console.log("  [OK] Created customers_cmps table");

    // =========================================================================
    // STEP 3: Get existing customer page data
    // =========================================================================
    console.log("\nSTEP 3: Fetching existing customer page data...\n");

    // First try from Strapi API
    let existingContent = {};
    let pageTitle = "Our Customers - Saigon International Dental Clinic";
    let pageDescription =
      "Discover why thousands of patients trust Saigon International Dental Clinic for their dental care needs.";

    try {
      const pagesResponse = await axiosInstance.get(
        `${STRAPI_URL}/api/pages?filters[slug][$eq]=customers`,
      );

      if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
        const page = pagesResponse.data.data[0];
        console.log(
          `  [OK] Found Customer page from Strapi API with ID: ${page.id}`,
        );

        pageTitle = page.title || pageTitle;
        pageDescription = page.description || pageDescription;

        if (page.content) {
          try {
            existingContent =
              typeof page.content === "string"
                ? JSON.parse(page.content)
                : page.content;
            console.log("  [OK] Parsed existing content from Strapi API");
          } catch (e) {
            console.log(
              "  [WARN] Could not parse content from Strapi, will use defaults",
            );
          }
        }
      }
    } catch (apiError) {
      console.log(
        `  [WARN] Could not fetch from Strapi API: ${apiError.message}`,
      );
      console.log("  [INFO] Trying direct database query...");
    }

    // If API failed, try direct database query
    if (Object.keys(existingContent).length === 0) {
      const dbResult = await client.query(
        `SELECT id, document_id, title, description, content 
         FROM pages 
         WHERE slug = 'customers' 
         ORDER BY created_at DESC 
         LIMIT 1`,
      );

      if (dbResult.rows.length > 0) {
        const page = dbResult.rows[0];
        console.log(
          `  [OK] Found Customer page from database with ID: ${page.id}`,
        );

        pageTitle = page.title || pageTitle;
        pageDescription = page.description || pageDescription;

        if (page.content) {
          try {
            existingContent =
              typeof page.content === "string"
                ? JSON.parse(page.content)
                : page.content;
            console.log("  [OK] Parsed existing content from database");
          } catch (e) {
            console.log("  [WARN] Could not parse content from database");
          }
        }
      } else {
        console.log(
          "  [INFO] No existing customer page found, will use default content",
        );
      }
    }

    // =========================================================================
    // STEP 4: Insert customers single-type record
    // =========================================================================
    console.log("\nSTEP 4: Creating Customers single-type record...\n");

    const customersResult = await client.query(
      `
      INSERT INTO customers (document_id, title, description, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (document_id) DO UPDATE
      SET title = $2, description = $3, published_at = $4, updated_at = NOW()
      RETURNING id;
    `,
      [
        "customers-singleton",
        pageTitle,
        pageDescription,
        new Date().toISOString(),
      ],
    );

    const customersId = customersResult.rows[0].id;
    console.log(
      `  [OK] Created/Updated Customers record with ID: ${customersId}`,
    );

    // =========================================================================
    // STEP 5: Insert components
    // =========================================================================
    console.log("\nSTEP 5: Inserting components...\n");
    let componentOrder = 1;

    // Hero Component
    if (existingContent.hero) {
      const hero = existingContent.hero;
      const heroResult = await client.query(
        `
        INSERT INTO components_customer_hero (badge, title, subtitle, description, images)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `,
        [
          hero.badge,
          hero.title,
          hero.subtitle,
          hero.description,
          JSON.stringify(hero.images || []),
        ],
      );

      await client.query(
        `
        INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          customersId,
          heroResult.rows[0].id,
          "customer.hero",
          "layout",
          componentOrder++,
        ],
      );

      console.log("  [OK] Inserted hero component");
    }

    // Success Stories Component
    if (existingContent.successStories) {
      const successStories = existingContent.successStories;
      const successStoriesResult = await client.query(
        `
        INSERT INTO components_customer_success_stories (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          successStories.badge,
          successStories.title,
          successStories.description,
        ],
      );

      await client.query(
        `
        INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          customersId,
          successStoriesResult.rows[0].id,
          "customer.success-stories",
          "layout",
          componentOrder++,
        ],
      );

      // Insert story items
      if (successStories.stories) {
        for (const story of successStories.stories) {
          await client.query(
            `
            INSERT INTO components_customer_story_items (name, location, treatment, quote, rating, before_after, icon)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `,
            [
              story.name,
              story.location,
              story.treatment,
              story.quote,
              story.rating || 5,
              story.beforeAfter || false,
              story.icon,
            ],
          );
        }
      }

      console.log(
        "  [OK] Inserted success stories component with " +
          (successStories.stories?.length || 0) +
          " stories",
      );
    }

    // Customer Benefits Component
    if (existingContent.customerBenefits) {
      const customerBenefits = existingContent.customerBenefits;
      const customerBenefitsResult = await client.query(
        `
        INSERT INTO components_customer_benefits (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          customerBenefits.badge,
          customerBenefits.title,
          customerBenefits.description,
        ],
      );

      await client.query(
        `
        INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          customersId,
          customerBenefitsResult.rows[0].id,
          "customer.benefits",
          "layout",
          componentOrder++,
        ],
      );

      // Insert benefit items
      if (customerBenefits.benefits) {
        for (const benefit of customerBenefits.benefits) {
          await client.query(
            `
            INSERT INTO components_customer_benefit_items (icon, title, description)
            VALUES ($1, $2, $3);
          `,
            [benefit.icon, benefit.title, benefit.description],
          );
        }
      }

      console.log(
        "  [OK] Inserted customer benefits component with " +
          (customerBenefits.benefits?.length || 0) +
          " benefits",
      );
    }

    // Statistics Component
    if (existingContent.statistics) {
      const statistics = existingContent.statistics;
      const statisticsResult = await client.query(
        `
        INSERT INTO components_customer_statistics (badge, title)
        VALUES ($1, $2)
        RETURNING id;
      `,
        [statistics.badge, statistics.title],
      );

      await client.query(
        `
        INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          customersId,
          statisticsResult.rows[0].id,
          "customer.statistics",
          "layout",
          componentOrder++,
        ],
      );

      // Insert stat items
      if (statistics.stats) {
        for (const stat of statistics.stats) {
          await client.query(
            `
            INSERT INTO components_customer_stat_items (number, label, suffix, icon)
            VALUES ($1, $2, $3, $4);
          `,
            [stat.number, stat.label, stat.suffix, stat.icon],
          );
        }
      }

      console.log(
        "  [OK] Inserted statistics component with " +
          (statistics.stats?.length || 0) +
          " stats",
      );
    }

    // FAQ Component
    if (existingContent.faq) {
      const faq = existingContent.faq;
      const faqResult = await client.query(
        `
        INSERT INTO components_customer_faq (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [faq.badge, faq.title, faq.description],
      );

      await client.query(
        `
        INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          customersId,
          faqResult.rows[0].id,
          "customer.faq",
          "layout",
          componentOrder++,
        ],
      );

      // Insert faq items
      if (faq.questions) {
        for (const q of faq.questions) {
          await client.query(
            `
            INSERT INTO components_customer_faq_items (question, answer)
            VALUES ($1, $2);
          `,
            [q.question, q.answer],
          );
        }
      }

      console.log(
        "  [OK] Inserted FAQ component with " +
          (faq.questions?.length || 0) +
          " questions",
      );
    }

    // CTA Component
    if (existingContent.cta) {
      const cta = existingContent.cta;
      const ctaResult = await client.query(
        `
        INSERT INTO components_customer_cta (badge, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `,
        [
          cta.badge,
          cta.title,
          cta.description,
          cta.primaryButtonText,
          cta.primaryButtonLink,
          cta.secondaryButtonText,
          cta.secondaryButtonLink,
        ],
      );

      await client.query(
        `
        INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          customersId,
          ctaResult.rows[0].id,
          "customer.cta",
          "layout",
          componentOrder++,
        ],
      );

      // Insert contact info
      if (cta.contactInfo) {
        for (const info of cta.contactInfo) {
          await client.query(
            `
            INSERT INTO components_customer_contact_info_items (text)
            VALUES ($1);
          `,
            [info.text],
          );
        }
      }

      console.log("  [OK] Inserted CTA component");
    }

    // =========================================================================
    // STEP 6: Verify migration
    // =========================================================================
    console.log("\nSTEP 6: Verifying migration...\n");

    const verifyCustomers = await client.query(
      `SELECT id, document_id, title, published_at FROM customers WHERE document_id = 'customers-singleton'`,
    );

    if (verifyCustomers.rows.length > 0) {
      console.log("  [OK] Customers single-type created successfully!");
      console.log(`      - ID: ${verifyCustomers.rows[0].id}`);
      console.log(
        `      - Document ID: ${verifyCustomers.rows[0].document_id}`,
      );
      console.log(`      - Title: ${verifyCustomers.rows[0].title}`);
      console.log(
        `      - Published: ${verifyCustomers.rows[0].published_at ? "Yes" : "No"}`,
      );
    }

    const verifyCmps = await client.query(
      `SELECT COUNT(*) as count FROM customers_cmps WHERE entity_id = $1`,
      [customersId],
    );
    console.log(`      - Total components: ${verifyCmps.rows[0].count}`);

    // =========================================================================
    // Summary
    // =========================================================================
    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nSummary:");
    console.log(`  - Created ${componentOrder - 1} components`);
    console.log("  - Customers single-type is ready for use");
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to load new content types");
    console.log("  2. Update frontend to use /api/customers endpoint");
    console.log("  3. Test the Customers page at /customers");
    console.log("");
  } catch (error) {
    console.error("\n[ERROR] Migration failed:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Database connection closed");
  }
}

// Run migration
createCustomerSingleType();
