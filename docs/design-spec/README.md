# Smilux Dental Website — Design Specification

## Purpose
This folder converts the supplied Figma reference into an implementation-ready design specification for desktop → tablet → mobile.

## Source
- Figma file key: `laHILnraOznsr3xbCeYE6m`
- Canvas: `Page 1` (`0:1`)
- Design reference width in Figma: mostly ~549–563 px because the file stores page screenshots as raster layers.
- Native Figma variables found: **none** on the inspected Home frame.
- Native Figma motion data found: **none** on the inspected Home frame.

## Important interpretation rule
Most screens are raster screenshots rather than editable text/component layers. Therefore:

1. **Exact / source-derived**: page inventory, Figma node IDs, raster node dimensions, visible composition, section order, relative proportions, navigation/content visible in screenshots.
2. **Inferred / normalized**: font family, exact hex values, exact type scale, spacing tokens, breakpoints, interaction rules, animation timing. These are proposed implementation rules chosen to reproduce the visual language consistently.
3. Never treat the literal 549 px Figma screenshot width as the production desktop viewport. Implement against a normal responsive web container system.

## Page documents
- `pages/01-home.md`
- `pages/02-about.md`
- `pages/03-services.md`
- `pages/04-service-detail-template.md`
- `pages/05-knowledge-center.md`
- `pages/06-single-post.md`
- `pages/07-contact.md`

## Design system documents
- `design-system/01-theme-colors.md`
- `design-system/02-typography.md`
- `design-system/03-layout-spacing.md`
- `design-system/04-components.md`
- `design-system/05-images-media.md`
- `design-system/06-responsive.md`
- `design-system/07-motion.md`
- `design-system/08-accessibility.md`

## Architecture / consistency documents
- `architecture/01-information-architecture.md`
- `architecture/02-service-template.md`
- `architecture/03-open-issues.md`

## Frontend handoff
- `implementation/01-frontend-handoff.md`
- `implementation/02-css-token-proposal.md`

## Recommended canonical theme
Smilux uses a clean, premium clinical visual language:
- white / very-light-blue surfaces
- dark navy typography
- vivid medical blue as the interactive accent
- large high-key dental photography
- rounded white cards with light borders/shadows
- heavy, compact headings and low-contrast secondary copy
- recurring deep-navy footer and CTA surfaces

See the design-system documents for the normalized implementation tokens.
