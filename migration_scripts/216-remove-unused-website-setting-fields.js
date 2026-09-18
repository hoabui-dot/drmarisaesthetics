#!/usr/bin/env node

/**
 * Clears Website Settings fields that have no frontend consumer before their
 * schema attributes are removed. This migration is intentionally limited to
 * the three audited fields and does not touch SEO, CTA, navigation, contact,
 * footer, or booking data.
 *
 * Preview: STRAPI_URL=... STRAPI_API_TOKEN=... node migration_scripts/216-remove-unused-website-setting-fields.js
 * Write:   ... node migration_scripts/216-remove-unused-website-setting-fields.js --write
 */

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const REMOVED_FIELDS = ['site_name_localized', 'favicon', 'website']

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const write = process.argv.includes('--write')
  const response = await request('/api/website-setting?status=draft')
  if (!response.data) throw new Error('Website settings were not found')

  const summary = { mode: write ? 'write' : 'preview', clearedFields: REMOVED_FIELDS }
  if (!write) {
    console.log(JSON.stringify(summary, null, 2))
    console.log('No records were changed. Re-run with --write to clear the unused values.')
    return
  }

  await request('/api/website-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { site_name_localized: null, favicon: null, website: null } }),
  })
  await request('/api/website-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {}, status: 'published' }),
  })
  console.log(JSON.stringify({ ...summary, updated: true }, null, 2))
}

main().catch((error) => {
  console.error(`[website-setting-cleanup] ${error.message}`)
  process.exitCode = 1
})
