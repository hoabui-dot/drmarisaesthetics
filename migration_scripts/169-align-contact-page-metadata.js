#!/usr/bin/env node

/** Align legacy Contact Page single-type metadata with the Dr. Maris site. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

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
  const current = await request('/api/contact-page?status=draft')
  const data = current?.data
  if (!data) throw new Error('Contact Page single type is missing')
  const payload = {
    title: 'Contact Dr. Maris Aesthetics',
    description: 'Begin a private consultation with Dr. Maris Aesthetics in Ho Chi Minh City.',
  }
  if (!WRITE) {
    console.log(JSON.stringify(payload, null, 2))
    return
  }
  await request('/api/contact-page', { method: 'PUT', body: JSON.stringify({ data: payload }) })
  console.log('[contact-page] metadata aligned')
}

main().catch((error) => { console.error('[contact-page] failed:', error.message); process.exitCode = 1 })
