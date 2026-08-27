#!/usr/bin/env node

/**
 * Migration Script: Create Service Single Type in Strapi
 *
 * This script creates a "service" Single Type in Strapi with the following structure:
 * - Hero section (serviceName, description, duration, recoveryTime, priceRange, heroImage)
 * - Intro section (title, content, image)
 * - Benefits array (icon, title, description)
 * - Process array (icon, title, description, duration)
 * - Pricing array (name, origin, price, warranty, features, popular)
 * - Doctor section (name, image, credentials)
 * - FAQs array (question, answer)
 *
 * Based on: dental-frontend/src/app/services/[slug]/ServicePageClient.tsx
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
async function createServiceSingleType() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(80));
  console.log("SERVICE SINGLE TYPE MIGRATION");
  console.log("=".repeat(80));
  console.log(
    `Database: ${DB_CONFIG.database}@${DB_CONFIG.host}:${DB_CONFIG.port}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // Step 1: Create service data structure
    console.log("Step 1: Creating service data structure...");

    const serviceData = {
      hero: {
        serviceName: "Dental Implants",
        description:
          "Permanent tooth replacement solution with advanced technology, helping you feel confident with a perfect smile",
        duration: "60-90 minutes",
        recoveryTime: "3-6 months",
        priceRange: "$1,500 - $3,000",
        heroImage: "/uploads/dental-implant-hero.jpg",
      },
      intro: {
        title: "What are Dental Implants?",
        content:
          "Dental implants are artificial tooth roots made of titanium that are surgically placed into the jawbone. They provide a strong foundation for fixed or removable replacement teeth that are made to match your natural teeth. Implants are the gold standard for tooth replacement and offer a permanent solution that looks, feels, and functions like natural teeth.",
        image: "/uploads/dental-implant-intro.jpg",
      },
      benefits: [
        {
          icon: "Smile",
          title: "Natural Appearance",
          description:
            "Implants look and feel like your own teeth, providing a natural and confident smile",
        },
        {
          icon: "Star",
          title: "Long-lasting Solution",
          description:
            "With proper care, dental implants can last a lifetime, making them a cost-effective long-term solution",
        },
        {
          icon: "Heart",
          title: "Improved Oral Health",
          description:
            "Implants don't require reducing other teeth and help preserve bone structure",
        },
        {
          icon: "CheckCircle",
          title: "Comfortable & Convenient",
          description:
            "No need for messy adhesives or removal - implants become part of you",
        },
        {
          icon: "Sparkles",
          title: "Eat with Confidence",
          description:
            "Enjoy your favorite foods without worry - implants function like natural teeth",
        },
        {
          icon: "Shield",
          title: "Preserve Facial Structure",
          description: "Prevent bone loss and maintain your natural face shape",
        },
      ],
      process: [
        {
          icon: "FileSearch",
          title: "Initial Consultation",
          description:
            "Comprehensive examination, X-rays, and treatment planning",
          duration: "30-45 minutes",
        },
        {
          icon: "Wrench",
          title: "Implant Placement",
          description: "Surgical placement of titanium implant into jawbone",
          duration: "60-90 minutes",
        },
        {
          icon: "Clock",
          title: "Healing Period",
          description: "Osseointegration - implant fuses with bone",
          duration: "3-6 months",
        },
        {
          icon: "Sparkles",
          title: "Crown Placement",
          description: "Custom crown attached to complete your new tooth",
          duration: "30-60 minutes",
        },
      ],
      pricing: [
        {
          name: "Standard Implant",
          origin: "Korea",
          price: "$1,500",
          warranty: "10 years",
          popular: false,
          features: [
            "High-quality Korean implant",
            "Porcelain crown",
            "10-year warranty",
            "Free follow-up visits (1 year)",
            "Professional aftercare guidance",
          ],
        },
        {
          name: "Premium Implant",
          origin: "USA (Straumann)",
          price: "$2,500",
          warranty: "Lifetime",
          popular: true,
          features: [
            "Swiss Straumann implant",
            "Premium porcelain crown",
            "Lifetime warranty",
            "Free follow-up visits (lifetime)",
            "Priority scheduling",
            "Advanced surface technology",
            "Faster healing time",
          ],
        },
        {
          name: "Luxury Implant",
          origin: "Sweden (Nobel Biocare)",
          price: "$3,000",
          warranty: "Lifetime",
          popular: false,
          features: [
            "Nobel Biocare implant",
            "Zirconia crown",
            "Lifetime warranty",
            "VIP treatment room",
            "Dedicated specialist",
            "3D guided surgery",
            "Fastest healing time",
            "Premium aesthetics",
          ],
        },
      ],
      doctor: {
        name: "Dr. Nguyen Van A",
        image: "/uploads/doctor-implant-specialist.jpg",
        credentials: [
          "DDS from University of Medicine and Pharmacy, Ho Chi Minh City",
          "15+ years of experience in implant dentistry",
          "Certified by International Congress of Oral Implantologists (ICOI)",
          "Over 2,000 successful implant procedures",
        ],
      },
      faqs: [
        {
          question: "Does dental implant placement hurt?",
          answer:
            "The procedure is performed under local anesthesia, so you won't feel pain during the surgery. Most patients report that the discomfort is less than having a tooth extracted. Post-operative pain is typically mild and can be managed with over-the-counter pain medication.",
        },
        {
          question: "How long do dental implants last?",
          answer:
            "With proper care and maintenance, dental implants can last a lifetime. The crown may need replacement after 10-15 years due to normal wear, but the implant itself can remain functional indefinitely. Success rates are over 95% for healthy patients.",
        },
        {
          question: "Am I a good candidate for dental implants?",
          answer:
            "Most adults with good general and oral health are candidates for dental implants. You need adequate bone density and healthy gums. Conditions like uncontrolled diabetes or heavy smoking may affect success rates. A consultation with our specialist will determine your suitability.",
        },
        {
          question: "How do I care for my dental implants?",
          answer:
            "Care for implants just like natural teeth: brush twice daily, floss daily, and visit your dentist regularly for check-ups and cleanings. Avoid smoking and maintain good oral hygiene to ensure long-term success.",
        },
        {
          question: "What is the success rate of dental implants?",
          answer:
            "Dental implants have a success rate of over 95% when placed by experienced professionals. Factors affecting success include bone quality, oral hygiene, smoking status, and overall health. Our clinic uses premium implant systems with proven track records.",
        },
      ],
    };

    // Convert to JSON string
    const contentJson = JSON.stringify(serviceData, null, 2);

    // Step 2: Check if service page exists for implant
    console.log("Step 2: Checking for existing implant service page...");
    const existingPage = await client.query(
      "SELECT id, document_id FROM pages WHERE slug = $1",
      ["implant"],
    );

    let pageDocId, draftPageId, publishedPageId;

    if (existingPage.rows.length > 0) {
      console.log("  [INFO] Page already exists. Updating...");
      pageDocId = existingPage.rows[0].document_id;

      // Get draft and published IDs
      const pages = await client.query(
        "SELECT id, published_at FROM pages WHERE document_id = $1 ORDER BY published_at NULLS FIRST",
        [pageDocId],
      );
      draftPageId = pages.rows[0].id;
      publishedPageId = pages.rows[1]?.id;

      if (!publishedPageId) {
        // Create published version if it doesn't exist
        publishedPageId = await getNextId(client, "pages");
        await client.query(
          `
          INSERT INTO pages (id, document_id, title, slug, description, published_at, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
        `,
          [
            publishedPageId,
            pageDocId,
            "Dental Implants",
            "implant",
            "Permanent tooth replacement solution",
          ],
        );
      }
    } else {
      console.log("  [INFO] Creating new page...");
      pageDocId = "implant-service-page";
      draftPageId = await getNextId(client, "pages");
      publishedPageId = draftPageId + 1;

      // Create draft version
      await client.query(
        `
        INSERT INTO pages (id, document_id, title, slug, description, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NULL, NOW(), NOW())
      `,
        [
          draftPageId,
          pageDocId,
          "Dental Implants",
          "implant",
          "Permanent tooth replacement solution",
        ],
      );

      // Create published version
      await client.query(
        `
        INSERT INTO pages (id, document_id, title, slug, description, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
      `,
        [
          publishedPageId,
          pageDocId,
          "Dental Implants",
          "implant",
          "Permanent tooth replacement solution",
        ],
      );
    }

    console.log(
      `  [OK] Page IDs: Draft=${draftPageId}, Published=${publishedPageId}\n`,
    );

    // Step 3: Update page content
    console.log("Step 3: Updating page content...");

    // Update draft version
    await client.query(
      `
      UPDATE pages 
      SET content = $1, updated_at = NOW()
      WHERE id = $2
    `,
      [contentJson, draftPageId],
    );
    console.log(`  [OK] Updated draft page (ID: ${draftPageId})`);

    // Update published version
    await client.query(
      `
      UPDATE pages 
      SET content = $1, updated_at = NOW()
      WHERE id = $2
    `,
      [contentJson, publishedPageId],
    );
    console.log(`  [OK] Updated published page (ID: ${publishedPageId})\n`);

    // Step 4: Verification
    console.log("Step 4: Verifying data...");
    const verification = await client.query(
      `
      SELECT id, document_id, title, slug, published_at, 
             LENGTH(content::text) as content_length
      FROM pages 
      WHERE document_id = $1
      ORDER BY published_at NULLS FIRST
    `,
      [pageDocId],
    );

    console.log("\n  Verification Results:");
    console.log("  " + "-".repeat(76));
    console.log(
      "  | ID | Status    | Title             | Slug     | Content Size |",
    );
    console.log("  " + "-".repeat(76));
    verification.rows.forEach((row) => {
      const status = row.published_at ? "Published" : "Draft    ";
      const contentSize = `${(row.content_length / 1024).toFixed(2)} KB`;
      console.log(
        `  | ${row.id.toString().padEnd(2)} | ${status} | ${row.title.padEnd(17)} | ${row.slug.padEnd(8)} | ${contentSize.padEnd(12)} |`,
      );
    });
    console.log("  " + "-".repeat(76));

    // Step 5: Display content structure
    console.log("\n  Content Structure:");
    console.log("  " + "-".repeat(76));
    console.log(`  Hero: ${serviceData.hero.serviceName}`);
    console.log(`  Intro: ${serviceData.intro.title}`);
    console.log(`  Benefits: ${serviceData.benefits.length} items`);
    serviceData.benefits.forEach((benefit, i) => {
      console.log(`    ${i + 1}. ${benefit.icon} ${benefit.title}`);
    });
    console.log(`  Process: ${serviceData.process.length} steps`);
    serviceData.process.forEach((step, i) => {
      console.log(
        `    ${i + 1}. ${step.icon} ${step.title} (${step.duration})`,
      );
    });
    console.log(`  Pricing: ${serviceData.pricing.length} options`);
    serviceData.pricing.forEach((option, i) => {
      const popular = option.popular ? " ⭐" : "";
      console.log(`    ${i + 1}. ${option.name} - ${option.price}${popular}`);
    });
    console.log(`  Doctor: ${serviceData.doctor.name}`);
    console.log(`  FAQs: ${serviceData.faqs.length} questions`);

    console.log("\n" + "=".repeat(80));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\nNext Steps:");
    console.log(
      "1. Visit Strapi Admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin",
    );
    console.log("2. Navigate to: Content Manager → Pages → Dental Implants");
    console.log("3. Review the content structure");
    console.log("4. Make any necessary adjustments");
    console.log(
      "5. The page is already published and live at: /services/implant",
    );
    console.log("\nAPI Endpoint:");
    console.log("GET /api/pages?filters[slug][$eq]=implant&populate=*");
    console.log("\nFrontend URL:");
    console.log("http://localhost:3000/services/implant");
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

/**
 * Helper function to get next available ID for a table
 */
async function getNextId(client, tableName) {
  const result = await client.query(`
    SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM ${tableName}
  `);
  return result.rows[0].next_id;
}

// Run migration
if (require.main === module) {
  createServiceSingleType().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { createServiceSingleType };
