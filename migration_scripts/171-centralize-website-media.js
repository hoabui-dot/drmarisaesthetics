#!/usr/bin/env node

/** Move shared brand media to Website Settings and remove duplicate ownership. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, { ...options, headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  const payload = { logo: 401, favicon: 401, default_open_graph_image: 404 }
  if (!WRITE) return console.log(JSON.stringify({ endpoint: `${BASE}/api/website-setting`, payload }, null, 2))
  await request('/api/website-setting', { method: 'PUT', body: JSON.stringify({ data: payload }) })
  const verify = await request('/api/website-setting?status=published&populate=*')
  const data = verify.data || {}
  if (!data.logo || !data.favicon || !data.default_open_graph_image) throw new Error('Website Settings media verification failed')
  console.log('[website-media] logo, favicon and default OG image centralized in Website Settings')
}

main().catch((error) => { console.error('[website-media] failed:', error.message); process.exitCode = 1 })
