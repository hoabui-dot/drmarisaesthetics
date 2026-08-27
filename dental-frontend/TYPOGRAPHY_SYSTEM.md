# Homepage Typography Design System
> Reference guide extracted from HeroBlock, AboutBlock, ServicesBlock, CTABlock

---

## Font Family

All blocks use the **global font** defined in `tailwind.config` / `globals.css`.  
No per-block `font-[...]` overrides are used.  
Expected stack: **Inter → system-ui → sans-serif**

---

## Color Palette

| Role | Value | Where Used |
|---|---|---|
| Primary Brand Blue | `#165197` | H1, H2, Badge text, labels |
| Primary Blue muted | `#165197/80` | Hero subheading |
| Primary Blue subtle | `#165197/70` | Tertiary text, source lines |
| `text-foreground` | CSS var (dark blue-gray) | H2 (About/Services), card titles |
| `text-foreground-secondary` | CSS var (muted gray) | Card descriptions, body copy |
| `text-primary-600` | Tailwind alias → `#165197` range | Subtitles, "Learn more" links |
| `#4A6D95` | Mid-tone blue | CTA block subheading |
| `text-blue-600` | Tailwind | Badge eyebrow text |

---

## Typography Layers

### 1. Badge / Eyebrow Tag
```
font-size:    text-xs  sm:text-sm  md:text-base
font-weight:  font-semibold  (sometimes font-bold)
color:        text-blue-600  /  text-[#165197]
transform:    uppercase  tracking-widest
container:    rounded-full  bg-white/80  border border-blue-200/80  px-4 py-2
```

---

### 2. H1 — Hero Heading

> ⚠️ **Hero layout rule:**
> - **Split layout** (text on left or right, image on the other side) → start at **48px** on desktop
> - **Full-width layout** (text spans the full width, no side image) → start at **60px** on desktop

#### Split layout (left/right)
```
font-size:    text-2xl  sm:text-3xl  md:text-4xl  lg:text-5xl   (max 48px)
font-weight:  font-bold
color:        text-[#165197]
line-height:  leading-[1.1]
tracking:     tracking-tight
```

#### Full-width layout
```
font-size:    text-3xl  sm:text-4xl  md:text-5xl  lg:text-6xl   (max 60px)
font-weight:  font-bold
color:        text-[#165197]
line-height:  leading-[1.1]
tracking:     tracking-tight
```

---

### 3. H2 — Section Heading
```
font-size:    text-2xl  sm:text-3xl  md:text-4xl  lg:text-5xl  (xl:text-6xl in CTA)
font-weight:  font-bold
color:        text-foreground  OR  text-[#165197]
line-height:  leading-[1.15]
tracking:     tracking-tight
```

---

### 4. H3 — Card / Sub-section Title
```
font-size:    text-lg  sm:text-xl
font-weight:  font-bold
color:        text-foreground  (hover → text-[#165197])
```

---

### 5. Section Subtitle / Eyebrow Description
```
font-size:    text-base  sm:text-lg  md:text-xl   (20px at desktop)
font-weight:  font-normal  ← ALWAYS 400, never font-medium or higher
color:        text-primary-600  (Services)
              text-[#165197]/80  (Hero)
              text-[#4A6D95]    (CTA)
```

> ❌ **Never use `font-medium`, `font-semibold`, or `font-bold` on subtitles.** The `SectionSubtitle` component enforces `font-normal` by default. If you override with `subtitleClassName`, never include any font-weight above 400. Heavier subtitle weights compete with the H2 title and break visual hierarchy.

---

### 6. Body / Content Copy
```
font-size:    text-sm  sm:text-base  md:text-lg   (18px at desktop)
font-weight:  font-normal
color:        text-foreground-secondary  /  text-[#165197]/80
line-height:  leading-relaxed
```

> ✅ **Why 18px?** At 16px (text-base), body copy reads comfortably but feels standard. At 20px (text-xl), it competes with H3 card titles in dense layouts. 18px (`text-lg`) is the premium sweet spot — confident, breathable, and clinically authoritative without overpowering the hierarchy.

> **⚡ ServicesBlock exception:** Service card descriptions use `text-sm sm:text-base md:text-xl` **(20px on desktop)**. The cards are generously padded with short descriptions, making 20px ideal — it reads as premium and confident without competing with card titles in this layout.

> **📇 Contact card values (`VisitClinicSection`):** Address, phone, hours, and email values inside contact info cards must use `text-sm sm:text-base md:text-lg` **(18px on desktop)**. These are content body values, not UI labels, and must meet the minimum 18px rule.

> **🔵 Blue-color rule (MANDATORY):** All content body copy must use blue-family color tokens. `text-foreground-secondary` (`#2b6cb0`) is the default. Never use `text-neutral-*`, `text-slate-*`, or `text-gray-*` on content sections — these are grey-family tones that break the brand palette. Acceptable tokens: `text-foreground-secondary`, `text-[#165197]/80`, `text-primary-600`, `var(--color-foreground-secondary)`.

> **📏 Minimum 18px rule (MANDATORY):** Content body text must reach at least **18px on desktop** — always include `md:text-lg` in the responsive chain. The pattern `text-sm sm:text-base md:text-lg` is the canonical body copy scale. `md:text-base` (16px at desktop) is NOT acceptable for content paragraphs. Exception: badge/eyebrow micro-labels (`text-[10px]`/`text-xs`) and UI chip text are exempt.

---

### 7. CTA / Inline Link Text
```
font-size:    text-sm  sm:text-base  (primary button: text-sm sm:text-base md:text-xl)
font-weight:  font-semibold  →  font-bold
color:        text-primary-600  /  text-white (on dark button)
```

---

### 8. TrustSection — Stat Numbers (`TrustSection.tsx`)

> **Rule**: Stat numbers must be **visually subordinate** to section headings. 
> - **Desktop**: Fixed at **38px** (using `lg:text-[38px]`).
> - **Scale**: Proportional reduction for smaller screens to maintain balance.

```
Stat number:   text-xl (20px) → min-[375px]:text-2xl (24px) → sm:text-3xl (30px) → lg:text-[38px]
Stat suffix:   text-base (16px) → min-[375px]:text-lg (18px) → sm:text-xl (20px) → lg:text-2xl (24px)
font-weight:   font-bold
color:         text-primary-600
```

> ❌ **Do NOT** use `lg:text-5xl` or larger for stat numbers — they must stay at 38px on desktop to avoid overpowering the section title.

---

## Quick Reference Cheat-Sheet

| Layer | Size (mobile → desktop) | Weight | Color |
|---|---|---|---|
| Badge | xs → sm → base | semibold | `#165197` / blue-600 |
| **Main Hero (Video)** | 2xl → 4xl → 5xl → **6xl (60px)** | **bold** | **White** (Overlay) |
| H1 (split) | 2xl → 3xl → 4xl → **5xl (48px)** | bold | `#165197` |
| H1 (full-width) | 3xl → 4xl → 5xl → **6xl (60px)** | bold | `#165197` |
| H2 | 2xl → 3xl → 4xl → 5xl | bold | `foreground` / `#165197` |
| H3 (card) | lg → xl | bold | `foreground` |
| Subtitle | **base → lg → xl (20px)** | normal | `primary-600` / `#165197/80` / **White** |
| Body copy | **sm → base → lg (18px)** | regular | `foreground-secondary` / `#165197/80` |
| CTA link | sm → base | semibold/bold | `primary-600` |
| Button text | sm → base → xl (20px) | bold | white on `#165197` bg |
| **Stat number** | **xl → 2xl → 3xl → [38px]** | **bold** | **`primary-600`** |
| **Stat suffix** | **base → lg → xl → 2xl** | **bold** | **`primary-600`** |

## Important Notes

- **Responsive scale**: 
  - **Section Headers** (Subtitles/Descriptions in the top header): `text-base sm:text-lg md:text-xl` (20px desktop). They should **not** have `max-w-*` constraints and should span the full width of their section container.
  - **Body Content** (Paragraphs in cards/grid/about): `text-sm sm:text-base md:text-lg` (18px desktop). Updated from 16px for a more premium, readable feel.
- **Minimum 18px**: Body copy MUST reach `md:text-lg` (18px) at desktop. `md:text-base` is forbidden for content paragraphs. Only UI labels, badge chips, and eyebrow micro-text (`text-[10px]`/`text-xs`) are exempt.
- **Blue-family colors ONLY**: All content text must use blue-family tokens. **Never** use `text-neutral-*`, `text-slate-*`, or `text-gray-*` on content sections. Canonical choices:
  - `text-foreground-secondary` (`#2b6cb0`) — default for body paragraphs
  - `text-[#165197]/80` — slightly muted primary
  - `var(--color-primary-700)` — for stat values and prominent data
  - `var(--color-primary-400)` — for muted labels and attribution text
- **18px Exemptions** — the following UI elements are intentionally exempt from the minimum 18px rule:
  - **Data tables**: Dense tabular data uses `text-xs sm:text-sm md:text-base` (16px) — tables are compact by nature and 16px is standard for data grids
  - **Photo overlay labels**: BEFORE/AFTER pill chips on images use `text-xs sm:text-sm md:text-base` — compact UI overlays on media
  - **Image captions / disclaimers**: Photo credit lines and disclaimer captions may use `text-xs sm:text-sm` — these are intentionally de-emphasized secondary metadata
  - **Chart / graph labels**: Bar chart labels, shade comparison headings use `text-xs sm:text-sm md:text-base` — UI data labels inside charts
  - **Badge/eyebrow pills**: `text-[10px]`/`text-xs`/`text-sm` micro-labels remain exempt regardless of context
- **leading-relaxed** is mandatory for body copy blocks (readability).
- **tracking-tight** is mandatory for all H1/H2.
- Badge pills use `uppercase + tracking-widest`.
- **Main Homepage Hero (`VideoHero.tsx`)**: Special case using `text-white` on dark overlays. Uses `lg:text-6xl` (60px) and `font-bold` to be the primary focal point.
- **Service CTA Buttons**: All primary CTA buttons (hero & footer) across service pages use the common `BookingButton` component with a standardized size of `text-sm sm:text-base md:text-xl` (20px on desktop). This ensures consistent interaction and a premium clinical feel.
- **Hero Block (`HeroBlock.tsx`) Special Cases**: 
  - **Trust Indicators**: "Trusted by 2,000+ patients" and "Years of Excellence" use **mixed-case** with `font-medium` or `font-bold` accents for a more sophisticated, premium clinical feel. UPPERCASE is avoided here to maintain a high-end, non-aggressive design.
- **Hero titles in split layouts** cap at `lg:text-5xl` (48px); **full-width heroes** scale to `lg:text-6xl` (60px).
- **Dark Sections (`VideoHero`, `Commitment`)**: Use `text-white` or `text-white/90` for maximum legibility against dark backgrounds.

---

## Desktop Font Size Reference

| Desktop px | Tailwind class | Responsive scale | Use case |
|---|---|---|---|
| **60px** | `lg:text-6xl` | `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` | H1 full-width hero, Video hero title |
| **48px** | `lg:text-5xl` | `text-2xl sm:text-3xl md:text-4xl lg:text-5xl` | H1 split-layout hero, H2 section heading |
| **20px** | `md:text-xl` | `text-sm sm:text-base md:text-xl` | H3 card title, button text, CTA link, subtitle |
| **18px** | `md:text-lg` | `text-sm sm:text-base md:text-lg` | Body copy, card description, content paragraphs |

> **Rule**: Never use `lg:text-[72px]` or larger. 60px (`lg:text-6xl`) is the maximum for any heading.  
> **Rule**: Card titles (H3) cap at **20px** (`md:text-xl`) — `text-2xl` (24px) or larger on card titles breaks visual hierarchy against section H2.  
> **Rule**: Body copy must reach **18px** at desktop — `md:text-base` (16px) is forbidden for content paragraphs.
