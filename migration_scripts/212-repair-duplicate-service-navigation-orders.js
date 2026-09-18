#!/usr/bin/env node

/**
 * One-time repair for duplicate service navigation positions.
 *
 * The most recently updated document version keeps the position. All rows
 * belonging to the other document versions are cleared without changing
 * their publication state. Future replacements are handled by the Admin
 * custom field and publish API flow.
 */
const { Client } = require('../strapi-cms/node_modules/pg')

const client = new Client({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 15432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
})

async function run() {
  await client.connect()
  await client.query('BEGIN')

  const { rows } = await client.query(`
    SELECT id, document_id, navigation_order, updated_at
    FROM services
    WHERE navigation_order IS NOT NULL
    ORDER BY navigation_order ASC, updated_at DESC, id DESC
  `)

  const grouped = new Map()
  for (const row of rows) {
    const entries = grouped.get(row.navigation_order) || []
    entries.push(row)
    grouped.set(row.navigation_order, entries)
  }

  const clearedDocumentIds = new Set()
  for (const [order, entries] of grouped) {
    const documentIds = [...new Set(entries.map((entry) => entry.document_id))]
    if (documentIds.length < 2) continue

    const winner = entries[0].document_id
    const losers = documentIds.filter((documentId) => documentId !== winner)
    for (const documentId of losers) {
      await client.query(
        'UPDATE services SET navigation_order = NULL WHERE document_id = $1 AND navigation_order = $2',
        [documentId, order],
      )
      clearedDocumentIds.add(documentId)
    }

    console.log(`Position ${order}: kept ${winner}; cleared ${losers.join(', ')}`)
  }

  await client.query('COMMIT')
  console.log(`Repaired ${clearedDocumentIds.size} duplicate service document(s).`)
}

run()
  .catch(async (error) => {
    await client.query('ROLLBACK').catch(() => undefined)
    console.error(`[FAILED] ${error.message}`)
    process.exitCode = 1
  })
  .finally(() => client.end())
