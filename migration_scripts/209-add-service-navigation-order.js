#!/usr/bin/env node

/**
 * Add deterministic header-menu ordering for Services.
 *
 * Existing services receive their current alphabetical order only when the
 * new field is empty. Titles, slugs, content and publication state are not
 * changed. Editors can later change navigationOrder in Strapi.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${response.status} ${path}: ${JSON.stringify(body)}`)
  return body
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

  const response = await api('/api/services?pagination[pageSize]=100&fields[0]=title&fields[1]=slug&fields[2]=navigationOrder&sort[0]=title:asc')
  const services = response.data || []
  let updated = 0

  for (const [index, entry] of services.entries()) {
    const service = entry.attributes || entry
    if (Number.isInteger(service.navigationOrder) && service.navigationOrder > 0) continue

    const order = index + 1
    await api(`/api/services/${entry.documentId || entry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { navigationOrder: order } }),
    })
    updated += 1
    console.log(`[UPDATED] ${service.slug}: navigationOrder=${order}`)
  }

  console.log(JSON.stringify({ scanned: services.length, updated }, null, 2))
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`)
  process.exitCode = 1
})
