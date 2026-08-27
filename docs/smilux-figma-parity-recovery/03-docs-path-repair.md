# 03 — Documentation Path Repair

## Current defects to repair in repository

### Design spec page files

Current incorrect mapping:

```text
docs/design-spec/pages/01-home.md     -> Accessibility Rules (wrong)
docs/design-spec/pages/02-about.md    -> Page Spec — Home (wrong)
```

Before Codex relies on page paths, restore/copy the canonical documents to the filenames described by the design-spec README.

Do not continue multi-page migration until every page file's first heading matches its filename/page purpose.

### Homepage migration package

Actual folder:

```text
docs/hompage-migration-codex/references/
```

Correct references from package-root files should use:

```text
./references/figma-home.md
./references/theme.md
./references/typography.md
./references/responsive.md
./09-testing-acceptance.md
```

Current `AGENTS.md` uses broken examples such as:

```text
../reference/figma-home.md
../09-testing-acceptance.md
```

Current `CODEX_START_PROMPT.md` uses `reference/...` instead of `references/...`.

### Recommended guard script

Add a lightweight documentation integrity check, e.g.:

```text
scripts/check-design-docs.mjs
```

It should fail when:

- required referenced files do not exist;
- `pages/01-home.md` does not start with `# Page Spec — Home`;
- migration prompt references a nonexistent `reference/` directory;
- required global design prompt is absent from the documented read sequence.

No new dependency is necessary.
