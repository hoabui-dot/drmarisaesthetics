const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function migrate() {
  try {
    await client.connect();
    console.log("Connected to database\n");

    const documentId = "w6l20x2kkku0xljbzd074nz7";

    // Step 1: Get both draft and published records
    console.log("Step 1: Finding draft and published records...");
    const records = await client.query(
      `
      SELECT id, document_id, published_at
      FROM contact_pages
      WHERE document_id = $1
      ORDER BY published_at NULLS FIRST
    `,
      [documentId],
    );

    if (records.rows.length !== 2) {
      console.log(`ERROR: Expected 2 records, found ${records.rows.length}`);
      return;
    }

    const draftId = records.rows[0].id;
    const publishedId = records.rows[1].id;

    console.log(`  Draft ID: ${draftId}`);
    console.log(`  Published ID: ${publishedId}`);

    // Step 2: Get draft component links
    console.log("\nStep 2: Getting draft component links...");
    const draftLinks = await client.query(
      `
      SELECT field, component_type, cmp_id
      FROM contact_pages_cmps
      WHERE entity_id = $1
      ORDER BY field
    `,
      [draftId],
    );

    console.log(`  Found ${draftLinks.rows.length} draft links:`);
    draftLinks.rows.forEach((link) => {
      console.log(
        `    - ${link.field}: ${link.component_type} (cmp_id: ${link.cmp_id})`,
      );
    });

    // Step 3: Delete old published links
    console.log("\nStep 3: Deleting old published links...");
    const deleteResult = await client.query(
      `
      DELETE FROM contact_pages_cmps
      WHERE entity_id = $1
      RETURNING field
    `,
      [publishedId],
    );

    console.log(`  Deleted ${deleteResult.rows.length} old links`);

    // Step 4: Copy draft links to published
    console.log("\nStep 4: Copying draft links to published...");
    for (const link of draftLinks.rows) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, 1)
      `,
        [publishedId, link.cmp_id, link.component_type, link.field],
      );
      console.log(`  Copied: ${link.field}`);
    }

    // Step 5: Get hero component ID from published record
    console.log("\nStep 5: Getting hero component from published record...");
    const publishedHero = await client.query(
      `
      SELECT cmp_id
      FROM contact_pages_cmps
      WHERE entity_id = $1 AND field = 'hero'
    `,
      [publishedId],
    );

    if (publishedHero.rows.length === 0) {
      console.log("  ERROR: No hero found in published record");
      return;
    }

    const publishedHeroId = publishedHero.rows[0].cmp_id;
    console.log(`  Published hero ID: ${publishedHeroId}`);

    // Step 6: Get draft hero component ID
    const draftHero = await client.query(
      `
      SELECT cmp_id
      FROM contact_pages_cmps
      WHERE entity_id = $1 AND field = 'hero'
    `,
      [draftId],
    );

    const draftHeroId = draftHero.rows[0].cmp_id;
    console.log(`  Draft hero ID: ${draftHeroId}`);

    // Step 7: Get contact_form from draft hero
    console.log("\nStep 6: Getting contact_form from draft hero...");
    const draftHeroForm = await client.query(
      `
      SELECT cmp_id
      FROM components_contact_heroes_cmps
      WHERE entity_id = $1 AND field = 'contact_form'
    `,
      [draftHeroId],
    );

    if (draftHeroForm.rows.length === 0) {
      console.log("  ERROR: No contact_form found in draft hero");
      return;
    }

    const contactFormId = draftHeroForm.rows[0].cmp_id;
    console.log(`  Contact form ID: ${contactFormId}`);

    // Step 8: Add contact_form to published hero
    console.log("\nStep 7: Adding contact_form to published hero...");

    // Check if already exists
    const existingLink = await client.query(
      `
      SELECT * FROM components_contact_heroes_cmps
      WHERE entity_id = $1 AND field = 'contact_form'
    `,
      [publishedHeroId],
    );

    if (existingLink.rows.length > 0) {
      console.log("  Already exists, updating...");
      await client.query(
        `
        UPDATE components_contact_heroes_cmps
        SET cmp_id = $1
        WHERE entity_id = $2 AND field = 'contact_form'
      `,
        [contactFormId, publishedHeroId],
      );
    } else {
      console.log("  Creating new link...");
      await client.query(
        `
        INSERT INTO components_contact_heroes_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'contact.contact-form', 'contact_form', 1)
      `,
        [publishedHeroId, contactFormId],
      );
    }

    console.log("  Done!");

    // Step 9: Verify
    console.log("\nStep 8: Verifying...");
    const finalLinks = await client.query(
      `
      SELECT field, component_type, cmp_id
      FROM contact_pages_cmps
      WHERE entity_id = $1
      ORDER BY field
    `,
      [publishedId],
    );

    console.log(`  Published record links (${finalLinks.rows.length}):`);
    finalLinks.rows.forEach((link) => {
      console.log(
        `    - ${link.field}: ${link.component_type} (cmp_id: ${link.cmp_id})`,
      );
    });

    const heroFormLink = await client.query(
      `
      SELECT field, component_type, cmp_id
      FROM components_contact_heroes_cmps
      WHERE entity_id = $1
    `,
      [publishedHeroId],
    );

    console.log(`\n  Published hero links (${heroFormLink.rows.length}):`);
    heroFormLink.rows.forEach((link) => {
      console.log(
        `    - ${link.field}: ${link.component_type} (cmp_id: ${link.cmp_id})`,
      );
    });

    console.log("\n✅ Migration completed successfully!");
    console.log("\nNext step: Restart Strapi and test the API");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
