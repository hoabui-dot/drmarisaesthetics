# Production content seed scripts

This folder contains explicit, reviewed scripts for writing production CMS
content. These scripts are never called by Docker builds, Strapi bootstrap,
application startup, or schema migrations.

## About Us hospital environments

Script: `seed-about-us-hospital-environments.js`

The script inserts or replaces the `about.hospital-environments` dynamic-zone
section immediately after `about.assessment` (OUR APPROACH), while preserving
all other About Page sections. It writes the draft and publishes it only when
both `--write` and `--publish` are supplied.

### Required production review/configuration

The repository intentionally does not contain production URLs, API tokens, or
verified Maps links. Before a future production run, the operator/AI doing that
deployment must:

1. Obtain the correct HTTPS Strapi production base URL and a least-privilege
   API token from the authorized operator. Supply them only as environment
   variables; never commit secrets or paste them into this README.
2. Verify hospital names, current addresses, public wording, image rights,
   image attribution, and the clinic/hospital relationship disclaimer.
3. Fill `PRODUCTION_HOSPITAL_DIRECTIONS.CIH` and `.HIU` in the script with
   verified HTTPS Google Maps share/directions URLs pointing to the intended
   entrance/campus. They are intentionally blank in the checked-in file. Do
   not guess a destination from the display address.
4. Review the complete dry-run output against the production About Page and
   confirm the schema including `maps_directions_url` is deployed.

### Safe execution

Dry run (read-only; use the actual authorized production values locally):

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
node seed-production/seed-about-us-hospital-environments.js
```

Only after the content and links have been approved, publish explicitly:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
ALLOW_PRODUCTION_WRITE=YES \
PRODUCTION_CONTENT_REVIEWED=YES \
node seed-production/seed-about-us-hospital-environments.js --write --publish
```

The script rejects HTTP targets, missing credentials, missing directions URLs,
unreviewed content, and writes without both explicit flags. It validates Maps
URLs against Google Maps HTTPS hosts and verifies that exactly two hospital
entries and both directions URLs were saved after publishing.

## Contact dual-hospital location explorer

Script: `seed-contact-dual-hospital-explorer.js`

The Contact section uses the hospital records already maintained in the About
Page `about.hospital-environments` section as its single source of truth. This
seed updates the verified HIU/CIH names, short names, addresses, official/source
URLs, and directions links there; it updates the Contact `contact.map-section`
heading/copy and moves that section above FAQ if necessary. Existing hospital
images and all unrelated About/Contact blocks are preserved. It does not create
or invent hospital imagery, coordinates, clinical claims, or map pins. Existing
`maps_embed_url` values are preserved. For an exact marker, an authorized editor
must obtain each facility's own Google Maps **Share → Embed a map** iframe `src`
and enter it in the corresponding About Page hospital record; never reuse a
map URL or guess coordinates. The frontend uses this exact embed when present,
and otherwise falls back to a facility name/address search that may be
ambiguous. A production write is blocked until both distinct embed URLs are
present, and the dry-run output reports them for review.

The supplied official references are:

- HIU: `https://hiuhospital.com/lien-he`
- CIH: `https://cih.com.vn/`
- CIH exterior image reference/license: `https://commons.wikimedia.org/wiki/File:City_International_Hospital_Vietnam.jpg`

Before a production write, verify the current address, image asset/rights, and
official wording against those sources and check that both hospital records
already have approved exterior images in the CMS. The script generates each
Google Maps directions URL as
`https://www.google.com/maps/dir/?api=1&destination=<encoded-address>`; it does
not assume coordinates or reuse one hospital's map for the other.

Production host and token are intentionally not stored in this repository.
The future operator/AI must receive the authorized HTTPS `STRAPI_URL` and a
least-privilege `STRAPI_API_TOKEN` from the production owner and pass them only
through the environment. Unknown production values remain blank; do not guess
or commit them.

Dry run:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
node seed-production/seed-contact-dual-hospital-explorer.js
```

After reviewing the target, addresses, images, and full dry-run output, write
and publish explicitly:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
ALLOW_PRODUCTION_WRITE=YES \
PRODUCTION_CONTENT_REVIEWED=YES \
node seed-production/seed-contact-dual-hospital-explorer.js --write --publish
```

The script requires HTTPS, both write-approval flags, `--write`, and
`--publish`. It verifies the published About records, generated directions
links, Contact copy, and placement before FAQ. Take a database backup before
writing; recover content from the CMS/database backup if editorial values need
to be rolled back.

## Consolidate Website Settings hospital locations

Script: `migrate-website-setting-hospital-locations.js`

This content migration normalizes the HIU display address to English and adds
or updates CIH under `hospital_locations`. It preserves HIU's verified
coordinates and Maps URLs, and writes a Google-generated address-specific CIH
embed query using its verified street address, which resolves to the hospital
building and its place preview. CIH's street address is confirmed on
[the official CIH website](https://cih.com.vn/).
Deploy the updated Strapi schema first so the component accepts map fields.

The compact dual-hospital footer reads these same two Website Settings entries;
it does not use a separate footer address seed or duplicate hospital fields.
The script refuses to write if the existing HIU record has no reviewed name or
address, and post-write verification confirms both English display addresses
plus preservation of HIU coordinates and its verified place URL.
The HIU record receives a Google embed URL generated from the verified
hospital CID `16010722763691272719` and the exact facility coordinates
`10.8424391,106.7115029`. This disambiguates the hospital from Hong Bang
International University. Its direct `maps_place_url` is restored as the
hospital's place page rather than a directions URL. A Vietnamese
`maps_search_query` remains as a fallback, while the frontend continues to
display the English `address`. CIH's embed is generated from the hospital name
and the verified Vietnamese street address; a manually assembled Place ID
protobuf previously resolved incorrectly. The CIH pin resolves to
`10.7410166,106.609125`. Apply
`migration-production/032-website-hospital-map-search-query.sql` before running
this content seed. Review the CIH map preview before writing.
Review/preserve the production HIU address and map coordinates; do not replace
them with local values. Review the CIH map URL and coordinates in the dry run
before writing.

Dry run:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
node seed-production/migrate-website-setting-hospital-locations.js
```

Write and publish only after verifying the output and backing up production:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
ALLOW_PRODUCTION_WRITE=YES \
PRODUCTION_CONTENT_REVIEWED=YES \
node seed-production/migrate-website-setting-hospital-locations.js --write --publish
```

Verify both HIU and CIH in published Website Settings before applying
`migration-production/031-consolidate-website-hospital-locations.sql`, which
then removes the old `address`, map coordinates, and secondary-location fields.
The script is intentionally excluded from build/startup paths.

## Dr. Cuong consultation hospital showcase

The left panel in `/our-team/dr-cuong` now reuses the two existing hospital
chapters in About Page for exterior images, and `Website Settings → Hospital
map locations` for the canonical English names, addresses, and verified place
links. No new content type or field is introduced. The consultation form and
its submission flow are unchanged.

Before production rollout, ensure the About Page hospital-environments
section contains exactly one HIU and one CIH record with approved exterior
image URLs/alt text. The existing `seed-about-us-hospital-environments.js`
content seed can create/update those records; review image rights and the full
dry-run output, and supply verified Google Maps directions links as described
in that script's section above. The HIU display address in the seed is aligned
with Website Settings. Apply structural migrations 026–031 only if they have
not already been applied for the existing hospital section/Website Settings
schema; this showcase itself requires no additional SQL migration.

## Treatments Overview hospital image stack

`seed-treatments-overview-hospital-image.js` adds a second image to the
existing `section_key=overview` entry on Treatments Page. The current primary
CMS media image is preserved as image one (HIU); the seed sets only the new
`secondary_image_url` and `secondary_image_alt` fields for image two (CIH).
It preserves every other section and refuses to write if the Overview or its
primary image is missing.

The second image is the direct Wikimedia Commons file
`https://upload.wikimedia.org/wikipedia/commons/8/8e/City_International_Hospital_Vietnam.jpg`,
not the Commons HTML page. The file page identifies City International
Hospital and dedicates the work under CC0 1.0. Keep the image source/license
noted in editorial records if the asset is later downloaded or replaced.

Apply `migration-production/034-treatments-overview-secondary-hospital-image.sql`
after backing up production and deploying the matching schema. Then inspect
the dry-run output:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
node seed-production/seed-treatments-overview-hospital-image.js
```

Only after review, run the explicit write/publish operation:

```sh
STRAPI_URL="<verified-production-strapi-url>" \
STRAPI_API_TOKEN="<scoped-token>" \
ALLOW_PRODUCTION_WRITE=YES \
TREATMENTS_IMAGE_REVIEWED=YES \
node seed-production/seed-treatments-overview-hospital-image.js --write --publish
```

The script verifies the published values and does not run during Docker build,
container startup, or Strapi bootstrap.

## General rules for future production seeds

- Keep production credentials and environment-specific URLs out of source
  control. Leave unknown values unset and explain where an authorized operator
  must supply them.
- Default to dry-run; require an explicit write flag and verify the result via
  the CMS API.
- Preserve unrelated records and sections. Never replace an entire content
  document from a partial seed payload.
- Do not invent addresses, coordinates, Maps links, image rights, or clinical
  claims. Use blank required values and fail closed until verified.
- Keep structural database changes in `migration-production/`; keep explicit
  content writes here. Never seed business content from a Dockerfile or
  Strapi bootstrap.
- Document the target content type, changed fields, required permissions,
  dry-run command, write command, rollback/recovery considerations, and
  post-write verification in this README.
