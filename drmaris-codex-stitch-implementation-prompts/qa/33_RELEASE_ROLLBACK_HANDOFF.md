# QA Phase — Release, Rollback, and Handoff

Produce a final implementation report before merge/deployment.

## Final report

Include:
1. summary of architecture changes;
2. route-by-route implementation status;
3. Stitch screen IDs used;
4. shared components/tokens added or changed;
5. Strapi schema diff;
6. content migration summary;
7. database backup reference/process;
8. Docker health results;
9. lint/type-check/build/test results;
10. visual QA status;
11. accessibility/SEO status;
12. performance considerations;
13. environment/config changes;
14. remaining known issues;
15. rollback instructions.

## Rollback

Rollback must distinguish:
- frontend code rollback;
- Strapi schema rollback;
- CMS data rollback;
- media rollback;
- environment/config rollback.

Never suggest blindly reverting schema after data has been written if that would drop fields/data. Provide a safe migration-aware rollback sequence.

## Final cleanup

Search for:
- debug logs;
- TODO/FIXME introduced by this work;
- temporary design asset URLs;
- mock content;
- secrets;
- disabled validation;
- obsolete duplicate components;
- abandoned migration scripts.

Do not delete migration/back-up documentation required for recovery.
