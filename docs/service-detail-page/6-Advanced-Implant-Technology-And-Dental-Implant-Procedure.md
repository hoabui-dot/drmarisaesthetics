# UI Implementation Prompt — Advanced Implant Technology + Dental Implant Procedure

## 1. Task Context

Continue implementing the reusable service-detail page immediately after the **Smilux Implant Structure** section.

Implement the **two sections visible in the supplied design reference**:

1. `Advanced Implant Technology at Smilux`
2. `Dental Implant Procedure`

The screenshot is the primary visual source of truth.

Some small text in the screenshot is not fully readable. For unclear descriptions, use the content specified below instead of attempting to reproduce corrupted OCR.

Before implementation, **research/retrieve appropriate image and icon assets**. Do not leave empty image placeholders when suitable project assets or high-quality matching assets can be found.

---

# 2. Section A — Advanced Implant Technology at Smilux

## Layout

Reproduce the desktop composition shown in the reference.

Section heading:

**Advanced Implant Technology at Smilux**

Directly below the heading, render a **single horizontal 6-column composition**:

- Column 1: large featured technology card.
- Columns 2–6: five smaller technology cards of equal width.
- All cards share the same overall height.
- All cards align to the same top and bottom baseline.
- Use a white page/section background.
- Use subtle pale-blue borders around the five smaller cards.
- Use approximately `12–16px estimated` horizontal gaps.
- Use approximately `12–16px estimated` card radius.
- Keep the section compact like the reference.
- Do not introduce excessive vertical padding.

---

## 3. Featured Technology Card

The first card is visually dominant and should be approximately **2.5–3× the width of one standard technology card**.

### Content

**Title**

OTI® Guided Implant Technology

**Description**

Our proprietary guided implant solution ensures precise placement, minimal tissue trauma, faster recovery, and high long-term success.

**CTA**

Learn More →

### Visual requirements

- Deep navy / royal-blue background.
- White heading.
- White/light description.
- White rounded CTA button.
- Blue CTA text and arrow.
- Text content aligned to the left.
- A high-quality **guided dental implant / surgical guide 3D image** occupies the right half.
- Image should show an implant fixture together with a transparent or semi-transparent surgical guide or jaw model.
- Allow the image to visually overlap into the card composition while remaining clipped by the card radius.
- Do not replace this with a generic tooth photograph.
- Preserve the strong blue/white contrast shown in the reference.

---

## 4. Featured Image Research

Search the existing codebase/assets first using terms such as:

- `guided implant`
- `guided surgery`
- `implant surgical guide`
- `digital implant`
- `implant 3d`
- `OTI implant`

Check:

- `/public`
- `/assets`
- CMS media
- existing service assets
- shared dental illustrations

If no appropriate project asset exists, research a suitable licensed image using queries such as:

- `3D guided dental implant surgical guide`
- `computer guided dental implant 3D render`
- `dental implant surgical guide jaw transparent`
- `digital guided implant surgery illustration`

The visual must communicate:

**Digital planning → surgical guide → controlled implant placement**

Prefer:

- transparent PNG;
- WebP;
- high-resolution 3D render;
- transparent or white-compatible background.

Do not use:

- watermarked stock images;
- low-resolution assets;
- unrelated cosmetic dentistry photography;
- generic standalone implant screws when a guided-surgery visual can be found.

Download/integrate the selected asset locally rather than hot-linking a remote image in production.

---

# 5. Standard Technology Cards

Render five cards to the right of the featured card.

Each card contains:

1. Large blue outline icon.
2. Bold navy title.
3. Short muted description.

### Shared card styling

- White background.
- Pale-blue `1px estimated` border.
- Rounded corners.
- Equal width.
- Equal height.
- Icon centered near the top.
- Title centered.
- Description centered.
- Compact internal spacing.
- Consistent icon dimensions and stroke widths.

---

## Technology 1 — CT Cone Beam 3D

**Title**

CT Cone Beam 3D

**Description**

High-resolution 3D imaging for accurate diagnosis and treatment planning.

**Icon concept**

CBCT / dental scanner / 3D imaging machine.

Search the existing icon library for:

- `scanner`
- `cbct`
- `dental scanner`
- `3d scan`
- `medical scanner`

---

## Technology 2 — Digital Implant Planning

**Title**

Digital Implant Planning

**Description**

Computer-guided planning for predictable and precise implant placement.

**Icon concept**

Computer monitor displaying dental or implant planning information.

Search for:

- `monitor`
- `dental planning`
- `digital planning`
- `medical software`
- `implant planning`

---

## Technology 3 — Minimally Invasive Placement

**Title**

Minimally Invasive Placement

**Description**

Advanced techniques designed to reduce tissue disruption and support faster healing.

**Icon concept**

Dental implant / surgical instrument interacting with gum tissue.

Search for:

- `implant surgery`
- `dental surgery`
- `minimally invasive`
- `implant placement`

Do not introduce unsupported claims such as:

- painless surgery;
- zero swelling;
- zero bleeding;
- guaranteed recovery time.

---

## Technology 4 — Faster Recovery

**Title**

Faster Recovery

**Description**

Streamlined treatment techniques designed to support a smoother recovery.

**Icon concept**

Clock / stopwatch.

Search for:

- `clock`
- `stopwatch`
- `recovery time`
- `time`

Do not add specific recovery-time claims unless they exist in approved content.

---

## Technology 5 — Precision-Guided Workflow

**Title**

Precision-Guided Workflow

**Description**

From digital scanning and planning to precise implant placement at every step.

**Icon concept**

Computer monitor containing dental scan/planning graphics.

Search for:

- `digital workflow`
- `medical monitor`
- `dental scan monitor`
- `computer planning`
- `digital dentistry`

---

# 6. Technology Icon Requirements

Do not use emoji.

Before adding new icons, inspect the existing project icon library and reuse the same icon family used by previous service-detail sections.

Target icon style:

- SVG preferred;
- monoline / outline;
- Smilux blue;
- approximately `42–52px estimated`;
- consistent stroke width;
- rounded line caps where applicable;
- transparent background;
- no multicolor illustrations.

Required icon concepts:

1. CBCT scanner.
2. Digital planning monitor.
3. Implant/surgical placement.
4. Clock/stopwatch.
5. Digital workflow monitor.

Do not mix icon libraries when their stroke widths, proportions, or visual language are noticeably different.

If an exact icon cannot be found, select the closest semantic icon from the project's existing icon family before introducing another library.

---

# 7. Section B — Dental Implant Procedure

Place this section immediately below the technology section.

## Outer Container

Heading:

**Dental Implant Procedure**

Visual requirements:

- White background.
- Thin pale-blue border.
- Rounded outer container approximately `14–16px estimated`.
- Width aligned with the technology section above.
- Heading aligned top-left.
- Compact internal spacing.
- Do not create separate bordered cards for individual procedure steps.

---

# 8. Desktop Procedure Timeline

Render **6 equal procedure steps in one horizontal row**.

The upper portion forms a horizontal progress timeline:

`1 ───────── 2 ───────── 3 ───────── 4 ───────── 5 ───────── 6`

### Timeline requirements

- Each number appears inside a small solid-blue circle.
- Number text is white.
- Markers are horizontally centered relative to their corresponding step columns.
- Connect neighboring markers using a thin pale/medium-blue dotted line.
- Connector line runs visually behind/between the markers.
- Maintain a single continuous timeline appearance.
- Do not turn this into a slider.
- Do not make steps clickable unless existing product behavior explicitly requires it.

Under every marker render:

1. blue outline icon;
2. bold centered title;
3. centered short description.

All six columns must:

- have equal width;
- align their number markers;
- align their icon regions;
- maintain consistent title positioning;
- maintain consistent description width.

---

# 9. Procedure Step 1

**Number**

1

**Title**

Consultation & Scan

**Description**

We evaluate your oral health and take a 3D scan.

**Icon**

Dental scan / consultation monitor.

Search for:

- `dental scan`
- `consultation`
- `medical monitor`
- `3d scan`

---

# 10. Procedure Step 2

**Number**

2

**Title**

Treatment Planning

**Description**

A personalized plan is created using advanced digital planning.

**Icon**

Clipboard / treatment plan.

Search for:

- `clipboard`
- `treatment plan`
- `medical plan`
- `document`

---

# 11. Procedure Step 3

**Number**

3

**Title**

Health Check

**Description**

We assess your gums and bone to confirm readiness for implant treatment.

**Icon**

Heart/check or oral-health assessment symbol.

Search for:

- `health check`
- `heart check`
- `medical check`
- `oral health`

---

# 12. Procedure Step 4

**Number**

4

**Title**

Implant Placement

**Description**

The implant is carefully positioned in the jawbone according to the treatment plan.

**Icon**

Dental implant fixture.

Search for:

- `dental implant`
- `implant`
- `implant placement`

Avoid unsupported claims such as:

- completely painless;
- 100% precise;
- guaranteed success.

---

# 13. Procedure Step 5

**Number**

5

**Title**

Healing & Integration

**Description**

The implant heals and integrates with the surrounding bone.

**Icon**

Clock / healing-time icon.

Search for:

- `clock`
- `healing`
- `recovery`
- `time`

---

# 14. Procedure Step 6

**Number**

6

**Title**

Final Crown Placement

**Description**

The final crown is attached to complete your restored smile.

**Icon**

Tooth / dental crown.

Search for:

- `tooth`
- `dental crown`
- `crown`
- `restoration`

---

# 15. Relative Layout Analysis

## Technology row

Use approximately this desktop relationship:

`Featured Card | Tech | Tech | Tech | Tech | Tech`

The featured card should consume roughly **35–37% of the available row width**.

The five standard cards divide the remaining width evenly.

Important:

- Do not make the featured card full-width.
- Do not place the standard cards on a second row at the target desktop viewport.
- The complete composition should visually read as one technology showcase row.

---

## Procedure row

Use:

`Step 1 | Step 2 | Step 3 | Step 4 | Step 5 | Step 6`

All six columns should:

- have equal width;
- share the same timeline-marker Y position;
- share approximately the same icon Y position;
- center-align titles;
- center-align descriptions;
- avoid individual card borders.

The procedure section is:

**one outer bordered container containing one timeline**

It is NOT:

**six separate cards**

---

# 16. Reusable Component Structure

Treat both areas as reusable service-detail components rather than Dental-Implant-only hard-coded markup.

Recommended conceptual boundaries:

- `ServiceTechnologySection`
- `TechnologyFeatureCard`
- `TechnologyCard`
- `ServiceProcedureSection`
- `ProcedureTimeline`
- `ProcedureStep`

Technology content should be data-driven:

- section title;
- featured card title;
- featured card description;
- featured image;
- featured CTA;
- technology items;
- technology icon;
- technology title;
- technology description.

Procedure content should be data-driven:

- section title;
- ordered steps;
- step number;
- step icon;
- step title;
- step description.

For the Dental Implant service, render exactly the content specified in this prompt.

Do not assume another service must always contain:

- exactly 5 technologies;
- exactly 6 procedure steps;
- the same icons;
- the same featured technology card.

---

# 17. Asset Research and Selection Rules

Before coding:

1. Search the project's existing `/public`, `/assets`, CMS media, and shared icon components.
2. Check assets already used by previous service-detail sections.
3. Reuse the existing Smilux icon family wherever possible.
4. Search/research the guided-implant visual if the exact reference asset is missing.
5. Prefer SVG for icons.
6. Prefer WebP/PNG for the detailed guided-implant illustration.
7. Verify license/use rights before adding externally sourced assets.
8. Optimize raster assets before shipping.
9. Avoid remote hot-linked image URLs in production.
10. Preserve the existing Smilux blue/white visual language.
11. Do not leave temporary placeholder boxes after a suitable asset has been found.
12. Do not use generic dental photography when the design specifically requires technical dental imagery.

For the featured technology visual, prioritize imagery representing:

**3D digital planning + surgical guide + implant placement**

rather than simply:

**a generic implant screw**

---

# 18. Responsive Behavior

Only the desktop layout is directly evidenced by the supplied screenshot.

## Desktop — Required

Technology section:

- Featured card + five technology cards remain on one row.
- Featured card remains visually dominant.
- Standard cards maintain equal width and height.

Procedure section:

- Maintain all six steps on one horizontal timeline.
- Preserve marker alignment.
- Preserve equal-width columns.
- Keep the overall section compact.

## Tablet / Mobile — Implementation Assumption

Do not squeeze six tiny cards or timeline steps into a narrow viewport.

Preferred fallback behavior:

### Technology

- Allow standard cards to wrap into a responsive grid.
- Featured technology card may become full-row.
- Preserve featured card hierarchy.

### Procedure

- Convert the horizontal procedure into a vertical ordered timeline on narrow screens.
- Preserve chronological order `1 → 6`.
- Keep number, icon, title, and description associated clearly with each step.

Do not introduce a carousel unless an existing project pattern explicitly requires one.

---

# 19. Accessibility

### Technology cards

- Technology icons are decorative when title text already communicates their meaning.
- Decorative SVG icons should be hidden from assistive technology.
- The featured technical image requires meaningful alt text if it communicates the guided implant workflow.
- CTA must use semantic link/button behavior based on its actual destination.

### Procedure

- Procedure should use an ordered semantic structure because sequence matters.
- The visible step numbers should correspond to the semantic order.
- Decorative icons should not duplicate the title for screen readers.
- Timeline connector lines are decorative and should not be announced.
- Do not make timeline steps keyboard-focusable unless they actually perform an action.

---

# 20. Visual Acceptance Criteria

Implementation is complete only when desktop screenshot comparison confirms:

- [ ] `Advanced Implant Technology at Smilux` matches the reference hierarchy and alignment.
- [ ] Technology row contains exactly one featured card + five standard cards.
- [ ] Featured card occupies approximately 35–37% of the row.
- [ ] Featured card uses the deep-blue visual treatment.
- [ ] Featured card contains an actual guided-implant technical illustration rather than a placeholder.
- [ ] Featured image composition resembles the supplied design.
- [ ] `Learn More` CTA matches the small white-button treatment.
- [ ] Five technology cards have equal dimensions.
- [ ] All technology icons use one coherent outline style.
- [ ] Technology titles and descriptions fit without overflow.
- [ ] Card border, radius, spacing, and typography match the existing Smilux design system.
- [ ] `Dental Implant Procedure` appears immediately below the technology row.
- [ ] Procedure uses one outer rounded bordered container.
- [ ] Six numbered blue markers align on one horizontal dotted timeline.
- [ ] All six procedure columns have equal width.
- [ ] Six procedure icons align consistently.
- [ ] Step titles and descriptions are centered.
- [ ] Procedure steps are not rendered as six separate bordered cards.
- [ ] No unsupported animation, carousel, slider, modal, or timeline interaction is added.
- [ ] External visual assets have been researched and integrated locally.
- [ ] Raster assets are optimized.
- [ ] Existing Smilux design tokens and icon components are reused wherever possible.
- [ ] Final implementation visually matches the supplied design rather than merely reproducing its textual content.

---

# 21. Important Implementation Constraints

The supplied screenshot remains the primary source of truth for:

- layout;
- proportions;
- hierarchy;
- card composition;
- spacing;
- icon placement;
- timeline structure;
- visual styling.

The content in this prompt resolves text that is too small or unclear in the screenshot.

Do not extrapolate additional UI beyond these two visible sections.

Do not:

- create additional technology cards;
- create additional procedure steps;
- invent medical claims;
- invent interactions;
- add decorative sections;
- change the section ordering;
- replace technical imagery with unrelated generic dental imagery;
- hard-code the content into shared presentation components.

Prioritize **desktop visual fidelity first**, then implement reasonable responsive fallback behavior without changing the reference desktop composition.