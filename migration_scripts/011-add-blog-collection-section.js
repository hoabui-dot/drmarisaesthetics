const axios = require("axios");

const STRAPI_URL = "http:100.68.50.41:1337";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN;

async function main() {
  try {
    console.log("🔍 Checking Strapi connection...");

    const headers = STRAPI_TOKEN
      ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
      : {};

    // Test connection
    try {
      await axios.get(`${STRAPI_URL}/api/blogs?pagination[limit]=1`, {
        headers,
      });
      console.log("✅ Connected to Strapi");
    } catch (error) {
      console.error(
        "❌ Cannot connect to Strapi. Please ensure Strapi is running.",
      );
      console.error("   Run: docker-compose up -d");
      process.exit(1);
    }

    // 1. Create sample blog posts
    const blogPosts = [
      {
        title: "Niềng răng Invisalign - Giải pháp chỉnh nha hiện đại",
        slug: "nieng-rang-invisalign",
        excerpt:
          "Khám phá công nghệ niềng răng trong suốt Invisalign, giải pháp chỉnh nha thẩm mỹ không cần mắc cài kim loại.",
        content:
          "Invisalign là công nghệ niềng răng trong suốt tiên tiến, giúp chỉnh nha hiệu quả mà không ảnh hưởng đến thẩm mỹ.",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Cấy ghép Implant - Phục hồi răng mất hoàn hảo",
        slug: "cay-ghep-implant",
        excerpt:
          "Tìm hiểu về quy trình cấy ghép implant, giải pháp phục hồi răng mất bền vững và tự nhiên nhất.",
        content:
          "Implant là giải pháp phục hồi răng mất tốt nhất hiện nay, mang lại độ bền cao và thẩm mỹ tự nhiên.",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Bọc răng sứ thẩm mỹ - Nụ cười hoàn hảo",
        slug: "boc-rang-su-tham-my",
        excerpt:
          "Răng sứ thẩm mỹ giúp bạn có được nụ cười trắng sáng, đều đẹp và tự tin hơn trong giao tiếp.",
        content:
          "Bọc răng sứ là phương pháp phục hồi thẩm mỹ răng hiệu quả, giúp răng đều đẹp và trắng sáng.",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Tẩy trắng răng an toàn tại nha khoa",
        slug: "tay-trang-rang-an-toan",
        excerpt:
          "Phương pháp tẩy trắng răng chuyên nghiệp, an toàn và hiệu quả tại phòng khám nha khoa.",
        content:
          "Tẩy trắng răng chuyên nghiệp giúp răng trắng sáng an toàn, không gây hại men răng.",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Chăm sóc răng miệng cho trẻ em",
        slug: "cham-soc-rang-mieng-tre-em",
        excerpt:
          "Hướng dẫn chăm sóc răng miệng cho trẻ em từ sớm để có hàm răng khỏe mạnh.",
        content:
          "Chăm sóc răng miệng từ nhỏ giúp trẻ có hàm răng khỏe mạnh và phát triển tốt.",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Nhổ răng khôn an toàn không đau",
        slug: "nho-rang-khon-an-toan",
        excerpt:
          "Quy trình nhổ răng khôn hiện đại, an toàn với công nghệ tiên tiến và gây tê hiệu quả.",
        content:
          "Nhổ răng khôn với công nghệ hiện đại, gây tê hiệu quả giúp quá trình diễn ra an toàn và không đau.",
        publishedAt: new Date().toISOString(),
      },
    ];

    console.log("📝 Creating blog posts...");
    const createdBlogIds = [];

    for (const post of blogPosts) {
      try {
        const response = await axios.post(
          `${STRAPI_URL}/api/blogs`,
          { data: post },
          { headers },
        );

        createdBlogIds.push(response.data.data.id);
        console.log(`✅ Created blog: ${post.title}`);
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`⚠️  Blog already exists: ${post.title}`);
        } else {
          console.error(`❌ Failed to create blog: ${post.title}`);
        }
      }
    }

    // 2. Fetch existing blogs
    const blogsResponse = await axios.get(
      `${STRAPI_URL}/api/blogs?pagination[limit]=8&sort=publishedAt:desc`,
      { headers },
    );
    const existingBlogs = blogsResponse.data.data;
    console.log(`✅ Found ${existingBlogs.length} blogs`);

    if (existingBlogs.length === 0) {
      console.log("⚠️  No blogs found. Please create blogs first.");
      return;
    }

    // 3. Get homepage
    const homepageResponse = await axios.get(
      `${STRAPI_URL}/api/homepage?populate[layout][populate]=*`,
      { headers },
    );

    const homepage = homepageResponse.data.data;
    const currentLayout = homepage?.attributes?.layout || [];

    // 4. Check if blog collection already exists
    const hasBlogCollection = currentLayout.some(
      (block) => block.__component === "homepage.blog-collection-section",
    );

    if (hasBlogCollection) {
      console.log("✅ Blog collection section already exists in homepage");
    } else {
      // 5. Insert blog collection after hero
      const heroIndex = currentLayout.findIndex(
        (block) =>
          block.__component === "homepage.video-hero" ||
          block.__component === "homepage.hero",
      );

      const blogCollectionSection = {
        __component: "homepage.blog-collection-section",
        title: "Tin tức & Kiến thức nha khoa",
        subtitle:
          "Cập nhật những thông tin mới nhất về chăm sóc răng miệng và các dịch vụ nha khoa",
        posts: existingBlogs.slice(0, 6).map((blog) => blog.id),
        layout: "grid_3",
        showFeatured: true,
        isActive: true,
      };

      const newLayout = [...currentLayout];
      const insertIndex = heroIndex !== -1 ? heroIndex + 1 : 0;
      newLayout.splice(insertIndex, 0, blogCollectionSection);

      // 6. Update homepage
      await axios.put(
        `${STRAPI_URL}/api/homepage`,
        { data: { layout: newLayout } },
        { headers },
      );

      console.log("✅ Blog collection section added to homepage");
    }

    console.log("\n✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (error.response) {
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main();
