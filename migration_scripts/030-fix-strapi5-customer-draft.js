#!/usr/bin/env node

/**
 * Migration Script: Fix Strapi 5 Customer Draft & Permissions
 */

const { Client } = require("pg");
const crypto = require("crypto");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function fixStrapi5Customer() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(80));
  console.log("MIGRATION: Fix Strapi 5 Customer Draft & Permissions");
  console.log("=".repeat(80));

  try {
    await client.connect();
    console.log("[OK] Connected to database\n");

    // =========================================================================
    // PART 0: DROP STRICT UNIQUE CONSTRAINT
    // =========================================================================
    console.log("PART 0: Dropping strict UNIQUE constraint on document_id...");
    try {
      await client.query("ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_document_id_key CASCADE");
      console.log("  [OK] Constraint dropped");
    } catch (e) {
      console.log("  [SKIP] Constraint might not exist: " + e.message);
    }

    // =========================================================================
    // PART 1: GRANT PERMISSIONS (Fixes the 404 error)
    // =========================================================================
    console.log("\nPART 1: Granting API permissions...");
    
    const rolesResult = await client.query("SELECT id, type FROM up_roles WHERE type IN ('public', 'authenticated')");
    const roles = rolesResult.rows;

    for (const role of roles) {
      const permCheck = await client.query(
        `SELECT p.id FROM up_permissions p 
         JOIN up_permissions_role_lnk l ON p.id = l.permission_id 
         WHERE p.action = $1 AND l.role_id = $2`,
        ["api::customer.customer.find", role.id]
      );

      if (permCheck.rows.length === 0) {
        const documentId = crypto.randomBytes(12).toString('hex');
        const insertPermRes = await client.query(
          "INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at) VALUES ($1, $2, NOW(), NOW(), NOW()) RETURNING id",
          [documentId, "api::customer.customer.find"]
        );
        const permissionId = insertPermRes.rows[0].id;

        await client.query(
          "INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES ($1, $2, 1)",
          [permissionId, role.id]
        );
        
        console.log(`  [OK] Granted 'customer.find' to role: ${role.type} (ID: ${role.id})`);
      } else {
        console.log(`  [SKIP] Permission already exists for role: ${role.type}`);
      }
    }

    // =========================================================================
    // PART 2: ENSURE DRAFT RECORD (Fixes empty CMS layout)
    // =========================================================================
    console.log("\nPART 2: Ensuring DRAFT record exists for Single Type...");
    
    // 1. Find the published record
    const pubRecordRes = await client.query(
      "SELECT * FROM customers WHERE document_id = 'customers-singleton' AND published_at IS NOT NULL"
    );

    if (pubRecordRes.rows.length === 0) {
      console.log("  [ERROR] No published customer record found. Please run 029 first.");
      return;
    }

    const pubRecord = pubRecordRes.rows[0];
    const pubId = pubRecord.id;

    // 2. Check if Draft record exists
    const draftRecordRes = await client.query(
      "SELECT * FROM customers WHERE document_id = 'customers-singleton' AND published_at IS NULL"
    );

    let draftId;
    if (draftRecordRes.rows.length === 0) {
      console.log("  [INFO] Creating Draft record...");
      const insertDraftRes = await client.query(
        `INSERT INTO customers (document_id, title, description, published_at, created_at, updated_at, locale)
         VALUES ($1, $2, $3, NULL, NOW(), NOW(), $4) RETURNING id`,
        [pubRecord.document_id, pubRecord.title, pubRecord.description, pubRecord.locale]
      );
      draftId = insertDraftRes.rows[0].id;
      console.log(`  [OK] Created Draft record with ID: ${draftId}`);
    } else {
      draftId = draftRecordRes.rows[0].id;
      console.log(`  [SKIP] Draft record already exists with ID: ${draftId}`);
      
      // Update data just in case
      await client.query(
        "UPDATE customers SET title = $1, description = $2, updated_at = NOW() WHERE id = $3",
        [pubRecord.title, pubRecord.description, draftId]
      );
    }

    // 3. Sync components to Draft record
    console.log("\nPART 3: Syncing components to Draft record...");
    await client.query("DELETE FROM customers_cmps WHERE entity_id = $1", [draftId]);
    const components = await client.query(
      "SELECT cmp_id, component_type, field, \"order\" FROM customers_cmps WHERE entity_id = $1",
      [pubId]
    );

    for (const cmp of components.rows) {
      await client.query(
        "INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, $4, $5)",
        [draftId, cmp.cmp_id, cmp.component_type, cmp.field, cmp.order]
      );
    }
    console.log(`  [OK] Synced ${components.rows.length} components to Draft record.`);

    // =========================================================================
    // PART 4: FIX IMAGE PATHS
    // =========================================================================
    console.log("\nPART 4: Fixing image paths in hero component...");
    const heroRes = await client.query("SELECT id, images FROM components_customer_hero");
    for (const hero of heroRes.rows) {
      if (hero.images && typeof hero.images === 'string') {
        const images = JSON.parse(hero.images);
        let changed = false;
        const newImages = images.map(img => {
          if (img.path && !img.path.startsWith('/')) {
            img.path = '/' + img.path;
            changed = true;
          }
          return img;
        });

        if (changed) {
          await client.query(
            "UPDATE components_customer_hero SET images = $1 WHERE id = $2",
            [JSON.stringify(newImages), hero.id]
          );
          console.log(`  [OK] Fixed paths for Hero component ID: ${hero.id}`);
        }
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("\n[ERROR] Migration failed:", error.message);
  } finally {
    await client.end();
  }
}

fixStrapi5Customer();
