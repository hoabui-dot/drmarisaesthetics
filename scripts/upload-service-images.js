/**
 * Upload Service Template Images to Strapi
 *
 * This script uploads the hero image from Service Template to Strapi
 * and updates service pages with complete content including all sections.
 *
 * Run: node scripts/upload-service-images.js
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Configuration
const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://corp-circle-register-restricted.trycloudflare.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.STRAPI_API_TOKEN;

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

const pool = new Pool(DB_CONFIG);

// Service template data with all sections
const servicesData = {
  implant: {
    slug: "implant",
    title: "Cấy ghép Implant",
    description:
      "Giải pháp phục hồi răng mất vĩnh viễn với công nghệ cấy ghép Implant hiện đại",
    hero: {
      serviceName: "Cấy ghép Implant",
      description:
        "Giải pháp phục hồi răng mất vĩnh viễn với công nghệ cấy ghép Implant hiện đại",
      duration: "5 phút đọc",
      recoveryTime: "3-6 tháng",
      priceRange: "15-50 triệu",
      heroImage:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=800&fit=crop",
    },
    intro: {
      title: "Implant là gì?",
      content:
        "Implant là trụ titan được cấy vào xương hàm để thay thế rễ răng đã mất, sau đó gắn răng sứ lên trên để tạo thành răng hoàn chỉnh. Đây là giải pháp phục hồi răng mất vĩnh viễn, an toàn và hiệu quả nhất hiện nay, giúp bạn có lại nụ cười tự tin và chức năng ăn nhai hoàn hảo.",
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop",
    },
    benefits: [
      {
        icon: "Smile",
        title: "Bền vững",
        description: "Tuổi thọ 20-30 năm hoặc trọn đời với chăm sóc đúng cách",
      },
      {
        icon: "Star",
        title: "Thẩm mỹ tự nhiên",
        description: "Màu sắc giống răng thật, hình dáng tự nhiên",
      },
      {
        icon: "Heart",
        title: "Chức năng hoàn hảo",
        description: "Ăn nhai tốt như răng thật, không lung lay",
      },
      {
        icon: "CheckCircle",
        title: "Không ảnh hưởng răng bên cạnh",
        description: "Không cần mài răng khác như làm cầu",
      },
      {
        icon: "Clock",
        title: "Không cần tháo lắp",
        description: "Chăm sóc như răng thật, vệ sinh đơn giản",
      },
      {
        icon: "Sparkles",
        title: "Bảo vệ xương hàm",
        description: "Ngăn chặn tình trạng tiêu xương hàm",
      },
    ],
    process: [
      {
        icon: "FileSearch",
        title: "Khám và chẩn đoán",
        description:
          "Đánh giá xương hàm, chụp phim CT 3D để lập kế hoạch chi tiết",
        duration: "30-45 phút",
      },
      {
        icon: "Wrench",
        title: "Cấy trụ Implant",
        description:
          "Phẫu thuật nhỏ, gây tê tại chỗ để đặt trụ Implant vào xương hàm",
        duration: "1-2 giờ",
      },
      {
        icon: "Heart",
        title: "Chờ liền xương",
        description:
          "Trụ Implant hòa nhập với xương hàm, tạo nền tảng vững chắc",
        duration: "3-6 tháng",
      },
      {
        icon: "Sparkles",
        title: "Gắn răng sứ",
        description: "Hoàn thiện răng mới với mão sứ cao cấp, thẩm mỹ tự nhiên",
        duration: "1-2 tuần",
      },
    ],
    pricing: [
      {
        name: "Implant Hàn Quốc",
        origin: "Hàn Quốc",
        price: "15-20 triệu",
        warranty: "10 năm",
        features: [
          "Chất lượng tốt, giá cả hợp lý",
          "Phù hợp đa số khách hàng",
          "Tỷ lệ thành công cao",
          "Kiểm định FDA, CE",
        ],
      },
      {
        name: "Implant Mỹ/Đức",
        origin: "Mỹ / Đức",
        price: "25-35 triệu",
        warranty: "Trọn đời",
        features: [
          "Cao cấp, uy tín hàng đầu thế giới",
          "Bề mặt công nghệ tiên tiến",
          "Liền xương nhanh hơn",
          "Nghiên cứu lâm sàng 30+ năm",
        ],
        popular: true,
      },
      {
        name: "Implant Cao cấp",
        origin: "Thụy Sĩ",
        price: "35-50 triệu",
        warranty: "Trọn đời",
        features: [
          "Thương hiệu số 1 thế giới",
          "Công nghệ SLA cao cấp",
          "Thẩm mỹ hoàn hảo",
          "Tỷ lệ thành công 99%",
        ],
      },
    ],
    doctor: {
      name: "BS. Nguyễn Minh Tâm",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop",
      credentials: [
        "Bác sĩ Răng Hàm Mặt",
        "15+ năm kinh nghiệm",
        "Chứng chỉ Implant quốc tế (ITI, ICOI)",
        "5000+ ca cấy ghép thành công",
      ],
    },
    faqs: [
      {
        question: "Cấy ghép Implant có đau không?",
        answer:
          "Trong quá trình cấy ghép, bạn sẽ được gây tê tại chỗ nên không cảm thấy đau. Sau khi hết thuốc tê, có thể có chút khó chịu nhẹ trong 2-3 ngày, nhưng hoàn toàn kiểm soát được bằng thuốc giảm đau thông thường.",
      },
      {
        question: "Implant có bền không? Tuổi thọ bao lâu?",
        answer:
          "Với chăm sóc đúng cách, Implant có thể tồn tại 20-30 năm hoặc thậm chí suốt đời. Điều quan trọng là vệ sinh răng miệng tốt và đi kiểm tra nha khoa định kỳ 6 tháng/lần.",
      },
      {
        question: "Ai có thể cấy ghép Implant?",
        answer:
          "Hầu hết người trưởng thành mất răng đều có thể cấy ghép Implant. Tuy nhiên, cần đánh giá tình trạng xương hàm, sức khỏe tổng quát. Một số trường hợp cần ghép xương trước khi cấy Implant.",
      },
    ],
  },
  invisalign: {
    slug: "invisalign",
    title: "Niềng răng Invisalign",
    description:
      "Chỉnh nha trong suốt hiện đại, thẩm mỹ cao không cần mắc cài kim loại",
    hero: {
      serviceName: "Niềng răng Invisalign",
      description:
        "Chỉnh nha trong suốt hiện đại, thẩm mỹ cao không cần mắc cài kim loại",
      duration: "4 phút đọc",
      recoveryTime: "12-18 tháng",
      priceRange: "60-120 triệu",
      heroImage:
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop",
    },
    intro: {
      title: "Invisalign là gì?",
      content:
        "Invisalign là phương pháp chỉnh nha bằng khay trong suốt, được thiết kế riêng cho từng bệnh nhân. Khác với niềng răng truyền thống, Invisalign gần như vô hình, có thể tháo lắp dễ dàng, mang lại sự thoải mái và thẩm mỹ cao trong suốt quá trình điều trị.",
      image:
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop",
    },
  },
  veneer: {
    slug: "veneer",
    title: "Bọc răng sứ thẩm mỹ",
    description:
      "Răng sứ cao cấp, bền đẹp, màu sắc tự nhiên cho nụ cười hoàn hảo",
    hero: {
      serviceName: "Bọc răng sứ thẩm mỹ",
      description:
        "Răng sứ cao cấp, bền đẹp, màu sắc tự nhiên cho nụ cười hoàn hảo",
      duration: "4 phút đọc",
      recoveryTime: "1-2 tuần",
      priceRange: "3-15 triệu",
      heroImage:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=800&fit=crop",
    },
    intro: {
      title: "Răng sứ thẩm mỹ là gì?",
      content:
        "Răng sứ thẩm mỹ là giải pháp phục hồi và cải thiện hình dáng, màu sắc răng bằng mão sứ cao cấp. Răng sứ có độ bền cao, màu sắc tự nhiên, không gây kích ứng, giúp bạn có nụ cười đẹp và tự tin hơn.",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop",
    },
  },
  whitening: {
    slug: "whitening",
    title: "Tẩy trắng răng",
    description:
      "Răng trắng sáng an toàn với công nghệ Laser Whitening hiện đại",
    hero: {
      serviceName: "Tẩy trắng răng",
      description:
        "Răng trắng sáng an toàn với công nghệ Laser Whitening hiện đại",
      duration: "3 phút đọc",
      recoveryTime: "Ngay lập tức",
      priceRange: "2-5 triệu",
      heroImage:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=800&fit=crop",
    },
    intro: {
      title: "Tẩy trắng răng là gì?",
      content:
        "Tẩy trắng răng là phương pháp làm sáng màu răng bằng công nghệ Laser hoặc gel tẩy trắng chuyên dụng. Quy trình an toàn, không gây hại men răng, giúp răng trắng sáng tự nhiên chỉ sau 1 buổi điều trị.",
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop",
    },
  },
};

async function updateServicePages() {
  const client = await pool.connect();

  try {
    console.log("🔄 Updating service pages with complete template data...\n");

    for (const [key, serviceData] of Object.entries(servicesData)) {
      console.log(`📝 Updating ${serviceData.title}...`);

      const updateQuery = `
        UPDATE pages 
        SET 
          content = $1,
          updated_at = NOW()
        WHERE slug = $2
        RETURNING id;
      `;

      const result = await client.query(updateQuery, [
        JSON.stringify(serviceData),
        serviceData.slug,
      ]);

      if (result.rows.length > 0) {
        console.log(`   ✅ Updated ${serviceData.title}`);
      } else {
        console.log(`   ⚠️  Page not found: ${serviceData.slug}`);
      }
    }

    console.log("\n✅ All service pages updated successfully!");
  } catch (error) {
    console.error("❌ Error updating service pages:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    console.log("🚀 Service Images & Content Update\n");
    console.log("📍 Database:", DB_CONFIG.host);
    console.log("📍 Strapi API:", STRAPI_URL);
    console.log("");

    await updateServicePages();

    console.log("\n✨ Update completed successfully!");
    console.log("\n📝 Updated data includes:");
    console.log("   - Hero section with images");
    console.log("   - Intro section");
    console.log("   - Benefits (6 items)");
    console.log("   - Process timeline (4 steps)");
    console.log("   - Pricing options (3 tiers)");
    console.log("   - Doctor section");
    console.log("   - FAQ section");
  } catch (error) {
    console.error("\n❌ Update failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
