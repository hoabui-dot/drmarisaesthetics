/*
 * Remove only the three obsolete generic Page documents requested for cleanup.
 * Dry-run is the default. Apply requires both --apply and an exact confirmation
 * environment value so this cannot accidentally delete other CMS content.
 */
const path = require('node:path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

process.env.PUBLIC_URL ||= process.env.STRAPI_PUBLIC_URL
process.env.HOST ||= '127.0.0.1'
process.env.PORT ||= '22345'
process.env.ADMIN_JWT_SECRET ||= process.env.STRAPI_ADMIN_JWT_SECRET
process.env.APP_KEYS ||= process.env.STRAPI_APP_KEYS
process.env.API_TOKEN_SALT ||= process.env.STRAPI_API_TOKEN_SALT
process.env.TRANSFER_TOKEN_SALT ||= process.env.STRAPI_TRANSFER_TOKEN_SALT
process.env.JWT_SECRET ||= process.env.STRAPI_JWT_SECRET
process.env.DATABASE_HOST ||= '127.0.0.1'
process.env.DATABASE_PORT ||= process.env.POSTGRES_HOST_PORT || '15432'
process.env.DATABASE_NAME ||= process.env.POSTGRES_DB
process.env.DATABASE_USERNAME ||= process.env.POSTGRES_USER
process.env.DATABASE_PASSWORD ||= process.env.POSTGRES_PASSWORD
process.env.DATABASE_SSL ||= 'false'
process.env.DATABASE_SCHEMA ||= 'public'

const { createStrapi } = require('@strapi/strapi')
const TARGET_SLUGS = ['facility-upgrade', 'services-listing', 'customers']
const APPLY = process.argv.includes('--apply')
const CONFIRMATION = 'remove-obsolete-pages-20260920'
const UID = 'api::page.page'

async function findTargets(app) {
  let locales = []
  try {
    locales = (await app.plugin('i18n').service('locales').find()).map(({ code }) => code).filter(Boolean)
  } catch {}
  if (!locales.length) locales = [app.config.get('plugin.i18n.config.defaultLocale') || 'en']

  const docs = app.documents(UID)
  const found = new Map()
  for (const locale of locales) {
    for (const status of ['draft', 'published']) {
      const entries = await docs.findMany({
        status,
        locale,
        filters: { slug: { $in: TARGET_SLUGS } },
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
    console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'dry-run', uid: UID, requestedSlugs: TARGET_SLUGS, matches: targets.map(({ slug, title, locale, statuses }) => ({ slug, title, locale, statuses })) }, null, 2))

    if (!APPLY) {
      console.log('Dry run only; no Strapi data was changed. Pass --apply and SITEMAP_DELETE_CONFIRM=remove-obsolete-pages-20260920 to delete these exact slugs.')
      return
    }
    if (process.env.SITEMAP_DELETE_CONFIRM !== CONFIRMATION) {
      throw new Error(`Deletion refused. Set SITEMAP_DELETE_CONFIRM=${CONFIRMATION} after reviewing the dry-run output.`)
    }

    for (const target of targets) {
      await app.documents(UID).delete({ documentId: target.documentId, locale: target.locale })
      app.log.info(`[obsolete-pages] Deleted api::page.page slug=${target.slug} locale=${target.locale}`)
    }

    const remaining = await findTargets(app)
    if (remaining.length) throw new Error(`Deletion verification failed: ${remaining.length} targeted document(s) remain.`)
    console.log(`Removed ${targets.length} obsolete Page document(s); verified no target slugs remain.`)
  } finally {
    await app.destroy()
  }
}

main().catch((error) => {
  console.error(`[obsolete-pages] ${error.message}`)
  process.exitCode = 1
})
