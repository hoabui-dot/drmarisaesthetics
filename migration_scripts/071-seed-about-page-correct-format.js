#!/usr/bin/env node

/**
 * Migration Script 071: Seed About Page - Correct Strapi v5 DB Format
 *
 * Uses Strapi v5's actual join table structure:
 *   - about_pages_cmps: { entity_id, cmp_id, component_type, field, order }
 *   - components_about_*_cmps: same structure for nested components
 *   - components_about_*_lnk: for repeatable nested items
 *
 * Content sourced from about-us-requirement.md (Section 5: SOURCE DOCUMENT)
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

// Crypto-safe document_id (Strapi v5 format)
function genDocumentId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

async function insert(client, table, fields, values) {
  const cols = fields.map((f) => `"${f}"`).join(", ");
  const phs = values.map((_, i) => `$${i + 1}`).join(", ");
  const res = await client.query(
    `INSERT INTO ${table} (${cols}) VALUES (${phs}) RETURNING id`,
    values,
  );
  return res.rows[0].id;
}

async function linkToParent(
  client,
  table,
  entityId,
  cmpId,
  componentType,
  field,
  order,
) {
  await client.query(
    `INSERT INTO ${table} (entity_id, cmp_id, component_type, field, "order") VALUES ($1,$2,$3,$4,$5)`,
    [entityId, cmpId, componentType, field, order],
  );
}

async function run() {
  const client = new Client(DB_CONFIG);
  console.log("=".repeat(70));
  console.log("MIGRATION 071: Seed About Page (Correct Strapi v5 Format)");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected\n");

    // ── STEP 0: Clean existing data (idempotent) ──────────────────────────
    console.log("STEP 0: Cleaning previous seed data...");
    // Clean cmps links
    await client.query(`DELETE FROM about_pages_cmps`);
    await client.query(`DELETE FROM components_about_excellences_cmps`);
    await client.query(`DELETE FROM components_about_why_choose_us_cmps`);
    await client.query(`DELETE FROM components_about_philosophies_cmps`);
    await client.query(`DELETE FROM components_about_core_values_cmps`);
    await client.query(`DELETE FROM components_about_commitments_cmps`);
    // Clean lnk tables
    await client.query(`DELETE FROM components_about_excellences_stats_lnk`);
    await client.query(
      `DELETE FROM components_about_why_choose_us_features_lnk`,
    );
    await client.query(`DELETE FROM components_about_philosophies_tabs_lnk`);
    await client.query(`DELETE FROM components_about_core_values_values_lnk`);
    await client.query(`DELETE FROM components_about_commitments_items_lnk`);
    // Clean component data tables
    await client.query(`DELETE FROM components_about_excellence_stats`);
    await client.query(`DELETE FROM components_about_excellences`);
    await client.query(`DELETE FROM components_about_feature_items`);
    await client.query(`DELETE FROM components_about_why_choose_us`);
    await client.query(`DELETE FROM components_about_philosophy_tabs`);
    await client.query(`DELETE FROM components_about_philosophies`);
    await client.query(`DELETE FROM components_about_core_values`);
    await client.query(`DELETE FROM components_about_commitment_items`);
    await client.query(`DELETE FROM components_about_commitments`);
    await client.query(`DELETE FROM components_about_ctas`);
    await client.query(`DELETE FROM components_about_heroes`);
    // Clean root
    await client.query(`DELETE FROM about_pages`);
    console.log("  [OK] All previous data removed\n");

    // ── STEP 1: Create / ensure about_pages root record ───────────────────
    console.log("STEP 1: Creating About Page root record...");
    const docId = genDocumentId();
    const aboutPageId = await insert(
      client,
      "about_pages",
      ["document_id", "published_at", "created_at", "updated_at"],
      [docId, NOW, NOW, NOW],
    );
    console.log(`  [OK] about_pages id=${aboutPageId}, document_id=${docId}\n`);

    // ── STEP 2: HERO ──────────────────────────────────────────────────────
    console.log("STEP 2: Seeding Hero...");
    const heroId = await insert(
      client,
      "components_about_heroes",
      ["badge", "title", "subtitle", "description"],
      [
        "About Us",
        "About Saigon International Dental Clinic: Dental Care in VN",
        "Dental Care in Vietnam",
        "Welcome to Saigon International Dental Clinic, where top-tier dentistry meets absolute transparency. For over 15 years, we have been the trusted partner for international patients seeking high-quality, reliable dental care in Vietnam.",
      ],
    );
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      heroId,
      "about.hero",
      "hero",
      0,
    );
    console.log(`  [OK] hero id=${heroId}\n`);

    // ── STEP 3: EXCELLENCE (stats) ────────────────────────────────────────
    console.log("STEP 3: Seeding Excellence section...");
    const excellenceId = await insert(
      client,
      "components_about_excellences",
      ["badge", "title", "description"],
      [
        "Recognized Excellence",
        "Recognized Excellence and Proven Track Record",
        "Numbers speak louder than words. Our extensive clinical experience ensures that your smile is in the hands of seasoned experts.",
      ],
    );
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      excellenceId,
      "about.excellence",
      "excellence",
      1,
    );

    // Insert 3 stats linked to excellence via _cmps (repeatable nested)
    const statsData = [
      {
        value: "25,000+",
        label: "Satisfied Customers Worldwide",
        icon: "Users",
      },
      { value: "10,000+", label: "Successful Dental Implants", icon: "Award" },
      {
        value: "5,000+",
        label: "Cosmetic Porcelain Veneers and Crowns",
        icon: "Star",
      },
    ];
    for (let i = 0; i < statsData.length; i++) {
      const s = statsData[i];
      const statId = await insert(
        client,
        "components_about_excellence_stats",
        ["value", "label", "icon"],
        [s.value, s.label, s.icon],
      );
      await client.query(
        `INSERT INTO components_about_excellences_stats_lnk (excellence_id, excellence_stat_id, "order") VALUES ($1,$2,$3)`,
        [excellenceId, statId, i],
      );
    }
    console.log(`  [OK] excellence id=${excellenceId} + 3 stats\n`);

    // ── STEP 4: WHY CHOOSE US ─────────────────────────────────────────────
    console.log("STEP 4: Seeding Why Choose Us...");
    const wcuId = await insert(
      client,
      "components_about_why_choose_us",
      ["badge", "title", "description"],
      [
        "Why Choose Us",
        "Why International Patients Choose Us",
        "We prioritize your peace of mind by offering strict medical standards, transparent processes, and zero hidden fees.",
      ],
    );
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      wcuId,
      "about.why-choose-us",
      "why_choose_us",
      2,
    );

    const wcuFeatures = [
      {
        icon: "FileText",
        title: "100% Transparent Pricing and Treatment",
        description:
          "Complete clarity on costs, doctors' profiles, and material origins. We strictly guarantee no hidden fees throughout your journey.",
      },
      {
        icon: "UserCheck",
        title: "Top-Tier Dental Specialists",
        description:
          "Our dedicated team consists of experts with over 10 years of intensive clinical experience. You have the full right to change your attending doctor if you feel uncomfortable.",
      },
      {
        icon: "Scan",
        title: "Advanced European Technology",
        description:
          "Access to state-of-the-art equipment. We offer complimentary consultations, including clinical examinations, CT Cone beam scans, and customized treatment plans—even if you decide not to proceed.",
      },
      {
        icon: "Shield",
        title: "Legally Binding Guarantees",
        description:
          "We provide comprehensive medical records, legally binding contracts, and warranty policies for your absolute protection.",
      },
    ];
    for (let i = 0; i < wcuFeatures.length; i++) {
      const f = wcuFeatures[i];
      const fId = await insert(
        client,
        "components_about_feature_items",
        ["icon", "title", "description"],
        [f.icon, f.title, f.description],
      );
      await client.query(
        `INSERT INTO components_about_why_choose_us_features_lnk (why_choose_us_id, feature_item_id, "order") VALUES ($1,$2,$3)`,
        [wcuId, fId, i],
      );
    }
    console.log(`  [OK] why_choose_us id=${wcuId} + 4 features\n`);

    // ── STEP 5: PHILOSOPHY ────────────────────────────────────────────────
    console.log("STEP 5: Seeding Philosophy...");
    const philId = await insert(
      client,
      "components_about_philosophies",
      ["badge", "title", "quote"],
      [
        "Our Philosophy",
        "Our Treatment Philosophy: Preserving Your Natural Smile",
        "We believe in minimally invasive dentistry, preserving your natural tooth structure while achieving maximum aesthetic and functional results.",
      ],
    );
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      philId,
      "about.philosophy",
      "philosophy",
      3,
    );

    const philTabs = [
      {
        key: "prevention",
        label: "Prevention",
        icon: "Sprout",
        title: "Maximum Tooth Preservation",
        description:
          "We utilize advanced techniques to minimize tooth reduction to just 0.5 - 1.5mm, ensuring your natural teeth remain strong and healthy.",
        highlight: "0.5 - 1.5mm tooth reduction",
      },
      {
        key: "quality",
        label: "Quality",
        icon: "Award",
        title: "Genuine and Safe Materials",
        description:
          "Say no to bad breath and irritation. We exclusively use premium, imported German porcelain that is 5 times stronger than natural teeth, offering 20+ natural shades.",
        highlight: "5x stronger than natural teeth",
      },
      {
        key: "verification",
        label: "Verification",
        icon: "Star",
        title: "Real-Time Verification",
        description:
          "For porcelain treatments, you are involved in the process. We allow patients to view the actual porcelain block and record the milling process for absolute peace of mind.",
        highlight: "100% patient-verified process",
      },
    ];
    for (let i = 0; i < philTabs.length; i++) {
      const t = philTabs[i];
      const tabId = await insert(
        client,
        "components_about_philosophy_tabs",
        ["key", "label", "icon", "title", "description", "highlight"],
        [t.key, t.label, t.icon, t.title, t.description, t.highlight],
      );
      await client.query(
        `INSERT INTO components_about_philosophies_tabs_lnk (philosophy_id, philosophy_tab_id, "order") VALUES ($1,$2,$3)`,
        [philId, tabId, i],
      );
    }
    console.log(`  [OK] philosophy id=${philId} + 3 tabs\n`);

    // ── STEP 6: CORE VALUES ───────────────────────────────────────────────
    console.log("STEP 6: Seeding Core Values...");
    const cvId = await insert(
      client,
      "components_about_core_values",
      ["badge", "title", "description"],
      [
        "Core Values",
        "Our Core Values",
        "The foundational principles that guide every interaction at Saigon International Dental Clinic.",
      ],
    );
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      cvId,
      "about.core-values",
      "core_values",
      4,
    );

    const coreVals = [
      {
        icon: "Lightbulb",
        title: "Innovation",
        description:
          "Continuously updating our European-imported, Ministry of Health-approved equipment.",
      },
      {
        icon: "Shield",
        title: "Integrity",
        description:
          "Honest diagnoses and treatment plans. We never recommend unnecessary procedures.",
      },
      {
        icon: "Heart",
        title: "Care",
        description:
          "A dedicated, English-speaking environment designed to make your dental visits stress-free.",
      },
    ];
    for (let i = 0; i < coreVals.length; i++) {
      const v = coreVals[i];
      const vId = await insert(
        client,
        "components_about_feature_items",
        ["icon", "title", "description"],
        [v.icon, v.title, v.description],
      );
      await client.query(
        `INSERT INTO components_about_core_values_values_lnk (core_value_id, feature_item_id, "order") VALUES ($1,$2,$3)`,
        [cvId, vId, i],
      );
    }
    console.log(`  [OK] core_values id=${cvId} + 3 values\n`);

    // ── STEP 7: COMMITMENT ────────────────────────────────────────────────
    console.log("STEP 7: Seeding Commitment...");
    const commId = await insert(
      client,
      "components_about_commitments",
      ["badge", "title", "description"],
      [
        "Our Commitment",
        "Our Firm Guarantees to You",
        "Your safety, satisfaction, and financial security are our top priorities.",
      ],
    );
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      commId,
      "about.commitment",
      "commitment",
      5,
    );

    const commItems = [
      {
        icon: "TrendingUp",
        title: "Guaranteed Results",
        subtitle: "Visual Preview Included",
        description:
          "Comprehensive warranty policies and visual previews of your final smile before treatment begins.",
      },
      {
        icon: "UserCheck",
        title: "Elite Expertise",
        subtitle: "Qualified Specialists Only",
        description:
          "Treatment is strictly performed by highly qualified specialists, never by unverified practitioners.",
      },
      {
        icon: "FileText",
        title: "Zero Financial Surprises",
        subtitle: "Price Locked at Consultation",
        description:
          "The price you are quoted during your free consultation is the final price you pay.",
      },
    ];
    for (let i = 0; i < commItems.length; i++) {
      const c = commItems[i];
      const ciId = await insert(
        client,
        "components_about_commitment_items",
        ["icon", "title", "subtitle", "description"],
        [c.icon, c.title, c.subtitle, c.description],
      );
      await client.query(
        `INSERT INTO components_about_commitments_items_lnk (commitment_id, commitment_item_id, "order") VALUES ($1,$2,$3)`,
        [commId, ciId, i],
      );
    }
    console.log(`  [OK] commitment id=${commId} + 3 items\n`);

    // ── STEP 8: CTA ───────────────────────────────────────────────────────
    console.log("STEP 8: Seeding CTA...");
    const ctaId = await insert(
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
    await linkToParent(
      client,
      "about_pages_cmps",
      aboutPageId,
      ctaId,
      "about.cta",
      "cta",
      6,
    );
    console.log(`  [OK] cta id=${ctaId}\n`);

    // ── STEP 9: Set published_at on root record ───────────────────────────
    console.log("STEP 9: Publishing About Page...");
    await client.query(
      `UPDATE about_pages SET published_at=$1, updated_at=$1 WHERE id=$2`,
      [NOW, aboutPageId],
    );
    console.log("  [OK] Published\n");

    // ── VERIFY ────────────────────────────────────────────────────────────
    console.log("VERIFICATION:");
    const cmps = await client.query(
      `SELECT field, component_type, cmp_id FROM about_pages_cmps WHERE entity_id=$1 ORDER BY "order"`,
      [aboutPageId],
    );
    cmps.rows.forEach((r) =>
      console.log(`  ✓ [${r.field}] ${r.component_type} → cmp_id=${r.cmp_id}`),
    );

    const statCount = await client.query(
      `SELECT COUNT(*) FROM components_about_excellence_stats`,
    );
    const featureCount = await client.query(
      `SELECT COUNT(*) FROM components_about_feature_items`,
    );
    const tabCount = await client.query(
      `SELECT COUNT(*) FROM components_about_philosophy_tabs`,
    );
    const commCount = await client.query(
      `SELECT COUNT(*) FROM components_about_commitment_items`,
    );
    console.log(
      `\n  Stats: ${statCount.rows[0].count} | Features: ${featureCount.rows[0].count} | Tabs: ${tabCount.rows[0].count} | Commitments: ${commCount.rows[0].count}`,
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 071 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log(
      "\nTest: curl 'https://guild-biblical-expectations-easily.trycloudflare.com/api/about-page?populate[hero]=*&populate[excellence][populate][stats]=*&populate[why_choose_us][populate][features]=*&populate[philosophy][populate][tabs]=*&populate[core_values][populate][values]=*&populate[commitment][populate][commitments]=*&populate[cta]=*&status=published'\n",
    );
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.detail) console.error("[DETAIL]", err.detail);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
