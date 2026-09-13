# Task: Implement DOCX → Better Blocks Importer for Strapi CMS

You are working inside an existing production codebase that uses:

* Strapi CMS
* Better Blocks custom field
* Next.js frontend
* `@qkix/better-blocks-react-renderer`

Your task is to design and implement a robust DOCX import feature for Blog content.

The implementation must integrate with the existing Better Blocks architecture and must NOT introduce a new Markdown-based content model.

---

# 1. Existing Architecture

The current Blog content field in Strapi is:

```json
{
  "contentBetterBlocks": {
    "type": "customField",
    "customField": "plugin::better-blocks.better-blocks"
  }
}
```

Blog content is stored as structured Better Blocks JSON.

Example:

```json
[
  {
    "type": "heading",
    "level": 2,
    "children": [
      {
        "type": "text",
        "text": "Dental Crown Procedure",
        "bold": true
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "Dental crowns restore damaged teeth."
      }
    ]
  }
]
```

Current content flow:

```text
Strapi Better Blocks Editor
        ↓
contentBetterBlocks JSON
        ↓
Strapi API
        ↓
Next.js
        ↓
@qkix/better-blocks-react-renderer
        ↓
Responsive HTML
```

Frontend rendering currently happens around:

```text
dental-frontend/src/components/blog/BlogContent.tsx
```

The Blog model currently contains fields similar to:

```text
title
slug
category
coverImage
excerpt
isFeatured
contentBetterBlocks
```

The project no longer uses:

```text
Markdown editor
content
contentBlocks
Native Strapi Blocks
custom Native Rich Text table editor
```

Do NOT reintroduce those systems.

---

# 2. Main Objective

Add a feature in Strapi Admin that allows an editor to import a `.docx` file and automatically convert its content into valid Better Blocks structured JSON.

The final imported data must become the value of:

```text
contentBetterBlocks
```

The result must behave exactly like content manually authored inside the Better Blocks editor.

The Next.js frontend should not need to know whether the content came from DOCX import or manual editing.

---

# 3. Critical Architecture Decision

Do NOT make Markdown the main intermediate representation.

Do NOT implement:

```text
DOCX
→ Markdown
→ stored Markdown
```

Do NOT create any new Markdown field.

Preferred architecture:

```text
DOCX
   ↓
Mammoth
   ↓
Semantic HTML / normalized document AST
   ↓
Better Blocks Transformer
   ↓
Better Blocks JSON
   ↓
Better Blocks validation
   ↓
contentBetterBlocks
```

Markdown may only be considered as a fallback utility for unsupported edge cases, but it must NOT be the core architecture.

The transformer itself is the important reusable layer.

---

# 4. Use Better Blocks Core as the Source of Truth

Investigate the installed Better Blocks package versions in the repository.

Prefer using:

```text
@qkix/better-blocks-core
```

for:

* Better Blocks document types
* node types
* validation
* migrations if relevant
* document compatibility

If available in the installed version, use:

```ts
validateDocument(...)
```

or the equivalent public API from Better Blocks Core.

Do NOT deep-import private Better Blocks files such as:

```ts
@qkix/strapi-plugin-better-blocks/dist/...
```

Do NOT depend on internal implementation paths like:

```text
parseMarkdownToSlate
```

unless absolutely unavoidable.

Public APIs must be preferred.

Before coding, inspect the actual installed package versions and package exports.

Adapt implementation to the exact repository versions instead of assuming APIs.

---

# 5. Preserve Existing Blog Schema

Do NOT change the core Blog content architecture.

Keep:

```json
{
  "contentBetterBlocks": {
    "type": "customField",
    "customField": "plugin::better-blocks.better-blocks"
  }
}
```

Do NOT add:

```text
contentMarkdown
contentHtml
legacyContent
contentBlocks
docxContent
rawDocxHtml
```

unless there is a very strong technical requirement, and if so, explain before implementing it.

The desired system must continue treating:

```text
contentBetterBlocks
```

as the single source of truth.

---

# 6. DOCX Parsing

Use a reliable DOCX parser.

Preferred library:

```text
mammoth
```

Mammoth should be used primarily to transform Word document semantics into structured HTML.

Example:

```text
DOCX Heading 2
↓
<h2>
```

```text
Word bold
↓
<strong>
```

```text
Word bullet list
↓
<ul><li>...</li></ul>
```

Do not treat Mammoth HTML as the final stored content.

It is only an intermediate semantic representation.

---

# 7. Better Blocks Transformer

Implement a dedicated transformer that converts semantic HTML or an equivalent normalized AST into Better Blocks JSON.

Prefer an architecture such as:

```text
docx
↓
Mammoth
↓
HTML
↓
parse HTML into AST
↓
normalize AST
↓
transform AST into Better Blocks nodes
```

Do NOT heavily rely on string-based HTML replacements.

Use a proper HTML parser or AST approach if possible.

---

# 8. Recommended Transformer Module Structure

Create reusable transformation services.

Possible structure:

```text
src/plugins/docx-importer/
├── admin/
│   └── src/
│       ├── index.ts
│       ├── components/
│       │   ├── ImportDocxAction.tsx
│       │   ├── ImportDocxModal.tsx
│       │   └── ImportPreview.tsx
│       └── api/
│           └── importer.ts
│
└── server/
    └── src/
        ├── routes/
        │   └── admin.ts
        ├── controllers/
        │   └── importer.ts
        └── services/
            └── import/
                ├── parse-docx.ts
                ├── normalize-html.ts
                ├── transform.ts
                ├── transform-block.ts
                ├── transform-inline.ts
                ├── transform-list.ts
                ├── transform-table.ts
                ├── transform-image.ts
                ├── upload-media.ts
                ├── validate.ts
                └── types.ts
```

You may adapt this structure to the repository conventions.

Do not force this exact folder structure if the existing repository already has a preferred plugin architecture.

---

# 9. Core Mapping Requirements

At minimum support the following mappings.

## Paragraphs

```html
<p>Text</p>
```

should become approximately:

```json
{
  "type": "paragraph",
  "children": [
    {
      "type": "text",
      "text": "Text"
    }
  ]
}
```

---

## Headings

```html
<h2>Dental Crown Procedure</h2>
```

should become:

```json
{
  "type": "heading",
  "level": 2,
  "children": [
    {
      "type": "text",
      "text": "Dental Crown Procedure"
    }
  ]
}
```

Support heading levels supported by Better Blocks.

Do not invent unsupported heading levels.

---

# 10. Inline Formatting

Preserve inline marks whenever supported by Better Blocks.

Required:

```text
bold
italic
underline
strikethrough
```

Example:

```html
<strong>Dental Crown</strong>
```

should become:

```json
{
  "type": "text",
  "text": "Dental Crown",
  "bold": true
}
```

Support combinations:

```text
bold + italic
bold + underline
italic + color
etc.
```

Do not create redundant nested text nodes where Better Blocks expects flat marked text children.

---

# 11. Additional Inline Formatting

Investigate the exact Better Blocks schema and renderer capabilities in the repository.

Where supported, preserve:

```text
color
backgroundColor
fontSize
fontFamily
superscript
subscript
```

Do not blindly add properties.

Only output properties supported by the installed Better Blocks document schema.

---

# 12. Links

Convert links into the correct Better Blocks link node format.

Example source:

```html
<a href="https://example.com">Read more</a>
```

The output must match the Better Blocks link schema used by the installed package.

Inspect existing stored Blog data or Better Blocks type definitions to determine the exact structure.

Do not guess.

Support:

```text
href
link text
inline formatting inside links
```

If Better Blocks supports target, rel, or similar metadata and it exists in the source, preserve it where appropriate.

---

# 13. Lists

Support:

```text
unordered lists
ordered lists
nested lists
```

Input examples:

```html
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>
```

```html
<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>
```

Map them to the exact Better Blocks list schema.

Do not guess list node structure.

Inspect:

* `@qkix/better-blocks-core`
* existing `contentBetterBlocks` examples
* Better Blocks renderer
* plugin source/types if necessary

Nested lists should retain hierarchy.

---

# 14. Blockquotes

Support DOCX content that Mammoth converts to semantic blockquotes or mapped Word styles.

Transform:

```html
<blockquote>...</blockquote>
```

into the correct Better Blocks quote block.

---

# 15. Code Blocks

If code blocks are supported by Better Blocks, convert:

```html
<pre><code>...</code></pre>
```

into the correct Better Blocks code node.

Preserve language metadata if Better Blocks supports it and it can be reliably identified.

---

# 16. Tables

Tables are a required feature.

Support at minimum:

```text
table
rows
header cells
normal cells
text formatting inside cells
links inside cells
paragraphs inside cells if supported
```

Example:

```html
<table>
  <thead>
    <tr>
      <th>Material</th>
      <th>Durability</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Zirconia</td>
      <td>High</td>
    </tr>
  </tbody>
</table>
```

Transform it into the exact Better Blocks table structure used by the installed plugin.

Inspect real Better Blocks table JSON before implementing.

Do NOT reuse any deprecated custom/native table system that the project has already removed.

The final table must render through:

```text
@qkix/better-blocks-react-renderer
```

---

# 17. Table Edge Cases

Investigate support for:

```text
colspan
rowspan
merged Word cells
empty cells
multiple paragraphs inside a cell
nested inline formatting
```

If Better Blocks cannot represent a DOCX feature, do not generate invalid JSON.

Instead:

1. preserve as much semantic content as possible;
2. emit an import warning;
3. continue importing the rest of the document.

Example warning:

```text
Merged table cells are not fully supported.
The content was imported using individual cells.
```

---

# 18. Images

DOCX images must be imported properly.

Do NOT store:

```text
data:image/...;base64
```

inside Better Blocks content.

Preferred flow:

```text
DOCX image
↓
Mammoth image extraction
↓
binary buffer
↓
Strapi Media Library upload
↓
Strapi media object
↓
Better Blocks image node
```

Use the existing Strapi upload/media system.

The image node must match the exact Better Blocks image schema used by the current Better Blocks package.

Inspect existing image blocks or renderer types.

Do NOT assume that only `url` is required.

If Better Blocks expects Strapi media metadata, provide the required media object shape.

Preserve when possible:

```text
filename
mime type
width
height
alternative text
caption
```

---

# 19. Image Alt Text

If Word provides meaningful alt text, preserve it.

If no alt text exists:

do NOT invent descriptive medical/dental text.

Use:

```text
null
```

or the appropriate empty representation accepted by Better Blocks / Strapi.

The editor should be able to fill alt text manually afterward.

---

# 20. Avoid Duplicate Image Uploads Within One Import

If the same embedded DOCX image is referenced multiple times in one document, avoid uploading the same binary repeatedly where feasible.

A simple import-level cache based on:

```text
hash
relationship id
source identifier
```

is acceptable.

Do not build an unnecessarily complex global deduplication system unless the repository already has one.

---

# 21. Word Style Mapping

Support custom Mammoth style mapping when helpful.

Example:

```ts
const styleMap = [
  "p[style-name='Blog H2'] => h2:fresh",
  "p[style-name='Blog H3'] => h3:fresh",
  "p[style-name='Warning'] => div.warning:fresh"
];
```

Do not hardcode these exact Word style names unless they actually exist in sample documents.

Design the code so custom mappings can be extended later.

Possible configuration:

```ts
const DOCX_STYLE_MAP = [
  ...
];
```

or:

```text
config/plugins.ts
```

depending on repository architecture.

---

# 22. Unsupported Word Formatting

DOCX contains many features that Better Blocks may not represent.

Examples:

```text
floating text boxes
WordArt
complex shape layouts
page borders
columns
floating images
headers
footers
watermarks
advanced typography
section layout
arbitrary absolute positioning
```

Do NOT attempt to reproduce Microsoft Word layout pixel-perfectly.

The goal is:

```text
semantic content preservation
+
Better Blocks compatibility
```

not:

```text
pixel-perfect Word reproduction
```

Unsupported formatting should generate warnings instead of invalid Better Blocks JSON.

---

# 23. Better Blocks Validation Gate

Before imported content reaches the editor, validate it.

Preferred:

```ts
const result = validateDocument(blocks);
```

or the correct equivalent exposed by the installed Better Blocks version.

If validation fails:

```text
DO NOT apply invalid data to contentBetterBlocks.
```

Return useful errors.

Example:

```json
{
  "success": false,
  "errors": [
    {
      "path": "[3].children[1]",
      "message": "Invalid Better Blocks node"
    }
  ]
}
```

The actual response shape may follow repository conventions.

---

# 24. Import Warnings vs Errors

Differentiate between:

## Fatal errors

Examples:

```text
corrupted DOCX
unsupported file
DOCX parsing failure
Better Blocks validation failure
Media upload failure that prevents valid content construction
```

Fatal errors should prevent applying the result.

## Non-fatal warnings

Examples:

```text
unsupported Word style
unsupported merged table behavior
unknown custom formatting
floating image converted to inline image
unsupported font ignored
```

Warnings should allow import to continue.

---

# 25. Import UI

Add an import action to Strapi Admin.

Preferred UX:

```text
Import DOCX
```

The action can be placed:

* near the Better Blocks field;
* in a Content Manager document action;
* in a document header action;
* or another clean extension point supported by the installed Strapi version.

Use official Strapi extension APIs whenever possible.

Do NOT:

```text
query the DOM manually
inject buttons with document.querySelector
patch generated node_modules
```

---

# 26. Inspect Strapi Version Before Choosing UI API

Before implementing the UI:

1. inspect the exact Strapi version;
2. inspect available Content Manager extension APIs;
3. check how the current Better Blocks custom field integrates with Strapi forms.

Possible APIs may include equivalents of:

```text
addDocumentAction
addDocumentHeaderAction
addEditViewSidePanel
```

Use the actual API available in the installed Strapi version.

Do not rely on documentation from a different Strapi version.

---

# 27. Do Not Directly Update the Database on File Selection

Preferred workflow:

```text
User clicks Import DOCX
↓
User selects file
↓
DOCX uploaded to importer endpoint
↓
Transform
↓
Validate
↓
Show preview / summary
↓
User confirms Apply
↓
contentBetterBlocks field becomes updated in current Strapi form
↓
form becomes dirty
↓
User presses normal Save / Publish
```

Do NOT automatically persist the Blog immediately after import.

The normal Strapi save workflow should remain authoritative.

This prevents accidental content loss.

---

# 28. Import Mode

Support:

```text
Replace current content
Append to current content
```

Suggested UX:

```text
Import mode

● Replace current content
○ Append to current content
```

Behavior:

## Replace

```ts
contentBetterBlocks = importedBlocks;
```

## Append

```ts
contentBetterBlocks = [
  ...existingBlocks,
  ...importedBlocks
];
```

Ensure the final combined result is also validated.

---

# 29. Preview / Import Summary

Before Apply, show a useful summary such as:

```text
DOCX successfully parsed.

Imported:
- 6 headings
- 31 paragraphs
- 2 lists
- 3 tables
- 4 images

Warnings:
- 2 unsupported Word styles ignored
- 1 merged table cell normalized
```

A full rich visual preview is optional if expensive.

At minimum provide:

```text
block count
block type counts
warnings
errors
file name
```

---

# 30. Security

DOCX must be treated as untrusted input.

Implement reasonable protection for:

```text
file extension
MIME type
maximum file size
unexpected archive content
malformed DOCX
dangerous HTML
external URLs
embedded images
```

Do not inject Mammoth output directly into the DOM using unsafe HTML.

Parse and transform structured content instead.

If HTML must be rendered for preview, sanitize it.

---

# 31. File Limits

Define sensible configurable limits.

For example:

```text
maximum DOCX file size
maximum embedded image size
maximum number of blocks
maximum number of images
maximum table dimensions if needed
```

Do not hardcode arbitrary limits without documenting them.

Prefer configuration constants.

---

# 32. Transaction / Cleanup Strategy for Images

Consider what happens if images are uploaded but final document transformation fails.

At minimum:

* document this behavior;
* avoid leaving excessive orphan media where feasible.

If practical, track uploaded media during a single import and clean them up after fatal transformation failure.

However, do not introduce risky cleanup logic that could delete pre-existing media.

Only clean media that the current import operation definitely created.

---

# 33. Reusable HTML → Better Blocks Layer

Architect the importer so the Better Blocks transformer is not tightly coupled to DOCX.

Preferred conceptual separation:

```text
DOCX
↓
Mammoth
↓
Semantic HTML / normalized AST
            ↓
    Better Blocks Transformer
            ↓
      BlocksContent
```

This enables future reuse for:

```text
Google Docs
WordPress
legacy HTML
HTML paste
other rich text imports
```

A useful API could look like:

```ts
export function htmlToBetterBlocks(
  html: string,
  options?: TransformOptions
): TransformResult;
```

or better, if using an AST:

```ts
export function documentAstToBetterBlocks(
  ast: DocumentNode,
  options?: TransformOptions
): TransformResult;
```

The AST-based version is preferred if reasonably simple.

---

# 34. Type Safety

Use TypeScript.

Do not define loose types such as:

```ts
any[]
```

for Better Blocks content if official types are available.

Prefer:

```ts
BlocksContent
Block
TextNode
```

or the exact exported names from the installed Better Blocks packages.

Where external library types are incomplete, isolate casting at integration boundaries.

Do not spread `any` across the transformer.

---

# 35. Existing Better Blocks Data as Reference

Before implementing each major node type, inspect actual repository data or existing fixtures for:

```text
heading
paragraph
link
list
image
table
quote
code
```

The current stored JSON format is the source of truth.

Do not guess node formats.

Especially inspect:

```text
lists
tables
links
images
```

because their structures are usually more complex than simple paragraph nodes.

---

# 36. Existing Renderer as Reference

Inspect:

```text
dental-frontend/src/components/blog/BlogContent.tsx
```

and the installed:

```text
@qkix/better-blocks-react-renderer
```

Use this to confirm:

* supported blocks;
* supported inline modifiers;
* media structure;
* table structure;
* link structure;
* custom renderers;
* custom blocks.

Do not change the renderer unless necessary for a newly supported Better Blocks feature.

The default expectation is:

```text
frontend changes = none
```

---

# 37. Custom Better Blocks

Search the repository for existing custom Better Blocks registrations.

Examples:

```text
registerBlock
custom blocks
Better Blocks extension APIs
```

If custom blocks already exist, ensure the importer does not break them.

Do not generate custom nodes unless there is a deterministic DOCX mapping.

For example:

```text
Word style "Warning Box"
→ custom Better Blocks warning block
```

should only be implemented if the project actually has such a custom block.

---

# 38. Do Not Fork Better Blocks Unless Necessary

Preferred implementation:

```text
separate Strapi plugin / extension
+
public Better Blocks APIs
```

Avoid modifying:

```text
@qkix/strapi-plugin-better-blocks
```

directly.

Do not maintain a Better Blocks fork unless a required editor extension is impossible through public APIs.

If a fork appears necessary:

1. prove why;
2. document the limitation;
3. minimize the patch;
4. keep the importer logic outside the fork.

---

# 39. Do Not Deep-Import Better Blocks Internals

Avoid code like:

```ts
import something from
  '@qkix/strapi-plugin-better-blocks/dist/admin/src/...';
```

This is brittle and likely to break on upgrade.

Only use documented/public package exports.

---

# 40. Markdown Parser Position

Better Blocks may internally support Markdown parsing or Markdown paste.

Do not make an internal Markdown parser a production dependency of the DOCX importer.

It may be useful as:

```text
fallback
test reference
compatibility reference
```

but not the main architecture.

Reason:

Markdown may lose:

```text
text colors
background highlights
font sizes
font families
alignment
complex tables
Better Blocks-specific properties
```

---

# 41. Example Desired Transformation

DOCX conceptual input:

```text
Dental Crown Procedure        [Heading 2, bold]

Dental crowns restore damaged teeth.

Benefits:

• Strong
• Natural-looking
• Long-lasting
```

Expected Better Blocks result approximately:

```json
[
  {
    "type": "heading",
    "level": 2,
    "children": [
      {
        "type": "text",
        "text": "Dental Crown Procedure",
        "bold": true
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "Dental crowns restore damaged teeth."
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "Benefits:"
      }
    ]
  },
  {
    "type": "list",
    "format": "unordered",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "type": "text",
            "text": "Strong"
          }
        ]
      }
    ]
  }
]
```

Important:

This is only illustrative.

Use the actual Better Blocks list schema from the installed package rather than copying this example blindly.

---

# 42. Tests Are Required

Implement automated tests for the transformation layer.

At minimum test:

```text
plain paragraph
Heading 1
Heading 2
bold
italic
underline
strikethrough
mixed inline marks
links
unordered list
ordered list
nested list
blockquote
table
table header
image
multiple images
empty paragraphs
special characters
Vietnamese text
English text
Unicode
```

Also test invalid or unusual input:

```text
empty DOCX
corrupted DOCX
unsupported file
very large document
unsupported Word styles
merged table cells
missing image metadata
```

---

# 43. Fixture-Based DOCX Tests

Prefer real `.docx` fixtures for key integration cases.

Create fixture documents such as:

```text
fixtures/
├── simple.docx
├── headings.docx
├── inline-formatting.docx
├── lists.docx
├── nested-lists.docx
├── tables.docx
├── images.docx
├── mixed-content.docx
└── edge-cases.docx
```

Keep fixtures small.

If binary fixtures are not appropriate in the repository, document an alternative reproducible test strategy.

---

# 44. Snapshot Testing

Snapshot tests are acceptable for Better Blocks JSON if they remain readable.

For example:

```text
mixed-content.docx
→ mixed-content.blocks.json
```

But do not rely only on snapshots.

Also assert important semantic properties directly.

Example:

```ts
expect(blocks[0].type).toBe('heading');
expect(blocks[0].level).toBe(2);
```

---

# 45. Validation Tests

All successfully transformed fixtures should pass:

```text
Better Blocks document validation
```

Make this part of the test suite.

A transformation that looks visually correct but fails Better Blocks validation is not acceptable.

---

# 46. Frontend Regression

Confirm that imported Better Blocks JSON renders correctly through:

```text
@qkix/better-blocks-react-renderer
```

and specifically through:

```text
dental-frontend/src/components/blog/BlogContent.tsx
```

No separate DOCX-specific renderer should exist.

---

# 47. Error Messages

Provide editor-friendly error messages.

Bad:

```text
Cannot read property children of undefined
```

Good:

```text
The DOCX file could not be imported because its table structure is invalid.
```

Bad:

```text
500 Internal Server Error
```

Good:

```text
The file appears to be corrupted or is not a valid DOCX document.
```

Log technical details server-side where appropriate.

---

# 48. Logging

Add useful structured logging for:

```text
import start
file size
parser failure
transformation failure
validation failure
media upload failure
import success
warning count
block count
```

Do not log the full document contents.

Do not log sensitive media binary data.

---

# 49. Performance

Avoid expensive repeated traversals.

Preferred:

```text
one parse
one normalized AST traversal
one Better Blocks transformation
```

Avoid:

```text
HTML → Markdown → HTML → Slate → JSON
```

unless absolutely necessary.

For large documents, avoid recursively cloning large objects unnecessarily.

---

# 50. Dependencies

Before installing anything, inspect existing dependencies.

Likely required:

```text
mammoth
```

Potentially:

```text
parse5
htmlparser2
cheerio
unified
rehype
```

depending on existing stack.

Use the smallest stable dependency set possible.

Do not add multiple HTML parsers.

Do not add Turndown unless needed for a clearly justified fallback.

---

# 51. Strapi Plugin Integration

Prefer creating a dedicated local plugin such as:

```text
docx-importer
```

or another repository-consistent name.

The plugin should conceptually expose an admin endpoint like:

```http
POST /docx-importer/transform
```

or an admin-only equivalent.

The endpoint receives a DOCX file and returns something conceptually like:

```json
{
  "data": {
    "blocks": [],
    "summary": {
      "headings": 4,
      "paragraphs": 20,
      "lists": 2,
      "tables": 1,
      "images": 3
    },
    "warnings": []
  }
}
```

Use existing project API conventions and Strapi admin authentication.

Do not expose an unauthenticated public upload endpoint.

---

# 52. Admin Authorization

The importer is a CMS editorial feature.

Restrict it to authenticated Strapi Admin users.

Where possible, integrate with Strapi admin permissions.

Do not make the endpoint publicly available through the Content API.

---

# 53. Applying Imported Data to the Current Form

The final UX should update the current Blog edit form's:

```text
contentBetterBlocks
```

value without immediately saving.

Use official Strapi form APIs or Better Blocks custom field integration if available.

The resulting form should appear dirty/modified so the user can review and manually Save or Publish.

Avoid database updates behind the form state.

---

# 54. If Form Injection Is Difficult

If the installed Strapi version does not safely allow an external document action to modify the current form field:

Preferred fallback order:

1. use a supported Better Blocks custom field extension point;
2. add the import button adjacent to/wrapped around the Better Blocks field;
3. upgrade Strapi if the issue is a known fixed limitation;
4. only consider a very small Better Blocks fork as a last resort.

Do NOT use DOM hacks.

---

# 55. UI States

Handle at least:

```text
idle
file selected
uploading
transforming
uploading images
validating
preview
applying
success
error
```

Prevent duplicate submissions while processing.

Show useful progress state without pretending exact percentage progress if it is unavailable.

---

# 56. Modal Suggested Layout

Conceptually:

```text
Import DOCX

File:
[dental-crown.docx]

Import mode:
● Replace current content
○ Append to current content

Options:
☑ Import images
☑ Preserve supported text formatting
☑ Preserve tables

[Cancel] [Import & Preview]
```

After parsing:

```text
Import Summary

46 blocks
6 headings
31 paragraphs
2 lists
3 tables
4 images

Warnings:
2 unsupported styles ignored

[Cancel] [Apply to Better Blocks]
```

Adapt styling to Strapi Design System.

---

# 57. Preserve Editor Workflow

After Apply:

```text
contentBetterBlocks contains the imported JSON
```

but the document is not yet saved.

The editor can then manually:

```text
review
edit
remove blocks
add blocks
change formatting
save
publish
```

This is important.

The importer must not bypass the Better Blocks editing workflow.

---

# 58. Existing Content Must Be Protected

If:

```text
contentBetterBlocks
```

already contains content and the user chooses Replace, clearly communicate that the current field content will be replaced in the local form state.

Do not silently replace existing content.

Append must preserve existing blocks exactly.

---

# 59. Avoid Unnecessary Frontend Changes

The target state is:

```text
dental-frontend/src/components/blog/BlogContent.tsx
```

continues receiving:

```text
contentBetterBlocks
```

and renders it exactly as before.

Do not add code such as:

```ts
if (contentSource === 'docx') ...
```

There should be no DOCX concept in the Next.js frontend.

---

# 60. Implementation Sequence

Follow this implementation order.

## Phase 1 — Repository Inspection

Inspect:

```text
Strapi version
Better Blocks version
Better Blocks Core version
renderer version
Blog content type schema
existing Better Blocks JSON
Better Blocks field integration
custom Better Blocks blocks
existing upload/media utilities
admin plugin conventions
testing setup
```

Report findings before making architectural assumptions.

---

## Phase 2 — Define Supported Better Blocks Schema

Create a clear internal mapping table for the exact installed Better Blocks version.

Determine actual JSON shapes for:

```text
paragraph
heading
text
link
list
list item
quote
code
table
table row
table cell
image
```

Use actual package types and existing data.

---

## Phase 3 — Build Pure Transformer

Implement:

```text
HTML/AST
→ Better Blocks JSON
```

before building the UI.

This transformer should be testable without Strapi Admin.

---

## Phase 4 — DOCX Parser

Implement:

```text
DOCX
→ Mammoth
→ normalized semantic representation
```

Connect this to the Better Blocks transformer.

---

## Phase 5 — Images

Implement:

```text
embedded DOCX image
→ Strapi Media Library
→ Better Blocks image node
```

---

## Phase 6 — Validation

Run Better Blocks validation after conversion.

Imported content must not proceed unless structurally valid.

---

## Phase 7 — Strapi Admin Endpoint

Implement secure admin-only DOCX transform/import endpoint.

---

## Phase 8 — Strapi Admin UI

Add:

```text
Import DOCX
```

to the Blog editing workflow.

Implement:

```text
file selection
replace / append
preview
warnings
apply
```

---

## Phase 9 — Testing

Run:

```text
unit tests
fixture tests
validation tests
admin integration tests if practical
frontend rendering regression tests
```

---

# 61. Definition of Done

The feature is complete when all of the following are true:

* A Strapi editor can open a Blog entry.
* The editor can click `Import DOCX`.
* The editor can select a valid `.docx` file.
* DOCX text is parsed successfully.
* Headings are converted to Better Blocks headings.
* Paragraphs are converted correctly.
* Bold formatting is preserved.
* Italic formatting is preserved.
* Underline formatting is preserved where supported.
* Strikethrough is preserved where supported.
* Links are preserved.
* Ordered lists are preserved.
* Unordered lists are preserved.
* Nested lists work where supported.
* Tables render correctly through Better Blocks.
* Embedded images are uploaded to Strapi Media Library.
* Better Blocks image nodes reference Strapi media correctly.
* Unsupported Word features produce warnings rather than broken JSON.
* The resulting JSON passes Better Blocks validation.
* The user can choose Replace or Append.
* Imported content appears in the existing Better Blocks editor.
* Importing does not automatically save or publish the Blog.
* The user can edit imported content normally.
* Existing manual Better Blocks content continues working.
* Existing frontend rendering continues working.
* No Markdown field is introduced.
* No DOCX-specific frontend renderer is introduced.
* No private Better Blocks deep imports are used unless clearly documented and unavoidable.
* No direct modification of `node_modules`.
* Tests cover the important mappings.

---

# 62. Explicit Non-Goals

Do NOT build:

```text
a new Markdown CMS
a new Blog content field
a separate DOCX storage model
a DOCX viewer in Next.js
a Microsoft Word pixel-perfect renderer
a new frontend content renderer
a replacement for Better Blocks
a generic document management system
```

The feature is specifically:

```text
DOCX
→ existing Better Blocks contentBetterBlocks
```

---

# 63. Important Design Principle

Treat Better Blocks JSON as the canonical format.

Think of the architecture as:

```text
DOCX is an input format.

Better Blocks JSON is the canonical CMS format.

HTML/AST is an internal transformation representation.

Next.js remains a consumer of Better Blocks JSON.
```

---

# 64. Failure Handling Principle

Never solve conversion problems by inserting invalid Better Blocks nodes.

Preferred behavior:

```text
supported format
→ preserve

partially supported format
→ normalize + warning

unsupported format
→ preserve semantic text + warning

invalid structure
→ reject import
```

---

# 65. Code Quality Requirements

Implementation must be:

```text
typed
modular
testable
version-aware
upgrade-safe
maintainable
documented
```

Avoid giant transformer functions.

Prefer small dedicated handlers.

Example:

```ts
transformParagraph()
transformHeading()
transformInlineChildren()
transformLink()
transformList()
transformTable()
transformImage()
```

---

# 66. Documentation

Add developer documentation explaining:

```text
architecture
dependencies
DOCX parsing flow
Better Blocks transformation flow
supported formats
unsupported formats
warning behavior
image import behavior
how to extend Word style mappings
how to add new node transformers
how to run tests
```

Also document any assumptions caused by the exact installed Better Blocks or Strapi version.

---

# 67. Final Deliverables

At the end, provide:

## 1. Repository analysis

Explain:

```text
Strapi version
Better Blocks version
relevant package exports
actual Better Blocks node schemas
selected Strapi extension API
```

## 2. Architecture summary

Show the final implementation flow.

## 3. Files changed

List every created or modified file.

## 4. Dependencies added

Explain why each dependency is necessary.

## 5. Supported DOCX features

Provide a table:

```text
DOCX feature | Supported | Better Blocks output | Notes
```

## 6. Known limitations

Clearly list unsupported Word behavior.

## 7. Tests

List tests added and their results.

## 8. Manual verification instructions

Provide exact steps to test:

```text
open Strapi
open Blog
click Import DOCX
choose sample file
preview
apply
save
open frontend Blog page
verify output
```

---

# 68. Most Important Constraint

Do not redesign the current content architecture.

The existing production architecture is correct:

```text
Better Blocks Editor
↓
contentBetterBlocks JSON
↓
Strapi
↓
Next.js
↓
@qkix/better-blocks-react-renderer
```

The DOCX importer must simply become another way to produce valid:

```text
contentBetterBlocks
```

data.

The final architecture should therefore be:

```text
                            Manual editing
                                 │
                                 ▼
                        Better Blocks Editor
                                 │
                                 │
DOCX                            │
 │                              │
 ▼                              │
Mammoth                         │
 │                              │
 ▼                              │
Semantic HTML / AST             │
 │                              │
 ▼                              │
Better Blocks Transformer       │
 │                              │
 ▼                              │
Better Blocks Validation        │
 │                              │
 └──────────► contentBetterBlocks ◄──────────┘
                     │
                     ▼
                   Strapi
                     │
                     ▼
                   Next.js
                     │
                     ▼
      @qkix/better-blocks-react-renderer
```

Implement the feature according to this architecture unless repository inspection proves that a specific part is incompatible with the installed versions.

If implementation details differ because of the actual Strapi or Better Blocks version, adapt to the repository rather than forcing assumptions from this specification.

Before using any undocumented internal API, first verify whether a stable public API exists.

Prioritize maintainability and compatibility with future Better Blocks and Strapi upgrades.

---

# 69. Clipboard and DOCX Import Strategy

This section defines the implementation that should be used when an editor copies
content from Microsoft Word, Google Docs, LibreOffice, or a local `.docx` file.

There are two different browser inputs and they must not be confused:

| Editor action | Browser payload | Parser | Result |
|---|---|---|---|
| Paste from Word/Docs | `text/html`, optionally `text/plain`, sometimes images | Clipboard HTML normalizer | Better Blocks JSON |
| Choose a `.docx` file | `File` binary | Mammoth | Semantic HTML, then Better Blocks JSON |
| Paste a copied file | `DataTransfer.files` | Mammoth | Semantic HTML, then Better Blocks JSON |

The importer must not store clipboard HTML, Word HTML, Markdown, or the original
DOCX as the blog content. Every path must converge on the same pure transformer:

```text
clipboard paste or DOCX file
        ↓
semantic HTML / normalized document AST
        ↓
HTML/AST → Better Blocks transformer
        ↓
Better Blocks validation
        ↓
contentBetterBlocks in the current Strapi form
```

## 69.1 Recommended clipboard behavior

Implement clipboard support as an additional input to the importer, not as a
second content model.

1. The editor opens a Blog entry and focuses the Better Blocks import control.
2. The editor pastes content from Word or Docs into the import area.
3. The browser handler reads `clipboardData.items` and `clipboardData.files`.
4. If a DOCX file is present, send the file to the DOCX endpoint.
5. Otherwise, read `text/html`; if HTML is unavailable, read `text/plain`.
6. Sanitize and normalize the input.
7. Pass the normalized representation to the same Better Blocks transformer used
   by DOCX imports.
8. Validate the resulting blocks.
9. Show the summary and warnings.
10. Apply only after editor confirmation; do not save the document automatically.

The clipboard handler must use the Clipboard and DataTransfer APIs. Do not use
`document.execCommand`, DOM queries against Strapi's generated markup, or a
hidden contenteditable element to modify the Strapi form.

## 69.2 Clipboard format selection

Use this precedence order:

```ts
function chooseClipboardPayload(event: ClipboardEvent):
  | { kind: 'file'; file: File }
  | { kind: 'html'; value: string }
  | { kind: 'text'; value: string }
  | null {
  const files = Array.from(event.clipboardData?.files ?? []);
  const docx = files.find((file) =>
    file.name.toLowerCase().endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  if (docx) return { kind: 'file', file: docx };

  const html = event.clipboardData?.getData('text/html').trim();
  if (html) return { kind: 'html', value: html };

  const text = event.clipboardData?.getData('text/plain').trim();
  if (text) return { kind: 'text', value: text };

  return null;
}
```

Not all browsers expose a copied DOCX as a file. Microsoft Word commonly puts
HTML and plain text on the clipboard instead. Therefore the HTML path is
required even when DOCX file import is already implemented.

When the editor uses the browser permission-based Clipboard API instead of a
paste event, call `navigator.clipboard.read()` only in response to a user click.
Handle `NotAllowedError` and fall back to the normal paste event. Never poll the
clipboard in the background.

## 69.3 Clipboard HTML safety

Clipboard HTML is untrusted. Before transformation:

1. Parse it with a real HTML parser.
2. Remove `script`, `style`, `iframe`, `object`, `embed`, `form`, and event
   handler attributes such as `onclick`.
3. Allow only safe link protocols: `http:`, `https:`, `mailto:`, and `tel:` where
   the product requires them.
4. Remove `javascript:`, `data:`, `vbscript:`, and protocol-relative URLs unless
   they are explicitly normalized to a trusted local representation.
5. Keep formatting represented by semantic tags and safe inline styles only.
6. Do not render the raw clipboard HTML as a preview.

The sanitized HTML is an intermediate value only. The final persisted value must
contain Better Blocks nodes and no HTML string.

## 69.4 Direct paste compatibility with Better Blocks 0.23.9

The installed Better Blocks version (`0.23.9`) wraps Slate's paste pipeline and
uses a compatibility check around `text/plain`. A synthetic event containing
both `text/plain` and `text/html` can therefore be received by the browser but
not inserted into the editor. Converting a Word table to Markdown also loses
formatting that GFM cannot represent, including font family, font size, color,
and some table attributes.

For direct paste into the existing editor, use this compatibility path:

```text
sanitized clipboard HTML
        ↓
Better Blocks-compatible Slate fragment
        ↓
application/x-slate-fragment
        ↓
beforeinput(inputType=insertFromPaste)
        ↓
Slate insertData / native editor history
```

The fragment must use the encoding implemented by `slate-react`:

```ts
window.btoa(encodeURIComponent(JSON.stringify(blocks)))
```

The synthetic `DataTransfer` must contain only
`application/x-slate-fragment`. Dispatching a `paste` event alone is not
reliable in Chromium because Slate 0.94 handles rich paste through its native
`beforeinput` listener. If the browser refuses to expose `dataTransfer` on the
synthetic event, do not cancel the original paste; allow the browser's native
fallback to run. Never use `execCommand`, persist Markdown, or persist raw
clipboard HTML.

This adapter is limited to direct clipboard paste. Full `.docx` import remains
the higher-fidelity path for embedded images and unsupported Word layout, and
must continue through Mammoth → semantic AST → Better Blocks validation.

# 70. Concrete Strapi Plugin Layout

For this repository, implement the importer as a local Strapi plugin so the
server endpoint and Admin UI can be versioned with the CMS:

```text
strapi-cms/src/plugins/docx-importer/
├── package.json
├── strapi-server.ts
├── strapi-admin.ts
├── server/
│   └── src/
│       ├── index.ts
│       ├── routes/admin.ts
│       ├── controllers/import.ts
│       ├── services/
│       │   ├── parse-docx.ts
│       │   ├── parse-clipboard-html.ts
│       │   ├── sanitize-html.ts
│       │   ├── html-to-ast.ts
│       │   ├── transform.ts
│       │   ├── transform-inline.ts
│       │   ├── transform-block.ts
│       │   ├── transform-list.ts
│       │   ├── transform-table.ts
│       │   ├── transform-image.ts
│       │   ├── upload-media.ts
│       │   ├── validate.ts
│       │   └── types.ts
│       └── config.ts
└── admin/
    └── src/
        ├── index.ts
        ├── api/importer.ts
        ├── components/ImportDocxAction.tsx
        ├── components/ImportDocxModal.tsx
        ├── components/ClipboardDropZone.tsx
        └── components/ImportPreview.tsx
```

The names may be adapted to existing plugin conventions, but the responsibilities
must remain separate. The transformer must be importable and testable without
Strapi, React, a database, or a browser.

## 70.1 Dependencies

Before adding packages, inspect the existing lockfiles. The minimum expected
server dependencies are:

```text
mammoth       DOCX → semantic HTML
parse5        HTML parsing without DOM execution
dompurify     optional server-side sanitizer when configured with jsdom
file-type     optional binary/MIME verification
```

Use one HTML parser and one sanitizer strategy. Do not add a Markdown parser,
Turndown, or a second rich-text representation as part of this feature.

For the exact repository versions, confirm:

```bash
node -p "require('./strapi-cms/node_modules/@strapi/strapi/package.json').version"
node -p "require('./strapi-cms/node_modules/@qkix/better-blocks-core/package.json').version"
node -p "require('./dental-frontend/node_modules/@qkix/better-blocks-react-renderer/package.json').version"
```

At the time this document was updated, the repository uses Strapi `5.40.0`,
Better Blocks Core `0.2.7`, the Strapi Better Blocks plugin `0.23.9`, and the
React renderer `0.18.8`. Verify these values after dependency upgrades.

# 71. Better Blocks Contract Used by the Transformer

`@qkix/better-blocks-core` is the source of truth. Import public types and
`validateDocument` from the package root:

```ts
import {
  validateDocument,
  type BlocksContent,
  type BlockNode,
  type InlineNode,
} from '@qkix/better-blocks-core';
```

Do not deep-import files from `dist` and do not copy types from the Strapi plugin.

The transformer must produce these exact public shapes where supported:

```text
paragraph       { type, children }
heading         { type, level, children }
quote           { type, children }
code            { type, language?, children }
link            { type, url, target?, rel?, children }
list            { type, format, children }
list-item       { type, checked?, children }
image           { type, image: { url, alternativeText?, width?, height? }, children }
table           { type, children: table-row[] }
table-row       { type, children: table-cell[] }
table-cell      { type, children }
table-header-cell { type, children }
```

The final boundary must be explicit:

```ts
export function assertValidBlocks(value: unknown): BlocksContent {
  const result = validateDocument(value);
  if (!result.valid) {
    throw new ImportValidationError(result.issues);
  }
  return value as BlocksContent;
}
```

Adapt the property name if the installed Core version returns `success` instead
of `valid`; inspect the installed declaration file before coding. A failed
validation must prevent the value from reaching `contentBetterBlocks`.

# 72. Step-by-Step Server Implementation

## Step 1 — Inspect the repository before changing schemas

Run and record:

```bash
rg -n 'contentBetterBlocks|better-blocks-react-renderer' strapi-cms dental-frontend
find strapi-cms/src/api -path '*/content-types/*/schema.json' -print
sed -n '1,220p' dental-frontend/src/components/blog/BlogContent.tsx
```

Confirm the target model. For Blog it is:

```text
api::blog.blog.contentBetterBlocks
```

If the importer is also enabled for service detail, the target field is:

```text
api::service-detail.service-detail.contentBetterBlocks
```

Do not use an obsolete UID such as `api::service.service` unless that content
type exists in the current source and database.

## Step 2 — Add only the Better Blocks field

The target content type keeps the following field:

```json
"contentBetterBlocks": {
  "type": "customField",
  "customField": "plugin::better-blocks.better-blocks",
  "required": false
}
```

Do not add `contentMarkdown`, `contentHtml`, `docxContent`, or `rawDocxHtml`.
If a legacy `content` field exists, first migrate and verify its data, then remove
it in a separate reviewed migration. Do not silently discard legacy content.

## Step 3 — Parse DOCX with Mammoth

Use `convertToHtml` with a controlled style map and image handler:

```ts
const result = await mammoth.convertToHtml(
  { buffer: inputBuffer },
  {
    styleMap: DOCX_STYLE_MAP,
    convertImage: mammoth.images.imgElement(async (image) => {
      const buffer = await image.read('base64');
      return {
        src: `data:${image.contentType};base64,${buffer}`,
        'data-import-image': 'true',
        'data-original-name': image.altText || 'docx-image',
      };
    }),
  },
);
```

The data URL is allowed only inside the short-lived server-side intermediate
representation. It must never be persisted in Better Blocks or returned to the
browser. Decode it immediately, upload the binary to Strapi Media Library, and
replace it with the uploaded media URL.

Use warnings returned by Mammoth as non-fatal import warnings. Treat parser
exceptions, invalid ZIP files, and impossible image reads as fatal errors.

## Step 4 — Normalize HTML to a safe AST

Create a parser boundary:

```ts
type DocumentNode =
  | { kind: 'block'; tag: string; children: DocumentNode[]; attrs: Record<string, string> }
  | { kind: 'text'; value: string; marks: TextMarks };

export function htmlToDocumentAst(html: string): DocumentNode[] {
  const safeHtml = sanitizeClipboardOrMammothHtml(html);
  return parseWithOneConfiguredHtmlParser(safeHtml);
}
```

Normalize Word-specific markup before transformation:

```text
<p class="MsoNormal">       → <p>
<span style="...">text</span> → text node with supported marks
<o:p>...</o:p>               → remove wrapper, keep text
empty Word paragraphs        → omit unless they are meaningful spacing
office namespace elements    → remove or flatten safely
```

Do not use chained regular-expression replacements as the parser.

## Step 5 — Transform inline nodes

Flatten nested inline tags into marked text nodes. For every text leaf, merge the
marks inherited from its ancestors:

```ts
function transformInline(node: AstNode, marks: TextMarks = {}): InlineNode[] {
  if (node.kind === 'text') {
    return node.value ? [{ type: 'text', text: node.value, ...marks }] : [];
  }

  const nextMarks = mergeMarks(marks, marksForTagAndStyle(node));
  if (node.tag === 'a') return [transformLink(node, nextMarks)];
  return node.children.flatMap((child) => transformInline(child, nextMarks));
}
```

Support only properties represented by the installed Better Blocks type:

```text
strong/b             bold
em/i                 italic
u                    underline
s/del               strikethrough
sup                  superscript
sub                  subscript
color                color, after safe CSS color normalization
background-color     backgroundColor, after safe CSS color normalization
font-family          fontFamily, if the editor schema supports it
font-size            fontSize, if the editor schema supports it
```

Unsupported CSS is ignored with a warning. Adjacent text nodes with identical
marks should be merged to keep the document compact.

## Step 6 — Transform block nodes

Use a dispatch table instead of one large conditional:

```ts
const blockHandlers: Record<string, BlockHandler> = {
  p: transformParagraph,
  h1: transformHeading,
  h2: transformHeading,
  h3: transformHeading,
  h4: transformHeading,
  h5: transformHeading,
  h6: transformHeading,
  blockquote: transformQuote,
  pre: transformCode,
  ul: (node, ctx) => transformList(node, 'unordered', ctx),
  ol: (node, ctx) => transformList(node, 'ordered', ctx),
  table: transformTable,
  img: transformImage,
  hr: transformHorizontalRule,
};
```

Unknown wrappers should recurse into their children when safe. They should not
create arbitrary Better Blocks node types.

## Step 7 — Transform links

The Core contract uses `url`, not `href`:

```ts
{
  type: 'link',
  url: safeUrl,
  target: target === '_blank' ? '_blank' : '_self',
  rel: target === '_blank' ? 'noopener noreferrer' : undefined,
  children: textChildren,
}
```

Reject unsafe protocols and omit empty links. Preserve supported inline marks in
the link children.

## Step 8 — Transform lists and nested lists

The public Better Blocks shape is:

```json
{
  "type": "list",
  "format": "unordered",
  "children": [
    {
      "type": "list-item",
      "children": [{ "type": "text", "text": "Item" }]
    }
  ]
}
```

Nested `ul`/`ol` nodes belong in the parent `list-item.children` after the item
inline content. Preserve ordered versus unordered format independently at each
nested level. If Word produces a malformed list, flatten only the malformed part
and emit a warning.

## Step 9 — Transform tables

For each `table`:

1. Parse rows in source order.
2. Detect `th` and output `table-header-cell`.
3. Output `td` as `table-cell`.
4. Transform text, marks, and links inside cells.
5. Preserve `colSpan` and `rowSpan` only when they are positive integers.
6. Convert multiple paragraphs in a cell to the supported inline representation;
   if the installed schema cannot represent them, join with a line break and warn.
7. Normalize missing cells instead of emitting an invalid ragged structure.

Do not copy a table shape from an old custom/native table implementation. Verify
the current Core types and the renderer before writing the transformer.

## Step 10 — Upload images through Strapi Media Library

The image pipeline is:

```text
DOCX/clipboard image
  → binary buffer
  → SHA-256 hash for this import only
  → Strapi upload service
  → media record
  → Better Blocks image node
```

Use the server upload service or the supported upload API. Do not write files
directly into `public/uploads` and do not insert a guessed media ID.

The output must match the Core image contract:

```json
{
  "type": "image",
  "image": {
    "url": "/uploads/example.webp",
    "alternativeText": null,
    "width": 1200,
    "height": 800
  },
  "children": [{ "type": "text", "text": "" }]
}
```

Use `null` for missing meaningful alt text; do not invent medical descriptions.
Cache repeated binary hashes during one import request. If a later fatal error
occurs, delete only media records created by that request, never pre-existing
media.

## Step 11 — Validate and return a non-persistent result

The endpoint should return blocks, summary, warnings, and errors without saving
the Blog entry:

```json
{
  "data": {
    "blocks": [],
    "summary": {
      "headings": 3,
      "paragraphs": 18,
      "lists": 2,
      "tables": 1,
      "images": 4,
      "blockCount": 28
    },
    "warnings": []
  }
}
```

The server must reject the result when validation fails, even if the summary was
successfully calculated.

# 73. Admin Endpoint and Authentication

Use an admin-only route, for example:

```text
POST /docx-importer/transform
Content-Type: multipart/form-data
file=<document.docx>
mode=replace|append
```

For clipboard HTML, use a separate content type on the same route or a separate
endpoint:

```text
POST /docx-importer/transform-html
Content-Type: application/json
{ "html": "...", "mode": "replace" }
```

The route must be registered as an Admin API route and require an authenticated
Strapi Admin session/token. It must not be a public Content API route. Confirm
that unauthenticated requests return `401` or `403`.

Apply limits before parsing:

```text
DOCX maximum size       10 MiB by default
embedded image maximum  5 MiB by default
maximum images          50
maximum blocks          2,000
maximum table rows      500
maximum table columns   50
```

Make the values configurable through plugin configuration and document any
production overrides. Reject a wrong extension, wrong MIME/signature, malformed
ZIP, oversized upload, or excessive document complexity with an editor-friendly
error.

# 74. Admin Clipboard/Import UI Implementation

Use official Strapi Admin extension APIs available in the installed Strapi 5
version. First inspect the installed types and existing Better Blocks custom
field integration. The preferred integration order is:

1. A supported document action or document header action.
2. A supported custom-field wrapper/extension around the Better Blocks field.
3. A small import panel adjacent to the field using official form APIs.

Never use `querySelector`, generated CSS selectors, monkey-patched React state,
or direct database writes.

## 74.1 Final button placement

The primary import button must be placed directly above or in the action area of
the `contentBetterBlocks` field in the Blog edit view:

```text
Blog edit view
├── Title
├── Slug / Cover image / Excerpt / SEO
├── Content Better Blocks
│   ├── [Import DOCX] [Paste from Word]
│   └── Better Blocks editor
└── Save / Publish
```

Recommended desktop layout:

```text
Content Better Blocks                         [Import DOCX] [Paste from Word]
────────────────────────────────────────────────────────────────────────────
                              Better Blocks editor
```

The button must be contextual to the field, so an editor sees immediately which
field will receive the imported content. It must not be placed only in the
global left navigation, Media Library, Content-Type Builder, or a global plugin
settings page.

Use these labels:

```text
Import DOCX       Select a local .docx file
Paste from Word   Read clipboard HTML, text, or a copied DOCX file
```

If the installed Strapi version cannot extend the Better Blocks field directly,
use this fallback placement in the Blog document edit header:

```text
Blog: {title}                                      [Import DOCX]
```

The header action must still write only to the current document form's
`contentBetterBlocks` field. It must not save, publish, or create a separate
document. The contextual field placement remains the preferred implementation.

On narrow screens, keep the controls above the editor and allow them to wrap:

```text
Content Better Blocks
[Import DOCX]
[Paste from Word]
Better Blocks editor
```

Do not hide the import action inside a hover-only menu. It must be keyboard
reachable, have visible focus styling, and expose a loading/disabled state while
an import is running. Use an accessible name such as `Import DOCX into Content
Better Blocks`.

The same placement applies to a service-detail `contentBetterBlocks` field if
the importer is enabled for service pages. In that case the button appears
directly above the service-detail Better Blocks editor, not in the Services
Overview listing page.

The UI state machine should be explicit:

```text
idle
→ selecting
→ reading clipboard/file
→ uploading
→ transforming
→ uploading images
→ validating
→ preview
→ applying
→ applied (form dirty)
or error
```

The modal must provide:

```text
Import DOCX / Paste from Word
file picker or paste zone
Replace current content / Append to current content
Import images checkbox
Preserve supported formatting checkbox
Import & Preview
Apply to Better Blocks
Cancel
```

On `Apply`:

```ts
const nextValue = mode === 'append'
  ? [...existingBlocks, ...importedBlocks]
  : importedBlocks;

assertValidBlocks(nextValue);
setFieldValue('contentBetterBlocks', nextValue);
```

The form must become dirty. The importer must not call Strapi create/update or
publish APIs after Apply. The editor remains responsible for reviewing and using
the normal Save/Publish controls.

If the form API cannot safely update the custom field, stop and use the documented
custom-field extension point. Do not fall back to DOM injection.

# 75. Test Plan

## 75.1 Pure transformer tests

Test HTML fixtures independently from Strapi:

```text
paragraph
headings 1–6
bold, italic, underline, strikethrough
combined marks
safe and unsafe links
unordered and ordered lists
nested lists
blockquote
code block
header and body table cells
colSpan and rowSpan
empty paragraphs
Vietnamese, English, emoji, and Unicode punctuation
```

Each successful case must assert both semantics and validation:

```ts
const result = htmlToBetterBlocks(html);
expect(result.errors).toEqual([]);
expect(validateDocument(result.blocks).valid).toBe(true);
```

## 75.2 DOCX integration fixtures

Keep small real DOCX fixtures for headings, formatting, lists, tables, and images.
For each fixture assert:

```text
Mammoth does not throw
expected block counts
expected marks and URLs
image upload count
no data URLs in final blocks
Better Blocks validation succeeds
```

Also test corrupted DOCX, wrong extension, oversized file, invalid image, empty
document, merged table cells, and unsupported Word styles.

## 75.3 Clipboard tests

Mock `ClipboardEvent` and test:

```text
DOCX file takes precedence over HTML
HTML takes precedence over plain text
plain text is used when HTML is absent
empty clipboard is rejected cleanly
unsafe HTML is sanitized
unsafe URLs are removed or warned
paste does not persist content
```

## 75.4 Endpoint and Admin tests

Verify:

```text
unauthenticated request → 401/403
valid DOCX → summary and blocks
invalid DOCX → editor-friendly fatal error
warnings do not block Apply
validation errors block Apply
Replace replaces only local form state
Append preserves existing blocks
normal Save persists the final value
```

# 76. Deployment Procedure

Run deployment in this order from the repository root.

## 76.1 Local verification

```bash
cd /home/neurosus/smilelux-dentist
npm --prefix strapi-cms run type-check
npm --prefix strapi-cms run lint
npm --prefix dental-frontend run type-check
```

Run the importer unit/integration test command configured by the repository. Do
not skip tests because the Admin UI is not involved in the pure transformer.

## 76.2 Build only the affected services

For a CMS-only change:

```bash
docker compose build smilux-strapi
docker compose up -d --no-deps smilux-strapi
```

If the frontend renderer or service detail query changes too:

```bash
docker compose build smilux-frontend
docker compose up -d --no-deps smilux-frontend
```

Do not use an unscoped `docker compose down`, `docker system prune`, or volume
deletion. This deployment must not touch the isolated PostgreSQL or upload
volumes used by other running sites.

## 76.3 Health verification

```bash
docker compose ps
docker inspect dental-strapi --format '{{.State.Health.Status}}'
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:12345/_health
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:12345/admin
```

Expected results are `healthy`, `204`, and `200`. Confirm that unrelated
containers retain their original start times and that the Strapi container uses
the intended isolated database and upload volume.

## 76.4 Manual editor verification

1. Open `http://100.68.50.41:12345/admin`.
2. Open Content Manager → Blog.
3. Open an existing Blog entry with a backup/export available.
4. Click `Import DOCX` or `Paste from Word`.
5. Select a small fixture DOCX or paste formatted content.
6. Confirm Replace/Append mode.
7. Confirm the summary and warnings.
8. Apply and verify `contentBetterBlocks` is visible in the editor.
9. Confirm the document is dirty but has not been auto-saved.
10. Save or Publish with Strapi's normal action.
11. Open the matching Next.js news page.
12. Verify headings, marks, links, tables, and images through
    `@qkix/better-blocks-react-renderer`.

For clipboard testing, repeat steps 4–8 by copying from Word and from Google
Docs. Test Chrome and Firefox at minimum because clipboard MIME exposure differs.

# 77. Rollback and Orphan Media Handling

If the Admin bundle fails to load or the endpoint causes errors:

1. Stop accepting imports by disabling the plugin route through configuration.
2. Re-deploy the previous CMS image or commit.
3. Do not delete the Better Blocks JSON column or existing content during a UI
   rollback.
4. Review import-operation logs for media IDs created by failed requests.
5. Delete only media records explicitly owned by the failed operation.
6. Re-run the health and existing Blog rendering checks.

Schema rollback is a separate database migration and requires a backup. Never
drop `contentBetterBlocks` or media tables as an emergency workaround.

# 78. Implementation Checklist

```text
[ ] Exact Strapi and Better Blocks versions recorded
[ ] Public Better Blocks exports verified
[ ] Target UID verified; obsolete service UID not used
[ ] No Markdown or DOCX content field added
[ ] Clipboard file/HTML/plain-text precedence implemented
[ ] Clipboard HTML sanitized before parsing
[ ] Mammoth DOCX parsing implemented
[ ] HTML/AST transformer is pure and reusable
[ ] Paragraphs/headings/marks/links implemented
[ ] Lists and nested lists validated
[ ] Tables and spans validated
[ ] Images uploaded through Strapi Media Library
[ ] No data URLs persisted
[ ] Per-import image deduplication implemented
[ ] Better Blocks validation blocks invalid output
[ ] Admin-only authentication enforced
[ ] File, image, block, and table limits enforced
[ ] Replace and Append modify only local form state
[ ] Normal Save/Publish remains authoritative
[ ] Unsupported features become warnings
[ ] Unit, fixture, clipboard, endpoint, and regression tests pass
[ ] CMS-only Docker deployment verified in isolation
[ ] Frontend rendering verified with existing renderer
[ ] Rollback and orphan-media behavior documented
```

---

# 79. Current Repository Behavior: Why Ctrl+C → Ctrl+V Does Not Work Yet

This section records the result of the codebase inspection performed on the
current Smilux repository. It is important to distinguish the documented target
architecture from code that is already implemented.

## 79.1 What exists today

The current repository contains:

```text
Strapi Blog schema
  └── contentBetterBlocks custom field

Strapi service-detail schema
  └── contentBetterBlocks custom field

Next.js BlogContent.tsx
  └── @qkix/better-blocks-react-renderer

Better Blocks Core
  └── public validateDocument and document types
```

The current repository does not contain:

```text
src/plugins/docx-importer
Mammoth dependency
clipboardData/items paste handler
navigator.clipboard.read() integration
Import DOCX Admin action
Paste from Word Admin action
DOCX transform endpoint
HTML-to-Better-Blocks transformer
clipboard-specific tests
```

Therefore the button placement and clipboard flows described in the previous
sections are implementation requirements, not evidence that those controls
already exist in the running Admin Panel.

## 79.2 Actual Ctrl+C/Ctrl+V flow

When an editor presses `Ctrl+C` in Word and `Ctrl+V` in the Better Blocks editor,
the browser normally provides one or more of:

```text
text/html
text/plain
image/png or another image MIME type
```

It normally does not provide the original `.docx` ZIP file as a clipboard File.
The current codebase has no `onPaste` handler that reads these clipboard formats,
sanitizes them, transforms them, validates them, and updates the
`contentBetterBlocks` form value. As a result, the Better Blocks editor receives
an unsupported native paste event or plain text that it cannot convert into the
expected document structure. The paste is ignored, partially inserted, or
rejected depending on the browser and the editor state.

This is the direct reason that Ctrl+C from DOCX/Word followed by Ctrl+V into the
current Better Blocks field does not work.

## 79.3 What must not be assumed

The following assumptions are incorrect:

```text
contentBetterBlocks exists
  ≠ DOCX importer exists

Better Blocks renderer exists
  ≠ Better Blocks editor accepts Word clipboard HTML

Browser Ctrl+V works in a text editor
  ≠ Strapi custom field receives valid Better Blocks JSON

Word copied HTML exists on the clipboard
  ≠ Word copied HTML is safe or compatible with Better Blocks
```

The renderer only renders already-valid JSON. It does not parse DOCX, Word HTML,
or clipboard data.

## 79.4 Required implementation to make Ctrl+V work

The implementation must add a controlled paste surface next to the
`contentBetterBlocks` field at the documented location. The handler should:

```text
onPaste
  ↓ prevent default only in the importer paste surface
  ↓ inspect clipboardData.files/items
  ↓ if .docx file exists, send multipart DOCX request
  ↓ else read text/html
  ↓ else read text/plain
  ↓ sanitize input
  ↓ parse into AST
  ↓ transform into Better Blocks JSON
  ↓ upload embedded images through Strapi Media Library
  ↓ validate with @qkix/better-blocks-core
  ↓ show preview and warnings
  ↓ apply to current form only after confirmation
```

Do not attach a global `window` paste listener. A global listener can intercept
normal Strapi text inputs, relation fields, search boxes, and the Better Blocks
editor itself. Scope the handler to the visible `Paste from Word` drop/paste
surface or use the supported Strapi custom-field extension API.

## 79.5 Minimal client-side event contract

The future Admin component should follow this behavior:

```tsx
function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
  const payload = chooseClipboardPayload(event.nativeEvent);
  if (!payload) {
    setError('No supported clipboard content was found.');
    return;
  }

  event.preventDefault();
  void importClipboardPayload(payload);
}
```

Important details:

1. Call `preventDefault()` only after confirming the paste is being handled by
   the importer surface.
2. Do not call `preventDefault()` on the whole form or document.
3. Keep the current field value until the import result passes validation and the
   editor confirms Apply.
4. Do not directly dispatch synthetic keyboard events into the Better Blocks
   editor.
5. Do not write clipboard HTML into a hidden Strapi field.

## 79.6 Browser and source-application limitations

Clipboard behavior depends on the application that produced the copy operation:

| Source | Usually exposed | Expected handling |
|---|---|---|
| Microsoft Word desktop | Word HTML + plain text, sometimes images | HTML sanitizer + AST transformer |
| Word for the web | HTML + plain text | HTML sanitizer + AST transformer |
| Google Docs | HTML + plain text, often proprietary styles | normalize HTML and warn on unsupported styles |
| LibreOffice | HTML + plain text | HTML sanitizer + AST transformer |
| File manager copying `.docx` | browser-dependent file item | Mammoth file path if exposed |
| Plain text editor | plain text | paragraph-only fallback |

The implementation must provide both a `Paste from Word` surface and a normal
`Import DOCX` file picker. File picker support cannot replace clipboard support.

## 79.7 Diagnostic procedure for the current failure

Until the importer is implemented, use this procedure to confirm the issue:

1. Open DevTools → Console.
2. Open the Blog entry containing `contentBetterBlocks`.
3. Copy a heading and paragraph from Word.
4. Paste into the current Better Blocks field.
5. Check whether any application `paste` handler logs a payload.
6. Check DevTools → Network for a DOCX/import request.
7. Check whether the form value changes in React/Strapi state.
8. Check whether the current field value remains an array of Better Blocks nodes.

With the current repository, there is no importer endpoint or clipboard handler
to observe, so no network request is expected. This confirms the failure is a
missing implementation path, not a PostgreSQL, Strapi Content API, or frontend
renderer mapping problem.

## 79.8 Acceptance criteria specific to clipboard

Clipboard support is complete only when all of the following are true:

```text
[ ] Paste from Word button/paste surface is visible beside contentBetterBlocks
[ ] Ctrl+V is handled only inside that surface
[ ] text/html is preferred over text/plain
[ ] copied DOCX file is detected when the browser exposes one
[ ] unsafe HTML and URLs are removed
[ ] Word styles are normalized or reported as warnings
[ ] headings, paragraphs, marks, links and lists become valid Better Blocks
[ ] pasted images are uploaded, not stored as data URLs
[ ] preview appears before local form mutation
[ ] Replace and Append are supported
[ ] Apply makes the Strapi form dirty without saving
[ ] normal Save/Publish persists the result
[ ] no clipboard content is logged server-side
[ ] Chrome and Firefox behavior is tested
```

Until these criteria are met, the correct user-facing status is:

```text
Direct Ctrl+C/Ctrl+V from DOCX into the Better Blocks field is not supported.
Use manual Better Blocks editing or the eventual Import DOCX/Paste from Word
workflow after the importer implementation is deployed.

## 79.9 Current implementation status (updated)

The implementation described in the previous subsection has now been deployed
and this subsection supersedes the historical “not implemented” status above.
`Ctrl+C` itself is intentionally not intercepted: the source application owns
the browser clipboard write and normally creates `text/html` plus `text/plain`.
The importer owns the corresponding `Ctrl+V` behavior.

Current flow:

```text
Ctrl+C in Word / DOCX viewer
        ↓ browser clipboard: HTML + plain text
Ctrl+V in Better Blocks
        ↓ trusted paste capture
HTML without embedded images
        ↓ HTML blocks → GFM Markdown
        ↓ synthetic text/plain paste
Better Blocks native Markdown parser
        ↓ Slate insertion + native undo/redo
contentBetterBlocks form state
```

For Service content, the Admin entry point is intentionally mounted at the
Service collection list (`listView.actions`), not inside an existing document's
edit header:

```text
Service list
  → Import DOCX
  → preview and validate
  → Continue to Create Service
  → /content-manager/collection-types/api::service.service/create
  → hydrate contentBetterBlocks in the new form
  → normal Save/Publish
```

The pending validated blocks are transferred through a short-lived
`sessionStorage` entry and removed after the create form hydrates. The imported
document is never saved automatically and no large JSON payload is placed in
the URL.

Supported direct-paste content includes headings, paragraphs, bold, italic,
strikethrough, safe links, unordered/ordered lists, blockquotes, code blocks,
and tables. Table rows are converted to GFM with the first row as the header,
which matches the Better Blocks Markdown parser's table model.

Direct paste intentionally does not intercept clipboard HTML containing images.
Images cannot be safely persisted as Better Blocks image nodes without uploading
them to Strapi Media Library. For image-bearing DOCX content, use the `Import
DOCX` modal, which uploads embedded images, validates the complete document and
supports Replace/Append before the normal Save/Publish action.

Copying content from another Better Blocks field follows the same rule: plain
Markdown is handled by Better Blocks natively; HTML text/table content is
normalized by the bridge; image-bearing content uses the Import DOCX modal.

Implementation files:

```text
strapi-cms/src/plugins/docx-importer/admin/src/clipboard.ts
  trusted Ctrl+V bridge and HTML → GFM conversion

strapi-cms/src/plugins/docx-importer/admin/src/index.tsx
  admin bootstrap registration and Import DOCX modal

strapi-cms/src/lib/docx-better-blocks.js
  server HTML/Markdown → Better Blocks mapping, sanitization and validation
```

This architecture avoids modifying `node_modules`, avoids a global keyboard
handler, does not write raw clipboard HTML to Strapi, and preserves Slate's
history because the final insertion is performed by Better Blocks itself.

Updated clipboard acceptance checks:

```text
[ ] Ctrl+C from Word exposes HTML/plain text in the browser
[ ] Ctrl+V for Word text converts into Better Blocks blocks
[ ] Ctrl+V for Word tables preserves rows and cells
[ ] Ctrl+V preserves supported inline marks and safe links
[ ] Ctrl+V does not persist raw HTML or data URLs
[ ] Ctrl+Z reverses the inserted Better Blocks fragment
[ ] image-bearing content uses Import DOCX and Media Library upload
[ ] direct plain Markdown paste remains native Better Blocks behavior
[ ] Replace/Append still modify only unsaved form state
```

## 79.10 Operating-system shortcuts and clipboard diagnostics

The importer must follow the operating system's native shortcut convention; it
must not replace `Ctrl` with `Command` or intercept the browser's default
editing behavior:

| OS | Copy | Paste | Undo |
|---|---|---|---|
| Windows / Linux | `Ctrl + C` | `Ctrl + V` | `Ctrl + Z` |
| macOS | `Command + C` | `Command + V` | `Command + Z` |

The admin clipboard bridge only observes these shortcuts for diagnostics. It
does not call `preventDefault()` for `C`, `V`, or `Z`. Slate/Better Blocks
continues to own copy, paste insertion, undo and redo. The bridge only calls
`preventDefault()` after it has confirmed a trusted HTML paste can be converted
to supported GFM and redispatched to Better Blocks.

To inspect a real paste in the browser console, enable temporary diagnostics:

```js
window.__DOCX_CLIPBOARD_DEBUG__ = true
```

Then focus the Better Blocks editor and use the native shortcut for the current
OS. The console logs, without changing the event behavior:

```text
[DOCX Clipboard] shortcut
  key, modifier (Control or Command), platform, defaultPrevented

[DOCX Clipboard] paste-received
  clipboard MIME types, file metadata, HTML/plain-text lengths and previews

[DOCX Clipboard] paste-converted
  generated GFM text that is sent back to Better Blocks

[DOCX Clipboard] paste-dispatched
  verified synthetic text/plain-only paste event delivered to the editor;
  text/plain-only is required by the installed Slate/Better Blocks paste gate

[DOCX Clipboard] paste-dispatch-failed / paste-native-restored
  browser rejected the synthetic clipboard payload; no unsafe raw HTML is inserted
```

The debug flag is off by default. Clipboard content must not be logged in
production or sent to the server as diagnostic telemetry. Disable diagnostics
after testing:

```js
window.__DOCX_CLIPBOARD_DEBUG__ = false
```

Expected diagnostic sequence for Word/DOCX text or tables is:

```text
Command/Control + V
  → shortcut modifier matches the current OS
  → paste-received shows text/html and/or text/plain
  → paste-converted appears for supported HTML without images
  → Better Blocks inserts the fragment
  → Command/Control + Z reverses the insertion
```

If `paste-received` is absent, the event is not reaching the Better Blocks
editable surface. If it is present but no `paste-converted` appears, the source
payload is plain text, contains unsupported media, or does not contain a
supported HTML block. If `paste-dispatch-failed` appears, the browser did not
accept the synthetic clipboard payload; the bridge deliberately avoids
inserting raw HTML. Use the Import DOCX modal for image-bearing or
full-fidelity Word content.
```
