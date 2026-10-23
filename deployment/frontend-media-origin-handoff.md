# Production handoff: frontend-origin Strapi media

## Scope

The frontend source now normalizes Strapi upload URLs to the same-origin media
proxy:

```text
/api/strapi-media/uploads/<file>
```

The Strapi Admin/API remains on `https://admin.drmarisaesthetics.com`. No
Strapi schema, database, volume, Nginx, production environment file, or running
container was changed as part of this frontend implementation.

## Changes included in the frontend source

- The shared media helper converts relative uploads and absolute URLs from the
  configured Strapi hostname to the same-origin proxy. External image hosts
  and non-upload URLs remain unchanged.
- The server-side Strapi API client recursively normalizes upload URLs in API
  payloads. This also covers raw fields such as `imageUrl`, hospital image URL
  strings, Better Blocks, and metadata passed directly to components.
- Media-specific call sites (service content, blog details, Markdown, homepage
  articles, and video thumbnails) use the same helper.
- The proxy only accepts `/uploads/` paths, uses runtime `STRAPI_URL`, forwards
  query strings and upstream content type, and does not return internal URLs
  or stack traces to the browser.
- Table-driven tests are available with `npm run test:media`.

## Build and release

Build and publish from the reviewed source workspace, not on the production
VPS. Use a **new unique frontend image tag** and update only the `frontend`
image tag in `deployment/docker-compose.yml` as part of the approved release.
Keep the existing CMS image and its Admin origin settings unchanged.

Build-time public values must remain:

```text
NEXT_PUBLIC_STRAPI_URL=https://admin.drmarisaesthetics.com
NEXT_PUBLIC_SERVER_URL=https://drmarisaesthetics.com
```

At runtime, Compose must continue to provide the internal server-side origin:

```text
STRAPI_URL=http://strapi:22345
```

Do not pass a Strapi API token to the media route or change the Admin/API
origin to the frontend origin. Use the deployment builder's approved secret
handling; do not print or copy production credentials into this report.
Because this is a frontend-only change, do not rebuild or push the CMS image.

## Deploy on the VPS

After the new frontend image is available in the registry and the reviewed
Compose file has been copied to the VPS:

```sh
cd /root/drmaris
docker compose config --quiet
docker compose pull frontend
docker compose up -d --no-deps --force-recreate frontend
docker compose ps
docker compose logs --since=10m frontend
```

Do not restart Strapi or PostgreSQL, and do not remove or recreate volumes.

## Acceptance checks

Use a known, non-sensitive upload filename in place of `<known-file>`:

```sh
curl -fsSI https://drmarisaesthetics.com/
curl -fsSI https://drmarisaesthetics.com/about-us
curl -fsSI 'https://drmarisaesthetics.com/api/strapi-media/uploads/<known-file>'
curl -fsSI https://admin.drmarisaesthetics.com/admin/auth/login
curl -fsSI https://admin.drmarisaesthetics.com/_health
```

Expected:

- Frontend pages return successfully.
- The media URL returns `200`, an image/video `Content-Type` matching the
  uploaded asset, and a public cache header.
- The Admin login remains available on `admin.drmarisaesthetics.com` and
  Strapi health remains successful.
- Browser network requests for Strapi uploads use
  `drmarisaesthetics.com/api/strapi-media/uploads/...`.
- No rendered HTML, Next payload, or browser request exposes
  `https://admin.drmarisaesthetics.com/uploads/...`.
- Approved external images (for example Wikimedia/CDN assets) continue to use
  their external URLs.

If a check fails, inspect only frontend logs and the media request status. Do
not alter CORS, Strapi Admin URLs, or Nginx as a workaround before confirming
the frontend image tag and runtime `STRAPI_URL`.

## Rollback

If the frontend or media proxy fails, restore the previous frontend image tag
in Compose, then run:

```sh
docker compose pull frontend
docker compose up -d --no-deps --force-recreate frontend
docker compose ps
```

Keep the CMS image, database, and all volumes untouched.

## Source verification performed

- `npm run test:media`: passed (10 cases).
- `npm run type-check`: passed.
- Targeted ESLint: completed with warnings only; existing `any`/unused-variable
  warnings and the Markdown raw `<img>` warning remain.
- `npm run build`: completed successfully. During static page-data collection,
  local Strapi at `127.0.0.1:22345` was unavailable, so production acceptance
  still requires the live media/API checks above.
