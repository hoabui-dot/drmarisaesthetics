# Website Settings: Strapi Architecture and Frontend Integration

## Purpose

This document describes the shared `Website Settings` architecture used by the Smilux Dental Clinic website. It is intended to help clone the same structure into another Strapi CMS instance and connect it to `dental-frontend`.

`Website Settings` is the single source of truth for information shared by the site chrome and multiple pages:

- website identity and localized name;
- logo and favicon;
- clinic address, phone numbers, email and opening hours;
- map coordinates and map URL;
- floating/global contact methods;
- social links.

Page-specific content must remain in its own content type. `Website Settings` should contain only reusable global information.

## Current Strapi structure

The implementation is a Strapi single type:

```text
strapi-cms/
├── src/api/website-setting/
│   ├── content-types/website-setting/schema.json
│   ├── controllers/website-setting.ts
│   ├── routes/website-setting.ts
│   └── services/website-setting.ts
└── src/components/website-setting/
    ├── contact-method.json
    └── social-link.json
```

The content type UID is:

```text
api::website-setting.website-setting
```

The REST endpoint is:

```text
GET /api/website-setting
PUT /api/website-setting
```

Because this is a single type, there is one settings document rather than a collection of settings records.

## Main single type fields

| Field | Strapi type | Required | Purpose |
|---|---|---:|---|
| `site_name` | string | yes | Primary English/site name |
| `site_name_localized` | string | no | Localized clinic name |
| `logo` | media, single image | no | Global logo |
| `favicon` | media, single image | no | Browser/site favicon |
| `address` | text | yes | Canonical clinic address |
| `phone_primary` | string | yes | Main phone number |
| `phone_secondary` | string | no | Secondary phone/WhatsApp number |
| `email` | email | yes | Main clinic email |
| `opening_hours` | string | no | Human-readable opening hours |
| `website` | string | no | Canonical website URL |
| `map_latitude` | decimal | no | Google Maps latitude |
| `map_longitude` | decimal | no | Google Maps longitude |
| `map_zoom` | integer | no | Map zoom level; default is `16` |
| `map_url` | string | no | External Google Maps URL |
| `contact_methods` | repeatable component | no | Floating/contact action buttons |
| `social_links` | repeatable component | no | Social media links |

The schema enables draft and publish:

```json
{
  "kind": "singleType",
  "options": {
    "draftAndPublish": true
  }
}
```

## Component: `website-setting.contact-method`

This component represents a global contact action such as phone, WhatsApp, Zalo or Messenger.

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `type` | string | yes | Stable action type, for example `phone` or `whatsapp` |
| `label` | string | yes | Display label |
| `href` | text | yes | Action URL such as `tel:`, `https://wa.me/` or another deep link |
| `icon` | media, single image | no | Optional icon image |
| `color` | string | no | UI color key, for example `blue` or `green` |
| `order` | integer | no | Display order; default `0` |
| `is_active` | boolean | no | Visibility flag; default `true` |

Recommended examples:

```json
[
  {
    "type": "phone",
    "label": "Call us",
    "href": "tel:+84396877518",
    "color": "blue",
    "order": 1,
    "is_active": true
  },
  {
    "type": "whatsapp",
    "label": "WhatsApp",
    "href": "https://wa.me/84902759406",
    "color": "green",
    "order": 4,
    "is_active": true
  }
]
```

## Component: `website-setting.social-link`

This component represents a social media destination used by the footer or other shared site UI.

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `platform` | string | yes | Stable platform key, for example `facebook` |
| `url` | string | yes | Public social URL |
| `icon_class` | string | no | Optional icon class, for example `fab fa-facebook` |
| `order` | integer | no | Display order; default `0` |
| `is_active` | boolean | no | Visibility flag; default `true` |

## Cloning into another Strapi CMS

### 1. Copy the schema files

Copy these three schema files into the target Strapi project:

```text
src/api/website-setting/content-types/website-setting/schema.json
src/components/website-setting/contact-method.json
src/components/website-setting/social-link.json
```

Copy the generated core files or let Strapi create them:

```text
src/api/website-setting/controllers/website-setting.ts
src/api/website-setting/routes/website-setting.ts
src/api/website-setting/services/website-setting.ts
```

The core files should use the same UID:

```ts
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::website-setting.website-setting');
```

### 2. Rebuild and start Strapi

Run the target project's normal build and start commands:

```bash
npm run build
npm run start
```

The schema files alone are not proof that the database is ready. Verify that the target database contains the generated tables for the single type and components. The exact table names can vary by Strapi version, but the main table is normally based on `collectionName`:

```text
website_settings
components_website_setting_contact_methods
components_website_setting_social_links
```

If the target deployment uses a production schema strategy that does not auto-create new tables, apply the project's database migration before using the API. Do not seed through the API until the tables exist.

### 3. Configure Admin Content Manager permissions

After rebuilding, open:

```text
/admin/content-manager/single-types/api::website-setting.website-setting
```

If the content type is visible in Content-type Builder but missing in Content Manager, check these items in order:

1. Strapi was rebuilt after the schema files were copied.
2. The database table for the single type exists.
3. The admin user role has access to Content Manager.
4. The content type is not disabled in the Content Manager configuration.
5. Browser cache/admin assets were refreshed after the rebuild.

The public API permission required by the frontend is:

```text
api::website-setting.website-setting.find
```

The current project adds this permission during Strapi bootstrap when it is missing. On another CMS, it can also be enabled manually under Settings → Users & Permissions → Roles → Public.

Only enable `find` for the public role. Keep create, update and delete restricted to authenticated administrators.

### 4. Upload and assign media

Upload the logo, favicon and optional contact-method icons in Media Library. Then assign them to:

```text
Website Settings → logo
Website Settings → favicon
Website Settings → contact_methods[].icon
```

Do not hard-code upload paths in the frontend. The frontend reads the Strapi media object and resolves its `url`.

### 5. Create and publish the settings document

Populate all required fields and publish the single type. A settings document that remains in draft will not be returned to the production frontend, because the frontend requests `status=published`.

Example seed payload:

```json
{
  "data": {
    "site_name": "Smilux Dental Clinic",
    "site_name_localized": "Nha Khoa Quốc Tế Sài Gòn",
    "address": "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
    "phone_primary": "+84 396 877 518",
    "phone_secondary": "+84 902 759 406",
    "email": "sgnhakhoaquocte@gmail.com",
    "opening_hours": "Mon – Sun: 8:00 AM – 7:00 PM",
    "website": "https://nhakhoaquoctesg.vn",
    "map_latitude": 10.775413839246676,
    "map_longitude": 106.67969229159051,
    "map_zoom": 16,
    "map_url": "https://www.google.com/maps/search/?api=1&query=Smilux+Dental+Clinic+233+Nguyen+Trong+Tuyen+Ho+Chi+Minh",
    "contact_methods": [
      {
        "type": "phone",
        "label": "Call us",
        "href": "tel:+84396877518",
        "color": "blue",
        "order": 1,
        "is_active": true
      }
    ],
    "social_links": [
      {
        "platform": "facebook",
        "url": "https://www.facebook.com/saigonimplant",
        "icon_class": "fab fa-facebook",
        "order": 1,
        "is_active": true
      }
    ]
  }
}
```

For automation, the existing seed script is:

```text
migration_scripts/168-seed-website-setting.js
```

It uses `PUT /api/website-setting` and requires `STRAPI_URL` and `STRAPI_API_TOKEN`.

## Calling the API from `dental-frontend`

### Environment variables

Configure the target CMS URL and a token that can read the published single type:

```env
NEXT_PUBLIC_STRAPI_URL=http://your-strapi-host:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your-read-token
```

The frontend API client automatically adds:

```http
Authorization: Bearer <token>
```

The token must not be committed to source control.

### Request used by the frontend

The canonical query is:

```http
GET /api/website-setting?populate[logo]=true&populate[favicon]=true&populate[contact_methods][populate][icon]=true&populate[social_links]=true&status=published
```

In the current frontend this is implemented by:

```text
dental-frontend/src/lib/api/queries.ts
```

The public helper is:

```ts
const websiteSetting = await getWebsiteSetting(isDraftMode);
```

The helper is intentionally responsible for:

- requesting all required media and components;
- converting Strapi snake_case fields to frontend camelCase;
- converting decimal map coordinates to numbers;
- filtering inactive contact methods and social links;
- sorting both lists by `order`;
- resolving relative media URLs;
- returning safe fallback data if Strapi is unavailable.

### Frontend data shape

The Strapi response is transformed into this frontend shape:

```ts
interface WebsiteSetting {
  siteName: string;
  siteNameLocalized?: string;
  logo?: Media;
  favicon?: Media;
  address: string;
  phonePrimary: string;
  phoneSecondary?: string;
  email: string;
  openingHours?: string;
  website?: string;
  mapLatitude?: number;
  mapLongitude?: number;
  mapZoom?: number;
  mapUrl?: string;
  contactMethods: ContactMethod[];
  socialLinks: SocialLink[];
}
```

The corresponding TypeScript types are in:

```text
dental-frontend/src/types/strapi.ts
```

### Supplying settings to shared UI

The layout fetches the settings once for shared site chrome:

```ts
const [navigation, footer, websiteSetting] = await Promise.all([
  getNavigation(),
  getFooter(),
  getWebsiteSetting(),
]);
```

The settings are passed to shared components such as:

- `Header.tsx` for the global logo and header identity;
- `Footer.tsx` for contact and social information;
- floating contact UI;
- shared booking/consultation sections;
- SEO and map-related page sections.

Page routes that also fetch settings directly include the homepage, About Us and Contact pages. This allows page-specific server rendering while keeping the values sourced from the same single type.

Do not reintroduce hard-coded address, phone or logo values into individual page components except as an explicit temporary fallback.

## Cache and revalidation

The request uses the cache tag:

```text
website-setting
```

When Website Settings changes, invalidate this tag or call the existing revalidation endpoint so all affected routes refresh. The current revalidation mapping covers:

```text
/
/about-us
/contact
/services
/customers
/news
```

For preview/draft mode, the frontend requests `status=draft` and disables caching. For normal production rendering, it requests `status=published`.

## API verification checklist

After cloning to another Strapi instance, verify:

```bash
# Published API response
curl -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  "$STRAPI_URL/api/website-setting?populate[logo]=true&populate[favicon]=true&populate[contact_methods][populate][icon]=true&populate[social_links]=true&status=published"
```

Expected checks:

- HTTP status is `200`;
- response contains `data`;
- `data.site_name`, `data.address`, `data.phone_primary` and `data.email` are populated;
- `data.logo.url` and `data.favicon.url` are valid when media is assigned;
- component arrays are returned under `data.contact_methods` and `data.social_links`;
- inactive rows are either filtered by the frontend or omitted by the integration layer;
- media URLs are reachable from the frontend network;
- the published document is visible in Content Manager.

If the API returns `500` with `relation "public.website_settings" does not exist`, the schema exists in the Strapi application code but the target database has not been synchronized/migrated. Fix the database schema first; changing frontend query parameters will not resolve that error.

## Files to transfer or review

### Strapi

```text
strapi-cms/src/api/website-setting/content-types/website-setting/schema.json
strapi-cms/src/api/website-setting/controllers/website-setting.ts
strapi-cms/src/api/website-setting/routes/website-setting.ts
strapi-cms/src/api/website-setting/services/website-setting.ts
strapi-cms/src/components/website-setting/contact-method.json
strapi-cms/src/components/website-setting/social-link.json
strapi-cms/src/index.ts
migration_scripts/168-seed-website-setting.js
```

### Frontend

```text
dental-frontend/src/lib/api/queries.ts
dental-frontend/src/lib/api/client.ts
dental-frontend/src/types/strapi.ts
dental-frontend/src/lib/constants/contact.ts
dental-frontend/src/app/layout.tsx
```

`contact.ts` should be treated as fallback/legacy compatibility data. The authoritative runtime values should come from `getWebsiteSetting()`.
