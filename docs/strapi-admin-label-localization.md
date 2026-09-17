# Strapi Admin EN/VI label localization

This feature localizes Strapi Admin presentation only. It does not enable Content i18n, add content locales, alter schema attributes, translate stored values, or affect the website/API payloads.

## How it works

- `strapi-cms/src/admin/app.tsx` exposes Vietnamese in Profile → Experience and registers the Vietnamese translation dictionary through Strapi's native `config.translations` API.
- `strapi-cms/src/admin/i18n/vi.json` maps Strapi Content Manager message IDs to Vietnamese labels. Content-type fields use `content-manager.content-types.<content-type-uid>.<field>`, and component fields use `content-manager.components.<component-uid>.<field>`.
- English remains Strapi's built-in Admin language and fallback.
- Run `cd strapi-cms && node scripts/check-admin-translations.cjs` after adding or renaming a schema field/component. It fails when schema fields or component categories lack Vietnamese labels.

Translation values are explicit, reviewed strings; schema identifiers are used only to construct Strapi's native message IDs. The script is a coverage check, not a runtime translation mechanism.

## Native limitations

The installed Content Manager localizes content-type display names and schema field labels using message IDs. Component category names are also passed through Strapi's translator. In the installed version, component display names shown by the component picker/cards and enum choice values are rendered from schema values without a corresponding native translation lookup. They are intentionally left unchanged rather than altering schema data or adding brittle DOM interception. This does not affect field labels or website content.

## Safety boundary

Do not enable the Content i18n plugin or add `pluginOptions.i18n.localized` for this feature. Do not migrate, duplicate, seed, or update CMS content. Future dictionary edits should change only `src/admin/i18n/vi.json` and Admin configuration when needed.
