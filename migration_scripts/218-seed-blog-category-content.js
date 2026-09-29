#!/usr/bin/env node

/**
 * Explicit, idempotent seed for ten Website Settings blog categories and ten
 * sample blog posts. Never run this from Strapi bootstrap or Docker startup.
 *
 * Preview:
 *   STRAPI_URL=http://127.0.0.1:22345 STRAPI_API_TOKEN=... \
 *   node migration_scripts/218-seed-blog-category-content.js
 *
 * Write drafts:
 *   ... node migration_scripts/218-seed-blog-category-content.js --write
 *
 * Write and publish:
 *   ... node migration_scripts/218-seed-blog-category-content.js --write --publish
 */

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')

const categorySeeds = [
  ['Facial Rejuvenation', 'How to think about facial rejuvenation as a long-term surgical plan.'],
  ['Deep Plane Facelift', 'What a deep-plane facelift changes beneath the skin and why anatomy matters.'],
  ['Rhinoplasty', 'A practical guide to planning rhinoplasty around structure, breathing and balance.'],
  ['Breast Surgery', 'The key decisions patients should make before considering breast surgery.'],
  ['Body Contouring', 'How body-contouring procedures fit into a safe, staged recovery plan.'],
  ['Recovery & Aftercare', 'The milestones, warning signs and support that shape a confident recovery.'],
  ['Patient Safety', 'The clinical checks that should happen before any elective aesthetic procedure.'],
  ['Treatment Planning', 'Why an individualized consultation is more useful than a generic treatment list.'],
  ['Skin & Scars', 'How skin quality and scar behavior influence procedure planning and aftercare.'],
  ['Clinic Journal', 'A behind-the-scenes look at surgeon-led care at Dr. Maris Aesthetics.'],
]

const posts = categorySeeds.map(([category, lead]) => ({
  title: `${category}: a clinical guide for thoughtful planning`,
  slug: `dr-maris-guide-${category.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
  metaDescription: lead,
  category,
}))

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed (${response.status}): ${body?.error?.message || JSON.stringify(body)}`)
  return body
}

function unwrap(value) {
  const item = value?.attributes ? { id: value.id, documentId: value.documentId, ...value.attributes } : value
  return item?.data?.attributes ? { id: item.data.id, ...item.data.attributes } : item
}

function categoriesFrom(value) {
  const items = Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : []
  return items.map(unwrap).filter(Boolean)
}

async function getWebsiteSettings() {
  const response = await request('/api/website-setting?status=draft&populate[blog_categories][populate][icon]=true')
  const data = unwrap(response.data)
  if (!data) throw new Error('Website Settings were not found.')
  return data
}

async function getBlogBySlug(slug) {
  const response = await request(`/api/blogs?filters[slug][$eq]=${encodeURIComponent(slug)}&status=draft&pagination[pageSize]=1`)
  return unwrap(Array.isArray(response.data) ? response.data[0] : null)
}

async function publish(path) {
  // The public REST API does not expose the Content Manager
  // `/actions/publish` route to API tokens. Strapi 5 accepts the publication
  // status on the normal REST update endpoint instead.
  await request(path, { method: 'PUT', body: JSON.stringify({ data: {}, status: 'published' }) })
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required.')
  const settings = await getWebsiteSettings()
  const existing = categoriesFrom(settings.blog_categories)
  const byLabel = new Map(existing.map((item) => [String(item.label || '').trim().toLowerCase(), item]))
  const missing = categorySeeds.filter(([label]) => !byLabel.has(label.toLowerCase())).map(([label]) => ({ label }))
  const summary = { mode: WRITE ? 'write' : 'preview', publish: PUBLISH, categoriesToAdd: missing.map((item) => item.label), blogSlugs: posts.map((post) => post.slug) }

  if (!WRITE) {
    console.log(JSON.stringify(summary, null, 2))
    console.log('No records were changed. Re-run with --write to seed the taxonomy and posts.')
    return
  }

  if (missing.length) {
    const current = existing.map((item) => ({
      ...(item.id != null ? { id: item.id } : {}),
      ...(item.category_id ? { category_id: item.category_id } : {}),
      label: item.label,
      ...(item.icon ? { icon: item.icon.id || item.icon } : {}),
    }))
    await request('/api/website-setting', { method: 'PUT', body: JSON.stringify({ data: { blog_categories: [...current, ...missing] } }) })
    if (PUBLISH) await publish('/api/website-setting')
  }

  const refreshed = await getWebsiteSettings()
  const categories = categoriesFrom(refreshed.blog_categories)
  const categoryByLabel = new Map(categories.map((item) => [String(item.label || '').trim().toLowerCase(), item]))
  const withoutIds = categorySeeds.filter(([label]) => !categoryByLabel.get(label.toLowerCase())?.category_id)
  if (withoutIds.length) throw new Error(`Website Settings did not generate category IDs for: ${withoutIds.map(([label]) => label).join(', ')}. Restart the updated Strapi CMS, save Website Settings once, then rerun this script.`)

  const results = []
  for (const post of posts) {
    const category = categoryByLabel.get(post.category.toLowerCase())
    const data = { title: post.title, slug: post.slug, metaDescription: post.metaDescription, blog_category_id: category.category_id }
    const existingPost = await getBlogBySlug(post.slug)
    const record = existingPost?.documentId || existingPost?.id
    const endpoint = record ? `/api/blogs/${record}` : '/api/blogs'
    const saved = await request(endpoint, { method: record ? 'PUT' : 'POST', body: JSON.stringify({ data }) })
    const documentId = saved?.data?.documentId || saved?.data?.id || record
    if (PUBLISH && documentId) await publish(`/api/blogs/${documentId}`)
    results.push({ slug: post.slug, action: record ? 'updated' : 'created', category: post.category, categoryId: category.category_id })
  }
  console.log(JSON.stringify({ ...summary, categoriesReady: categories.length, posts: results }, null, 2))
}

main().catch((error) => { console.error(`[blog-category-seed] ${error.message}`); process.exitCode = 1 })
