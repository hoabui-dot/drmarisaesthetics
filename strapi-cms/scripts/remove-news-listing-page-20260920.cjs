/*
 * Remove only the obsolete generic Page document with slug `news-listing`.
 * Dry-run is the default. Applying requires an exact confirmation value.
 */
const path = require('node:path')
const { createStrapi } = require('@strapi/strapi')

const UID = 'api::page.page'
const TARGET_SLUG = 'news-listing'
const APPLY = process.argv.includes('--apply')
const CONFIRMATION = 'remove-news-listing-page-20260920'

async function findTargets(app) {
  let locales = []
  try {
    locales = (await app.plugin('i18n').service('locales').find()).map(({ code }) => code).filter(Boolean)
  } catch {}
  if (!locales.length) locales = [app.config.get('plugin.i18n.config.defaultLocale') || 'en']

  const found = new Map()
  for (const locale of locales) {
    for (const status of ['draft', 'published']) {
      const entries = await app.documents(UID).findMany({
        status,
        locale,
        filters: { slug: { $eq: TARGET_SLUG } },
        fields: ['slug', 'title', 'locale', 'documentId'],
        pagination: { page: 1, pageSize: 100 },
      })
      for (const entry of entries || []) {
        const key = `${entry.documentId}:${locale}`
        const record = found.get(key) || { documentId: entry.documentId, locale, slug: entry.slug, title: entry.title, statuses: [] }
        if (!record.statuses.includes(status)) record.statuses.push(status)
        found.set(key, record)
      }
    }
  }
  return [...found.values()]
}

async function main() {
  const appDir = path.resolve(__dirname, '..')
  const app = createStrapi({ appDir, distDir: path.join(appDir, 'dist') })
  await app.load()
  try {
    const targets = await findTargets(app)
    console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'dry-run', uid: UID, requestedSlug: TARGET_SLUG, matches: targets.map(({ slug, title, locale, statuses }) => ({ slug, title, locale, statuses })) }, null, 2))
    if (!APPLY) {
      console.log(`Dry run only. Apply requires --apply and NEWS_LISTING_DELETE_CONFIRM=${CONFIRMATION}.`)
      return
    }
    if (process.env.NEWS_LISTING_DELETE_CONFIRM !== CONFIRMATION) {
      throw new Error(`Deletion refused. Set NEWS_LISTING_DELETE_CONFIRM=${CONFIRMATION} after reviewing the dry run.`)
    }
    for (const target of targets) {
      await app.documents(UID).delete({ documentId: target.documentId, locale: target.locale })
      app.log.info(`[obsolete-page] Deleted ${UID} slug=${TARGET_SLUG} locale=${target.locale}`)
    }
    const remaining = await findTargets(app)
    if (remaining.length) throw new Error(`Deletion verification failed: ${remaining.length} targeted document(s) remain.`)
    console.log(`Removed ${targets.length} targeted document(s); verified no ${TARGET_SLUG} documents remain.`)
  } finally {
    await app.destroy()
  }
}

main().catch((error) => {
  console.error(`[obsolete-page] ${error.message}`)
  process.exitCode = 1
})
