#!/usr/bin/env node

/**
 * Create the first two Doctor collection entries from the existing Our Team
 * single type. This is an explicit, one-time data migration; it is never
 * imported by Strapi bootstrap or Docker startup.
 *
 * Preview: STRAPI_URL=... STRAPI_API_TOKEN=... node migration_scripts/213-create-doctor-profiles.js
 * Write:   ... node migration_scripts/213-create-doctor-profiles.js --write
 */

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const { Client } = require('../strapi-cms/node_modules/pg')

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function copyPublishedMediaRelations(documentId) {
  const client = new Client({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 15432),
    database: process.env.DATABASE_NAME || 'dental_cms_strapi',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
  })
  await client.connect()
  try {
    // REST component writes correctly duplicate scalar data, but Strapi 5's
    // dynamic-zone REST update does not reliably attach media relations. Copy
    // only the published source relations to the new published component rows.
    await client.query(`
      INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
      SELECT DISTINCT source_file.file_id, target_cmp.cmp_id, source_file.related_type,
             source_file.field, source_file."order"
      FROM our_teams source_entry
      JOIN our_teams_cmps source_cmp ON source_cmp.entity_id = source_entry.id
      JOIN doctors target_entry ON target_entry.document_id = $1 AND target_entry.published_at IS NOT NULL
      JOIN doctors_cmps target_cmp ON target_cmp.entity_id = target_entry.id
        AND target_cmp.component_type = source_cmp.component_type
        AND target_cmp.field = source_cmp.field
        AND target_cmp."order" = source_cmp."order"
      JOIN files_related_mph source_file ON source_file.related_id = source_cmp.cmp_id
        AND source_file.related_type = source_cmp.component_type
      WHERE source_entry.published_at IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM files_related_mph existing_file
          WHERE existing_file.file_id = source_file.file_id
            AND existing_file.related_id = target_cmp.cmp_id
            AND existing_file.related_type = source_file.related_type
            AND existing_file.field = source_file.field
        )
    `, [documentId])
  } finally {
    await client.end()
  }
}

const SYSTEM_KEYS = new Set(['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations', 'locale', 'status'])

function isMedia(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    (typeof value.url === 'string' || typeof value.mime === 'string') &&
    (value.id !== undefined || value.documentId !== undefined)
}

// Duplicate component data without reusing component row IDs. Media keeps its
// Strapi ID so existing uploads remain linked and are not copied unnecessarily.
function cloneContent(value) {
  if (Array.isArray(value)) return value.map(cloneContent)
  if (!value || typeof value !== 'object') return value
  if (isMedia(value)) return { connect: [value.id || value.documentId] }

  const result = {}
  for (const [key, child] of Object.entries(value)) {
    if (SYSTEM_KEYS.has(key)) continue
    result[key] = cloneContent(child)
  }
  return result
}

const profiles = [
  { name: 'Dr. Huy', navigationLabel: 'Dr. Huy', slug: 'dr-huy' },
  { name: 'Dr. Cuong', navigationLabel: 'Dr. Cuong', slug: 'dr-cuong' },
]

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const write = process.argv.includes('--write')
  // Use the published document as the source of truth. In Strapi 5, a draft
  // document version can omit populated media relations even when the
  // published version contains them.
  const sourceResponse = await api('/api/our-team?status=published&populate=*')
  const source = sourceResponse.data
  if (!source) throw new Error('The existing /api/our-team single type has no data to duplicate.')

  const sourceData = cloneContent(source)
  const payloads = profiles.map((profile) => ({
    ...profile,
    seo: sourceData.seo,
    sections: sourceData.sections,
  }))

  if (!write) {
    console.log(JSON.stringify({ mode: 'preview', sourceSections: sourceData.sections?.length || 0, profiles: payloads.map(({ name, slug, sections }) => ({ name, slug, sections: sections?.length || 0 })) }, null, 2))
    console.log('No records were changed. Re-run with --write to create or update the two doctor profiles.')
    return
  }

  for (const payload of payloads) {
    const existing = await api(`/api/doctors?status=draft&filters[slug][$eq]=${encodeURIComponent(payload.slug)}&pagination[pageSize]=1`)
    const entry = existing.data?.[0]
    const endpoint = entry ? `/api/doctors/${entry.documentId || entry.id}` : '/api/doctors'
    const method = entry ? 'PUT' : 'POST'
    const response = await api(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    })
    const documentId = response.data?.documentId || response.data?.id || entry?.documentId || entry?.id
    if (documentId) {
      // Strapi 5 publishes collection documents through the document update
      // endpoint. The older /actions/publish route is not available here.
      await api(`/api/doctors/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {}, status: 'published' }),
      })
      await copyPublishedMediaRelations(documentId)
    }
    console.log(`[${method}] ${payload.name} (${payload.slug})`)
  }
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`)
  process.exitCode = 1
})
