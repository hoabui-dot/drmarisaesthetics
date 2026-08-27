const axios = require("axios");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error("❌ STRAPI_API_TOKEN not found in environment");
  process.exit(1);
}

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function addSocialLinkIcons() {
  try {
    console.log("🚀 Starting migration: Add icon field to social links...\n");

    // Fetch current footer data
    console.log("📥 Fetching footer data...");
    const footerResponse = await api.get("/api/footer", {
      params: {
        "populate[social_links]": "true",
      },
    });

    if (!footerResponse.data?.data) {
      console.log("⚠️  No footer found. Skipping migration.");
      return;
    }

    const footer = footerResponse.data.data;
    const socialLinks = footer.social_links || [];

    console.log(`✅ Found ${socialLinks.length} social links\n`);

    if (socialLinks.length === 0) {
      console.log("⚠️  No social links to update. Migration complete.");
      return;
    }

    // Display current social links
    console.log("📋 Current social links:");
    socialLinks.forEach((link, index) => {
      console.log(`   ${index + 1}. ${link.platform} - ${link.url}`);
      console.log(`      Icon: ${link.icon ? "✓ Has icon" : "✗ No icon"}`);
    });

    console.log("\n✅ Migration complete!");
    console.log("\n📝 Next steps:");
    console.log("   1. Restart Strapi to apply schema changes");
    console.log("   2. Go to Strapi Admin > Footer");
    console.log("   3. Upload icons for each social link");
    console.log("   4. Save and publish\n");
  } catch (error) {
    console.error(
      "❌ Migration failed:",
      error.response?.data || error.message,
    );
    process.exit(1);
  }
}

addSocialLinkIcons();
