#!/usr/bin/env node

/**
 * Seed the Services taxonomy and connect existing services to it.
 *
 * This migration is intentionally idempotent:
 * - categories are looked up by category_id before creation;
 * - existing services are matched by documentId and updated in place;
 * - no service is unpublished or deleted;
 * - the legacy `category` field is left untouched for backwards compatibility.
 *
 * Run after the CMS image containing the service-category schema is deployed:
 *   STRAPI_URL=https://admin.example.com STRAPI_API_TOKEN=... \
 *     node migration-production/001-seed-service-categories.cjs
 */

const STRAPI_URL = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.env.DRY_RUN === 'true'

if (!STRAPI_API_TOKEN) {
  console.error('STRAPI_API_TOKEN is required.')
  process.exit(1)
}

const categories = [
  { category_id: 'face-neck', label: 'Face & Neck' },
  { category_id: 'breast', label: 'Breast' },
  { category_id: 'body-contouring', label: 'Body Contouring' },
  { category_id: 'other', label: 'Other' },
]

const categoryForService = (service) => {
  const value = `${service.slug || ''} ${service.title || ''}`.toLocaleLowerCase()
  if (/buttock|bbl|gastric|lipo|body-contour|labiaplasty|tummy|abdominoplasty|arm-lift|thigh/.test(value)) return 'body-contouring'
  if (/breast|mastopexy|breast-augmentation/.test(value)) return 'breast'
  if (/rhinoplasty|blepharoplasty|facelift|face|neck|brow|eyelid|otoplasty|chin/.test(value)) return 'face-neck'
  return 'other'
}

async function request(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed (${response.status}): ${JSON.stringify(body)}`)
  }
  return body
}

const query = (params) => new URLSearchParams(params).toString()

async function main() {
  const existingCategories = await request(`/api/service-categories?${query({ 'pagination[pageSize]': '100', sort: 'category_id:asc' })}`)
  const categoryByKey = new Map((existingCategories.data || []).map((entry) => {
    const value = entry.attributes || entry
    return [value.category_id, entry]
  }))

  for (const definition of categories) {
    if (categoryByKey.has(definition.category_id)) continue
    console.log(`Creating service category: ${definition.label}`)
    if (DRY_RUN) continue
    const created = await request('/api/service-categories', {
      method: 'POST',
      body: JSON.stringify({ data: definition }),
    })
    categoryByKey.set(definition.category_id, created.data)
  }

  const servicesResponse = await request(`/api/services?${query({ 'pagination[pageSize]': '100', sort: 'title:asc', 'populate[categories]': 'true' })}`)
  const services = servicesResponse.data || []
  for (const entry of services) {
    const service = entry.attributes || entry
    const categoryKey = categoryForService(service)
    const category = categoryByKey.get(categoryKey)
    if (!category) throw new Error(`Missing seeded category: ${categoryKey}`)
    const categoryValue = category.attributes || category
    const categoryDocumentId = category.documentId || categoryValue.documentId
    if (!categoryDocumentId) throw new Error(`Category ${categoryKey} has no documentId.`)

    const currentCategories = Array.isArray(service.categories?.data)
      ? service.categories.data
      : Array.isArray(service.categories) ? service.categories : []
    const currentIds = currentCategories.map((item) => item.documentId || item.attributes?.documentId || item.id).filter(Boolean)
    if (currentIds.length === 1 && String(currentIds[0]) === String(categoryDocumentId)) {
      console.log(`Already assigned: ${service.title} → ${categoryValue.label}`)
      continue
    }

    console.log(`${DRY_RUN ? '[dry-run] ' : ''}Assigning: ${service.title} → ${categoryValue.label}`)
    if (!DRY_RUN) {
      await request(`/api/services/${entry.documentId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: { categories: { set: [categoryDocumentId] } } }),
      })
    }
  }

  console.log(`Completed service taxonomy migration for ${services.length} service(s).`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
