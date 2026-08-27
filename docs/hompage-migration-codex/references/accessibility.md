# Design System — Accessibility Rules

## Baseline target
Implement toward WCAG 2.2 AA behavior even though the visual reference itself does not encode accessibility metadata.

## Color
- body text should meet at least 4.5:1 contrast;
- large text at least 3:1;
- focus indicator at least 3:1 against adjacent colors;
- never use blue color alone to indicate selected state: add underline, border, icon or shape.

## Keyboard
All interactive controls must be reachable and operable with keyboard:
- nav and mobile menu;
- doctor/testimonial carousels;
- accordions;
- category tabs;
- before/after slider if implemented;
- form controls;
- TOC anchors.

## Focus
Use a visible focus ring, e.g. 2 px primary with 2 px white offset where appropriate.

## Forms
- persistent labels;
- required state communicated in text;
- errors associated through `aria-describedby`;
- error summary for long forms if multiple fields fail;
- successful submission receives live-region confirmation.

## Images
- descriptive alt text for meaningful clinical/doctor images;
- empty alt for decorative imagery;
- diagrams need adjacent text equivalents.

## Carousels
- do not auto-rotate by default;
- if autoplay exists, provide pause control;
- announce current slide only when user interacts.

## Content
- article heading hierarchy must remain semantic;
- breadcrumbs should use `nav aria-label="Breadcrumb"`;
- phone/email/map actions should have meaningful accessible names.
