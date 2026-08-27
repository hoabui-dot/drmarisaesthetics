/**
 * Migration Script 106: Simple Contact Page Draft Fix
 *
 * Issue: Draft version is missing components (elite_stack and final_cta)
 *
 * Solution: Add the missing components to draft with proper order values
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
    console.log("✅ Connected to database\n");

    const DRAFT_ID = 6;

    // Step 1: Check current draft state
    console.log("📝 Step 1: Checking current draft state...");
    const currentDraft = await client.query(
      `
      SELECT field, cmp_id, component_type, "order"
      FROM contact_pages_cmps 
      WHERE entity_id = $1
      ORDER BY "order"
    `,
      [DRAFT_ID],
    );

    console.log("Current draft components:");
    console.table(currentDraft.rows);

    // Step 2: Add elite_stack if missing
    console.log("\n📝 Step 2: Adding elite_stack component...");
    const hasEliteStack = currentDraft.rows.some(
      (r) => r.field === "elite_stack",
    );

    if (!hasEliteStack) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [DRAFT_ID, 33, "contact.elite-stack", "elite_stack", 2],
      );
      console.log("   ✅ Added elite_stack component (ID: 33)");
    } else {
      console.log("   ℹ️  Elite stack already exists");
    }

    // Step 3: Add final_cta if missing
    console.log("\n📝 Step 3: Adding final_cta component...");
    const hasFinalCta = currentDraft.rows.some((r) => r.field === "final_cta");

    if (!hasFinalCta) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [DRAFT_ID, 72, "homepage.cta", "final_cta", 4],
      );
      console.log("   ✅ Added final_cta component (ID: 72)");
    } else {
      console.log("   ℹ️  Final CTA already exists");
    }

    // Step 4: Verify final state
    console.log("\n🔍 Step 4: Verifying final state...\n");
    const finalDraft = await client.query(`
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
    console.table(finalDraft.rows);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Restart Strapi to clear cache");
    console.log("2. Check contact page in Strapi admin");
    console.log("3. Verify all sections are visible");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

migrate();
