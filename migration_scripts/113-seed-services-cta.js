/**
 * Migration Script 113: Seed Services CTA Data
 *
 * Purpose: Create initial CTA data for services pages using existing CTA background image
 *
 * Context: Services pages now use shared CTA from CMS instead of hardcoded data
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

    console.log("Step 1: Creating CTA component for services...");

    // Create the CTA component
    const ctaResult = await client.query(`
      INSERT INTO components_homepage_ctas (
        heading,
        highlight_text,
        button_label,
        button_link
      ) VALUES (
        'Ready to Transform Your Smile?',
        'Transform Your Smile',
        'Book Free Consultation',
        '/contact'
      )
      RETURNING id
    `);

    const ctaId = ctaResult.rows[0].id;
    console.log(`✓ Created CTA component (ID: ${ctaId})`);

    console.log("Step 2: Linking background image to CTA...");

    // Find the CTA background image (ID: 63 from earlier)
    const imageCheck = await client.query(`
      SELECT id FROM files WHERE id = 63
    `);

    if (imageCheck.rows.length > 0) {
      // Link the background image using files_related_mph (Strapi v5 media relation)
      await client.query(
        `
        INSERT INTO files_related_mph (
          file_id,
          related_id,
          related_type,
          field,
          "order"
        ) VALUES (
          63,
          $1,
          'components_homepage_ctas',
          'background_image',
          1
        )
      `,
        [ctaId],
      );

      console.log("✓ Linked background image to CTA");
    } else {
      console.log("⚠ Background image (ID: 63) not found, skipping link");
    }

    console.log("Step 3: Creating services_ctas single type entry...");

    // Get current timestamp
    const now = new Date().toISOString();

    // Create the services_ctas entry (draft)
    const draftResult = await client.query(
      `
      INSERT INTO services_ctas (
        document_id,
        published_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid()::text,
        NULL,
        $1,
        $1
      )
      RETURNING id, document_id
    `,
      [now],
    );

    const draftId = draftResult.rows[0].id;
    const documentId = draftResult.rows[0].document_id;
    console.log(
      `✓ Created draft services_ctas (ID: ${draftId}, document_id: ${documentId})`,
    );

    // Link CTA component to draft
    await client.query(
      `
      INSERT INTO services_ctas_cmps (
        entity_id,
        cmp_id,
        component_type,
        field,
        "order"
      ) VALUES (
        $1,
        $2,
        'homepage.cta',
        'cta',
        1
      )
    `,
      [draftId, ctaId],
    );

    console.log("✓ Linked CTA to draft services_ctas");

    // Create published version
    const publishedResult = await client.query(
      `
      INSERT INTO services_ctas (
        document_id,
        published_at,
        created_at,
        updated_at
      ) VALUES (
        $1,
        $2,
        $2,
        $2
      )
      RETURNING id
    `,
      [documentId, now],
    );

    const publishedId = publishedResult.rows[0].id;
    console.log(`✓ Created published services_ctas (ID: ${publishedId})`);

    // Duplicate CTA component for published version
    const publishedCtaResult = await client.query(`
      INSERT INTO components_homepage_ctas (
        heading,
        highlight_text,
        button_label,
        button_link
      ) VALUES (
        'Ready to Transform Your Smile?',
        'Transform Your Smile',
        'Book Free Consultation',
        '/contact'
      )
      RETURNING id
    `);

    const publishedCtaId = publishedCtaResult.rows[0].id;
    console.log(`✓ Created published CTA component (ID: ${publishedCtaId})`);

    // Link background image to published CTA
    if (imageCheck.rows.length > 0) {
      await client.query(
        `
        INSERT INTO files_related_mph (
          file_id,
          related_id,
          related_type,
          field,
          "order"
        ) VALUES (
          63,
          $1,
          'components_homepage_ctas',
          'background_image',
          1
        )
      `,
        [publishedCtaId],
      );

      console.log("✓ Linked background image to published CTA");
    }

    // Link published CTA to published services_ctas
    await client.query(
      `
      INSERT INTO services_ctas_cmps (
        entity_id,
        cmp_id,
        component_type,
        field,
        "order"
      ) VALUES (
        $1,
        $2,
        'homepage.cta',
        'cta',
        1
      )
    `,
      [publishedId, publishedCtaId],
    );

    console.log("✓ Linked CTA to published services_ctas");

    await client.query("COMMIT");
    console.log("Migration 113 completed successfully!");
    console.log(
      `\nServices CTA is now available at: https://guild-biblical-expectations-easily.trycloudflare.com/api/services-cta`,
    );
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
