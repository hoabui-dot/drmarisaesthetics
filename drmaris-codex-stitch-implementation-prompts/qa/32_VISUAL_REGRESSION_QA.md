# QA Phase — Stitch Visual Regression

For each page, retrieve the exact current Stitch screen again before final visual sign-off.

## Compare

Capture the implemented route at matching viewport sizes and compare:
- section order;
- content width/grid;
- typography family/weight/size/line-height;
- spacing;
- color;
- border/radius/shadow;
- image crop/focal point;
- sticky behavior;
- header/footer;
- form/control states;
- mobile reflow.

## Screen mapping

- Home → `f02c3c29c60949a5940ea4908cc3e2c9`
- Results → `afdcdb94f75742b8be793c299d811b85`
- Contact → `72a83ef98fc1400caafa5a899f93e124`
- Rhino Master → `d157742981aa4f869cb110bad2ff2476`
- Rhino production → `ebea7782814d4f229db4d6c1a29daf8e`
- Doctor → `c6b066eca34a4ab68fada8b299831c25`
- About → `dc81d96c305b44dd9d94614b4458c76a`

## Rules

Do not solve mismatches by:
- screenshotting whole sections;
- absolute-positioning an entire long page;
- hardcoding one desktop width;
- hiding overflow that masks broken layouts;
- replacing CMS content with design-only strings without mapping.

Fix root causes in tokens/layout/components.

Record remaining intentional differences and their reason.
