# Shared-origin Strapi Admin deployment

`https://demo-drmaris.ddns.net/` serves Next.js; `/admin` and Strapi Admin API
routes are reverse-proxied to the private Strapi host at `100.82.195.220:22345`.
The browser therefore calls Strapi on the same HTTPS origin instead of using a
private/IP HTTP backend, eliminating cross-origin and mixed-content failures.

## Nginx files

- `nginx-demo-drmaris-shared-origin.conf` is installed as
  `/etc/nginx/sites-enabled/demo-drmaris.ddns.net`.
- `drmaris-strapi-proxy.conf` is installed as
  `/etc/nginx/snippets/drmaris-strapi-proxy.conf`.

The site root and non-Strapi `/api/*` routes continue to use Next.js. `/admin`,
Strapi plugin API namespaces, `/api/seo/*`, and `/uploads/*` use Strapi. The
Strapi-specific public sitemap API is intentionally routed through this same
proxy, while the frontend's booking/revalidation APIs remain on Next.js.

## Permanent Strapi build configuration

The deployed Admin bundle was built with the obsolete
`STRAPI_ADMIN_BACKEND_URL=http://103.75.183.34:22345`. Nginx temporarily rewrites
that value to `https://demo-drmaris.ddns.net` and applies a new cache key. For a
future Strapi image build, set both `PUBLIC_URL` and
`STRAPI_ADMIN_BACKEND_URL` to `https://demo-drmaris.ddns.net`, and set
`FRONTEND_URL` to the canonical website origin. Rebuild and redeploy Strapi;
then the compatibility `sub_filter` can be removed. Keep the public URL at the
origin root: Strapi itself owns the `/admin` path.

## Verification

The production VPS must pass `nginx -t` before reload. Smoke checks:

```sh
curl -I https://demo-drmaris.ddns.net/
curl -I https://demo-drmaris.ddns.net/admin/
curl -I https://demo-drmaris.ddns.net/admin/auth/login
curl -i https://demo-drmaris.ddns.net/admin/init
curl -i https://demo-drmaris.ddns.net/content-manager/collection-types/...
```

`/admin/init` should return 200. Content Manager requires a valid Admin
session/token; an unauthenticated 401 confirms it reached Strapi and is not a
CSP/CORS or routing failure. The Admin JavaScript response should contain no
reference to the obsolete IP and should use the HTTPS website origin.
