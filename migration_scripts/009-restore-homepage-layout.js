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

async function restoreHomepageLayout() {
  try {
    console.log("🚀 Starting restoration: Homepage layout...\n");

    // Fetch current homepage
    console.log("📥 Fetching current homepage...");
    const response = await api.get("/api/homepage", {
      params: {
        "populate[layout][on][homepage.pricing][populate][plans][populate]":
          "features",
      },
    });

    const homepage = response.data.data;
    const currentLayout = homepage.layout || [];

    console.log(`Current layout blocks: ${currentLayout.length}`);

    if (currentLayout.length <= 1) {
      console.log(
        "\n⚠️  Homepage layout is incomplete! Restoring full layout...\n",
      );

      // Restore full homepage layout with all sections
      const fullLayout = [
        {
          __component: "homepage.video-hero",
          title: "Nụ cười rạng rỡ, tự tin tỏa sáng",
          subtitle:
            "Chăm sóc nha khoa cao cấp với công nghệ hiện đại và đội ngũ bác sĩ giàu kinh nghiệm",
          ctaText: "Đặt lịch ngay",
          ctaLink: "/booking",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          overlayOpacity: 0.4,
          isActive: true,
        },
        {
          __component: "homepage.trust",
          title: "Được tin tưởng bởi hàng nghìn khách hàng",
          subtitle: "Chất lượng dịch vụ được chứng nhận",
          stats: [
            {
              id: 1,
              number: "10000",
              label: "Khách hàng hài lòng",
              suffix: "+",
            },
            { id: 2, number: "15", label: "Năm kinh nghiệm", suffix: "+" },
            { id: 3, number: "50", label: "Bác sĩ chuyên khoa", suffix: "+" },
            { id: 4, number: "98", label: "Tỷ lệ thành công", suffix: "%" },
          ],
          certifications: [],
        },
        {
          __component: "homepage.services",
          title: "Dịch vụ nha khoa toàn diện",
          items: [
            {
              id: 1,
              title: "Cấy ghép Implant",
              description:
                "Phục hồi răng mất với công nghệ cấy ghép hiện đại, tự nhiên như răng thật",
            },
            {
              id: 2,
              title: "Niềng răng Invisalign",
              description: "Chỉnh nha trong suốt, thoải mái và hiệu quả cao",
            },
            {
              id: 3,
              title: "Bọc răng sứ thẩm mỹ",
              description: "Răng sứ cao cấp, bền đẹp, màu sắc tự nhiên",
            },
            {
              id: 4,
              title: "Tẩy trắng răng",
              description:
                "Răng trắng sáng an toàn với công nghệ Laser Whitening",
            },
          ],
        },
        {
          __component: "homepage.before-after",
          title: "Kết quả thực tế, nụ cười thực sự",
          subtitle: "Xem những thay đổi mà chúng tôi đã tạo ra cho bệnh nhân",
          cases: [],
        },
        {
          __component: "homepage.process",
          title: "Quy trình điều trị chuyên nghiệp",
          subtitle: "Từ tư vấn đến hoàn thiện",
          steps: [
            {
              id: 1,
              title: "Tư vấn & Khám",
              description:
                "Bác sĩ thăm khám và tư vấn phương án điều trị phù hợp",
              icon: "1",
            },
            {
              id: 2,
              title: "Lập kế hoạch",
              description:
                "Xây dựng kế hoạch điều trị chi tiết và báo giá minh bạch",
              icon: "2",
            },
            {
              id: 3,
              title: "Thực hiện",
              description: "Tiến hành điều trị với công nghệ hiện đại",
              icon: "3",
            },
            {
              id: 4,
              title: "Theo dõi",
              description: "Chăm sóc và theo dõi sau điều trị",
              icon: "4",
            },
          ],
        },
        {
          __component: "homepage.doctor",
          title: "Đội ngũ bác sĩ giàu kinh nghiệm",
          subtitle: "Chuyên gia hàng đầu trong lĩnh vực nha khoa",
          doctors: [],
        },
        {
          __component: "homepage.pricing",
          title: "Bảng giá minh bạch",
          subtitle: "Chọn gói phù hợp với nhu cầu chăm sóc nha khoa của bạn",
          plans: [
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
          ],
        },
        {
          __component: "homepage.testimonials",
          title: "Khách hàng nói gì về chúng tôi",
          items: [],
        },
        {
          __component: "homepage.faq",
          title: "Câu hỏi thường gặp",
          subtitle: "Mọi thứ bạn cần biết về dịch vụ của chúng tôi",
          questions: [],
        },
        {
          __component: "homepage.cta",
          text: "Sẵn sàng cho nụ cười rạng rỡ?",
          button_label: "Đặt lịch tư vấn miễn phí",
          button_link: "/booking",
        },
      ];

      await api.put("/api/homepage", {
        data: {
          layout: fullLayout,
        },
      });

      console.log("✅ Homepage layout restored successfully!");
      console.log(`📋 Restored ${fullLayout.length} sections`);
    } else {
      console.log("✅ Homepage layout is intact");
      console.log("📋 Current sections:");
      currentLayout.forEach((block, index) => {
        const type = block.__component.split(".")[1];
        console.log(`   ${index + 1}. ${type}`);
      });
    }

    console.log("\n✅ Restoration complete!");
  } catch (error) {
    console.error(
      "❌ Restoration failed:",
      error.response?.data || error.message,
    );
    process.exit(1);
  }
}

restoreHomepageLayout();
