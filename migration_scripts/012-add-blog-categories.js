const { Client } = require("pg");
const axios = require("axios");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://corp-circle-register-restricted.trycloudflare.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.STRAPI_API_TOKEN;

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

// Category mapping for existing blogs
const blogCategories = {
  "nieng-rang-invisalign": "Niềng răng",
  "cay-ghep-implant": "Implant",
  "boc-rang-su-tham-my": "Răng sứ",
  "tay-trang-rang-an-toan": "Tẩy trắng",
  "cham-soc-rang-mieng-tre-em": "Chăm sóc răng",
  "nho-rang-khon-an-toan": "Chăm sóc răng",
};

async function addBlogCategories() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    const headers = { Authorization: `Bearer ${STRAPI_TOKEN}` };

    // Step 1: Check if category column exists
    console.log("🔍 Checking blog table structure...");
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'category'
    `);

    if (columnCheck.rows.length === 0) {
      console.log("➕ Adding category column to blogs table...");
      await client.query(`
        ALTER TABLE blogs 
        ADD COLUMN IF NOT EXISTS category VARCHAR(255)
      `);
      console.log("✅ Category column added\n");
    } else {
      console.log("✅ Category column already exists\n");
    }

    // Step 2: Update existing blogs with categories via API
    console.log("🔄 Updating blogs with categories...\n");

    const blogsResponse = await axios.get(
      `${STRAPI_URL}/api/blogs?populate=*`,
      { headers },
    );

    const blogs = blogsResponse.data.data;
    console.log(`📊 Found ${blogs.length} blogs to update\n`);

    for (const blog of blogs) {
      const category = blogCategories[blog.slug] || "Chăm sóc răng";

      console.log(`🔄 Updating: ${blog.title}`);
      console.log(`   Category: ${category}`);

      try {
        await axios.put(
          `${STRAPI_URL}/api/blogs/${blog.documentId}`,
          {
            data: {
              category: category,
            },
          },
          { headers },
        );
        console.log(`✅ Updated successfully\n`);
      } catch (error) {
        console.error(`❌ Failed to update ${blog.slug}:`, error.message);
      }
    }

    // Step 3: Verify updates
    console.log("\n🔍 Verifying updates...");
    const verifyResponse = await axios.get(
      `${STRAPI_URL}/api/blogs?populate=*`,
      { headers },
    );

    console.log("\n📊 Blog Categories:");
    verifyResponse.data.data.forEach((blog) => {
      console.log(`  - ${blog.title}: ${blog.category || "No category"}`);
    });

    // Step 4: Get unique categories
    const categories = [
      ...new Set(
        verifyResponse.data.data.map((b) => b.category).filter(Boolean),
      ),
    ];
    console.log("\n📋 Available Categories:");
    categories.forEach((cat) => console.log(`  - ${cat}`));

    console.log("\n✅ Migration completed successfully!");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (error.response) {
      console.error("API Error:", JSON.stringify(error.response.data, null, 2));
    }
    await client.end();
    process.exit(1);
  }
}

addBlogCategories();
