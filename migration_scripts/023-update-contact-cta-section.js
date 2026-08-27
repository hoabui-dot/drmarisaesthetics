#!/usr/bin/env node

/**
 * Migration Script: Update Contact Page CTA Section
 *
 * This script updates the contact page CTA section with improved
 * 2026 modern design data structure.
 *
 * Run: node migration_scripts/023-update-contact-cta-section.js
 */

const axios = require("axios");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error("❌ Error: STRAPI_API_TOKEN environment variable is required");
  console.log("\nUsage:");
  console.log("  export STRAPI_API_TOKEN=your-token-here");
  console.log("  node migration_scripts/023-update-contact-cta-section.js");
  process.exit(1);
}

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * Update Contact Page CTA Section
 */
async function updateContactPageCTA() {
  try {
    console.log("🚀 Starting migration: Update Contact Page CTA Section\n");
    console.log("📍 Strapi URL:", STRAPI_URL);
    console.log("");

    // Step 1: Fetch contact page
    console.log("📥 Fetching contact page...");
    const pagesResponse = await api.get("/api/pages", {
      params: {
        "filters[slug][$eq]": "contact",
      },
    });

    if (!pagesResponse.data?.data || pagesResponse.data.data.length === 0) {
      console.error("❌ Contact page not found");
      process.exit(1);
    }

    const contactPage = pagesResponse.data.data[0];
    console.log("✅ Contact page found:", contactPage.title);

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
    await api.put(`/api/pages/${contactPage.documentId}`, {
      data: {
        content: JSON.stringify(updatedContent, null, 2),
      },
    });

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
    if (error.response) {
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run migration
updateContactPageCTA();
