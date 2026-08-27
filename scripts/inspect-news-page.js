const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function inspectNewsPage() {
  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    // Get the news page with all fields
    const result = await client.query(`
      SELECT *
      FROM pages 
      WHERE slug = 'news-listing'
    `);

    if (result.rows.length > 0) {
      console.log("✅ News page found:");
      const page = result.rows[0];
      console.log("\nAll fields:");
      Object.keys(page).forEach((key) => {
        if (key === "content") {
          console.log(`  ${key}: [JSON - ${page[key].length} chars]`);
        } else {
          console.log(`  ${key}: ${page[key]}`);
        }
      });

      // Compare with another page
      console.log("\n\n📊 Comparing with another page (services-listing):");
      const compareResult = await client.query(`
        SELECT *
        FROM pages 
        WHERE slug = 'services-listing'
        LIMIT 1
      `);

      if (compareResult.rows.length > 0) {
        const comparePage = compareResult.rows[0];
        console.log("\nServices page fields:");
        Object.keys(comparePage).forEach((key) => {
          if (key === "content") {
            console.log(`  ${key}: [JSON - ${comparePage[key].length} chars]`);
          } else {
            console.log(`  ${key}: ${comparePage[key]}`);
          }
        });

        // Find differences
        console.log("\n\n🔍 Field differences:");
        const newsKeys = Object.keys(page);
        const serviceKeys = Object.keys(comparePage);

        const missingInNews = serviceKeys.filter((k) => !newsKeys.includes(k));
        const missingInService = newsKeys.filter(
          (k) => !serviceKeys.includes(k),
        );

        if (missingInNews.length > 0) {
          console.log("❌ Fields missing in news page:", missingInNews);
        }
        if (missingInService.length > 0) {
          console.log("⚠️  Extra fields in news page:", missingInService);
        }

        // Check NULL values
        console.log("\n\n🔍 NULL value comparison:");
        newsKeys.forEach((key) => {
          if (page[key] === null && comparePage[key] !== null) {
            console.log(
              `  ❌ ${key}: NULL in news, but has value in services (${comparePage[key]})`,
            );
          }
        });
      }

      // Check if there are any related tables
      console.log("\n\n🔍 Checking for related data:");

      // Check pages_components
      const componentsResult = await client.query(
        `
        SELECT * FROM pages_components WHERE entity_id = $1
      `,
        [page.id],
      );
      console.log(`  pages_components: ${componentsResult.rows.length} rows`);
    } else {
      console.log("❌ News page NOT found");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

inspectNewsPage();
