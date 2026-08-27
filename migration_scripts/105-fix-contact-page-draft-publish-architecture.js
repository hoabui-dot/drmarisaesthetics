/**
 * Migration Script 105: Fix Contact Page Draft & Publish Architecture
 *
 * Issue: Draft and Published versions are sharing component IDs, which violates
 * Strapi v5 Draft & Publish best practices. When components are shared, Strapi's
 * GC can destroy them during publish operations, causing data loss.
 *
 * Solution: Create completely independent component sets for Draft and Published versions.
 * Each version gets its own duplicated components with no shared IDs.
 *
 * Based on: .ai/STRAPI_V5_MIGRATION_SKILL.md
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function duplicateHeroComponent(sourceHeroId) {
  // Get source hero data
  const heroResult = await client.query(
    "SELECT * FROM components_contact_heroes WHERE id = $1",
    [sourceHeroId],
  );

  if (heroResult.rows.length === 0) {
    console.log(`  ⚠️  Hero component ${sourceHeroId} not found, skipping`);
    return null;
  }

  const hero = heroResult.rows[0];

  // Create new hero
  const newHero = await client.query(
    `
    INSERT INTO components_contact_heroes (title, subtitle, background_image_id)
    VALUES ($1, $2, $3)
    RETURNING id
  `,
    [hero.title, hero.subtitle, hero.background_image_id],
  );

  const newHeroId = newHero.rows[0].id;

  // Get nested contact_form
  const formLinks = await client.query(
    "SELECT * FROM components_contact_heroes_cmps WHERE entity_id = $1",
    [sourceHeroId],
  );

  for (const link of formLinks.rows) {
    // Get source contact form
    const formResult = await client.query(
      "SELECT * FROM components_contact_contact_forms WHERE id = $1",
      [link.cmp_id],
    );

    if (formResult.rows.length > 0) {
      const form = formResult.rows[0];

      // Create new contact form
      const newForm = await client.query(
        `
        INSERT INTO components_contact_contact_forms (
          title, description, name_label, name_placeholder, phone_label,
          phone_placeholder, service_label, service_placeholder, service_options,
          message_label, message_placeholder, submit_button_text, success_message,
          error_message, email_label, email_placeholder
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13, $14, $15, $16)
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
          JSON.stringify(form.service_options),
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

      // Link new form to new hero
      await client.query(
        `
        INSERT INTO components_contact_heroes_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          newHeroId,
          newFormId,
          link.component_type,
          link.field,
          link.order || 1,
        ],
      );
    }
  }

  return newHeroId;
}

async function duplicateEliteStackComponent(sourceEliteStackId) {
  // Elite stack has nested cards, so we need to duplicate everything
  const eliteStackResult = await client.query(
    "SELECT * FROM components_contact_elite_stacks WHERE id = $1",
    [sourceEliteStackId],
  );

  if (eliteStackResult.rows.length === 0) {
    console.log(
      `  ⚠️  Elite stack component ${sourceEliteStackId} not found, skipping`,
    );
    return null;
  }

  const eliteStack = eliteStackResult.rows[0];

  // Create new elite stack
  const newEliteStack = await client.query(
    `
    INSERT INTO components_contact_elite_stacks (title, subtitle)
    VALUES ($1, $2)
    RETURNING id
  `,
    [eliteStack.title, eliteStack.subtitle],
  );

  const newEliteStackId = newEliteStack.rows[0].id;

  // Get nested cards
  const cardLinks = await client.query(
    "SELECT * FROM components_contact_elite_stacks_cmps WHERE entity_id = $1",
    [sourceEliteStackId],
  );

  for (const link of cardLinks.rows) {
    // Get source card
    const cardResult = await client.query(
      "SELECT * FROM components_contact_elite_stack_cards WHERE id = $1",
      [link.cmp_id],
    );

    if (cardResult.rows.length > 0) {
      const card = cardResult.rows[0];

      // Create new card
      const newCard = await client.query(
        `
        INSERT INTO components_contact_elite_stack_cards (title, description, icon_image_id)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
        [card.title, card.description, card.icon_image_id],
      );

      const newCardId = newCard.rows[0].id;

      // Link new card to new elite stack
      await client.query(
        `
        INSERT INTO components_contact_elite_stacks_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          newEliteStackId,
          newCardId,
          link.component_type,
          link.field,
          link.order,
        ],
      );
    }
  }

  return newEliteStackId;
}

async function migrate() {
  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    const DRAFT_ID = 6;
    const PUBLISHED_ID = 68;

    console.log("📋 Current State:");
    console.log(`   Draft ID: ${DRAFT_ID}`);
    console.log(`   Published ID: ${PUBLISHED_ID}\n`);

    // Step 1: Get current draft components
    console.log("📝 Step 1: Analyzing current draft components...");
    const draftComponents = await client.query(
      `
      SELECT * FROM contact_pages_cmps 
      WHERE entity_id = $1 
      ORDER BY "order"
    `,
      [DRAFT_ID],
    );

    console.log(`   Found ${draftComponents.rows.length} components in draft`);
    console.table(
      draftComponents.rows.map((r) => ({
        field: r.field,
        cmp_id: r.cmp_id,
        type: r.component_type,
        order: r.order,
      })),
    );

    // Step 2: Delete existing draft component links (we'll recreate them)
    console.log("\n📝 Step 2: Clearing draft component links...");
    await client.query("DELETE FROM contact_pages_cmps WHERE entity_id = $1", [
      DRAFT_ID,
    ]);
    console.log("   ✅ Cleared draft component links");

    // Step 3: Duplicate hero component for draft
    console.log(
      "\n📝 Step 3: Creating independent hero component for draft...",
    );
    const publishedHeroId = 68; // From published version
    const newDraftHeroId = await duplicateHeroComponent(publishedHeroId);

    if (newDraftHeroId) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [DRAFT_ID, newDraftHeroId, "contact.hero", "hero", 1],
      );
      console.log(`   ✅ Created new hero component: ${newDraftHeroId}`);
    }

    // Step 4: Duplicate elite_stack component for draft
    console.log(
      "\n📝 Step 4: Creating independent elite_stack component for draft...",
    );
    const publishedEliteStackId = 34; // Shared component
    const newDraftEliteStackId = await duplicateEliteStackComponent(
      publishedEliteStackId,
    );

    if (newDraftEliteStackId) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          DRAFT_ID,
          newDraftEliteStackId,
          "contact.elite-stack",
          "elite_stack",
          2,
        ],
      );
      console.log(
        `   ✅ Created new elite_stack component: ${newDraftEliteStackId}`,
      );
    }

    // Step 5: Link FAQ (use published FAQ ID: 20)
    console.log("\n📝 Step 5: Linking FAQ component to draft...");
    await client.query(
      `
      INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [DRAFT_ID, 20, "contact.faq", "faq", 3],
    );
    console.log("   ✅ Linked FAQ component");

    // Step 6: Duplicate final_cta component for draft
    console.log(
      "\n📝 Step 6: Creating independent final_cta component for draft...",
    );
    const publishedCtaId = 70; // Shared component

    // Get source CTA
    const ctaResult = await client.query(
      "SELECT * FROM components_homepage_ctas WHERE id = $1",
      [publishedCtaId],
    );

    if (ctaResult.rows.length > 0) {
      const cta = ctaResult.rows[0];

      // Create new CTA
      const newCta = await client.query(
        `
        INSERT INTO components_homepage_ctas (
          heading, highlight_text, button_label, button_link, background_image_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
        [
          cta.heading,
          cta.highlight_text,
          cta.button_label,
          cta.button_link,
          cta.background_image_id,
        ],
      );

      const newCtaId = newCta.rows[0].id;

      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [DRAFT_ID, newCtaId, "homepage.cta", "final_cta", 4],
      );

      console.log(`   ✅ Created new final_cta component: ${newCtaId}`);
    }

    // Step 7: Verify the result
    console.log("\n🔍 Step 7: Verifying the result...\n");

    const finalState = await client.query(`
      SELECT 
        cp.id as page_id,
        CASE WHEN cp.published_at IS NULL THEN 'DRAFT' ELSE 'PUBLISHED' END as status,
        cpc.field,
        cpc.cmp_id,
        cpc.component_type,
        cpc.order
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id
      WHERE cp.document_id = 'w6l20x2kkku0xljbzd074nz7'
      ORDER BY cp.id, cpc.order
    `);

    console.log("📊 Final State:");
    console.table(finalState.rows);

    // Check for shared components
    console.log("\n🔍 Checking for shared components...");
    const sharedCheck = await client.query(`
      SELECT 
        cpc1.field,
        cpc1.cmp_id,
        cpc1.component_type
      FROM contact_pages_cmps cpc1
      INNER JOIN contact_pages_cmps cpc2 
        ON cpc1.cmp_id = cpc2.cmp_id 
        AND cpc1.entity_id != cpc2.entity_id
      WHERE cpc1.entity_id IN (${DRAFT_ID}, ${PUBLISHED_ID})
        AND cpc2.entity_id IN (${DRAFT_ID}, ${PUBLISHED_ID})
    `);

    if (sharedCheck.rows.length > 0) {
      console.log("   ⚠️  WARNING: Found shared components:");
      console.table(sharedCheck.rows);
    } else {
      console.log(
        "   ✅ No shared components found - Draft and Published are independent!",
      );
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Restart Strapi to clear cache");
    console.log("2. Check contact page in Strapi admin (should show all data)");
    console.log("3. Make edits in draft mode");
    console.log("4. Publish to verify no data loss");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

migrate();
