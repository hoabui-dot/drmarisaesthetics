#!/usr/bin/env node

/**
 * Remove the retired About Us schema and migrate the legacy hero payload into
 * the current CMS-managed hero fields before dropping the legacy relations.
 */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const LEGACY_TABLES = [
  'components_about_commitments_items_lnk',
  'components_about_commitments_cmps',
  'components_about_commitments',
  'components_about_commitment_items',
  'components_about_excellences_stats_lnk',
  'components_about_excellences_cmps',
  'components_about_excellences',
  'components_about_excellence_stats',
  'components_about_philosophies_tabs_lnk',
  'components_about_philosophies_pillars_lnk',
  'components_about_philosophies_cmps',
  'components_about_philosophies',
  'components_about_philosophy_tabs',
  'components_about_ctas_contact_info_lnk',
  'components_about_ctas',
  'components_about_achievements_features_lnk',
  'components_about_image_items',
  'components_about_why_choose_us_images_lnk',
  'components_about_heroes_images_lnk',
];

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');

    // Preserve the approved hero copy and background from the old payload.
    await client.query(`
      UPDATE components_about_heroes
      SET eyebrow = COALESCE(NULLIF(eyebrow, ''), 'ABOUT SMILUX'),
          heading_primary = COALESCE(NULLIF(heading_primary, ''), 'About Smilux'),
          heading_secondary_line_1 = COALESCE(NULLIF(heading_secondary_line_1, ''), 'Trusted Dental Excellence'),
          heading_secondary_line_2 = COALESCE(NULLIF(heading_secondary_line_2, ''), 'Built Around You.'),
          supporting_paragraph = COALESCE(
            NULLIF(supporting_paragraph, ''),
            'At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones.'
          ),
          updated_at = NOW()
    `);

    // Move the current About hero image to the singular current field.
    const heroRows = await client.query('SELECT id FROM components_about_heroes ORDER BY id');
    for (const { id } of heroRows.rows) {
      const image = await client.query(
        `SELECT file_id FROM files_related_mph
         WHERE related_type = 'about.hero' AND related_id = $1 AND field = 'hero_images'
         ORDER BY "order" NULLS LAST LIMIT 1`,
        [id],
      );
      await client.query(
        "DELETE FROM files_related_mph WHERE related_type = 'about.hero' AND related_id = $1 AND field IN ('hero_images', 'backgroundImage')",
        [id],
      );
      if (image.rows[0]) {
        await client.query(
          `INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
           VALUES ($1, $2, 'about.hero', 'backgroundImage', 1)`,
          [image.rows[0].file_id, id],
        );
      }
    }

    // Remove retired section links and the old title-line relation.
    await client.query(
      "DELETE FROM about_pages_cmps WHERE component_type IN ('about.excellence', 'about.philosophy', 'about.commitment', 'about.cta')",
    );
    await client.query("DELETE FROM components_about_heroes_cmps WHERE component_type = 'homepage.title-line'");
    await client.query('ALTER TABLE components_about_heroes DROP COLUMN IF EXISTS description');

    for (const table of LEGACY_TABLES) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }

    // These were only linked to the retired About hero titleLines.
    await client.query(
      `DELETE FROM components_homepage_title_lines
       WHERE id IN (187, 459)
         AND NOT EXISTS (SELECT 1 FROM components_about_heroes_cmps WHERE cmp_id = components_homepage_title_lines.id)`,
    );

    await client.query('COMMIT');
    console.log(`[ABOUT CLEANUP] migrated ${heroRows.rowCount} heroes and removed legacy About tables/relations`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[ABOUT CLEANUP] failed: ${error.message}`);
  process.exitCode = 1;
});
