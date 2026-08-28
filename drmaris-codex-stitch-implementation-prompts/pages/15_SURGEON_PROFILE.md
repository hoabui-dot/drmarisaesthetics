# Page Phase — Surgeon Profile


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


**Stitch screen ID:** `c6b066eca34a4ab68fada8b299831c25`
**Figma mirror frame:** `2:498`

## Goal

Implement the Dr. Maris / Dr. Tran Minh Huy surgeon profile without inventing credentials.

## Required structure

Retrieve Stitch and verify:
- editorial/profile hero;
- surgeon philosophy;
- credentials/training;
- professional journey/timeline;
- revision/complex case positioning;
- hospital-based surgery context;
- international patient information;
- CTAs/shared shell.

## Data integrity

1. Audit existing doctor CMS model/content.
2. Reuse authoritative doctor data across Home/About/Profile through a relation/shared source where appropriate.
3. Do not fabricate degrees, certifications, memberships, awards, years of experience, case counts, hospitals, or titles.
4. If Stitch contains a value that conflicts with current authoritative CMS/source data, flag it rather than silently overwriting.
5. Store structured credentials/timeline as structured fields/components when editors need to maintain them.
6. Use exact approved portrait/media assets.
7. Preserve medical YMYL tone and clear surgeon identity.

## Acceptance

- no unverified credential is introduced;
- structured profile remains editable;
- mobile typography and portrait crops match design intent;
- internal links/consultation CTAs work;
- metadata/Person or Physician-related schema follows the project's established SEO approach without unsupported fields.
