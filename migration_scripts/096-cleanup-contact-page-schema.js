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
    console.log("Connected to database");

    const contactPageId = 6;
    console.log("Step 1: Getting component links...");
    const linksResult = await client.query(
      `
      SELECT field, component_type, cmp_id, "order"
      FROM contact_pages_cmps
      WHERE entity_id = $1
      ORDER BY field
    `,
      [contactPageId],
    );

    console.log(`Found ${linksResult.rows.length} component links`);
    linksResult.rows.forEach((link) => {
      console.log(
        `- ${link.field}: ${link.component_type} (ID: ${link.cmp_id})`,
      );
    });

    const heroLink = linksResult.rows.find((l) => l.field === "hero");
    const contactFormLink = linksResult.rows.find(
      (l) => l.field === "contact_form",
    );

    if (!heroLink || !contactFormLink) {
      console.log("Missing hero or contact_form");
      return;
    }

    console.log(
      `Hero ID: ${heroLink.cmp_id}, Form ID: ${contactFormLink.cmp_id}`,
    );

    console.log("Step 2: Creating hero component links table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_heroes_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION
      )
    `);

    console.log("Step 3: Adding contact_form to hero...");
    const existingLink = await client.query(
      `
      SELECT * FROM components_contact_heroes_cmps
      WHERE entity_id = $1 AND field = 'contact_form'
    `,
      [heroLink.cmp_id],
    );

    if (existingLink.rows.length === 0) {
      await client.query(
        `
        INSERT INTO components_contact_heroes_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'contact.contact-form', 'contact_form', 1)
      `,
        [heroLink.cmp_id, contactFormLink.cmp_id],
      );
      console.log("Added contact_form to hero");
    } else {
      console.log("contact_form already linked to hero");
    }

    console.log(
      "Step 4: Removing contact_form and contact_info from contact_pages...",
    );
    const deleteResult = await client.query(
      `
      DELETE FROM contact_pages_cmps
      WHERE entity_id = $1 AND field IN ('contact_form', 'contact_info')
      RETURNING field
    `,
      [contactPageId],
    );

    deleteResult.rows.forEach((row) => {
      console.log(`Removed ${row.field}`);
    });

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
