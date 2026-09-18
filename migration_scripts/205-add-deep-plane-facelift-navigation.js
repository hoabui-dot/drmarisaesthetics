#!/usr/bin/env node

/**
 * Idempotent one-time migration for the Dr. Maris header navigation.
 * This updates only Website Settings and preserves every existing menu item.
 */
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN

if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(endpoint, method = 'GET', body) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${endpoint}: ${response.status}`)
  return payload
}

async function main() {
  const response = await request('/api/website-setting')
  const current = response.data || {}
  const navigation = Array.isArray(current.header_navigation)
    ? current.header_navigation.map((item) => ({
        label: item.label,
        href: item.href,
        isExternal: Boolean(item.isExternal ?? item.is_external),
        children: Array.isArray(item.children)
          ? item.children.map((child) => ({
              label: child.label,
              href: child.href,
              isExternal: Boolean(child.isExternal ?? child.is_external),
            }))
          : [],
      }))
    : []

  const item = navigation.find((entry) => entry.href === '/deep-plane-facelift-specialist')
  const needsUpdate = !item || item.label !== 'Deep Plane'
  if (needsUpdate) {
    if (item) {
      item.label = 'Deep Plane'
    } else {
      navigation.push({
        label: 'Deep Plane',
        href: '/deep-plane-facelift-specialist',
        isExternal: false,
        children: [],
      })
    }
    const target = navigation.find((entry) => entry.href === '/deep-plane-facelift-specialist')
    if (target) target.label = 'Deep Plane'
    await request('/api/website-setting', 'PUT', { data: { header_navigation: navigation } })
  }

  console.log(JSON.stringify({ updated: needsUpdate, totalItems: navigation.length }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
