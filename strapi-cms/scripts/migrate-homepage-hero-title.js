/**
 * One-time, idempotent migration for the editorial homepage hero.
 *
 * The Content Manager previously exposed two required fields:
 * title_line_1 and title_line_2. The current UI uses one semantic title.
 * Legacy columns are intentionally retained in the database for rollback
 * safety, but are removed from the Strapi component schema/UI.
 */

const { Client } = require('pg');

const client = new Client({
  host: process.env.POSTGRES_MIGRATION_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_MIGRATION_PORT || 15432),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'dental_cms_strapi',
});

const DEFAULT_TITLE = 'Plastic Surgery in Vietnam for International Patients';

async function migrate() {
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      ALTER TABLE components_homepage_hero_sections
      ADD COLUMN IF NOT EXISTS title varchar(255)
    `);

    const { rows } = await client.query(`
      SELECT id, title, title_line_1, title_line_2
      FROM components_homepage_hero_sections
      ORDER BY id
    `);

    for (const row of rows) {
      const migratedTitle = [row.title_line_1, row.title_line_2]
        .filter((value) => typeof value === 'string' && value.trim())
        .join(' ')
        .trim() || DEFAULT_TITLE;

      // Never overwrite a title that an editor has already entered.
      if (!row.title || !row.title.trim()) {
        await client.query(
          'UPDATE components_homepage_hero_sections SET title = $1 WHERE id = $2',
          [migratedTitle, row.id],
        );
        console.log(`Migrated homepage hero ${row.id}: ${migratedTitle}`);
      } else {
        console.log(`Skipped homepage hero ${row.id}: existing title preserved`);
      }
    }

    await client.query(`
      UPDATE components_homepage_hero_sections
      SET title = $1
      WHERE title IS NULL OR btrim(title) = ''
    `, [DEFAULT_TITLE]);

    await client.query('COMMIT');
    console.log(`Homepage hero title migration complete (${rows.length} record(s)).`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch((error) => {
  console.error('Homepage hero title migration failed:', error.message);
  process.exitCode = 1;
});
