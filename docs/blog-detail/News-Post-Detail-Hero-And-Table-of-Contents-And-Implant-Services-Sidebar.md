# UI Implementation Prompt — News/Post Detail Hero + Table of Contents + Implant Services Sidebar

## 1. Task Context

Continue implementing the **Knowledge Center / News Post Detail page** based on the supplied desktop reference.

This page uses a persistent **2-column desktop layout**:

```text
Main Article Column                    Right Sidebar
----------------------------------     -------------------------
Article Hero                           Search
Article Introduction                   Implant Services
Hero Image
Table of Contents
Article Body Sections                  Additional sidebar modules later
```

This prompt covers the first visible content of both columns:

### Left column

1. Article breadcrumb
2. Article title
3. Article metadata
4. Highlight / introduction quote
5. Hero article image
6. Table of Contents

### Right column

1. Article search
2. `Implant Services` navigation menu

The left column remains the primary article-reading area.

The right column behaves as a supporting navigation/sidebar area and should remain visually narrower than the article content.

Use the screenshot as the primary source of truth for:

* column proportions;
* container widths;
* spacing;
* typography;
* border radius;
* card styling;
* image proportions;
* icon positioning;
* blue/navy Smilux visual system.

---

# 2. Page Route / Architecture

Recommended route pattern:

`/blog/:slug`

or reuse the existing Knowledge Center article route already defined in the project.

Recommended component architecture:

* `ArticleDetailPage`
* `ArticleMainColumn`
* `ArticleSidebar`
* `ArticleHero`
* `ArticleMeta`
* `ArticleIntroHighlight`
* `ArticleTableOfContents`
* `ArticleSearch`
* `ImplantServicesSidebar`

Do not build a Dental-Implants-only article layout.

The page shell should support any future Knowledge Center article while allowing sidebar modules to vary by article/category.

---

# 3. Desktop Grid Layout

Use one centered page container.

Approximate relationship:

```text
Main Article Column   |   Sidebar
~66–68%               |   ~29–31%
```

Gap:

`~38–45px estimated`

The left column should clearly dominate visually.

The sidebar should begin near the top of the article hero but its first card is vertically lower than the breadcrumb/title top edge, matching the screenshot.

Recommended maximum page-container width:

`~1180–1240px estimated`

Do not allow article text to expand across the entire viewport.

---

# 4. LEFT COLUMN — Breadcrumb

Render at the top-left of the article page.

Reference structure:

`Home > Knowledge > Dental Implants > Are Dental Implants at Smilux Right for You?`

### Visible labels

* `Home`
* `Knowledge`
* `Dental Implants`
* `Are Dental Implants at Smilux Right for You?`

### Visual requirements

* small typography;
* blue home icon;
* breadcrumb links use muted blue/navy;
* current article uses softer muted text;
* small chevron separators;
* vertically centered;
* compact spacing.

Do not wrap the breadcrumb into multiple lines at the supplied desktop viewport unless absolutely necessary.

---

# 5. Article Hero Title

Reference title:

**Are Dental Implants at Smilux Right for You?**

### Visual requirements

* page-level H1;
* deep navy;
* bold;
* large desktop size approximately `38–44px estimated`;
* line-height approximately `44–50px estimated`;
* left aligned;
* max-width constrained so the reference title wraps into approximately 2 lines.

Do not center the article title.

---

# 6. Article Metadata

Place a compact metadata row directly below the H1.

Reference structure:

```text
[category icon] Dental Implants
[clock icon] 10 min read
[calendar icon] May 06, 2024
[author avatar] By Dr. Ethan Santos
```

Use four visually separated metadata groups.

---

# 7. Metadata Item 1 — Category

**Label**

Dental Implants

**Icon**

Small circular/category dental icon.

Visual treatment:

* blue icon;
* blue text;
* compact size.

This may link to the `Dental Implants` article category if such a route/filter already exists.

---

# 8. Metadata Item 2 — Reading Time

**Text**

10 min read

**Icon**

Clock outline.

Use muted navy/slate.

---

# 9. Metadata Item 3 — Published Date

**Text**

May 06, 2024

**Icon**

Calendar outline.

Use muted navy/slate.

Use the article's actual publication date from CMS in production rather than hard-coding this value globally.

---

# 10. Metadata Item 4 — Author

**Text**

By Dr. Ethan Santos

Use:

* small circular author portrait;
* author name beside it.

If actual author information exists in CMS:

* use the canonical author relation;
* use the approved author portrait;
* do not duplicate author details manually.

If no author image exists, support a fallback avatar but do not invent a real staff identity.

---

# 11. Article Intro Highlight Card

Directly below metadata, create the highlighted introduction card shown in the screenshot.

Reference copy:

**Dental implants are a safe, durable, and natural-looking solution for missing teeth. At Smilux, we combine advanced technology and expert care to deliver long-lasting results that restore your smile, confidence, and quality of life.**

### Layout

```text
[large quote icon]   Intro text
```

### Visual requirements

* white / extremely pale-blue surface;
* thin pale-blue border;
* rounded corners approximately `10–12px estimated`;
* large blue quotation mark on the left;
* body text on the right;
* body text navy/slate;
* generous horizontal padding;
* compact vertical padding.

The quotation mark is decorative.

Do not add:

* author attribution;
* testimonial styling;
* background photograph.

This is an article introduction/highlight block, not a patient testimonial.

---

# 12. Article Hero Image

Place one large editorial/clinical image immediately below the intro highlight.

Reference image concept:

* dental implant model;
* jaw/gum cross-section;
* multiple natural teeth;
* implant fixtures;
* dental X-ray monitor in the background;
* modern clinic/lab setting;
* bright blue/white clinical environment.

### Image dimensions

* full width of main article column;
* wide landscape ratio approximately `2.2–2.4:1 estimated`;
* rounded corners approximately `10–12px estimated`.

Use `object-fit: cover`.

Preserve the main visual focal point:

* implant model near center/right;
* X-ray monitor visible on left.

Do not stretch the image.

---

# 13. Hero Image Asset Research

Search existing project assets first:

* `/public`
* `/assets`
* Strapi media
* service-detail implant images
* Knowledge Center article media
* dental technology assets

Search terms:

* `implant article`
* `implant xray`
* `dental implant hero`
* `implant model`
* `implant clinic`

If unavailable, research a high-quality licensed visual with queries such as:

* `dental implant model x ray clinic`
* `dental implant 3D model with xray`
* `dental implant educational hero image`
* `implant prosthetic model dental clinic`
* `implant planning xray dental laboratory`

Preferred visual:

* educational;
* high-resolution;
* bright;
* professional;
* non-graphic.

Avoid:

* bloody surgery photography;
* watermarked stock imagery;
* generic smiling-person imagery for this hero;
* unrelated cosmetic-dentistry images.

Store the selected production asset locally instead of relying on an unstable remote hotlink.

---

# 14. Table of Contents

Place the Table of Contents directly below the article hero image.

Heading:

**Table of Contents**

Add a small blue list/document icon before the heading.

### Container

* white background;
* pale-blue border;
* rounded corners approximately `8–10px estimated`;
* internal horizontal padding;
* full main-column width.

---

# 15. Table of Contents Layout

Desktop reference uses **2 columns**.

Left column:

1. What Are Dental Implants?
2. Who Is a Good Candidate?
3. Benefits of Dental Implants
4. Implant Structure at Smilux

Right column:

5. Treatment Process
6. Recovery & Aftercare
7. FAQs About Dental Implants

Use numbered rows.

Reference structure:

```text
1. What Are Dental Implants?          5. Treatment Process
2. Who Is a Good Candidate?           6. Recovery & Aftercare
3. Benefits of Dental Implants        7. FAQs About Dental Implants
4. Implant Structure at Smilux
```

### Visual requirements

* number column uses blue/muted blue;
* article section label uses navy/slate;
* compact vertical spacing;
* no individual item cards;
* no visible row borders.

---

# 16. Table of Contents Behavior

Each TOC entry should navigate to the corresponding article section through in-page anchors.

Example conceptual IDs:

* `what-are-dental-implants`
* `good-candidate`
* `benefits`
* `implant-structure`
* `treatment-process`
* `recovery-aftercare`
* `faqs`

Do not hard-code these IDs independently from article section data.

Preferred article structure:

```text
article.sections[]
  id
  title
  content
```

Generate TOC entries from actual article section data where possible.

Click behavior:

* scroll/jump to section;
* existing smooth-scroll convention may be reused if already present.

Do not make TOC pagination or open a new page.

---

# 17. Table of Contents Reusability

The TOC must support different article lengths.

Do not assume every article has exactly 7 sections.

Other articles may contain:

* 4 sections;
* 6 sections;
* 10 sections.

Generate items dynamically.

For this Dental Implants reference article, render exactly the 7 items above.

---

# 18. RIGHT SIDEBAR — General Behavior

The sidebar is independent from the article body flow.

The visible sidebar begins with:

1. search card;
2. Implant Services card.

Recommended conceptual structure:

```text
ArticleSidebar
├── ArticleSearch
└── ImplantServicesSidebar
```

Future modules may be added below without rewriting the sidebar layout.

---

# 19. Sidebar Search

At the top of the sidebar, create a small rounded search card/container.

Inside:

* one article search input;
* one blue search button.

Placeholder:

`Search articles...`

### Visual requirements

Outer/search region:

* white;
* pale-blue border;
* rounded corners approximately `10–12px estimated`;
* internal padding.

Input:

* white;
* subtle gray/pale-blue border;
* rounded approximately `6–8px`;
* compact height.

Button:

* blue;
* rounded;
* white magnifying-glass icon;
* square/circular-rounded shape.

Keep this sidebar search visually smaller than the search bar on the Knowledge Center listing page.

---

# 20. Sidebar Search Behavior

Reuse the same Knowledge Center search architecture.

Do not build a separate article-search implementation.

Possible behavior:

* navigate to Knowledge Center listing with the query applied;

or

* use existing search-results behavior.

Do not filter the current article body itself unless that feature already exists.

---

# 21. RIGHT SIDEBAR — Implant Services

Render a rounded bordered sidebar card.

Heading:

**Implant Services**

### Container

* white background;
* pale-blue border;
* rounded corners approximately `10–12px estimated`;
* compact padding.

Inside render exactly five visible service menu items for the reference.

---

# 22. Implant Service Item Anatomy

Each row contains:

```text
[Image] [Title
         Subtitle]      [>]
```

Requirements:

* small landscape/square service image on the left;
* title bold navy;
* subtitle smaller muted navy/slate;
* right chevron aligned vertically center;
* thin pale-blue border or row separation;
* consistent row heights;
* rounded row corners.

Image width approximately:

`80–90px estimated`

Image height approximately:

`75–80px estimated`

Keep the image large enough to identify the implant subtype.

---

# 23. Implant Service 1

**Title**

Single Tooth Implant

**Subtitle**

Replace one missing tooth

### Image direction

Use:

* one dental implant;
* single crown;
* adjacent natural teeth;
* gum/bone context.

Research terms:

* `single tooth implant 3D`
* `single dental implant crown model`
* `single missing tooth implant illustration`

---

# 24. Implant Service 2

**Title**

Multiple Tooth Implants

**Subtitle**

Restore several missing teeth

### Image direction

Use:

* multiple implants;
* several crowns/restoration;
* jaw/gum context.

Research terms:

* `multiple dental implants illustration`
* `multiple tooth implant bridge`
* `several dental implants 3D`

---

# 25. Implant Service 3

**Title**

Full-Arch Implants

**Subtitle**

Fixed full-arch restoration

### Image direction

Use:

* complete arch;
* implant-supported bridge;
* full set of teeth;
* multiple support implants.

Research terms:

* `full arch dental implants 3D`
* `all on 4 dental implant model`
* `implant full arch restoration`

---

# 26. Implant Service 4

**Title**

Implant Restoration

**Subtitle**

Crowns, bridges & implant-supported restorations

### Image direction

Use:

* crown + implant model;
* bridge/restorative components;
* clean educational composition.

Research terms:

* `implant crown restoration`
* `implant supported bridge render`
* `dental implant restoration 3D`

---

# 27. Implant Service 5

**Title**

Bone Grafting

**Subtitle**

Rebuild bone for stronger implant foundation

### Image direction

Use:

* jaw/bone model;
* grafting or bone-regeneration concept;
* educational 3D visualization.

Research terms:

* `dental bone graft 3D illustration`
* `bone graft dental implant illustration`
* `jaw bone graft implant`

Avoid surgical gore.

---

# 28. Implant Service Image Research Rules

Before external research, check:

* Dental Implant Services section from the service-detail page;
* existing Strapi service media;
* `/public`;
* `/assets`;
* implant article assets.

Reuse assets already used for matching services wherever possible.

This is preferred because:

* it keeps the site visually consistent;
* avoids duplicate assets;
* ensures users recognize the same service across pages.

If additional images are required:

* use licensed imagery;
* download/store locally;
* optimize to WebP/JPG;
* use consistent crop/style.

Do not use five images with completely different illustration styles.

---

# 29. Implant Service Navigation Behavior

Each service item should link to the matching service detail location/page.

Preferred data structure:

```text
service
  id
  slug
  title
  shortDescription
  image
```

Reuse the same service records already used elsewhere.

Do not create separate sidebar-only duplicate service data.

Destination should be generated from the canonical service route.

---

# 30. View All Implant Services

Below the five service rows, render:

**View all implant services →**

Visual treatment:

* Smilux blue;
* medium/semi-bold;
* left aligned;
* small right arrow.

Destination:

* Implant Services listing/section;
* or relevant Services page;

based on existing site routing.

Do not invent a new route if the project already defines one.

---

# 31. Sidebar Positioning

At the reference desktop viewport:

* Sidebar begins near the article title region.
* Search appears first.
* Implant Services begins directly beneath the search.
* Keep approximately `18–22px estimated` vertical gap between sidebar modules.
* Sidebar cards remain aligned to one consistent width.

Do not allow sidebar content to overlap the article column.

---

# 32. Sticky Sidebar Behavior

Sticky behavior is not visually proven by the screenshot.

Therefore:

* do not automatically implement sticky positioning purely from this reference;
* reuse sticky sidebar behavior only if the existing blog design/system already provides it.

If sticky is later required:

* keep sufficient top offset for the global header;
* prevent the sidebar from extending beyond page content;
* ensure keyboard focus remains visible.

---

# 33. Shared Data Architecture

The article page should use structured content.

Recommended conceptual article data:

```text
Article
- id
- slug
- title
- excerpt / introduction
- heroImage
- category
- publishedAt
- readingTime
- author
- sections[]
```

Recommended author data:

```text
Author
- name
- avatar
- role
- slug
```

Recommended service data:

```text
Service
- title
- slug
- shortDescription
- image
- category
```

Do not hard-code service-sidebar data separately from the site's service system.

---

# 34. Responsive Behavior

Only desktop behavior is directly evidenced.

## Desktop — Required

```text
Main Article (~67%) | Sidebar (~30%)
```

Left:

* full article hero;
* hero image;
* 2-column TOC.

Right:

* search;
* Implant Services.

---

## Tablet — Inferred

Preferred:

```text
Article
Sidebar
```

or keep a reduced two-column layout only while both columns remain readable.

Do not shrink the main article excessively to preserve the sidebar.

TOC may remain two columns if space permits.

---

## Mobile — Inferred

Recommended order:

1. breadcrumb;
2. H1;
3. metadata;
4. intro highlight;
5. hero image;
6. Table of Contents;
7. article body;
8. sidebar search;
9. Implant Services.

TOC should become one column on narrow screens.

Service-menu rows may remain horizontal image/content rows.

Do not position the sidebar beside the article on small screens.

---

# 35. Accessibility — Article Hero

* H1 must be the page's primary heading.
* Breadcrumb should use semantic navigation.
* Metadata icons should be decorative where the text already conveys the meaning.
* Author portrait needs approved alt text if informative.
* Intro quote icon should be hidden from assistive technology.
* Hero image needs purposeful alt text describing the educational implant visual.

---

# 36. Accessibility — Table of Contents

* Give the TOC a navigation landmark such as `Table of Contents`.
* Use real anchor links.
* Link text should be the visible section title.
* Maintain logical numbering.
* Focused anchor destination should not become obscured by a sticky site header.

---

# 37. Accessibility — Sidebar

Search:

* input requires accessible label;
* search button requires `Search articles` accessible name.

Service links:

* each service row should be a semantic link;
* accessible name must include the service title;
* chevron is decorative.

Service images:

* may use concise meaningful alt text;
* avoid repeating excessively long service descriptions.

---

# 38. Visual Acceptance Criteria — Main Article Hero

The implementation is complete only when:

* [ ] Breadcrumb matches the screenshot hierarchy and placement.
* [ ] H1 reads exactly `Are Dental Implants at Smilux Right for You?`.
* [ ] H1 wraps similarly to the reference.
* [ ] Metadata contains category, reading time, date, and author.
* [ ] Author avatar appears inline with author metadata.
* [ ] Intro highlight card appears directly below metadata.
* [ ] Large blue quote icon matches the design language.
* [ ] Intro copy aligns correctly beside the quote.
* [ ] Hero image fills the main column width.
* [ ] Hero image uses the correct rounded landscape treatment.
* [ ] Image content is relevant to dental implants and implant planning.

---

# 39. Visual Acceptance Criteria — Table of Contents

* [ ] Table of Contents sits directly below the hero image.
* [ ] Outer border/radius matches the reference.
* [ ] Small blue contents/list icon appears beside heading.
* [ ] Exactly 7 reference entries appear.
* [ ] Desktop TOC uses two columns.
* [ ] Numbering remains `1–7`.
* [ ] Items link to actual article sections.
* [ ] No unsupported collapsible/accordion behavior is added.

---

# 40. Visual Acceptance Criteria — Implant Services Sidebar

* [ ] Search module appears at top of sidebar.
* [ ] `Implant Services` card appears immediately beneath.
* [ ] Exactly five reference services display.
* [ ] Each row contains image, title, subtitle, and chevron.
* [ ] Row dimensions remain visually consistent.
* [ ] Images are relevant to the corresponding implant treatment.
* [ ] Existing service assets are reused where possible.
* [ ] `View all implant services →` appears at the bottom.
* [ ] Service links use canonical service routes.
* [ ] Sidebar uses one consistent width.
* [ ] No unrelated services are introduced.

---

# 41. Important Implementation Constraints

Do not:

* create a separate article layout only for Dental Implant articles;
* hard-code the Table of Contents independently from article content;
* duplicate service records solely for the sidebar;
* add article controls not visible in the reference;
* add social-sharing buttons yet;
* add comments;
* add ratings;
* add author biography in this section;
* make the sidebar sticky without supporting design evidence;
* use unrelated service images;
* add more than five service items in the visible reference state;
* replace the introduction highlight with a testimonial;
* introduce an article-body layout before the Table of Contents.

The intended desktop page structure for this stage is:

```text
ARTICLE DETAIL PAGE

Main Column
├── Breadcrumb
├── H1
├── Metadata
├── Intro Highlight
├── Hero Image
└── Table of Contents

Sidebar
├── Article Search
└── Implant Services
```

The next implementation stage can continue with the **actual article-body sections and additional sidebar modules** without rewriting this two-column shell.
