# Integration Phase — Production Asset Pipeline

Ensure no temporary design-source URLs remain in production code.

## Audit

Search the repository for:
- `figma.com/api/mcp/asset`;
- Stitch temporary asset hosts;
- data URI screenshots;
- placeholder image services;
- sample phone numbers;
- sample emails;
- mock patient images.

## Production rules

- CMS-owned media belongs in Strapi media and content relations when editors need control.
- Stable brand/static assets may live in the frontend public/assets convention.
- Use semantic filenames.
- Preserve originals where needed, but serve optimized formats/sizes through existing image tooling.
- Set meaningful alt content from CMS where appropriate.
- Decorative imagery should use empty alt.
- Do not ship screenshots of entire sections as a replacement for real HTML/CSS.
- Do not redraw an exact available design asset with an approximate SVG.

Produce an asset manifest and list any asset that still needs user approval/source clarification.
