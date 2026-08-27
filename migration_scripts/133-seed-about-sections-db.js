#!/usr/bin/env node

/**
 * Seed About Us section configuration directly into Strapi's v5 component
 * tables when the available API token cannot access the admin Content Manager.
 * Only the new doctors and featured_services fields are replaced.
 */

const { Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST || process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || process.env.POSTGRES_PORT || 5432),
  database: process.env.DATABASE_NAME || process.env.POSTGRES_DB || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || process.env.POSTGRES_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD || "postgres",
});

const serviceSlugs = [
  "dental-implants",
  "dental-braces",
  "dental-bleaching",
  "dental-veneers",
  "dental-veneers-cost",
  "general-check-up",
];

const coreValues = [
  ["shield-check", "Integrity", "We are honest, transparent, and ethical in everything we do."],
  ["graduation-cap", "Expertise", "Highly trained professionals delivering evidence-based care."],
  ["hands-heart", "Compassion", "We treat every patient with empathy, respect, and kindness."],
  ["lightbulb", "Innovation", "We embrace advanced technology to achieve better results."],
  ["user", "Personalization", "Care tailored to your unique needs and smile goals."],
  ["trophy", "Excellence", "We pursue the highest standards in every detail."],
];

const mission = {
  mission_title: "Our Mission",
  mission_description: "To deliver world-class, patient-centered dental care by combining advanced technology, clinical precision, and genuine compassion—ensuring every patient enjoys a healthy smile and greater confidence for life.",
  vision_title: "Our Vision",
  vision_description: "To become the leading and most trusted dental destination in Vietnam and the region, recognized for innovation, clinical excellence, and an unparalleled patient experience that sets the standard in modern dental care.",
};

async function seedForPage(pageId) {
  await client.query("DELETE FROM about_pages_cmps WHERE entity_id = $1 AND field IN ('mission_vision', 'doctors', 'featured_services')", [pageId]);

  const missionVision = await client.query(
    `INSERT INTO components_about_mission_visions
      (mission_title, mission_description, vision_title, vision_description)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [mission.mission_title, mission.mission_description, mission.vision_title, mission.vision_description],
  );
  await client.query(
    `INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field, "order")
     VALUES ($1, $2, 'about.mission-vision', 'mission_vision', 1)`,
    [pageId, missionVision.rows[0].id],
  );

  const coreLink = await client.query(
    "SELECT cmp_id FROM about_pages_cmps WHERE entity_id = $1 AND field = 'core_values' LIMIT 1",
    [pageId],
  );
  if (coreLink.rows.length) {
    const coreId = coreLink.rows[0].cmp_id;
    await client.query(
      "UPDATE components_about_core_values SET badge = $1, title = $2, description = $3 WHERE id = $4",
      ["Core Values", "Core Values", "", coreId],
    );
    await client.query("DELETE FROM components_about_core_values_values_lnk WHERE core_value_id = $1", [coreId]);
    for (const [order, [icon, title, description]] of coreValues.entries()) {
      const existing = await client.query(
        "SELECT id FROM components_about_feature_items WHERE title = $1 ORDER BY id LIMIT 1",
        [title],
      );
      const item = existing.rows.length
        ? await client.query(
          "UPDATE components_about_feature_items SET icon = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING id",
          [icon, description, existing.rows[0].id],
        )
        : await client.query(
          "INSERT INTO components_about_feature_items (icon, title, description) VALUES ($1, $2, $3) RETURNING id",
          [icon, title, description],
        );
      await client.query(
        `INSERT INTO components_about_core_values_values_lnk (core_value_id, feature_item_id, "order")
         VALUES ($1, $2, $3)`,
        [coreId, item.rows[0].id, order],
      );
    }
  }

  const doctor = await client.query(
    `INSERT INTO components_about_doctors (title, view_all_label, view_all_link)
     VALUES ($1, $2, $3) RETURNING id`,
    ["Meet Our Doctors", "VIEW ALL DOCTORS", "/doctors"],
  );
  await client.query(
    `INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field, "order")
     VALUES ($1, $2, 'about.doctors', 'doctors', 6)`,
    [pageId, doctor.rows[0].id],
  );

  const featured = await client.query(
    `INSERT INTO components_about_featured_services (title)
     VALUES ($1) RETURNING id`,
    ["Featured Services"],
  );
  for (const [order, slug] of serviceSlugs.entries()) {
    const reference = await client.query(
      `INSERT INTO components_about_featured_service_references (service_slug)
       VALUES ($1) RETURNING id`,
      [slug],
    );
    await client.query(
      `INSERT INTO components_about_featured_services_cmps
       (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, 'about.featured-service-reference', 'services', $3)`,
      [featured.rows[0].id, reference.rows[0].id, order],
    );
  }
  await client.query(
    `INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field, "order")
     VALUES ($1, $2, 'about.featured-services', 'featured_services', 7)`,
    [pageId, featured.rows[0].id],
  );
}

async function main() {
  await client.connect();
  await client.query("BEGIN");
  try {
    const pages = await client.query(
      "SELECT id, published_at FROM about_pages WHERE document_id = $1 ORDER BY id",
      ["hqmlqfjd41sjfgp5ofyv182o"],
    );
    if (!pages.rows.length) throw new Error("About page document was not found");
    for (const page of pages.rows) await seedForPage(page.id);
    await client.query("UPDATE about_pages SET updated_at = NOW() WHERE id = ANY($1::int[])", [pages.rows.map((page) => page.id)]);
    await client.query("COMMIT");
    console.log(`[ABOUT DB SEED] seeded ${pages.rows.length} About page records with doctors and ${serviceSlugs.length} service references`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`[ABOUT DB SEED] ${error.message}`);
  process.exit(1);
});
