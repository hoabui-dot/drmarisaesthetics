# Master Page Matrix

| Page | Main content sections | Desktop structure | Mobile transformation | Main image behavior | Primary conversion |
|---|---:|---|---|---|---|
| Home | 11 | multiple 2-col + dense card grids | flatten to 1-col; cards 2→1; doctor/testimonial rails | hero ~52–54%; article/service thumbnails; doctor 3:4 | Book Appointment / Consultation |
| About | 8 | hero 2-col; 2-card mission; 6-value row; doctors; service grid | hero stack; value/service cards 2→1; doctor rail | hero ~55–58%; doctor 3:4 | Book a Consultation |
| Services | 4 | hero 2-col; 10 cards 5×2; 5-value strip; CTA banner | hero stack; cards 2→1; banner stack | treatment 4:3/1:1; hero ~50% | Book Appointment |
| Service Detail | 13 | hero + anchor nav + editorial modules + pricing/FAQ/contact | horizontal anchors scroll; modules stack; procedure becomes vertical | technical visuals use contain; patient/result media use cover | Book Consultation / Service CTA |
| Knowledge | 6 | search intro; 7 category tabs; 3 features; list + sidebar | category rail scroll; sidebar moves below; article cards stack | feature 16:10; list thumbs 4:3 | Search / Book Consultation / Subscribe |
| Single Post | article + 4 sidebar modules | 66–70% article + 30–34% sidebar | one content flow; CTA/services below article | article hero ~16:9; related thumbnails | Book Consultation |
| Contact | 4 visible | hero 2-col; 4 contact cards; form/info; map/location | all blocks stack; contact cards 2×2→1 | hero 4:3/16:10; map 16:9 | Submit consultation request |

## Shared global modules
- Header / mobile navigation
- Footer
- Primary/secondary buttons
- Section heading
- Doctor card
- Service card
- Consultation form
- Article card
- Dark navy trust/CTA surfaces

## Highest-risk inconsistencies
1. Navigation labels/order differ across screenshots.
2. Contact is Vietnamese while most other screens are English.
3. Technology/Pricing/Doctors/Patient Info are referenced in navigation but not all have dedicated page designs.
4. Source is raster-first, so native responsive constraints and exact design tokens are unavailable.
