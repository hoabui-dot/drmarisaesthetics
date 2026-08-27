/**
 * Migration Script: Add Categories to Blog Posts
 *
 * This script updates existing blog posts with appropriate categories
 * based on their content and title.
 *
 * Categories:
 * - Implant
 * - Niềng răng
 * - Tẩy trắng
 * - Răng sứ
 * - Chăm sóc răng
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

function detectCategory(title) {
  const titleLower = (title || "").toLowerCase();

  // Priority order matters - check more specific terms first
  if (
    titleLower.includes("bọc răng") ||
    titleLower.includes("răng sứ") ||
    titleLower.includes("veneer")
  ) {
    return "Răng sứ";
  }
  if (
    titleLower.includes("niềng răng") ||
    titleLower.includes("invisalign") ||
    titleLower.includes("chỉnh nha")
  ) {
    return "Niềng răng";
  }
  if (titleLower.includes("tẩy trắng") || titleLower.includes("làm trắng")) {
    return "Tẩy trắng";
  }
  if (titleLower.includes("implant") || titleLower.includes("cấy ghép")) {
    return "Implant";
  }
  if (
    titleLower.includes("chăm sóc") ||
    titleLower.includes("vệ sinh") ||
    titleLower.includes("nhổ răng")
  ) {
    return "Chăm sóc răng";
  }

  return "Chăm sóc răng"; // Default category
}

async function updateBlogCategories() {
  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Get all blogs
    const result = await client.query(`
      SELECT id, document_id, title, content, category
      FROM blogs
      ORDER BY id
    `);

    console.log(`\n📊 Found ${result.rows.length} blog posts\n`);

    let updatedCount = 0;

    for (const blog of result.rows) {
      const currentCategory = blog.category;
      const detectedCategory = detectCategory(blog.title);

      // Always update to ensure correct category
      await client.query(`UPDATE blogs SET category = $1 WHERE id = $2`, [
        detectedCategory,
        blog.id,
      ]);

      if (currentCategory !== detectedCategory) {
        console.log(`✅ Updated blog #${blog.id}: "${blog.title}"`);
        console.log(
          `   Category: ${currentCategory || "NONE"} → ${detectedCategory}\n`,
        );
        updatedCount++;
      } else {
        console.log(
          `✓ Confirmed blog #${blog.id}: "${blog.title}" (${detectedCategory})\n`,
        );
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updatedCount} blogs`);
    console.log(`   Confirmed: ${result.rows.length - updatedCount} blogs`);

    // Show category distribution
    const categoryStats = await client.query(`
      SELECT category, COUNT(*) as count
      FROM blogs
      GROUP BY category
      ORDER BY count DESC
    `);

    console.log("\n📊 Category Distribution:");
    categoryStats.rows.forEach((row) => {
      console.log(`   ${row.category}: ${row.count} posts`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await client.end();
    console.log("\n✅ Database connection closed");
  }
}

// Run migration
updateBlogCategories()
  .then(() => {
    console.log("\n✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
