const axios = require("axios");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function setupBlogCollection() {
  try {
    const headers = STRAPI_TOKEN
      ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
      : {};

    console.log("🔍 Fetching blog posts...");
    const blogsResponse = await axios.get(
      `${STRAPI_URL}/api/blogs?pagination[limit]=8&sort=publishedAt:desc`,
      { headers },
    );

    const blogs = blogsResponse.data.data;
    console.log(`✅ Found ${blogs.length} blog posts`);

    if (blogs.length === 0) {
      console.log(
        "⚠️  No blog posts found. Please create some blog posts first.",
      );
      return;
    }

    console.log("🔍 Fetching homepage...");
    const homepageResponse = await axios.get(
      `${STRAPI_URL}/api/homepage?populate[layout][populate]=*`,
      { headers },
    );

    const homepage = homepageResponse.data.data;
    const currentLayout = homepage.layout || [];

    // Find existing blog collection section
    const blogCollectionIndex = currentLayout.findIndex(
      (block) => block.__component === "homepage.blog-collection-section",
    );

    const blogCollectionSection = {
      __component: "homepage.blog-collection-section",
      title: "Tin tức & Kiến thức nha khoa",
      subtitle:
        "Cập nhật những thông tin mới nhất về chăm sóc răng miệng và các dịch vụ nha khoa",
      posts: blogs.slice(0, 6).map((blog) => blog.id),
      layout: "grid_3",
      showFeatured: true,
      isActive: true,
    };

    let newLayout;
    if (blogCollectionIndex !== -1) {
      // Update existing
      console.log("🔄 Updating existing blog collection section...");
      newLayout = [...currentLayout];
      newLayout[blogCollectionIndex] = blogCollectionSection;
    } else {
      // Insert after hero
      console.log("➕ Adding new blog collection section...");
      const heroIndex = currentLayout.findIndex(
        (block) =>
          block.__component === "homepage.video-hero" ||
          block.__component === "homepage.hero",
      );

      newLayout = [...currentLayout];
      const insertIndex = heroIndex !== -1 ? heroIndex + 1 : 0;
      newLayout.splice(insertIndex, 0, blogCollectionSection);
    }

    // Update homepage
    await axios.put(
      `${STRAPI_URL}/api/homepage`,
      { data: { layout: newLayout } },
      { headers },
    );

    console.log("✅ Blog collection section updated successfully");
    console.log(`📊 Linked ${blogCollectionSection.posts.length} blog posts`);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
    process.exit(1);
  }
}

setupBlogCollection();
