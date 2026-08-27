# SmileLux Figma Parity Recovery

This package is a corrective implementation contract for the SmileLux homepage migration.

Goal: stop treating the Figma migration as a visual restyle of legacy CMS content. For every visible Figma element, Codex must create an explicit mapping to CMS data, an existing business action, a route, or a documented blocker.

Read order:

1. `00-root-cause-audit.md`
2. `01-homepage-content-action-contract.md`
3. `02-hero-parity-contract.md`
4. `03-docs-path-repair.md`
5. `04-migration-recovery-strategy.md`
6. `05-parity-acceptance-gates.md`
7. `CODEX_FIGMA_PARITY_RECOVERY_PROMPT.md`

The target Figma remains the visual/content intent source of truth. Existing business behavior should be reused, but legacy CMS copy must not override content that is visibly specified in the Figma target.
