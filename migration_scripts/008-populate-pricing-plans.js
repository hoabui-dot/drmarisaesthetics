const axios = require("axios");

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error("❌ STRAPI_API_TOKEN not found in environment");
  process.exit(1);
}

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const pricingPlans = [
  {
    name: "Chăm sóc cơ bản",
    price: "2.500.000đ",
    period: "mỗi lần khám",
    description: "Chăm sóc nha khoa thiết yếu cho sức khỏe hàng ngày",
    features: [
      { text: "Khám tổng quát toàn diện", included: true },
      { text: "Vệ sinh răng miệng chuyên nghiệp", included: true },
      { text: "Chụp X-quang kỹ thuật số", included: true },
      { text: "Tư vấn sức khỏe răng miệng", included: true },
      { text: "Điều trị Fluoride cơ bản", included: true },
    ],
    is_popular: false,
    cta_label: "Chọn gói",
    cta_link: "/booking",
  },
  {
    name: "Chăm sóc cao cấp",
    price: "7.500.000đ",
    period: "mỗi tháng",
    description: "Bảo hiểm toàn diện cho sức khỏe răng miệng tối ưu",
    features: [
      { text: "Tất cả dịch vụ gói Cơ bản", included: true },
      { text: "Khám cấp cứu không giới hạn", included: true },
      { text: "Điều trị tẩy trắng nâng cao", included: true },
      { text: "Bảo dưỡng nha chu", included: true },
      { text: "Ưu tiên đặt lịch", included: true },
      { text: "Giảm 20% thủ thuật thẩm mỹ", included: true },
    ],
    is_popular: true,
    cta_label: "Chọn gói",
    cta_link: "/booking",
  },
  {
    name: "Thay đổi nụ cười",
    price: "Tùy chỉnh",
    period: "theo phương án điều trị",
    description: "Nâng cấp thẩm mỹ toàn diện",
    features: [
      { text: "Đánh giá nụ cười đầy đủ", included: true },
      { text: "Kế hoạch điều trị tùy chỉnh", included: true },
      { text: "Veneer & Mão răng", included: true },
      { text: "Các lựa chọn chỉnh nha", included: true },
      { text: "Giải pháp cấy ghép", included: true },
      { text: "Dịch vụ VIP Concierge", included: true },
    ],
    is_popular: false,
    cta_label: "Nhận tư vấn",
    cta_link: "/contact",
  },
];

async function populatePricingPlans() {
  try {
    console.log("🚀 Starting migration: Populate pricing plans...\n");

    // Fetch homepage
    console.log("📥 Fetching homepage data...");
    const homepageResponse = await api.get("/api/homepage", {
      params: {
        "populate[layout][on][homepage.pricing][populate][plans][populate]":
          "features",
      },
    });

    if (!homepageResponse.data?.data) {
      console.log("❌ No homepage found");
      return;
    }

    const homepage = homepageResponse.data.data;
    const layout = homepage.layout || [];

    // Find pricing section
    const pricingIndex = layout.findIndex(
      (block) => block.__component === "homepage.pricing",
    );

    if (pricingIndex === -1) {
      console.log("⚠️  No pricing section found in homepage");
      console.log("💡 Please add a Pricing section in Strapi Admin first");
      return;
    }

    const pricingSection = layout[pricingIndex];
    console.log(`✅ Found pricing section: "${pricingSection.title}"\n`);

    // Update pricing section with new plans
    const updatedLayout = [...layout];
    updatedLayout[pricingIndex] = {
      __component: "homepage.pricing",
      title: pricingSection.title,
      subtitle: pricingSection.subtitle,
      plans: pricingPlans,
    };

    console.log("📝 Updating homepage with pricing plans...");
    await api.put("/api/homepage", {
      data: {
        layout: updatedLayout,
      },
    });

    console.log("✅ Successfully populated pricing plans!\n");
    console.log("📋 Added plans:");
    pricingPlans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.name} - ${plan.price}`);
      console.log(`      Features: ${plan.features.length}`);
      console.log(`      Popular: ${plan.is_popular ? "⭐ Yes" : "No"}`);
    });

    console.log("\n✅ Migration complete!");
  } catch (error) {
    console.error(
      "❌ Migration failed:",
      error.response?.data || error.message,
    );
    process.exit(1);
  }
}

populatePricingPlans();
