const axios = require("axios");
const https = require("https");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN = process.env.STRAPI_API_TOKEN || "your-api-token-here";

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function migrateAboutUsToSingleType() {
  console.log("🚀 Migrating About Us from page to single-type...\n");

  try {
    // Step 1: Get existing about-us page data
    console.log("📖 Fetching existing about-us page data...");
    const pagesResponse = await axiosInstance.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=about-us`,
    );

    if (pagesResponse.data.data.length === 0) {
      console.log("❌ About Us page not found");
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
        return;
      }
    }

    // Step 2: Transform data to component structure
    console.log("🔄 Transforming data to component structure...");

    const layout = [];

    // Hero Section
    if (existingContent.hero) {
      const hero = existingContent.hero;
      layout.push({
        __component: "about.hero",
        badge: hero.badge,
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
        images: hero.images || [],
      });
    }

    // Achievements Section
    if (existingContent.achievements) {
      const achievements = existingContent.achievements;
      layout.push({
        __component: "about.achievements",
        badge: achievements.badge,
        title: achievements.title,
        description: achievements.description,
        image: achievements.imageId ? { id: achievements.imageId } : null,
        features: achievements.features || [],
      });
    }

    // Why Choose Us Section
    if (existingContent.whyChooseUs) {
      const whyChooseUs = existingContent.whyChooseUs;
      layout.push({
        __component: "about.why-choose-us",
        badge: whyChooseUs.badge,
        title: whyChooseUs.title,
        description: whyChooseUs.description,
        features: whyChooseUs.features || [],
        images: whyChooseUs.images || [],
      });
    }

    // Philosophy Section
    if (existingContent.philosophy) {
      const philosophy = existingContent.philosophy;
      layout.push({
        __component: "about.philosophy",
        badge: philosophy.badge,
        title: philosophy.title,
        quote: philosophy.quote,
        description: philosophy.description,
        image: philosophy.imageId ? { id: philosophy.imageId } : null,
        pillars: philosophy.pillars || [],
      });
    }

    // Core Values Section
    if (existingContent.coreValues) {
      const coreValues = existingContent.coreValues;
      layout.push({
        __component: "about.core-values",
        badge: coreValues.badge,
        title: coreValues.title,
        description: coreValues.description,
        values: coreValues.values || [],
      });
    }

    // Commitment Section
    if (existingContent.commitment) {
      const commitment = existingContent.commitment;
      layout.push({
        __component: "about.commitment",
        badge: commitment.badge,
        title: commitment.title,
        description: commitment.description,
        commitments: commitment.commitments || [],
      });
    }

    // CTA Section
    if (existingContent.cta) {
      const cta = existingContent.cta;
      layout.push({
        __component: "about.cta",
        badge: cta.badge,
        title: cta.title,
        description: cta.description,
        primaryButtonText: cta.primaryButtonText,
        primaryButtonLink: cta.primaryButtonLink,
        secondaryButtonText: cta.secondaryButtonText,
        secondaryButtonLink: cta.secondaryButtonLink,
        contactInfo:
          cta.contactInfo?.map((info) => ({ text: info.text })) || [],
      });
    }

    // Step 3: Create/Update About Us single-type
    console.log("💾 Creating About Us single-type...");

    const aboutUsData = {
      data: {
        title: page.title || "About Us - Saigon International Dental Clinic",
        description:
          page.description ||
          "Learn about our mission, values, and the team behind Saigon International Dental Clinic",
        layout: layout,
        publishedAt: new Date().toISOString(),
      },
    };

    try {
      // Try to get existing about-us single-type
      const existingResponse = await axiosInstance.get(
        `${STRAPI_URL}/api/about-us`,
      );

      // Update existing
      const updateResponse = await axiosInstance.put(
        `${STRAPI_URL}/api/about-us`,
        aboutUsData,
      );
      console.log("✓ Updated existing About Us single-type");
    } catch (error) {
      if (error.response?.status === 404) {
        // Create new
        const createResponse = await axiosInstance.post(
          `${STRAPI_URL}/api/about-us`,
          aboutUsData,
        );
        console.log("✓ Created new About Us single-type");
      } else {
        throw error;
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("📋 Migrated sections:");
    console.log(`  - ${layout.length} components created`);
    layout.forEach((component, index) => {
      console.log(`  ${index + 1}. ${component.__component}`);
    });

    console.log("\n💡 Next steps:");
    console.log("  1. Restart Strapi to load new content types");
    console.log("  2. Update frontend to use /api/about-us endpoint");
    console.log("  3. Test the About Us page");
  } catch (error) {
    console.error(
      "❌ Migration failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    await migrateAboutUsToSingleType();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
