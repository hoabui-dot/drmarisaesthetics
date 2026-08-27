# 01 — Homepage Content + Action Contract

## Mandatory rule

Before modifying a section, Codex must build a Figma Element Inventory for that section.

Every visible target element must have exactly one implementation status:

- `CMS_FIELD`
- `GLOBAL_CMS_FIELD`
- `EXISTING_BUSINESS_ACTION`
- `ROUTE`
- `DERIVED_PRESENTATION`
- `BLOCKED_MEDIA`
- `BLOCKED_FUNCTIONAL`

`MISSING`, `IGNORED`, and silent fallback are not valid release statuses.

The user has explicitly allowed missing imagery to be temporarily ignored for the current review. Therefore unavailable image assets may be `BLOCKED_MEDIA`; content/buttons/actions may not.

## Source precedence

For the homepage migration:

1. visible Figma target content and interaction intent;
2. section-level Figma screenshot/context;
3. strict parity contract in this package;
4. existing business behavior that must be reused;
5. existing CMS data only for values not specified by the Figma target;
6. legacy visual/content defaults last.

Legacy CMS content must never override a value visibly specified in Figma.

## Global Header contract

Target visible labels/order:

1. Home
2. About Us
3. Services
4. Technology
5. Pricing
6. Blog
7. Contact

Header CTA:

- label: `BOOK APPOINTMENT`
- action: existing booking modal/booking flow

Rules:

- Resolve the actual route for each label from the repository.
- Do not rename `Blog` to `News` merely because the old CMS currently says News.
- If a required target route does not exist, classify it as `BLOCKED_FUNCTIONAL` and report it. Do not silently replace the item with another page.
- Navigation remains CMS-driven; migrate the CMS navigation content to the target labels/order rather than hard-coding the header.

## Section contract pattern

For every section create a Markdown or JSON parity table with:

| Figma element | Exact content | Required | Data source | Action | Implementation file | Status |
|---|---|---:|---|---|---|---|

Do not start implementation until the table is complete.

## Action semantics

Buttons/links must be modeled as actions, not only strings.

Recommended reusable action representation:

```ts
type UiActionType =
  | 'booking-modal'
  | 'video-dialog'
  | 'internal-route'
  | 'external-url'
  | 'anchor'

interface UiAction {
  label: string
  type: UiActionType
  value?: string
}
```

CMS may use an equivalent component/enum. Existing business action components should be reused.

## No silent fallback policy for migration-critical content

Forbidden in Figma-migrated sections:

```ts
data.eyebrow || 'Some generic marketing text'
data.ctaLabel || 'Learn more'
```

for elements that are visibly required in the Figma target.

During migration, missing required values must:

1. fail the parity checker in development/CI, or
2. be explicitly listed as a blocker.

Fallbacks are allowed only for genuinely optional content not present in the target design.
