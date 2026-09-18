#!/usr/bin/env node

/** Set CMS-controlled click behavior for top-level navigation items. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const response = await api('/api/website-setting?status=draft&populate[header_navigation][populate][children]=true')
  const setting = response.data
  if (!setting) throw new Error('Website settings were not found.')
  const navigation = (setting.header_navigation || []).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    isExternal: item.isExternal === true,
    isClickable: item.href === '/our-team' ? false : true,
    children: (item.children || []).map((child) => ({
      id: child.id,
      label: child.label,
      href: child.href,
      isExternal: child.isExternal === true,
    })),
  }))

  await api('/api/website-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { header_navigation: navigation } }),
  })
  await api('/api/website-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {}, status: 'published' }),
  })
  console.log('Updated header navigation click flags: Our Team disabled, Services enabled.')
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`)
  process.exitCode = 1
})
