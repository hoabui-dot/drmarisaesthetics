#!/usr/bin/env node

/**
 * Migration Script 069: Upsert About Us Page Content
 *
 * Changes:
 *  1. Finds the existing "about-us" page in the pages table
 *  2. Replaces the JSON content with the new 7-section structure
 *     - Hero
 *     - Excellence (stats)
 *     - Why Choose Us (4 boxes)
 *     - Philosophy (quote + 3 tabs)
 *     - Core Values (3 boxes)
 *     - Commitment / Guarantees (3 boxes)
 *     - CTA
 *
 * Run (dev):
 *   node migration_scripts/069-upsert-about-us-content.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/069-upsert-about-us-content.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// ── NEW CONTENT STRUCTURE ────────────────────────────────────────────────────
const ABOUT_US_CONTENT = {
  hero: {
    badge: "About Us",
    title: "About Saigon International Dental Clinic",
    subtitle: "Dental Care in Vietnam",
    description:
      "Welcome to Saigon International Dental Clinic, where top-tier dentistry meets absolute transparency. For over 15 years, we have been the trusted partner for international patients seeking high-quality, reliable dental care in Vietnam.",
  },

  // Section 2: Recognized Excellence (stats-based)
  excellence: {
    badge: "Recognized Excellence",
    title: "Recognized Excellence and Proven Track Record",
    description:
      "Numbers speak louder than words. Our extensive clinical experience ensures that your smile is in the hands of seasoned experts.",
    stats: [
      {
        value: "25,000+",
        label: "Satisfied Customers Worldwide",
        icon: "Users",
      },
      {
        value: "10,000+",
        label: "Successful Dental Implants",
        icon: "Award",
      },
      {
        value: "5,000+",
        label: "Cosmetic Porcelain Veneers and Crowns",
        icon: "Star",
      },
    ],
  },

  // Section 3: Why Choose Us (4 feature boxes)
  whyChooseUs: {
    badge: "Why Choose Us",
    title: "Why International Patients Choose Us",
    description:
      "We prioritize your peace of mind by offering strict medical standards, transparent processes, and zero hidden fees.",
    features: [
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
    ],
  },

  // Section 4: Philosophy (quote + 3 tabs)
  philosophy: {
    badge: "Our Philosophy",
    title: "Our Treatment Philosophy: Preserving Your Natural Smile",
    quote:
      "We believe in minimally invasive dentistry, preserving your natural tooth structure while achieving maximum aesthetic and functional results.",
    tabs: [
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
    ],
  },

  // Section 5: Core Values (3 boxes)
  coreValues: {
    badge: "Core Values",
    title: "Our Core Values",
    description:
      "The foundational principles that guide every interaction at Saigon International Dental Clinic.",
    values: [
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
    ],
  },

  // Section 6: Commitment / Guarantees (3 boxes)
  commitment: {
    badge: "Our Commitment",
    title: "Our Firm Guarantees to You",
    description:
      "Your safety, satisfaction, and financial security are our top priorities.",
    commitments: [
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
    ],
  },

  // Section 7: CTA
  cta: {
    badge: "Book Now",
    title: "Ready to Transform Your Smile?",
    description:
      "Achieve a flawless, bright smile in just 48 hours. Send us a message today to schedule your completely FREE comprehensive consultation, X-rays, and treatment planning.",
    primaryButtonText: "Book Your Free Consultation",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Learn More About Our Doctors",
    secondaryButtonLink: "/about-us#team",
    contactInfo: [
      { icon: "Phone", text: "Free Consultation Available" },
      { icon: "Clock", text: "Fast Response: Within 2 Hours" },
    ],
  },
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 069: Upsert About Us Page Content");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Find existing about-us page ────────────────────────────────
    console.log("STEP 1: Finding existing about-us page...");
    const findRes = await client.query(
      `SELECT id, document_id, title, slug FROM pages WHERE slug = 'about-us' LIMIT 1`
    );

    if (findRes.rowCount === 0) {
      throw new Error(
        "No page with slug 'about-us' found. Please create it first in Strapi admin."
      );
    }

    const page = findRes.rows[0];
    console.log(`  [OK] Found page: id=${page.id}, document_id=${page.document_id}, title="${page.title}"\n`);

    // ── STEP 2: Upsert content JSON ────────────────────────────────────────
    console.log("STEP 2: Updating content JSON...");
    const contentJson = JSON.stringify(ABOUT_US_CONTENT);

    await client.query(
      `UPDATE pages SET content = $1, updated_at = NOW() WHERE slug = 'about-us'`,
      [contentJson]
    );

    console.log("  [OK] Content updated successfully\n");

    // ── STEP 3: Verify ─────────────────────────────────────────────────────
    console.log("STEP 3: Verifying update...");
    const verifyRes = await client.query(
      `SELECT id, slug, title, LENGTH(content) as content_length, updated_at FROM pages WHERE slug = 'about-us'`
    );
    const updated = verifyRes.rows[0];
    console.log(`  [OK] Verified:`);
    console.log(`    - id: ${updated.id}`);
    console.log(`    - slug: ${updated.slug}`);
    console.log(`    - content length: ${updated.content_length} chars`);
    console.log(`    - updated_at: ${updated.updated_at}`);

    // Check sections present
    const parsed = JSON.parse(
      (await client.query(`SELECT content FROM pages WHERE slug = 'about-us'`)).rows[0].content
    );
    const sections = Object.keys(parsed);
    console.log(`  [OK] Sections in content: ${sections.join(", ")}\n`);

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 069 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi CMS (npm run develop)");
    console.log(
      "  2. In Strapi Admin, open the Pages collection → about-us → click Save & Publish"
    );
    console.log(
      "  3. Verify the frontend at http://localhost:3000/about-us renders all 7 sections\n"
    );
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
