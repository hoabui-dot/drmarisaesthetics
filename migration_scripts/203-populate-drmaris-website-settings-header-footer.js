#!/usr/bin/env node

/**
 * One-time, idempotent Dr. Maris Website Settings migration.
 *
 * This intentionally does not copy the legacy Navigation/Footer records: the
 * audit found dental-brand content in those records. It fills only the new
 * Website Settings fields when they are empty and preserves all existing
 * Website Settings values.
 */
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN

if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

const headerNavigation = [
  { label: 'About Us', href: '/about-us', isExternal: false, children: [] },
  { label: 'Our Team', href: '/our-team', isExternal: false, children: [] },
  { label: 'Services', href: '/services', isExternal: false, children: [] },
  { label: 'Treatments', href: '/treatments', isExternal: false, children: [] },
  { label: 'Results', href: '/results', isExternal: false, children: [] },
  { label: 'Journal', href: '/news', isExternal: false, children: [] },
  { label: 'Contact', href: '/contact', isExternal: false, children: [] },
]

const footerLinkGroups = [
  {
    heading: 'EXPLORE',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Our Team', href: '/our-team' },
      { label: 'Services', href: '/services' },
      { label: 'Treatments', href: '/treatments' },
    ],
  },
  {
    heading: 'PATIENT JOURNEY',
    links: [
      { label: 'Patient Results', href: '/results' },
      { label: 'Patient Journal', href: '/news' },
      { label: 'Contact & Consultation', href: '/contact' },
      { label: 'Medical Disclaimer', href: '/medical-disclaimer' },
    ],
  },
]

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
  const data = {}
  const changed = []

  if (!Array.isArray(current.header_navigation) || current.header_navigation.length === 0) {
    data.header_navigation = headerNavigation
    changed.push('header_navigation')
  }
  if (!current.footer_description) {
    data.footer_description = 'A surgeon-led aesthetic practice providing personalized, hospital-based cosmetic surgery care in Ho Chi Minh City.'
    changed.push('footer_description')
  }
  if (!Array.isArray(current.footer_link_groups) || current.footer_link_groups.length === 0) {
    data.footer_link_groups = footerLinkGroups
    changed.push('footer_link_groups')
  }
  if (!current.footer_copyright_text) {
    data.footer_copyright_text = '© 2026 DR. MARIS AESTHETICS. ALL RIGHTS RESERVED.'
    changed.push('footer_copyright_text')
  }
  if (!current.footer_tagline) {
    data.footer_tagline = 'Surgeon-led. Hospital-based. Individually planned.'
    changed.push('footer_tagline')
  }

  if (changed.length > 0) {
    await request('/api/website-setting', 'PUT', { data })
  }

  console.log(JSON.stringify({ updated: changed.length > 0, fields: changed }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
