# Phase 5 — Shared Design System and App Shell


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


Implement the shared visual foundation before page bodies.

## Scope

Audit the exact Header/Footer implementations in all required Stitch screens and identify the canonical shared shell.

Build/rework reusable primitives only where the design demonstrates reuse:
- container;
- section spacing;
- eyebrow/overline;
- editorial headings;
- body text styles;
- primary/secondary/text-link buttons;
- image frames;
- information list;
- timeline;
- FAQ presentation;
- CTA/form surfaces;
- cards used across multiple pages;
- responsive navigation;
- footer.

## Typography

Match Stitch accurately while integrating with existing Next.js font loading:
- Cormorant Garamond for editorial display headings when confirmed by Stitch;
- Plus Jakarta Sans for UI/body when confirmed.
Avoid duplicate font loading and layout shift.

## Color/token strategy

Use semantic tokens rather than scattering raw hex values through page code.
Map exact Stitch colors to the existing Tailwind/theme approach.
Do not globally overwrite legacy tokens until all routes using them are audited.

## Header

Preserve:
- existing valid navigation destinations;
- desktop and mobile navigation;
- contact/consultation CTA behavior;
- active state semantics;
- accessible menu interactions.

Do not blindly hardcode phone/location placeholders found in a visual mockup if production CMS/settings already provide authoritative values.

## Footer

Source real links/contact information from existing CMS/settings where appropriate.
Do not regress sitemap/navigation coverage merely because the design shows fewer sample links.

## Quality gate

Before page implementation:
- shared shell renders without hydration errors;
- keyboard navigation works;
- mobile menu works;
- no unexpected horizontal scroll at 320/375/768/1280 widths;
- header/footer do not break existing routes;
- targeted lint/type-check passes.
