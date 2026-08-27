/** Migrate CMS navigation labels/order to the Figma Header contract. Default: dry-run. */
const { mkdir, writeFile, readFile } = require('node:fs/promises')
const path = require('node:path')
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(pathname, method = 'GET', body) {
  const response = await fetch(`${STRAPI_URL}${pathname}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }, body: body ? JSON.stringify(body) : undefined })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${pathname}: ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

async function main() {
  const current = await request('/api/navigation?populate[navigation][populate]=*')
  const target = [
    ['Home', '/'], ['About Us', '/about-us'], ['Services', '/services'], ['Technology', '/technology'],
    ['Pricing', '/pricing'], ['Blog', '/news'], ['Contact', '/contact'],
  ].map(([label, href]) => ({ label, href, isExternal: false }))
  const payload = { data: { navigation: target, ctaText: 'BOOK APPOINTMENT', ctaLink: '/booking' } }
  const diff = { labels: [current.data?.navigation?.map((item) => item.label) || [], target.map((item) => item.label)], ctaText: [current.data?.ctaText, 'BOOK APPOINTMENT'] }
  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', diff }, null, 2))
  if (!WRITE) return
  const reportDir = path.resolve(__dirname, '../ai-report')
  await mkdir(reportDir, { recursive: true })
  await writeFile(path.join(reportDir, 'navigation-before-130.json'), JSON.stringify(current, null, 2))
  await request('/api/navigation', 'PUT', payload)
  console.log('Navigation parity migration written and backup saved to ai-report/navigation-before-130.json')
}

main().catch((error) => { console.error(error.message); process.exit(1) })
