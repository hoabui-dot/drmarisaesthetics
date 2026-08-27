#!/usr/bin/env node
const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);
  try {
    await client.connect();
    await client.query("BEGIN");
    console.log("[OK] Connected to PostgreSQL\n");

    const parentId = 1;

    // Clear old linked components
    console.log("STEP 1: Clearing old links...");
    await client.query(`DELETE FROM components_contact_contact_infos_cmps WHERE entity_id = $1`, [parentId]);

    // Insert Website
    console.log("STEP 2: Inserting Website...");
    const resWeb = await client.query(`INSERT INTO components_contact_website_tiles (title, url) VALUES ('Visit Our Website', 'https://nhakhoaquoctesg.vn') RETURNING id`);
    await client.query(`INSERT INTO components_contact_contact_infos_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, 'contact.website-tile', 'website', 1)`, [parentId, resWeb.rows[0].id]);

    // Insert Hotline
    console.log("STEP 3: Inserting Hotline...");
    const resHotline = await client.query(`INSERT INTO components_contact_hotline_tiles (title, whatsapp_number, zalo_number) VALUES ('24/7 Hotline', '+84 396 877 518', '+84 902 759 406') RETURNING id`);
    await client.query(`INSERT INTO components_contact_contact_infos_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, 'contact.hotline-tile', 'hotline', 1)`, [parentId, resHotline.rows[0].id]);

    // Insert Address
    console.log("STEP 4: Inserting Address...");
    const resAddress = await client.query(`INSERT INTO components_contact_address_tiles (title, address_text, map_url) VALUES ('Heritage Address', '233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam', 'https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguy%E1%BB%87n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam') RETURNING id`);
    await client.query(`INSERT INTO components_contact_contact_infos_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, 'contact.address-tile', 'address', 1)`, [parentId, resAddress.rows[0].id]);

    // Insert Hours
    console.log("STEP 5: Inserting Operating Hours...");
    const resHours = await client.query(`INSERT INTO components_contact_hours_tiles (title, hours_text) VALUES ('Operating Hours', '8:00 AM - 19:00 PM (Monday to Sunday)') RETURNING id`);
    await client.query(`INSERT INTO components_contact_contact_infos_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, 'contact.hours-tile', 'operating_hours', 1)`, [parentId, resHours.rows[0].id]);

    // Insert Quick Action Banner
    console.log("STEP 6: Inserting Quick-Action Banner...");
    const resBanner = await client.query(`INSERT INTO components_contact_quick_action_banners (text_prefix, whatsapp_text, text_suffix, mobile_link, desktop_link) VALUES ('Book your appointment today or contact us via ', 'WhatsApp', ' for a quick consultation.', 'https://wa.me/84396877518', 'https://web.whatsapp.com/send?phone=84396877518') RETURNING id`);
    await client.query(`INSERT INTO components_contact_contact_infos_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, 'contact.quick-action-banner', 'quick_action', 1)`, [parentId, resBanner.rows[0].id]);

    await client.query("COMMIT");
    console.log("\n[SUCCESS] Migration 083 Completed!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[ERROR]", err);
  } finally {
    await client.end();
  }
}

run();
