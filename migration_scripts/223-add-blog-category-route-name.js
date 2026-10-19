#!/usr/bin/env node

/**
 * Adds and backfills the Website Settings Blog Category route_name column.
 * Local-only explicit migration; does not run from Strapi bootstrap or Docker.
 * Preview: node migration_scripts/223-add-blog-category-route-name.js
 * Write:   node migration_scripts/223-add-blog-category-route-name.js --write
 */
const path = require('node:path')
const dotenv = require(require.resolve('dotenv', { paths: [path.resolve(__dirname, '../strapi-cms')] }))
const { Client } = require(require.resolve('pg', { paths: [path.resolve(__dirname, '../strapi-cms')] }))

dotenv.config({ path: path.resolve(__dirname, '../strapi-cms/.env'), quiet: true })
const WRITE = process.argv.includes('--write')
const schema = process.env.DATABASE_SCHEMA || 'public'
const table = 'components_website_setting_blog_categories'

function slugify(value) {
  return String(value || '').trim().toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function uniqueName(candidate, id, used) {
  const base = slugify(candidate) || `category-${id}`
  let name = base
  let suffix = 2
  while (used.has(name)) name = `${base}-${suffix++}`
  used.add(name)
  return name
}

function quoteIdentifier(value) { return `"${String(value).replace(/"/g, '""')}"` }

async function main() {
  for (const key of ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_NAME', 'DATABASE_USERNAME', 'DATABASE_PASSWORD']) {
    if (!process.env[key]) throw new Error(`${key} is required in strapi-cms/.env`)
  }
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: process.env.DATABASE_SSL_SELF === 'true' } : false,
  })
  await client.connect()
  try {
    const exists = await client.query('select 1 from information_schema.tables where table_schema = $1 and table_name = $2', [schema, table])
    if (!exists.rowCount) throw new Error(`Expected local Strapi table ${schema}.${table} does not exist; no changes made.`)
    let hasRouteName = Boolean((await client.query('select 1 from information_schema.columns where table_schema = $1 and table_name = $2 and column_name = $3', [schema, table, 'route_name'])).rowCount)
    if (WRITE) {
      await client.query('begin')
      await client.query(`alter table ${quoteIdentifier(schema)}.${quoteIdentifier(table)} add column if not exists route_name varchar(255)`)
      hasRouteName = true
    }
    const routeColumn = hasRouteName ? 'route_name' : 'null::varchar as route_name'
    const result = await client.query(`select id, label, category_id, ${routeColumn} from ${quoteIdentifier(schema)}.${quoteIdentifier(table)} order by id`)
    const groups = new Map()
    for (const row of result.rows) {
      const key = String(row.category_id || `row-${row.id}`)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(row)
    }
    const used = new Set()
    const pending = []
    for (const [categoryId, rows] of groups) {
      const preserved = rows.map((row) => String(row.route_name || '').trim()).find(Boolean)
      const name = preserved && !used.has(preserved) ? (used.add(preserved), preserved) : uniqueName(preserved || rows[0].label, rows[0].id, used)
      for (const row of rows) {
        if (String(row.route_name || '').trim() === name) continue
        pending.push({ id: row.id, label: row.label, route_name: name })
        if (WRITE) await client.query(`update ${quoteIdentifier(schema)}.${quoteIdentifier(table)} set route_name = $1 where id = $2`, [name, row.id])
      }
    }
    if (WRITE) await client.query('commit')
    console.log(JSON.stringify({ mode: WRITE ? 'write' : 'preview', schema, table, existingCategories: result.rowCount, backfilled: pending }, null, 2))
    if (!WRITE) console.log('Preview only; rerun with --write to alter the local DB and backfill route names.')
  } catch (error) {
    if (WRITE) await client.query('rollback').catch(() => {})
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error(`[blog-category-route-migration] ${error.message}`); process.exitCode = 1 })
