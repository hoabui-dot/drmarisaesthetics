# Design System — Layout & Spacing

## Desktop container
Recommended implementation:
- max content width: 1200–1240 px;
- wide hero media may extend to 1320–1440 visual width;
- horizontal gutter: 24–32 px;
- 12-column desktop grid.

## Tablet / mobile grids
| Range | Grid | Gutter |
|---|---:|---:|
| ≥1280 | 12 columns | 24–32 px |
| 1024–1279 | 12 columns | 24 px |
| 768–1023 | 8 columns | 20–24 px |
| 480–767 | 4 columns | 20 px |
| <480 | 4 columns | 16 px |

## Spacing scale
Use an 8 px-biased system with a few compact values:
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120`.

### Typical application
- icon ↔ label: 8–12 px;
- title ↔ paragraph: 12–16 px;
- form field gap: 16–20 px;
- card padding: 20–28 px;
- grid/card gap: 16–24 px;
- section internal spacing: 32–48 px;
- section vertical padding desktop: 80–112 px;
- section vertical padding tablet: 64–80 px;
- section vertical padding mobile: 48–64 px.

## Radius system
| Token | Value | Use |
|---|---:|---|
| `radius.sm` | 8 px | inputs, small controls |
| `radius.md` | 12 px | buttons, compact cards |
| `radius.lg` | 16 px | content cards |
| `radius.xl` | 20–24 px | hero/feature panels |
| `radius.pill` | 999 px | pills/category badges |

## Shadows
Keep shadows medical/clean rather than dramatic.
- Card: `0 6px 24px rgba(10, 45, 95, .06)`.
- Hover: `0 10px 30px rgba(10, 45, 95, .10)`.
- Sticky header: `0 8px 24px rgba(8, 46, 111, .06)`.

## Section rhythm
The screenshots alternate:
- white section;
- pale blue/gradient section;
- white section;
- strong navy accent section.

Do not place multiple dark navy sections directly adjacent unless they are intentionally one visual band.
