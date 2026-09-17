const path = require('node:path')
const { Client } = require('pg')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const client = new Client({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 15432),
  database: process.env.DATABASE_NAME || process.env.POSTGRES_DB,
  user: process.env.DATABASE_USERNAME || process.env.POSTGRES_USER,
  password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD,
})

async function migrate() {
  await client.connect()
  await client.query('BEGIN')

  try {
    const { rows: sections } = await client.query(
      'SELECT id FROM components_our_team_international_sections ORDER BY id',
    )

    for (const section of sections) {
      const { rows: existing } = await client.query(
        `SELECT id FROM components_our_team_international_sections_cmps
         WHERE entity_id = $1
           AND field = 'steps'
           AND component_type = 'our-team.international-step'
         LIMIT 1`,
        [section.id],
      )

      if (existing.length) {
        console.log(`International section ${section.id} already migrated; skipped.`)
        continue
      }

      const { rows: oldSteps } = await client.query(
        `SELECT step.title, relation.order
         FROM components_our_team_international_sections_cmps relation
         JOIN components_our_team_steps step ON step.id = relation.cmp_id
         WHERE relation.entity_id = $1
           AND relation.field = 'steps'
           AND relation.component_type = 'our-team.step'
         ORDER BY relation.order ASC`,
        [section.id],
      )

      for (const oldStep of oldSteps) {
        if (!oldStep.title) continue

        const { rows: inserted } = await client.query(
          'INSERT INTO components_our_team_international_steps (title) VALUES ($1) RETURNING id',
          [oldStep.title],
        )

        await client.query(
          `INSERT INTO components_our_team_international_sections_cmps
            (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, 'our-team.international-step', 'steps', $3)`,
          [section.id, inserted[0].id, oldStep.order],
        )
      }

      await client.query(
        `DELETE FROM components_our_team_international_sections_cmps
         WHERE entity_id = $1
           AND field = 'steps'
           AND component_type = 'our-team.step'`,
        [section.id],
      )

      console.log(`Migrated ${oldSteps.length} international steps for section ${section.id}.`)
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

migrate().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
