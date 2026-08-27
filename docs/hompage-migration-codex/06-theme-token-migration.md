# 06 — Theme & Token Migration

## Problem

The repository's existing visual guideline is “Blue Sky Dental” and current global CSS includes legacy brand `#165197`, sky gradients, broad animations and a mix of hard-coded values. The new Figma audit resolves to a quieter **Premium Clinical Blue** system.

The homepage migration must not become a new pile of arbitrary hex values in JSX.

---

# Target normalized palette

| Semantic token | Target value |
|---|---:|
| `brand.primary` | `#0B5FFF` |
| `brand.primaryHover` | `#084FD6` |
| `brand.primarySoft` | `#EAF2FF` |
| `brand.navy` | `#082E6F` |
| `brand.navyDark` | `#03245A` |
| `brand.sky` | `#DCEBFF` |
| `surface.page` | `#FFFFFF` |
| `surface.subtle` | `#F7FAFF` |
| `surface.blue` | `#F0F6FF` |
| `text.primary` | `#102F66` |
| `text.body` | `#50627C` |
| `text.muted` | `#7D8BA1` |
| `border.default` | `#DFE7F2` |
| `border.strong` | `#C9D7EA` |
| `state.success` | `#1B9A65` |
| `state.error` | `#D64545` |
| `rating.star` | `#F4A51C` |

These values are normalized from raster references; they are not claimed to be native Figma tokens.

---

# Migration strategy

## Phase 1 — homepage-safe semantic aliases

Because only Homepage is being migrated first, avoid changing every legacy semantic variable in one commit if that would unexpectedly restyle all other pages.

Preferred pattern:

- introduce semantic variables for the Smilux v2 palette;
- expose them through Tailwind aliases;
- use the new semantic classes in migrated Homepage/Header/Footer components;
- migrate other pages later.

Possible CSS naming:

```css
:root {
  --smilux-primary: 11 95 255;
  --smilux-primary-hover: 8 79 214;
  --smilux-primary-soft: 234 242 255;
  --smilux-navy: 8 46 111;
  --smilux-navy-dark: 3 36 90;
  --smilux-text: 16 47 102;
  --smilux-body: 80 98 124;
  --smilux-border: 223 231 242;
}
```

Use the repository's actual Tailwind/CSS variable conventions when implementing; this is conceptual naming.

## Phase 2 — sitewide convergence

After About/Services/etc migrate, fold the temporary `smilux-*` aliases into the canonical theme and delete legacy tokens.

---

# Typography

Recommended canonical font: **Inter**, subject to available brand approval. The Figma raster does not prove the exact family.

Target hierarchy:

### Desktop
- H1: 56–64px typical homepage hero;
- H2: 36–48px depending section prominence;
- H3: 22–28px;
- body: 16–18px;
- small/meta: 12–14px.

### Mobile
- H1: 38–44px;
- H2: 30–36px;
- H3: 20–24px;
- body: 16–17px;
- small/meta: 12–14px.

Weights:

- H1: 700–800;
- H2: 700;
- card titles: 600–700;
- navigation/buttons: 600;
- body: 400.

Heading tracking: approximately `-0.02em` to `-0.03em` for major titles.

## Existing inconsistency to resolve

The repository currently has conflicting font assumptions between Tailwind/system stack, `globals.css` and typography documentation. Do not introduce a third uncontrolled font path. Choose one canonical font-loading implementation and make the homepage use it consistently.

---

# Component style rules

## Primary button

- solid `brand.primary`;
- white text;
- 44–48px minimum height;
- 10–12px radius or pill only where design shows;
- weight 600–700;
- hover uses `brand.primaryHover`;
- no shimmer/ping/glow loop.

## Cards

- white/light surface;
- 1px cool blue-gray border;
- modest radius, generally 12–20px based on scale;
- soft shadow, not glassmorphic by default;
- hover translation <=3–4px for informational cards.

## Dark bands

Use deep navy for Equipment and Footer. Bright primary blue should be reserved mainly for action/selection.

---

# CSS discipline

- Do not scatter `text-[#...]` / `bg-[#...]` throughout new components.
- Use tokens/semantic Tailwind aliases.
- A small number of one-off Figma-derived values can be used only when no semantic token is appropriate and should be documented.
- Do not change `html`/`body` in `globals.css` to fix a Homepage-specific layout bug.
- Use component-level `overflow-x-clip` rather than `hidden` where sticky descendants matter.
