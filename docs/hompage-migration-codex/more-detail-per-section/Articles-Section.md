# UI Implementation Spec — Homepage Featured Articles Section

## 1. Identity

| Field                       | Value                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Route                       | `/`                                                                                                                                 |
| Section ID                  | `home-articles`                                                                                                                     |
| Section name                | `Homepage Featured Articles`                                                                                                        |
| Position in page            | Immediately after `home-press`                                                                                                      |
| Screenshot scope            | Complete Featured Articles section visible in supplied desktop screenshot                                                           |
| Section type                | Editorial article showcase                                                                                                          |
| Desktop composition         | `1 featured article + 3 compact articles`                                                                                           |
| CMS integration             | Strapi CMS                                                                                                                          |
| Primary implementation goal | Reproduce the asymmetric editorial article layout while keeping article content reusable from a canonical Strapi Article collection |
| Overall evidence quality    | High for desktop composition and card hierarchy; Medium for exact sizing; Low for responsive behavior and interactions              |

> **Critical layout rule:** This section is **not a uniform 4-card grid**. The first article is a large featured card on the left, while the remaining three articles are rendered as compact horizontal rows on the right.

> **Critical CMS architecture:** Homepage should preferably **reference existing Article records from the canonical Strapi Article collection** rather than duplicating article title, image and description inside Homepage.

> **Critical featured-card rule:** The article displayed in the large left card and articles displayed in the right list use the same core Article data but different frontend layout variants.

---

# 2. Scope Boundary

## Included in this spec

* OBSERVED — Eyebrow:

  * `DENTAL INSIGHTS`
* OBSERVED — Main heading:

  * `Featured Articles`
* OBSERVED — Small blue decorative line beneath heading.
* OBSERVED — One large featured article on the left.
* OBSERVED — Three compact article entries on the right.
* OBSERVED — Featured article contains:

  * large image,
  * article title,
  * short excerpt,
  * `READ MORE`,
  * arrow.
* OBSERVED — Compact articles contain:

  * thumbnail,
  * article title,
  * short excerpt,
  * `READ MORE`,
  * arrow.
* OBSERVED — Right-side compact articles are stacked vertically.
* OBSERVED — Thin horizontal separators exist between compact article rows.
* INFERRED — Article title/image/excerpt should come from a reusable Article content type.
* INFERRED — Homepage article order should be configurable through Strapi.
* INFERRED — First selected article can drive the featured layout unless Product prefers a dedicated `featuredArticle` field.

## Excluded from this spec

* UNKNOWN — Article publication date.
* UNKNOWN — author display.
* UNKNOWN — category display.
* UNKNOWN — reading time.
* UNKNOWN — tags.
* UNKNOWN — hover effects.
* UNKNOWN — card-click behavior.
* UNKNOWN — whether whole featured card is clickable.
* UNKNOWN — exact Article detail route.
* UNKNOWN — tablet layout.
* UNKNOWN — mobile layout.
* UNKNOWN — number of Article records available in the CMS.
* UNKNOWN — whether Homepage must always display exactly four articles.
* UNKNOWN — whether articles are manually selected or automatically fetched by date/category.

---

# 3. Evidence and Confidence

| Item                           | Status   | Evidence / reason                                   |
| ------------------------------ | -------- | --------------------------------------------------- |
| Desktop asymmetric layout      | OBSERVED | One large card + three compact rows clearly visible |
| Four visible articles          | OBSERVED | One featured + three compact                        |
| First article featured         | OBSERVED | Significantly larger image/card                     |
| Right article arrangement      | OBSERVED | Vertical list of three horizontal article items     |
| Read More CTA                  | OBSERVED | Present on every article                            |
| Article data reuse             | INFERRED | Appropriate CMS architecture                        |
| Exact article count constraint | UNKNOWN  | Screenshot only proves four visible items           |
| Article sorting mechanism      | UNKNOWN  | No CMS behavior evidence                            |
| Typography exact values        | INFERRED | Visual hierarchy visible                            |
| Responsive behavior            | UNKNOWN  | Desktop screenshot only                             |

---

# 4. OCR Content Inventory

## 4.1 Section-level

| Element ID         | Visible text        | Type    | Confidence |
| ------------------ | ------------------- | ------- | ---------- |
| `articles-eyebrow` | `DENTAL INSIGHTS`   | Eyebrow | High       |
| `articles-heading` | `Featured Articles` | H2      | High       |

---

# 4.2 Featured Article

## Title

`How Long After Tooth Extraction Can You Get an Implant?`

Confidence: High.

## Excerpt

`Learn the ideal healing timeline, factors that affect placement, and tips for a smooth implant procedure.`

Confidence: High.

## CTA

`READ MORE`

Confidence: High.

---

# 4.3 Compact Article 01

## Title

`Can Tooth Whitening Damage Enamel?`

## Excerpt

`Discover the facts about enamel safety, whitening methods, and how to brighten your smile safely.`

## CTA

`READ MORE`

Confidence: High.

---

# 4.4 Compact Article 02

## Title

`What Is the Best Age for Braces?`

## Excerpt

`Find out the ideal age for orthodontic treatment and how early care leads to better results.`

## CTA

`READ MORE`

Confidence: High.

---

# 4.5 Compact Article 03

## Title

`Does Dental Implant Treatment Cause Bad Breath?`

## Excerpt

`Understand the causes of bad breath and how implants can actually improve long-term oral health.`

## CTA

`READ MORE`

Confidence: High.

---

# 5. Layout Anatomy

## 5.1 Global geometry

| Property           | Specification                                                        | Status              |
| ------------------ | -------------------------------------------------------------------- | ------------------- |
| Section width      | Full viewport with centered content container                        | OBSERVED / INFERRED |
| Background         | White / near-white                                                   | OBSERVED            |
| Section header     | Top-left                                                             | OBSERVED            |
| Main content       | Two-column asymmetric layout                                         | OBSERVED            |
| Left feature area  | Approximately `42–44% container`                                     | INFERRED            |
| Right list area    | Approximately `53–55% container`                                     | INFERRED            |
| Main column gap    | Medium                                                               | OBSERVED            |
| Right list rows    | 3                                                                    | OBSERVED            |
| Left card count    | 1                                                                    | OBSERVED            |
| Vertical alignment | Feature card and first compact article begin at similar top position | OBSERVED            |

---

# 5.2 Structure tree

```text
Section: home-articles
├── SectionHeader
│   ├── Eyebrow
│   ├── H2
│   └── DecorativeLine
│
└── ArticlesLayout
    ├── FeaturedArticleCard
    │   ├── CoverImage
    │   └── Content
    │       ├── Title
    │       ├── Excerpt
    │       └── ReadMoreLink
    │           ├── Label
    │           └── Arrow
    │
    └── CompactArticleList
        ├── CompactArticle
        │   ├── Thumbnail
        │   └── Content
        │       ├── Title
        │       ├── Excerpt
        │       └── ReadMoreLink
        │
        ├── Divider
        ├── CompactArticle
        ├── Divider
        └── CompactArticle
```

---

# 5.3 Desktop topology

```text
DENTAL INSIGHTS
Featured Articles
────


┌───────────────────────────────────┐   ┌─────────────┐  Article Title
│                                   │   │             │  Excerpt...
│                                   │   │ IMAGE       │  READ MORE →
│       FEATURE ARTICLE IMAGE       │   │             │
│                                   │   └─────────────┘
│                                   │   ───────────────────────────────
├───────────────────────────────────┤
│ FEATURE ARTICLE TITLE             │   ┌─────────────┐  Article Title
│                                   │   │             │  Excerpt...
│ Excerpt...                        │   │ IMAGE       │  READ MORE →
│                                   │   │             │
│ READ MORE →                       │   └─────────────┘
└───────────────────────────────────┘   ───────────────────────────────

                                        ┌─────────────┐  Article Title
                                        │             │  Excerpt...
                                        │ IMAGE       │  READ MORE →
                                        │             │
                                        └─────────────┘
```

---

# 6. Featured Article Card

## 6.1 Card anatomy

```text
FeaturedArticleCard
├── ImageArea
└── ContentArea
    ├── ArticleTitle
    ├── Excerpt
    └── ReadMore
```

---

# 6.2 Geometry

| Property       | Specification                               | Status   |
| -------------- | ------------------------------------------- | -------- |
| Orientation    | Vertical                                    | OBSERVED |
| Width          | Full left column                            | OBSERVED |
| Background     | White                                       | OBSERVED |
| Border         | Very pale border                            | INFERRED |
| Radius         | Moderate, approximately `8–12 px estimated` | INFERRED |
| Overflow       | Hidden                                      | REQUIRED |
| Image width    | `100%` card width                           | OBSERVED |
| Image height   | Approximately upper `50–55%` of card        | INFERRED |
| Text alignment | Left                                        | OBSERVED |

---

# 6.3 Featured image

Reference image:

* dental implant/tooth extraction-related image,
* dental model with implant,
* gloved hand and dental tool,
* landscape orientation.

Recommended behavior:

```text
object-fit: cover
```

provided the focal region is preserved.

Unlike logo/device sections, cropping is acceptable here because the image behaves as editorial article photography.

---

# 6.4 Featured title

Desktop line behavior:

```text
How Long After Tooth Extraction
Can You Get an Implant?
```

* Large article-card typography.
* Strong navy.
* Two lines in supplied screenshot.

Do not manually insert this exact line break into CMS content.

Frontend width should naturally reproduce comparable wrapping.

---

# 6.5 Featured excerpt

* Smaller than title.
* Muted navy.
* Approximately 2 lines in screenshot.
* Left aligned.

---

# 6.6 Featured CTA

```text
READ MORE →
```

* Uppercase.
* Blue.
* Small right arrow.
* Positioned near lower-left of content area.
* No filled button surface.

---

# 7. Compact Article Specification

## 7.1 Structure

Each compact article:

```text
CompactArticle
├── Thumbnail
└── Content
    ├── Title
    ├── Excerpt
    └── ReadMore
```

---

# 7.2 Desktop geometry

| Property           | Specification                            | Status   |
| ------------------ | ---------------------------------------- | -------- |
| Orientation        | Horizontal                               | OBSERVED |
| Thumbnail region   | Approximately `35–40%` row width         | INFERRED |
| Text region        | Approximately `60–65%`                   | INFERRED |
| Height             | Equal / near-equal across all 3 rows     | OBSERVED |
| Thumbnail          | Rounded                                  | OBSERVED |
| Background         | No strongly visible outer card surface   | OBSERVED |
| Divider            | Thin horizontal line between rows        | OBSERVED |
| Vertical alignment | Thumbnail and content vertically aligned | OBSERVED |

---

# 7.3 Compact article visual

```text
┌────────────────────┐   ARTICLE TITLE
│                    │
│     THUMBNAIL      │   Short excerpt...
│                    │
└────────────────────┘   READ MORE →
```

---

# 7.4 Compact title

* Dark navy.
* Bold/semibold.
* Smaller than featured title.
* Can wrap to approximately 1–2 lines.

---

# 7.5 Compact excerpt

* Muted dark navy.
* Approximately 2 lines.
* Must support variable article text.

---

# 7.6 Compact CTA

* Same `READ MORE` pattern as featured article.
* Blue.
* Arrow on right.
* No filled surface.

Reuse the same `ArticleReadMoreLink` primitive where possible.

---

# 8. Right-Side Divider Rules

The compact article list uses subtle horizontal separators.

Conceptually:

```text
Article 1
────────────────────────
Article 2
────────────────────────
Article 3
```

Rules:

* Divider starts around content/list boundary, not necessarily full viewport width.
* Very pale gray/blue.
* Thin.
* No heavy borders.
* No divider after final item unless required by underlying layout.

---

# 9. Visual Specification

## 9.1 Colors

| Token candidate                  | Usage                  | Description          | Status   |
| -------------------------------- | ---------------------- | -------------------- | -------- |
| `color/articles/background`      | Section                | White / near-white   | OBSERVED |
| `color/articles/eyebrow`         | Eyebrow                | Bright blue          | OBSERVED |
| `color/articles/heading`         | H2                     | Dark navy            | OBSERVED |
| `color/articles/title`           | Article title          | Deep navy            | OBSERVED |
| `color/articles/body`            | Excerpt                | Muted navy/blue-gray | OBSERVED |
| `color/articles/action`          | Read More              | Bright blue          | OBSERVED |
| `color/articles/divider`         | Compact row separators | Very pale gray-blue  | OBSERVED |
| `color/articles/decorative-line` | Under heading          | Blue                 | OBSERVED |

---

# 9.2 Typography

| Element                | Weight              | Approx. size         | Status   |
| ---------------------- | ------------------- | -------------------- | -------- |
| Eyebrow                | `600–700 estimated` | `12–14 px estimated` | INFERRED |
| H2                     | `700 estimated`     | `31–36 px estimated` | INFERRED |
| Featured article title | `600–700 estimated` | `23–27 px estimated` | INFERRED |
| Featured excerpt       | `400–500 estimated` | `13–15 px estimated` | INFERRED |
| Compact article title  | `600–700 estimated` | `16–19 px estimated` | INFERRED |
| Compact excerpt        | `400–500 estimated` | `12–14 px estimated` | INFERRED |
| Read More              | `600 estimated`     | `11–13 px estimated` | INFERRED |

---

# 10. Asset Manifest

| Asset ID                   | Description                            | Format            |         CMS? | Status   |
| -------------------------- | -------------------------------------- | ----------------- | -----------: | -------- |
| `article-feature-cover`    | Implant/tooth extraction article image | WebP/JPG/PNG      |          Yes | OBSERVED |
| `article-whitening-cover`  | Before/after whitening teeth image     | WebP/JPG/PNG      |          Yes | OBSERVED |
| `article-braces-cover`     | Smiling woman/braces-related image     | WebP/JPG/PNG      |          Yes | OBSERVED |
| `article-bad-breath-cover` | Woman covering mouth                   | WebP/JPG/PNG      |          Yes | OBSERVED |
| `article-arrow`            | Small right arrow                      | SVG/design-system | No preferred | OBSERVED |

---

# 11. Strapi Content Architecture

## 11.1 Preferred canonical Article collection

Do not store the article body directly inside Homepage.

Preferred:

```text
Article Collection
├── Article 1
├── Article 2
├── Article 3
├── Article 4
└── ...

Homepage
└── Featured Articles Section
    └── articles[]
          ↓ relation
        Article
```

---

# 11.2 Recommended Article content type

At minimum:

| Field           | Type                      |             Required | Homepage use                |
| --------------- | ------------------------- | -------------------: | --------------------------- |
| `title`         | Short text                |                  Yes | Card title                  |
| `slug`          | UID                       |                  Yes | Article detail route        |
| `excerpt`       | Long text                 |                  Yes | Card description            |
| `coverImage`    | Media                     |                  Yes | Featured/compact image      |
| `coverImageAlt` | Short text / media alt    |          Recommended | Accessibility               |
| `content`       | Rich text / Blocks        | Yes for article page | Not directly displayed here |
| `publishedAt`   | Date / Strapi publication |          Recommended | Sorting if required         |
| `category`      | Relation                  |             Optional | Not visible in screenshot   |
| `author`        | Relation                  |             Optional | Not visible in screenshot   |

---

# 11.3 Homepage Featured Articles section

Recommended:

```text
HomepageFeaturedArticles
├── eyebrow
├── heading
└── articles[]
      ↓ relation to Article
```

### Fields

| Field      | Type                        | Required |
| ---------- | --------------------------- | -------: |
| `eyebrow`  | Short text                  |      Yes |
| `heading`  | Short text                  |      Yes |
| `articles` | Ordered relation to Article |      Yes |

---

# 11.4 Featured article selection

Two possible models.

## Recommended — order determines featured

```text
articles[0]
→ FeaturedArticleCard

articles[1...]
→ CompactArticle
```

Advantages:

* simpler editor workflow,
* easy drag/reorder,
* no risk of multiple featured records.

Example:

```text
1. How Long After Tooth Extraction... → FEATURED
2. Can Tooth Whitening Damage Enamel? → COMPACT
3. What Is the Best Age for Braces?   → COMPACT
4. Does Dental Implant Treatment...   → COMPACT
```

---

## Alternative — explicit featured relation

```text
featuredArticle
secondaryArticles[]
```

Use this only if Product needs featured selection independent from article ordering.

---

# 11.5 Do not duplicate article content

Incorrect:

```text
Homepage
└── articles[]
    ├── title
    ├── excerpt
    ├── image
    └── body
```

while a separate Article content type already exists.

This creates:

* duplicated content,
* inconsistent title updates,
* duplicated image management,
* broken article routing.

Preferred:

```text
Homepage
└── article relations
       ↓
Article Collection
```

---

# 12. Article Count Contract

The screenshot demonstrates:

```text
1 featured
+
3 compact
=
4 visible articles
```

Status: `OBSERVED`.

However the user has not explicitly defined:

* minimum article count,
* maximum article count,
* whether exactly four must always be configured.

Therefore do **not** enforce `max = 4` in Strapi yet unless Product confirms.

For exact screenshot reproduction at desktop, the initial homepage configuration should contain four selected articles.

---

# 12.1 If exactly four is later approved

Then recommended validation:

```text
min = 1 or 4 depending Product
max = 4
```

But this is currently not confirmed.

---

# 12.2 More than four selected articles

Behavior is UNKNOWN.

Do not:

* create a hidden carousel,
* add pagination,
* silently ignore articles,

without Product requirements.

Safer architecture:

* CMS initially selects exactly the intended homepage articles,
* frontend displays the configured supported subset according to confirmed specification.

---

# 13. Data-to-Layout Mapping

```text
articles[0]
    ↓
FeaturedArticleCard

articles[1]
    ↓
CompactArticleRow 1

articles[2]
    ↓
CompactArticleRow 2

articles[3]
    ↓
CompactArticleRow 3
```

All use the same source Article model.

---

# 14. Interaction States

| Element            | Default           | Hover   | Focus             | Destination    | Status                          |
| ------------------ | ----------------- | ------- | ----------------- | -------------- | ------------------------------- |
| Featured Read More | Blue text + arrow | UNKNOWN | Required          | Article detail | OBSERVED / destination INFERRED |
| Compact Read More  | Blue text + arrow | UNKNOWN | Required          | Article detail | OBSERVED / destination INFERRED |
| Article image      | Static            | UNKNOWN | N/A unless linked | UNKNOWN        | OBSERVED                        |
| Entire card        | Static            | UNKNOWN | UNKNOWN           | UNKNOWN        | No whole-card-link evidence     |

### Do not invent

* image zoom,
* card lift,
* underline animations,
* category badges,
* publication date,
* author avatars,
* reading-time chips.

---

# 15. Article Detail Routing

INFERRED recommended route model:

```text
/articles/:slug
```

or whatever route convention already exists in the project.

The screenshot does not establish the route.

Frontend must use Article's canonical route rather than storing independent Homepage URLs when possible.

Conceptually:

```text
Article.slug
      ↓
READ MORE
      ↓
Article Detail Page
```

---

# 16. Responsive Specification

## 16.1 Evidence

| Viewport     | Evidence |
| ------------ | -------- |
| Full desktop | High     |
| Tablet       | UNKNOWN  |
| Mobile       | UNKNOWN  |

---

# 16.2 Desktop

Required:

* featured article remains on left,
* three compact articles stack on right,
* featured card significantly wider/taller than one compact row,
* right rows have separators,
* images maintain expected proportions.

---

# 16.3 Suggested structural responsive strategy

Without claiming exact design:

### Desktop

```text
[ FEATURED ] [ ARTICLE 2 ]
             [ ARTICLE 3 ]
             [ ARTICLE 4 ]
```

### Narrow viewport structural fallback

Potential:

```text
[ FEATURED ]

[ ARTICLE 2 ]

[ ARTICLE 3 ]

[ ARTICLE 4 ]
```

Status: `INFERRED`.

Exact mobile visual must be approved.

---

# 16.4 Mobile data invariance

Do not create:

```text
desktopArticles[]
mobileArticles[]
```

Same article relation list should render responsively.

---

# 17. Semantic HTML and Accessibility

## Recommended structure

```text
Section
├── H2
└── Article collection
    ├── article
    ├── article
    ├── article
    └── article
```

Each article item should use semantic article grouping where appropriate.

### Heading hierarchy

* Section: H2.
* Article card titles: next logical heading level, e.g. H3.

### Images

Use meaningful alt text derived from approved media metadata.

Do not use article title verbatim as alt if it does not describe the image.

### Read More links

Generic `READ MORE` repeated multiple times can be ambiguous to screen readers.

Accessible label should include article context, conceptually:

```text
Read more: Can Tooth Whitening Damage Enamel?
```

while visible UI may remain:

```text
READ MORE →
```

---

# 18. Implementation Constraints

## Layout

* Keep asymmetric desktop composition.
* Do not convert into four equal cards.
* One featured article on left.
* Three compact articles on right in reference state.
* Right rows remain horizontally oriented.
* Keep subtle separators.
* Preserve content hierarchy.

## CMS

* Prefer canonical Article relations.
* Do not duplicate article body/content in Homepage.
* Preserve article order configured in Strapi.
* First item can drive featured layout unless alternate architecture is approved.
* CMS controls content and selection.
* Frontend controls layout variant.

## Images

* Featured and compact cards use Article cover image.
* Frontend may render different aspect ratios for the same source cover.
* Do not require separate desktop featured image and compact image unless Figma/Product specifically supports art direction.

---

# 19. Visual Acceptance Criteria

## Section header

* [ ] `DENTAL INSIGHTS` appears.
* [ ] `Featured Articles` appears.
* [ ] Small blue decorative line is visible.
* [ ] Heading aligns with left article column.

## Featured article

* [ ] Featured article appears on left.
* [ ] Cover image spans card width.
* [ ] Image occupies upper portion.
* [ ] Title appears below image.
* [ ] Title has strongest card-level visual weight.
* [ ] Excerpt appears below title.
* [ ] `READ MORE →` appears near lower-left.
* [ ] Card radius and pale border match reference.

## Compact articles

* [ ] Exactly three compact entries appear in supplied reference state.
* [ ] Compact entries stack vertically.
* [ ] Thumbnail is positioned left.
* [ ] Text content appears right.
* [ ] Title is above excerpt.
* [ ] `READ MORE →` appears beneath excerpt.
* [ ] Horizontal separators appear between rows.
* [ ] Thumbnail corners are rounded.
* [ ] All compact entries use consistent geometry.

## CMS/data

* [ ] Article records come from canonical Article collection where available.
* [ ] Homepage ordering determines visual ordering.
* [ ] Featured article and compact items remain synchronized with CMS content.
* [ ] Updating Article title automatically updates Homepage card.
* [ ] Updating Article cover automatically updates Homepage card.
* [ ] No article body is duplicated into Homepage component.

---

# 20. Visual Risks

| Risk                                                                    | Why it affects fidelity/maintenance         | Mitigation                                        | Priority |
| ----------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------- | -------- |
| Four equal cards                                                        | Loses asymmetric editorial layout           | Explicit featured + compact variants              | High     |
| Duplicate Homepage article data                                         | Article content can diverge                 | Use relations to Article collection               | High     |
| Featured article controlled independently from order without validation | Editor workflow becomes confusing           | Prefer `articles[0]` featured                     | Medium   |
| Long compact article title                                              | May increase row height                     | Define text wrapping/content constraints          | Medium   |
| Image aspect ratios inconsistent                                        | Right list becomes visually uneven          | Fixed frontend thumbnail geometry                 | High     |
| Separate image fields for each layout                                   | CMS complexity increases                    | Reuse Article cover image                         | Medium   |
| Hardcoding Article routes                                               | Breaks routing consistency                  | Derive from canonical slug                        | High     |
| Whole card made clickable + nested Read More                            | Can create nested-link accessibility issues | Choose one semantic linking strategy              | Medium   |
| Additional articles silently ignored                                    | CMS/editor confusion                        | Define selection/count rule before implementation | Medium   |
| Adding unsupported category/date badges                                 | Diverges from screenshot                    | Do not invent metadata display                    | Medium   |

---

# 21. Open Questions

| ID  | Question                                                                                    | Blocking level                 | Suggested owner     |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------ | ------------------- |
| Q1  | Must Homepage display exactly four articles, or can the count vary?                         | Important CMS/layout decision  | Product             |
| Q2  | Should first selected article automatically become featured?                                | Architecture decision          | Product / Developer |
| Q3  | Or should Strapi have separate `featuredArticle` and `secondaryArticles` fields?            | Architecture decision          | Product             |
| Q4  | Are Homepage articles manually selected or automatically chosen by newest publication date? | Important CMS behavior         | Product             |
| Q5  | If automatic, what sorting/filtering rules apply?                                           | Blocking for dynamic selection | Product             |
| Q6  | What is the canonical Article route?                                                        | Blocking for Read More links   | Developer           |
| Q7  | Is entire article card clickable or only `READ MORE`?                                       | Interaction decision           | Product             |
| Q8  | Are article categories/date/author intentionally omitted from Homepage?                     | Non-blocking                   | Product             |
| Q9  | What happens if fewer than four articles are configured?                                    | Layout decision                | Designer            |
| Q10 | What happens if more than four are selected?                                                | CMS/layout decision            | Product             |
| Q11 | What is the tablet layout?                                                                  | Blocking for tablet            | Designer            |
| Q12 | What is the mobile layout?                                                                  | Blocking for mobile            | Designer            |

---

# Strapi Handoff Summary

## Preferred architecture

```text
Article Collection
│
├── title
├── slug
├── excerpt
├── coverImage
├── content
├── publishedAt
└── optional metadata

Homepage
└── Featured Articles Section
    ├── eyebrow
    ├── heading
    │
    └── articles[]
          ↓ ordered relation
        Article
```

---

# Featured Mapping

Recommended:

```text
articles[0]
     ↓
FEATURED ARTICLE
     ↓
large vertical card


articles[1]
     ↓
COMPACT ARTICLE 01

articles[2]
     ↓
COMPACT ARTICLE 02

articles[3]
     ↓
COMPACT ARTICLE 03
```

---

# Desktop Handoff

```text
DENTAL INSIGHTS
Featured Articles
────

┌──────────────────────────────┐     ┌────────────┐  Article 02
│                              │     │            │  Excerpt
│                              │     │ IMAGE      │  READ MORE →
│     FEATURED ARTICLE         │     │            │
│          IMAGE               │     └────────────┘
│                              │
├──────────────────────────────┤     ───────────────────────────
│ Featured Article Title       │
│                              │     ┌────────────┐  Article 03
│ Excerpt...                   │     │ IMAGE      │  Excerpt
│                              │     └────────────┘  READ MORE →
│ READ MORE →                  │
└──────────────────────────────┘     ───────────────────────────

                                     ┌────────────┐  Article 04
                                     │ IMAGE      │  Excerpt
                                     └────────────┘  READ MORE →
```

---

# CMS vs Frontend Responsibility

| Responsibility             | Strapi | Frontend |
| -------------------------- | :----: | :------: |
| Article title              |    ✅   |          |
| Article slug               |    ✅   |          |
| Excerpt                    |    ✅   |          |
| Cover image                |    ✅   |          |
| Full article content       |    ✅   |          |
| Homepage article selection |    ✅   |          |
| Homepage article order     |    ✅   |          |
| Featured-card variant      |        |     ✅    |
| Compact-card variant       |        |     ✅    |
| Card dimensions            |        |     ✅    |
| Thumbnail ratios           |        |     ✅    |
| Separators                 |        |     ✅    |
| Responsive layout          |        |     ✅    |
| Read More arrow            |        |     ✅    |

---

# Mandatory Coding-Agent Rules

1. Create `home-articles` immediately after `home-press`.
2. Reproduce the desktop composition as **1 featured article + 3 compact article rows**.
3. Do **not** implement four equal article cards.
4. Prefer canonical Strapi `Article` records and Homepage relations.
5. Do not duplicate article content into Homepage if Article collection already exists.
6. Recommended mapping:

   * `articles[0]` → featured card,
   * following items → compact cards.
7. Featured article uses large top image + content below.
8. Compact articles use thumbnail-left/content-right.
9. Preserve right-side horizontal separators.
10. Every card uses real text and media from Article data.
11. `READ MORE` links to the canonical Article detail route.
12. Do not add publication date, author, category, tags or reading-time UI unless separately supplied.
13. CMS controls article data/selection/order; frontend controls featured/compact geometry.
14. Exact article-count validation remains pending Product confirmation.
