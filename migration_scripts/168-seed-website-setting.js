#!/usr/bin/env node

/** Seed the reusable Dr. Maris website settings single type. Safe to rerun. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')

const settings = {
  site_name: 'DR. MARIS AESTHETICS',
  site_name_localized: 'DR. MARIS AESTHETICS',
  address: 'City International Hospital, Ho Chi Minh City, Vietnam',
  phone_primary: '+84 28 1234 5678',
  email: 'concierge@drmarisaesthetics.com',
  opening_hours: 'Monday–Saturday · 08:00–17:00',
  website: 'https://drmarisaesthetics.com',
  map_latitude: 10.8015,
  map_longitude: 106.6928,
  map_zoom: 16,
  map_url: 'https://maps.google.com/?q=City+International+Hospital+Ho+Chi+Minh+City',
  contact_methods: [
    { type: 'phone', label: 'Call our team', href: 'tel:+842812345678', color: '#173868', order: 1, is_active: true },
    { type: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/842812345678', color: '#25D366', order: 2, is_active: true },
    { type: 'email', label: 'Email', href: 'mailto:concierge@drmarisaesthetics.com', color: '#173868', order: 3, is_active: true },
  ],
  social_links: [],
}

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  if (!WRITE) {
    console.log(JSON.stringify({ endpoint: `${BASE}/api/website-setting`, payload: settings }, null, 2))
    return
  }
  const result = await request('/api/website-setting', { method: 'PUT', body: JSON.stringify({ data: settings }) })
  if (PUBLISH && result?.data?.documentId) {
    try {
      await request(`/api/website-setting/${result.data.documentId}/actions/publish`, { method: 'POST', body: JSON.stringify({}) })
    } catch (error) {
      // Strapi single types can be published as part of the PUT lifecycle in
      // some v5 configurations. Confirm the published representation before
      // treating an unsupported action route as a migration failure.
      const published = await request('/api/website-setting?status=published&fields[0]=documentId')
      if (!published?.data?.documentId) throw error
      console.warn('[website-settings] publish action unavailable; published single type already exists')
    }
  }
  console.log('[website-settings] seeded', result?.data?.documentId || '')
}

main().catch((error) => { console.error('[website-settings] failed:', error.message); process.exitCode = 1 })
