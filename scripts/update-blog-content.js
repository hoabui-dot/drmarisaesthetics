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

const blogContents = {
  "nieng-rang-invisalign": `
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

## Quy trình điều trị

1. **Tư vấn và khám**: Bác sĩ đánh giá tình trạng răng và tư vấn phương án
2. **Chụp phim và lấy dấu**: Tạo mô hình 3D chính xác
3. **Lập kế hoạch**: Thiết kế khay niềng theo từng giai đoạn
4. **Bắt đầu điều trị**: Đeo khay theo hướng dẫn
5. **Theo dõi định kỳ**: Kiểm tra tiến độ mỗi 4-6 tuần

## Chi phí và thời gian

- **Thời gian điều trị**: 12-18 tháng (tùy ca)
- **Chi phí**: Từ 80-150 triệu VNĐ
- **Bảo hành**: 2 năm sau điều trị

## Liên hệ tư vấn

Đặt lịch tư vấn miễn phí để được bác sĩ đánh giá và tư vấn phương án phù hợp nhất.
`,
  "cay-ghep-implant": `
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

## Ai phù hợp với Implant?

- Mất 1 hoặc nhiều răng
- Xương hàm đủ dày và chắc khỏe
- Sức khỏe tổng quát tốt
- Không có bệnh lý răng miệng nghiêm trọng

## Chi phí

- **Implant Hàn Quốc**: 15-20 triệu/răng
- **Implant Mỹ/Đức**: 25-35 triệu/răng
- **Bảo hành**: 10 năm

Liên hệ để được tư vấn chi tiết và báo giá chính xác.
`,
  "boc-rang-su-tham-my": `
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

## Trường hợp nên bọc răng sứ

- Răng ố vàng không thể tẩy trắng
- Răng mẻ, sứt
- Răng thưa, lệch lạc nhẹ
- Răng đã điều trị tủy
- Muốn cải thiện thẩm mỹ nụ cười

## Quy trình bọc răng sứ

1. **Tư vấn và lựa chọn màu sắc**
2. **Mài răng**: Tạo không gian cho răng sứ
3. **Lấy dấu**: Tạo mẫu răng chính xác
4. **Gắn răng tạm**: Trong khi chờ làm răng sứ
5. **Gắn răng sứ chính thức**: Sau 5-7 ngày

## Chăm sóc răng sứ

- Vệ sinh răng miệng đúng cách
- Tránh cắn đồ cứng
- Khám định kỳ 6 tháng/lần
- Tuổi thọ: 10-20 năm

## Bảng giá

- **Sứ kim loại**: 2-3 triệu/răng
- **Sứ toàn sứ**: 4-6 triệu/răng
- **Sứ Zirconia**: 8-12 triệu/răng

Đặt lịch tư vấn để được bác sĩ thăm khám và tư vấn loại răng sứ phù hợp.
`,
  "tay-trang-rang-an-toan": `
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

### 3. Kết hợp cả hai
- Hiệu quả tối ưu
- Duy trì lâu dài
- Được khuyên dùng nhất

## Ai phù hợp tẩy trắng răng?

✅ **Phù hợp:**
- Răng ố vàng do tuổi tác
- Răng bị nhuộm màu do thực phẩm
- Răng bị ố do thuốc lá, cà phê

❌ **Không phù hợp:**
- Răng nhạy cảm nặng
- Phụ nữ mang thai, cho con bú
- Răng có nhiều trám, răng sứ
- Bệnh lý nướu răng

## Quy trình tẩy trắng

1. **Khám và vệ sinh răng**: Loại bỏ cao răng
2. **Bảo vệ nướu**: Phủ gel bảo vệ
3. **Thoa gel tẩy trắng**: Lên bề mặt răng
4. **Chiếu đèn**: Kích hoạt gel (15-20 phút)
5. **Lặp lại**: 2-3 lần trong 1 buổi

## Chăm sóc sau tẩy trắng

- Tránh thực phẩm có màu trong 48h đầu
- Không hút thuốc
- Vệ sinh răng miệng đúng cách
- Sử dụng kem đánh răng cho răng nhạy cảm

## Hiệu quả và chi phí

- **Hiệu quả**: Trắng hơn 2-8 tông màu
- **Duy trì**: 1-3 năm (tùy chăm sóc)
- **Chi phí**: 2-5 triệu VNĐ

Đặt lịch tư vấn miễn phí để được bác sĩ đánh giá và tư vấn phương pháp phù hợp.
`,
  "cham-soc-rang-mieng-tre-em": `
# Chăm sóc răng miệng cho trẻ em

## Tầm quan trọng

Chăm sóc răng miệng từ nhỏ giúp trẻ:
- Có hàm răng khỏe mạnh
- Phát triển tốt về thể chất và tinh thần
- Tránh các bệnh lý răng miệng
- Hình thành thói quen tốt

## Các giai đoạn chăm sóc

### 0-6 tháng tuổi
- Lau nướu bằng gạc ẩm sau mỗi bữa
- Không cho bú đêm kéo dài
- Không cho ti giả có đường

### 6 tháng - 2 tuổi
- Bắt đầu đánh răng khi răng mọc
- Dùng bàn chải mềm, kem đánh răng không fluoride
- Đánh răng 2 lần/ngày

### 2-6 tuổi
- Dùng kem đánh răng có fluoride (hạt đậu)
- Hướng dẫn trẻ đánh răng đúng cách
- Khám nha khoa định kỳ 6 tháng/lần

### Trên 6 tuổi
- Trẻ tự đánh răng, bố mẹ giám sát
- Sử dụng chỉ nha khoa
- Bọc răng hàm nếu cần

## Các vấn đề thường gặp

### 1. Sâu răng sữa
- **Nguyên nhân**: Ăn nhiều đường, vệ sinh kém
- **Xử lý**: Trám răng, điều trị tủy nếu cần
- **Phòng ngừa**: Hạn chế đường, đánh răng đúng cách

### 2. Răng mọc lệch
- **Nguyên nhân**: Di truyền, thói quen xấu
- **Xử lý**: Niềng răng khi đủ tuổi
- **Phòng ngừa**: Bỏ ti giả sớm, không mút tay

### 3. Viêm nướu
- **Nguyên nhân**: Vệ sinh kém
- **Xử lý**: Vệ sinh răng miệng, súc miệng nước muối
- **Phòng ngừa**: Đánh răng đúng cách

## Lời khuyên cho bố mẹ

1. **Làm gương**: Trẻ học theo bố mẹ
2. **Tạo thói quen**: Đánh răng cùng giờ mỗi ngày
3. **Khuyến khích**: Khen ngợi khi trẻ làm tốt
4. **Khám định kỳ**: 6 tháng/lần từ khi có răng đầu tiên
5. **Chế độ ăn**: Hạn chế đường, nhiều rau xanh

## Dịch vụ nha khoa trẻ em

- Khám và tư vấn
- Bôi fluoride phòng sâu răng
- Trám răng sữa
- Nhổ răng sữa
- Niềng răng trẻ em

Đặt lịch khám để bác sĩ tư vấn chăm sóc răng miệng cho bé.
`,
  "nho-rang-khon-an-toan": `
# Nhổ răng khôn an toàn không đau

## Răng khôn là gì?

Răng khôn là 4 răng hàm cuối cùng mọc ở góc hàm, thường xuất hiện từ 17-25 tuổi. Nhiều trường hợp răng khôn mọc lệch, mọc ngầm gây đau và viêm nhiễm.

## Khi nào cần nhổ răng khôn?

### Dấu hiệu cần nhổ:
- Răng khôn mọc lệch, đâm vào răng bên cạnh
- Răng khôn mọc ngầm trong nướu
- Viêm nướu quanh răng khôn thường xuyên
- Sâu răng khôn không thể trám
- Đau nhức kéo dài

### Không cần nhổ khi:
- Răng khôn mọc thẳng, đủ chỗ
- Không gây đau hay viêm nhiễm
- Có thể vệ sinh tốt

## Quy trình nhổ răng khôn

### 1. Khám và chụp phim
- Đánh giá vị trí răng khôn
- Xác định độ khó
- Lên kế hoạch nhổ răng

### 2. Gây tê
- Gây tê tại chỗ
- Không đau trong quá trình nhổ
- Có thể gây mê nếu cần

### 3. Nhổ răng
- Rạch nướu nếu răng mọc ngầm
- Tách răng thành nhiều phần nếu cần
- Lấy răng ra nhẹ nhàng
- Thời gian: 15-45 phút

### 4. Khâu vết thương
- Khâu nướu lại
- Cắn gạc cầm máu
- Hướng dẫn chăm sóc

## Chăm sóc sau nhổ răng

### Ngày đầu:
- Cắn gạc 30-45 phút
- Không súc miệng mạnh
- Không hút thuốc
- Ăn mềm, lạnh

### 2-7 ngày sau:
- Súc miệng nước muối nhẹ nhàng
- Uống thuốc theo đơn
- Vệ sinh răng miệng nhẹ nhàng
- Tránh thức ăn cứng

### Khi nào cần tái khám?
- Đau nhiều không giảm
- Sưng nề tăng sau 3 ngày
- Chảy máu nhiều
- Sốt cao

## Công nghệ hiện đại

- **Máy siêu âm Piezosurgery**: Nhổ răng nhẹ nhàng, ít chấn thương
- **Gây tê không đau**: Máy gây tê tự động
- **Chụp CT 3D**: Đánh giá chính xác vị trí răng

## Chi phí

- **Răng khôn mọc thẳng**: 500.000 - 1.000.000đ
- **Răng khôn mọc lệch**: 1.500.000 - 3.000.000đ
- **Răng khôn mọc ngầm**: 3.000.000 - 5.000.000đ

Đặt lịch khám để bác sĩ đánh giá và tư vấn phương án phù hợp.
`,
};

async function updateBlogContent() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    const headers = { Authorization: `Bearer ${STRAPI_TOKEN}` };

    // Get all blogs
    console.log("\n🔍 Fetching all blogs...");
    const response = await axios.get(`${STRAPI_URL}/api/blogs?populate=*`, {
      headers,
    });

    const blogs = response.data.data;
    console.log(`📊 Found ${blogs.length} blogs\n`);

    // Update each blog with rich content
    for (const blog of blogs) {
      const slug = blog.slug;
      const content = blogContents[slug];

      if (!content) {
        console.log(`⚠️  No content template for: ${slug}`);
        continue;
      }

      console.log(`🔄 Updating: ${blog.title}`);

      try {
        await axios.put(
          `${STRAPI_URL}/api/blogs/${blog.documentId}`,
          {
            data: {
              content: content.trim(),
            },
          },
          { headers },
        );
        console.log(`✅ Updated: ${slug}`);
      } catch (error) {
        console.error(`❌ Failed to update ${slug}:`, error.message);
      }
    }

    console.log("\n✅ All blogs updated successfully!");
    await client.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    await client.end();
    process.exit(1);
  }
}

updateBlogContent();
