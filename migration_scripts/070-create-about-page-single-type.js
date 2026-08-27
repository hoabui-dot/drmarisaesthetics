#!/usr/bin/env node

/**
 * Migration Script 070: Create About Page Single Type and Seed Data (v2)
 *
 * Uses Strapi v5's actual join table convention:
 *   {component_table}_components_{field}_lnk
 * with columns: {component_singular}_id, {nested_component_singular}_id
 *
 * Run:
 *   node migration_scripts/070-create-about-page-single-type.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const NOW = new Date().toISOString();
const DOC_ID = "about-page-2026";

async function createTable(client, sql) {
  await client.query(sql);
}

async function insertComponent(client, table, fields, values) {
  const cols = fields.map((f) => `"${f}"`).join(", ");
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
  const res = await client.query(
    `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING id`,
    values,
  );
  return res.rows[0].id;
}

async function linkToAboutPage(
  client,
  aboutPageId,
  componentId,
  componentType,
  field,
  order,
) {
  await client.query(
    `INSERT INTO about_pages_components (entity_id, component_id, component_type, field, "order") VALUES ($1,$2,$3,$4,$5)`,
    [aboutPageId, componentId, componentType, field, order],
  );
}

async function run() {
  const client = new Client(DB_CONFIG);
  console.log("=".repeat(70));
  console.log("MIGRATION 070 v2: About Page Single Type + Seed Data");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected\n");

    // ── Clean up old partial run ──────────────────────────────────────────
    console.log("Cleaning up any partial previous run...");
    await client.query(
      `DROP TABLE IF EXISTS components_about_commitments_items_lnk CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_core_values_values_lnk CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_philosophies_tabs_lnk CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_why_choose_us_features_lnk CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_excellences_stats_lnk CASCADE`,
    );
    await client.query(`DROP TABLE IF EXISTS about_pages_components CASCADE`);
    await client.query(`DROP TABLE IF EXISTS about_pages CASCADE`);
    await client.query(`DROP TABLE IF EXISTS components_about_ctas CASCADE`);
    await client.query(
      `DROP TABLE IF EXISTS components_about_commitment_items CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_commitments CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_core_values CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_philosophy_tabs CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_philosophies CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_why_choose_us CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_feature_items CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_excellence_stats CASCADE`,
    );
    await client.query(
      `DROP TABLE IF EXISTS components_about_excellences CASCADE`,
    );
    await client.query(`DROP TABLE IF EXISTS components_about_heroes CASCADE`);
    console.log("  [OK] Cleaned\n");

    // ── Create all tables ─────────────────────────────────────────────────
    console.log("Creating tables...");

    await createTable(
      client,
      `
      CREATE TABLE components_about_heroes (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), subtitle VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_excellence_stats (
        id SERIAL PRIMARY KEY,
        value VARCHAR(255), label VARCHAR(255), icon VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_excellences (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    // Link table — Strapi v5 convention: {parent}_lnk, columns: {parent_id}, {child_id}, order
    await createTable(
      client,
      `
      CREATE TABLE components_about_excellences_stats_lnk (
        id SERIAL PRIMARY KEY,
        excellence_id INTEGER NOT NULL,
        excellence_stat_id INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_feature_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(255), title VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_why_choose_us (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_why_choose_us_features_lnk (
        id SERIAL PRIMARY KEY,
        why_choose_us_id INTEGER NOT NULL,
        feature_item_id INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_philosophy_tabs (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255), label VARCHAR(255), icon VARCHAR(255),
        title VARCHAR(255), description TEXT, highlight VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_philosophies (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), quote TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_philosophies_tabs_lnk (
        id SERIAL PRIMARY KEY,
        philosophy_id INTEGER NOT NULL,
        philosophy_tab_id INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_core_values (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_core_values_values_lnk (
        id SERIAL PRIMARY KEY,
        core_value_id INTEGER NOT NULL,
        feature_item_id INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_commitment_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(255), title VARCHAR(255), subtitle VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_commitments (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_commitments_items_lnk (
        id SERIAL PRIMARY KEY,
        commitment_id INTEGER NOT NULL,
        commitment_item_id INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE components_about_ctas (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255), title VARCHAR(255), description TEXT,
        primary_button_text VARCHAR(255), primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(255), secondary_button_link VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE about_pages (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        published_at TIMESTAMPTZ,
        locale VARCHAR(255)
      )`,
    );

    await createTable(
      client,
      `
      CREATE TABLE about_pages_components (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER NOT NULL,
        component_id INTEGER NOT NULL,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" INTEGER DEFAULT 0
      )`,
    );

    console.log("  [OK] All tables created\n");

    // ── Insert root about_pages record ────────────────────────────────────
    const apRes = await client.query(
      `INSERT INTO about_pages (document_id, published_at) VALUES ($1, $2) RETURNING id`,
      [DOC_ID, NOW],
    );
    const aboutPageId = apRes.rows[0].id;
    console.log(`[OK] about_pages id=${aboutPageId}\n`);

    // ── HERO ──────────────────────────────────────────────────────────────
    const heroId = await insertComponent(
      client,
      "components_about_heroes",
      ["badge", "title", "subtitle", "description"],
      [
        "About Us",
        "About Saigon International Dental Clinic",
        "Dental Care in Vietnam",
        "Welcome to Saigon International Dental Clinic, where top-tier dentistry meets absolute transparency. For over 15 years, we have been the trusted partner for international patients seeking high-quality, reliable dental care in Vietnam.",
      ],
    );
    await linkToAboutPage(client, aboutPageId, heroId, "about.hero", "hero", 0);
    console.log(`[OK] hero id=${heroId}`);

    // ── EXCELLENCE ────────────────────────────────────────────────────────
    const excellenceId = await insertComponent(
      client,
      "components_about_excellences",
      ["badge", "title", "description"],
      [
        "Recognized Excellence",
        "Recognized Excellence and Proven Track Record",
        "Numbers speak louder than words. Our extensive clinical experience ensures that your smile is in the hands of seasoned experts.",
      ],
    );
    await linkToAboutPage(
      client,
      aboutPageId,
      excellenceId,
      "about.excellence",
      "excellence",
      1,
    );

    const stats = [
      ["25,000+", "Satisfied Customers Worldwide", "Users"],
      ["10,000+", "Successful Dental Implants", "Award"],
      ["5,000+", "Cosmetic Porcelain Veneers and Crowns", "Star"],
    ];
    for (let i = 0; i < stats.length; i++) {
      const statId = await insertComponent(
        client,
        "components_about_excellence_stats",
        ["value", "label", "icon"],
        stats[i],
      );
      await client.query(
        `INSERT INTO components_about_excellences_stats_lnk (excellence_id, excellence_stat_id, "order") VALUES ($1,$2,$3)`,
        [excellenceId, statId, i],
      );
    }
    console.log(`[OK] excellence id=${excellenceId} + 3 stats`);

    // ── WHY CHOOSE US ─────────────────────────────────────────────────────
    const wcuId = await insertComponent(
      client,
      "components_about_why_choose_us",
      ["badge", "title", "description"],
      [
        "Why Choose Us",
        "Why International Patients Choose Us",
        "We prioritize your peace of mind by offering strict medical standards, transparent processes, and zero hidden fees.",
      ],
    );
    await linkToAboutPage(
      client,
      aboutPageId,
      wcuId,
      "about.why-choose-us",
      "why_choose_us",
      2,
    );

    const wcuFeatures = [
      [
        "FileText",
        "100% Transparent Pricing and Treatment",
        "Complete clarity on costs, doctors' profiles, and material origins. We strictly guarantee no hidden fees throughout your journey.",
      ],
      [
        "UserCheck",
        "Top-Tier Dental Specialists",
        "Our dedicated team consists of experts with over 10 years of intensive clinical experience. You have the full right to change your attending doctor if you feel uncomfortable.",
      ],
      [
        "Scan",
        "Advanced European Technology",
        "Access to state-of-the-art equipment. We offer complimentary consultations, including clinical examinations, CT Cone beam scans, and customized treatment plans—even if you decide not to proceed.",
      ],
      [
        "Shield",
        "Legally Binding Guarantees",
        "We provide comprehensive medical records, legally binding contracts, and warranty policies for your absolute protection.",
      ],
    ];
    for (let i = 0; i < wcuFeatures.length; i++) {
      const fId = await insertComponent(
        client,
        "components_about_feature_items",
        ["icon", "title", "description"],
        wcuFeatures[i],
      );
      await client.query(
        `INSERT INTO components_about_why_choose_us_features_lnk (why_choose_us_id, feature_item_id, "order") VALUES ($1,$2,$3)`,
        [wcuId, fId, i],
      );
    }
    console.log(`[OK] why_choose_us id=${wcuId} + 4 features`);

    // ── PHILOSOPHY ────────────────────────────────────────────────────────
    const philId = await insertComponent(
      client,
      "components_about_philosophies",
      ["badge", "title", "quote"],
      [
        "Our Philosophy",
        "Our Treatment Philosophy: Preserving Your Natural Smile",
        "We believe in minimally invasive dentistry, preserving your natural tooth structure while achieving maximum aesthetic and functional results.",
      ],
    );
    await linkToAboutPage(
      client,
      aboutPageId,
      philId,
      "about.philosophy",
      "philosophy",
      3,
    );

    const tabs = [
      [
        "prevention",
        "Prevention",
        "Sprout",
        "Maximum Tooth Preservation",
        "We utilize advanced techniques to minimize tooth reduction to just 0.5 - 1.5mm, ensuring your natural teeth remain strong and healthy.",
        "0.5 - 1.5mm tooth reduction",
      ],
      [
        "quality",
        "Quality",
        "Award",
        "Genuine and Safe Materials",
        "Say no to bad breath and irritation. We exclusively use premium, imported German porcelain that is 5 times stronger than natural teeth, offering 20+ natural shades.",
        "5x stronger than natural teeth",
      ],
      [
        "verification",
        "Verification",
        "Star",
        "Real-Time Verification",
        "For porcelain treatments, you are involved in the process. We allow patients to view the actual porcelain block and record the milling process for absolute peace of mind.",
        "100% patient-verified process",
      ],
    ];
    for (let i = 0; i < tabs.length; i++) {
      const tabId = await insertComponent(
        client,
        "components_about_philosophy_tabs",
        ["key", "label", "icon", "title", "description", "highlight"],
        tabs[i],
      );
      await client.query(
        `INSERT INTO components_about_philosophies_tabs_lnk (philosophy_id, philosophy_tab_id, "order") VALUES ($1,$2,$3)`,
        [philId, tabId, i],
      );
    }
    console.log(`[OK] philosophy id=${philId} + 3 tabs`);

    // ── CORE VALUES ───────────────────────────────────────────────────────
    const cvId = await insertComponent(
      client,
      "components_about_core_values",
      ["badge", "title", "description"],
      [
        "Core Values",
        "Our Core Values",
        "The foundational principles that guide every interaction at Saigon International Dental Clinic.",
      ],
    );
    await linkToAboutPage(
      client,
      aboutPageId,
      cvId,
      "about.core-values",
      "core_values",
      4,
    );

    const coreVals = [
      [
        "Lightbulb",
        "Innovation",
        "Continuously updating our European-imported, Ministry of Health-approved equipment.",
      ],
      [
        "Shield",
        "Integrity",
        "Honest diagnoses and treatment plans. We never recommend unnecessary procedures.",
      ],
      [
        "Heart",
        "Care",
        "A dedicated, English-speaking environment designed to make your dental visits stress-free.",
      ],
    ];
    for (let i = 0; i < coreVals.length; i++) {
      const vId = await insertComponent(
        client,
        "components_about_feature_items",
        ["icon", "title", "description"],
        coreVals[i],
      );
      await client.query(
        `INSERT INTO components_about_core_values_values_lnk (core_value_id, feature_item_id, "order") VALUES ($1,$2,$3)`,
        [cvId, vId, i],
      );
    }
    console.log(`[OK] core_values id=${cvId} + 3 values`);

    // ── COMMITMENT ────────────────────────────────────────────────────────
    const commId = await insertComponent(
      client,
      "components_about_commitments",
      ["badge", "title", "description"],
      [
        "Our Commitment",
        "Our Firm Guarantees to You",
        "Your safety, satisfaction, and financial security are our top priorities.",
      ],
    );
    await linkToAboutPage(
      client,
      aboutPageId,
      commId,
      "about.commitment",
      "commitment",
      5,
    );

    const commItems = [
      [
        "TrendingUp",
        "Guaranteed Results",
        "Visual Preview Included",
        "Comprehensive warranty policies and visual previews of your final smile before treatment begins.",
      ],
      [
        "UserCheck",
        "Elite Expertise",
        "Qualified Specialists Only",
        "Treatment is strictly performed by highly qualified specialists, never by unverified practitioners.",
      ],
      [
        "FileText",
        "Zero Financial Surprises",
        "Price Locked at Consultation",
        "The price you are quoted during your free consultation is the final price you pay.",
      ],
    ];
    for (let i = 0; i < commItems.length; i++) {
      const ciId = await insertComponent(
        client,
        "components_about_commitment_items",
        ["icon", "title", "subtitle", "description"],
        commItems[i],
      );
      await client.query(
        `INSERT INTO components_about_commitments_items_lnk (commitment_id, commitment_item_id, "order") VALUES ($1,$2,$3)`,
        [commId, ciId, i],
      );
    }
    console.log(`[OK] commitment id=${commId} + 3 items`);

    // ── CTA ───────────────────────────────────────────────────────────────
    const ctaId = await insertComponent(
      client,
      "components_about_ctas",
      [
        "badge",
        "title",
        "description",
        "primary_button_text",
        "primary_button_link",
        "secondary_button_text",
        "secondary_button_link",
      ],
      [
        "Book Now",
        "Ready to Transform Your Smile?",
        "Achieve a flawless, bright smile in just 48 hours. Send us a message today to schedule your completely FREE comprehensive consultation, X-rays, and treatment planning.",
        "Book Your Free Consultation",
        "/contact",
        "Learn More About Our Doctors",
        "/about-us#team",
      ],
    );
    await linkToAboutPage(client, aboutPageId, ctaId, "about.cta", "cta", 6);
    console.log(`[OK] cta id=${ctaId}`);

    // ── Verify ────────────────────────────────────────────────────────────
    const verify = await client.query(
      `SELECT field, component_type, component_id FROM about_pages_components WHERE entity_id=$1 ORDER BY "order"`,
      [aboutPageId],
    );
    console.log("\nABOUT PAGE COMPONENTS:");
    verify.rows.forEach((r) =>
      console.log(`  ✓ [${r.field}] ${r.component_type} id=${r.component_id}`),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 070 v2 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Kill and restart Strapi: it will auto-detect the new schema",
    );
    console.log(
      "  2. Admin will show 'About Page' under SINGLE TYPES → click Publish",
    );
    console.log(
      "  3. Test API: curl 'https://guild-biblical-expectations-easily.trycloudflare.com/api/about-page?populate=deep'",
    );
    console.log("  4. Check frontend: http://localhost:3000/about-us\n");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.detail) console.error("[DETAIL]", err.detail);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
