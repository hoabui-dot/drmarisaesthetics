/**
 * Migration 115: Rollback Homepage CTA to Original
 *
 * Reverts migration 114 - goes back to using homepage.cta instead of homepage.homepage-cta
 * The homepage.cta component should be homepage-specific and not reused elsewhere.
 */

const { Client } = require("pg");

const config = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function migrate() {
  const client = new Client(config);

  try {
    await client.connect();
    console.log("✓ Connected to database");

    // Start transaction
    await client.query("BEGIN");

    // 1. Get the homepage-cta data
    const homepageCTAData = await client.query(`
      SELECT * FROM components_homepage_homepage_ctas WHERE id = 1
    `);

    if (homepageCTAData.rows.length === 0) {
      console.log("⚠ No homepage-cta data found, skipping migration");
      await client.query("ROLLBACK");
      return;
    }

    const ctaData = homepageCTAData.rows[0];
    console.log("✓ Found homepage-cta data:", ctaData);

    // 2. Insert into components_homepage_ctas (original table)
    const insertResult = await client.query(
      `
      INSERT INTO components_homepage_ctas (heading, highlight_text, button_label, button_link)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      [
        ctaData.heading,
        ctaData.highlight_text,
        ctaData.button_label,
        ctaData.button_link,
      ],
    );

    const newCtaId = insertResult.rows[0].id;
    console.log("✓ Created homepage.cta component with id:", newCtaId);

    // 3. Update homepages_cmps to use homepage.cta instead of homepage.homepage-cta
    await client.query(
      `
      UPDATE homepages_cmps
      SET component_type = 'homepage.cta',
          cmp_id = $1
      WHERE component_type = 'homepage.homepage-cta'
        AND entity_id = 1
    `,
      [newCtaId],
    );

    console.log("✓ Updated homepage layout to use homepage.cta");

    // 4. Delete the homepage-cta entries
    await client.query(`
      DELETE FROM components_homepage_homepage_ctas WHERE id IN (1, 2)
    `);

    console.log("✓ Deleted homepage.homepage-cta entries");

    // Commit transaction
    await client.query("COMMIT");
    console.log("✅ Migration 115 completed successfully!");
    console.log("");
    console.log("Summary:");
    console.log(
      "- Reverted to using homepage.cta (original component with background_image support)",
    );
    console.log("- Removed homepage.homepage-cta entries");
    console.log("- Homepage CTA is now separate and not reused elsewhere");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
