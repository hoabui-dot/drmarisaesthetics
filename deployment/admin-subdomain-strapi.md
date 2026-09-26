# Strapi Admin trên subdomain riêng

Đây là chiến lược production hiện tại. Không dùng
`frontend-url-and-strapi-admin-proxy.md` và không proxy `/admin` qua domain
frontend.

## Public hosts

```text
https://drmarisaesthetics.com       → Next.js :2234
https://admin.drmarisaesthetics.com → Strapi :22345
```

Strapi sở hữu toàn bộ subdomain Admin, gồm `/admin/*`, các plugin Admin API,
`/api/*` và `/uploads/*`. Frontend server-side vẫn gọi Strapi bằng
`http://strapi:22345` trong Docker. Browser-side requests dùng
`https://admin.drmarisaesthetics.com`; Strapi CORS cho phép cả Admin origin và
frontend origin.

## Environment ownership

Trong `deployment/drmaris-env/drmaris.production.strapi.env`:

```env
PUBLIC_URL=https://admin.drmarisaesthetics.com
STRAPI_ADMIN_BACKEND_URL=https://admin.drmarisaesthetics.com
FRONTEND_URL=https://drmarisaesthetics.com
NEXT_PUBLIC_SERVER_URL=https://drmarisaesthetics.com
```

Trong `deployment/drmaris-env/drmaris.production.frontend.env`:

```env
NEXT_PUBLIC_STRAPI_URL=https://admin.drmarisaesthetics.com
NEXT_PUBLIC_SERVER_URL=https://drmarisaesthetics.com
```

`PUBLIC_URL`, `STRAPI_ADMIN_BACKEND_URL` và các `NEXT_PUBLIC_*` values là
build-time configuration. Vì vậy đổi từ shared origin sang subdomain bắt buộc
build lại cả CMS image và frontend image. Runtime restart đơn thuần không đủ.

## DNS, TLS và Nginx

Tạo DNS record:

```text
admin.drmarisaesthetics.com → production VPS IP
```

Issue certificate cho cả `drmarisaesthetics.com` và
`admin.drmarisaesthetics.com`, sau đó cài:

- `../docs/deployment/nginx-drmaris-admin-subdomain.conf` vào Nginx site config;
- `../docs/deployment/drmaris-strapi-subdomain-proxy.conf` vào
  `/etc/nginx/snippets/drmaris-strapi-subdomain-proxy.conf`.

Kiểm tra và reload:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

## Build và triển khai image

Từ workspace:

```sh
cd /home/neurosus/drmaris/deployment
bash ./build-production-images.sh
```

Script giữ nguyên tag trong `docker-compose.yml`. Sau khi đã push các image
đã build lên Docker Hub và copy deployment files lên VPS:

```sh
cd /home/neurosus/drmaris/deployment
docker compose pull
docker compose up -d
docker compose ps
```

Không chạy `down -v`; không cần migrate hoặc reseed PostgreSQL/uploads.

## Smoke test

```sh
curl -I https://drmarisaesthetics.com/
curl -I https://admin.drmarisaesthetics.com/admin/auth/login
curl -i https://admin.drmarisaesthetics.com/admin/init
curl -I https://drmarisaesthetics.com/sitemap.xml
```

Admin bundle không được chứa IP cũ, `http://` backend cũ, hoặc domain frontend
ở vị trí Strapi backend. `/admin/init` trả `200` sau khi đăng nhập hoặc `401`
ở endpoint yêu cầu session đều chứng minh request đã tới Strapi; HTML frontend
trả về từ endpoint JSON là lỗi Nginx routing.
