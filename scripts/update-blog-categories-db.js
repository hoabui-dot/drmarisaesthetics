const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

const blogCategories = {
  "nieng-rang-invisalign": "Niềng răng",
  "cay-ghep-implant": "Implant",
  "boc-rang-su-tham-my": "Răng sứ",
  "tay-trang-rang-an-toan": "Tẩy trắng",
  "cham-soc-rang-mieng-tre-em": "Chăm sóc răng",
  "nho-rang-khon-an-toan": "Chăm sóc răng",
};

async function updateCategories() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    console.log("🔄 Updating blog categories directly in database...\n");

    for (const [slug, category] of Object.entries(blogCategories)) {
      console.log(`Updating ${slug} -> ${category}`);

      await client.query(
        `
        UPDATE blogs 
        SET category = $1 
        WHERE slug = $2
      `,
        [category, slug],
      );
    }

    // Verify
    console.log("\n✅ Categories updated! Verifying...\n");
    const result = await client.query(`
      SELECT title, slug, category 
      FROM blogs 
      WHERE published_at IS NOT NULL
      ORDER BY published_at DESC
    `);

    console.log("📊 Blog Categories:");
    result.rows.forEach((row) => {
      console.log(`  - ${row.title}`);
      console.log(`    Category: ${row.category || "No category"}\n`);
    });

    await client.end();
    console.log("✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    await client.end();
    process.exit(1);
  }
}

updateCategories();
