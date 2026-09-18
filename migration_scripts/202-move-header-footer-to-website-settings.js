#!/usr/bin/env node

/**
 * One-time, idempotent migration. Dry-run by default.
 *
 * Moves the active navigation/footer content into Website Settings and copies
 * footer social links into website-setting.social_links. It never deletes
 * source records; schema cleanup is handled by the Strapi schema change after
 * the operator verifies the dry-run report.
 */
const fs = require('node:fs/promises')
const path = require('node:path')

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(endpoint, method = 'GET', body) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${endpoint}: ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

function navItem(item) {
  return {
    label: item.label,
    href: item.href,
    isExternal: Boolean(item.isExternal ?? item.is_external),
    children: (item.children || []).map((child) => ({
      label: child.label,
      href: child.href,
      isExternal: Boolean(child.isExternal ?? child.is_external),
    })),
  }
}

function linkGroup(group) {
  return {
    heading: group.heading,
    links: (group.links || []).map((link) => ({ label: link.label, href: link.href })),
  }
}

async function main() {
  const [navigationResponse, footerResponse, settingsResponse] = await Promise.all([
    request('/api/navigation?populate[navigation][populate][children]=true'),
    request('/api/footer?populate[link_groups][populate][links]=true&populate[social_links]=true'),
    request('/api/website-setting?populate[social_links]=true'),
  ])

  const navigation = navigationResponse.data || {}
  const footer = footerResponse.data || {}
  const settings = settingsResponse.data || {}
  const existingSocialLinks = Array.isArray(settings.social_links) ? settings.social_links : []
  const sourceSocialLinks = Array.isArray(footer.social_links) ? footer.social_links : []
  const socialLinks = existingSocialLinks.length
    ? existingSocialLinks.map(({ id, ...link }) => link)
    : sourceSocialLinks.map(({ id, ...link }) => ({
        platform: link.platform,
        url: link.url,
        icon_class: link.icon_class,
        order: link.order || 0,
        is_active: link.is_active !== false,
      }))

  const data = {
    header_navigation: (navigation.navigation || []).map(navItem),
    footer_description: footer.description || undefined,
    footer_link_groups: (footer.link_groups || []).map(linkGroup),
    footer_copyright_text: footer.copyright_text || undefined,
    footer_tagline: footer.tagline || undefined,
    social_links: socialLinks,
  }

  const sourceText = JSON.stringify({ navigation, footer })
  const legacyBrandMarkers = /smilux|dental|smile|saigonimplant|saigondentalclinic/i
  const legacySourceDetected = legacyBrandMarkers.test(sourceText)

  const report = {
    mode: WRITE ? 'write' : 'dry-run',
    navigationItems: data.header_navigation.length,
    footerGroups: data.footer_link_groups.length,
    socialLinks: data.social_links.length,
    sourcePreserved: true,
    legacySourceDetected,
    warning: legacySourceDetected
      ? 'Source Navigation/Footer contains legacy dental branding. No write is allowed until the source content is curated for Dr. Maris.'
      : undefined,
    data,
  }
  console.log(JSON.stringify(report, null, 2))

  const reportPath = path.resolve(__dirname, '../ai-report/header-footer-to-website-settings.json')
  await fs.mkdir(path.dirname(reportPath), { recursive: true })
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))

  if (!WRITE) {
    console.log(`Dry-run only. Review ${reportPath}, then rerun with --write.`)
    return
  }

  if (legacySourceDetected) {
    throw new Error('Refusing to migrate legacy dental Navigation/Footer data. Curate the source first; no data was written.')
  }

  await request('/api/website-setting', 'PUT', { data })
  console.log('Website Settings updated. Old Navigation/Footer records were not deleted.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
