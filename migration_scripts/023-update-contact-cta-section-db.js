#!/usr/bin/env node

/**
 * Migration Script: Update Contact Page CTA Section (Direct Database)
 *
 * This script updates the contact page CTA section directly via PostgreSQL
 * when Strapi API is not accessible.
 *
 * Run: node migration_scripts/023-update-contact-cta-section-db.js
 */

const { Client } = require("pg");

// Database configuration from environment or defaults
const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  ssl:
    process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
};

/**
 * Update Contact Page CTA Section
 */
async function updateContactPageCTA() {
  const client = new Client(DB_CONFIG);

  try {
    console.log(
      "🚀 Starting migration: Update Contact Page CTA Section (Direct DB)\n",
    );
    console.log("📍 Database:", DB_CONFIG.host + ":" + DB_CONFIG.port);
    console.log("📍 Database Name:", DB_CONFIG.database);
    console.log("");

    // Connect to database
    console.log("🔌 Connecting to database...");
    await client.connect();
    console.log("✅ Connected to database\n");

    // Step 1: Find contact page
    console.log("📥 Fetching contact page...");
    const findQuery = `
      SELECT id, document_id, title, slug, content
      FROM pages
      WHERE slug = 'contact'
      AND published_at IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const findResult = await client.query(findQuery);

    if (findResult.rows.length === 0) {
      console.error("❌ Contact page not found");
      process.exit(1);
    }

    const contactPage = findResult.rows[0];
    console.log("✅ Contact page found:", contactPage.title);
    console.log("   ID:", contactPage.id);
    console.log("   Document ID:", contactPage.document_id);

    // Step 2: Parse existing content
    let content = {};
    if (contactPage.content) {
      try {
        content =
          typeof contactPage.content === "string"
            ? JSON.parse(contactPage.content)
            : contactPage.content;
      } catch (e) {
        console.log("⚠️  Could not parse existing content, starting fresh");
      }
    }

    // Step 3: Update CTA section with improved structure
    console.log("\n📝 Updating CTA section...");

    const updatedCTA = {
      title:
        content.cta?.title || "Sẵn sàng bắt đầu hành trình nụ cười hoàn hảo?",
      description:
        content.cta?.description ||
        "Đặt lịch tư vấn miễn phí ngay hôm nay và khám phá giải pháp nha khoa phù hợp nhất cho bạn",
      primaryButtonText: content.cta?.primaryButtonText || "Đặt lịch tư vấn",
      primaryButtonLink: content.cta?.primaryButtonLink || "/booking",
      secondaryButtonText:
        content.cta?.secondaryButtonText || "Gọi ngay: 1900 8059",
      secondaryButtonLink: content.cta?.secondaryButtonLink || "tel:19008059",
      stats: content.cta?.stats || [
        {
          value: "10,000+",
          label: "Khách hàng hài lòng",
        },
        {
          value: "15+",
          label: "Năm kinh nghiệm",
        },
        {
          value: "4.9/5",
          label: "Đánh giá trung bình",
        },
      ],
    };

    // Merge with existing content
    const updatedContent = {
      ...content,
      cta: updatedCTA,
    };

    // Step 4: Update the page
    console.log("💾 Saving updated content...");
    const updateQuery = `
      UPDATE pages
      SET 
        content = $1,
        updated_at = NOW()
      WHERE id = $2
    `;

    await client.query(updateQuery, [
      JSON.stringify(updatedContent),
      contactPage.id,
    ]);

    console.log("✅ CTA section updated successfully!");

    // Step 5: Summary
    console.log("\n" + "=".repeat(70));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\n📋 Summary:");
    console.log("  ✓ Contact page CTA section updated");
    console.log("  ✓ Added/updated title and description");
    console.log("  ✓ Added/updated button texts and links");
    console.log("  ✓ Added/updated stats section");
    console.log("\n📌 Next steps:");
    console.log("  1. Visit the contact page to see the new CTA design");
    console.log(
      "  2. Replace placeholder image with actual clinic/contact image",
    );
    console.log("  3. Verify all buttons link to correct pages");
    console.log("  4. Test on mobile and desktop devices");
    console.log("");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  } finally {
    // Close database connection
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

// Run migration
updateContactPageCTA();
