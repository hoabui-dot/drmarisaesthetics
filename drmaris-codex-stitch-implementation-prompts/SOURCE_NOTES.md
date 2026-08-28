# Research Notes Used to Build This Prompt Pack

This file is contextual guidance, not a substitute for the agent re-auditing the live repository.

## Repository observations
- Repository: `hoabui-dot/drmarisaesthetics`
- Main frontend directory observed: `dental-frontend`
- App Router routes observed include `[slug]`, `about-us`, `contact`, `customers`, `news`, `services`, root page, sitemap and robots.
- Frontend package scripts observed include `dev`, `build`, `type-check`, `lint`, Docker helper scripts, and Strapi helper scripts.
- Package versions observed include Next.js 15.4.x, React 19, TypeScript 5, Tailwind 3.4.x.
- Repository `.ai/PERFORMANCE_RULES.md` prescribes server-first rendering, SSG/ISR for public content, minimal API payloads, lazy loading, selective Framer Motion, reduced-motion support, and mobile-first performance.
- Repository `.ai/STRAPI_V5_MIGRATION_SKILL.md` warns that Draft & Publish migrations must preserve matching `document_id` semantics and must not incorrectly share component rows between draft/published records.
- A direct directory lookup for `dental-frontend/strapi-cms` did not resolve during research even though package scripts reference it. Therefore every execution prompt deliberately requires Codex to discover the active Strapi location rather than assume it.

## Figma mirror observations
File key: `zEjuuaNerFPeaJHsWlXmyo`

Frames:
- `2:2` Contact
- `2:215` Patient Results
- `2:498` Surgeon Profile
- `2:881` Rhinoplasty Master
- `2:1046` About Us
- `2:1357` Rhinoplasty Medical Blue
- `2:1868` Home

The Home frame confirms the Korean/editorial medical-blue visual system with Cormorant Garamond display typography, Plus Jakarta Sans UI/body typography, deep navy/clinical blue surfaces, large editorial spacing, surgeon/hospital imagery, international-patient journey, FAQ and consultation form.

Re-query Stitch during implementation because Stitch is the user's primary live design source.
