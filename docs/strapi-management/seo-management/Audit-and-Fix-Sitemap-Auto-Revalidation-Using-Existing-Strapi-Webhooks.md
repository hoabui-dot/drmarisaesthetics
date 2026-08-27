# Task: Audit and Fix Sitemap Auto-Revalidation Using Existing Strapi Webhooks

You are a **Senior Full-Stack Engineer, Next.js Architect, Strapi CMS Engineer, and Technical SEO Engineer**.

The current project already uses **Strapi webhooks** to notify the Next.js frontend when CMS content changes.

Your task is to inspect the existing implementation and ensure that `/sitemap.xml` is automatically regenerated whenever relevant public content is:

* Created
* Updated
* Published
* Unpublished
* Deleted

Do **not** introduce a second parallel event system if the existing webhook architecture can be extended.

---

# 1. Required Architecture

The final flow must follow this architecture:

```text
Strapi
   │
   │ Service deleted / unpublished / updated
   ▼
Webhook / lifecycle event
   │
   ▼
Next.js revalidate
   │
   ▼
Invalidate sitemap cache
   │
   ▼
/sitemap.xml regenerated
   │
   ▼
Deleted URL disappears
```

The same mechanism must work for all sitemap-relevant content types, not only Services.

---

# 2. Audit Existing Webhook System First

Before modifying code, inspect:

* Current Strapi webhook configuration
* Webhook endpoints
* Webhook payload structure
* Events currently subscribed to
* Next.js webhook/revalidation API route
* Authentication or webhook secret validation
* Existing `revalidatePath`
* Existing `revalidateTag`
* Existing cache tags
* Existing sitemap implementation
* How `/sitemap.xml` currently fetches data
* Whether sitemap data is statically generated, dynamically generated, cached, or build-time generated
* Any CDN or additional cache layer
* Existing content publishing workflow

Determine whether sitemap invalidation already exists but is incomplete or incorrect.

Do not rewrite working webhook functionality unnecessarily.

---

# 3. Sitemap Must Be Derived from Current CMS Content

The sitemap must not depend on a manually maintained list of URLs.

It should be generated from currently valid content in Strapi.

Conceptually:

```text
Current Published Content
        +
Sitemap Configuration
        ↓
Generate sitemap.xml
```

Relevant queries must only include content that is:

```text
published
public
indexable
not excluded from sitemap
```

If a content record no longer exists, it must no longer appear in the generated sitemap.

---

# 4. Required Content Events

The existing webhook system must invalidate the sitemap when a sitemap-relevant entity receives any of these events:

```text
create
update
publish
unpublish
delete
```

Audit the actual Strapi webhook event names/version semantics and use the correct events supported by the current Strapi version.

Do not assume event naming without inspecting the project.

---

# 5. Handle All Sitemap-Relevant Content Types

At minimum inspect:

```text
Service Detail
Blog
News
Page
Homepage
About Page
Contact Page
```

Also inspect the codebase for any additional publicly accessible content types.

Do not hardcode sitemap invalidation for only:

```text
services
blog
news
```

Create a centralized mechanism for determining whether an event affects the sitemap.

For example:

```text
SITEMAP_RELEVANT_CONTENT_TYPES
```

or an equivalent maintainable architecture.

---

# 6. Next.js Revalidation

When the webhook receives a relevant content event, the Next.js application must invalidate the sitemap cache.

Use the caching system already used by the project.

Prefer one of the existing patterns where appropriate:

```ts
revalidatePath('/sitemap.xml')
```

or:

```ts
revalidateTag('sitemap')
```

If the sitemap data fetching layer uses a cache tag, prefer invalidating that tag rather than introducing unrelated caching logic.

Example conceptual flow:

```text
Webhook
   ↓
Validate event
   ↓
Check content type
   ↓
Is sitemap relevant?
   ↓ YES
Invalidate sitemap cache
```

---

# 7. Do Not Perform Expensive Revalidation Unnecessarily

Do not invalidate the sitemap for unrelated CMS entities.

For example, changes to purely internal records should not trigger sitemap regeneration.

Create a clear distinction between:

```text
Sitemap-relevant content
```

and:

```text
Non-sitemap content
```

The implementation should remain easy to extend when future content types are introduced.

---

# 8. Delete Behavior

This is a critical test case.

Assume this URL currently exists:

```text
/services/dental-braces
```

Before deletion:

```xml
<url>
  <loc>https://example.com/services/dental-braces</loc>
</url>
```

When the administrator deletes the corresponding Service in Strapi:

```text
DELETE Service
      ↓
Strapi webhook
      ↓
Next.js revalidation
      ↓
Sitemap cache invalidated
      ↓
Next request regenerates sitemap
```

The regenerated sitemap must no longer contain:

```text
/services/dental-braces
```

No manual sitemap cleanup should be required.

---

# 9. Unpublish Behavior

Unpublishing content must behave similarly to deletion.

Example:

```text
Published Service
        ↓
Unpublish
        ↓
Webhook
        ↓
Invalidate sitemap
        ↓
Regenerate
        ↓
URL removed
```

Draft or unpublished content must never remain in `/sitemap.xml`.

---

# 10. Update Behavior

If an indexable content entry is updated:

```text
Service updated
      ↓
Webhook
      ↓
Invalidate sitemap
```

The regenerated sitemap should reflect relevant changes such as:

```text
lastmod
slug
canonical/public URL
sitemap configuration
```

If the slug changes:

```text
/services/old-slug
→
/services/new-slug
```

the old URL must disappear from the sitemap and the new URL must appear.

Also verify whether Redirect Manager needs to handle the old URL separately.

Do not automatically create redirects unless the existing application is designed to do so.

---

# 11. Publish Behavior

When new content is published:

```text
New Service
   ↓
Publish
   ↓
Webhook
   ↓
Invalidate sitemap
   ↓
Regenerate
   ↓
New URL appears
```

Draft creation alone should not expose the URL if the content is not publicly published.

---

# 12. Sitemap Configuration Inheritance

The project may use sitemap configuration inheritance:

```text
Individual Override
        ↓
Group Configuration
        ↓
Global Default
```

Preserve this logic.

Webhook/revalidation is responsible only for ensuring the sitemap is refreshed.

The sitemap generator remains responsible for resolving:

```text
priority
changefreq
exclusion
indexability
lastmod
```

for each current URL.

Do not mix content lifecycle handling with sitemap configuration resolution unnecessarily.

---

# 13. Sitemap Cache Strategy

Audit how the sitemap is cached.

Possible cases include:

```text
Next.js Data Cache
Full Route Cache
fetch cache
unstable_cache
ISR
CDN cache
custom server cache
```

Ensure invalidation targets the actual cache used by `/sitemap.xml`.

Do not call:

```ts
revalidatePath()
```

and assume it works if the sitemap data is actually cached separately using tags.

Likewise, do not introduce `revalidateTag()` if the current sitemap has no tagged cache.

Trace the actual caching flow.

---

# 14. Avoid Build-Time-Only Sitemap Generation

If `/sitemap.xml` is currently generated only at:

```text
next build
```

or deployment time, refactor it so CMS updates do not require a new deployment.

The final architecture must support runtime regeneration after webhook invalidation.

A content editor must not need a developer deployment just to remove a deleted URL from the sitemap.

---

# 15. Webhook Reliability

Inspect the existing webhook implementation for:

```text
authentication
shared secret validation
payload validation
error handling
logging
timeouts
duplicate events
retry behavior
```

Do not expose a public unauthenticated revalidation endpoint.

Invalid webhook requests must not be able to trigger arbitrary cache invalidation.

Where the project already has webhook security, preserve and reuse it.

---

# 16. Safe Failure Behavior

If Strapi is temporarily unavailable during sitemap regeneration:

* `/sitemap.xml` must not crash the entire application
* Avoid generating obviously incorrect empty sitemaps if the previous valid cache can safely remain available
* Log the failure appropriately
* Preserve existing resilience behavior where possible

Do not silently swallow important errors.

---

# 17. CDN / Proxy Cache

Inspect whether production uses an additional layer such as:

```text
Vercel CDN
Cloudflare
CloudFront
Nginx
reverse proxy cache
```

If `/sitemap.xml` is cached outside Next.js, ensure the existing architecture allows refreshed XML to reach crawlers promptly.

Do not add provider-specific invalidation unless the project actually requires it.

Document any external cache limitation discovered.

---

# 18. Required Test Matrix

Test the actual implementation using real CMS records.

### Service

```text
Create draft Service
→ must NOT appear

Publish Service
→ must appear

Update Service
→ sitemap refreshed

Change Service slug
→ old URL disappears
→ new URL appears

Unpublish Service
→ URL disappears

Republish Service
→ URL appears again

Delete Service
→ URL disappears
```

### Blog

Run the same lifecycle tests for Blog entries.

### News

Run the same lifecycle tests for News entries.

### Other Pages

Test all other sitemap-relevant content types discovered during the audit.

---

# 19. Cache Verification

Do not only verify source code.

Verify actual runtime behavior.

For each relevant event:

1. Request `/sitemap.xml`
2. Confirm current URL exists
3. Perform CMS action
4. Confirm webhook is received
5. Confirm Next.js invalidation executes
6. Request `/sitemap.xml` again
7. Confirm XML reflects the latest Strapi state

Example:

```text
Before:

/services/dental-braces
/services/dental-implants

DELETE dental-braces

After:

/services/dental-implants
```

The test must prove that stale cache is actually removed.

---

# 20. Add Observability

Where appropriate, log sitemap invalidation events.

Example:

```text
[Webhook]
event: entry.delete
contentType: service-detail

[Sitemap]
cache invalidated

[Sitemap]
next request will regenerate sitemap
```

Avoid excessive production logging, but provide enough information to diagnose failed sitemap updates.

---

# 21. Avoid Duplicate Systems

Do not create:

```text
Strapi Webhook
+
new lifecycle listener
+
separate cron job
+
manual sitemap refresh button
```

unless there is a demonstrated technical requirement.

The project already uses webhooks.

The preferred architecture is:

```text
Existing Strapi Webhook System
            ↓
Existing Next.js Revalidation Layer
            ↓
Extend to invalidate sitemap
```

Keep one clear source of truth.

---

# 22. Expected Final Architecture

The result should conceptually be:

```text
                  STRAPI CMS
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Service         Blog          News
        │             │             │
        └─────────────┼─────────────┘
                      │
              Content Lifecycle
                      │
       create/update/publish/
        unpublish/delete
                      │
                      ▼
                  WEBHOOK
                      │
                      ▼
          Next.js Revalidation API
                      │
                      ▼
             Validate Webhook
                      │
                      ▼
      Is content sitemap-relevant?
                /           \
              NO             YES
              │               │
             stop             ▼
                      Invalidate Sitemap
                              │
                              ▼
                       /sitemap.xml
                              │
                       next request
                              ▼
                       Query Strapi
                              │
                              ▼
                 Current Published Content
                              │
                              ▼
                  Apply Sitemap Rules
                              │
                              ▼
                   Fresh sitemap.xml
```

---

# 23. Expected Result

After the fix, administrators should be able to modify CMS content without any manual sitemap maintenance.

The following must be true:

```text
DELETE
→ sitemap URL removed

UNPUBLISH
→ sitemap URL removed

PUBLISH
→ sitemap URL added

CREATE DRAFT
→ sitemap unchanged

UPDATE
→ sitemap refreshed

SLUG CHANGE
→ old URL removed
→ new URL added
```

The sitemap must always represent the latest **published and indexable** content after webhook-driven cache invalidation.

---

# 24. Final Technical Report

After implementation, provide a concise report containing:

1. Existing webhook architecture discovered
2. Existing sitemap caching mechanism
3. Root cause of any stale sitemap issue
4. Files modified
5. Webhook events handled
6. Sitemap-relevant content types
7. Cache invalidation method used
8. Security validation used
9. Tests executed
10. Example sitemap before and after delete/unpublish
11. Any CDN/cache limitations
12. Remaining risks or recommended improvements

Do not mark the task complete until runtime testing confirms that deleted and unpublished URLs actually disappear from `/sitemap.xml` without requiring a redeployment.
