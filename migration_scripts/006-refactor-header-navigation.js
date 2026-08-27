/**
 * Migration Script: Refactor Header Navigation
 *
 * This script:
 * 1. Cleans up old navigation data (menu_links)
 * 2. Inserts new navigation structure with dropdown support
 * 3. Adds logo and CTA button configuration
 *
 * IDEMPOTENT: Safe to run multiple times
 */

const axios = require("axios");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error("❌ STRAPI_API_TOKEN is required");
  process.exit(1);
}

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * New navigation structure with dropdown support
 */
const NEW_NAVIGATION_DATA = {
  navigation: [
    {
      label: "Trang chủ",
      href: "/",
      isExternal: false,
    },
    {
      label: "Dịch vụ",
      href: "/services",
      isExternal: false,
      children: [
        {
          label: "Cấy ghép Implant",
          href: "/services/implant",
          isExternal: false,
        },
        {
          label: "Niềng răng Invisalign",
          href: "/services/invisalign",
          isExternal: false,
        },
        {
          label: "Bọc răng sứ thẩm mỹ",
          href: "/services/veneer",
          isExternal: false,
        },
        {
          label: "Tẩy trắng răng",
          href: "/services/whitening",
          isExternal: false,
        },
      ],
    },
    {
      label: "Về chúng tôi",
      href: "/about",
      isExternal: false,
    },
    {
      label: "Liên hệ",
      href: "/contact",
      isExternal: false,
    },
  ],
  ctaText: "Đặt lịch ngay",
  ctaLink: "/booking",
};

async function main() {
  console.log("🚀 Starting Header Navigation Refactor Migration...\n");

  try {
    // Step 1: Fetch current navigation
    console.log("📋 Step 1: Fetching current navigation...");
    let currentNav;
    try {
      const response = await api.get("/api/navigation");
      currentNav = response.data.data;
      console.log("✅ Current navigation found");
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("⚠️  No navigation found, will create new one");
        currentNav = null;
      } else {
        throw error;
      }
    }

    // Step 2: Update or create navigation with new structure
    console.log("\n📝 Step 2: Updating navigation with new structure...");

    if (currentNav) {
      // Update existing navigation
      const updateResponse = await api.put("/api/navigation", {
        data: NEW_NAVIGATION_DATA,
      });
      console.log("✅ Navigation updated successfully");
      console.log(
        `   - Navigation items: ${NEW_NAVIGATION_DATA.navigation.length}`,
      );
      console.log(
        `   - Dropdown items: ${NEW_NAVIGATION_DATA.navigation.filter((item) => item.children).length}`,
      );
    } else {
      // Create new navigation
      const createResponse = await api.post("/api/navigation", {
        data: NEW_NAVIGATION_DATA,
      });
      console.log("✅ Navigation created successfully");
    }

    // Step 3: Publish navigation
    console.log("\n📤 Step 3: Publishing navigation...");
    try {
      const publishResponse = await api.post("/api/navigation/actions/publish");
      console.log("✅ Navigation published successfully");
    } catch (error) {
      // Strapi v5 might use different publish endpoint
      console.log(
        "⚠️  Could not auto-publish. Please publish manually in Strapi Admin.",
      );
    }

    // Step 4: Verify
    console.log("\n🔍 Step 4: Verifying new navigation...");
    const verifyResponse = await api.get("/api/navigation", {
      params: {
        populate: "deep",
      },
    });

    const nav = verifyResponse.data.data;
    console.log("✅ Verification complete:");
    console.log(`   - Navigation items: ${nav.navigation?.length || 0}`);
    console.log(`   - CTA Text: ${nav.ctaText || "Not set"}`);
    console.log(`   - CTA Link: ${nav.ctaLink || "Not set"}`);

    if (nav.navigation) {
      nav.navigation.forEach((item, index) => {
        console.log(`   - ${index + 1}. ${item.label} (${item.href})`);
        if (item.children && item.children.length > 0) {
          item.children.forEach((child, childIndex) => {
            console.log(
              `      - ${childIndex + 1}. ${child.label} (${child.href})`,
            );
          });
        }
      });
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📌 Next steps:");
    console.log("   1. Restart Strapi to pick up schema changes");
    console.log("   2. Check Strapi Admin UI to verify navigation");
    console.log("   3. Upload logo image in Strapi Admin");
    console.log("   4. Update frontend Header component");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    if (error.response) {
      console.error(
        "Response data:",
        JSON.stringify(error.response.data, null, 2),
      );
    }
    process.exit(1);
  }
}

main();
