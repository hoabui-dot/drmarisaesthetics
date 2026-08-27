/**
 * Migration 002: Enhance Homepage for 2026
 *
 * This migration enhances the homepage with modern sections:
 * - Trust indicators
 * - Before/After gallery
 * - Pricing transparency
 * - Process steps
 * - Doctor profiles
 * - FAQ section
 *
 * IDEMPOTENT: Safe to run multiple times
 *
 * Usage:
 *   export STRAPI_API_TOKEN=your-token-here
 *   node migration_scripts/002-enhance-homepage-2026.js
 */

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error("❌ Error: STRAPI_API_TOKEN environment variable is required");
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
 * Enhanced Homepage Data - 2026 Version
 */
async function seedEnhancedHomepage() {
  console.log("\n🚀 Seeding Enhanced Homepage (2026)...");

  const homepageData = {
    data: {
      title: "Trang chủ - Nha Khoa Quốc Tế Sài Gòn 2026",
      layout: [
        // 1. HERO SECTION
        {
          __component: "homepage.hero",
          heading: "Nụ cười hoàn hảo - Tự tin tỏa sáng",
          subheading:
            "Chăm sóc răng miệng chuyên nghiệp với công nghệ hiện đại và đội ngũ bác sĩ giàu kinh nghiệm. Mang đến nụ cười rạng rỡ cho bạn.",
          cta_label: "Đặt lịch tư vấn miễn phí",
          cta_link: "/booking",
        },

        // 2. TRUST SECTION
        {
          __component: "homepage.trust",
          title: "Được tin tưởng bởi hàng nghìn khách hàng",
          subtitle:
            "Với hơn 15 năm kinh nghiệm, chúng tôi tự hào là địa chỉ nha khoa uy tín hàng đầu tại TP.HCM",
          stats: [
            {
              number: "15",
              label: "Năm kinh nghiệm",
              suffix: "+",
            },
            {
              number: "50000",
              label: "Khách hàng hài lòng",
              suffix: "+",
            },
            {
              number: "98",
              label: "Tỷ lệ thành công",
              suffix: "%",
            },
            {
              number: "20",
              label: "Bác sĩ chuyên môn cao",
              suffix: "+",
            },
          ],
          certifications: [
            {
              name: "ISO 9001:2015",
            },
            {
              name: "Bộ Y Tế",
            },
            {
              name: "American Dental Association",
            },
          ],
        },

        // 3. SERVICES SECTION
        {
          __component: "homepage.services",
          title: "Dịch vụ nha khoa chuyên nghiệp",
          items: [
            {
              title: "Cấy ghép Implant",
              description:
                "Phục hồi răng mất với công nghệ cấy ghép Implant hiện đại từ Mỹ. An toàn, bền vững, thẩm mỹ cao.",
            },
            {
              title: "Tẩy trắng răng",
              description:
                "Công nghệ Whitening Max - răng trắng sáng tự nhiên chỉ sau 60 phút. Hiệu quả lên đến 8-10 tông màu.",
            },
            {
              title: "Niềng răng Invisalign",
              description:
                "Chỉnh nha trong suốt, tháo lắp tiện lợi. Răng đều đẹp không cần mắc cài kim loại.",
            },
            {
              title: "Bọc răng sứ thẩm mỹ",
              description:
                "Răng sứ Cercon, Emax cao cấp. Màu sắc tự nhiên, độ bền 10+ năm. Bảo hành dài hạn.",
            },
            {
              title: "Nhổ răng khôn",
              description:
                "Công nghệ Piezosurgery - nhổ răng không đau, lành thương nhanh. Bác sĩ giàu kinh nghiệm.",
            },
            {
              title: "Điều trị tủy",
              description:
                "Công nghệ Rotary hiện đại. Không đau, hiệu quả cao, bảo tồn răng thật tối đa.",
            },
          ],
        },

        // 4. BEFORE/AFTER SECTION (HIGH PRIORITY)
        {
          __component: "homepage.before-after",
          title: "Kết quả điều trị thực tế",
          subtitle:
            "Hàng nghìn ca điều trị thành công với kết quả vượt mong đợi",
          cases: [
            {
              title: "Niềng răng Invisalign",
              description: "Chỉnh nha trong suốt - 18 tháng",
              treatment: "Invisalign",
            },
            {
              title: "Cấy ghép Implant",
              description: "Phục hồi răng mất - 6 tháng",
              treatment: "Implant",
            },
            {
              title: "Tẩy trắng răng",
              description: "Whitening Max - 60 phút",
              treatment: "Whitening",
            },
            {
              title: "Bọc răng sứ",
              description: "Răng sứ Emax - 2 tuần",
              treatment: "Veneer",
            },
          ],
        },

        // 5. PRICING SECTION
        {
          __component: "homepage.pricing",
          title: "Bảng giá minh bạch",
          subtitle:
            "Cam kết giá cả rõ ràng, không phát sinh chi phí. Hỗ trợ trả góp 0% lãi suất",
          plans: [
            {
              name: "Gói Cơ Bản",
              price: "2.000.000",
              period: "VNĐ",
              description: "Phù hợp cho khám và điều trị cơ bản",
              features: [
                { text: "Khám và tư vấn miễn phí", included: true },
                { text: "Chụp X-quang răng", included: true },
                { text: "Lấy cao răng", included: true },
                { text: "Trám răng sâu (1-2 răng)", included: true },
                { text: "Bảo hành 6 tháng", included: true },
                { text: "Tái khám miễn phí", included: false },
              ],
              is_popular: false,
              cta_label: "Đặt lịch ngay",
              cta_link: "/booking?plan=basic",
            },
            {
              name: "Gói Thẩm Mỹ",
              price: "15.000.000",
              period: "VNĐ",
              description: "Giải pháp toàn diện cho nụ cười hoàn hảo",
              features: [
                { text: "Tất cả dịch vụ gói Cơ Bản", included: true },
                { text: "Tẩy trắng răng Whitening Max", included: true },
                { text: "Bọc răng sứ (4-6 răng)", included: true },
                { text: "Thiết kế nụ cười 3D", included: true },
                { text: "Bảo hành 2 năm", included: true },
                { text: "Tái khám miễn phí trọn đời", included: true },
              ],
              is_popular: true,
              cta_label: "Tư vấn ngay",
              cta_link: "/booking?plan=aesthetic",
            },
            {
              name: "Gói Implant",
              price: "25.000.000",
              period: "VNĐ/răng",
              description: "Cấy ghép Implant cao cấp từ Mỹ",
              features: [
                { text: "Implant chính hãng từ Mỹ", included: true },
                { text: "Chụp CT Cone Beam 3D", included: true },
                { text: "Phẫu thuật cấy ghép", included: true },
                { text: "Răng sứ Emax cao cấp", included: true },
                { text: "Bảo hành 10 năm", included: true },
                { text: "Theo dõi trọn đời", included: true },
              ],
              is_popular: false,
              cta_label: "Tư vấn chi tiết",
              cta_link: "/booking?plan=implant",
            },
          ],
        },

        // 6. PROCESS SECTION
        {
          __component: "homepage.process",
          title: "Quy trình điều trị chuẩn quốc tế",
          subtitle:
            "4 bước đơn giản để có nụ cười hoàn hảo. Minh bạch, chuyên nghiệp, an toàn",
          steps: [
            {
              title: "Bước 1: Khám và tư vấn",
              description:
                "Bác sĩ thăm khám, chụp X-quang, phân tích tình trạng răng miệng. Tư vấn phương án điều trị phù hợp nhất.",
              icon: "consultation",
            },
            {
              title: "Bước 2: Lập kế hoạch",
              description:
                "Thiết kế phương án điều trị chi tiết, báo giá minh bạch. Mô phỏng kết quả 3D để bạn hình dung trước.",
              icon: "planning",
            },
            {
              title: "Bước 3: Thực hiện điều trị",
              description:
                "Tiến hành điều trị theo đúng kế hoạch. Sử dụng công nghệ hiện đại, quy trình vô trùng tuyệt đối.",
              icon: "treatment",
            },
            {
              title: "Bước 4: Theo dõi & bảo hành",
              description:
                "Tái khám định kỳ, theo dõi kết quả. Bảo hành dài hạn, hỗ trợ 24/7 khi cần thiết.",
              icon: "followup",
            },
          ],
        },

        // 7. DOCTOR SECTION
        {
          __component: "homepage.doctor",
          title: "Đội ngũ bác sĩ chuyên môn cao",
          subtitle:
            "Bác sĩ giàu kinh nghiệm, được đào tạo bài bản tại Việt Nam và quốc tế",
          doctors: [
            {
              name: "BS. Nguyễn Văn An",
              title: "Trưởng khoa Implant",
              specialization: "Chuyên gia cấy ghép Implant",
              bio: "Hơn 20 năm kinh nghiệm trong lĩnh vực cấy ghép Implant. Đào tạo tại Mỹ, chứng chỉ quốc tế ITI.",
              experience_years: 20,
            },
            {
              name: "BS. Trần Thị Bình",
              title: "Bác sĩ chỉnh nha",
              specialization: "Chuyên gia Invisalign",
              bio: "Chuyên sâu về chỉnh nha trong suốt Invisalign. Hơn 500 ca điều trị thành công.",
              experience_years: 15,
            },
            {
              name: "BS. Lê Minh Châu",
              title: "Bác sĩ thẩm mỹ",
              specialization: "Răng sứ thẩm mỹ",
              bio: "Chuyên gia về răng sứ thẩm mỹ và thiết kế nụ cười. Đào tạo tại Hàn Quốc.",
              experience_years: 12,
            },
            {
              name: "BS. Phạm Hoàng Dũng",
              title: "Phó trưởng khoa",
              specialization: "Nha khoa tổng quát",
              bio: "Bác sĩ đa khoa với kinh nghiệm điều trị toàn diện. Tận tâm với từng bệnh nhân.",
              experience_years: 18,
            },
          ],
        },

        // 8. TESTIMONIALS SECTION
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
            {
              name: "Chị Võ Thị Lan",
              content:
                "Nhổ răng khôn ở đây không đau như tôi tưởng. Bác sĩ rất nhẹ nhàng, công nghệ hiện đại. Sau nhổ lành thương rất nhanh. Giá cả hợp lý, dịch vụ tốt.",
              rating: 5,
            },
            {
              name: "Anh Đặng Quốc Việt",
              content:
                "Điều trị tủy răng ở đây không đau chút nào. Bác sĩ giải thích rất kỹ, tôi yên tâm hoàn toàn. Sau điều trị răng không còn đau, ăn uống bình thường. Cảm ơn bác sĩ!",
              rating: 5,
            },
          ],
        },

        // 9. FAQ SECTION
        {
          __component: "homepage.faq",
          title: "Câu hỏi thường gặp",
          subtitle: "Giải đáp những thắc mắc phổ biến về dịch vụ nha khoa",
          questions: [
            {
              question: "Cấy ghép Implant có đau không?",
              answer:
                "Quy trình cấy ghép Implant được thực hiện dưới gây tê cục bộ nên bạn hoàn toàn không cảm thấy đau. Sau khi hết thuốc tê có thể có chút khó chịu nhưng bác sĩ sẽ kê đơn thuốc giảm đau. Hầu hết bệnh nhân đều cảm thấy thoải mái sau 2-3 ngày.",
            },
            {
              question: "Niềng răng Invisalign mất bao lâu?",
              answer:
                "Thời gian niềng răng Invisalign phụ thuộc vào tình trạng răng của bạn. Trung bình từ 12-24 tháng. Trong quá trình điều trị, bạn sẽ được bác sĩ theo dõi và điều chỉnh định kỳ mỗi 4-6 tuần để đảm bảo kết quả tốt nhất.",
            },
            {
              question: "Tẩy trắng răng có hại men răng không?",
              answer:
                "Công nghệ tẩy trắng răng hiện đại tại phòng khám chúng tôi hoàn toàn an toàn, không làm hại men răng. Chúng tôi sử dụng gel tẩy trắng được FDA chứng nhận, nồng độ phù hợp. Sau tẩy trắng, bác sĩ sẽ hướng dẫn chăm sóc để duy trì kết quả lâu dài.",
            },
            {
              question: "Chi phí điều trị có thể trả góp không?",
              answer:
                "Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua các công ty tài chính uy tín. Thủ tục đơn giản, duyệt nhanh trong 30 phút. Bạn có thể trả góp từ 3-12 tháng tùy theo gói điều trị.",
            },
            {
              question: "Bảo hành dịch vụ như thế nào?",
              answer:
                "Mỗi dịch vụ có chính sách bảo hành riêng: Implant bảo hành 10 năm, răng sứ 5-10 năm, niềng răng bảo hành kết quả 2 năm. Trong thời gian bảo hành, nếu có vấn đề do lỗi kỹ thuật, chúng tôi sẽ xử lý miễn phí.",
            },
            {
              question: "Có cần đặt lịch trước không?",
              answer:
                "Để đảm bảo thời gian khám tốt nhất, chúng tôi khuyến khích bạn đặt lịch trước qua hotline, website hoặc fanpage. Tuy nhiên, chúng tôi vẫn tiếp nhận khách hàng đến trực tiếp trong giờ làm việc.",
            },
          ],
        },

        // 10. CTA SECTION
        {
          __component: "homepage.cta",
          text: "Sẵn sàng cho nụ cười hoàn hảo? Đặt lịch tư vấn miễn phí ngay hôm nay và nhận ưu đãi đặc biệt dành cho khách hàng mới!",
          button_label: "Đặt lịch tư vấn miễn phí",
          button_link: "/booking",
        },
      ],
    },
  };

  try {
    // Check if homepage exists
    let homepageExists = false;
    try {
      const existing = await apiRequest("/api/homepage");
      homepageExists = !!existing.data;
      console.log("   ℹ️  Homepage exists, updating with enhanced version...");
    } catch (error) {
      if (error.message.includes("404")) {
        console.log("   ℹ️  Homepage empty, creating enhanced version...");
      } else {
        throw error;
      }
    }

    // Update homepage (Single Types use PUT)
    await apiRequest("/api/homepage", "PUT", homepageData);
    console.log("   ✅ Enhanced homepage saved");

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

    return true;
  } catch (error) {
    console.error("   ❌ Failed to seed enhanced homepage:", error.message);
    throw error;
  }
}

/**
 * Verify data in database
 */
async function verifyData() {
  console.log("\n🔍 Verifying enhanced homepage data...");

  try {
    const homepage = await apiRequest(
      "/api/homepage?populate[layout][populate]=*",
    );

    if (!homepage.data) {
      console.log("   ⚠️  No homepage data found");
      return false;
    }

    console.log(`   ✅ Homepage title: ${homepage.data.title}`);
    console.log(`   ✅ Total blocks: ${homepage.data.layout?.length || 0}`);

    // Count block types
    const blockTypes = {};
    homepage.data.layout?.forEach((block) => {
      const type = block.__component?.split(".")[1] || "unknown";
      blockTypes[type] = (blockTypes[type] || 0) + 1;
    });

    console.log("\n   📊 Block breakdown:");
    Object.entries(blockTypes).forEach(([type, count]) => {
      console.log(`      • ${type}: ${count}x`);
    });

    // Verify critical sections
    const hasHero = blockTypes["hero"] >= 1;
    const hasTrust = blockTypes["trust"] >= 1;
    const hasBeforeAfter = blockTypes["before-after"] >= 1;
    const hasPricing = blockTypes["pricing"] >= 1;
    const hasFAQ = blockTypes["faq"] >= 1;

    console.log("\n   ✅ Critical sections:");
    console.log(`      • Hero: ${hasHero ? "✓" : "✗"}`);
    console.log(`      • Trust: ${hasTrust ? "✓" : "✗"}`);
    console.log(`      • Before/After: ${hasBeforeAfter ? "✓" : "✗"}`);
    console.log(`      • Pricing: ${hasPricing ? "✓" : "✗"}`);
    console.log(`      • FAQ: ${hasFAQ ? "✓" : "✗"}`);

    const allCriticalPresent =
      hasHero && hasTrust && hasBeforeAfter && hasPricing && hasFAQ;

    if (allCriticalPresent) {
      console.log("\n   ✅ All critical sections present");
      return true;
    } else {
      console.log("\n   ⚠️  Some critical sections missing");
      return false;
    }
  } catch (error) {
    console.error("   ❌ Verification failed:", error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║   MIGRATION 002: ENHANCE HOMEPAGE 2026                 ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log(`\n🌐 Strapi URL: ${STRAPI_URL}`);
  console.log("📅 Date:", new Date().toISOString());

  try {
    // Step 1: Seed data
    await seedEnhancedHomepage();

    // Step 2: Verify data
    const verified = await verifyData();

    if (verified) {
      console.log(
        "\n╔════════════════════════════════════════════════════════╗",
      );
      console.log("║   ✅ STATUS: DONE                                      ║");
      console.log("╚════════════════════════════════════════════════════════╝");
      console.log("\n📝 Next steps:");
      console.log("   1. ✅ Data verified in database");
      console.log("   2. 🎨 Ready for UI implementation");
      console.log("   3. 🚀 Proceed with frontend components");
    } else {
      console.log("\n⚠️  STATUS: PARTIAL - Some sections may be missing");
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedEnhancedHomepage, verifyData };
