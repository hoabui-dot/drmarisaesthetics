# Source Audit & Figma Node Map

## Top-level structure
The Figma document contains one canvas only: `Page 1` (`0:1`).

| Design | Figma node(s) | Source form | Visible reference size |
|---|---:|---|---:|
| Home | `9:46` | composed frame containing multiple raster slices | 549 × 2696 |
| About | `10:48` | raster screenshot | 550 × 1649 |
| Services | `35:7` | raster screenshot | 549 × 1167 |
| Service detail template | `6:33`, `25:63`, `25:65` | 3 raster slices | 549 × 1542 + 549 × 132 + 549 × 162 |
| Knowledge / News | `26:74` | raster screenshot | 549 × 1000 |
| Single post | `28:80` | raster screenshot | 549 × 824 |
| Contact | `32:87` | cropped raster screenshot | 563 × 613 visible |

## Label map on canvas
- `HOME`
- `ABOUT`
- `TRANG DỊCH VỤ`
- `MẪU CHUNG CÁC TRANG DỊCH VỤ`
- `MẪU NEWS`
- `SINGLE POST`
- `MẪU LIÊN HỆ`

## Source limitations
The file is mainly a visual reference board. It does **not** expose enough native Figma text styles, components, constraints, variables, or auto-layout to recover exact CSS automatically.

### Consequences
- exact font family cannot be proven from the file;
- exact colors cannot be extracted as style variables;
- true desktop viewport width cannot be inferred from the raster layer width;
- responsive behavior is not designed as separate native frames;
- animation is not present in the inspected source.

## What this specification therefore does
It reconstructs a consistent production design system from the visible patterns and documents a responsive interpretation rather than blindly copying screenshot pixels.
