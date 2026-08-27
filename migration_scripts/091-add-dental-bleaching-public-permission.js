#!/usr/bin/env node

/**
 * Migration Script 091: Add Public Permission for Dental Bleaching API
 *
 * Changes:
 *  1. Find the public role
 *  2. Create permission for dental-bleaching.find action
 *  3. Link permission to public role
 *
 * Run (dev):
 *   node migration_scripts/091-add-dental-bleaching-public-permission.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/091-add-dental-bleaching-public-permission.js
 */

const { Client } = require("pg");
const crypto = require("crypto");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 091: Add Public Permission for Dental Bleaching API");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Find public role ──────────────────────────────────────────────
    console.log("STEP 1: Finding public role...");

    const roleResult = await client.query(`
      SELECT id, document_id FROM up_roles WHERE type = 'public' LIMIT 1
    `);

    if (roleResult.rows.length === 0) {
      throw new Error("Public role not found");
    }

    const publicRoleId = roleResult.rows[0].id;
    const publicRoleDocId = roleResult.rows[0].document_id;
    console.log(
      `  [OK] Public role found: ID=${publicRoleId}, DocID=${publicRoleDocId}\n`,
    );

    // ── STEP 2: Check if permission already exists ────────────────────────────
    console.log("STEP 2: Checking if permission already exists...");

    const existingPerm = await client.query(`
      SELECT id FROM up_permissions 
      WHERE action = 'api::dental-bleaching.dental-bleaching.find'
      AND published_at IS NOT NULL
    `);

    if (existingPerm.rows.length > 0) {
      console.log("  [OK] Permission already exists, skipping creation\n");

      // Verify it's linked to public role
      const linkCheck = await client.query(
        `
        SELECT * FROM up_permissions_role_lnk 
        WHERE permission_id = $1 AND role_id = $2
      `,
        [existingPerm.rows[0].id, publicRoleId],
      );

      if (linkCheck.rows.length === 0) {
        console.log(
          "  [WARN] Permission exists but not linked to public role, linking now...",
        );
        await client.query(
          `
          INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
          VALUES ($1, $2, 1)
        `,
          [existingPerm.rows[0].id, publicRoleId],
        );
        console.log("  [OK] Permission linked to public role\n");
      } else {
        console.log("  [OK] Permission already linked to public role\n");
      }

      console.log("\n" + "=".repeat(70));
      console.log("MIGRATION 091 COMPLETED (PERMISSION ALREADY EXISTS)");
      console.log("=".repeat(70));
      return;
    }

    console.log("  [OK] Permission does not exist, creating...\n");

    // ── STEP 3: Create permission (Draft) ─────────────────────────────────────
    console.log("STEP 3: Creating permission (Draft)...");

    const documentId = crypto.randomBytes(12).toString("hex");

    const draftResult = await client.query(
      `
      INSERT INTO up_permissions (
        document_id,
        action,
        created_at,
        updated_at,
        published_at,
        locale
      ) VALUES (
        $1,
        'api::dental-bleaching.dental-bleaching.find',
        NOW(),
        NOW(),
        NULL,
        NULL
      )
      RETURNING id
    `,
      [documentId],
    );

    const draftPermId = draftResult.rows[0].id;
    console.log(`  [OK] Draft permission created: ID=${draftPermId}\n`);

    // ── STEP 4: Create permission (Published) ─────────────────────────────────
    console.log("STEP 4: Creating permission (Published)...");

    const publishedResult = await client.query(
      `
      INSERT INTO up_permissions (
        document_id,
        action,
        created_at,
        updated_at,
        published_at,
        locale
      ) VALUES (
        $1,
        'api::dental-bleaching.dental-bleaching.find',
        NOW(),
        NOW(),
        NOW(),
        NULL
      )
      RETURNING id
    `,
      [documentId],
    );

    const publishedPermId = publishedResult.rows[0].id;
    console.log(`  [OK] Published permission created: ID=${publishedPermId}\n`);

    // ── STEP 5: Link permission to public role ────────────────────────────────
    console.log("STEP 5: Linking permission to public role...");

    await client.query(
      `
      INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
      VALUES ($1, $2, 1)
    `,
      [publishedPermId, publicRoleId],
    );

    console.log("  [OK] Permission linked to public role\n");

    // ── STEP 6: Verify results ────────────────────────────────────────────────
    console.log("STEP 6: Verifying results...");

    const verification = await client.query(`
      SELECT 
        p.id,
        p.action,
        p.published_at,
        r.name as role_name
      FROM up_permissions p
      LEFT JOIN up_permissions_role_lnk l ON l.permission_id = p.id
      LEFT JOIN up_roles r ON r.id = l.role_id
      WHERE p.action = 'api::dental-bleaching.dental-bleaching.find'
      AND p.published_at IS NOT NULL
    `);

    if (verification.rows.length > 0) {
      const row = verification.rows[0];
      console.log("  Verification results:");
      console.log(`    Permission ID: ${row.id}`);
      console.log(`    Action: ${row.action}`);
      console.log(`    Published: ${row.published_at ? "Yes" : "No"}`);
      console.log(`    Role: ${row.role_name}`);
      console.log("  [OK] Verification passed\n");
    } else {
      throw new Error("Verification failed: Permission not found");
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 091 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi (optional)");
    console.log(
      "  2. Test API endpoint: curl https://guild-biblical-expectations-easily.trycloudflare.com/api/dental-bleaching",
    );
    console.log(
      "  3. Test frontend: http://localhost:3000/services/dental-bleaching\n",
    );
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
