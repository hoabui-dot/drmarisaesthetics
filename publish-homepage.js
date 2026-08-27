/**
 * Publish the homepage
 */

const STRAPI_URL =
  "http://localhost:1337";
const STRAPI_API_TOKEN =
  process.env.STRAPI_API_TOKEN;

async function publish() {
  try {
    console.log("📤 Publishing homepage...");

    // First get the current homepage
    const getResponse = await fetch(`${STRAPI_URL}/api/homepage`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });
    const current = await getResponse.json();

    // Then publish it by updating with publishedAt
    const response = await fetch(`${STRAPI_URL}/api/homepage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          publishedAt: new Date().toISOString(),
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "❌ Publish failed:",
        result.error?.message || "Unknown error",
      );
      process.exit(1);
    }

    console.log("✅ Homepage published successfully!");
    console.log(`   Published at: ${result.data?.publishedAt || "now"}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

publish();
