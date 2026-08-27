# Task: Refactor Sitemap Manager to Support Global and Group Sitemap Rules

You are a **Senior Full-Stack Engineer, Technical SEO Engineer, and Strapi CMS Architect**.

The project already has an existing **SEO Manager** and sitemap implementation.

Do **not** rebuild the sitemap system from scratch.

First inspect the current Strapi schemas, frontend sitemap generation logic, existing SEO components, routes, and all supported page/content types. Then refactor the current implementation to support a proper **two-level sitemap configuration inheritance model**. Individual SEO entries use `no_index` for exclusion; they do not carry duplicate sitemap priority/frequency fields.

---

# 1. Current Problem

The current Sitemap Settings only provides global values such as:

```text
enabled
default_change_frequency
default_priority
include_service_pages
include_blog_posts
```

The generated sitemap currently applies the same default values to many unrelated pages.

Example:

```xml
<url>
  <loc>https://example.com/services/dental-braces</loc>
  <changefreq>daily</changefreq>
  <priority>0.5</priority>
</url>
```

This architecture is too limited.

Different page types should have different sitemap settings.

For example:

* Homepage
* About
* Contact
* Services
* Individual Service pages
* News
* Individual News articles
* Blog
* Individual Blog posts

must not necessarily share the same `changefreq` and `priority`.

---

# 2. Required Inheritance Architecture

Implement the following precedence:

```text
Group / Content-Type Setting
        ↓
Global Sitemap Default
```

In code:

```text
effectiveSetting =
    groupSetting
    ?? globalDefault
```

This inheritance must work independently for each configurable property.

For example:

```text
Global:
changefreq = monthly
priority = 0.5

Services Group:
changefreq = monthly
priority = 0.8

Dental Implants:
changefreq = weekly
priority = 0.9
```

Result:

```text
/services/dental-implants
→ weekly
→ 0.9

/services/dental-braces
→ monthly
→ 0.8
```

If an individual Service does not define an override, it inherits from the Services group.

If the Services group does not define a value, it inherits from the global Sitemap default.

---

# 3. Sitemap Global Settings

Keep a global Sitemap configuration as the final fallback.

Suggested fields:

```text
enabled

default_change_frequency
default_priority
```

Supported `change_frequency` values:

```text
always
hourly
daily
weekly
monthly
yearly
never
```

Priority must support:

```text
0.0 → 1.0
```

Do not hardcode `daily` or `0.5` directly inside sitemap generation code.

All defaults must come from the centralized Sitemap configuration.

---

# 4. Webtools Sitemap Settings

The administrator manages sitemap URL bundles and custom URLs through the Webtools Sitemap add-on. The legacy custom `SEO Manager - Sitemap Groups` collection type is intentionally not exposed in Content Manager.

At minimum inspect and support all existing website groups, including where applicable:

```text
Homepage

Static Pages
├── About
├── Contact
└── Other static pages

Services
├── Service Detail A
├── Service Detail B
└── ...

Blog
├── Blog Post A
├── Blog Post B
└── ...

News
├── News Article A
├── News Article B
└── ...
```

Do not assume these are the only content types.

Audit the existing codebase and automatically account for all current public/indexable page types.

A group configuration should support:

```text
group
enabled
change_frequency
priority
```

Example:

```text
Services
Enabled: true
Change frequency: monthly
Priority: 0.8
```

This means every Service page inherits:

```text
monthly
0.8
```

unless the Services group has no value, in which case the global default is used.

---

# 5. Sitemap Configuration

The implementation uses the Webtools Sitemap settings and global SEO defaults. Individual page SEO components do not contain sitemap override fields. This keeps sitemap policy centralized and avoids duplicate per-page controls.

Use Webtools Sitemap URL bundles/custom URLs for sitemap policy. Use the page-level `no_index` field when a page must not be indexed; the Next.js sitemap resolver excludes such pages automatically.

Avoid duplicating the same fields across schemas if a reusable component is appropriate.

## Webtools Sitemap Add-on

The Strapi admin also includes `strapi-plugin-webtools` with `webtools-addon-sitemap` at pinned compatible versions. The add-on is available under the Webtools admin area and serves the admin-managed sitemap at `/api/sitemap/default.xml`. It is configured with the same public hostname and seeded with the current public static/news URLs.

The Next.js `/sitemap.xml` endpoint remains the canonical public facade because it can resolve current service/blog records and apply SEO Manager defaults plus `no_index` at request time. Use the Webtools sitemap at `/api/sitemap/default.xml` for CMS-managed URL bundles and custom URLs; do not reintroduce the removed collection type or per-page sitemap override fields into the SEO component.

---

# 6. Important: Preserve Inheritance State

Do not assign automatic sitemap values to individual pages. Group fields may remain empty and inherit the global defaults:

```text
priority = 0.5
changeFrequency = daily
```

to individual entries.

Group values may remain:

```text
null
undefined
inherit
```

so the system can correctly determine that the value should come from the group.

For example:

```text
Service:
changeFrequency = null
priority = 0.9
```

must resolve to:

```text
changeFrequency = Services Group changeFrequency
priority = 0.9
```

Inheritance operates **per field**, not simply per object. Page-level `no_index` remains the only page-specific sitemap exclusion control.

Implement equivalent logic to:

```text
effectiveChangeFrequency =
  page.changeFrequency
  ?? group.changeFrequency
  ?? global.defaultChangeFrequency

effectivePriority =
  page.priority
  ?? group.priority
  ?? global.defaultPriority
```

---

# 7. Static Pages

Do not only handle Blog and Services.

Audit all public routes.

Static pages must also receive correct sitemap configuration.

For example:

```text
/
about-us
contact
services
news
blog
```

Determine whether each should:

1. have an individual sitemap configuration,
2. inherit from a Static Pages group,
3. belong to another logical group.

The architecture should remain maintainable when new static pages are added later.

Do not hardcode individual routes throughout the sitemap generator if a cleaner configuration model is possible.

---

# 8. Suggested Strapi Admin Structure

Refactor the Sitemap Manager so that it is understandable to a non-technical administrator.

Recommended structure:

```text
SEO Manager
└── Sitemap
    ├── Global Settings
    ├── Page Groups
    │   ├── Static Pages
    │   ├── Services
    │   ├── Blog
    │   └── News
    │
    └── Individual Overrides
```

The exact Strapi implementation may use:

* Single Types
* Collection Types
* Components
* Relations

Choose the simplest maintainable architecture after inspecting the existing schemas.

Do not create unnecessary content types purely to reproduce this visual hierarchy.

---

# 9. Example Expected Behavior

Assume:

```text
GLOBAL

changefreq = monthly
priority = 0.5
```

And:

```text
HOMEPAGE GROUP

changefreq = daily
priority = 1.0
```

```text
SERVICES GROUP

changefreq = weekly
priority = 0.8
```

```text
BLOG GROUP

changefreq = weekly
priority = 0.7
```

```text
NEWS GROUP

changefreq = daily
priority = 0.8
```

And one specific Service contains:

```text
Dental Implants

changefreq = daily
priority = 0.9
```

The generated sitemap should produce approximately:

```xml
<url>
  <loc>https://example.com/</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>https://example.com/services/dental-implants</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>https://example.com/services/dental-braces</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

Dental Implants and Dental Braces use the Services group configuration.

If the Services group has no frequency or priority configured, it inherits the corresponding global default.

---

# 10. Sitemap Inclusion Rules

Configuration inheritance must also work correctly with indexability.

Do not include a URL when:

```text
page is draft
OR
page is unpublished
OR
page SEO has noIndex = true
its group is disabled
OR
the URL is not publicly accessible
```

Recommended precedence:

```text
Individual exclusion
        ↓
Group enabled/disabled
        ↓
Global sitemap enabled
```

---

# 11. lastmod Handling

Audit the current `<lastmod>` implementation.

Use a meaningful content modification timestamp such as the latest relevant published/content update.

Do not change `<lastmod>` merely because the sitemap itself was regenerated.

Prefer:

```text
content.updatedAt
```

or the appropriate existing Strapi publication timestamp.

Ensure the generated value uses a valid ISO-8601 format.

---

# 12. SEO Consideration

Keep support for:

```text
changefreq
priority
```

because they are required by the current business/admin requirements.

However, do not let these fields drive crawling logic elsewhere in the application.

Treat them as sitemap metadata.

The correctness of the following is more important:

```text
URL
indexability
canonical URL
lastmod
publication state
```

Do not generate invalid or misleading sitemap entries merely to populate `changefreq` or `priority`.

---

# 13. Integration with Existing SEO Manager

Inspect the existing:

```text
SEO Manager - Default Metadata
SEO Manager - Robots.txt
SEO Manager - Sitemap Settings
SEO Manager - Redirects
SEO Manager - Canonical Rules
```

Do not create competing SEO configuration systems.

Refactor and extend the existing Sitemap Manager.

Reuse existing SEO components and page-level SEO fields whenever possible.

Sitemap behavior should also respect:

```text
noIndex
canonical configuration
publication state
locale
```

where those features already exist.

---

# 14. Performance

Do not make one Strapi API request for every sitemap URL.

Fetch data efficiently.

Prefer:

```text
one request per content type
batched queries
server-side caching
Strapi service aggregation
```

depending on the existing architecture.

Sitemap generation must remain scalable when there are:

```text
hundreds
thousands
or tens of thousands
```

of Service, Blog, or News entries.

Structure the implementation so that sitemap indexes can be introduced later if the URL count becomes large.

---

# 15. Do Not Hardcode Current Content Types

The current implementation appears focused mainly on:

```text
Services
Blog
News
```

Do not simply add more `include_xxx` boolean fields such as:

```text
include_services
include_blog
include_news
include_about
include_contact
include_page_x
include_page_y
```

This will not scale.

Refactor toward a reusable **group/content-type configuration model**.

Adding another indexable content type in the future should require minimal sitemap code changes.

---

# 16. Validation

Add validation for:

### Priority

```text
minimum: 0
maximum: 1
```

### Change Frequency

Only allow:

```text
always
hourly
daily
weekly
monthly
yearly
never
```

Prevent invalid configurations from causing `/sitemap.xml` to fail.

If a configuration is invalid or unavailable, safely fall back through:

```text
Individual
→ Group
→ Global
→ safe internal fallback
```

The production sitemap endpoint must never crash because one CMS configuration entry is incomplete.

---

# 17. Backward Compatibility

The current sitemap is already working.

Therefore:

* Preserve `/sitemap.xml`
* Preserve existing public URLs
* Preserve existing SEO functionality
* Preserve existing Strapi content
* Do not delete existing data without migration
* Do not break existing API consumers

If schema changes require migration, create the migration safely.

Map existing settings into the new model where possible.

---

# 18. Testing

After implementation, verify all inheritance scenarios.

At minimum test:

```text
Global only
Group overrides global
Individual overrides group
Individual overrides only priority
Individual overrides only changefreq
Group has only priority
Group has only changefreq
No individual configuration
No group configuration
Disabled group
Individual sitemap exclusion
noIndex page
Draft page
Unpublished page
New Service page
New Blog post
New News article
Static page
```

Explicitly verify:

```text
Individual > Group > Global
```

for every configurable field.

Also verify generated XML using actual Strapi data.

---

# 19. Expected Architecture

The final sitemap resolution should conceptually work like:

```text
                    Global Sitemap Settings
                         /         |        \
                        /          |         \
                       ▼           ▼          ▼
                 Services       Blog        News
                   Group         Group       Group
                  /    \          |           |
                 ▼      ▼         ▼           ▼
             Service  Service    Post       Article
                A        B
                │
                │ individual override
                ▼

        Final Effective Sitemap Configuration
```

For every URL:

```text
                  PAGE
                   │
          Individual Override?
              /          \
            YES           NO
             │             │
             ▼             ▼
          use it       Group Setting?
                         /       \
                       YES        NO
                        │          │
                        ▼          ▼
                    use group   Global Default
```

Resolution must be **per property**, not only per page.

---

# 20. Final Deliverable

After completing the implementation, provide a concise technical report containing:

1. Existing sitemap architecture discovered
2. Problems found
3. Strapi schemas modified
4. New reusable components/content types created
5. Group inheritance architecture
6. Individual override architecture
7. Sitemap resolution algorithm
8. Backward compatibility/migration performed
9. Files modified
10. Tests executed
11. Example final XML output

The final result must allow administrators to configure sitemap behavior at:

```text
GLOBAL LEVEL
        ↓
GROUP / CONTENT-TYPE LEVEL
        ↓
INDIVIDUAL PAGE LEVEL
```

with the strict priority:

```text
INDIVIDUAL OVERRIDE
        >
GROUP CONFIGURATION
        >
GLOBAL DEFAULT
```

The implementation must be scalable, maintainable, non-duplicative, and appropriate for an enterprise Strapi-based website.
