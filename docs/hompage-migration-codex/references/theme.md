# Design System — Theme & Colors

## Theme conclusion
The visual language is **Premium Clinical Blue**: clean medical whites, calm blue surfaces, dark-navy trust typography and a bright electric/medical-blue conversion accent.

The file does not contain usable native Figma color variables, so the following palette is a **normalized implementation proposal**, visually matched to the screenshots rather than claimed as exact source hex values.

## Recommended palette
| Token | Proposed value | Usage |
|---|---:|---|
| `brand.primary` | `#0B5FFF` | primary CTA, active nav, links, icons |
| `brand.primaryHover` | `#084FD6` | hover/pressed CTA |
| `brand.primarySoft` | `#EAF2FF` | icon circles, soft card surfaces |
| `brand.navy` | `#082E6F` | headings, deep sections |
| `brand.navyDark` | `#03245A` | footer / strongest dark background |
| `brand.sky` | `#DCEBFF` | highlighted surface / border accents |
| `surface.page` | `#FFFFFF` | page background |
| `surface.subtle` | `#F7FAFF` | alternating sections |
| `surface.blue` | `#F0F6FF` | cards, info sections |
| `text.primary` | `#102F66` | main headings/body emphasis |
| `text.body` | `#50627C` | paragraph text |
| `text.muted` | `#7D8BA1` | metadata, captions |
| `border.default` | `#DFE7F2` | card/input borders |
| `border.strong` | `#C9D7EA` | stronger dividers |
| `state.success` | `#1B9A65` | successful submission/status |
| `state.error` | `#D64545` | form error |
| `rating.star` | `#F4A51C` | ratings only |

## Surface hierarchy
1. White page surface.
2. Very pale blue section bands.
3. White cards with 1 px blue-gray border.
4. Strong navy brand bands for technology, metrics, newsletter and footer.
5. Bright blue reserved for action/selection rather than large body backgrounds.

## CTA rules
### Primary
- background: `brand.primary`;
- foreground: white;
- hover: `brand.primaryHover`;
- min height: 44–48 px;
- radius: 10–12 px or pill where shown;
- label weight: 600–700.

### Secondary outline
- transparent/white background;
- 1 px `brand.primary` border;
- blue text;
- hover uses `brand.primarySoft`.

### White-on-dark CTA
- white fill or white border on navy band;
- use blue text for filled white button.

## Contrast principle
Dark-navy text should be the default on white; pale blue should not be used for long body text. Bright primary blue is best for interactive elements and short labels.
