#!/usr/bin/env node

/**
 * Make Website Settings the single source of truth for the Contact map embed.
 * The contact map section keeps presentation/content fields only; coordinates,
 * zoom and map search address are removed because they are duplicated in the
 * website-setting single type.
 */
const { Client } = require('pg')

const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
})

async function run() {
  await client.connect()
  try {
    await client.query('BEGIN')
    const table = 'components_contact_map_sections'
    const columns = ['map_address', 'map_latitude', 'map_longitude', 'map_zoom']
    const existing = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = ANY($2::text[])`,
      [table, columns],
    )
    for (const { column_name: column } of existing.rows) {
      await client.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}"`)
      console.log(`[contact-map] removed ${column}`)
    }
    await client.query('COMMIT')
    console.log('[contact-map] Website Settings is now the only map embed source')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

run().catch((error) => {
  console.error('[contact-map] migration failed:', error.message)
  process.exitCode = 1
})
