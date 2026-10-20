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

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/017-homepage-video-heading.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/018-homepage-patient-video-stories.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/019-homepage-patient-story-editor-layout.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/020-contact-map-use-website-settings.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/021-website-settings-google-map-place.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/022-blog-category-route-name.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/023-remove-about-hospital-section.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/024-contact-information-website-settings.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/025-about-hospital-directions-url.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/026-contact-dual-hospital-explorer.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/027-about-hospital-map-embed-url.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/028-website-hospital-coordinate-precision.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/029-website-settings-hospital-locations-layout.sql

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -f migration-production/030-website-hospital-place-url.sql

```

The migrations are structural and idempotent. They never seed or copy CRM
records automatically. The legacy promotion table is deliberately removed in
a separate final step so a production operator can verify the manual merge
first. No Media Library files are deleted automatically.

### `030-website-hospital-place-url.sql`

Adds the optional `maps_place_url` field to each Website Settings hospital
location. Enter the verified Google Maps **place** URL in that field (not the
search URL and not the iframe embed URL). The contact map preview uses verified
latitude/longitude for its pin and opens `maps_place_url` when clicked. This
prevents Google from geocoding a long address to the wrong location. Populate
the production HIU field with the verified place link supplied by the site
owner; CIH remains unchanged unless its own place URL is separately verified.

Apply `031-consolidate-website-hospital-locations.sql` after verifying the
manual content seed. Then apply `032-website-hospital-map-search-query.sql`:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migration-production/031-consolidate-website-hospital-locations.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migration-production/032-website-hospital-map-search-query.sql
```

### `032-website-hospital-map-search-query.sql`

Adds optional `maps_search_query` to Website Settings hospital locations. This
separates Google Maps geocoding text from the English address displayed in the
UI. The corresponding production content seed stores the verified Vietnamese
HIU facility name/address here, while leaving the English display address and
existing place URL intact. Apply this migration before running the seed.

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

### `017-homepage-video-heading.sql`

Adds a required title (with a safe default for existing Homepage video entries)
and optional subtitle to the Homepage customer-video component. Deploy the
matching Strapi schema and frontend first, then apply this structural migration.
Editors can change the title and add or omit the subtitle in Homepage Content
Manager; it does not seed testimonial copy.

### `018-homepage-patient-video-stories.sql`

Relaxes the legacy single-video URL column so a Homepage video section can use
the new repeatable `stories` component. Strapi creates/synchronizes the nested
story component table and relation storage from the deployed
`homepage.video-story` schema. Deploy the matching Strapi schema before this
migration. Existing single-video fields and content are retained for
compatibility; editors should manually recreate those values as a Patient story
in Content Manager. This migration does not copy or seed stories.

### `019-homepage-patient-story-editor-layout.sql`

Removes the old single-video field rows from Strapi's persisted Homepage video
component edit layout, leaving section heading fields and `stories`. The legacy
schema attributes remain hidden and stored for API/content compatibility. Run
this after deploying the CMS schema that includes Patient stories. It does not
alter or delete homepage content.

### `020-contact-map-use-website-settings.sql`

Removes duplicate address, clinic-name, and directions-URL fields from the
Contact map component and its persisted Content Manager edit layout. The
Contact page now gets its displayed address and map coordinates from
Website Settings; map zoom is defined by the embed URL or a fixed frontend
fallback. Existing values in those duplicate component columns are
discarded; this does not modify Website Settings or other Contact content.
Deploy the matching Strapi schema and frontend first, then run the migration.

### `021-website-settings-google-map-place.sql`

Adds `map_display_name` and optional `map_embed_url` to Website Settings. The
display name plus the existing address provides a searchable fallback, while
the embed URL can point to the exact hospital/business listing and preserve its
Google Maps marker/title. Both Footer and Contact use the same settings; this
migration does not seed map data. Deploy the matching CMS/frontend schema
before applying it.

### `022-blog-category-route-name.sql`

Adds nullable `route_name` storage to Website Settings Blog Categories. Each
category route segment identifies an article path as
`/news/{route_name}/{blog-slug}`. The frontend derives a normalized route from
the category label when this value is still empty, and Strapi fills/normalizes
it when Website Settings is saved. This migration is structural only; it does
not rewrite existing blog records or editorial category labels.

### `023-remove-about-hospital-section.sql`

Removes only the obsolete `about.hospital` component from the About Page:
its dynamic-zone assignments, component-owned media links, join table, and
component table. Media Library files are retained. It does not affect the
separate Homepage hospital sections or hospital content on other routes.

### `024-contact-information-website-settings.sql`

Adds optional second-location fields to Website Settings and removes the
unused `location_options` field and component storage from the Contact
consultation section. Contact Information now reads the primary/secondary
addresses and active contact methods from Website Settings. The migration does
not seed a second address: enter the verified address, coordinates, map name,
and optional embed URL in Website Settings after deployment.

### Homepage second hospital section

The Homepage dynamic zone includes the distinct component
`homepage.hospital-based-surgery-secondary-section`, which mirrors the fields
of the existing hospital section so editors can maintain a separate second
hospital record. Strapi synchronizes this component table and its dynamic-zone
relation storage from the deployed schema at startup. No standalone SQL
migration is required. Deploy the CMS schema before adding the new component in
Homepage Content Manager. For explicit production content seeding that
preserves existing Homepage sections and adds the CIH section after the current
hospital section, use
`seed-production/seed-homepage-cih-hospital-section.js`.

### About Us hospital environments section

The About Page dynamic zone adds `about.hospital-environments` with two
repeatable `about.hospital-chapter` entries. Strapi synchronizes the component
tables and dynamic-zone relations from the deployed schema at startup, so no
standalone SQL migration is needed. Deploy the Strapi schema and frontend
together, then add/review/publish production hospital content manually. The
local layout seed is intentionally host-guarded and must not be used against
production. The production content seed is maintained separately under
`seed-production/`; verify image rights, current addresses, Maps destinations,
and authorized wording before running it.

### About Page hospital directions links

`025-about-hospital-directions-url.sql` adds the optional
`maps_directions_url` field to each `about.hospital-chapter` component and
exposes it in an existing Content Manager edit layout. Editors should enter a
full HTTPS Google Maps directions/share URL for the exact hospital entrance or
campus destination. The displayed address becomes a link with a directions
icon when this URL is present; without it, the address remains plain text.

### `025-about-hospital-directions-url.sql`

Adds the optional `maps_directions_url` storage field to About hospital chapter
records and exposes it in the Content Manager. This is structural only; the
location values are populated by an explicit local or production seed after
address review.

### `026-contact-dual-hospital-explorer.sql`

Adds the Contact location section's `eyebrow`, `description`, and official
website button label, and adds `short_name` and `source_url` to canonical About
hospital records. The Contact explorer reads HIU and CIH details from the About
Page hospital-environments records; this avoids maintaining duplicate hospital
addresses, image URLs, maps, and names in Contact. It also exposes the new
fields in existing Content Manager layouts. It does not seed or publish content.

After the matching Strapi schema and frontend are deployed, run
`migration_scripts/225-migrate-contact-dual-hospital-location-explorer-local.js`
against local Strapi with `--write` (and optionally `--publish`). Production
content is updated separately with
`seed-production/seed-contact-dual-hospital-explorer.js`; do not run the
localhost-only migration against production.

### `027-about-hospital-map-embed-url.sql`

Adds the optional `maps_embed_url` field to canonical hospital records and
exposes it in the About hospital Content Manager component. For a reliable
facility pin, editors must copy each hospital's own Google Maps **Share → Embed
a map** iframe `src` into this field. Do not use a directions URL, invent
coordinates, or reuse one hospital's embed URL for the other. Until configured,
the frontend falls back to a name/address search, which may not identify the
exact campus pin unambiguously.

### Website Settings hospital map coordinates

The repeatable `website-setting.hospital-location` component is registered by
the Strapi schema and Strapi synchronizes its component/relation storage on
startup; no standalone SQL migration is needed. The Contact hospital explorer
reads its name, English display address, coordinates, exact embed URL,
click-through place URL, and optional localized search query from
`Website Settings → Hospital map locations`, keyed by
`HIU` or `CIH`. The local seed is
`migration_scripts/226-seed-website-setting-hospital-locations-local.js` and
must only target a local Strapi instance. After migration 031, this repeatable
component is the canonical source for facility names, addresses and map data;
do not reintroduce standalone address or coordinate fields.

`028-website-hospital-coordinate-precision.sql` widens the component
latitude/longitude columns to `numeric(10,7)`. Apply it after the CMS schema has
created `website-setting.hospital-location`; otherwise PostgreSQL's default
decimal scale would round GPS coordinates to two decimal places and move the
marker substantially.

`029-website-settings-hospital-locations-layout.sql` adds the repeatable
`hospital_locations` component to the saved Website Settings Content Manager
layout when a customized layout already exists. It does not seed location
content.

### `033-remove-hospital-map-zoom.sql`

Removes the redundant per-hospital `zoom` field from component storage and its
persisted Content Manager layout. Each canonical embed URL already defines its
zoom level; fallback maps use a fixed frontend default. Keep latitude and
longitude for fallback directions/maps, `maps_place_url` for the clickable
Google Maps destination, and `maps_search_query` for localized fallback search
when an embed URL is unavailable. Deploy the matching schema/frontend, then
apply this structural migration. After applying earlier migrations through 033,
apply the Treatments image-stack extension:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f migration-production/034-treatments-overview-secondary-hospital-image.sql
```

### `034-treatments-overview-secondary-hospital-image.sql`

Adds optional `secondary_image_url` and `secondary_image_alt` columns to the
Treatments Page editorial component storage. The existing `image` media
relation remains the first/HIU image and is not modified. After deploying the
updated Strapi schema and frontend, use
`seed-production/seed-treatments-overview-hospital-image.js` to populate only
the Overview's CIH image URL and alt text. The seed is dry-run by default and
preserves all unrelated sections and existing image data.

### `031-consolidate-website-hospital-locations.sql`

Consolidates address and map data into `Website Settings → Hospital map
locations`. Before running this structural migration in production, deploy the
matching Strapi schema/frontend and run
`seed-production/migrate-website-setting-hospital-locations.js --write
--publish` with the production safety flags. The content seed stores both
hospital display addresses in English, adds/updates CIH with its mapped
coordinates and coordinate-based Google Maps embed URL, and preserves HIU's
verified coordinates and Maps URLs. The CIH address is sourced from the
official hospital website and the pin is cross-checked against the mapped
hospital building. Review seed output before publishing.
Then run this SQL to drop the duplicated Address, primary/secondary map fields,
and remove their stale Content Manager layout entries. Run the content seed and
verify both locations before 031.

### Compact dual-hospital footer

The footer switcher consumes the existing published
`Website Settings → Hospital map locations` entries (`HIU` and `CIH`). This is
a frontend-only change: it adds no content fields, tables, or relations, so no
additional SQL migration is required. Verify that both entries have reviewed
names and addresses before rollout. Saved latitude/longitude are preferred for
precise Google Maps directions; if unavailable, the frontend uses the hospital
name and address. The redesigned footer removes the Google Maps iframe and
does not load Maps scripts.

### Dr. Cuong consultation hospital showcase

The `/our-team/dr-cuong` consultation CTA uses the existing About Page
`hospital-environments.hospitals` entries for facility photos and the existing
Website Settings `hospital_locations` entries for canonical names, English
addresses, and verified map links. The switcher is frontend-only and does not
add or alter database structure, so no new production SQL migration is needed.
Before rollout, confirm both HIU and CIH records and their approved exterior
images are present in the production About Page. The CMS content seed is
`seed-production/seed-about-us-hospital-environments.js` and must be reviewed
and run explicitly; it is not invoked by deployment or application startup.

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
