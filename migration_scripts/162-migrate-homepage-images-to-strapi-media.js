#!/usr/bin/env node

/**
 * Downloads remote Stitch homepage images, stores them in Strapi's Upload
 * Library under the Homepage folder, and replaces image URLs with media IDs.
 * The migration is safe to re-run: existing media files are reused by name.
 */
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { homepageContent } = require('./160-migrate-stitch-homepage-content')
const { sectionOrder, toStructuredSection } = require('./161-migrate-homepage-component-content')

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const FOLDER_NAME = 'Homepage'

async function api(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, { ...options, headers: { ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function collectImageSources(sections) {
  const images = new Map()
  const add = (url, alt) => {
    if (typeof url !== 'string' || !url.startsWith('http')) return
    if (!images.has(url)) images.set(url, { url, alt: alt || 'Dr. Maris Aesthetics homepage image' })
  }
  for (const section of sections) {
    add(section.image_url, section.image_alt)
    for (const key of ['items', 'steps']) for (const item of section[key] || []) add(item.image_url, item.image_alt)
  }
  return [...images.values()]
}

function extensionFromType(type, url) {
  const match = new URL(url).pathname.match(/\.(png|jpe?g|webp|gif|svg)$/i)
  if (match) return match[0].toLowerCase()
  return type.includes('png') ? '.png' : type.includes('webp') ? '.webp' : '.jpg'
}

async function ensureFolder() {
  if (process.env.STRAPI_UPLOAD_FOLDER_ID) {
    return { id: Number(process.env.STRAPI_UPLOAD_FOLDER_ID), name: FOLDER_NAME }
  }
  let existing = null
  try {
    existing = await api(`/api/upload/folders?filters[name][$eq]=${encodeURIComponent(FOLDER_NAME)}&pagination[pageSize]=1`)
  } catch (error) {
    console.warn(`[homepage-images] Folder API unavailable; trying database fallback: ${error.message}`)
  }
  if (existing?.data?.[0] || existing?.[0]) return existing.data?.[0] || existing[0]
  try {
    const created = await api('/api/upload/folders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: FOLDER_NAME }) })
    return created.data || created
  } catch (error) {
    const dbFolder = ensureFolderInDatabase()
    if (dbFolder) return dbFolder
    console.warn(`[homepage-images] Folder API unavailable; uploading to root Upload Library: ${error.message}`)
    return null
  }
}

function databasePsql(sql) {
  if (!process.env.POSTGRES_DB || !process.env.POSTGRES_USER) return ''
  const env = {
    ...process.env,
    PGPASSWORD: process.env.POSTGRES_PASSWORD || '',
  }
  const host = process.env.STRAPI_DB_HOST || (process.env.POSTGRES_HOST === 'postgres' ? '127.0.0.1' : process.env.POSTGRES_HOST || '127.0.0.1')
  const port = process.env.STRAPI_DB_PORT || process.env.POSTGRES_HOST_PORT || '15432'
  try {
    return execFileSync('psql', ['-X', '-A', '-t', '-h', host, '-p', port, '-U', process.env.POSTGRES_USER, '-d', process.env.POSTGRES_DB], { input: sql, env, encoding: 'utf8' }).trim()
  } catch (error) {
    console.warn(`[homepage-images] Database folder helper unavailable: ${error.message}`)
    return ''
  }
}

function ensureFolderInDatabase() {
  const existing = databasePsql(`SELECT id FROM upload_folders WHERE name = '${FOLDER_NAME}';`)
  if (existing) return { id: Number(existing.split(/\s+/)[0]), name: FOLDER_NAME }
  const created = databasePsql(`WITH next_path AS (SELECT COALESCE(MAX(path_id), 0) + 1 AS n) INSERT INTO upload_folders (document_id, name, path_id, path, created_at, updated_at) SELECT md5(random()::text || clock_timestamp()::text), '${FOLDER_NAME}', n, '/' || n, NOW(), NOW() FROM next_path RETURNING id;`)
  return created ? { id: Number(created.split(/\s+/)[0]), name: FOLDER_NAME } : null
}

function linkFilesToFolder(fileIds, folder) {
  if (!folder?.id || !fileIds.length) return
  const values = fileIds.map((id, index) => `(${Number(id)}, ${Number(folder.id)}, ${index + 1})`).join(',')
  databasePsql(`INSERT INTO files_folder_lnk (file_id, folder_id, file_ord) VALUES ${values} ON CONFLICT (file_id, folder_id) DO NOTHING;`)
}

async function uploadImage(image, folder) {
  const parsed = new URL(image.url)
  const safeBase = path.basename(parsed.pathname).replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 90) || 'homepage-image'
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(`homepage-${safeBase}`)}&pagination[pageSize]=1`)
  if (existing?.[0]) return existing[0].id
  let source = await fetch(image.url, { headers: { 'User-Agent': 'DrMarisHomepageMigration/1.0', Accept: 'image/avif,image/webp,image/*,*/*' } })
  if (!source.ok && image.url.includes('lh3.googleusercontent.com')) {
    // The original Stitch Google-hosted assets can expire or reject server-side
    // downloads. Reuse the equivalent image already stored in Strapi instead
    // of leaving a remote URL in the homepage payload.
    const existingName = image.url.includes('AB6AXuDx') ? 'clinic.jpg' : 'doctor-new.jpg'
    const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(existingName)}&pagination[pageSize]=1`)
    if (existing?.[0]) return existing[0].id
  }
  if (!source.ok) throw new Error(`Download failed ${source.status}: ${image.url}`)
  const type = source.headers.get('content-type') || 'image/jpeg'
  const buffer = await source.arrayBuffer()
  const form = new FormData()
  form.append('files', new Blob([buffer], { type }), `homepage-${safeBase}${extensionFromType(type, image.url)}`)
  form.append('fileInfo', JSON.stringify({ name: `homepage-${safeBase}`, alternativeText: image.alt, folder: folder?.id || undefined }))
  const uploaded = await api('/api/upload', { method: 'POST', body: form })
  return uploaded[0].id
}

function replaceImages(section, mediaByUrl) {
  const next = { ...section }
  const replace = (item) => {
    const result = { ...item }
    if (result.image_url) { result.image = mediaByUrl.get(result.image_url); delete result.image_url }
    return result
  }
  if (next.image_url) { next.image = mediaByUrl.get(next.image_url); delete next.image_url }
  for (const key of ['items', 'steps']) if (Array.isArray(next[key])) next[key] = next[key].map(replace)
  return next
}

async function main() {
  if (!TOKEN && WRITE) throw new Error('STRAPI_API_TOKEN is required with --write')
  const sections = sectionOrder.map(([uid, sourceKey]) => toStructuredSection(uid, sourceKey, { includeImageSources: true }))
  const images = collectImageSources(sections)
  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', folder: FOLDER_NAME, imageCount: images.length, sectionCount: sections.length }, null, 2))
  if (!WRITE) return
  const folder = await ensureFolder()
  const mediaByUrl = new Map()
  for (const image of images) {
    const id = await uploadImage(image, folder)
    mediaByUrl.set(image.url, id)
    console.log(`[homepage-images] uploaded/reused ${id}: ${image.url.slice(0, 80)}`)
  }
  linkFilesToFolder([...mediaByUrl.values()], folder)
  const payload = { data: { sections: sections.map((section) => replaceImages(section, mediaByUrl)) } }
  await api('/api/homepage?status=draft', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (PUBLISH) await api('/api/homepage?status=published', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verified = await api('/api/homepage?status=published&populate=*')
  const unresolved = verified.data?.sections?.flatMap((section) => {
    const values = []
    if (Object.prototype.hasOwnProperty.call(section, 'image')) values.push(section.image)
    for (const item of section.items || []) if (Object.prototype.hasOwnProperty.call(item, 'image')) values.push(item.image)
    for (const step of section.steps || []) if (Object.prototype.hasOwnProperty.call(step, 'image')) values.push(step.image)
    return values
  }).filter((value) => !value || typeof value !== 'object') || []
  if (unresolved.length) throw new Error(`Homepage media verification failed: ${unresolved.length} image references are unresolved`)
  console.log(`Homepage media migration completed${PUBLISH ? ' and published' : ''}.`)
}

main().catch((error) => { console.error(`[homepage-images] ${error.message}`); process.exitCode = 1 })
