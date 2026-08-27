/**
 * Migration Script 114: Create Homepage-Specific CTA Component
 *
 * Purpose: Separate homepage CTA from reusable CTA component
 *
 * Changes:
 * 1. Create new components_homepage_homepage_ctas table
 * 2. Migrate existing homepage CTA data to new table
 * 3. Update homepage_cmps to reference new component type
 *
 * Context: Homepage CTA should have its own unique design separate from
 * the reusable CTA component used on other pages (contact, services, about)
 */

const { Pool } = require("pg");

const pool = new Pool({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Step 1: Creating components_homepage_homepage_ctas table...");

    // Create the new homepage-specific CTA table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_homepage_ctas (
        id SERIAL PRIMARY KEY,
        heading TEXT NOT NULL DEFAULT 'Ready to Transform Your Smile?',
        highlight_text VARCHAR(255) DEFAULT 'Transform Your Smile',
        subheading TEXT DEFAULT 'Experience patient-centered care with our English-speaking experts',
        button_label VARCHAR(255) NOT NULL DEFAULT 'Book Consultation',
        button_link VARCHAR(255) NOT NULL DEFAULT '/contact'
      )
    `);

    console.log("✓ Created components_homepage_homepage_ctas table");

    console.log("Step 2: Finding existing homepage CTA data...");

    // Find the current CTA component in homepage
    const ctaResult = await client.query(`
      SELECT hc.id as homepage_id, hc.cmp_id, hc.component_type, hc."order",
             cta.heading, cta.highlight_text, cta.button_label, cta.button_link
      FROM homepages_cmps hc
      JOIN components_homepage_ctas cta ON hc.cmp_id = cta.id
      WHERE hc.component_type = 'homepage.cta'
      ORDER BY hc.entity_id, hc."order"
    `);

    console.log(`✓ Found ${ctaResult.rows.length} homepage CTA entries`);

    if (ctaResult.rows.length > 0) {
      console.log("Step 3: Migrating CTA data to new table...");

      for (const row of ctaResult.rows) {
        // Create new homepage-specific CTA
        const newCtaResult = await client.query(
          `
          INSERT INTO components_homepage_homepage_ctas (
            heading,
            highlight_text,
            subheading,
            button_label,
            button_link
          ) VALUES (
            $1,
            $2,
            'Experience patient-centered care with our English-speaking experts',
            $3,
            $4
          )
          RETURNING id
        `,
          [
            row.heading || "Ready to Transform Your Smile?",
            row.highlight_text || "Transform Your Smile",
            row.button_label || "Book Consultation",
            row.button_link || "/contact",
          ],
        );

        const newCtaId = newCtaResult.rows[0].id;
        console.log(
          `✓ Created new homepage CTA (ID: ${newCtaId}) from old CTA (ID: ${row.cmp_id})`,
        );

        // Update homepage_cmps to reference new component
        await client.query(
          `
          UPDATE homepages_cmps
          SET cmp_id = $1,
              component_type = 'homepage.homepage-cta'
          WHERE id = $2
        `,
          [newCtaId, row.homepage_id],
        );

        console.log(
          `✓ Updated homepage_cmps (ID: ${row.homepage_id}) to use new CTA`,
        );
      }
    } else {
      console.log("⚠ No existing homepage CTA found - will use defaults");
    }

    console.log("Step 4: Verifying migration...");

    // Verify the new data
    const verifyResult = await client.query(`
      SELECT hc.id, hc.entity_id, hc.cmp_id, hc.component_type,
             cta.heading, cta.button_label
      FROM homepages_cmps hc
      JOIN components_homepage_homepage_ctas cta ON hc.cmp_id = cta.id
      WHERE hc.component_type = 'homepage.homepage-cta'
    `);

    console.log(
      `✓ Verified ${verifyResult.rows.length} homepage-specific CTA entries`,
    );

    await client.query("COMMIT");
    console.log("\nMigration 114 completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Restart Strapi to register the new component");
    console.log(
      "2. Update frontend to use separate HomepageCTABlock component",
    );
    console.log("3. Test the homepage CTA section");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
