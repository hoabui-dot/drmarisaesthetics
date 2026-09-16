#!/usr/bin/env node

/**
 * Migrates the legacy Blog rich-text fields to the same Better Blocks article
 * contract used by Service. Run once after the Blog schema has been rebuilt.
 * The legacy columns are copied to a backup table before they are removed.
 */
const { Client } = require('pg');
const { transformHtml } = require('../src/lib/docx-better-blocks');

const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const legacyColumns = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'blogs'
        AND column_name IN ('excerpt', 'content', 'author_name', 'reading_time')
    `);
    if (!legacyColumns.rows.some((column) => column.column_name === 'content')) {
      await client.query('ROLLBACK');
      console.log('[SKIP] Blog legacy content columns are already removed; use 196-backfill-blog-better-blocks.js for empty documents.');
      return;
    }
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs_legacy_backup_20260913 AS
      SELECT id, document_id, slug, title, excerpt, content, author_name, reading_time, created_at, updated_at
      FROM blogs
      WHERE false
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS blogs_legacy_backup_20260913_id_idx ON blogs_legacy_backup_20260913 (id)`);
    await client.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_better_blocks jsonb`);

    const { rows } = await client.query(`SELECT id, content FROM blogs ORDER BY id`);
    for (const row of rows) {
      const source = typeof row.content === 'string' ? row.content : '';
      const transformed = source.trim() ? transformHtml(source) : { blocks: [], warnings: [] };
      await client.query(`
        INSERT INTO blogs_legacy_backup_20260913 (id, document_id, slug, title, excerpt, content, author_name, reading_time, created_at, updated_at)
        SELECT id, document_id, slug, title, excerpt, content, author_name, reading_time, created_at, updated_at
        FROM blogs WHERE id = $1
        ON CONFLICT (id) DO NOTHING
      `, [row.id]);
      await client.query(`UPDATE blogs SET content_better_blocks = $1::jsonb, updated_at = NOW() WHERE id = $2`, [JSON.stringify(transformed.blocks), row.id]);
      if (transformed.warnings.length) console.warn(`[blog ${row.id}] ${transformed.warnings.join(' | ')}`);
    }

    await client.query('ALTER TABLE blogs DROP COLUMN IF EXISTS excerpt');
    await client.query('ALTER TABLE blogs DROP COLUMN IF EXISTS content');
    await client.query('ALTER TABLE blogs DROP COLUMN IF EXISTS author_name');
    await client.query('ALTER TABLE blogs DROP COLUMN IF EXISTS reading_time');
    await client.query('COMMIT');
    console.log(`[OK] Migrated ${rows.length} blogs to content_better_blocks.`);
    console.log('[OK] Legacy values are retained in blogs_legacy_backup_20260913.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[FAIL] Blog migration rolled back:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
