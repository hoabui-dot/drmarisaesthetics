/*
 * Audits and safely fills missing SEO fields on published, sitemap-backed
 * content. Dry-run by default. Run with --apply to persist and publish only
 * the changed documents. Existing SEO values are never overwritten.
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
process.env.DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1'
process.env.DATABASE_PORT = process.env.DATABASE_PORT || process.env.POSTGRES_HOST_PORT || '15432'
process.env.DATABASE_NAME ||= process.env.POSTGRES_DB
process.env.DATABASE_USERNAME ||= process.env.POSTGRES_USER
process.env.DATABASE_PASSWORD ||= process.env.POSTGRES_PASSWORD
process.env.DATABASE_SSL ||= 'false'
process.env.DATABASE_SCHEMA ||= 'public'

const { createStrapi } = require('@strapi/strapi')
const { COLLECTION_ROUTES, STATIC_ROUTES } = require('../src/lib/sitemap')
const APPLY = process.argv.includes('--apply')
const MAX_META_TITLE = 60
const MAX_META_DESCRIPTION = 160
const PAGE_DESCRIPTION_FALLBACKS = {
  'facility-upgrade': 'Read the latest clinic update for patients and partners about the facility upgrade at International Dental Clinic SG.',
  customers: 'Explore patient stories, reviews and care experiences shared by patients of International Dental Clinic SG.',
  'services-listing': 'Khám phá các dịch vụ nha khoa và tìm hiểu những lựa chọn chăm sóc phù hợp với nhu cầu của bạn.',
}

const MODELS = [
  { uid: 'api::homepage.homepage', kind: 'single', title: ['metadata_title'], description: ['metadata_description'], image: ['metadata_image'], hero: true },
  { uid: 'api::about-page.about-page', kind: 'single', hero: true },
  { uid: 'api::contact-page.contact-page', kind: 'single', hero: true, dynamicZone: 'layout' },
  { uid: 'api::our-team.our-team', kind: 'single', hero: true },
  { uid: 'api::treatments-page.treatments-page', kind: 'single', hero: true },
  { uid: 'api::deep-plane-facelift-specialist.deep-plane-facelift-specialist', kind: 'single', legacySeo: true, hero: true },
  { uid: 'api::service.service', kind: 'collection', title: ['title'], description: ['metaDescription'], image: ['coverImage'] },
  { uid: 'api::blog.blog', kind: 'collection', title: ['title'], description: ['metaDescription'], image: ['coverImage'] },
  { uid: 'api::page.page', kind: 'collection', title: ['title'], description: ['description'], image: ['cover'] },
]

function nonEmpty(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined
}

function collectText(value, output = []) {
  if (!value) return output
  if (typeof value === 'string') {
    output.push(value)
  } else if (Array.isArray(value)) {
    for (const item of value) collectText(item, output)
  } else if (typeof value === 'object') {
    if (typeof value.text === 'string') output.push(value.text)
    if (value.children) collectText(value.children, output)
    if (value.content) collectText(value.content, output)
  }
  return output
}

function flattenText(value) {
  if (typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value)) {
    return require('cheerio').load(value).text().replace(/\s+/g, ' ').trim()
  }
  return collectText(value).join(' ').replace(/\s+/g, ' ').trim()
}

function limitedText(value, max) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const boundary = clean.slice(0, max).lastIndexOf(' ')
  return `${clean.slice(0, boundary > 0 ? boundary : max - 1).replace(/[,:;\s-]+$/, '')}…`
}

function firstValue(document, keys) {
  for (const key of keys || []) if (nonEmpty(document?.[key])) return document[key]
  return undefined
}

function sectionList(document) {
  if (Array.isArray(document?.sections)) return document.sections
  if (Array.isArray(document?.layout)) return document.layout
  return []
}

function getHero(document) {
  return sectionList(document).find((section) => /hero/i.test(section?.__component || '')) || null
}

function mediaId(media) {
  if (typeof media === 'number') return media
  if (media && typeof media === 'object') return media.id || media.documentId || null
  return null
}

function deriveDescription(document, model) {
  const hero = model.hero ? getHero(document) : null
  const explicit = firstValue(document, model.description)
    || firstValue(hero, ['editorial_lead', 'description', 'subtitle', 'paragraph_one'])
    || firstValue(document, ['description', 'metaDescription', 'metadata_description'])
  if (model.uid === 'api::page.page' && document.slug && PAGE_DESCRIPTION_FALLBACKS[document.slug]) {
    return PAGE_DESCRIPTION_FALLBACKS[document.slug]
  }
  const blocks = flattenText(document.contentBetterBlocks || document.content)
  if (nonEmpty(explicit) && (String(explicit).trim().length >= 80 || !blocks || blocks.length < 80)) {
    return limitedText(explicit, MAX_META_DESCRIPTION)
  }
  if (blocks) {
    const title = deriveTitle(document, model)
    const withoutRepeatedTitle = title && blocks.toLocaleLowerCase().startsWith(title.toLocaleLowerCase())
      ? blocks.slice(title.length).replace(/^[\s:|–—-]+/, '')
      : blocks
    const contentDescription = withoutRepeatedTitle || blocks
    if (contentDescription.length >= 45) return limitedText(contentDescription, MAX_META_DESCRIPTION)
  }
  if (nonEmpty(explicit)) return limitedText(explicit, MAX_META_DESCRIPTION)
  if (model.uid === 'api::page.page') {
    const title = deriveTitle(document, model)
    return limitedText(`Explore ${title} from Dr. Maris Aesthetics.`, MAX_META_DESCRIPTION)
  }
  return ''
}

function deriveTitle(document, model) {
  const hero = model.hero ? getHero(document) : null
  const source = firstValue(hero, ['title'])
    || firstValue(document, model.title)
    || firstValue(document, ['title', 'seo_title'])
  return nonEmpty(source) ? limitedText(source, MAX_META_TITLE) : ''
}

function deriveImage(document, model, seo) {
  const current = mediaId(seo?.meta_image)
  if (current) return null
  const direct = mediaId(firstValue(document, model.image))
  if (direct) return direct
  if (model.hero) {
    const hero = getHero(document)
    return mediaId(hero?.image) || mediaId(hero?.hero_image)
  }
  return null
}

function populateFor(model) {
  const populate = model.legacySeo ? {} : { seo: { populate: ['meta_image'] } }
  if (model.hero) populate[model.dynamicZone || 'sections'] = { populate: '*' }
  for (const key of model.image || []) populate[key] = true
  return populate
}

function documentTitle(document, model) {
  return deriveTitle(document, model) || document.slug || document.documentId || '(untitled)'
}

function fillMissingSeo(document, model) {
  const currentSeo = document.seo && typeof document.seo === 'object' ? document.seo : {}
  const data = {}
  const title = deriveTitle(document, model)
  const description = deriveDescription(document, model)
  const image = deriveImage(document, model, currentSeo)
  if (!nonEmpty(currentSeo.meta_title) && title) data.meta_title = title
  if (!nonEmpty(currentSeo.meta_description) && description) data.meta_description = description
  if (!mediaId(currentSeo.meta_image) && image) data.meta_image = image
  if (currentSeo.include_in_sitemap !== true) data.include_in_sitemap = true
  const componentData = {
    meta_title: currentSeo.meta_title,
    meta_description: currentSeo.meta_description,
    meta_image: mediaId(currentSeo.meta_image) || undefined,
    canonical_url: currentSeo.canonical_url,
    no_index: currentSeo.no_index,
    include_in_sitemap: currentSeo.include_in_sitemap,
    no_follow: currentSeo.no_follow,
    open_graph_title: currentSeo.open_graph_title,
    open_graph_description: currentSeo.open_graph_description,
    structured_data_enabled: currentSeo.structured_data_enabled,
    structured_data_json: currentSeo.structured_data_json,
    ...data,
  }
  for (const key of Object.keys(componentData)) if (componentData[key] === undefined) delete componentData[key]
  if (currentSeo.id) componentData.id = currentSeo.id
  return { data, componentData, title, description }
}

async function main() {
  const appDir = path.resolve(__dirname, '..')
  // An override lets this one-off script run against a clean TypeScript output
  // directory without loading obsolete schemas left in the ignored dist/ tree.
  const distDir = process.env.STRAPI_SCRIPT_DIST_DIR || path.join(appDir, 'dist')
  const app = createStrapi({ appDir, distDir })
  await app.load()
  let defaultLocale = app.config.get('plugin.i18n.config.defaultLocale') || process.env.STRAPI_DEFAULT_LOCALE || 'en'
  try {
    const locales = await app.plugin('i18n').service('locales').find()
    if (Array.isArray(locales) && locales.length && !locales.some((locale) => locale.code === defaultLocale)) defaultLocale = locales[0].code
  } catch {}
  const summary = { scanned: 0, changed: 0, discardedTaskDrafts: 0, skippedWithoutDescription: 0, missingSeoSchema: [], seoImageUnavailable: [], sitemapPolicy: null, changes: [] }

  try {
    if (APPLY) {
      const pages = app.documents('api::page.page')
      const taskDraft = await pages.findOne({
        documentId: 'news-1774333280752',
        locale: defaultLocale,
        status: 'draft',
        populate: { seo: true },
      }).catch(() => null)
      if (taskDraft && !taskDraft.slug && !taskDraft.title && taskDraft.seo?.meta_title === 'News & Blog Listing Page') {
        await pages.discardDraft({ documentId: taskDraft.documentId, locale: defaultLocale })
        summary.discardedTaskDrafts += 1
      }
    }

    for (const model of MODELS) {
      const documentService = app.documents(model.uid)
      let entries = []
      try {
        entries = model.kind === 'single'
          ? [await documentService.findFirst({ status: 'published', locale: defaultLocale, populate: populateFor(model) })].filter(Boolean)
          : await documentService.findMany({ status: 'published', locale: defaultLocale, populate: populateFor(model), pagination: { page: 1, pageSize: 500 } })
      } catch (error) {
        if (model.uid === 'api::contact-page.contact-page') {
          app.log.warn(`[seo-data] ${model.uid} unavailable: ${error.message}`)
          continue
        }
        throw error
      }

      for (const document of entries) {
        summary.scanned += 1
        if (model.legacySeo) {
          // This page has no shared Page SEO component; preserve its existing
          // schema and report that legacy fields are already populated.
          const missingTitle = !nonEmpty(document.seo_title)
          const missingDescription = !nonEmpty(document.seo_description)
          if (missingTitle || missingDescription) {
            const change = { uid: model.uid, documentId: document.documentId, title: documentTitle(document, model), fields: {} }
            if (missingTitle) change.fields.seo_title = deriveTitle(document, model)
            if (missingDescription) change.fields.seo_description = deriveDescription(document, model)
            if (!change.fields.seo_description) summary.skippedWithoutDescription += 1
            summary.changes.push(change)
            if (APPLY && change.fields.seo_description) {
              await app.db.query(model.uid).update({ where: { id: document.id }, data: change.fields })
              summary.changed += 1
            }
          }
          continue
        }

        if (!Object.hasOwn(app.contentTypes[model.uid].attributes, 'seo')) {
          summary.missingSeoSchema.push(model.uid)
          continue
        }

        const currentSeo = document.seo && typeof document.seo === 'object' ? document.seo : {}
        const { data, componentData, title, description } = fillMissingSeo(document, model)
        if (!mediaId(currentSeo.meta_image) && !data.meta_image) {
          summary.seoImageUnavailable.push({ uid: model.uid, title: documentTitle(document, model), reason: 'No current SEO image or hero/cover image is attached in Strapi.' })
        }
        if (!Object.keys(data).length) continue
        if (!nonEmpty(currentSeo.meta_description) && !description) summary.skippedWithoutDescription += 1

        const change = {
          uid: model.uid,
          documentId: document.documentId,
          locale: document.locale || defaultLocale,
          title: documentTitle(document, model),
          fields: data,
          imageSource: data.meta_image ? (model.image?.[0] || getHero(document)?.__component || 'hero media') : undefined,
        }
        summary.changes.push(change)
        if (!APPLY) continue

        if (model.uid === 'api::page.page') {
          // Page is localized and Draft & Publish enabled. When no draft exists,
          // Strapi 5 creates a new draft from only the localized fields supplied
          // to update(); copy this page's current fields so publishing metadata
          // cannot blank its title, slug, or body. Omit component IDs because
          // IDs belong to the published version, not the draft version.
          delete componentData.id
          const pageData = { seo: componentData }
          for (const field of ['title', 'slug', 'content', 'publishDate', 'description']) {
            if (document[field] !== undefined) pageData[field] = document[field]
          }
          if (document.cover !== undefined) pageData.cover = mediaId(document.cover) || null
          await documentService.update({
            documentId: document.documentId,
            locale: document.locale || defaultLocale,
            status: 'published',
            data: pageData,
          })
        } else {
          // The other audited records already have draft counterparts; the
          // schema-aware Query Engine updates only their exact SEO component.
          await app.db.query(model.uid).update({ where: { id: document.id }, data: { seo: componentData } })
        }
        summary.changed += 1

        const draft = await documentService.findOne({
          documentId: document.documentId,
          locale: document.locale || defaultLocale,
          status: 'draft',
          populate: populateFor(model),
        }).catch(() => null)
        if (draft && draft.id !== document.id) {
          const pending = fillMissingSeo(draft, model)
          if (Object.keys(pending.data).length) {
            await app.db.query(model.uid).update({ where: { id: draft.id }, data: { seo: pending.componentData } })
            summary.changed += 1
          }
        }
      }
    }

    const settingsUid = 'api::seo-manager-settings.seo-manager-settings'
    const settingsService = app.documents(settingsUid)
    const settings = await settingsService.findFirst({ status: 'published', locale: defaultLocale })
      || await settingsService.findFirst({ status: 'draft', locale: defaultLocale })
    if (settings) {
      const contentTypes = { ...(settings.sitemap_content_types || {}) }
      const staticRoutes = { ...(settings.sitemap_static_routes || {}) }
      for (const route of COLLECTION_ROUTES) contentTypes[route.uid] = true
      for (const route of STATIC_ROUTES) staticRoutes[route.id] = true
      const settingsChanged = settings.sitemap_enabled !== true
        || JSON.stringify(contentTypes) !== JSON.stringify(settings.sitemap_content_types || {})
        || JSON.stringify(staticRoutes) !== JSON.stringify(settings.sitemap_static_routes || {})
      summary.sitemapPolicy = {
        globalEnabled: true,
        contentTypes: Object.keys(contentTypes).length,
        staticRoutes: Object.keys(staticRoutes).length,
        changed: settingsChanged,
      }
      if (APPLY && settingsChanged) {
        await app.db.query(settingsUid).update({
          where: { id: settings.id },
          data: { sitemap_enabled: true, sitemap_content_types: contentTypes, sitemap_static_routes: staticRoutes },
        })
        summary.changed += 1
      }
    } else {
      // Missing policy config is interpreted as enabled by the sitemap domain
      // layer, so do not create a partially populated required SEO singleton.
      summary.sitemapPolicy = { effectiveDefault: 'all registered sources enabled', changed: false }
    }

    console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'dry-run', defaultLocale, ...summary }, null, 2))
  } finally {
    await app.destroy()
  }
}

main().catch((error) => {
  console.error(`[seo-data] ${error.message}`)
  process.exitCode = 1
})
