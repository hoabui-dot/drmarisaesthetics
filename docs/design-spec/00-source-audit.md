# Page Spec — Single Knowledge Post

**Figma node:** `28:80`  
**Visible source:** 549 × 824 raster screenshot.

## Page goal
Deliver a readable dental article with strong internal navigation, related-service conversion and specialist booking prompts.

## Primary layout
Desktop uses a **2-column editorial layout**:
- Article content: ~66–70%.
- Sidebar: ~30–34%.

## Section inventory
| # | Area | Description |
|---|---|---|
| 0 | Header | global navigation |
| 1 | Breadcrumb | Home → Knowledge → category/post |
| 2 | Article header | H1 + taxonomy/read-time/date/author |
| 3 | Lead callout | blue quote/info box |
| 4 | Hero image | service-specific clinical visual |
| 5 | Table of Contents | boxed anchor list |
| 6 | Article body | numbered sections + info cards |
| 7 | Related articles | horizontal card row |
| S1 | Search | sidebar search |
| S2 | Implant Services | related service list |
| S3 | Technology promo | OTI guided implant dark card |
| S4 | Specialist CTA | doctor profile + consultation button |
| 8 | Footer | global |

## Article Header
### Desktop
- Large H1 roughly 44–52 px.
- Metadata row beneath: category, read time, date, author.
- Breadcrumb uses small muted text.

### Mobile
- H1 34–40 px.
- Metadata wraps into 2 rows rather than shrinking.

## Lead Callout
- Rounded pale-blue box with large quote/icon on left.
- 2–4 lines of summary text.
- Keep sufficient contrast and 20–24 px padding.

## Hero Image
- Wide article image under the callout.
- Recommended ratio ~16:8.5 to 16:9.
- Rounded corners 12–16 px.

## Table of Contents
### Desktop
- Light bordered box.
- Numbered entries displayed in 2 columns.
- Anchors scroll to body sections.

### Mobile
- Collapsible TOC recommended, default expanded for SEO/accessibility or remember user state.
- One column.

## Article Body
Visible sections include topics equivalent to:
1. What Are Dental Implants?
2. Who Is a Good Candidate for Dental Implants?
3. Benefits of Dental Implants
4. Implant Structure at Smilux

### Content patterns
- numbered H2 headings;
- body paragraphs;
- bordered info/note callout;
- 4 compact benefit cards;
- technical illustration strip;
- “Continue reading below” transition.

### Typography
- Article body max text measure: 680–760 px.
- Body 16–18 px, line-height 1.65–1.8.
- H2 28–34 px.
- Do not center long-form article body text.

## Related Articles
- 4 small cards in one row in reference.
- Thumbnail + category + date + title.
- Mobile: 2 columns or horizontal scroll.

## Sidebar
### Search
- 100% sidebar width.
- Search button is vivid blue square/circle area on right.

### Implant Services
- Card list with thumbnail, title and arrow.
- Five visible related services.

### Technology Promo
- Deep navy/blue advertising card.
- Large OTI guided implant headline and device visual.
- White CTA.

### Specialist CTA
- Doctor portrait + title + short credentials + blue booking button.
- Can become sticky on desktop after sidebar reaches viewport, but must stop before footer.

## Mobile sidebar behavior
Move sidebar blocks after the article and before related/footer, in priority order:
1. Specialist CTA
2. Related services
3. Technology promo
4. Search (search may also remain near top)

## Motion
- Reading progress bar is an optional enhancement.
- TOC active section can update on scroll.
- Sidebar sticky transition should not animate aggressively.
