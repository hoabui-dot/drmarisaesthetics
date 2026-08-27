const { Client } = require("pg");
const axios = require("axios");
const https = require("https");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN =
  process.env.STRAPI_API_TOKEN;

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function createAboutUsSingleType() {
  console.log("🚀 Creating About Us single-type in database...\n");

  try {
    await client.connect();
    console.log("✓ Connected to PostgreSQL database");

    // Step 1: Create component tables
    console.log("\n📦 Creating component tables...");

    // Components about pillar item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_pillar_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255)
      );
    `);
    console.log("✓ Created components_about_pillar_items table");

    // Components about value item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_value_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_value_items table");

    // Components about commitment item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_commitment_items (
        id SERIAL PRIMARY KEY,
        number VARCHAR(255),
        icon VARCHAR(255),
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_commitment_items table");

    // Components about contact info item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_contact_info_items (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255)
      );
    `);
    console.log("✓ Created components_about_contact_info_items table");

    // Components about hero
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_hero (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_hero table");

    // Components about achievements
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_achievements (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_achievements table");

    // Components about why choose us
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_why_choose_us (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_why_choose_us table");

    // Components about philosophy
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_philosophy (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        quote VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_philosophy table");

    // Components about core values
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_core_values (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_core_values table");

    // Components about commitment
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_commitment (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_about_commitment table");

    // Components about cta
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_about_cta (
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
    console.log("✓ Created components_about_cta table");

    // Step 2: Create about_us single-type table
    console.log("\n📄 Creating about_us single-type table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS about_us (
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
    console.log("✓ Created about_us table");

    // Create components dynamic zone table
    await client.query(`
      CREATE TABLE IF NOT EXISTS about_us_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES about_us(id) ON DELETE CASCADE,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION
      );
    `);
    console.log("✓ Created about_us_cmps table");

    // Step 3: Get existing about-us page data
    console.log("\n📖 Fetching existing about-us page data...");
    const pagesResponse = await axiosInstance.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=about-us`,
    );

    if (pagesResponse.data.data.length === 0) {
      console.log("❌ About Us page not found");
      await client.end();
      return;
    }

    const page = pagesResponse.data.data[0];
    console.log(`✓ Found About Us page with ID: ${page.id}`);

    // Parse the existing content
    let existingContent = {};
    if (page.content) {
      try {
        existingContent = JSON.parse(page.content);
        console.log("✓ Parsed existing content successfully");
      } catch (e) {
        console.error("❌ Failed to parse existing content:", e);
        await client.end();
        return;
      }
    }

    // Step 4: Insert about_us record
    console.log("\n💾 Creating About Us single-type record...");

    const aboutUsResult = await client.query(
      `
      INSERT INTO about_us (document_id, title, description, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (document_id) DO UPDATE
      SET title = $2, description = $3, published_at = $4, updated_at = NOW()
      RETURNING id;
    `,
      [
        "about-us-singleton",
        page.title || "About Us - Saigon International Dental Clinic",
        page.description ||
          "Learn about our mission, values, and the team behind Saigon International Dental Clinic",
        new Date().toISOString(),
      ],
    );

    const aboutUsId = aboutUsResult.rows[0].id;
    console.log(`✓ Created/Updated About Us record with ID: ${aboutUsId}`);

    // Step 5: Insert components
    console.log("\n🔧 Inserting components...");
    let componentOrder = 1;

    // Hero Component
    if (existingContent.hero) {
      const hero = existingContent.hero;
      const heroResult = await client.query(
        `
        INSERT INTO components_about_hero (badge, title, subtitle, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `,
        [hero.badge, hero.title, hero.subtitle, hero.description],
      );

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          heroResult.rows[0].id,
          "about.hero",
          "layout",
          componentOrder++,
        ],
      );

      console.log("✓ Inserted hero component");
    }

    // Achievements Component
    if (existingContent.achievements) {
      const achievements = existingContent.achievements;
      const achievementsResult = await client.query(
        `
        INSERT INTO components_about_achievements (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [achievements.badge, achievements.title, achievements.description],
      );

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          achievementsResult.rows[0].id,
          "about.achievements",
          "layout",
          componentOrder++,
        ],
      );

      console.log("✓ Inserted achievements component");
    }

    // Why Choose Us Component
    if (existingContent.whyChooseUs) {
      const whyChooseUs = existingContent.whyChooseUs;
      const whyChooseUsResult = await client.query(
        `
        INSERT INTO components_about_why_choose_us (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [whyChooseUs.badge, whyChooseUs.title, whyChooseUs.description],
      );

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          whyChooseUsResult.rows[0].id,
          "about.why-choose-us",
          "layout",
          componentOrder++,
        ],
      );

      console.log("✓ Inserted why-choose-us component");
    }

    // Philosophy Component
    if (existingContent.philosophy) {
      const philosophy = existingContent.philosophy;
      const philosophyResult = await client.query(
        `
        INSERT INTO components_about_philosophy (badge, title, quote, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `,
        [
          philosophy.badge,
          philosophy.title,
          philosophy.quote,
          philosophy.description,
        ],
      );

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          philosophyResult.rows[0].id,
          "about.philosophy",
          "layout",
          componentOrder++,
        ],
      );

      // Insert pillars
      if (philosophy.pillars) {
        for (const pillar of philosophy.pillars) {
          await client.query(
            `
            INSERT INTO components_about_pillar_items (title, subtitle)
            VALUES ($1, $2);
          `,
            [pillar.title, pillar.subtitle],
          );
        }
      }

      console.log("✓ Inserted philosophy component");
    }

    // Core Values Component
    if (existingContent.coreValues) {
      const coreValues = existingContent.coreValues;
      const coreValuesResult = await client.query(
        `
        INSERT INTO components_about_core_values (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [coreValues.badge, coreValues.title, coreValues.description],
      );

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          coreValuesResult.rows[0].id,
          "about.core-values",
          "layout",
          componentOrder++,
        ],
      );

      // Insert values
      if (coreValues.values) {
        for (const value of coreValues.values) {
          await client.query(
            `
            INSERT INTO components_about_value_items (icon, title, description)
            VALUES ($1, $2, $3);
          `,
            [value.icon, value.title, value.description],
          );
        }
      }

      console.log("✓ Inserted core-values component");
    }

    // Commitment Component
    if (existingContent.commitment) {
      const commitment = existingContent.commitment;
      const commitmentResult = await client.query(
        `
        INSERT INTO components_about_commitment (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [commitment.badge, commitment.title, commitment.description],
      );

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          commitmentResult.rows[0].id,
          "about.commitment",
          "layout",
          componentOrder++,
        ],
      );

      // Insert commitments
      if (commitment.commitments) {
        for (const item of commitment.commitments) {
          await client.query(
            `
            INSERT INTO components_about_commitment_items (number, icon, title, subtitle, description)
            VALUES ($1, $2, $3, $4, $5);
          `,
            [
              item.number,
              item.icon,
              item.title,
              item.subtitle,
              item.description,
            ],
          );
        }
      }

      console.log("✓ Inserted commitment component");
    }

    // CTA Component
    if (existingContent.cta) {
      const cta = existingContent.cta;
      const ctaResult = await client.query(
        `
        INSERT INTO components_about_cta (badge, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
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
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          ctaResult.rows[0].id,
          "about.cta",
          "layout",
          componentOrder++,
        ],
      );

      // Insert contact info
      if (cta.contactInfo) {
        for (const info of cta.contactInfo) {
          await client.query(
            `
            INSERT INTO components_about_contact_info_items (text)
            VALUES ($1);
          `,
            [info.text],
          );
        }
      }

      console.log("✓ Inserted cta component");
    }

    console.log("\n✅ About Us single-type created successfully!");
    console.log(`📋 Total components: ${componentOrder - 1}`);
    console.log("\n💡 Next steps:");
    console.log("  1. Restart Strapi to load new content types");
    console.log("  2. Update frontend to use /api/about-us endpoint");
    console.log("  3. Test the About Us page at /about");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n✓ Database connection closed");
  }
}

async function main() {
  try {
    await createAboutUsSingleType();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
