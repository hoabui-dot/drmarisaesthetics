/*
 * Standardize Better Blocks service tables against the buttock-augmentation
 * table contract:
 *   - first row: table-header-cell
 *   - remaining rows: table-cell
 *   - header text is bold
 *   - no editor-only fontSize/alignment metadata
 *
 * Run with the same database variables used by the other migration scripts.
 * The migration creates a one-time JSON backup before changing any service.
 */

const { Client } = require('pg');

const BACKUP_TABLE = 'service_tables_standardization_backup_20260913';

const db = {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 15432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
};

function normalizeInlineNode(node, isHeader) {
  if (!node || typeof node !== 'object') return node;

  if (Array.isArray(node)) return node.map((child) => normalizeInlineNode(child, isHeader));

  const result = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === 'fontSize' || key === 'textAlign' || key === 'align') continue;
    if (key === 'bold') continue;
    if (key === 'children' && Array.isArray(value)) {
      result.children = value.map((child) => normalizeInlineNode(child, isHeader));
    } else {
      result[key] = value;
    }
  }

  if (result.type === 'text' && isHeader) result.bold = true;
  return result;
}

function normalizeCell(cell, isHeader) {
  const children = Array.isArray(cell?.children)
    ? cell.children.map((child) => normalizeInlineNode(child, isHeader))
    : [];

  return {
    type: isHeader ? 'table-header-cell' : 'table-cell',
    children,
  };
}

function normalizeTable(table) {
  const rows = Array.isArray(table?.children) ? table.children : [];

  return {
    type: 'table',
    children: rows.map((row, rowIndex) => ({
      type: 'table-row',
      children: Array.isArray(row?.children)
        ? row.children.map((cell) => normalizeCell(cell, rowIndex === 0))
        : [],
    })),
  };
}

function normalizeDocument(value) {
  let changed = false;

  function visit(node) {
    if (Array.isArray(node)) return node.map(visit);
    if (!node || typeof node !== 'object') return node;

    if (node.type === 'table') {
      changed = true;
      return normalizeTable(node);
    }

    const copy = {};
    for (const [key, child] of Object.entries(node)) copy[key] = visit(child);
    return copy;
  }

  return { value: visit(value), changed };
}

function countTables(value) {
  let count = 0;
  let malformed = 0;

  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== 'object') return;
    if (node.type === 'table') {
      count += 1;
      const rows = Array.isArray(node.children) ? node.children : [];
      rows.forEach((row, rowIndex) => {
        if (row?.type !== 'table-row') malformed += 1;
        (row?.children || []).forEach((cell) => {
          const expected = rowIndex === 0 ? 'table-header-cell' : 'table-cell';
          if (cell?.type !== expected) malformed += 1;
        });
      });
    }
    Object.values(node).forEach(visit);
  }

  visit(value);
  return { count, malformed };
}

async function main() {
  const client = new Client(db);
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${BACKUP_TABLE} (
        service_id integer PRIMARY KEY,
        slug text,
        content_better_blocks jsonb,
        updated_at timestamptz,
        backed_up_at timestamptz NOT NULL DEFAULT NOW()
      )
    `);

    const { rows } = await client.query(
      'SELECT id, slug, content_better_blocks, updated_at FROM services WHERE content_better_blocks IS NOT NULL ORDER BY slug, id',
    );

    let updated = 0;
    let tablesBefore = 0;
    let malformedBefore = 0;

    for (const row of rows) {
      const before = countTables(row.content_better_blocks);
      tablesBefore += before.count;
      malformedBefore += before.malformed;

      if (!before.count) continue;

      await client.query(
        `INSERT INTO ${BACKUP_TABLE} (service_id, slug, content_better_blocks, updated_at)
         VALUES ($1, $2, $3::jsonb, $4)
         ON CONFLICT (service_id) DO NOTHING`,
        [row.id, row.slug, JSON.stringify(row.content_better_blocks), row.updated_at],
      );

      const normalized = normalizeDocument(row.content_better_blocks);
      if (normalized.changed) {
        await client.query(
          'UPDATE services SET content_better_blocks = $1::jsonb, updated_at = NOW() WHERE id = $2',
          [JSON.stringify(normalized.value), row.id],
        );
        updated += 1;
      }
    }

    await client.query('COMMIT');

    console.log(`[OK] Audited ${rows.length} service records.`);
    console.log(`[OK] Standardized ${updated} service records containing ${tablesBefore} tables.`);
    console.log(`[INFO] Tables requiring normalization before migration: ${malformedBefore}.`);
    console.log(`[BACKUP] ${BACKUP_TABLE}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[ERROR] Service table standardization failed:', error.message);
  process.exitCode = 1;
});

