Đã kiểm tra production read-only, chưa restart/rebuild hay thay đổi dữ liệu.

Kết quả chính:

- Frontend container: unhealthy, failing streak 2873
- Origin 127.0.0.1:2234/: HTTP 500
- Public /: HTTP 500
- /about-us, /services, /news, /contact, /results: HTTP 200
- Strapi: healthy
- PostgreSQL: healthy
- /robots.txt: HTTP 200
- /sitemap.xml: HTTP 200
- /page-sitemap.xml: HTTP 200, có liệt kê /
- /news-sitemap.xml: HTTP 404, không có URL bài viết đủ điều kiện

Nguyên nhân homepage đã được xác định trong frontend bundle:

TypeError: Cannot read properties of undefined
(reading '__NEXT_PRIVATE_MINIMIZE_MACRO_FALSE')
at .next/server/chunks/4800.js:1:31842

Trong StitchAestheticPage.tsx (dental-frontend/src/components/StitchAestheticPage.tsx:49), có biến:

const process = [...]

Next.js compiler tạo internal guard:

G.env.__NEXT_PRIVATE_MINIMIZE_MACRO_FALSE

Trong bundle, G chính là biến process local dạng array, nên G.env là undefined. Đây là nguyên nhân trực tiếp làm route / render HTTP 500. API CMS vẫn hoạt động:

- Homepage API: 200
- Results API: 200
- Homepage có sections và video stories hợp lệ

HTML homepage lỗi chứa noindex; đồng thời metadata lỗi vẫn có index, follow. Đây là hậu quả của error document, không phải nguyên nhân robots.

Cloudflare không chặn trong lần kiểm tra này: request với Mozilla, Googlebot và Google-InspectionTool đều nhận / HTTP 500, /robots.txt HTTP 200. Cloudflare Security Events vẫn cần kiểm tra riêng trên dashboard vì không thể xác nhận qua SSH.

Analytics trên các trang 200 đang có Google Measurement ID G-RHDCNF8W7B. Homepage chưa thể xác thực tag đầy đủ do render 500.
