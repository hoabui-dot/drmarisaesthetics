#!/usr/bin/env node

/**
 * Move the two existing doctor-facing routes into the Our Team dropdown.
 *
 * This intentionally changes only Website Settings navigation. It does not
 * create, update, publish, or delete any Doctor collection records.
 *
 * Preview: STRAPI_URL=... STRAPI_API_TOKEN=... node migration_scripts/215-set-our-team-doctor-navigation.js
 * Write:   ... node migration_scripts/215-set-our-team-doctor-navigation.js --write
 */

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function normalizeNavigation(items) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && item.href !== '/deep-plane-facelift-specialist')
    .map((item) => ({
      label: item.label,
      href: item.href,
      isExternal: item.isExternal === true,
      isClickable: item.href === '/our-team' ? false : item.isClickable !== false,
      children: item.href === '/our-team'
        ? [
            { label: 'Dr. Huy', href: '/our-team', isExternal: false },
            { label: 'Dr. Cuong', href: '/deep-plane-facelift-specialist', isExternal: false },
          ]
        : (Array.isArray(item.children) ? item.children.map((child) => ({
            label: child.label,
            href: child.href,
            isExternal: child.isExternal === true,
          })) : []),
    }))
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

  const response = await request('/api/website-setting?status=draft&populate[header_navigation][populate][children]=true')
  const current = response.data
  if (!current) throw new Error('Website settings were not found')

  const navigation = normalizeNavigation(current.header_navigation)
  const ourTeam = navigation.find((item) => item.href === '/our-team')
  if (!ourTeam) throw new Error('Our Team navigation item was not found')

  const summary = {
    mode: process.argv.includes('--write') ? 'write' : 'preview',
    removedTopLevel: '/deep-plane-facelift-specialist',
    ourTeamChildren: ourTeam.children,
    navigationItems: navigation.map((item) => item.label),
  }

  if (!process.argv.includes('--write')) {
    console.log(JSON.stringify(summary, null, 2))
    console.log('No records were changed. Re-run with --write to update Website Settings.')
    return
  }

  await request('/api/website-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { header_navigation: navigation } }),
  })
  await request('/api/website-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {}, status: 'published' }),
  })

  console.log(JSON.stringify({ ...summary, updated: true }, null, 2))
}

main().catch((error) => {
  console.error(`[our-team-navigation] ${error.message}`)
  process.exitCode = 1
})
