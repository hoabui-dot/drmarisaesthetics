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

const servicePages = [
  {
    slug: "implant",
    title: "Cấy ghép Implant",
    titleEn: "Dental Implants",
    description:
      "Giải pháp phục hồi răng mất vĩnh viễn với công nghệ cấy ghép Implant hiện đại",
    content: `
# Cấy ghép Implant - Phục hồi răng mất hoàn hảo

## Implant là gì?

Implant là trụ titan được cấy vào xương hàm để thay thế chân răng đã mất, sau đó gắn răng sứ lên trên tạo thành răng hoàn chỉnh.

## Ưu điểm vượt trội

### 1. Bền vững
- Tuổi thọ 20-30 năm hoặc trọn đời
- Không ảnh hưởng răng thật bên cạnh
- Chắc chắn như răng thật

### 2. Thẩm mỹ tự nhiên
- Màu sắc giống răng thật
- Hình dáng tự nhiên
- Không lộ chân răng giả

### 3. Chức năng hoàn hảo
- Ăn nhai tốt như răng thật
- Không lung lay
- Bảo vệ xương hàm

## Quy trình cấy ghép

1. **Khám và chụp phim**: Đánh giá xương hàm
2. **Cấy trụ Implant**: Phẫu thuật nhỏ, gây tê tại chỗ
3. **Chờ liền xương**: 3-6 tháng
4. **Gắn răng sứ**: Hoàn thiện răng mới

## Chi phí

- **Implant Hàn Quốc**: 15-20 triệu/răng
- **Implant Mỹ/Đức**: 25-35 triệu/răng
- **Bảo hành**: 10 năm
    `,
  },
  {
    slug: "invisalign",
    title: "Niềng răng Invisalign",
    titleEn: "Invisalign Clear Aligners",
    description:
      "Chỉnh nha trong suốt hiện đại, thẩm mỹ cao không cần mắc cài kim loại",
    content: `
# Niềng răng Invisalign - Giải pháp chỉnh nha hiện đại

## Invisalign là gì?

Invisalign là công nghệ niềng răng trong suốt tiên tiến nhất hiện nay, sử dụng khay trong suốt để chỉnh nha thay vì mắc cài kim loại truyền thống.

## Ưu điểm của Invisalign

### 1. Thẩm mỹ cao
- Khay trong suốt, gần như vô hình
- Không ảnh hưởng đến giao tiếp và sinh hoạt hàng ngày
- Tự tin trong mọi hoàn cảnh

### 2. Thoải mái
- Không có dây kim loại gây đau
- Có thể tháo ra khi ăn uống
- Dễ dàng vệ sinh răng miệng

### 3. Hiệu quả
- Kết quả chính xác theo mô phỏng 3D
- Thời gian điều trị rõ ràng
- Theo dõi tiến độ dễ dàng

## Chi phí và thời gian

- **Thời gian điều trị**: 12-18 tháng (tùy ca)
- **Chi phí**: Từ 80-150 triệu VNĐ
- **Bảo hành**: 2 năm sau điều trị
    `,
  },
  {
    slug: "veneer",
    title: "Bọc răng sứ thẩm mỹ",
    titleEn: "Cosmetic Porcelain Crowns",
    description:
      "Răng sứ cao cấp, bền đẹp, màu sắc tự nhiên cho nụ cười hoàn hảo",
    content: `
# Bọc răng sứ thẩm mỹ - Nụ cười hoàn hảo

## Răng sứ thẩm mỹ là gì?

Răng sứ là giải pháp phục hồi và thẩm mỹ răng bằng cách bọc một lớp sứ lên bề mặt răng thật hoặc trụ implant.

## Các loại răng sứ

### 1. Răng sứ kim loại
- Giá thành phải chăng
- Độ bền cao
- Phù hợp răng hàm

### 2. Răng sứ toàn sứ
- Thẩm mỹ cao nhất
- Màu sắc tự nhiên
- Không gây kích ứng nướu

### 3. Răng sứ Zirconia
- Siêu bền, siêu đẹp
- Độ trong mờ như răng thật
- Giá cao nhất

## Bảng giá

- **Sứ kim loại**: 2-3 triệu/răng
- **Sứ toàn sứ**: 4-6 triệu/răng
- **Sứ Zirconia**: 8-12 triệu/răng
    `,
  },
  {
    slug: "whitening",
    title: "Tẩy trắng răng",
    titleEn: "Teeth Whitening",
    description:
      "Răng trắng sáng an toàn với công nghệ Laser Whitening hiện đại",
    content: `
# Tẩy trắng răng an toàn tại nha khoa

## Tẩy trắng răng là gì?

Tẩy trắng răng là phương pháp làm sáng màu răng bằng các chất tẩy trắng chuyên dụng, giúp răng trắng sáng hơn 2-8 tông màu.

## Các phương pháp tẩy trắng

### 1. Tẩy trắng tại phòng khám (In-office)
- Sử dụng đèn LED hoặc Laser
- Kết quả ngay sau 1 buổi
- Hiệu quả cao nhất
- Thời gian: 60-90 phút

### 2. Tẩy trắng tại nhà (At-home)
- Sử dụng khay tẩy trắng cá nhân
- Đeo khay 2-4 giờ/ngày
- Kết quả sau 2-3 tuần
- Tiện lợi, linh hoạt

## Hiệu quả và chi phí

- **Hiệu quả**: Trắng hơn 2-8 tông màu
- **Duy trì**: 1-3 năm (tùy chăm sóc)
- **Chi phí**: 2-5 triệu VNĐ
    `,
  },
];

async function createServicePages() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    const headers = { Authorization: `Bearer ${STRAPI_TOKEN}` };

    console.log("🔄 Creating service pages...\n");

    for (const service of servicePages) {
      console.log(`📄 Creating: ${service.title} (${service.slug})`);

      try {
        // Check if page already exists
        const checkResponse = await axios.get(
          `${STRAPI_URL}/api/pages?filters[slug][$eq]=${service.slug}`,
          { headers },
        );

        if (checkResponse.data.data && checkResponse.data.data.length > 0) {
          console.log(`   ⚠️  Page already exists, skipping...\n`);
          continue;
        }

        // Create page via API
        const response = await axios.post(
          `${STRAPI_URL}/api/pages`,
          {
            data: {
              title: service.title,
              slug: service.slug,
              description: service.description,
              content: service.content.trim(),
              publishedAt: new Date().toISOString(),
            },
          },
          { headers },
        );

        console.log(`   ✅ Created successfully\n`);
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
      }
    }

    // Verify pages
    console.log("🔍 Verifying created pages...\n");
    const verifyResponse = await axios.get(
      `${STRAPI_URL}/api/pages?filters[slug][$in]=${servicePages.map((s) => s.slug).join(",")}&populate=*`,
      { headers },
    );

    console.log(
      `✅ Found ${verifyResponse.data.data?.length || 0} service pages\n`,
    );
    verifyResponse.data.data?.forEach((page) => {
      console.log(`- ${page.title} (/${page.slug})`);
    });

    console.log("\n✅ Migration completed successfully!");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (error.response) {
      console.error("API Error:", JSON.stringify(error.response.data, null, 2));
    }
    await client.end();
    process.exit(1);
  }
}

createServicePages();
