#!/usr/bin/env node

/** Remove the obsolete inline service Patient Results component.
 * Service pages use the shared results gallery rendered at the end of the page.
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
    const links = await client.query(
      `DELETE FROM service_details_cmps
       WHERE component_type IN ('service-detail.patient-results', 'service-detail.patient-result')`,
    )
    await client.query('DROP TABLE IF EXISTS components_service_detail_patient_results_sections CASCADE')
    await client.query('DROP TABLE IF EXISTS components_service_detail_patient_results CASCADE')
    await client.query('COMMIT')
    console.log(`[service-results] removed ${links.rowCount || 0} obsolete service result links and legacy tables`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

run().catch((error) => {
  console.error('[service-results] migration failed:', error.message)
  process.exitCode = 1
})
