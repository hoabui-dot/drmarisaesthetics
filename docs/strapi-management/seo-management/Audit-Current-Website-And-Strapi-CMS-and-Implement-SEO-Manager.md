# Task: Audit Current Website + Strapi CMS and Implement SEO Manager

You are a **Senior Full-Stack Engineer, Technical SEO Engineer, and Strapi CMS Architect**.

The current project uses a website frontend connected to **Strapi CMS** for content management.

Your task is to first **audit the existing website architecture, routing system, Strapi content structure, API integration, SEO implementation, and deployment behavior**, then implement a production-ready **SEO Manager** without breaking any existing functionality.

Do not immediately create duplicate SEO features. Inspect the current codebase first and reuse/refactor existing implementations whenever appropriate.

---

## 1. Audit Existing Architecture

Before making changes, inspect:

* Frontend framework and routing structure
* Strapi version and project structure
* Existing Strapi Collection Types, Single Types, Components, and Dynamic Zones
* Current SEO fields/components
* Current metadata generation logic
* Existing `robots.txt`
* Existing sitemap implementation
* Existing redirects
* Existing canonical URL logic
* Locale/i18n configuration
* Slug generation and dynamic routes
* Environment configuration
* Production domain configuration
* API fetching and caching/revalidation strategy

Identify conflicts, duplicated implementations, missing SEO functionality, and architecture risks.

Preserve all existing working functionality.

---

# 2. Implement SEO Manager

Create a centralized **SEO Manager** inside Strapi CMS containing the following five management areas.

## A. Default Metadata

Create global SEO settings for fallback metadata used when individual pages do not provide their own SEO configuration.

Support at minimum:

* Default Meta Title
* Meta Title Template
* Default Meta Description
* Default Open Graph Image
* Site Name
* Default Open Graph Title
* Default Open Graph Description
* Default Twitter/X Card settings

Example title template:

```text
%page_title% | Brand Name
```

Individual page-level SEO must override global defaults.

Fallback priority should be:

```text
Page SEO
↓
Content-derived SEO
↓
Default Metadata
```

Ensure metadata is correctly rendered in the frontend.

---

## B. robots.txt Manager

Allow administrators to manage `robots.txt` behavior from Strapi.

Support:

* Enable/disable indexing globally
* User-agent rules
* Allow rules
* Disallow rules
* Sitemap URL
* Custom additional directives

Example:

```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml
```

The frontend should dynamically generate or serve:

```text
/robots.txt
```

based on the CMS configuration.

Include safe defaults so production cannot accidentally expose inappropriate routes.

---

## C. Sitemap Manager

Implement automatic XML sitemap generation.

Generate:

```text
/sitemap.xml
```

Include indexable public pages such as:

* Static pages
* Dynamic CMS pages
* Blog/news articles
* Service pages
* Other public content types discovered during the architecture audit

Each sitemap item should support:

```text
URL
lastmod
changefreq
priority
```

Automatically exclude:

* Draft content
* Unpublished content
* `noindex` pages
* Disabled pages
* Internal/admin/API routes

The sitemap should update automatically when relevant Strapi content changes.

For large websites, design the solution so sitemap indexes can be introduced later.

---

## D. Redirect Manager

Create a Strapi Collection Type for redirects.

Suggested fields:

```text
sourcePath
destinationPath
statusCode
isActive
notes
```

Supported status codes:

```text
301
302
307
308
```

Example:

```text
/old-service
→
/services/new-service
301
```

Requirements:

* Prevent duplicate source paths
* Validate redirect destinations
* Prevent obvious redirect loops
* Normalize paths consistently
* Ignore inactive redirects
* Support internal and external destinations where appropriate

Integrate redirects with the frontend routing/middleware layer using the most appropriate architecture for the existing stack.

The implementation should be performant and must not require expensive CMS API calls on every request if avoidable.

---

## E. Canonical Rules

Implement centralized canonical URL management.

Canonical URLs should prevent duplicate-content problems caused by:

* Query parameters
* Alternate URL structures
* Duplicate routes
* Pagination
* Filter/search parameters
* Legacy URLs
* Localization where applicable

Default behavior:

```text
Current normalized public URL
→ canonical URL
```

Allow individual pages to override the canonical URL when necessary.

Example:

```html
<link rel="canonical" href="https://example.com/services/dental-implants" />
```

Canonical URLs must:

* Use the correct production domain
* Prefer HTTPS
* Remove unnecessary query parameters
* Avoid duplicate trailing-slash variations
* Respect locale strategy
* Avoid pointing to draft or invalid pages

---

# 3. Strapi Admin Structure

Organize the SEO configuration clearly for non-technical administrators.

Recommended structure:

```text
SEO Manager

├── Default Metadata
├── Robots.txt
├── Sitemap Settings
├── Redirects
└── Canonical Rules
```

Use:

* Single Types for global SEO configuration
* Collection Types where multiple records are required
* Reusable Strapi Components when appropriate

Do not create unnecessarily complex schemas.

---

# 4. Page-Level SEO

Audit existing page/content schemas.

Where appropriate, create or reuse a reusable SEO component containing:

```text
metaTitle
metaDescription
metaImage
canonicalUrl
noIndex
noFollow
openGraph
```

Do not duplicate fields if equivalent SEO structures already exist.

The system must combine page-level SEO and global SEO defaults predictably.

---

# 5. Frontend Integration

Connect the SEO Manager to the existing frontend architecture.

Implement:

* Dynamic metadata generation
* Open Graph metadata
* Twitter/X metadata
* Canonical tags
* robots directives
* `robots.txt`
* XML sitemap
* redirects

Reuse the project's existing routing, API, caching, and rendering architecture.

Do not introduce a parallel system when the current architecture can be extended cleanly.

---

# 6. Performance and Caching

Avoid requesting global SEO configuration from Strapi unnecessarily on every request.

Use the project's existing mechanism where possible, such as:

```text
server caching
framework cache
ISR
revalidation
webhooks
tag-based cache invalidation
```

When SEO settings or redirects are changed in Strapi, ensure the website can receive the updated configuration without requiring a full manual redeployment unless technically necessary.

---

# 7. Validation and Safety

Add appropriate validation for:

* Meta title length
* Meta description length
* URLs
* Redirect paths
* Canonical URLs
* Duplicate redirects
* Invalid sitemap entries

Do not allow CMS configuration errors to crash the production website.

Provide safe fallback behavior.

---

# 8. Implementation Rules

Follow these rules strictly:

1. Inspect the existing codebase before modifying anything.
2. Do not recreate functionality that already exists.
3. Preserve all existing frontend and CMS functionality.
4. Follow the current project's coding conventions.
5. Keep SEO logic centralized and maintainable.
6. Avoid hardcoding production domains when environment configuration can be used.
7. Do not expose secrets or private environment variables through Strapi.
8. Keep the admin interface understandable for non-technical users.
9. Use reusable schemas/components instead of duplicated fields.
10. Ensure the implementation is suitable for a production/enterprise website.

---

# 9. Testing

After implementation, verify at minimum:

```text
Homepage metadata
Dynamic page metadata
Article/service metadata
Open Graph tags
Canonical tags
noindex behavior
robots.txt
sitemap.xml
301 redirect
302 redirect
invalid redirect handling
CMS fallback metadata
page-level SEO overrides
draft/unpublished page exclusion
production domain generation
```

Also test that existing:

```text
routes
content APIs
Strapi Admin
media
dynamic pages
localization
build process
deployment process
```

continue to work correctly.

---

# 10. Expected Result

The final architecture should behave approximately like:

```text
                    STRAPI CMS
                        │
                ┌───────▼────────┐
                │   SEO Manager  │
                ├────────────────┤
                │ Default SEO    │
                │ Robots         │
                │ Sitemap        │
                │ Redirects      │
                │ Canonicals     │
                └───────┬────────┘
                        │
                        ▼
                    Website
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
     Metadata       Search Engine     Routing
        │               │                │
 OG / Twitter       robots.txt        Redirects
 Canonical          sitemap.xml       Canonicals
```

The final implementation must give administrators centralized SEO control while keeping the frontend SEO output technically correct, performant, scalable, and maintainable.

After completing the implementation, provide a concise summary of:

* Existing SEO architecture discovered
* Files/schemas modified
* New Strapi content types/components created
* Frontend integration added
* Existing functionality reused
* Important architectural decisions
* Testing performed
* Any remaining SEO risks or recommended improvements
