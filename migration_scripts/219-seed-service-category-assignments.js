#!/usr/bin/env node

/**
 * Explicit, idempotent seed for Website Settings service categories and the
 * existing Service records. Never run this from Strapi bootstrap or Docker.
 *
 * Preview:
 *   STRAPI_URL=http://127.0.0.1:22345 STRAPI_API_TOKEN=... \
 *   node migration_scripts/219-seed-service-category-assignments.js
 *
 * Write and publish:
 *   ... node migration_scripts/219-seed-service-category-assignments.js --write --publish
 */

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')

const categorySeeds = [
  'Facial Rejuvenation',
  'Eyelid Surgery',
  'Breast Surgery',
  'Body Contouring',
  'Weight & Metabolic Surgery',
  'Gender-Affirming Surgery',
  'Intimate Surgery',
  'Rhinoplasty',
]

const assignments = {
  blepharoplasty: 'Eyelid Surgery',
  'breast-augmentation': 'Breast Surgery',
  'buttock-augmentation': 'Body Contouring',
  facelift: 'Facial Rejuvenation',
  'gastric-sleeve': 'Weight & Metabolic Surgery',
  'gender-affirming-surgery': 'Gender-Affirming Surgery',
  labiaplasty: 'Intimate Surgery',
  liposuction: 'Body Contouring',
  rhinoplasty: 'Rhinoplasty',
}

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

function list(value) {
  const items = Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : []
  return items.map(unwrap).filter(Boolean)
}

async function getSettings() {
  const response = await request('/api/website-setting?status=draft&populate[service_categories][populate][icon]=true')
  const data = unwrap(response.data)
  if (!data) throw new Error('Website Settings were not found.')
  return data
}

async function getServices() {
  const response = await request('/api/services?status=draft&fields[0]=title&fields[1]=slug&fields[2]=service_category_id&pagination[pageSize]=100&sort=title:asc')
  return list(response.data)
}

async function publish(path) {
  await request(path, { method: 'PUT', body: JSON.stringify({ data: {}, status: 'published' }) })
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required.')

  const settings = await getSettings()
  const currentCategories = list(settings.service_categories)
  const byLabel = new Map(currentCategories.map((item) => [String(item.label || '').trim().toLowerCase(), item]))
  const missing = categorySeeds.filter((label) => !byLabel.has(label.toLowerCase())).map((label) => ({ label }))
  const services = await getServices()
  const unrecognised = services.filter((service) => !assignments[service.slug])
  const summary = {
    mode: WRITE ? 'write' : 'preview',
    publish: PUBLISH,
    categoriesToAdd: missing.map((item) => item.label),
    services: services.map((service) => ({ slug: service.slug, category: assignments[service.slug] || null })),
    servicesWithoutMapping: unrecognised.map((service) => service.slug),
  }

  if (!WRITE) {
    console.log(JSON.stringify(summary, null, 2))
    console.log('No records were changed. Re-run with --write to seed service categories and assignments.')
    return
  }

  if (missing.length) {
    const current = currentCategories.map((item) => ({
      ...(item.id != null ? { id: item.id } : {}),
      ...(item.category_id ? { category_id: item.category_id } : {}),
      label: item.label,
      ...(item.icon ? { icon: item.icon.id || item.icon } : {}),
    }))
    await request('/api/website-setting', {
      method: 'PUT',
      body: JSON.stringify({ data: { service_categories: [...current, ...missing] } }),
    })
    if (PUBLISH) await publish('/api/website-setting')
  }

  const refreshed = await getSettings()
  const categories = list(refreshed.service_categories)
  const categoryByLabel = new Map(categories.map((item) => [String(item.label || '').trim().toLowerCase(), item]))
  const missingIds = categorySeeds.filter((label) => !categoryByLabel.get(label.toLowerCase())?.category_id)
  if (missingIds.length) throw new Error(`Website Settings did not generate category IDs for: ${missingIds.join(', ')}. Restart the updated Strapi CMS, save Website Settings once, then rerun this script.`)

  const results = []
  for (const service of services) {
    const categoryLabel = assignments[service.slug]
    if (!categoryLabel) continue
    const category = categoryByLabel.get(categoryLabel.toLowerCase())
    const record = service.documentId || service.id
    const saved = await request(`/api/services/${record}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { service_category_id: category.category_id }, ...(PUBLISH ? { status: 'published' } : {}) }),
    })
    results.push({ slug: service.slug, category: categoryLabel, categoryId: category.category_id, documentId: saved?.data?.documentId || record })
  }

  console.log(JSON.stringify({ ...summary, categoriesReady: categories.length, assignments: results }, null, 2))
}

main().catch((error) => { console.error(`[service-category-seed] ${error.message}`); process.exitCode = 1 })

