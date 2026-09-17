# Task: Implement Enterprise-Grade EN/VI Admin Field Label Localization in Strapi CMS

## Objective

Audit the existing Strapi CMS codebase and implement a complete, maintainable, enterprise-grade localization solution for **Strapi Admin UI schema labels**, primarily for the Content Manager.

The goal is to allow administrators to switch the Strapi Admin interface language between:

* English (`en`)
* Vietnamese (`vi`)

and have schema-related labels displayed in the selected Admin interface language.

Example:

```text
Schema/API field name:
title

English Admin UI:
Title

Vietnamese Admin UI:
Tiêu đề
```

Another example:

```text
Schema/API field name:
editorial_lead

English Admin UI:
Editorial Lead

Vietnamese Admin UI:
Nội dung giới thiệu
```

This task is strictly about **Admin UI localization**.

It is NOT content localization.

---

# Critical Requirement

Do NOT confuse these three different concepts:

```text
1. Admin Interface Language
   English / Vietnamese UI used by CMS administrators

2. Schema/Admin Display Labels
   Title → Tiêu đề
   Description → Mô tả
   Doctor Name → Tên bác sĩ

3. Content Localization
   English article content vs Vietnamese article content
```

We need:

```text
1 + 2
```

We do NOT need:

```text
3
```

Changing the Admin interface language must never modify, translate, duplicate, migrate, or localize stored content values.

---

# Non-Goals

Do NOT:

* Enable Strapi Content i18n merely for this requirement.
* Add locales to content entries.
* Duplicate EN/VI entries.
* Change existing content localization configuration unless independently required by the current system.
* Translate database content automatically.
* Translate API responses.
* Rename schema attribute keys.
* Change database column names.
* Change REST API field names.
* Change GraphQL field names.
* Modify existing stored content.
* Install an AI translation plugin.
* Install a content translation plugin.
* Patch Strapi source code.
* Patch `node_modules`.
* Fork Strapi.
* Build a large custom plugin when native Admin localization is sufficient.
* Create fragile DOM manipulation or CSS-based label replacement.
* Hard-code translations directly inside Content Manager React DOM components unless native translation APIs cannot support a specific case.

Existing schema/API identifiers must remain unchanged.

Example:

```ts
title
editorial_lead
description
doctorName
beforeImage
afterImage
```

Only their **display labels inside Strapi Admin** should be localized.

---

# Phase 1 — Audit the Current Strapi Installation

Before changing code, inspect the project.

Determine:

```text
- Exact Strapi version
- Node.js version requirements
- TypeScript or JavaScript
- Package manager
- Current admin configuration
- Existing Admin locales
- Existing Admin translations
- Existing i18n plugin configuration
- Existing custom Admin extensions
- Existing plugins affecting Content Manager
- Existing Content Manager customizations
- Number of content types
- Number of components
- Dynamic zones
- Enumeration fields
- Relation fields
- Media fields
- Custom fields
```

Inspect at minimum:

```text
package.json

src/admin/app.ts
src/admin/app.tsx
src/admin/app.js
src/admin/app.jsx

src/admin/extensions/**
src/extensions/**
src/plugins/**

src/api/**/content-types/**/schema.json
src/components/**/*.json

config/plugins.*
config/admin.*
```

Use whichever files actually exist.

Do not assume a file or folder exists.

---

# Phase 2 — Verify Native Strapi Capabilities for the Installed Version

This implementation must be **version-aware**.

Use the installed Strapi version as the source of truth.

Check the official Strapi Admin localization mechanism supported by that version, especially:

```ts
config.locales
config.translations
```

Strapi 5 officially supports extending Admin translations from the project's Admin configuration.

Conceptually:

```ts
export default {
  config: {
    locales: ['vi'],

    translations: {
      vi: {
        // translation overrides
      },
    },
  },

  bootstrap() {},
};
```

English must remain the default/fallback Admin locale.

Do not attempt to remove English.

Also check whether the installed Strapi version supports project translation files under a structure similar to:

```text
src/admin/extensions/translations/
```

Prefer the officially supported mechanism for the installed version.

Do not blindly copy implementation details from an older Strapi release.

---

# Phase 3 — Understand How Field Labels Are Actually Rendered

Before creating translations, inspect how the installed Strapi version generates Content Manager labels.

We need translation coverage for schema display labels in places such as:

```text
Content Manager Edit View
Content Manager Create View
Content Manager List View
Content Manager filters
Component fields
Repeatable components
Dynamic Zones
Relations
Media fields
Enumeration fields
Boolean fields
UID fields
Date/time fields
JSON fields
Rich text / Blocks fields
Custom fields where applicable
```

Do not assume that every screen uses the same translation key.

Determine whether a label is resolved using:

```text
raw schema display name

global translation key

plugin-prefixed translation key

content-manager generated translation key

content-type-specific translation key

field-specific translation key
```

Inspect the installed Strapi source/API behavior where necessary.

Do not introduce a custom workaround until native behavior has been verified.

---

# Phase 4 — Audit All Schemas

Scan every project content type and component.

Produce an internal inventory similar to:

```ts
{
  uid: 'api::article.article',
  displayName: 'Article',
  fields: [
    {
      key: 'title',
      currentLabel: 'Title',
      proposedVi: 'Tiêu đề'
    },
    {
      key: 'description',
      currentLabel: 'Description',
      proposedVi: 'Mô tả'
    }
  ]
}
```

Include:

```text
Collection Types
Single Types
Components
Nested Components
Repeatable Components
Dynamic Zone Components
```

Do not mutate schemas during this audit.

---

# Phase 5 — Translation Strategy

Use the following priority:

## Priority 1 — Native Strapi Translation

Use native Strapi Admin localization wherever possible.

This is the preferred solution.

```text
Strapi native translation
        ↓
Content Manager
        ↓
localized field label
```

Avoid replacing existing Strapi UI components.

---

## Priority 2 — Project-Level Translation Dictionary

Create a centralized and maintainable translation layer.

Avoid putting hundreds of unrelated translation entries directly into a huge `app.ts` file if the codebase has many schemas.

Preferred logical organization:

```text
src/admin/
├── app.ts
│
└── extensions/
    └── translations/
        └── vi.json
```

or another officially supported structure appropriate for the installed Strapi version.

If helper modules are necessary, a structure such as the following is acceptable:

```text
src/admin/
├── app.ts
│
├── i18n/
│   ├── index.ts
│   ├── vi.ts
│   └── types.ts
│
└── extensions/
    └── translations/
        └── vi.json
```

Keep the architecture simple.

Do not over-engineer.

---

# Phase 6 — Translation Scope

Translate schema-related editorial labels, including where applicable:

```text
Title
Description
Name
Slug
Status
Image
Images
Thumbnail
Cover Image
Content
Summary
Subtitle
Heading
Eyebrow
CTA
Button Label
Button URL
SEO Title
SEO Description
Alt Text
Caption
Doctor
Procedure
Category
Before Image
After Image
Published At
Created At
Updated At
```

However, translations must be based on semantic context.

For example:

```text
Title
→ Tiêu đề
```

but:

```text
Doctor Name
→ Tên bác sĩ
```

and not simply:

```text
Name
→ Tên
```

everywhere when the field has a more specific business meaning.

Prefer context-specific translations over globally overriding ambiguous generic words.

---

# Phase 7 — Avoid Translation Collisions

This is important.

A naive global translation such as:

```ts
Name: 'Tên'
Title: 'Tiêu đề'
```

may be acceptable for generic UI strings, but may not be sufficient for business-specific schema fields.

Where supported by Strapi, prefer translations scoped by:

```text
content type
component
field
```

instead of relying exclusively on a global English string.

Conceptually:

```text
Article.title
Doctor.title
Procedure.title
```

may require different Vietnamese labels depending on the editorial meaning.

Use exact translation key patterns supported by the installed Strapi version.

Do NOT invent unsupported translation key formats.

Discover and verify them first.

---

# Phase 8 — Content Type and Component Display Names

Audit whether these can also be localized safely through native Admin translations:

```text
Article
Doctor
Procedure
About Page
Home Page
Before & After
SEO
Hero
CTA
Gallery
Testimonial
```

If native Strapi translation supports these labels reliably, include them.

Example:

```text
About Page
→ Trang giới thiệu

Doctor
→ Bác sĩ

Before & After
→ Trước & Sau
```

But do NOT rename:

```text
singularName
pluralName
collectionName
UID
schema keys
API IDs
component UIDs
```

Only change Admin UI display text.

---

# Phase 9 — Enumeration Fields

Audit enumeration fields separately.

Modern Strapi versions may have different levels of support for translating enumeration option labels.

Determine behavior for the project's installed version before implementing anything.

For example:

```text
Schema value:
published

English UI:
Published

Vietnamese UI:
Đã xuất bản
```

The underlying stored value must remain:

```text
published
```

Never convert stored enum values into Vietnamese.

If the installed Strapi version natively supports enum label translations, use it.

If it does not, document the limitation before creating any extension.

Do not introduce a custom enum component unless there is a strong technical reason.

---

# Phase 10 — Components and Dynamic Zones

Explicitly test:

```text
regular component
repeatable component
nested component
dynamic zone
component selector
component heading
component field labels
```

Example:

```text
Hero
  eyebrow
  title
  description
  image
  cta
```

Vietnamese Admin UI should display meaningful labels such as:

```text
Hero

Nhãn đầu trang
Tiêu đề
Mô tả
Hình ảnh
Nút hành động
```

while preserving the original schema keys.

If component names or Dynamic Zone UI labels do not pass through Strapi's localization layer in the installed version:

1. Confirm the limitation.
2. Search for an official Admin extension API.
3. Implement the smallest isolated extension possible.
4. Keep it independent from schema/data logic.
5. Do not patch Strapi internals.

---

# Phase 11 — Relation and Media Fields

Verify field label localization for:

```text
one-to-one relations
one-to-many relations
many-to-one relations
many-to-many relations
media
multiple media
```

Do not change relation targets or schema definitions.

Only Admin labels should change.

---

# Phase 12 — Existing Content i18n Must Remain Independent

Some content types may already intentionally use Strapi Content Internationalization.

Do not remove or break legitimate existing content localization.

The architecture must keep these concepts independent:

```text
Admin locale
≠
Content locale
```

Example:

An administrator can use:

```text
Admin interface: Vietnamese
```

while editing:

```text
Content locale: English
```

This must work correctly.

Likewise:

```text
Admin interface: English
```

can edit:

```text
Content locale: Vietnamese
```

Admin interface language must never implicitly change content locale.

---

# Phase 13 — Vietnamese Translation Quality

Use professional Vietnamese suitable for a production CMS.

Avoid awkward literal translations.

Preferred examples:

```text
Title
→ Tiêu đề

Description
→ Mô tả

Content
→ Nội dung

Image
→ Hình ảnh

Cover Image
→ Ảnh bìa

Thumbnail
→ Ảnh thu nhỏ

Doctor
→ Bác sĩ

Doctor Name
→ Tên bác sĩ

Procedure
→ Dịch vụ / Phương pháp
```

For domain-specific fields, inspect the schema and surrounding content before deciding terminology.

This CMS belongs to a premium international aesthetic/plastic surgery website, so Vietnamese terminology should be natural for:

```text
medical aesthetics
plastic surgery
cosmetic procedures
doctors
before/after cases
treatment pages
hospital information
editorial content
SEO
```

Do not mechanically machine-translate identifiers.

---

# Phase 14 — Preserve Existing English UX

English Admin UI must continue working exactly as before unless an English label is clearly incorrect.

Prefer:

```text
English = existing Strapi/schema behavior
Vietnamese = localization override
```

Do not create unnecessary English overrides.

The expected model is:

```text
                    ┌── English Admin
Schema/API ---------┤
unchanged           │     Title
                    │
                    └── Vietnamese Admin
                          Tiêu đề
```

---

# Phase 15 — No Data Migration

This task should require:

```text
0 database migrations
0 content migrations
0 duplicated entries
0 API contract changes
```

If the proposed implementation requires modifying existing data, stop and reassess the design.

Admin label localization should be a frontend/Admin configuration concern.

---

# Phase 16 — Implementation Safety

Follow these rules:

```text
DO:
- extend Strapi Admin through supported APIs
- use TypeScript if the existing Admin uses TypeScript
- preserve existing configuration
- merge configuration safely
- keep translation data centralized
- keep changes easy to review
- keep the solution upgrade-friendly

DO NOT:
- overwrite unrelated admin configuration
- remove existing locales
- remove existing translations
- modify content schemas unnecessarily
- modify production content
- introduce database migrations
- modify generated files unnecessarily
- patch dependencies
- suppress TypeScript errors
- use `any` unnecessarily
- create hidden side effects
```

---

# Phase 17 — Existing `src/admin/app.*`

If an Admin configuration already exists, integrate with it.

For example, if the project currently has:

```ts
export default {
  config: {
    locales: ['vi'],
  },
};
```

do not replace the entire configuration.

Extend it safely.

Preserve:

```text
logos
favicon
theme
tutorial settings
notifications
existing translations
existing locales
bootstrap
register
custom plugin configuration
```

---

# Phase 18 — Admin Locale Configuration

Ensure Vietnamese appears as an available Admin interface language.

The final Admin configuration should conceptually support:

```text
English
Vietnamese
```

English is Strapi's default/fallback locale.

Configure Vietnamese through the native Admin locale configuration supported by the installed version.

Example only:

```ts
export default {
  config: {
    locales: ['vi'],
  },
};
```

Do not copy this blindly if the existing application has additional configuration that must be merged.

---

# Phase 19 — Fallback Behavior

Missing Vietnamese translations must fall back safely to English.

The UI must never show:

```text
undefined
null
[object Object]
missing.translation.key
```

because of this implementation.

Do not force complete translation of every internal Strapi string unless required.

Focus first on:

```text
schema labels
content type labels
component labels
editorial Content Manager UX
```

---

# Phase 20 — Custom Admin Extension Policy

A custom Admin extension is allowed only when all of the following are true:

```text
1. Native Strapi translation has been tested.
2. The installed version genuinely does not expose the required label for localization.
3. The limitation materially affects editors.
4. There is an official/stable extension point available.
```

Any extension must be:

```text
small
isolated
typed
documented
upgrade-friendly
independent from content data
```

Do not create one large override of Content Manager.

Do not duplicate Strapi's Content Manager implementation.

---

# Phase 21 — Build and Validate

After implementation, run the project's appropriate checks.

At minimum:

```text
TypeScript check
lint
Strapi Admin build
Strapi startup
```

Use the project's package manager.

Possible commands could include:

```bash
npm run build
npm run develop
```

or:

```bash
pnpm build
pnpm develop
```

or:

```bash
yarn build
yarn develop
```

Use only commands applicable to the repository.

Do not change package managers.

---

# Phase 22 — Functional QA

Test with at least one representative Single Type and one Collection Type.

Example test set:

```text
About Page
Article / Doctor / Procedure
```

Verify the following.

## English interface

Expected:

```text
Title
Description
Editorial Lead
Image
Doctor
```

## Vietnamese interface

Expected:

```text
Tiêu đề
Mô tả
Nội dung giới thiệu
Hình ảnh
Bác sĩ
```

---

# Phase 23 — Advanced QA Matrix

Test the following where they exist:

| Area                 | English | Vietnamese | Data unchanged |
| -------------------- | ------- | ---------- | -------------- |
| Text field           | Yes     | Yes        | Yes            |
| Rich text / Blocks   | Yes     | Yes        | Yes            |
| Number               | Yes     | Yes        | Yes            |
| Boolean              | Yes     | Yes        | Yes            |
| Date                 | Yes     | Yes        | Yes            |
| Enumeration          | Yes     | Yes        | Yes            |
| UID                  | Yes     | Yes        | Yes            |
| Media                | Yes     | Yes        | Yes            |
| Relation             | Yes     | Yes        | Yes            |
| Component            | Yes     | Yes        | Yes            |
| Repeatable component | Yes     | Yes        | Yes            |
| Nested component     | Yes     | Yes        | Yes            |
| Dynamic Zone         | Yes     | Yes        | Yes            |
| List View            | Yes     | Yes        | Yes            |
| Edit View            | Yes     | Yes        | Yes            |
| Create View          | Yes     | Yes        | Yes            |
| Filters              | Yes     | Yes        | Yes            |

If an area cannot be localized using a stable native mechanism, document it rather than applying a fragile hack.

---

# Phase 24 — Regression Testing

Confirm that implementation does NOT change:

```text
REST API output
GraphQL output
schema attribute names
database structure
entry IDs
document IDs
content locales
draft/publish status
relations
media references
existing content
permissions
RBAC configuration
frontend behavior
```

Switching:

```text
English Admin
→ Vietnamese Admin
→ English Admin
```

must affect only Admin presentation.

---

# Phase 25 — Scalability

The project contains many content types, so the solution must scale without turning `src/admin/app.ts` into an unmaintainable file.

Translation entries should be:

```text
centralized
searchable
reviewable
diff-friendly
easy to expand
```

Do not dynamically generate Vietnamese labels at runtime from camelCase/snake_case identifiers.

Bad:

```ts
editorial_lead
→ editorial lead
→ automatically machine translated
```

Good:

```ts
'...editorial_lead': 'Nội dung giới thiệu'
```

Translations should be explicitly curated.

---

# Phase 26 — Avoid Unnecessary Dependencies

Before installing any package, prove that Strapi native functionality cannot satisfy the requirement.

The preferred dependency count for this feature is:

```text
0 new dependencies
```

Do not install packages such as:

```text
react-intl
i18next
translation plugins
AI translators
```

if Strapi already provides the required localization infrastructure.

Use Strapi's own Admin internationalization layer.

---

# Phase 27 — Documentation

Add concise developer documentation explaining:

```text
Admin UI localization architecture
location of translation files
how to add a new Vietnamese field label
how to add another Admin language
difference between Admin locale and Content locale
how fallback works
build requirements after changing translations
known Strapi limitations, if any
```

Avoid a huge document.

A focused README or existing project documentation section is sufficient.

---

# Phase 28 — Important Architecture Boundary

The final architecture should remain conceptually:

```text
                       ┌──────────────────────────┐
                       │       Strapi Schema      │
                       │                          │
                       │ title                    │
                       │ description              │
                       │ editorial_lead           │
                       │ doctor                   │
                       └────────────┬─────────────┘
                                    │
                                    │ unchanged
                                    ▼
                       ┌──────────────────────────┐
                       │   Strapi Content/API     │
                       │                          │
                       │ field keys unchanged     │
                       │ values unchanged         │
                       └──────────────────────────┘


Schema metadata
      │
      ▼
Strapi Admin i18n layer
      │
      ├──────── English
      │          Title
      │          Description
      │          Editorial Lead
      │          Doctor
      │
      └──────── Vietnamese
                 Tiêu đề
                 Mô tả
                 Nội dung giới thiệu
                 Bác sĩ
```

This boundary is mandatory.

---

# Phase 29 — Implementation Workflow

Execute the task in this order:

```text
1. Inspect repository.
2. Detect exact Strapi version.
3. Inspect existing Admin config.
4. Inspect current localization/i18n configuration.
5. Inventory content types and components.
6. Determine actual translation-key behavior for installed Strapi.
7. Identify native translation coverage.
8. Design centralized VI translation dictionary.
9. Implement Vietnamese Admin locale.
10. Implement field label translations.
11. Implement content type/component label translations where supported.
12. Test enums/components/dynamic zones.
13. Add minimal extension only for confirmed gaps.
14. Build Admin.
15. Run typecheck/lint/tests.
16. Perform regression checks.
17. Document implementation.
18. Report results.
```

Do not start by installing a plugin.

Do not start by enabling Content i18n.

---

# Phase 30 — Final Report

After implementation, provide a concise report containing:

## 1. Current State

```text
Strapi version:
Admin framework:
Admin locales before:
Content i18n state:
Content types scanned:
Components scanned:
```

## 2. Changes Made

List files created or modified.

Example:

```text
src/admin/app.ts
src/admin/extensions/translations/vi.json
docs/admin-localization.md
```

## 3. Translation Coverage

Report:

```text
Content types covered:
Components covered:
Fields covered:
Enums covered:
Dynamic Zones covered:
```

## 4. Native vs Custom

Clearly state which parts use:

```text
Native Strapi Admin translation
```

and which, if any, require:

```text
Custom Admin extension
```

Explain why custom code was necessary.

## 5. Verification

Report results for:

```text
build
typecheck
lint
Admin startup
English UI
Vietnamese UI
API regression
data regression
```

## 6. Known Limitations

Report only confirmed limitations for the installed Strapi version.

Do not speculate.

---

# Acceptance Criteria

The task is complete only when all of the following are true:

* Vietnamese is selectable as a Strapi Admin interface language.
* English remains available and remains the fallback.
* Field labels in Content Manager are translated to Vietnamese.
* Translation works for representative Single Types and Collection Types.
* Components are translated where supported.
* Dynamic Zone labels are handled or their confirmed limitation is documented.
* Enumeration labels are handled according to the capabilities of the installed Strapi version.
* Existing content values remain untouched.
* No content entries are duplicated.
* Content i18n is not enabled merely for Admin field translation.
* API field names remain unchanged.
* Database schema remains unchanged.
* Existing frontend integrations remain unchanged.
* Existing Admin configuration remains intact.
* No Strapi source code or `node_modules` is patched.
* No unnecessary translation plugin is installed.
* Admin build succeeds.
* English ↔ Vietnamese switching affects presentation only.
* The solution is maintainable for all current and future project schemas.

---

# Decision Principle

When choosing between approaches, use this priority:

```text
Official Strapi native capability
        ↓
Project-level Admin translation configuration
        ↓
Project translation dictionary
        ↓
Small supported Admin extension
        ↓
Avoid implementation if only fragile hacks remain
```

Never use Content Internationalization as a substitute for Admin UI field-label localization.

Proceed with the audit and implementation directly against the existing codebase. Make the smallest safe changes necessary, preserve existing behavior, and prefer native Strapi capabilities over custom code.
