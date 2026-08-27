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

async function addServicesDescription() {
  try {
    console.log(
      "🚀 Starting migration: Add description to Services section...\n",
    );

    // Fetch homepage
    console.log("📥 Fetching homepage data...");
    const response = await api.get("/api/homepage", {
      params: {
        "populate[layout][on][homepage.services][populate]": "items",
      },
    });

    if (!response.data?.data) {
      console.log("❌ No homepage found");
      return;
    }

    const homepage = response.data.data;
    const layout = homepage.layout || [];

    // Find services section
    const servicesIndex = layout.findIndex(
      (block) => block.__component === "homepage.services",
    );

    if (servicesIndex === -1) {
      console.log("⚠️  No services section found in homepage");
      return;
    }

    const servicesSection = layout[servicesIndex];
    console.log(`✅ Found services section: "${servicesSection.title}"\n`);

    // Check if description already exists
    if (servicesSection.description) {
      console.log(
        "✅ Description already exists:",
        servicesSection.description,
      );
      console.log("\n✅ Migration complete - no changes needed!");
      return;
    }

    // Add description to services section
    const updatedLayout = layout.map((block, index) => {
      if (index === servicesIndex) {
        return {
          __component: "homepage.services",
          title: block.title,
          description:
            "Từ chăm sóc phòng ngừa đến điều trị thẩm mỹ nâng cao, chúng tôi cung cấp mọi thứ bạn cần cho sức khỏe răng miệng tối ưu",
          items: block.items,
        };
      }
      return block;
    });

    console.log("📝 Updating services section with description...");
    await api.put("/api/homepage", {
      data: {
        layout: updatedLayout,
      },
    });

    console.log("✅ Successfully added description to services section!\n");
    console.log("📋 Description:");
    console.log(
      '   "Từ chăm sóc phòng ngừa đến điều trị thẩm mỹ nâng cao, chúng tôi cung cấp mọi thứ bạn cần cho sức khỏe răng miệng tối ưu"',
    );
    console.log("\n✅ Migration complete!");
  } catch (error) {
    console.error(
      "❌ Migration failed:",
      error.response?.data || error.message,
    );
    process.exit(1);
  }
}

addServicesDescription();
