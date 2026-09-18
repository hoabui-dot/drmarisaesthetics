#!/usr/bin/env node

/**
 * Add the independent Service → Header Menu Label value without changing
 * service titles, slugs, content, or publication state.
 *
 * Run with:
 *   STRAPI_URL=http://127.0.0.1:22345 STRAPI_API_TOKEN=... \
 *   node migration_scripts/207-add-service-navigation-label.js
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
  const response = await api('/api/services?pagination[pageSize]=100&fields[0]=title&fields[1]=slug&fields[2]=navigationLabel')
  const services = response.data || []
  let updated = 0

  for (const entry of services) {
    const service = entry.attributes || entry
    if (service.navigationLabel || !service.title) continue

    await api(`/api/services/${entry.documentId || entry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { navigationLabel: service.title } }),
    })
    updated += 1
    console.log(`[UPDATED] ${service.slug}: ${service.title}`)
  }

  console.log(JSON.stringify({ scanned: services.length, updated }, null, 2))
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`)
  process.exitCode = 1
})
