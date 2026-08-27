# Task: Audit and Implement Production-Ready Structured Data / Schema.org

You are a **Senior Technical SEO Engineer, Next.js Architect, Strapi CMS Engineer, and Schema.org Structured Data Specialist**.

The current project already contains an SEO Manager with features such as:

```text
Default Metadata
robots.txt
Sitemap
Redirects
Canonical Rules
```

The website uses **Next.js as the frontend and Strapi CMS as the content management system**.

Your task is to audit the existing architecture and implement a centralized, scalable, production-ready **Structured Data / JSON-LD system**.

Do **not** immediately add hardcoded schema markup.

First inspect the existing codebase, content models, SEO components, routing architecture, metadata logic, business information, page types, and current structured data implementation.

Reuse existing data and architecture wherever possible.

---

# 1. Audit Existing Structured Data

Before modifying anything, inspect:

* Next.js version and routing architecture
* App Router vs Pages Router
* Existing metadata generation
* Existing JSON-LD
* Existing `<script type="application/ld+json">`
* Existing SEO utilities
* Existing canonical URL utilities
* Strapi SEO components
* Global website settings
* Company/business information
* Contact information
* Social profiles
* Logo/media configuration
* Breadcrumb implementation
* Service content model
* Blog content model
* News content model
* Author information
* Page schemas
* Homepage
* About page
* Contact page
* Dynamic service pages
* Blog detail pages
* News detail pages
* Localization/i18n if available

Search the entire codebase for:

```text
schema.org
application/ld+json
JSON-LD
structuredData
structured_data
Organization
LocalBusiness
WebSite
WebPage
Article
BlogPosting
NewsArticle
BreadcrumbList
Service
FAQPage
```

Determine whether structured data already exists and whether it is valid, duplicated, incomplete, or incorrectly implemented.

Do not create duplicate JSON-LD.

---

# 2. Follow Current Google and Schema.org Rules

Structured data must:

* Represent content actually visible on the page
* Use valid Schema.org properties
* Follow current Google structured data policies
* Never fabricate reviews, ratings, prices, authors, addresses, awards, or other facts
* Never add schema solely to manipulate rich results
* Avoid duplicate entities
* Use canonical production URLs
* Remain consistent with visible page content

Do not assume that every Schema.org type generates a Google rich result.

Structured data should improve semantic understanding even when a specific schema type does not currently produce a rich-result feature.

---

# 3. Use JSON-LD

Use JSON-LD as the primary implementation:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org"
}
</script>
```

Do not scatter hardcoded JSON-LD across unrelated page components.

Build reusable server-side utilities/components for generating structured data.

Recommended conceptual architecture:

```text
Strapi Content
      +
Global Business Data
      +
Current Route
      +
SEO Configuration
      ↓
Structured Data Resolver
      ↓
JSON-LD Graph
      ↓
Next.js Page
```

## Page-specific structured data overrides

The global SEO Manager is not the place to author every page's Schema.org entity. It owns the site-wide graph defaults and the master `structured_data_enabled` switch. Each content type that has the reusable `seo.page-seo` component also exposes:

* `structured_data_enabled` — page-level opt-out; the global SEO Manager switch remains the master switch.
* `structured_data_json` — optional JSON-LD object, array, or `@graph` for facts visible on that specific page.

The frontend appends valid page-specific entities to the generated connected graph and deduplicates matching `@id` values. For example, an About page may store a visible physician entity in its Page SEO component:

```json
{
  "@type": "Physician",
  "@id": "https://example.com/about-us/#dr-tran-minh-huy",
  "name": "Dr. Tran Minh Huy",
  "jobTitle": "Plastic Surgeon",
  "worksFor": { "@id": "https://example.com/#organization" }
}
```

This field must only contain claims present in the page's visible content. Do not use it to add fabricated reviews, ratings, prices, locations, authors, or awards. Do not create a second structured-data content type for the same purpose.

---

# 4. Implement a Global Entity Graph

Prefer a connected entity graph rather than unrelated JSON-LD blocks.

Example:

```text
Organization / Business
        │
        ├── WebSite
        │
        └── WebPage
              │
              ├── BreadcrumbList
              ├── Service
              └── Article
```

Use stable `@id` values.

Example:

```text
https://example.com/#organization
https://example.com/#website
https://example.com/services/example/#webpage
```

Entities should reference each other using `@id` where appropriate.

---

# 5. Global Organization / Business Schema

Audit the business type before choosing the schema.

Do not blindly use `LocalBusiness`.

Select the most accurate Schema.org type based on actual business information.

Possible examples:

```text
Organization
LocalBusiness
Dentist
MedicalBusiness
MedicalClinic
ProfessionalService
```

Use only a type that accurately represents the actual organization.

Global structured data may include, when factual data exists:

```text
@type
@id
name
alternateName
url
logo
image
description
telephone
email
address
geo
openingHoursSpecification
sameAs
priceRange
```

Do not fabricate missing values.

Prefer retrieving these values from existing Strapi Website Settings rather than duplicating them in Structured Data settings.

---

# 6. WebSite Schema

Implement a global `WebSite` entity.

Conceptual example:

```json
{
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  "url": "https://example.com/",
  "name": "Website Name",
  "publisher": {
    "@id": "https://example.com/#organization"
  }
}
```

Use the production domain from the project's existing environment/domain configuration.

Never hardcode:

```text
localhost
127.0.0.1
development domains
```

into production structured data.

---

# 7. WebPage Schema

Generate a `WebPage` entity for public indexable pages.

Where appropriate include:

```text
@id
url
name
description
isPartOf
about
breadcrumb
primaryImageOfPage
datePublished
dateModified
```

Generate these properties from actual page content and SEO configuration.

Canonical URL should be the source of truth for:

```text
url
@id
```

where appropriate.

---

# 8. BreadcrumbList

Implement `BreadcrumbList` for pages that have a real hierarchical navigation structure.

Example:

```text
Home
→ Services
→ Dental Implants
```

Expected JSON-LD:

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://example.com/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Dental Implants",
      "item": "https://example.com/services/dental-implants"
    }
  ]
}
```

Breadcrumb structured data must match the actual logical site hierarchy.

Create breadcrumb generation centrally instead of manually hardcoding it into every page.

---

# 9. Service Pages

Audit the current Service Detail schema and determine the most appropriate structured data.

A Service detail page may use:

```text
Service
+
WebPage
+
BreadcrumbList
+
Organization / Provider reference
```

Example conceptual relationship:

```text
Service
    provider
        ↓
Organization / Business @id
```

Potential properties:

```text
@type: Service
name
description
url
image
provider
areaServed
serviceType
```

Only populate properties supported by actual CMS data.

Do not create false:

```text
offers
prices
ratings
reviews
```

if those values are not genuinely available and visible.

---

# 10. Blog Structured Data

For Blog detail pages, inspect the actual content type and use the appropriate schema, typically:

```text
BlogPosting
```

Support factual properties where available:

```text
headline
description
image
datePublished
dateModified
author
publisher
mainEntityOfPage
url
```

Example relationship:

```text
BlogPosting
     │
     ├── author
     │
     ├── publisher → Organization
     │
     └── mainEntityOfPage → WebPage
```

Do not invent an author when none exists.

Use the existing Strapi author relationship if available.

---

# 11. News Structured Data

Audit News content separately from Blog.

Where appropriate, use:

```text
NewsArticle
```

instead of automatically treating News as BlogPosting.

Possible fields:

```text
headline
description
image
datePublished
dateModified
author
publisher
mainEntityOfPage
```

Ensure dates originate from meaningful CMS publication/update fields.

---

# 12. Article Authors

If the website has real authors, editors, doctors, specialists, or content contributors, inspect their existing Strapi models.

Where appropriate generate:

```text
Person
```

with factual information such as:

```text
name
url
image
jobTitle
sameAs
worksFor
```

Do not automatically expose personal information that is not already intended to be public.

Where possible use reusable `@id` references.

Example:

```text
https://example.com/doctor/example/#person
```

---

# 13. Homepage

The homepage should normally include the global entities such as:

```text
Organization / appropriate Business type
WebSite
WebPage
```

Add other structured data only when supported by visible homepage content.

Do not add every available schema type simply because the homepage references multiple sections.

---

# 14. About Page

The About page may reinforce the primary organization/business entity.

Prefer referencing:

```text
#organization
```

instead of creating another duplicate Organization entity.

Example:

```text
AboutPage
    mainEntity
       ↓
Organization @id
```

Use `AboutPage` when it accurately represents the page.

---

# 15. Contact Page

Where appropriate use:

```text
ContactPage
```

and reference the existing global business entity.

Do not duplicate address/contact information across multiple conflicting entities.

Business information should ideally come from one centralized source.

---

# 16. FAQ Structured Data

Audit whether the website actually contains visible FAQ sections.

Do not automatically generate `FAQPage` schema for every accordion component.

Only use FAQ structured data when:

* Questions and answers are visible to users
* Content represents genuine FAQs
* It complies with current Google eligibility/policy requirements

Do not assume FAQ schema will generate a rich result.

Keep FAQ schema configurable and semantically correct even where Google does not expose FAQ rich results.

---

# 17. Review and Rating Schema

Be extremely careful with:

```text
Review
AggregateRating
ratingValue
reviewCount
```

Do not add ratings merely because testimonials exist.

Only generate review/rating structured data if:

* The data is genuine
* The data is visible
* The entity is eligible
* It complies with Google's policies
* The existing content model supports the required information

Do not generate self-serving review markup for Organization/LocalBusiness entities where prohibited.

---

# 18. Structured Data Manager in Strapi

Do not create a CMS field for every JSON-LD property if the data already exists elsewhere.

Prefer:

```text
Existing CMS Data
      ↓
Structured Data Resolver
```

instead of duplicating:

```text
Business name
Address
Phone
Logo
Article title
Service description
```

inside an additional Structured Data Manager.

The Structured Data Manager should primarily control behavior that cannot be reliably inferred.

Suggested global configuration:

```text
SEO Manager
└── Structured Data
    ├── Enabled
    ├── Organization / Business Type
    ├── Entity ID Configuration
    ├── Default Publisher
    ├── Social Profile References
    └── Advanced Overrides
```

Reuse existing:

```text
Website Settings
Default Metadata
Contact information
Social links
Media
Page SEO
```

where possible.

---

# 19. Page-Level Structured Data Overrides

## Strapi Admin SEO Field Guidance

The Strapi admin loads `src/admin/seo-help.css`. It adds a small `!` help affordance after each SEO field label and reveals a field-specific popover on hover or keyboard focus. The guidance covers metadata, Open Graph, robots, canonical URLs, sitemap defaults, and page-level Structured Data fields.

This is an admin-only presentation layer: it does not add content, change API responses, or inject JSON-LD by itself. Keep the field names stable when changing the SEO component so the guidance remains attached to the correct inputs. `sitemap_override` is intentionally not part of the SEO component; sitemap inclusion is controlled by sitemap groups/global defaults and `no_index`.

Most structured data should be automatically generated.

However, where necessary support page-level controls such as:

```text
structuredDataEnabled
schemaTypeOverride
additionalSchema
```

Do not make raw arbitrary JSON the default editing experience for normal CMS users.

If an advanced raw JSON-LD override is supported:

* restrict it to appropriate administrator roles
* validate JSON
* validate schema structure
* prevent invalid markup from crashing pages
* sanitize output appropriately

Automatic structured data should remain the default.

---

# 20. Structured Data Resolution Architecture

Build a reusable resolver.

Conceptually:

```ts
resolveStructuredData({
  pageType,
  content,
  globalSettings,
  canonicalUrl,
  breadcrumbs
})
```

The resolver determines the relevant entities.

Example:

```text
Service Detail
     ↓
WebPage
BreadcrumbList
Service
Organization reference
```

```text
Blog Detail
     ↓
WebPage
BreadcrumbList
BlogPosting
Person/Author
Organization publisher
```

```text
News Detail
     ↓
WebPage
BreadcrumbList
NewsArticle
Person/Author
Organization publisher
```

Avoid giant page components containing embedded schema-generation logic.

---

# 21. Reuse Existing Canonical Rules

Structured data URLs must use the existing Canonical Rules architecture.

Do not independently calculate URLs in:

```text
canonical
sitemap
structured data
OpenGraph
```

using different rules.

Create or reuse one centralized URL normalization utility.

Expected architecture:

```text
Production Domain
       +
Current Route
       +
Canonical Rules
       ↓
Canonical URL Resolver
       │
       ├── Metadata
       ├── Sitemap
       └── Structured Data
```

This prevents conflicting URLs between SEO systems.

---

# 22. Localization / hreflang

If the current project supports multiple languages:

* audit locale routing
* generate structured data using the current page locale
* use correct localized URLs
* use localized names/descriptions
* avoid mixing languages inside one entity unintentionally

Do not add multilingual logic if the project does not currently support localization.

---

# 23. Images

Structured data images must use absolute public URLs.

Do not output:

```text
/uploads/image.jpg
```

when the structured data requires:

```text
https://example.com/uploads/image.jpg
```

Reuse the existing Strapi media URL/CDN utility.

Where Article or News structured data requires images, use the best available actual content image.

Fallback behavior may use the existing global SEO/OpenGraph image when semantically appropriate.

---

# 24. Dates

For content such as BlogPosting and NewsArticle:

```text
datePublished
dateModified
```

must be accurate.

Use actual CMS fields such as:

```text
publishedAt
updatedAt
```

where semantically correct.

Do not change `dateModified` simply because a request was made or JSON-LD was regenerated.

Use valid ISO-8601 dates.

---

# 25. Prevent Duplicate JSON-LD

Audit layouts and nested components carefully.

Avoid output like:

```text
Layout → Organization
Page → Organization
SEO Component → Organization
Article Component → Organization
```

creating four independent copies.

Prefer a single connected `@graph`.

Example:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization"
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website"
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/page/#webpage"
    }
  ]
}
```

---

# 26. Security

Structured data contains CMS-controlled strings.

Ensure JSON-LD serialization cannot create an XSS vulnerability.

Do not blindly inject unsanitized user-controlled JSON into:

```html
<script>
```

Use safe serialization appropriate to the current Next.js architecture.

Escape dangerous sequences such as `<` where required.

Do not use unsafe HTML rendering unnecessarily.

---

# 27. Performance

Structured data generation should occur from data already fetched for the page whenever possible.

Avoid:

```text
Page data request
+
separate Organization request
+
separate SEO request
+
separate Structured Data request
```

for every page if existing global data fetching/cache architecture can provide those values efficiently.

Reuse the project's current:

```text
server cache
fetch cache
revalidateTag
ISR
webhooks
```

architecture.

---

# 28. Existing Webhook Architecture

The codebase already uses Strapi webhooks and Next.js revalidation.

Structured data must automatically update when underlying CMS content changes.

Expected flow:

```text
Strapi content updated
        ↓
Existing webhook
        ↓
Next.js revalidation
        ↓
Page/cache invalidated
        ↓
Page regenerated
        ↓
Structured Data regenerated
```

Do not build a second independent structured-data synchronization system.

For example:

```text
Service title changes
→ Service page revalidated
→ Service JSON-LD automatically changes
```

Likewise:

```text
Blog author changes
Blog publication date changes
Business phone changes
Business address changes
```

must be reflected after the appropriate existing cache invalidation.

---

# 29. Noindex and Non-Public Pages

Do not emit SEO-focused structured data for pages that should not be publicly indexable unless there is a clear technical reason.

Respect existing:

```text
noIndex
publication status
access restrictions
canonical rules
```

Draft CMS content must never leak into production structured data.

---

# 30. Error Handling

Invalid optional CMS data must not crash production rendering.

For example, if:

```text
author image missing
logo missing
description missing
social URL missing
```

omit the unsupported property.

Do not generate:

```json
{
  "image": null,
  "sameAs": [null],
  "telephone": ""
}
```

Build clean JSON-LD containing only meaningful values.

---

# 31. Validation Utilities

Create reusable validation/cleanup utilities where appropriate.

Examples:

```text
removeUndefinedValues()
toAbsoluteUrl()
normalizeCanonicalUrl()
normalizeImageUrl()
normalizeSchemaDate()
buildEntityId()
```

Follow the codebase's existing utility patterns.

Do not introduce unnecessary abstractions.

---

# 32. Required Testing

Test actual rendered HTML, not only TypeScript objects.

At minimum verify:

### Homepage

```text
Organization / Business
WebSite
WebPage
```

### About

```text
AboutPage
Organization relationship
Breadcrumb
```

### Contact

```text
ContactPage
Business reference
Breadcrumb
```

### Service Detail

```text
WebPage
Service
BreadcrumbList
Provider relationship
```

### Blog Detail

```text
WebPage
BlogPosting
BreadcrumbList
Author
Publisher
```

### News Detail

```text
WebPage
NewsArticle
BreadcrumbList
Author
Publisher
```

---

# 33. Validate Generated JSON-LD

Validate representative URLs using appropriate structured data testing tools and Schema.org validation.

Check for:

```text
invalid JSON
missing required properties
invalid URLs
duplicate entities
incorrect @id
wrong schema type
development URLs
missing image URLs
invalid date formats
conflicting canonical URLs
```

Where Google does not support a rich result for a valid Schema.org type, do not treat that as an implementation failure.

---

# 34. View-Source Verification

Confirm structured data is present in server-rendered HTML.

Do not rely solely on client-side execution where it can be avoided.

Verify:

```html
<script type="application/ld+json">
```

is available to crawlers in the resulting page HTML.

---

# 35. Development vs Production

Ensure production JSON-LD never outputs development URLs such as:

```text
http://localhost:3000
http://localhost:1234
127.0.0.1
```

Use the same centralized site URL/environment configuration already used by:

```text
canonical URLs
sitemap.xml
robots.txt
OpenGraph
```

Add safe production validation if appropriate.

---

# 36. Maintainability

The system must make adding a new page type straightforward.

Do not require developers to duplicate an entire JSON-LD implementation.

Prefer:

```text
Page Type
    ↓
Schema Resolver
    ↓
Reusable Entity Builders
```

Example structure, adapted to the existing codebase where appropriate:

```text
seo/
├── structured-data/
│   ├── organization.ts
│   ├── website.ts
│   ├── webpage.ts
│   ├── breadcrumb.ts
│   ├── service.ts
│   ├── article.ts
│   ├── person.ts
│   ├── resolver.ts
│   └── utils.ts
```

Do not force this exact directory structure if the project already has a better established convention.

---

# 37. Implementation Principles

Follow these rules strictly:

1. Audit before modifying.
2. Extend the existing SEO Manager rather than creating a competing system.
3. Reuse existing CMS data instead of duplicating it.
4. Generate schema automatically wherever possible.
5. Never fabricate structured data.
6. Use stable `@id` references.
7. Prefer connected `@graph` entities.
8. Respect canonical URLs.
9. Respect publication and noindex status.
10. Use absolute production URLs.
11. Avoid duplicate entities.
12. Safely serialize JSON-LD.
13. Preserve existing webhook/revalidation architecture.
14. Preserve all current website functionality.
15. Do not break existing metadata, sitemap, robots, redirects, or canonical logic.
16. Keep the architecture extensible for future page/content types.

---

# 38. Expected Architecture

The final system should conceptually work as follows:

```text
                         STRAPI CMS
                             │
             ┌───────────────┼────────────────┐
             │               │                │
        Website Data      Page Data       SEO Data
             │               │                │
             └───────────────┼────────────────┘
                             │
                             ▼
                    Structured Data Resolver
                             │
              ┌──────────────┼───────────────┐
              │              │               │
              ▼              ▼               ▼
         Global Entity    Page Entity     Content Entity
              │              │               │
      Organization        WebPage          Service
      WebSite             Breadcrumb       Article
                                            Person
                             │
                             ▼
                         JSON-LD @graph
                             │
                             ▼
                         Next.js Page
                             │
                             ▼
                    Search Engine Crawler
```

And content changes should follow:

```text
Strapi
   │
   │ content update
   ▼
Existing Webhook
   ▼
Next.js Revalidation
   ▼
Page Cache Invalidated
   ▼
Page Regenerated
   ▼
JSON-LD Regenerated
```

---

# 39. Expected Final Result

The project should have one centralized Structured Data system that:

```text
Automatically generates schema from CMS content
Uses the correct schema for each page type
Connects entities through stable @id references
Uses canonical production URLs
Updates automatically through existing revalidation
Avoids duplicated business data
Avoids fake SEO data
Produces valid server-rendered JSON-LD
Scales to future content types
```

The CMS should remain easy for non-technical administrators.

Administrators should manage normal business/content information rather than manually writing JSON-LD for every page.

---

# 40. Final Technical Report

After implementation, provide a concise technical report containing:

1. Existing structured data implementation discovered
2. Existing SEO architecture reused
3. Structured data issues found
4. Schema types implemented
5. Strapi schemas/components modified
6. Structured Data Manager settings added
7. Reusable JSON-LD builders created
8. Entity `@id` strategy
9. Canonical URL integration
10. Existing webhook/revalidation integration
11. Files modified
12. Pages tested
13. Structured data validation results
14. Any warnings from validation tools
15. Any schema types intentionally not implemented and why
16. Remaining technical SEO recommendations

Do not mark the task complete until actual rendered production-like pages have been inspected and the generated JSON-LD has been validated for correctness.
