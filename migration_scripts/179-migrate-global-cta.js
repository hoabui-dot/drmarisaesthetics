#!/usr/bin/env node

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const files = await request('/api/upload/files?pagination[pageSize]=1000')
  const background = files.find((file) => /homepage-photo-1551076805|technology\.jpg/i.test(file.name))
  const global_cta = {
    eyebrow: 'BEGIN YOUR JOURNEY',
    title: 'Your case deserves a surgical plan built around you.',
    editorial_lead: 'Your case begins with understanding your actual condition.',
    description: 'Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.',
    button_label: 'Start Your Consultation',
    panel_eyebrow: 'PRIVATE CONSULTATION',
    panel_title: 'Begin with a clinical review.',
    panel_description: 'Share your case before making travel decisions.',
    steps: [
      { number: '01', label: 'Share your case' },
      { number: '02', label: 'Receive a preliminary review' },
      { number: '03', label: 'Arrange your consultation' },
    ],
    ...(background ? { background_image: background.id } : {}),
  }
  console.log(JSON.stringify({ global_cta }, null, 2))
  if (DRY_RUN) return
  await request('/api/website-setting?status=draft', { method: 'PUT', body: JSON.stringify({ data: { global_cta } }) })
  await request('/api/website-setting?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/website-setting?status=published&populate=*')
  if (!verify.data?.global_cta?.title || !verify.data?.global_cta?.steps?.length) throw new Error('Global CTA verification failed')
  console.log('[website-settings] global CTA migrated and published')
}

main().catch((error) => { console.error(`[website-settings] failed: ${error.message}`); process.exitCode = 1 })
