# Integration Phase — Forms and Interactive Components

Audit every interactive element introduced by the new design.

## Forms

For all consultation/contact forms:
- preserve real backend submission;
- preserve server validation;
- keep reCAPTCHA/spam protection if currently used;
- keep SMTP/email secrets server-only;
- validate upload behavior if medical images/documents are supported;
- never log sensitive case details in client analytics;
- expose accessible pending/success/error states;
- prevent accidental double-submit.

## UI interactions

Verify:
- responsive nav/menu;
- FAQ accordions;
- sticky TOC;
- filters;
- before/after sliders;
- galleries/carousels;
- modal/video if present;
- CTA scrolling/deep links.

Prefer CSS for simple transitions.
Use Framer Motion only when the interaction genuinely benefits from it.
Respect `prefers-reduced-motion`.

## Failure modes

Test:
- slow network;
- API 4xx/5xx;
- empty data;
- invalid form;
- bot check failure;
- image loading failure;
- JavaScript disabled where core server-rendered content should remain readable.
