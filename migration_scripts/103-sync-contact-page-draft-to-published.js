/**
 * Migration Script 103: Sync Contact Page Draft to Published Version
 *
 * Issue: Strapi v5 Draft & Publish bug - when clicking "Publish" in the CMS,
 * it creates a new published record but doesn't copy the component links,
 * causing data to appear lost.
 *
 * This script:
 * 1. Copies all component links from draft (ID: 6) to published (ID: 68)
 * 2. Duplicates the actual component data (hero, elite_stack, faq, final_cta)
 * 3. Updates the component links to point to the new duplicated components
 *
 * This is a workaround for the Strapi v5 polymorphic media serialization bug.
 */

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
    console.log("✅ Connected to database");

    const DRAFT_ID = 6;
    const PUBLISHED_ID = 68;

    // Step 1: Get draft components
    console.log("\n📝 Step 1: Fetching draft components...");
    const draftComponents = await client.query(
      `
      SELECT * FROM contact_pages_cmps 
      WHERE entity_id = $1 
      ORDER BY "order"
    `,
      [DRAFT_ID],
    );

    console.log(`Found ${draftComponents.rows.length} components in draft`);
    console.table(draftComponents.rows);

    // Step 2: Duplicate hero component
    console.log("\n📝 Step 2: Duplicating hero component...");
    const heroComponent = draftComponents.rows.find((c) => c.field === "hero");

    if (heroComponent) {
      // Get original hero data
      const originalHero = await client.query(
        "SELECT * FROM components_contact_heroes WHERE id = $1",
        [heroComponent.cmp_id],
      );

      if (originalHero.rows.length > 0) {
        const hero = originalHero.rows[0];

        // Insert new hero component
        const newHero = await client.query(
          `
          INSERT INTO components_contact_heroes (title, subtitle, background_image_id)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
          [hero.title, hero.subtitle, hero.background_image_id],
        );

        const newHeroId = newHero.rows[0].id;
        console.log(`✅ Created new hero component: ${newHeroId}`);

        // Get hero nested components (contact_form)
        const heroNested = await client.query(
          "SELECT * FROM components_contact_heroes_cmps WHERE entity_id = $1",
          [heroComponent.cmp_id],
        );

        if (heroNested.rows.length > 0) {
          const contactFormLink = heroNested.rows[0];

          // Get original contact form data
          const originalForm = await client.query(
            "SELECT * FROM components_contact_contact_forms WHERE id = $1",
            [contactFormLink.cmp_id],
          );

          if (originalForm.rows.length > 0) {
            const form = originalForm.rows[0];

            // Insert new contact form
            const newForm = await client.query(
              `
              INSERT INTO components_contact_contact_forms (
                title, description, name_label, name_placeholder, phone_label, 
                phone_placeholder, service_label, service_placeholder, service_options,
                message_label, message_placeholder, submit_button_text, success_message,
                error_message, email_label, email_placeholder
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
              RETURNING id
            `,
              [
                form.title,
                form.description,
                form.name_label,
                form.name_placeholder,
                form.phone_label,
                form.phone_placeholder,
                form.service_label,
                form.service_placeholder,
                form.service_options,
                form.message_label,
                form.message_placeholder,
                form.submit_button_text,
                form.success_message,
                form.error_message,
                form.email_label,
                form.email_placeholder,
              ],
            );

            const newFormId = newForm.rows[0].id;
            console.log(`✅ Created new contact form: ${newFormId}`);

            // Link contact form to new hero
            await client.query(
              `
              INSERT INTO components_contact_heroes_cmps (entity_id, cmp_id, component_type, field, "order")
              VALUES ($1, $2, $3, $4, $5)
            `,
              [newHeroId, newFormId, "contact.contact-form", "contact_form", 1],
            );

            console.log(`✅ Linked contact form to hero`);
          }
        }

        // Link new hero to published page
        await client.query(
          `
          INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, $3, $4, $5)
        `,
          [PUBLISHED_ID, newHeroId, "contact.hero", "hero", 1],
        );

        console.log(`✅ Linked hero to published page`);
      }
    }

    // Step 3: Link elite_stack component
    console.log("\n📝 Step 3: Linking elite_stack component...");
    const eliteStackComponent = draftComponents.rows.find(
      (c) => c.field === "elite_stack",
    );

    if (eliteStackComponent) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          PUBLISHED_ID,
          eliteStackComponent.cmp_id,
          eliteStackComponent.component_type,
          "elite_stack",
          2,
        ],
      );

      console.log(
        `✅ Linked elite_stack (ID: ${eliteStackComponent.cmp_id}) to published page`,
      );
    }

    // Step 4: Link faq component
    console.log("\n📝 Step 4: Linking faq component...");
    const faqComponent = draftComponents.rows.find((c) => c.field === "faq");

    if (faqComponent) {
      // Check if FAQ already exists for published version
      const existingFaq = await client.query(
        `
        SELECT * FROM contact_pages_cmps 
        WHERE entity_id = $1 AND field = 'faq'
      `,
        [PUBLISHED_ID],
      );

      if (existingFaq.rows.length === 0) {
        await client.query(
          `
          INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, $3, $4, $5)
        `,
          [
            PUBLISHED_ID,
            faqComponent.cmp_id,
            faqComponent.component_type,
            "faq",
            3,
          ],
        );

        console.log(
          `✅ Linked faq (ID: ${faqComponent.cmp_id}) to published page`,
        );
      } else {
        console.log(`ℹ️  FAQ already linked to published page`);
      }
    }

    // Step 5: Link final_cta component
    console.log("\n📝 Step 5: Linking final_cta component...");
    const ctaComponent = draftComponents.rows.find(
      (c) => c.field === "final_cta",
    );

    if (ctaComponent) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          PUBLISHED_ID,
          ctaComponent.cmp_id,
          ctaComponent.component_type,
          "final_cta",
          4,
        ],
      );

      console.log(
        `✅ Linked final_cta (ID: ${ctaComponent.cmp_id}) to published page`,
      );
    }

    // Step 6: Verify the result
    console.log("\n🔍 Step 6: Verifying the result...");

    const publishedComponents = await client.query(
      `
      SELECT 
        cp.id,
        cp.document_id,
        cp.published_at,
        cpc.field,
        cpc.order,
        cpc.component_type,
        cpc.cmp_id
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id
      WHERE cp.id = $1
      ORDER BY cpc.order
    `,
      [PUBLISHED_ID],
    );

    console.log("\n📊 Published contact page components:");
    console.table(publishedComponents.rows);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Restart Strapi to clear cache");
    console.log("2. Check contact page in Strapi admin");
    console.log(
      "3. Verify API response at: https://guild-biblical-expectations-easily.trycloudflare.com/api/contact-page",
    );
    console.log("4. Test the contact page at: http://localhost:3000/contact");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

migrate();
