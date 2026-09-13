#!/usr/bin/env node

/* Results cases use one pre-composed 50/50 Before / After image per case. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const files = await request('/api/upload/files?pagination[pageSize]=1000')
  const byName = (name) => {
    const file = files.find((item) => item.name === name)
    if (!file) throw new Error(`Missing composite result upload: ${name}`)
    return file.id
  }
  const imageIds = {
    '042': byName('before-after-1.png'),
    '089': byName('result-10.png'),
    '112': byName('result-10 (1).png'),
    '056': byName('5eb02f3f-4e84-47ca-be37-865177dd99ef.png'),
  }
  const current = await request('/api/result?status=draft&populate=*')
  const currentCases = current.data?.cases || []
  const cases = currentCases.map((item) => ({
    case_number: item.case_number,
    category: item.category || 'Face & Neck',
    title: item.title,
    subtitle: item.subtitle,
    image: imageIds[item.case_number],
    image_alt: `Composite before and after patient result for ${item.title}`,
    profile: item.profile,
    recovery: item.recovery,
  }))
  console.log(JSON.stringify({ cases: cases.map((item) => ({ case: item.case_number, image: item.image })) }, null, 2))
  if (DRY_RUN) return
  await request('/api/result?status=draft', { method: 'PUT', body: JSON.stringify({ data: { cases } }) })
  await request('/api/result?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/result?populate=*')
  const verifiedCases = verify.data?.cases || []
  if (verifiedCases.length !== cases.length || verifiedCases.some((item) => !item.image)) throw new Error('Composite image migration verification failed')
  console.log(`[results] migrated ${verifiedCases.length} cases to single composite images`)
}

main().catch((error) => { console.error(`[results] failed: ${error.message}`); process.exitCode = 1 })
