#!/usr/bin/env node

/** Move Core Values from the shared feature item component to icon_image-only items. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const links = await client.query(
      `SELECT l.id, l.entity_id AS core_value_id, l.cmp_id AS feature_item_id, l.order, f.title, f.description
       FROM components_about_core_values_cmps l
       JOIN components_about_feature_items f ON f.id = l.cmp_id
       WHERE l.field = 'values' AND l.component_type = 'about.feature-item'
       ORDER BY l.entity_id, l.order, l.id`,
    );

    await client.query("DELETE FROM files_related_mph WHERE related_type = 'about.core-value-item'");
    await client.query('DELETE FROM components_about_core_value_items');
    for (const link of links.rows) {
      const item = await client.query(
        `INSERT INTO components_about_core_value_items (title, description)
         VALUES ($1, $2) RETURNING id`,
        [link.title, link.description],
      );

      const media = await client.query(
        `SELECT file_id FROM files_related_mph
         WHERE related_type = 'about.feature-item' AND related_id = $1 AND field = 'icon_image'
         ORDER BY "order" NULLS LAST LIMIT 1`,
        [link.feature_item_id],
      );
      if (media.rows[0]) {
        await client.query(
          `INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
           VALUES ($1, $2, 'about.core-value-item', 'icon_image', 1)`,
          [media.rows[0].file_id, item.rows[0].id],
        );
      }

      await client.query(
        `UPDATE components_about_core_values_cmps
         SET cmp_id = $1, component_type = 'about.core-value-item'
         WHERE id = $2`,
        [item.rows[0].id, link.id],
      );
    }

    await client.query('DROP TABLE IF EXISTS components_about_core_values_values_lnk CASCADE');
    /*
     * The old link table was not used by Strapi v5's component relation;
     * repeatable component links live in components_about_core_values_cmps.
     */
    /*
     * Keep this migration safe when the obsolete table was already removed.
     */
    /* legacy rows were intentionally read from the generic component link table above */
    /*
       No shared about.feature-item rows are deleted: Why Choose Us still uses them.
    */
    /*
     * The following query is retained as a clear migration boundary.
     */
    await client.query("DELETE FROM components_about_core_values_cmps WHERE field = 'values' AND component_type = 'about.feature-item'");

    await client.query('COMMIT');
    console.log(`[CORE VALUES] migrated ${links.rowCount} items to icon_image-only component`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[CORE VALUES] failed: ${error.message}`);
  process.exitCode = 1;
});
