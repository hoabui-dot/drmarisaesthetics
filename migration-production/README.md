# Production database migrations

This directory contains production migrations that change database structure
or remove obsolete schema-owned records. It intentionally does not contain
seed scripts, content population scripts, taxonomy assignments, or editorial
data updates. Production content is updated manually by the CMS team.

## Applying a migration

Before applying a migration:

1. Deploy the application image that no longer references the removed schema.
2. Take a verified PostgreSQL backup.
3. Review the SQL against the target database.
4. Run the reviewed structural migrations in numeric order with `ON_ERROR_STOP` enabled.
5. Run the manual merge script in `migration_scripts/217-merge-promotion-submissions-into-booking-submissions.js`.
6. Verify the unified promotion rows in Content Manager, then run `010`.

Example:

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DATABASE'
for migration in migration-production/00{3,4,5}-*.sql migration-production/01{1,2}-*.sql; do
  psql "$DATABASE_URL" \
    -v ON_ERROR_STOP=1 \
    -f "$migration"
done

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/013-homepage-video-only.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/014-homepage-video-testimonial-fields.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/015-homepage-patient-result-selection.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/016-homepage-patient-result-stable-selection.sql
```

The migrations are structural and idempotent. They never seed or copy CRM
records automatically. The legacy promotion table is deliberately removed in
a separate final step so a production operator can verify the manual merge
first. No Media Library files are deleted automatically.

## Current migrations

### `001-drop-page-content-type.sql`

Removes the obsolete `api::page.page` content type after the Strapi schema and
frontend dynamic `[slug]` route have been removed. Replacement content types
such as Homepage, About Page, Contact Page, and Treatments Page are not
modified.

### `002-hide-users-permissions-user-content-type.sql`

Hides the built-in `plugin::users-permissions.user` model from the Strapi
Content Manager and removes its stale Admin view/RBAC metadata. It deliberately
keeps `up_users`, `up_roles`, and `up_permissions` because the Users &
Permissions plugin still requires them for authentication and JWT handling.

### `003-prepare-unified-form-submissions.sql`

Adds nullable `country` and `submission_type` fields and relaxes legacy
booking-only required columns. Existing rows are classified as `booking`.

### `004-allow-newsletter-submissions.sql`

Ensures newsletter records can be stored without a phone number.

### `005-add-booking-submission-source.sql`

Adds `submission_source` and gives existing rows the safe `booking_modal`
source.

### `010-remove-legacy-promotion-submissions.sql`

Removes legacy Promotion Submission permissions and table only after the manual
copy script has been verified. Do not run this file in the initial pass.

### `011-website-settings-category-ids.sql`

Adds nullable stable-ID assignments and filter indexes for Blog and Service.
Website Settings repeatable-component storage is defined by the Strapi schema
and synchronized by Strapi; this SQL does not create or seed category rows.
The Strapi schema now uses only the nullable stable-ID fields for Blog and
Service assignments. The legacy Blog enum and Service Category collection are
removed from the application schema and Content Manager. Their old database
columns/tables are intentionally retained for now: review and map any legacy
assignments before adding a later structural migration to drop that storage.

### `012-remove-unused-category-metadata.sql`

Drops the unused `description` and `is_active` columns from the two Website
Settings category component tables. Category ID remains an internal stable
value: Strapi fills it during Website Settings create/update and hides it from
the Admin form. Editors manage only the label and optional icon.

### `013-homepage-video-only.sql`

Removes the old eyebrow, title, and description columns from the Homepage video
component as part of its transition to a YouTube-URL-based video section.
Apply this after deploying the Strapi schema that no longer exposes those
fields. It is safe when the columns were already removed or the component table
does not exist. This cleanup does **not** register the component in Content
Manager: production must first run a Strapi CMS image built with
`strapi-cms/src/components/homepage/video-section.json` and the updated Homepage
dynamic-zone schema. Strapi synchronizes that component's database storage from
the deployed schema; no separate create-table migration is needed here.

### `014-homepage-video-testimonial-fields.sql`

Adds nullable quote, customer name, customer description, and optional thumbnail
URL fields to Homepage's YouTube video component. Deploy the matching Strapi
schema first, then run this migration. It does not populate editorial content;
enter testimonial values manually in Homepage Content Manager. The frontend
waits for a valid YouTube URL and quote before rendering the section.

### `015-homepage-patient-result-selection.sql`

Adds the nullable JSON field used by the Homepage patient-results section to
store selected Result component IDs in editor-defined display order. Deploy the
matching Strapi schema/custom field first, then apply this migration. It does
not alter Result cases or populate the Homepage selection; editors choose and
order up to six saved cases in Homepage Content Manager. This initial ID-based
format is superseded by migration `016` because repeatable-component IDs may
change when case entries are replaced.

### `016-homepage-patient-result-stable-selection.sql`

Replaces homepage Result component-row IDs with `case_number` values as the
ordered selection key, and removes the obsolete ID list. Deploy the matching
Strapi schema first, apply this migration, then reselect the homepage cases in
Content Manager. The frontend falls back to the latest six cases until a valid
selection is saved.

## Manual promotion merge

The copy step is intentionally outside this directory. From the repository
root, run a dry run first:

```bash
STRAPI_MIGRATION_URL=http://127.0.0.1:22345 \
STRAPI_API_TOKEN="$STRAPI_API_TOKEN" \
node migration_scripts/217-merge-promotion-submissions-into-booking-submissions.js
```

Add `--write` only after reviewing the candidate count. Add
`--delete-source` only after verifying the newly created Form Submissions in
Content Manager. The script is never called by Strapi bootstrap, Docker or
application startup.
