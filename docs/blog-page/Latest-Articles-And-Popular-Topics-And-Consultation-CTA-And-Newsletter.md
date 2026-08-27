# UI Implementation Prompt — Latest Articles + Popular Topics + Consultation CTA + Newsletter

## 1. Task Context

Continue implementing the **final content section of the Knowledge Center / Blog page** based on the supplied desktop reference.

This final page area contains four coordinated modules:

1. `Latest Articles`
2. `Popular Topics`
3. `Have a Question?` consultation card
4. `Stay Informed, Stay Healthy` newsletter CTA

Use the screenshot as the primary source of truth for:

* desktop proportions;
* content hierarchy;
* article list layout;
* sidebar width;
* card spacing;
* typography;
* pagination;
* category colors;
* article thumbnails;
* CTA styling;
* pale-blue card surfaces;
* final dark-blue newsletter banner.

Continue using the same blog/article data model established in the previous Knowledge Center sections.

Do not hard-code duplicate article/category content directly into presentation components.

---

# 2. Overall Desktop Layout

The main content area uses a **two-column desktop layout**:

```text
Latest Articles                          Sidebar
----------------------------------       ----------------------
Article list                             Popular Topics
Article list
Article list                             Have a Question?
Article list
Article list

Pagination
```

Below both columns:

```text
--------------------------------------------------------------
| Stay Informed, Stay Healthy | Email input | SUBSCRIBE       |
--------------------------------------------------------------
```

Approximate desktop relationship:

* main article column: `~67–70%`
* sidebar: `~27–30%`
* horizontal gap: `~35–45px estimated`

The newsletter banner spans the full content-container width below both columns.

---

# 3. Latest Articles Header

Section heading:

**Latest Articles**

Place this at the top-left of the main column.

On the same horizontal row, align a sort dropdown toward the right side of the article column.

Default sort value:

**Newest First**

### Sort control styling

* white surface;
* pale-blue/gray border;
* approximately `8–10px estimated` radius;
* compact height;
* small muted navy text;
* down-chevron at the far right.

Do not make the dropdown visually dominant.

---

# 4. Sort Behavior

Support article sorting from data rather than changing static markup.

Recommended options:

* `Newest First`
* `Oldest First`
* `Most Read`

If the CMS already supports another canonical sort model, reuse it instead.

Default:

`Newest First`

Do not invent complex sort options such as:

* highest rated;
* trending today;
* editor score;

unless they already exist in the product.

---

# 5. Latest Article List Layout

Render article results as a **vertical list**, not large cards.

Each row contains:

```text
[Thumbnail] [Category
             Article Title
             Excerpt
             Metadata]                          [→]
```

### Row requirements

* image on left;
* content in center;
* circular arrow button on far right;
* consistent row height;
* subtle horizontal divider between rows;
* no large bordered card around each row;
* compact spacing.

Thumbnail approximate size:

* `155–165px estimated` width;
* `100–110px estimated` height;
* landscape crop;
* approximately `10–12px estimated` radius.

---

# 6. Article Row Typography

### Category

* uppercase;
* small;
* blue;
* semi-bold.

### Title

* deep navy;
* bold;
* approximately `15–17px estimated`;
* maximum approximately 2 lines.

### Excerpt

* muted navy/slate;
* approximately `11–12px estimated`;
* around 2 lines.

### Metadata

Use:

`date · reading time`

Example:

`May 8, 2024 · 7 min read`

Use small muted text.

Optional metadata icons are not clearly required in this list reference, so do not add them unless existing shared blog components already use them here.

---

# 7. Latest Article 1

## Category

IMPLANT DENTISTRY

## Title

How Long Do Dental Implants Last? Factors That Affect Implant Longevity

## Excerpt

Dental implants are a long-term solution, but how long do they really last? Discover the key factors that influence their durability.

## Date

May 8, 2024

## Reading Time

7 min read

### Image direction

Use a clean dental implant clinical/3D image showing:

* natural teeth;
* gum tissue;
* one implant fixture;
* restoration/crown.

Prefer a crop similar to the reference with an implant positioned between natural teeth.

### Asset research terms

* `dental implant longevity article`
* `implant between teeth 3d render`
* `dental implant gum illustration`
* `implant crown close up`

---

# 8. Latest Article 2

## Category

GENERAL KNOWLEDGE

## Title

Gum Disease: Signs, Causes & Treatment Options

## Excerpt

Gum disease is common but preventable. Learn the warning signs, causes, and effective treatment methods.

## Date

May 4, 2024

## Reading Time

6 min read

### Image direction

Use close-up dental imagery demonstrating:

* gum inflammation;
* red gum line;
* natural teeth;
* clinically recognizable gingival condition.

Do not use excessively graphic imagery.

### Asset research terms

* `gum disease gingivitis teeth close up`
* `periodontal disease dental photo`
* `inflamed gums dentistry`

---

# 9. Latest Article 3

## Category

COSMETIC DENTISTRY

## Title

Porcelain Veneers: Transform Your Smile

## Excerpt

Porcelain veneers can fix discoloration, chips, and gaps. See how they work and if they're right for you.

## Date

Apr 30, 2024

## Reading Time

6 min read

### Image direction

Use:

* porcelain veneers;
* front teeth;
* cosmetic dentistry close-up;
* bright neutral background.

Prefer imagery showing thin veneer shells/restorations near natural teeth.

### Research terms

* `porcelain veneers dental close up`
* `dental veneers cosmetic dentistry`
* `veneer restoration teeth`

---

# 10. Latest Article 4

## Category

PREVENTIVE CARE

## Title

Kids Dental Care: Tips for Healthy Smiles

## Excerpt

Good oral habits start early. Expert tips to keep your child's teeth healthy and cavity-free.

## Date

Apr 25, 2024

## Reading Time

5 min read

### Image direction

Use friendly pediatric dentistry photography:

* child in dental chair;
* dentist nearby;
* positive expression;
* bright clinic environment.

Avoid imagery where the child appears distressed.

### Research terms

* `pediatric dentist child happy dental clinic`
* `kids dental care dentist`
* `child dental checkup smiling`

---

# 11. Latest Article 5

## Category

DENTAL TECHNOLOGY

## Title

3D CT Scan in Dentistry: Benefits & Importance

## Excerpt

3D CT technology provides precise diagnostic information for modern dental treatment and planning.

## Date

Apr 20, 2024

## Reading Time

5 min read

### Image direction

Use:

* dental CBCT scanner;
* cone beam CT machine;
* modern dental imaging equipment.

Prefer white/blue clinical equipment photography similar to the reference.

### Research terms

* `dental CBCT scanner`
* `cone beam CT dental machine`
* `3D dental CT scanner clinic`

---

# 12. Article Thumbnail Research Rules

First search:

* project `/public`;
* `/assets`;
* Strapi/CMS media;
* existing blog article images;
* service-detail imagery that can appropriately be reused.

If assets are missing, research high-quality licensed imagery.

Requirements:

* no watermark;
* no unrelated dental subject;
* consistent bright clinical color temperature;
* similar thumbnail aspect ratio;
* optimize downloaded assets;
* use WebP/JPG where appropriate;
* host locally in production rather than relying on unstable remote hotlinks.

Each article must use an image semantically related to its actual topic.

Do not reuse the same thumbnail for multiple unrelated articles.

---

# 13. Article Navigation Button

At the far-right of each article row, render a compact circular button.

Visual treatment:

* white background;
* pale-blue outline;
* blue right chevron/arrow;
* approximately `32–38px estimated` diameter.

Interaction:

* navigates to the corresponding article detail page;
* entire article row may also be clickable if the existing blog architecture already follows that pattern.

Do not add a visible `Read More` label.

Accessible name example:

`Read How Long Do Dental Implants Last? Factors That Affect Implant Longevity`

---

# 14. Pagination

Below the latest-article list, render compact pagination.

Reference:

`1  2  3  4  …  10  →`

### Active page

Page `1` is active.

Active styling:

* solid blue circle;
* white number.

Inactive pages:

* white/light circle;
* pale border;
* navy/slate number.

Last control:

* right arrow.

Keep pagination aligned near the left/center region under the article list, as shown in the reference.

---

# 15. Pagination Behavior

Pagination must be data-driven.

Recommended state:

* current page;
* total pages;
* page size.

Do not hard-code exactly `10` pages if real CMS data produces a different total.

The screenshot value `10` is a visual reference/seed only.

Changing page should update only the article listing.

Do not refresh unrelated page sections such as:

* Featured Articles;
* Popular Topics;
* consultation CTA;
* newsletter.

---

# 16. Sidebar — Popular Topics

At the upper-right, render a rounded sidebar card.

Heading:

**Popular Topics**

### Visual treatment

* very pale blue/gray surface;
* approximately `14–16px estimated` radius;
* no heavy border;
* generous padding;
* heading deep navy and bold.

Render six category rows:

| Topic              | Count |
| ------------------ | ----: |
| Implant Dentistry  |    24 |
| Cosmetic Dentistry |    18 |
| Orthodontics       |    16 |
| Preventive Care    |    14 |
| Dental Technology  |    10 |
| General Knowledge  |    22 |

At the bottom:

**View All Topics →**

Use Smilux blue.

---

# 17. Popular Topic Row Behavior

Each row contains:

* category name left;
* article count right.

Keep rows compact and evenly spaced.

If categories already come from CMS:

* use real category names;
* derive real article counts;
* treat screenshot counts as seed/reference values only.

Clicking a category should use the same category-filter architecture established in the Knowledge Center hero.

Do not implement a separate filtering system for this card.

---

# 18. View All Topics

CTA:

**View All Topics →**

Behavior should preferably:

* clear category filtering and/or;
* navigate to the full topic/category view;

depending on the existing blog architecture.

Do not invent a new route if the page already handles categories inline.

---

# 19. Sidebar — Have a Question?

Place the consultation card below `Popular Topics`.

Heading:

**Have a Question?**

Supporting copy:

**Our dental experts are here to help you with your concerns.**

CTA:

**BOOK CONSULTATION →**

Below the CTA, display a professional image of **two Smilux dental professionals**.

---

# 20. Consultation Card Visual Requirements

* pale cool-blue background;
* approximately `14–16px estimated` radius;
* no heavy border;
* title top-left;
* supporting copy below;
* blue rounded CTA;
* doctor image anchored at the bottom;
* image may slightly overlap into the card composition;
* keep the card tall enough for full upper-body doctor portraits.

CTA:

* solid Smilux blue;
* white text;
* rounded/pill shape;
* right arrow.

Do not add another phone/email CTA here.

---

# 21. Doctor Image Requirements

The reference shows:

* one male dental professional;
* one female dental professional;
* white coats;
* blue clinical accents;
* smiling;
* waist/chest-up;
* clean light background.

Search existing project staff imagery first.

If unavailable, research a visually consistent placeholder pair.

Search terms:

* `Asian dentists male female white coat portrait`
* `dental team two doctors white coat`
* `male female dentists clinic portrait`
* `professional dental team transparent`

Preferred:

* transparent PNG/WebP if available;
* both professionals from the same image/photo set;
* clean white or transparent background;
* professional clinical presentation.

Do not combine two portraits with obviously inconsistent lighting unless there is no better asset.

If actual Smilux dentists are available in project data, use those instead.

---

# 22. Consultation CTA Behavior

Reuse the site's existing consultation architecture.

Potential existing behavior may include:

* booking page;
* consultation form;
* anchor scroll;
* modal.

Do not invent behavior.

Reuse the same `BOOK CONSULTATION` action used elsewhere if possible.

---

# 23. Newsletter Banner

Place the newsletter CTA below the entire article + sidebar layout.

It spans the **full content-container width**.

Reference composition:

```text
[Mail Icon] Stay Informed, Stay Healthy    [Email Input] [SUBSCRIBE]
            supporting description
```

Use a dark/deep navy-blue background.

Approximate height:

`80–90px estimated`

Radius:

`10–12px estimated`

---

# 24. Newsletter Left Content

Use a circular white/light icon holder.

Icon:

**Envelope / email**

Inside:

* blue outline mail icon.

Text:

### Heading

**Stay Informed, Stay Healthy**

### Description

Subscribe to our newsletter for the latest dental tips, treatment updates, and exclusive offers.

### Visual treatment

Heading:

* white;
* bold.

Description:

* light blue/white;
* small;
* maximum 2 lines.

---

# 25. Newsletter Form

Right side contains:

1. email field;
2. `SUBSCRIBE` button.

### Email placeholder

`Enter your email`

### Subscribe CTA

`SUBSCRIBE`

### Input styling

* white background;
* muted placeholder;
* approximately `8px estimated` radius;
* no excessive shadow.

### Button styling

* brighter blue than banner background;
* white uppercase text;
* rounded right-side treatment;
* visually connected with input but maintain clear field/button boundaries.

Reference approximate relationship:

* email input `~70–75%` of newsletter form width;
* subscribe button `~25–30%`.

---

# 26. Newsletter Behavior

Use an existing newsletter integration if one already exists.

If not, implement the frontend structure with configurable submission behavior.

Required validation:

* email is required;
* basic valid email format.

Do not invent:

* Mailchimp integration;
* HubSpot integration;
* newsletter API;
* CRM destination;
* double opt-in flow;

unless the project already defines one.

Provide accessible loading/error/success states if submission functionality exists.

---

# 27. Newsletter Accessibility

Email field must have a programmatic label.

Do not use placeholder text as the only accessible label.

Subscribe button:

* semantic button;
* keyboard accessible;
* visible focus state.

Mail icon is decorative.

If subscription succeeds, communicate success with accessible status messaging.

---

# 28. Reusable Component Architecture

Recommended conceptual components:

## Latest articles

* `LatestArticlesSection`
* `ArticleList`
* `ArticleListItem`
* `ArticleSort`
* `Pagination`

## Sidebar

* `KnowledgeSidebar`
* `PopularTopicsCard`
* `ConsultationSidebarCard`

## Newsletter

* `NewsletterBanner`
* `NewsletterForm`

Reuse article/category types already used by:

* Featured Articles;
* category navigation;
* future article-detail pages.

Do not introduce a second incompatible article schema.

---

# 29. Article Data Model

Each article should continue supporting fields such as:

* `id`
* `slug`
* `title`
* `excerpt`
* `category`
* `image`
* `publishedAt`
* `readingTime`
* `featured`

Latest Articles should derive from the same source as Featured Articles.

Featured and Latest are presentation/filter states, not separate article entity types.

---

# 30. Filter + Sort + Pagination Relationship

The final article listing should support:

* category from Knowledge Center Hero;
* search query;
* sort order;
* pagination.

Conceptual filter pipeline:

```text
All Articles
↓
Category filter
↓
Search filter
↓
Sort
↓
Pagination
↓
Visible Latest Articles
```

When category or search changes:

* reset current page to `1`.

Do not keep the user on a later invalid pagination page.

---

# 31. Sidebar Relationship to Filters

Popular Topics should use the same category identifiers as the hero category navigation.

Example:

Click:

`Implant Dentistry`

should produce the same active category as clicking:

`Implant Dentistry`

in the top category nav.

Do not duplicate filtering logic.

---

# 32. Responsive Behavior

Only desktop behavior is directly evidenced.

## Desktop — Required

Main structure:

`Latest Articles | Sidebar`

Sidebar:

`Popular Topics`
then
`Have a Question?`

Newsletter spans the full width below both.

---

## Tablet — Inferred

Preferred:

* main articles retain primary width;
* sidebar becomes narrower if still viable;

or stack:

1. Latest Articles
2. Popular Topics
3. Have a Question?
4. Newsletter

Avoid squeezing article titles into excessively narrow columns.

---

## Mobile — Inferred

Recommended order:

1. Latest Articles heading;
2. sort control;
3. article rows;
4. pagination;
5. Popular Topics;
6. Have a Question?;
7. newsletter.

Article rows may become:

```text
Thumbnail
Category
Title
Excerpt
Metadata
```

or use a smaller thumbnail beside content if width permits.

Newsletter should stack:

1. mail icon/content;
2. email field;
3. subscribe button.

---

# 33. Visual Acceptance Criteria — Latest Articles

* [ ] `Latest Articles` appears at the correct top-left position.
* [ ] `Newest First` sort control appears on the same header row.
* [ ] Exactly five seeded article rows appear for the reference desktop state.
* [ ] Each row uses thumbnail left, article content center, arrow right.
* [ ] Thumbnails use consistent dimensions.
* [ ] Category labels are uppercase blue.
* [ ] Article titles match supplied seed copy.
* [ ] Excerpts remain concise.
* [ ] Date and reading time appear below each excerpt.
* [ ] Rows are separated by subtle dividers.
* [ ] No large bordered card wraps each article.
* [ ] Pagination appears below the list.
* [ ] Page 1 is visibly active.
* [ ] Article data remains configurable.

---

# 34. Visual Acceptance Criteria — Popular Topics

* [ ] Sidebar is positioned to the right of articles.
* [ ] `Popular Topics` card uses pale-blue surface.
* [ ] Six category rows appear.
* [ ] Category labels align left.
* [ ] Counts align right.
* [ ] `View All Topics →` appears at bottom.
* [ ] Topic interactions reuse the top category filtering system.
* [ ] No unsupported chart or visual statistics are added.

---

# 35. Visual Acceptance Criteria — Have a Question?

* [ ] Card appears directly below Popular Topics.
* [ ] Heading matches reference hierarchy.
* [ ] Supporting description appears beneath.
* [ ] Blue `BOOK CONSULTATION →` CTA is present.
* [ ] Two dentist portraits occupy the lower card region.
* [ ] Portraits use consistent lighting and professional appearance.
* [ ] Card uses the same pale-blue sidebar surface language.
* [ ] No additional contact details are introduced.

---

# 36. Visual Acceptance Criteria — Newsletter

* [ ] Newsletter banner spans the full content width.
* [ ] Dark navy-blue background matches the reference.
* [ ] Circular email icon appears on the left.
* [ ] `Stay Informed, Stay Healthy` matches exact copy.
* [ ] Supporting subscription text appears below.
* [ ] Email input appears on the right on desktop.
* [ ] `SUBSCRIBE` button is visually attached/aligned with the input.
* [ ] Button uses bright Smilux blue.
* [ ] Banner radius and height closely match the screenshot.
* [ ] No unrelated social media icons or secondary newsletter CTA are added.

---

# 37. Important Implementation Constraints

Do not:

* create separate article schemas for Featured and Latest;
* hard-code topic counts into reusable category components;
* add authors if absent from the design;
* add comment counts;
* add social sharing controls;
* add bookmarks;
* add sidebar advertisements;
* autoplay or rotate sidebar content;
* turn Latest Articles into a card grid;
* turn the consultation sidebar card into a slider;
* invent newsletter backend integrations;
* use unrelated or watermarked article images;
* add additional page sections below the newsletter without a separate design requirement.

The final Knowledge Center page sequence should now be:

```text
Knowledge Center Hero
↓
Category Navigation
↓
Featured Articles
↓
Latest Articles + Sidebar
↓
Newsletter
```

This completes the main desktop Knowledge Center / Blog listing page.
