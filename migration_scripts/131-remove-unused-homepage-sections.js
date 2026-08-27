/** Remove retired homepage sections and their dynamic-zone links. */
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(path, method = 'GET', body) {
  const response = await fetch(`${STRAPI_URL}${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }, body: body ? JSON.stringify(body) : undefined })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

function strip(value) {
  if (Array.isArray(value)) {
    if (value.length && value.every((item) => item && typeof item === 'object' && item.url && item.mime && item.id)) return { connect: value.map((item) => item.id) }
    return value.map(strip)
  }
  if (!value || typeof value !== 'object') return value
  if (value.url && value.mime && value.id) return { connect: [value.id] }
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'related', 'localizations'].includes(key))
    .map(([key, item]) => [key, strip(item)]))
}

async function main() {
  const current = await request('/api/homepage?status=draft&populate[layout][populate]=*')
  const layout = current.data.layout || []
  const removed = layout.filter((block) => ['homepage.papers-section', 'homepage.social-proof'].includes(block.__component)).map((block) => block.__component)
  const nextLayout = layout.filter((block) => !['homepage.papers-section', 'homepage.social-proof'].includes(block.__component)).map(strip)
  await request('/api/homepage?status=draft', 'PUT', { data: { title: current.data.title, layout: nextLayout } })
  await request('/api/homepage', 'PUT', { data: { publishedAt: new Date().toISOString() } })
  console.log(JSON.stringify({ removed, remaining: nextLayout.map((block) => block.__component) }, null, 2))
}

main().catch((error) => { console.error(error.message); process.exit(1) })
