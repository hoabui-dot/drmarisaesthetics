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

async function inspectBlogStructure() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Check if blogs table exists
    console.log("📋 Checking blogs table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blogs'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("❌ Blogs table does not exist!");
      await client.end();
      return;
    }

    console.log("✅ Blogs table exists\n");

    // Get table structure
    console.log("📋 Blogs table columns:");
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'blogs'
      ORDER BY ordinal_position
    `);

    columns.rows.forEach((col) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === "NO" ? "(required)" : ""}`,
      );
    });

    // Get sample blog data
    console.log("\n📊 Sample blog data:");
    const blogs = await client.query(`
      SELECT id, document_id, title, slug, excerpt, published_at
      FROM blogs
      LIMIT 3
    `);

    blogs.rows.forEach((blog) => {
      console.log(`\n  ID: ${blog.id}`);
      console.log(`  Document ID: ${blog.document_id}`);
      console.log(`  Title: ${blog.title}`);
      console.log(`  Slug: ${blog.slug}`);
      console.log(`  Excerpt: ${blog.excerpt?.substring(0, 50)}...`);
      console.log(`  Published: ${blog.published_at}`);
    });

    // Check via API
    console.log("\n\n🔍 Checking via Strapi API...");
    const headers = { Authorization: `Bearer ${STRAPI_TOKEN}` };

    const apiResponse = await axios.get(
      `${STRAPI_URL}/api/blogs?populate=*&pagination[limit]=1`,
      { headers },
    );

    console.log("\n📊 API Response Structure:");
    const sampleBlog = apiResponse.data.data[0];
    console.log(JSON.stringify(sampleBlog, null, 2));

    // Check if we can fetch by slug
    console.log("\n\n🔍 Testing fetch by slug...");
    const testSlug = blogs.rows[0].slug;
    console.log(`Testing slug: ${testSlug}`);

    try {
      const slugResponse = await axios.get(
        `${STRAPI_URL}/api/blogs?filters[slug][$eq]=${testSlug}&populate=*`,
        { headers },
      );

      if (slugResponse.data.data.length > 0) {
        console.log("✅ Successfully fetched blog by slug");
        console.log(`Found: ${slugResponse.data.data[0].title}`);
      } else {
        console.log("❌ No blog found with that slug");
      }
    } catch (error) {
      console.log("❌ Error fetching by slug:", error.message);
    }

    await client.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    await client.end();
    process.exit(1);
  }
}

inspectBlogStructure();
