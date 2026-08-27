#!/usr/bin/env node

/**
 * Migration Script: Create Services Listing Page Schema in Strapi
 *
 * This script creates a "services-listing" page in Strapi with the following structure:
 * - Hero section (title, description)
 * - Services array (slug, title, titleEn, description, icon, color)
 * - CTA section (title, description, primary/secondary buttons)
 * - Features array (icon, title, description)
 *
 * Based on: dental-frontend/src/app/services/ServicesPageClient.tsx
 * Connection: Direct PostgreSQL connection to Strapi database
 */

const { Client } = require("pg");

// Database configuration - Update these values for your environment
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
async function createServicesListingSchema() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(80));
  console.log("SERVICES LISTING PAGE SCHEMA MIGRATION");
  console.log("=".repeat(80));
  console.log(
    `Database: ${DB_CONFIG.database}@${DB_CONFIG.host}:${DB_CONFIG.port}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // Step 1: Check if page already exists
    console.log("Step 1: Checking for existing services-listing page...");
    const existingPage = await client.query(
      "SELECT id, document_id FROM pages WHERE slug = $1",
      ["services-listing"],
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

      console.log("  [INFO] Will update existing content...");
    } else {
      console.log("  [INFO] Creating new page...");
      pageDocId = "services-listing-page";
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
          "Services Listing",
          "services-listing",
          "Browse our comprehensive dental services",
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
          "Services Listing",
          "services-listing",
          "Browse our comprehensive dental services",
        ],
      );
    }

    console.log(
      `  [OK] Page IDs: Draft=${draftPageId}, Published=${publishedPageId}\n`,
    );

    // Step 2: Create content structure
    console.log("Step 2: Creating content structure...");

    const contentData = {
      hero: {
        title: "Professional Dental Services",
        description:
          "We provide a wide range of dental services with modern technology and experienced doctors",
      },
      services: [
        {
          slug: "implant",
          title: "Cấy Ghép Implant",
          titleEn: "Dental Implants",
          description:
            "Giải pháp phục hồi răng vĩnh viễn với công nghệ tiên tiến, giúp bạn tự tin với nụ cười hoàn hảo",
          icon: "🦷",
          color: "from-blue-500 to-cyan-500",
        },
        {
          slug: "invisalign",
          title: "Niềng Răng Invisalign",
          titleEn: "Invisalign Braces",
          description:
            "Chỉnh nha trong suốt hiện đại, không đau, không ảnh hưởng đến thẩm mỹ trong quá trình điều trị",
          icon: "😁",
          color: "from-purple-500 to-pink-500",
        },
        {
          slug: "veneer",
          title: "Dán Sứ Veneer",
          titleEn: "Porcelain Veneers",
          description:
            "Làm đẹp răng với mặt dán sứ siêu mỏng, mang lại nụ cười trắng sáng tự nhiên",
          icon: "✨",
          color: "from-amber-500 to-orange-500",
        },
        {
          slug: "whitening",
          title: "Tẩy Trắng Răng",
          titleEn: "Teeth Whitening",
          description:
            "Công nghệ tẩy trắng răng an toàn, hiệu quả, giúp răng trắng sáng lên đến 8-10 tông màu",
          icon: "⚡",
          color: "from-green-500 to-emerald-500",
        },
      ],
      cta: {
        title: "Ready to Transform Your Smile?",
        description:
          "Book a free consultation with our expert dentists today and discover the perfect treatment for you",
        primaryButton: {
          text: "Book Free Consultation",
          link: "/contact",
        },
        secondaryButton: {
          text: "View All Services",
          link: "/services",
        },
      },
      features: [
        {
          icon: "🏆",
          title: "International Standards",
          description:
            "World-class dental care following international protocols and quality standards",
        },
        {
          icon: "👨‍⚕️",
          title: "Expert Dentists",
          description:
            "Highly qualified dentists with 15+ years of experience and international training",
        },
        {
          icon: "🔬",
          title: "Modern Technology",
          description:
            "State-of-the-art equipment and latest dental technology for optimal results",
        },
      ],
    };

    // Convert to JSON string for storage
    const contentJson = JSON.stringify(contentData, null, 2);

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
      "  | ID | Status    | Title             | Slug              | Content Size |",
    );
    console.log("  " + "-".repeat(76));
    verification.rows.forEach((row) => {
      const status = row.published_at ? "Published" : "Draft    ";
      const contentSize = `${(row.content_length / 1024).toFixed(2)} KB`;
      console.log(
        `  | ${row.id.toString().padEnd(2)} | ${status} | ${row.title.padEnd(17)} | ${row.slug.padEnd(17)} | ${contentSize.padEnd(12)} |`,
      );
    });
    console.log("  " + "-".repeat(76));

    // Step 5: Display content structure
    console.log("\n  Content Structure:");
    console.log("  " + "-".repeat(76));
    console.log(`  Hero: ${contentData.hero.title}`);
    console.log(`  Services: ${contentData.services.length} items`);
    contentData.services.forEach((service, i) => {
      console.log(
        `    ${i + 1}. ${service.icon} ${service.title} (${service.titleEn})`,
      );
    });
    console.log(`  CTA: ${contentData.cta.title}`);
    console.log(`  Features: ${contentData.features.length} items`);
    contentData.features.forEach((feature, i) => {
      console.log(`    ${i + 1}. ${feature.icon} ${feature.title}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\nNext Steps:");
    console.log(
      "1. Visit Strapi Admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin",
    );
    console.log("2. Navigate to: Content Manager → Pages → Services Listing");
    console.log("3. Review the content structure");
    console.log("4. Make any necessary adjustments");
    console.log("5. The page is already published and live at: /services");
    console.log("\nAPI Endpoint:");
    console.log(
      "GET /api/pages?filters[slug][$eq]=services-listing&populate=*",
    );
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
  createServicesListingSchema().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { createServicesListingSchema };
