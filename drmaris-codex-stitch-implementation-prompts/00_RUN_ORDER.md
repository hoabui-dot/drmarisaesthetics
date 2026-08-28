# Run Order

Execute these prompts in order unless `MASTER_ORCHESTRATOR.md` is running the entire workflow.

1. `01_GLOBAL_EXECUTION_CONTRACT.md`
2. `02_REPO_BASELINE_AND_ARCHITECTURE_AUDIT.md`
3. `03_STITCH_DESIGN_LOCK_AND_ASSET_MANIFEST.md`
4. `04_STRAPI_SCHEMA_MAPPING_AND_MIGRATION.md`
5. `05_SHARED_DESIGN_SYSTEM_AND_APP_SHELL.md`
6. `pages/10_HOME.md`
7. `pages/11_PATIENT_RESULTS.md`
8. `pages/12_CONTACT_CONSULTATION.md`
9. `pages/13_RHINOPLASTY_MASTER_TEMPLATE.md`
10. `pages/14_RHINOPLASTY_MEDICAL_BLUE.md`
11. `pages/15_SURGEON_PROFILE.md`
12. `pages/16_ABOUT_US.md`
13. `integration/20_CONTENT_MAPPING_AND_FALLBACKS.md`
14. `integration/21_RESPONSIVE_ACCESSIBILITY_SEO.md`
15. `integration/22_FORMS_AND_INTERACTIONS.md`
16. `integration/23_ASSET_PIPELINE.md`
17. `qa/30_DOCKER_HEALTH_GATES.md`
18. `qa/31_LINT_TYPECHECK_BUILD_GATES.md`
19. `qa/32_VISUAL_REGRESSION_QA.md`
20. `qa/33_RELEASE_ROLLBACK_HANDOFF.md`

## Gate rule

Never continue to the next implementation phase after a newly introduced build, runtime, schema, migration, or Docker failure. Fix it first.

Pre-existing unrelated failures may be documented and isolated, but:
- do not introduce new failures;
- do not hide errors with blanket ignores;
- do not weaken TypeScript/ESLint/build settings merely to make a gate green.
