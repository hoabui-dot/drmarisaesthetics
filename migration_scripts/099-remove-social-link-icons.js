#!/usr/bin/env node

const { Client } = require("pg");

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
  console.log("MIGRATION 099: Remove Social Link Icons and Add Icon Classes");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Add icon_class column ────────────────────────────────────
    console.log("STEP 1: Adding icon_class column...");
    await client.query(`
      ALTER TABLE components_footer_social_links 
      ADD COLUMN IF NOT EXISTS icon_class VARCHAR(255) DEFAULT 'fab fa-link'
    `);
    console.log("  [OK] Added icon_class column\n");

    // ── STEP 2: Set icon classes based on platform ───────────────────────
    console.log("STEP 2: Setting icon classes based on platform...");

    const platformIcons = {
      Facebook: "fab fa-facebook",
      Twitter: "fab fa-twitter",
      Instagram: "fab fa-instagram",
      LinkedIn: "fab fa-linkedin",
      YouTube: "fab fa-youtube",
      TikTok: "fab fa-tiktok",
      Pinterest: "fab fa-pinterest",
      WhatsApp: "fab fa-whatsapp",
      Telegram: "fab fa-telegram",
      Zalo: "fas fa-comment-dots",
    };

    for (const [platform, iconClass] of Object.entries(platformIcons)) {
      const result = await client.query(
        `
        UPDATE components_footer_social_links
        SET icon_class = $1
        WHERE LOWER(platform) = LOWER($2)
      `,
        [iconClass, platform],
      );

      if (result.rowCount > 0) {
        console.log(
          `  [OK] Updated ${result.rowCount} ${platform} link(s) to ${iconClass}`,
        );
      }
    }
    console.log();

    // ── STEP 3: Remove icon relations from files_related_mph ─────────────
    console.log("STEP 3: Removing icon image relations...");
    const deleteResult = await client.query(`
      DELETE FROM files_related_mph
      WHERE related_type = 'footer.social-link'
      AND field = 'icon'
      RETURNING id
    `);
    console.log(`  [OK] Deleted ${deleteResult.rows.length} icon relations\n`);

    // ── STEP 4: Verify results ───────────────────────────────────────────
    console.log("STEP 4: Verifying results...");
    const socialLinks = await client.query(`
      SELECT id, platform, icon_class, url
      FROM components_footer_social_links
      ORDER BY id
    `);

    console.log(`  Found ${socialLinks.rows.length} social links:`);
    socialLinks.rows.forEach((link) => {
      console.log(`    - ${link.platform}: ${link.icon_class}`);
    });
    console.log();

    console.log("=".repeat(70));
    console.log("MIGRATION 099 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to reload schema");
    console.log(
      "  2. Update frontend Footer component to use Font Awesome icons",
    );
    console.log("  3. Test social links display\n");
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
