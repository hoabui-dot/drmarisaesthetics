# Page Phase — Patient Results


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


**Stitch screen ID:** `afdcdb94f75742b8be793c299d811b85`
**Figma mirror frame:** `2:215`
**Expected route:** determine from existing routing; likely map/redirect the current patient/customer results route rather than inventing a duplicate URL.

## Goal

Implement the Clinical Blue patient-results gallery using real CMS result/case data.

## Required behavior

1. Audit current `/customers` or equivalent result/case route and preserve SEO URLs unless a deliberate redirect plan exists.
2. Retrieve the Stitch screen and identify:
   - hero/introduction;
   - category/procedure filters;
   - case cards;
   - before/after imagery;
   - patient/case metadata;
   - recovery/result text;
   - disclaimers;
   - CTA and footer.
3. Define the CMS fields required for filtering. Do not make visual filter buttons that are disconnected from data.
4. If filtering is client-side, fetch the minimum required initial data and keep the client boundary to the filter/gallery component.
5. For large galleries, paginate or progressively load; do not fetch all full-resolution media upfront.
6. Use optimized thumbnail/media variants where Strapi supplies them.
7. Respect any current consent/privacy flags. Do not expose unpublished/hidden case media.
8. Avoid unsupported medical outcome claims. Preserve disclaimers and case-specific context.
9. Make before/after comparison controls keyboard/touch accessible if the design includes interactive comparison.
10. No fabricated cases or placeholder patient results in production.

## Acceptance

- filters work with real data;
- direct links/SEO behavior are preserved;
- no layout shift from images;
- hidden/unpublished cases remain hidden;
- mobile gallery is usable;
- design closely matches Stitch;
- performance remains reasonable on low-CPU mobile devices.
