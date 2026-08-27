#!/usr/bin/env node

/**
 * Migration Script: Create Services Overview Single Type
 *
 * This script creates a "services-overview" Single Type in Strapi with component-based structure:
 * - Hero section (title, description)
 * - Service Cards (slug, title, titleEn, description, icon, color)
 * - CTA section (title, description, buttons)
 * - Features section (icon, title, description)
 *
 * Pattern: Component-based (like customers single type)
 * Purpose: For /services listing page
 *
 * Based on: dental-frontend/src/app/services/ServicesPageClient.tsx
 * Connection: Direct PostgreSQL connection to Strapi database
 */

const { Client } = require("pg");

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || "100.68.50.41",
  port: process.env.DB_PORT || 5437,
  database: process.env.DB_NAME || "dental_cms_strapi",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
};

/**
 * Main migration function
 */
async function createServicesOverviewSingleType() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(80));
  console.log("SERVICES OVERVIEW SINGLE TYPE MIGRATION");
  console.log("=".repeat(80));
  console.log(
    `Database: ${DB_CONFIG.database}@${DB_CONFIG.host}:${DB_CONFIG.port}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // Step 1: Create component tables
    console.log("Step 1: Creating component tables...");

    // 1.1 Hero component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_hero (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  [OK] Created components_services_overview_hero");

    // 1.2 Service card items
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_service_items (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255),
        title VARCHAR(255),
        title_en VARCHAR(255),
        description TEXT,
        icon VARCHAR(255),
        color VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  [OK] Created components_services_overview_service_items");

    // 1.3 Service cards container
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_service_cards (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  [OK] Created components_services_overview_service_cards");

    // 1.4 Service cards junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_service_cards_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES components_services_overview_service_cards(id) ON DELETE CASCADE,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION,
        UNIQUE(entity_id, cmp_id, field, component_type)
      )
    `);
    console.log(
      "  [OK] Created components_services_overview_service_cards_cmps",
    );

    // 1.5 CTA component
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_cta (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        primary_button_text VARCHAR(255),
        primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(255),
        secondary_button_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  [OK] Created components_services_overview_cta");

    // 1.6 Feature items
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_feature_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(255),
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  [OK] Created components_services_overview_feature_items");

    // 1.7 Features container
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_features (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  [OK] Created components_services_overview_features");

    // 1.8 Features junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_features_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES components_services_overview_features(id) ON DELETE CASCADE,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION,
        UNIQUE(entity_id, cmp_id, field, component_type)
      )
    `);
    console.log("  [OK] Created components_services_overview_features_cmps");

    // Step 2: Create services_overview single type table
    console.log("\nStep 2: Creating services_overview single type table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS services_overview (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255),
        title VARCHAR(255),
        description TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      )
    `);
    console.log("  [OK] Created services_overview table");

    // Step 3: Create junction table for services_overview
    await client.query(`
      CREATE TABLE IF NOT EXISTS services_overview_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES services_overview(id) ON DELETE CASCADE,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION,
        UNIQUE(entity_id, cmp_id, field, component_type)
      )
    `);
    console.log("  [OK] Created services_overview_cmps junction table");

    // Step 4: Clear existing data
    console.log("\nStep 3: Clearing existing data...");
    const tables = [
      "services_overview_cmps",
      "components_services_overview_features_cmps",
      "components_services_overview_service_cards_cmps",
      "components_services_overview_hero",
      "components_services_overview_service_items",
      "components_services_overview_service_cards",
      "components_services_overview_cta",
      "components_services_overview_feature_items",
      "components_services_overview_features",
      "services_overview",
    ];

    for (const table of tables) {
      await client.query(`DELETE FROM ${table}`).catch(() => {});
    }
    console.log("  [OK] Cleared existing data");

    // Step 5: Seed data with cloning (draft + published)
    console.log("\nStep 4: Seeding data with cloning...");

    const docId = "services-overview-singleton";
    const draftId = 1;
    const publishedId = 2;

    // Create parent records (draft + published)
    await client.query(
      "INSERT INTO services_overview (id, document_id, title, description, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, NULL, NOW(), NOW())",
      [draftId, docId, "Services Overview", "Dental services listing"],
    );
    await client.query(
      "INSERT INTO services_overview (id, document_id, title, description, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())",
      [publishedId, docId, "Services Overview", "Dental services listing"],
    );
    console.log("  [OK] Created parent records (draft + published)");

    // Helper function to seed with clones
    const seedWithClones = async (table, data, componentType, order) => {
      let draftCmpId, pubCmpId;

      if (Object.keys(data).length === 0) {
        // Empty data - just insert with default values
        const draftResult = await client.query(
          `INSERT INTO ${table} DEFAULT VALUES RETURNING id`,
        );
        draftCmpId = draftResult.rows[0].id;

        const pubResult = await client.query(
          `INSERT INTO ${table} DEFAULT VALUES RETURNING id`,
        );
        pubCmpId = pubResult.rows[0].id;
      } else {
        // Has data - insert with values
        const columns = Object.keys(data).join(", ");
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const draftResult = await client.query(
          `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`,
          values,
        );
        draftCmpId = draftResult.rows[0].id;

        const pubResult = await client.query(
          `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`,
          values,
        );
        pubCmpId = pubResult.rows[0].id;
      }

      // Link to parent
      await client.query(
        "INSERT INTO services_overview_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'layout', $4)",
        [draftId, draftCmpId, componentType, order],
      );
      await client.query(
        "INSERT INTO services_overview_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'layout', $4)",
        [publishedId, pubCmpId, componentType, order],
      );

      return { draft: draftCmpId, published: pubCmpId };
    };

    // 5.1 Hero
    console.log("  Seeding Hero...");
    await seedWithClones(
      "components_services_overview_hero",
      {
        title: "Professional Dental Services",
        description:
          "We provide a wide range of dental services with modern technology and experienced doctors",
      },
      "services-overview.hero",
      1,
    );

    // 5.2 Service Cards
    console.log("  Seeding Service Cards...");
    const serviceCardsIds = await seedWithClones(
      "components_services_overview_service_cards",
      {},
      "services-overview.service-cards",
      2,
    );

    const services = [
      {
        slug: "implant",
        title: "Cấy Ghép Implant",
        title_en: "Dental Implants",
        description:
          "Giải pháp phục hồi răng mất vĩnh viễn với công nghệ cấy ghép Implant hiện đại",
        icon: "🦷",
        color: "#007BFF",
      },
      {
        slug: "invisalign",
        title: "Niềng Răng Invisalign",
        title_en: "Invisalign Clear Aligners",
        description:
          "Niềng răng trong suốt không mắc cài, thoải mái và thẩm mỹ",
        icon: "😁",
        color: "#3AA0FF",
      },
      {
        slug: "veneer",
        title: "Bọc Răng Sứ",
        title_en: "Porcelain Veneers",
        description: "Răng sứ thẩm mỹ cao cấp, bền đẹp và tự nhiên",
        icon: "✨",
        color: "#00C9FF",
      },
      {
        slug: "whitening",
        title: "Tẩy Trắng Răng",
        title_en: "Teeth Whitening",
        description: "Làm trắng răng an toàn, hiệu quả với công nghệ hiện đại",
        icon: "⭐",
        color: "#FFD700",
      },
    ];

    for (const parentId of [serviceCardsIds.draft, serviceCardsIds.published]) {
      for (let i = 0; i < services.length; i++) {
        const s = services[i];
        const serviceId = (
          await client.query(
            "INSERT INTO components_services_overview_service_items (slug, title, title_en, description, icon, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [s.slug, s.title, s.title_en, s.description, s.icon, s.color],
          )
        ).rows[0].id;

        await client.query(
          "INSERT INTO components_services_overview_service_cards_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'services', $4)",
          [parentId, serviceId, "services-overview.service-item", i + 1],
        );
      }
    }

    // 5.3 CTA
    console.log("  Seeding CTA...");
    await seedWithClones(
      "components_services_overview_cta",
      {
        title: "Ready to Transform Your Smile?",
        description:
          "Schedule a free consultation with our experienced specialist team",
        primary_button_text: "Book Consultation",
        primary_button_link: "/contact",
        secondary_button_text: "Call Now",
        secondary_button_link: "tel:1900808080",
      },
      "services-overview.cta",
      3,
    );

    // 5.4 Features
    console.log("  Seeding Features...");
    const featuresIds = await seedWithClones(
      "components_services_overview_features",
      {},
      "services-overview.features",
      4,
    );

    const features = [
      {
        icon: "🏆",
        title: "International Standards",
        description:
          "We follow international dental care standards with modern equipment and advanced technology",
      },
      {
        icon: "👨‍⚕️",
        title: "Experienced Doctors",
        description:
          "Team of specialist doctors with 15+ years of experience and international certifications",
      },
      {
        icon: "💎",
        title: "Premium Quality",
        description:
          "We use only premium materials from leading brands worldwide",
      },
    ];

    for (const parentId of [featuresIds.draft, featuresIds.published]) {
      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        const featureId = (
          await client.query(
            "INSERT INTO components_services_overview_feature_items (icon, title, description) VALUES ($1, $2, $3) RETURNING id",
            [f.icon, f.title, f.description],
          )
        ).rows[0].id;

        await client.query(
          "INSERT INTO components_services_overview_features_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'features', $4)",
          [parentId, featureId, "services-overview.feature-item", i + 1],
        );
      }
    }

    // Step 6: Verification
    console.log("\n" + "=".repeat(80));
    console.log("VERIFICATION");
    console.log("=".repeat(80));

    const verification = await client.query(`
      SELECT id, document_id, title, published_at
      FROM services_overview
      ORDER BY published_at NULLS FIRST
    `);

    console.log("\nServices Overview Records:");
    console.log("-".repeat(80));
    verification.rows.forEach((row) => {
      const status = row.published_at ? "Published" : "Draft    ";
      console.log(`ID: ${row.id} | Status: ${status} | Title: ${row.title}`);
    });

    // Count components
    const heroCount = await client.query(
      "SELECT COUNT(*) FROM components_services_overview_hero",
    );
    const serviceCount = await client.query(
      "SELECT COUNT(*) FROM components_services_overview_service_items",
    );
    const ctaCount = await client.query(
      "SELECT COUNT(*) FROM components_services_overview_cta",
    );
    const featureCount = await client.query(
      "SELECT COUNT(*) FROM components_services_overview_feature_items",
    );

    console.log("\nComponent Counts:");
    console.log("-".repeat(80));
    console.log(`Hero components: ${heroCount.rows[0].count}`);
    console.log(`Service items: ${serviceCount.rows[0].count}`);
    console.log(`CTA components: ${ctaCount.rows[0].count}`);
    console.log(`Feature items: ${featureCount.rows[0].count}`);

    console.log("\n" + "=".repeat(80));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\nNext Steps:");
    console.log(
      "1. Visit Strapi Admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin",
    );
    console.log("2. Navigate to: Content Manager → Services Overview");
    console.log("3. Review the component structure");
    console.log("4. The single type is already published");
    console.log("\nFrontend URL:");
    console.log("http://localhost:3000/services");
    console.log("=".repeat(80));
  } catch (error) {
    console.error("\n" + "=".repeat(80));
    console.error("[ERROR] Migration failed:");
    console.error("=".repeat(80));
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error("=".repeat(80));
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n[OK] Database connection closed");
  }
}

// Run migration
if (require.main === module) {
  createServicesOverviewSingleType().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { createServicesOverviewSingleType };
