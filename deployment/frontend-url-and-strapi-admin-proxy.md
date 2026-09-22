# Frontend URL và proxy Strapi Admin trên cùng domain

Tài liệu này mô tả cách triển khai frontend Next.js và Strapi CMS trên cùng một public origin. Người dùng truy cập website bằng frontend URL; Strapi Admin được mở qua `/admin` và Nginx proxy nội bộ tới container Strapi.

## 1. Kiến trúc production

Ví dụ canonical origin:

```text
https://drmarisaesthetics.com/
    ├── /                  → Next.js frontend :2234
    ├── /admin             → Strapi Admin     :22345
    ├── /api/seo/*         → Strapi           :22345
    ├── /uploads/*         → Strapi           :22345
    └── /api/* còn lại     → Next.js frontend :2234
```

Các port `2234` và `22345` chỉ là port nội bộ/public trên VPS. Browser không được gọi trực tiếp IP, port nội bộ hoặc hostname container.

Mục tiêu là mọi request Admin đều giữ nguyên origin:

```text
Browser: https://drmarisaesthetics.com/admin/...
Nginx:   → http://127.0.0.1:22345/admin/...
```

Nhờ vậy tránh được mixed content, CORS và CSP lỗi do Admin bundle gọi về IP HTTP cũ.

## 2. Frontend environment

Frontend runtime env nằm tại:

```text
deployment/drmaris-env/drmaris.production.frontend.env
```

Các giá trị production quan trọng:

```env
NEXT_PUBLIC_SERVER_URL=https://drmarisaesthetics.com
NEXT_PUBLIC_STRAPI_URL=https://drmarisaesthetics.com
STRAPI_URL=http://strapi:22345
```

`NEXT_PUBLIC_STRAPI_URL` được sử dụng trong bundle/browser nên phải là URL public HTTPS. `STRAPI_URL` chỉ dùng cho server-side Next.js và phải trỏ tới service Strapi bên trong Docker network.

Sau khi thay đổi bất kỳ `NEXT_PUBLIC_*` nào, phải build lại frontend image; restart container không đủ vì Next.js inline các giá trị này trong bundle.

## 3. Strapi environment và Admin URL

Strapi env nằm tại:

```text
deployment/drmaris-env/drmaris.production.strapi.env
```

Các giá trị cần dùng:

```env
PUBLIC_URL=https://drmarisaesthetics.com
FRONTEND_URL=https://drmarisaesthetics.com
NEXT_PUBLIC_SERVER_URL=https://drmarisaesthetics.com
```

Trong lúc build CMS image, truyền cả hai build args:

```sh
docker build --platform linux/amd64 \
  -f strapi-cms/Dockerfile \
  -t vanhoadotbui2628/drmaris_aesthetics_cms:<release-tag> \
  --build-arg PUBLIC_URL=https://drmarisaesthetics.com \
  --build-arg STRAPI_ADMIN_BACKEND_URL=https://drmarisaesthetics.com \
  strapi-cms
```

`STRAPI_ADMIN_BACKEND_URL` là build-time value của Admin bundle, không phải chỉ runtime env. Nếu bundle vẫn chứa `http://103.75.183.34:22345` hoặc domain cũ, cần rebuild CMS image và deploy image mới.

Strapi phải giữ public URL ở root domain, không đặt:

```env
PUBLIC_URL=https://drmarisaesthetics.com/admin
```

Strapi tự sở hữu route `/admin`; Nginx chỉ proxy route đó.

## 4. Nginx server block

Tạo site config, ví dụ:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name drmarisaesthetics.com;

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name drmarisaesthetics.com;

    ssl_certificate /etc/letsencrypt/live/drmarisaesthetics.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/drmarisaesthetics.com/privkey.pem;

    client_max_body_size 50m;

    # Strapi Admin UI and Admin requests.
    location = /admin {
        proxy_pass http://127.0.0.1:22345;
        include /etc/nginx/snippets/drmaris-strapi-proxy.conf;
    }

    location ^~ /admin/ {
        proxy_pass http://127.0.0.1:22345;
        include /etc/nginx/snippets/drmaris-strapi-proxy.conf;
    }

    # Strapi v5 Admin/plugin endpoints outside /admin.
    location ~ ^/(content-manager|content-type-builder|i18n|upload|users-permissions|seo-manager|backup-manager|docx-importer|preview-button|guided-tour-meta|license-limit-information|information)(/|$) {
        proxy_pass http://127.0.0.1:22345;
        include /etc/nginx/snippets/drmaris-strapi-proxy.conf;
    }

    # Public Strapi SEO/media endpoints.
    location ^~ /api/seo/ {
        proxy_pass http://127.0.0.1:22345;
        include /etc/nginx/snippets/drmaris-strapi-proxy.conf;
    }

    location ^~ /uploads/ {
        proxy_pass http://127.0.0.1:22345;
        include /etc/nginx/snippets/drmaris-strapi-proxy.conf;
    }

    # All other website traffic goes to Next.js.
    location / {
        proxy_pass http://127.0.0.1:2234;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port 443;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_cache_bypass $http_upgrade;
    }
}
```

`proxy_pass` của Strapi phải trỏ tới port `22345` đúng với [deployment/docker-compose.yml](./docker-compose.yml). Không dùng IP cũ trong Nginx config.

## 5. Proxy snippet

Tạo `/etc/nginx/snippets/drmaris-strapi-proxy.conf`:

```nginx
proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port 443;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 300s;
proxy_send_timeout 300s;
proxy_buffering off;
```

Không dùng `sub_filter` để sửa IP cũ nếu CMS image đã được build đúng `STRAPI_ADMIN_BACKEND_URL`. `sub_filter` chỉ nên là phương án tạm thời để tương thích với image cũ.

## 6. Thứ tự triển khai

```sh
cd /home/neurosus/drmaris/deployment
docker compose pull
docker compose up -d
docker compose ps
```

Sau đó trên VPS:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

Nếu PostgreSQL/uploads là external volume, phải đảm bảo chúng tồn tại trước khi start. Cache Strapi có thể để Compose tự tạo.

## 7. Smoke test

```sh
curl -I https://drmarisaesthetics.com/
curl -I https://drmarisaesthetics.com/admin
curl -I https://drmarisaesthetics.com/admin/auth/login
curl -i https://drmarisaesthetics.com/admin/init
curl -I https://drmarisaesthetics.com/sitemap.xml
curl -I https://drmarisaesthetics.com/robots.txt
```

Kỳ vọng:

- `/` trả về từ Next.js.
- `/admin` chuyển tới Strapi Admin, không trả HTML frontend.
- `/admin/init` trả `200` khi Admin public route hoạt động. `401` ở endpoint yêu cầu session vẫn chứng minh request đã tới Strapi, không phải lỗi proxy.
- `/sitemap.xml` và `/robots.txt` vẫn do Next.js phục vụ.

## 8. Kiểm tra không còn IP/domain cũ

```sh
curl -sS https://drmarisaesthetics.com/admin/ | rg '103\.75\.183\.34|100\.82\.195\.220|http://'
docker compose logs --tail=200 strapi
docker compose logs --tail=200 frontend
```

Admin JavaScript và response phải dùng HTTPS public origin. Nếu browser vẫn gọi `http://103.75.183.34:22345`, nguyên nhân thường là:

1. CMS image cũ vẫn đang chạy.
2. Browser/CDN cache đang giữ Admin bundle cũ.
3. `STRAPI_ADMIN_BACKEND_URL` chưa được truyền lúc CMS build.
4. Nginx đang trỏ nhầm upstream hoặc server block khác đang match domain.

Sau khi deploy image mới, hard refresh browser hoặc mở cửa sổ ẩn danh.

## 9. Kiểm tra lỗi Admin Content Manager

Mở DevTools → Network và kiểm tra các request:

```text
/admin/init
/admin/information
/admin/guided-tour-meta
/content-manager/...
/api/seo/...
```

Không request nào được gọi tới IP nội bộ/cũ. Nếu nhận `401 UnauthorizedError` từ Content Manager sau khi chưa đăng nhập, đó là lỗi authentication bình thường. Nếu nhận `Unexpected token <`, request đang nhận HTML từ frontend/Nginx thay vì JSON từ Strapi; cần kiểm tra lại `location` proxy và `proxy_pass`.

## 10. Checklist hoàn tất

- [ ] Frontend image dùng repository `drmaris_aesthetics_frontend`.
- [ ] CMS image dùng repository `drmaris_aesthetics_cms`.
- [ ] `PUBLIC_URL` là public HTTPS root origin.
- [ ] `STRAPI_ADMIN_BACKEND_URL` được build bằng cùng public origin.
- [ ] `FRONTEND_URL` là cùng canonical origin.
- [ ] Nginx `/admin` và `/admin/` proxy tới `127.0.0.1:22345`.
- [ ] Nginx các plugin/Admin API routes proxy tới Strapi.
- [ ] Nginx root route proxy tới `127.0.0.1:2234`.
- [ ] `/sitemap.xml` và `/robots.txt` vẫn đi tới Next.js.
- [ ] Không còn IP cũ trong Admin bundle, Nginx và response headers.
- [ ] `nginx -t` thành công trước khi reload.
- [ ] `docker compose ps` hiển thị Strapi và frontend healthy.
