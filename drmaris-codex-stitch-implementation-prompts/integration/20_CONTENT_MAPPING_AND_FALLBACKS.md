# Integration Phase — Content Mapping, Null States, and Fallbacks

Review every implemented page for content-source correctness.

## Required audit

For each rendered text/image/link, identify whether it comes from:
- Strapi page record;
- relation/global settings;
- code constant;
- derived data.

Eliminate accidental hardcoding of CMS-owned content.

## Null/optional behavior

- Optional section absent → omit section cleanly.
- Missing optional image → use the approved layout variant without image; do not show a broken placeholder.
- Missing required content → fail visibly in development/logging and use the project's safe production behavior.
- Empty arrays → omit controls such as filters/timelines rather than rendering dead UI.
- Invalid CMS link → sanitize/validate according to existing utilities.
- Media → resolve through the project's Strapi media helper.

Do not create generic filler text.

## Type safety

Create/extend typed CMS response models and mapping functions.
Avoid spreading raw Strapi payload shapes across presentational components.
Do not solve schema mismatch with project-wide `any`.

## Verification

Test at least:
- full data;
- optional section missing;
- missing media;
- empty FAQ;
- draft content;
- unpublished content;
- deleted content where applicable.
