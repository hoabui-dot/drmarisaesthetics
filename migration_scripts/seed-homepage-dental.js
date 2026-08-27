/**
 * Seed Homepage Data for Dental Clinic
 *
 * This script seeds the homepage with realistic Vietnamese content
 * for "Nha Khoa Quốc Tế Sài Gòn"
 *
 * Usage:
 *   node migration_scripts/seed-homepage-dental.js
 *
 * Requirements:
 *   - Strapi must be running
 *   - API token must be set in environment
 *   - Homepage content type must exist
 */

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error("❌ Error: STRAPI_API_TOKEN environment variable is required");
  console.error("   Set it in your .env file or export it:");
  console.error("   export STRAPI_API_TOKEN=your-token-here");
  process.exit(1);
}

/**
 * Make API request to Strapi
 */
async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${STRAPI_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(result)}`,
      );
    }

    return result;
  } catch (error) {
    console.error(`❌ Request failed: ${method} ${url}`);
    throw error;
  }
}

/**
 * Seed Homepage Data
 */
async function seedHomepage() {
  console.log("\n🏠 Seeding Homepage...");

  const homepageData = {
    data: {
      title: "Trang chủ - Nha Khoa Quốc Tế Sài Gòn",
      layout: [
        // Hero Section
        {
          __component: "homepage.hero",
          heading: "Nụ cười hoàn hảo - Tự tin tỏa sáng",
          subheading:
            "Chăm sóc răng miệng chuyên nghiệp với công nghệ hiện đại và đội ngũ bác sĩ giàu kinh nghiệm. Mang đến nụ cười rạng rỡ cho bạn.",
          cta_label: "Đặt lịch ngay",
          cta_link: "/booking",
        },

        // Services Section
        {
          __component: "homepage.services",
          title: "Dịch vụ nha khoa chuyên nghiệp",
          items: [
            {
              title: "Cấy ghép Implant",
              description:
                "Phục hồi răng mất với công nghệ cấy ghép Implant hiện đại, an toàn và bền vững. Giải pháp tối ưu cho răng mất lâu năm.",
            },
            {
              title: "Tẩy trắng răng",
              description:
                "Làm trắng răng an toàn với công nghệ Whitening Max, giúp răng trắng sáng tự nhiên chỉ sau 60 phút. Hiệu quả lên đến 8-10 tông màu.",
            },
            {
              title: "Niềng răng thẩm mỹ",
              description:
                "Chỉnh nha invisalign và mắc cài kim loại/sứ. Răng đều đẹp, khớp cắn chuẩn, nụ cười hoàn hảo. Tư vấn miễn phí phác đồ điều trị.",
            },
            {
              title: "Bọc răng sứ",
              description:
                "Răng sứ thẩm mỹ cao cấp Cercon, Emax. Màu sắc tự nhiên, độ bền cao, không gây kích ứng. Bảo hành lên đến 10 năm.",
            },
            {
              title: "Nhổ răng khôn",
              description:
                "Nhổ răng khôn an toàn, không đau với công nghệ Piezosurgery. Bác sĩ giàu kinh nghiệm, quy trình vô trùng tuyệt đối.",
            },
            {
              title: "Điều trị tủy",
              description:
                "Chữa tủy răng với công nghệ Rotary hiện đại. Không đau, hiệu quả cao, bảo tồn răng thật tối đa. Cam kết chất lượng.",
            },
          ],
        },

        // About Section
        {
          __component: "homepage.about",
          title: "Về Nha Khoa Quốc Tế Sài Gòn",
          content:
            "Với hơn 15 năm kinh nghiệm trong lĩnh vực nha khoa, chúng tôi tự hào là địa chỉ tin cậy của hàng nghìn khách hàng tại TP. Hồ Chí Minh. Đội ngũ bác sĩ chuyên môn cao, trang thiết bị hiện đại nhập khẩu từ Mỹ và Châu Âu, cùng quy trình điều trị chuẩn quốc tế đảm bảo mang đến dịch vụ chăm sóc răng miệng tốt nhất.\n\nChúng tôi cam kết:\n• Tư vấn miễn phí và chính xác\n• Quy trình vô trùng tuyệt đối\n• Bảo hành dài hạn\n• Hỗ trợ trả góp 0% lãi suất\n• Chăm sóc khách hàng tận tâm",
        },

        // Testimonials Section
        {
          __component: "homepage.testimonials",
          title: "Khách hàng nói gì về chúng tôi",
          items: [
            {
              name: "Chị Nguyễn Thị Mai",
              content:
                "Tôi đã cấy ghép 2 răng Implant tại đây và rất hài lòng. Bác sĩ tư vấn tận tình, quy trình chuyên nghiệp. Sau 3 tháng răng đã ổn định và tôi có thể ăn uống bình thường. Cảm ơn đội ngũ bác sĩ!",
              rating: 5,
            },
            {
              name: "Anh Trần Văn Hùng",
              content:
                "Niềng răng invisalign tại Nha Khoa Quốc Tế Sài Gòn là quyết định đúng đắn nhất. Sau 18 tháng, răng tôi đã đều đẹp, nụ cười tự tin hơn rất nhiều. Bác sĩ theo dõi sát sao từng giai đoạn.",
              rating: 5,
            },
            {
              name: "Chị Lê Thị Hương",
              content:
                "Tẩy trắng răng ở đây hiệu quả vượt mong đợi. Răng trắng sáng tự nhiên, không ê buốt. Nhân viên thân thiện, phòng khám sạch sẽ. Tôi sẽ giới thiệu cho bạn bè và người thân.",
              rating: 5,
            },
            {
              name: "Anh Phạm Minh Tuấn",
              content:
                "Bọc răng sứ Emax tại đây rất đẹp và tự nhiên. Màu sắc khớp hoàn hảo với răng thật. Bác sĩ làm việc tỉ mỉ, chu đáo. Giá cả hợp lý, có bảo hành dài hạn. Rất hài lòng!",
              rating: 5,
            },
          ],
        },

        // CTA Section
        {
          __component: "homepage.cta",
          text: "Sẵn sàng cho nụ cười hoàn hảo? Đặt lịch tư vấn miễn phí ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới!",
          button_label: "Đặt lịch ngay",
          button_link: "/booking",
        },
      ],
    },
  };

  try {
    // Check if homepage exists (Single Type may return 404 if empty)
    let homepageExists = false;
    try {
      const existing = await apiRequest("/api/homepage");
      homepageExists = !!existing.data;
      console.log("   ℹ️  Homepage already exists, updating...");
    } catch (error) {
      // 404 means homepage is empty (Single Type with no data yet)
      if (error.message.includes("404")) {
        console.log("   ℹ️  Homepage is empty, creating...");
      } else {
        throw error;
      }
    }

    // Single Types always use PUT (not POST)
    await apiRequest("/api/homepage", "PUT", homepageData);
    console.log("   ✅ Homepage saved");

    // Publish homepage
    const homepage = await apiRequest("/api/homepage");
    if (homepage.data && !homepage.data.publishedAt) {
      console.log("   ℹ️  Publishing homepage...");
      await apiRequest("/api/homepage", "PUT", {
        data: {
          ...homepageData.data,
          publishedAt: new Date().toISOString(),
        },
      });
      console.log("   ✅ Homepage published");
    }
  } catch (error) {
    console.error("   ❌ Failed to seed homepage:", error.message);
    throw error;
  }
}

/**
 * Verify seeded data
 */
async function verifyData() {
  console.log("\n🔍 Verifying seeded data...");

  try {
    // Verify homepage with proper populate
    const homepage = await apiRequest(
      "/api/homepage?populate[layout][populate]=*",
    );

    if (homepage.data) {
      console.log(`   ✅ Homepage: Title present`);
      console.log(
        `   ✅ Homepage: ${homepage.data.layout?.length || 0} layout blocks`,
      );

      // Count each block type
      const blockTypes = {};
      homepage.data.layout?.forEach((block) => {
        const type = block.__component?.split(".")[1] || "unknown";
        blockTypes[type] = (blockTypes[type] || 0) + 1;
      });

      Object.entries(blockTypes).forEach(([type, count]) => {
        console.log(`   ✅ Homepage: ${count}x ${type} block(s)`);
      });
    } else {
      console.log("   ⚠️  Homepage: No data found");
    }
  } catch (error) {
    console.error("   ❌ Verification failed:", error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting homepage seeding for Dental Clinic...");
  console.log(`   Strapi URL: ${STRAPI_URL}`);

  try {
    await seedHomepage();
    await verifyData();

    console.log("\n✅ Homepage seeding completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Visit Strapi admin to verify homepage data");
    console.log("   2. Check frontend to see dynamic homepage");
    console.log("   3. Configure webhook for cache revalidation");
  } catch (error) {
    console.error("\n❌ Homepage seeding failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedHomepage, verifyData };
