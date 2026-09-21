# Sitemap Implementation Report

**Ngày cập nhật:** 20/09/2026  
**Phạm vi:** sitemap của Strapi CMS, SEO Manager và `dental-frontend` (Next.js)

## 1. Tóm tắt

Sitemap hiện có một luồng dữ liệu chính: Strapi tổng hợp URL và chính sách đưa URL vào sitemap; Next.js công khai XML sitemap có XSL browser view và `robots.txt`. Sitemap không còn được tạo song song bởi Webtools.

```text
Strapi documents + SEO settings + redirects
                    ↓
         src/lib/sitemap.js (URL registry / rules)
                    ↓
            GET /api/seo/sitemap
       (route registry + sitemapKey)
           ↙       ↓       ↘
 service XML   news XML   page XML
           ↘       ↓       ↙
         /sitemap.xml index (XSL browser view)
               /robots.txt

Robots settings → GET /api/seo/robots → Next.js /robots.txt
```

Đây là sitemap động; không cần thao tác thủ công để sinh lại XML. CMS content và các cấu hình liên quan được đồng bộ bằng cache tag và webhook revalidation.

## 2. Phiên bản và lựa chọn kiến trúc

- Strapi: `5.40.0`.
- Next.js: `15.4.11`.
- `strapi-plugin-webtools` `1.4.0` vẫn được giữ vì còn phục vụ các tiện ích khác.
- Add-on sitemap của Webtools đã được gỡ khỏi dependency/configuration để tránh tạo một sitemap pipeline thứ hai. Dữ liệu/bảng Webtools cũ không bị xóa.
- Không thêm plugin sitemap mới. Sitemap hiện dùng route registry tùy biến để khớp chính xác với cấu trúc route của frontend.

## 3. Các phần triển khai

| Khu vực | File chính | Trách nhiệm |
| --- | --- | --- |
| Route registry và domain rules | `strapi-cms/src/lib/sitemap.js` | Ánh xạ content sang URL frontend; lọc URL; kiểm tra canonical, redirect, locale; tạo danh sách loại trừ và diagnostics. |
| Public sitemap API | `strapi-cms/src/api/sitemap/routes/sitemap.ts`, `controllers/sitemap.ts` | Cung cấp DTO công khai cho sitemap và cấu hình robots. |
| Admin SEO Manager | `strapi-cms/src/plugins/seo-manager/strapi-server.js`, `admin/src/pages/SitemapManager.tsx` | Endpoint diagnostics có RBAC và giao diện xem trạng thái, lỗi, URL được đưa vào/loại trừ. |
| XML sitemap | `dental-frontend/src/app/sitemap.xml/route.ts`, `service-sitemap.xml/route.ts`, `news-sitemap.xml/route.ts`, `page-sitemap.xml/route.ts` | Sitemap index và child URL sets, dùng shared renderer. |
| XML/XSL shared | `dental-frontend/src/lib/seo/sitemap-xml.ts`, `sitemap-route.ts`, `app/sitemap.xsl/route.ts` | Escape XML, render index/URL sets và XSL browser view. |
| Robots | `dental-frontend/src/app/robots.txt/route.ts` | Tổng hợp robots rules an toàn, bảo đảm Sitemap directive dùng public origin từ environment. |
| Fetch và cache tag | `dental-frontend/src/lib/seo/sitemap-data.ts`, `sitemap-cache.ts` | Fetch, kiểm tra shape cơ bản của DTO và gắn tag `sitemap`. |
| Revalidation | `dental-frontend/src/app/api/revalidate/route.ts` | Khi nội dung/SEO liên quan đổi, làm mới cache và các route sitemap. |
| Schema SEO dùng chung | `strapi-cms/src/components/seo/page-seo.json` | Có field tùy chọn `include_in_sitemap` để loại một entry khỏi sitemap. |

## 4. Route registry hiện tại

Route mapping tập trung trong `STATIC_ROUTES` và `COLLECTION_ROUTES` của `src/lib/sitemap.js`.

### Static/single routes

| URL | Nguồn/nhãn |
| --- | --- |
| `/` | Homepage |
| `/about-us` | About Us |
| `/contact` | Contact |
| `/our-team` | Our Team |
| `/results` | Patient Results |
| `/treatments` | Treatments |
| `/deep-plane-facelift-specialist` | Dr. Cuong |
| `/services` | Services listing |
| `/news` | News listing |

Sitemap XML is a system endpoint, not a page route, so it is not listed as content in its own URL set.

### Collection routes

| Strapi collection | URL pattern | Sitemap group |
| --- | --- | --- |
| `api::service.service` | `/services/:slug` | Services |
| `api::blog.blog` | `/news/:slug` | News |
| `api::page.page` | `/:slug` | Pages |

Route registry là cấu hình do code quản lý, vì pattern phải đồng bộ với route thực tế trong Next.js. Khi thêm route hoặc đổi slug prefix, cần cập nhật registry và test cùng lúc.

## 5. Quy tắc đưa URL vào sitemap

Một URL chỉ được đưa vào sitemap khi đáp ứng các điều kiện liên quan:

1. Nội dung được publish; collection truy vấn bằng Document Service với `status: 'published'`.
2. Indexing được bật ở deployment, SEO Manager và robots settings.
3. `seo.include_in_sitemap` không bị đặt thành `false`.
4. Trang không bật `no_index`.
5. URL/canonical hợp lệ, dùng HTTP(S), cùng origin public đã cấu hình và không chứa query/hash.
6. Canonical hiệu lực trỏ về chính route đang xét. Trang alias/canonical sang URL khác bị loại khỏi danh sách; target được kiểm tra có phải URL published/indexable hợp lệ hay không.
7. URL không phải nguồn của redirect đang hoạt động.
8. Route và canonical không trùng với entry khác.

Drafts không xuất hiện trong public sitemap. Sitemap diagnostics ghi nhận draft collection entries và các nguyên nhân loại trừ để Admin có thể giải thích kết quả.

Các lỗi/diagnostics hiện được phát hiện gồm route trùng, canonical sai hoặc khác origin, duplicate canonical, target canonical không hợp lệ, redirect source, redirect source trùng, redirect loop, redirect chain, thiếu slug, thiếu ngày sửa đổi và nguồn dữ liệu không đọc được.

`lastModified` lấy từ `updatedAt`, fallback sang `publishedAt`. Hệ thống không gán thời gian hiện tại cho mọi URL mỗi lần request.

## 6. Public API và an toàn dữ liệu

- `GET /api/seo/sitemap` là endpoint public, chỉ trả các trường cần thiết để render: URL, path, label, group, content type, locale và `lastModified` nếu có.
- `adminEditUrl`, `documentId` và dữ liệu chẩn đoán nội bộ không được trả trong DTO public.
- `GET /api/seo/robots` chỉ trả trạng thái indexing, rules đã chuẩn hóa và additional directives; không trả toàn bộ Strapi entity.
- Admin diagnostics dùng endpoint riêng trong SEO Manager và permission `plugin::seo-manager.sitemap`; quyền xem Admin không được thay bằng public endpoint.
- Truy vấn collection chạy theo lô 100 records, tối đa 100 trang mỗi collection (giới hạn 10.000 records/collection). Child sitemaps hiện chia theo nhóm route ổn định; phân shard trong từng nhóm chưa được bật vì quy mô hiện tại chưa cần.

## 7. XML sitemap (`/sitemap.xml`)

`/sitemap.xml` hiện là `<sitemapindex>` và trỏ tới `/service-sitemap.xml`, `/news-sitemap.xml`, `/page-sitemap.xml` chỉ khi nhóm đó có URL đủ điều kiện. Các child route trả `<urlset>` và truy vấn `GET /api/seo/sitemap?group=...`; Strapi vẫn chạy cùng eligibility/canonical/redirect/duplicate rules trước khi nhóm dữ liệu. Mọi XML có stylesheet PI trỏ `/sitemap.xsl`; stylesheet chỉ trình bày XML trong browser, không thay đổi resource thành HTML. Response có content type XML và revalidate/cache theo cơ chế sitemap hiện tại.

Hiện mỗi item bao gồm URL canonical và `lastModified` khi có timestamp hợp lệ. `priority` và `changefreq` không phải đầu vào trọng tâm. XML và diagnostics dựa trên cùng route registry và tập URL đã lọc; XSL chỉ tạo browser presentation cho XML.

## 8. Sitemap browser view

Không còn trang HTML riêng `/sitemap`. `/sitemap.xml` và các child sitemap vẫn là XML machine-readable; `sitemap.xsl` cung cấp bảng dễ đọc khi mở XML trong browser. URL `/sitemap` chuyển hướng 308 về `/sitemap.xml` để tương thích với bookmark/liên kết cũ.

## 9. Robots (`/robots.txt`)

Route `src/app/robots.txt/route.ts` trả `text/plain` và lấy rules từ API Strapi. Sitemap directive không lấy từ giá trị CMS cũ: URL luôn được ghép từ configured public origin để tránh lộ hostname nội bộ, tunnel hoặc origin sai.

- Khi deployment indexing tắt, hoặc Strapi robots setting tắt indexing: `User-agent: *` và `Disallow: /`.
- Khi không có rules tùy chỉnh, mặc định cho phép public site và disallow `/admin/`, `/api/`, `/_next/`.
- User-agent và đường dẫn được lọc; chỉ path bắt đầu bằng `/` được chấp nhận cho Allow/Disallow.
- Additional directives bị giới hạn ở `Clean-param` và `Host`.
- Nếu Strapi không truy cập được, route dùng safe defaults thay vì làm robots endpoint lỗi.

## 10. Public origin và môi trường

Strapi lấy public origin từ `NEXT_PUBLIC_SERVER_URL`, fallback `FRONTEND_URL`. Next.js dùng cùng cấu hình để tạo robots Sitemap directive. Không hardcode production domain trong generator.

`SITE_INDEXING_ENABLED` là công tắc ở cấp deployment. Nếu không khai báo, indexing chỉ mặc định bật khi `NODE_ENV=production`; staging/preview nên đặt `false`. Cần bảo đảm Docker Compose truyền cùng public URL và indexing flag cho frontend/CMS phù hợp với từng môi trường.

## 11. Locale/i18n

Strapi đọc locale mặc định và danh sách locale từ i18n. DTO có `locale` và `locales`, nhưng hiện frontend chưa có URL tree phân biệt ngôn ngữ; vì vậy generator chỉ emit route của default locale và bỏ qua các locale khác để tránh tạo nhiều `<loc>` trùng nhau. Không tự tạo `/en`/`/vi` prefix hay hreflang giả.

Khi frontend có localized route thực sự, cần mở rộng registry để giải quyết URL theo locale và bổ sung alternates/hreflang; hiện đó là phần chưa triển khai.

## 12. Sitemap trong SEO Manager và SEO Health

SEO Manager > Sitemap gọi diagnostics có xác thực Admin và cung cấp:

- số URL included/excluded;
- số critical issues và warnings;
- trạng thái bật/tắt, locale mặc định và thời điểm phân tích;
- liên kết mở `/sitemap.xml` và `/robots.txt`;
- bảng validation;
- preview tối đa 100 URL;
- danh sách excluded URL cùng lý do, hiển thị tối đa 100 dòng.
- bảng Content Types có công tắc bật/tắt theo Strapi UID và route pattern/slug field chỉ đọc;
- bảng Static Routes có công tắc bật/tắt theo route ID ổn định và path chỉ đọc;
- thao tác Revalidate Sitemap gọi endpoint Next.js hiện có bằng secret phía server; không sinh XML file thủ công.

Hai policy map được lưu trong JSON fields `sitemap_content_types` và `sitemap_static_routes` trên singleton SEO Manager hiện có. Key chưa được lưu mặc định enabled để giữ tương thích ngược. Tắt một source chỉ loại URL khỏi sitemap, không unpublish content và không sửa `no_index`, canonical hoặc `include_in_sitemap`. Thay đổi policy được publish qua Content Manager rồi gọi pipeline revalidation có sẵn. Lỗi revalidation được báo riêng; cấu hình đã lưu không bị rollback và cache hiện tại vẫn được giữ.

SEO Health nhận policy này và findings từ cùng sitemap analyzer để đưa lỗi sitemap vào nhóm sức khỏe tương ứng. Giao diện không cho chỉnh route pattern, XML, URL record, `priority`, `changefreq` hoặc `lastModified`.

## 13. Cache và cập nhật dữ liệu

Frontend fetch gắn cache tag `sitemap`. Webhook revalidation nhận các model ảnh hưởng đến route set, SEO, robots hoặc canonical; khi hợp lệ, nó invalidate tag và revalidate `/sitemap.xml` cùng ba child XML và các path liên quan. Đây là một phần của cơ chế hiện hữu; lỗi delivery vẫn có fallback revalidation 300 giây ở các route có khai báo.

Redirect data được dùng để lọc/kiểm tra sitemap. Nếu thay đổi redirect không phát webhook với model/event được nhận diện, nên chạy kiểm tra thủ công và xác nhận webhook mapping trước khi dựa vào cache invalidation tự động.

## 14. Tương thích dữ liệu và thay đổi schema

Field `include_in_sitemap` được thêm vào shared SEO component theo hướng additive. Không có thao tác xóa hay rewrite nội dung SEO hiện hữu, không chạy seed, và không xóa bảng/dữ liệu sitemap cũ của Webtools. CMS tự đồng bộ schema theo cơ chế deploy hiện có.

Route `/admin/plugins/webtools/sitemap/default` không còn là giao diện sitemap được sử dụng; quyền sở hữu UI chuyển sang SEO Manager. Phần Webtools còn lại vẫn được giữ cho các tiện ích khác.

## 15. Kiểm thử và xác minh

Theo lần xác minh implementation gần nhất:

- Sau khi bổ sung source policy và revalidation: 22 test sitemap, SEO Health và Admin revalidation pass.
- Strapi TypeScript check pass.
- Frontend TypeScript check pass.
- Kiểm tra admin translations pass.
- CMS TypeScript check, Admin translation coverage và Strapi build pass trong lần kiểm tra gần nhất; frontend TypeScript/build đã pass ở lần xác minh sitemap trước đó.
- Lệnh ESLint theo phạm vi file không chạy được vì `.eslintrc.js` tham chiếu `@strapi/eslint-config/server`, config không có trong dependency hiện tại.
- Runtime sau triển khai: index và ba child routes trả `200 application/xml`; `/sitemap.xsl` trả `200 text/xsl`; `/sitemap` chuyển hướng về `/sitemap.xml`; `/robots.txt` trả `200 text/plain`.
- XML parser xác nhận index hợp lệ có 3 child documents; sau khi gỡ ba Page records lỗi thời, child sets còn tổng 26 URL duy nhất; child `lastmod` khớp ngày cập nhật lớn nhất trong nhóm; XSL là XML hợp lệ.
- XSL hiển thị `lastmod` theo `HH:mm DD/MM/YYYY`; giá trị trong XML vẫn là ISO 8601 để tuân chuẩn sitemap.
- API group filter trả riêng 9 service, 6 news và 11 page URLs; group không hợp lệ trả `400`.
- Đã xóa chính xác các Page documents `facility-upgrade`, `services-listing` và `customers` (draft/published variants tìm thấy) qua Strapi Document Service; xác minh API sitemap không còn URL tương ứng. Frontend route riêng `/customers` đã được gỡ; cả ba URL hiện trả `404`.
- Public sitemap API hiện trả 26 URLs, locale `en`; DTO không lộ `adminEditUrl`.
- `robots.txt` dùng origin cấu hình của deployment và có các rule mặc định cho admin/API/Next assets.
- Container CMS và frontend ở trạng thái healthy tại thời điểm kiểm tra.

Kết quả runtime và số URL phản ánh dữ liệu ở thời điểm kiểm tra, có thể thay đổi khi CMS content hoặc environment thay đổi.

### Lệnh test logic Strapi

```bash
cd strapi-cms
node --test test/sitemap.test.cjs test/seo-health.test.cjs test/seo-manager-sitemap-action.test.cjs
npm run type-check
```

### Kiểm tra endpoint sau deploy

```bash
curl -i "$NEXT_PUBLIC_SERVER_URL/sitemap.xml"
curl -i "$NEXT_PUBLIC_SERVER_URL/robots.txt"
curl -i "$STRAPI_URL/api/seo/sitemap"
```

Kỳ vọng: `/sitemap.xml` trả sitemap index XML có XSL presentation, child sitemap trả URL set XML, `/sitemap` redirect về `/sitemap.xml`, robots là plain text; origin trong `<loc>` và `Sitemap:` phải khớp public origin cấu hình.

## 16. Giới hạn hiện tại và việc cần làm khi mở rộng

1. **Chưa localized URL/hreflang:** chỉ default locale được phát hành vì frontend chưa có route theo locale.
2. **Chưa phân shard theo giới hạn sitemap:** đã có index và child groups; một child group lớn hơn giới hạn chuẩn cần bổ sung sharding (ví dụ nhiều descriptor/path cùng group) trước khi đạt ngưỡng.
3. **Chưa crawler HTTP:** analyzer không gọi từng URL để kiểm tra 200/404/5xx hoặc redirect thực tế. Nó dựa vào CMS redirect/canonical data.
4. **Route registry do code quản lý:** thêm content type hay đổi frontend route phải cập nhật mapping và tests; Admin chưa có màn hình tự định nghĩa route pattern.
5. **Human sitemap chưa có search/pagination:** phù hợp danh sách hiện tại; cần bổ sung nếu số URL khiến trang khó sử dụng.
6. **Cache phụ thuộc webhook:** xác nhận webhook bao phủ publish/unpublish, slug, SEO, robots, canonical và redirect changes; fallback không thay thế việc kiểm tra webhook.
7. **Robots CMS legacy field:** public directive lấy từ deployment origin; giá trị sitemap URL cũ trong CMS không điều khiển host của directive nhằm tránh cấu hình sai/lộ internal origin.

## 17. Tài liệu liên quan

- [Sitemap architecture](./sitemap-architecture.md)
- Strapi SEO Manager: `strapi-cms/src/plugins/seo-manager/`
- Sitemap route registry: `strapi-cms/src/lib/sitemap.js`
- Frontend sitemap/robots: `dental-frontend/src/app/sitemap.xml/`, `dental-frontend/src/app/*-sitemap.xml/`, `dental-frontend/src/app/sitemap.xsl/`, `dental-frontend/src/app/robots.txt/`
