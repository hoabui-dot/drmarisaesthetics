#!/usr/bin/env node

/**
 * Migrates legacy homepage result stories from before/after media fields to
 * the single composite `image` field used by the Results page and service
 * result slider. Existing `after_image` is used as a safe media fallback for
 * records that have not yet received a curated composite upload.
 *
 * Run with --write to persist and --publish to publish the homepage.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  const response = await request('/api/homepage?populate[sections][on][homepage.results-section][populate][stories][populate]=*')
  const document = response?.data
  if (!document) throw new Error('Homepage document was not found')

  let changed = false
  const sections = (document.sections || []).map((section) => {
    if (section.__component !== 'homepage.results-section') return section
    const stories = (section.stories || []).map((story) => {
      if (story.image) return { ...story, before_image: undefined, after_image: undefined }
      const fallback = story.after_image?.data?.id || story.after_image?.id
      if (!fallback) return story
      changed = true
      return {
        ...story,
        image: fallback,
        image_alt: story.image_alt || story.after_alt || `${story.title || 'Patient'} composite before and after result`,
        before_image: undefined,
        after_image: undefined,
      }
    })
    return { ...section, stories }
  })

  if (!changed) {
    console.log('[181] Homepage result stories already use composite images.')
    return
  }
  if (!WRITE) {
    console.log('[181] Migration preview: changes detected. Re-run with --write --publish to persist.')
    return
  }

  const id = document.documentId || document.id
  await request(`/api/homepage/${id}`, { method: 'PUT', body: JSON.stringify({ data: { sections } }) })
  if (PUBLISH && document.documentId) await request(`/api/homepage/${document.documentId}/actions/publish`, { method: 'POST', body: '{}' })
  console.log(`[181] Migrated homepage result stories${PUBLISH ? ' and published' : ''}.`)
}

main().catch((error) => { console.error(`[181] ${error.message}`); process.exitCode = 1 })
