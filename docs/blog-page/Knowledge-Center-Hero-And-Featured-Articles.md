# UI Implementation Prompt — Knowledge Center Hero + Featured Articles

## 1. Task Context

Continue implementing the website with the **Blog / Knowledge Center page** shown in the supplied reference.

Implement the first **two sections**:

1. `Knowledge Center Hero`
2. `Featured Articles`

Use the screenshot as the primary source of truth for:

* desktop layout;
* typography hierarchy;
* container width;
* spacing;
* breadcrumb;
* search bar;
* category navigation;
* card dimensions;
* image proportions;
* category badges;
* metadata;
* border radius;
* pale-blue borders;
* navy/blue Smilux visual language.

The page should be reusable and data-driven rather than hard-coded for only the three reference articles.

---

# 2. Page Identity

Recommended route:

`/blog`

or reuse the existing Knowledge Center route if the codebase already defines one.

Recommended page/component structure:

* `KnowledgeCenterPage`
* `KnowledgeCenterHero`
* `ArticleCategoryNav`
* `FeaturedArticlesSection`
* `ArticleCard`

Do not create separate static markup for every category or article.

---

# 3. Section A — Knowledge Center Hero

## Layout Overview

The upper section contains four major areas:

1. breadcrumb;
2. title + subtitle;
3. article search;
4. horizontal category navigation.

Desktop structure:

```text
Breadcrumb

Knowledge Center                         Search articles...
Description

--------------------------------------------------------------
| All Articles | Implant Dentistry | Cosmetic Dentistry | ... |
--------------------------------------------------------------
```

The title block occupies the left side.

The search field is positioned on the right side and approximately vertically aligned with the title/description region.

The category navigation sits below both regions and spans almost the entire content container width.

---

# 4. Breadcrumb

Render at the upper-left of the content container.

Content:

`Home  >  Knowledge Center`

### Visual requirements

* small home icon before `Home`;
* `Home` displayed in Smilux blue;
* chevron separator;
* `Knowledge Center` uses muted navy/slate;
* small typography;
* compact horizontal spacing.

Recommended conceptual structure:

* Home icon
* Home link
* chevron
* current page label

Do not make the current page breadcrumb item interactive.

---

# 5. Hero Title

**Title**

Knowledge Center

### Subtitle

Expert dental knowledge from Smilux to help you understand, prevent, and care for your smile.

### Visual requirements

Title:

* deep navy;
* bold;
* approximately `36–40px estimated`;
* left aligned;
* strong visual hierarchy.

Subtitle:

* muted navy/slate;
* approximately `14–15px estimated`;
* line-height approximately `21–23px estimated`;
* max-width approximately `340–390px estimated`;
* wraps into approximately 2 lines like the reference.

Use generous whitespace between breadcrumb and title.

---

# 6. Search Bar

Position the search control on the right side of the hero content.

Placeholder:

`Search articles...`

### Desktop dimensions

Approximate width:

`330–360px estimated`

Approximate height:

`42–46px estimated`

### Visual treatment

* white surface;
* very pale gray/blue border;
* pill-shaped radius;
* subtle shadow if matching existing design tokens;
* placeholder text muted gray-blue.

At the far right, render a circular blue search button integrated visually with the field.

Search button:

* solid Smilux blue;
* white magnifying-glass icon;
* circular;
* approximately the full height of the search field.

---

# 7. Search Behavior

Implement actual article filtering/search behavior if the existing blog architecture supports it.

Search should match against at least:

* article title;
* summary/excerpt;
* category;
* optionally tags.

Recommended behavior:

* case-insensitive;
* trim whitespace;
* debounce input if filtering triggers API requests;
* clear search restores current category results.

Do not invent a separate search-results page unless the existing project architecture requires one.

If content is already loaded client-side, inline filtering is sufficient.

If Strapi/CMS already drives article search, reuse the existing API/filter convention.

---

# 8. Category Navigation

Below the hero title/search area, render one large rounded category navigation container.

### Container

* white background;
* pale-blue border;
* subtle shadow;
* approximately `12–14px estimated` radius;
* horizontal row;
* equal or near-equal item distribution.

Reference categories:

1. All Articles
2. Implant Dentistry
3. Cosmetic Dentistry
4. Orthodontics
5. Preventive Care
6. Dental Technology
7. General Knowledge

---

# 9. Category Item Anatomy

Each category contains:

1. outline icon;
2. category label.

Desktop layout:

* icon above;
* label below;
* both centered.

Target icon size:

`26–32px estimated`

Target card/item height:

`78–84px estimated`

No separate visible card border between categories.

---

# 10. Category Seed Content and Icons

## Category 1

**Label**

All Articles

**Icon**

Grid / four-square icon.

---

## Category 2

**Label**

Implant Dentistry

**Icon**

Dental implant / implant-supported tooth.

---

## Category 3

**Label**

Cosmetic Dentistry

**Icon**

Sparkling tooth / aesthetic tooth.

---

## Category 4

**Label**

Orthodontics

**Icon**

Tooth with braces.

---

## Category 5

**Label**

Preventive Care

**Icon**

Tooth / heart / protection symbol.

---

## Category 6

**Label**

Dental Technology

**Icon**

Technology gear / digital dentistry icon.

---

## Category 7

**Label**

General Knowledge

**Icon**

Shield/book/general dental information symbol.

---

# 11. Active Category State

Reference active category:

`All Articles`

Active state requirements:

* blue icon;
* blue label;
* thin blue line at the bottom of the category item;
* additional short blue indicator line near/top boundary is visible in the supplied design.

The active item should be programmatically identifiable.

Inactive items:

* muted navy/blue icons;
* muted navy labels;
* no blue underline.

Do not use background fill to indicate the active category unless the project design system already requires it.

---

# 12. Category Interaction

Clicking a category should filter the article listing.

Recommended state:

`activeCategory`

Possible values:

* `all`
* `implant-dentistry`
* `cosmetic-dentistry`
* `orthodontics`
* `preventive-care`
* `dental-technology`
* `general-knowledge`

Selecting `All Articles` clears the category restriction.

Search and category filters should work together.

Example:

```text
Category = Implant Dentistry
Search = "implant"

→ Show Implant Dentistry articles matching "implant"
```

Do not implement category navigation as separate hard-coded pages unless routing already exists in the codebase.

---

# 13. Category Icon Research

First inspect:

* existing project icon library;
* service-detail icons;
* `/public`;
* `/assets`;
* existing shared SVG components.

Reuse the same monoline dental icon family already used across Smilux.

If assets are missing, research/find matching outline SVG icons using concepts:

* dental implant outline icon;
* cosmetic tooth sparkle outline;
* tooth braces outline;
* preventive dental care icon;
* dental technology gear outline;
* dental knowledge shield icon;
* grid outline icon.

Target style:

* monoline;
* blue;
* consistent stroke width;
* transparent background;
* no emoji;
* no multicolor icon set.

Do not mix significantly different icon families.

---

# 14. Section B — Featured Articles

Place this section directly below the category navigation.

Desktop reference structure:

```text
Featured Articles                          VIEW ALL ARTICLES →

[ Article 1 ]   [ Article 2 ]   [ Article 3 ]
```

---

# 15. Section Header

Left:

**Featured Articles**

Right:

**VIEW ALL ARTICLES →**

### Heading styling

* deep navy;
* bold;
* approximately `22–24px estimated`.

### View All action

* uppercase blue text;
* medium/semi-bold;
* small right arrow;
* aligned with heading baseline.

Use semantic link behavior if the destination exists.

Preferred destination:

* all blog articles;
* or clears featured/category filters depending on existing page architecture.

Do not invent a route if the project already has a canonical blog listing path.

---

# 16. Featured Articles Grid

Desktop:

* exactly 3 cards in one row;
* equal widths;
* approximately `28–34px estimated` horizontal gap;
* card height approximately equal despite content length;
* all cards align at top and bottom.

Reference:

```text
Article 1 | Article 2 | Article 3
```

Cards should remain inside the same centered content container as the hero.

---

# 17. Article Card Anatomy

Each card contains:

1. article image;
2. category badge over image;
3. article title;
4. excerpt;
5. metadata row.

### Card styling

* white surface;
* pale-blue/gray border;
* approximately `12–14px estimated` radius;
* subtle shadow;
* hidden overflow for image clipping.

### Image

* full card inner width;
* landscape ratio approximately `1.75–1.9:1`;
* upper corners follow card radius;
* use `object-fit: cover`;
* preserve key dental subject.

### Category badge

Position:

* bottom-left over image.

Visual style:

* blue pill;
* white uppercase text;
* small size;
* approximately `18–22px estimated` height.

---

# 18. Featured Article 1

## Category

IMPLANT DENTISTRY

## Title

What Is a Dental Implant? Complete Guide for Beginners

## Description

Everything you need to know about dental implants, benefits, procedure, and recovery.

## Date

May 10, 2024

## Reading time

8 min read

### Image direction

Use a close-up clinical/3D dental illustration showing:

* natural teeth;
* one visible dental implant;
* gum tissue;
* crown/implant comparison.

The image should resemble the reference's bright blue/white clinical rendering.

### Image research queries

Search project assets first:

* `dental implant article`
* `implant guide`
* `implant tooth`
* `implant blog`

If unavailable, research:

* `dental implant 3D illustration tooth gum`
* `dental implant close up render`
* `dental implant educational image`

Avoid unrelated surgery photography or graphic surgical imagery.

---

# 19. Featured Article 2

## Category

ORTHODONTICS

## Title

Is Invisalign Right for You? Pros, Cons & What to Expect

## Description

A complete guide to Invisalign treatment, how it works, and who can benefit most.

## Date

May 6, 2024

## Reading time

6 min read

### Image direction

Use:

* close-up smiling mouth;
* transparent clear aligner being fitted or removed;
* healthy white teeth;
* clean bright photography.

### Research queries

* `clear aligner smile close up`
* `invisible braces aligner teeth`
* `clear dental aligner mouth`
* `Invisalign style aligner close up`

Prefer generic clear-aligner imagery rather than visible third-party product branding unless licensed/approved.

---

# 20. Featured Article 3

## Category

COSMETIC DENTISTRY

## Title

Teeth Whitening: Safe, Effective & Long-Lasting Results

## Description

Learn about professional teeth whitening options, benefits, and aftercare tips.

## Date

Apr 28, 2024

## Reading time

5 min read

### Image direction

Use:

* smiling adult;
* clean white teeth;
* beauty/cosmetic dental photography;
* bright soft-blue/white background.

Prefer a crop similar to the screenshot:

* face visible mostly from approximately nose/chin region or portrait crop;
* smile is the visual focus.

### Research queries

* `professional teeth whitening smile`
* `cosmetic dentistry white smile portrait`
* `teeth whitening woman smile clinic`

Avoid exaggerated or obviously artificial whitening results.

---

# 21. Featured Image Research Rules

Before using external images:

1. Search the codebase and CMS first.
2. Reuse existing approved article images where available.
3. If missing, research high-quality licensed replacements.
4. Use comparable photographic/illustrative style across all three cards.
5. Optimize downloaded assets.
6. Save assets locally instead of production hot-linking when possible.
7. Preserve image attribution/licensing requirements when applicable.

Preferred formats:

* WebP;
* optimized JPG;
* PNG only when transparency is needed.

Do not use:

* watermarked stock imagery;
* low-resolution screenshots;
* unrelated dental subjects;
* image placeholders in final implementation.

---

# 22. Article Metadata

Each article card footer contains:

```text
[calendar icon] Date   •   [clock icon] Reading time
```

Reference visual behavior:

* metadata positioned near bottom-left;
* small muted navy/slate text;
* small outline calendar icon;
* small outline clock icon;
* separator dot between date and reading time.

Example:

`May 10, 2024 · 8 min read`

Keep card metadata aligned consistently despite varying excerpt length.

---

# 23. Article Card Layout Strategy

Card internal vertical structure should allow metadata to remain aligned near the bottom.

Conceptual layout:

```text
Image
Category Badge
Title
Excerpt
Flexible Space
Metadata
```

Do not let shorter article descriptions make one card visibly shorter than neighboring cards.

Article titles may wrap to approximately 2 lines.

Excerpt should remain around 2–3 lines at the reference desktop width.

Do not truncate titles unnecessarily.

---

# 24. Article Card Interaction

Preferred:

* article title and/or card links to the article detail page;
* maintain semantic anchor behavior.

If the existing blog architecture makes the entire card clickable, reuse that pattern.

Do not add:

* Read More button;
* bookmark control;
* share control;
* author avatar;
* comment counter;

because they are absent from the reference.

---

# 25. Seed Data Model

Use structured article data.

Conceptually each article supports:

```text
id
slug
title
excerpt
category
categorySlug
image
publishedAt
readingTime
featured
```

Categories should also come from structured data:

```text
id
label
slug
icon
```

Do not duplicate category names independently inside article cards and navigation if the CMS provides category relationships.

---

# 26. Featured Article Behavior

The three visible cards should represent articles marked/configured as featured.

Do not assume `featured` means simply the newest three unless product architecture explicitly defines it that way.

Preferred priority:

1. CMS `featured` flag/order if available;
2. explicit seeded featured articles;
3. latest articles only as a fallback.

The `Featured Articles` section should be able to accept a configurable number of items even though the reference shows exactly 3 on desktop.

---

# 27. Search + Category + Featured Relationship

The top category/search controls belong to the page-level Knowledge Center experience.

Do not unexpectedly alter the three featured cards merely because the user types in the search field unless the existing product design defines that behavior.

Recommended behavior:

* Hero search/category controls drive the main article listing that follows later on the page.
* `Featured Articles` remains a curated featured block.

If the current implementation only contains these two sections for now, keep the filter state/data architecture ready for the later general article listing.

---

# 28. Responsive Behavior

Only desktop is evidenced directly by the screenshot.

## Desktop — Required

### Hero

* Title/description left.
* Search bar right.
* Category navigation all in one row.
* Seven categories visible simultaneously.

### Featured Articles

* 3 cards in one row.
* Equal card widths/heights.

---

## Tablet — Inferred

### Hero

* Keep title/search on one row where width permits.
* Category navigation can wrap or become horizontally scrollable.

Prefer horizontal scrolling over aggressively shrinking category labels/icons.

### Featured Articles

Prefer:

`2 columns`

with the third card wrapping to the next row.

---

## Mobile — Inferred

Recommended order:

1. breadcrumb;
2. title;
3. subtitle;
4. search;
5. horizontally scrollable category navigation;
6. Featured Articles heading;
7. article cards stacked vertically.

Do not shrink the seven categories into unreadably narrow columns.

Do not convert article cards into a carousel unless the project already uses this pattern.

---

# 29. Accessibility

## Breadcrumb

* use semantic breadcrumb navigation;
* mark current page appropriately;
* decorative chevron hidden from assistive technology.

## Search

* search field requires an accessible label;
* do not rely only on placeholder text;
* search button requires accessible name such as `Search articles`.

## Categories

If they perform filtering rather than navigation:

* use semantic buttons;
* expose selected state programmatically.

If they navigate to category URLs:

* use semantic links.

Do not use clickable `div` elements.

## Articles

* article image needs purposeful alt text when informative;
* category badge should be readable text;
* metadata icons are decorative;
* linked article title/card must have a clear accessible name.

---

# 30. Visual Acceptance Criteria — Knowledge Center Hero

The implementation is complete only when:

* [ ] Breadcrumb placement matches the reference.
* [ ] `Knowledge Center` title matches hierarchy and alignment.
* [ ] Subtitle wraps similarly to the screenshot.
* [ ] Search bar is positioned on the right at desktop.
* [ ] Search control uses rounded pill styling.
* [ ] Blue circular search button appears at the field's right edge.
* [ ] Category container spans nearly the full content width.
* [ ] Exactly seven reference categories appear.
* [ ] Category icons use one consistent outline style.
* [ ] `All Articles` is active by default.
* [ ] Active category uses blue text/icon and underline.
* [ ] Category spacing is uniform.
* [ ] No unsupported filters, tags, sort dropdowns, or buttons are added.

---

# 31. Visual Acceptance Criteria — Featured Articles

The implementation is complete only when:

* [ ] `Featured Articles` appears below category navigation.
* [ ] `VIEW ALL ARTICLES →` appears right-aligned.
* [ ] Exactly three reference cards appear in one desktop row.
* [ ] Cards have equal width and height.
* [ ] Images use approximately the same aspect ratio.
* [ ] Each image contains its category badge at bottom-left.
* [ ] Article titles match the supplied content.
* [ ] Article excerpts match the supplied content.
* [ ] Metadata includes date and reading time.
* [ ] Metadata rows align consistently.
* [ ] Card border/radius/shadow treatment matches the screenshot.
* [ ] Exact or appropriately researched dental images replace placeholders.
* [ ] No unsupported author/avatar/share/bookmark UI is added.
* [ ] Article content is rendered from structured data.

---

# 32. Important Implementation Constraints

Do not:

* hard-code article cards directly into presentation markup;
* create a different component for every article category;
* add unsupported blog controls;
* add pagination in these first two sections;
* add tag clouds;
* add author filters;
* add sorting dropdowns;
* add newsletter signup;
* introduce card CTAs absent from the screenshot;
* use unrelated stock imagery;
* use mismatched icon styles;
* duplicate category data across multiple components when CMS data exists.

The page sequence for this implementation must remain:

`Knowledge Center Hero`
→ `Category Navigation`
→ `Featured Articles`

Future article listing sections can be added after this without rewriting these components.
