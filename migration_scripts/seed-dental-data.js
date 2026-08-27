/**
 * Seed Dental Clinic Data
 *
 * This script seeds the database with initial data for a dental clinic:
 * - Navigation menu (header)
 * - Footer content
 *
 * Usage:
 *   node migration_scripts/seed-dental-data.js
 *
 * Requirements:
 *   - Strapi must be running
 *   - API token must be set in environment
 */

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error("❌ Error: STRAPI_API_TOKEN environment variable is required");
  console.error("   Set it in your .env file or export it:");
  console.error("   export STRAPI_API_TOKEN=your-token-here");
  process.exit(1);
}

/**
 * Make API request to Strapi
 */
async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${STRAPI_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(result)}`,
      );
    }

    return result;
  } catch (error) {
    console.error(`❌ Request failed: ${method} ${url}`);
    throw error;
  }
}

/**
 * Seed Navigation (Header Menu)
 */
async function seedNavigation() {
  console.log("\n📋 Seeding Navigation...");

  const navigationData = {
    data: {
      menu_links: [
        { label: "Trang chủ", href: "/" },
        { label: "Dịch vụ", href: "/services" },
        { label: "Liên hệ", href: "/contact" },
      ],
    },
  };

  try {
    // Check if navigation exists
    const existing = await apiRequest("/api/navigation");

    if (existing.data) {
      console.log("   ℹ️  Navigation already exists, updating...");
      await apiRequest("/api/navigation", "PUT", navigationData);
      console.log("   ✅ Navigation updated");
    } else {
      console.log("   ℹ️  Creating navigation...");
      await apiRequest("/api/navigation", "POST", navigationData);
      console.log("   ✅ Navigation created");
    }

    // Publish navigation
    const nav = await apiRequest("/api/navigation");
    if (nav.data && !nav.data.publishedAt) {
      console.log("   ℹ️  Publishing navigation...");
      await apiRequest("/api/navigation", "PUT", {
        data: { ...navigationData.data, publishedAt: new Date().toISOString() },
      });
      console.log("   ✅ Navigation published");
    }
  } catch (error) {
    console.error("   ❌ Failed to seed navigation:", error.message);
    throw error;
  }
}

/**
 * Seed Footer
 */
async function seedFooter() {
  console.log("\n🦶 Seeding Footer...");

  const footerData = {
    data: {
      description:
        "Nha Khoa Quốc Tế Sài Gòn - Chăm sóc nụ cười của bạn với đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại.",
      contact_info: {
        address: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
        phone: "0901 234 567",
        email: "contact@nhakhoasaigon.vn",
      },
      footer_links: [
        { label: "Giới thiệu", href: "/about" },
        { label: "Dịch vụ", href: "/services" },
        { label: "Bảng giá", href: "/pricing" },
        { label: "Liên hệ", href: "/contact" },
      ],
      social_links: [
        { platform: "Facebook", url: "https://facebook.com/nhakhoasaigon" },
        { platform: "Zalo", url: "https://zalo.me/nhakhoasaigon" },
        { platform: "Instagram", url: "https://instagram.com/nhakhoasaigon" },
      ],
    },
  };

  try {
    // For Single Types, check if footer exists (404 is OK if empty)
    let footerExists = false;
    try {
      const existing = await apiRequest("/api/footer");
      footerExists = !!existing.data;
      console.log("   ℹ️  Footer already exists, updating...");
    } catch (error) {
      // 404 means footer is empty (Single Type with no data yet)
      if (error.message.includes("404")) {
        console.log("   ℹ️  Footer is empty, creating...");
      } else {
        throw error;
      }
    }

    // Single Types always use PUT (not POST)
    await apiRequest("/api/footer", "PUT", footerData);
    console.log("   ✅ Footer saved");

    // Publish footer
    const footer = await apiRequest("/api/footer");
    if (footer.data && !footer.data.publishedAt) {
      console.log("   ℹ️  Publishing footer...");
      await apiRequest("/api/footer", "PUT", {
        data: { ...footerData.data, publishedAt: new Date().toISOString() },
      });
      console.log("   ✅ Footer published");
    }
  } catch (error) {
    console.error("   ❌ Failed to seed footer:", error.message);
    throw error;
  }
}

/**
 * Verify seeded data
 */
async function verifyData() {
  console.log("\n🔍 Verifying seeded data...");

  try {
    // Verify navigation
    const nav = await apiRequest("/api/navigation?populate=*");
    if (nav.data && nav.data.menu_links && nav.data.menu_links.length > 0) {
      console.log(`   ✅ Navigation: ${nav.data.menu_links.length} menu items`);
    } else {
      console.log("   ⚠️  Navigation: No menu items found");
    }

    // Verify footer
    const footer = await apiRequest("/api/footer?populate=*");
    if (footer.data) {
      console.log(`   ✅ Footer: Description present`);
      console.log(
        `   ✅ Footer: ${footer.data.footer_links?.length || 0} footer links`,
      );
      console.log(
        `   ✅ Footer: ${footer.data.social_links?.length || 0} social links`,
      );
    } else {
      console.log("   ⚠️  Footer: No data found");
    }
  } catch (error) {
    console.error("   ❌ Verification failed:", error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting data seeding for Dental Clinic...");
  console.log(`   Strapi URL: ${STRAPI_URL}`);

  try {
    await seedNavigation();
    await seedFooter();
    await verifyData();

    console.log("\n✅ Data seeding completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Visit Strapi admin to verify data");
    console.log("   2. Check frontend to see navigation and footer");
    console.log("   3. Configure webhook for cache revalidation");
  } catch (error) {
    console.error("\n❌ Data seeding failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedNavigation, seedFooter, verifyData };
