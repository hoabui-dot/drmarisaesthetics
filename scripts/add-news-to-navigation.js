const { Client } = require("pg");
const axios = require("axios");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN;

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function addNewsToNavigation() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    const headers = { Authorization: `Bearer ${STRAPI_TOKEN}` };

    // Fetch current navigation
    console.log("\n🔍 Fetching current navigation...");
    const response = await axios.get(
      `${STRAPI_URL}/api/navigation?populate[navigation][populate][children]=true`,
      { headers },
    );

    const navigation = response.data.data;
    const currentNav = navigation.navigation || [];

    console.log(`📊 Current navigation has ${currentNav.length} items`);

    // Check if "Tin tức" already exists
    const newsExists = currentNav.some(
      (item) => item.label === "Tin tức" || item.href === "/news",
    );

    if (newsExists) {
      console.log('✅ "Tin tức" already exists in navigation');
      await client.end();
      return;
    }

    // Add "Tin tức" to navigation
    console.log('\n➕ Adding "Tin tức" to navigation...');

    const newNavItem = {
      label: "Tin tức",
      href: "/news",
      isExternal: false,
      icon: null,
      children: [],
    };

    // Insert after "Dịch vụ" (services) if it exists, otherwise at the end
    const servicesIndex = currentNav.findIndex(
      (item) => item.label === "Dịch vụ" || item.href === "/services",
    );

    const newNav = [...currentNav];
    if (servicesIndex !== -1) {
      newNav.splice(servicesIndex + 1, 0, newNavItem);
    } else {
      newNav.push(newNavItem);
    }

    // Update navigation via API
    await axios.put(
      `${STRAPI_URL}/api/navigation`,
      {
        data: {
          navigation: newNav,
        },
      },
      { headers },
    );

    console.log('✅ "Tin tức" added to navigation successfully!');
    console.log("\n📋 Updated navigation:");
    newNav.forEach((item, i) => {
      console.log(`${i + 1}. ${item.label} → ${item.href}`);
    });

    await client.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error(
        "API Response:",
        JSON.stringify(error.response.data, null, 2),
      );
    }
    await client.end();
    process.exit(1);
  }
}

addNewsToNavigation();
