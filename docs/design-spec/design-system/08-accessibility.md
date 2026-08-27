# Design System — Typography

## Source confidence
The supplied designs are raster screenshots, so the exact font family cannot be proven from native Figma text styles.

## Recommended canonical font
**Inter** is recommended because its proportions closely match the modern clinical sans-serif appearance and it supports the full required weight range and Vietnamese text.

Fallback stack:
`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

## Weight rules
| Purpose | Weight |
|---|---:|
| Hero / page H1 | 700–800 |
| Section H2 | 700 |
| Card title | 600–700 |
| Nav / button | 600 |
| Body | 400 |
| Emphasized body | 500–600 |
| Metadata | 400–500 |

## Desktop type scale
| Token | Size | Line-height | Use |
|---|---:|---:|---|
| `display-xl` | 64 px | 1.05 | Home hero only |
| `display-lg` | 56 px | 1.08 | major hero/page title |
| `h1` | 48 px | 1.12 | internal page hero |
| `h2` | 36 px | 1.2 | major section heading |
| `h3` | 28 px | 1.25 | subsection heading |
| `h4` | 22 px | 1.3 | card/feature heading |
| `body-lg` | 18 px | 1.65 | lead paragraph |
| `body` | 16 px | 1.65 | default body |
| `body-sm` | 14 px | 1.55 | card/meta copy |
| `caption` | 12 px | 1.4 | short labels only |

## Mobile type scale
| Token | Size | Line-height |
|---|---:|---:|
| `display-xl` | 44 px | 1.08 |
| `display-lg` | 40 px | 1.1 |
| `h1` | 36 px | 1.15 |
| `h2` | 30 px | 1.2 |
| `h3` | 24 px | 1.25 |
| `h4` | 20 px | 1.3 |
| `body-lg` | 17 px | 1.6 |
| `body` | 16 px | 1.65 |
| `body-sm` | 14 px | 1.55 |
| `caption` | 12 px | 1.4 |

## Responsive sizing
Use `clamp()` for major headings instead of breakpoint jumps, for example:
- hero: `clamp(2.5rem, 4.5vw, 4rem)`;
- internal H1: `clamp(2.25rem, 3.5vw, 3rem)`;
- H2: `clamp(1.875rem, 2.5vw, 2.25rem)`.

## Text measure
- Hero copy: max 520–600 px.
- Standard paragraph: max 620–680 px.
- Long-form article body: max 680–760 px.
- Avoid center-aligned paragraphs longer than ~3 lines.

## Case and tracking
- Headings: sentence/title case, tight tracking around `-0.02em` to `-0.03em` for large display.
- Eyebrows: uppercase optional, 12–13 px, 600–700, tracking `0.08em`.
- Buttons: uppercase only if product team keeps that visual language consistently; otherwise sentence case is easier to scan.
