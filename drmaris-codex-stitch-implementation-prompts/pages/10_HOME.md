# Page Phase — Home


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


**Stitch screen ID:** `f02c3c29c60949a5940ea4908cc3e2c9`
**Figma mirror frame:** `2:1868`
**Expected route:** `/`

Retrieve this exact Stitch screen before coding.

## Known visual/content structure to verify in Stitch

The mirrored design contains, among other sections:
- hospital-based cosmetic surgery hero for international patients;
- direct surgeon care / surgical care process;
- prominent revision cosmetic surgery feature;
- Dr. Maris assessment/profile block;
- City International Hospital section and disclaimer;
- overseas/international patient planning timeline;
- international patient journey;
- final consultation/case submission CTA form;
- plastic surgery FAQ;
- shared medical-blue footer/header.

Treat this list as navigation only; Stitch is authoritative.

## Implementation requirements

1. Audit the existing `/` page and all CMS calls before changing markup.
2. Build the page from CMS data where content is editor-managed.
3. Preserve homepage SSG/ISR/revalidation behavior.
4. Keep the hero above-the-fold light: prioritize the correct hero image and avoid unnecessary client JS.
5. Do not duplicate international-patient timelines if the design contains two distinct sections; determine their exact purpose from Stitch and model appropriately.
6. Reuse shared doctor/hospital/CTA data rather than copying it into multiple page records where possible.
7. Preserve medical disclaimers verbatim from approved CMS/source content; do not invent medical claims.
8. Make the final form functional through the existing submission pipeline; do not render a dead visual form.
9. FAQ content should be CMS-editable if the existing SEO/content architecture supports it; preserve FAQ structured-data strategy.
10. Ensure desktop fidelity and design a natural mobile reflow rather than scaling the desktop canvas.

## Acceptance

- section order matches Stitch;
- design tokens and typography match;
- hero LCP is optimized;
- CTAs navigate/submit correctly;
- all CMS content has real fallback/error handling;
- no placeholder phone/email/image from the design is accidentally shipped over existing authoritative data;
- route passes smoke, lint/type-check, and visual comparison.
