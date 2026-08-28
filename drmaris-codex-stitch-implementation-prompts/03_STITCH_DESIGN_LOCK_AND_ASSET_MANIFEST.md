# Phase 3 — Stitch Design Lock and Asset Manifest


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


The goal of this phase is to prevent design drift and accidental mixing of screens.

## Step 1 — Verify Stitch

Using the connected Stitch MCP:
- verify project `11858440040360110865`;
- retrieve the current screen list;
- confirm each required ID exactly;
- note updated timestamps/revisions if the MCP exposes them;
- ignore the unnamed/empty screen.

Required IDs:
- Home: `f02c3c29c60949a5940ea4908cc3e2c9`
- Results: `afdcdb94f75742b8be793c299d811b85`
- Contact: `72a83ef98fc1400caafa5a899f93e124`
- Rhino Medical Blue: `ebea7782814d4f229db4d6c1a29daf8e`
- Rhino Master: `d157742981aa4f869cb110bad2ff2476`
- Doctor: `c6b066eca34a4ab68fada8b299831c25`
- About: `dc81d96c305b44dd9d94614b4458c76a`

## Step 2 — Design inventory

For every screen record:
- canvas/frame dimensions;
- desktop structure;
- mobile/responsive clues provided by Stitch;
- header/footer variant;
- section order;
- typography;
- color tokens;
- spacing rhythm;
- borders/radii/shadows;
- image crop behavior;
- buttons/links;
- forms;
- accordions/tabs/filters/sliders;
- sticky elements;
- motion/hover states;
- every downloadable image/icon/SVG asset.

Do not code yet.

## Step 3 — Establish reusable tokens

Compare all screens and identify shared values rather than creating page-specific magic numbers. Validate, do not blindly assume, likely values such as:
- deep medical navy;
- secondary clinical blue;
- soft blue surfaces;
- white/slate surfaces;
- Cormorant Garamond editorial headings;
- Plus Jakarta Sans UI/body text.

Integrate with existing project tokens where possible.

## Step 4 — Asset rules

Create an asset manifest:
`design source → screen → semantic name → local target path → usage → alt strategy`

- Download/copy exact source assets when licensing/source allows.
- Never depend on short-lived Stitch/Figma temporary asset URLs in production.
- Never commit base64 screenshots as production content.
- Preserve image quality and appropriate aspect ratios.
- Use Next/Image when compatible with the existing architecture.
- CMS-managed medical/patient imagery should resolve through Strapi media, with imported media mapped to the correct content entries if necessary.

## Required output

Create `design-manifest.md` and do not proceed until all required screens are retrievable and their roles are unambiguous.
