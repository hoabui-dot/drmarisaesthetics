/**
 * Migration Script: Create News/Blog Listing Page
 *
 * This script creates a news page entry in the pages table with:
 * - Hero section (title, description, search placeholder)
 * - Categories list
 * - Sidebar content (tags, CTA)
 * - Empty state message
 * - All text labels
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

const newsPageData = {
  title: "News & Blog Listing Page",
  slug: "news-listing",
  description: "News and blog listing page with categories and search",
  content: JSON.stringify({
    hero: {
      title: "Tin tức & Kiến thức nha khoa",
      description:
        "Cập nhật những thông tin mới nhất về chăm sóc răng miệng và các dịch vụ nha khoa hiện đại",
      searchPlaceholder: "Tìm kiếm bài viết...",
    },
    categories: [
      { id: "all", label: "Tất cả" },
      { id: "implant", label: "Implant" },
      { id: "nieng-rang", label: "Niềng răng" },
      { id: "tay-trang", label: "Tẩy trắng" },
      { id: "rang-su", label: "Răng sứ" },
      { id: "cham-soc-rang", label: "Chăm sóc răng" },
    ],
    sidebar: {
      popularPostsTitle: "Bài viết phổ biến",
      tagsTitle: "Thẻ phổ biến",
      tags: [
        "Implant",
        "Niềng răng",
        "Tẩy trắng",
        "Chăm sóc răng",
        "Răng sứ",
        "Bọc răng sứ",
        "Nhổ răng khôn",
      ],
      cta: {
        title: "Đặt lịch tư vấn miễn phí",
        description:
          "Nhận tư vấn chuyên sâu từ đội ngũ bác sĩ giàu kinh nghiệm",
        buttonText: "Đặt lịch ngay",
        buttonLink: "/booking",
      },
    },
    emptyState: {
      message: "Không tìm thấy bài viết nào",
    },
    readMoreText: "Đọc thêm",
    readNowText: "Đọc ngay",
  }),
};

async function createNewsPage() {
  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Check if news page already exists
    const existingPage = await client.query(
      `SELECT id, document_id FROM pages WHERE slug = $1`,
      [newsPageData.slug],
    );

    if (existingPage.rows.length > 0) {
      console.log("⚠️  News page already exists, updating...");

      await client.query(
        `UPDATE pages 
         SET title = $1, description = $2, content = $3, locale = 'en', updated_at = NOW(), published_at = NOW()
         WHERE slug = $4`,
        [
          newsPageData.title,
          newsPageData.description,
          newsPageData.content,
          newsPageData.slug,
        ],
      );

      console.log("✅ News page updated successfully!");
      console.log(`   Document ID: ${existingPage.rows[0].document_id}`);
    } else {
      console.log("📝 Creating news page...");

      // Generate document_id
      const documentId = `news-listing-${Date.now()}`;

      const result = await client.query(
        `INSERT INTO pages (
          document_id, title, slug, description, content, 
          published_at, created_at, updated_at, created_by_id, updated_by_id
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), 1, 1)
        RETURNING id, document_id`,
        [
          documentId,
          newsPageData.title,
          newsPageData.slug,
          newsPageData.description,
          newsPageData.content,
        ],
      );

      console.log("✅ News page created successfully!");
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Document ID: ${result.rows[0].document_id}`);
    }

    // Display the content structure
    console.log("\n📊 News Page Content Structure:");
    const content = JSON.parse(newsPageData.content);

    console.log("\n🎯 Hero Section:");
    console.log(`   Title: ${content.hero.title}`);
    console.log(`   Description: ${content.hero.description}`);
    console.log(`   Search Placeholder: ${content.hero.searchPlaceholder}`);

    console.log(`\n📂 Categories (${content.categories.length}):`);
    content.categories.forEach((cat) => {
      console.log(`   - ${cat.label} (${cat.id})`);
    });

    console.log(`\n🏷️  Tags (${content.sidebar.tags.length}):`);
    content.sidebar.tags.forEach((tag) => {
      console.log(`   - ${tag}`);
    });

    console.log("\n📢 Sidebar:");
    console.log(`   Popular Posts Title: ${content.sidebar.popularPostsTitle}`);
    console.log(`   Tags Title: ${content.sidebar.tagsTitle}`);
    console.log(`   CTA Title: ${content.sidebar.cta.title}`);
    console.log(`   CTA Button: ${content.sidebar.cta.buttonText}`);
    console.log(`   CTA Link: ${content.sidebar.cta.buttonLink}`);

    console.log("\n📝 Text Labels:");
    console.log(`   Read More: ${content.readMoreText}`);
    console.log(`   Read Now: ${content.readNowText}`);
    console.log(`   Empty State: ${content.emptyState.message}`);

    // Verify the page can be fetched
    const verifyPage = await client.query(
      `SELECT id, document_id, title, slug, published_at FROM pages WHERE slug = $1`,
      [newsPageData.slug],
    );

    if (verifyPage.rows.length > 0) {
      console.log("\n✅ Verification successful!");
      console.log(
        `   Page is published: ${verifyPage.rows[0].published_at ? "Yes" : "No"}`,
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await client.end();
    console.log("\n✅ Database connection closed");
  }
}

// Run migration
createNewsPage()
  .then(() => {
    console.log("\n✅ Migration complete!");
    console.log("\n📌 Next steps:");
    console.log(
      "   1. Frontend will fetch this page from: /api/pages?filters[slug][$eq]=news-listing",
    );
    console.log("   2. All hardcoded content has been moved to CMS");
    console.log("   3. Content can be edited in Strapi admin panel");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
