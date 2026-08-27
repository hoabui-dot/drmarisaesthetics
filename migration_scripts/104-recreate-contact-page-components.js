/**
 * Migration Script 104: Recreate Contact Page Components for Published Version
 *
 * Issue: The published contact page (ID: 68) is missing all component data.
 * This script creates fresh components with proper data and links them.
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

    const PUBLISHED_ID = 68;

    // Step 1: Create contact form component
    console.log("\n📝 Step 1: Creating contact form component...");

    const contactForm = await client.query(
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
        "Request Consultation",
        "Fill out the form below and our team will contact you within 24 hours to schedule your appointment.",
        "Full Name",
        "Enter your full name",
        "Phone Number",
        "+84 xxx xxx xxx",
        "Service of Interest",
        "Select a service",
        '["Dental Implants", "Veneers", "Teeth Whitening", "Braces", "General Dentistry", "Other"]',
        "Message (Optional)",
        "Tell us about your dental needs...",
        "Request Consultation",
        "Thank you! We'll contact you within 24 hours.",
        "Something went wrong. Please try again or call us directly.",
        "Email Address",
        "your.email@example.com",
      ],
    );

    const contactFormId = contactForm.rows[0].id;
    console.log(`✅ Created contact form: ${contactFormId}`);

    // Step 2: Create hero component
    console.log("\n📝 Step 2: Creating hero component...");

    const hero = await client.query(
      `
      INSERT INTO components_contact_heroes (title, subtitle, background_image_id)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
      [
        "Contact Saigon International Dental Clinic.",
        "Experience the next level of dental care. Reach out instantly and let our experts guide you to your perfect smile.",
        null,
      ],
    );

    const heroId = hero.rows[0].id;
    console.log(`✅ Created hero component: ${heroId}`);

    // Step 3: Link contact form to hero
    console.log("\n📝 Step 3: Linking contact form to hero...");

    await client.query(
      `
      INSERT INTO components_contact_heroes_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [heroId, contactFormId, "contact.contact-form", "contact_form", 1],
    );

    console.log(`✅ Linked contact form to hero`);

    // Step 4: Delete existing component links for published page (except FAQ)
    console.log("\n📝 Step 4: Cleaning up existing component links...");

    await client.query(
      `
      DELETE FROM contact_pages_cmps 
      WHERE entity_id = $1 AND field != 'faq'
    `,
      [PUBLISHED_ID],
    );

    console.log(`✅ Cleaned up old component links`);

    // Step 5: Link hero to published page
    console.log("\n📝 Step 5: Linking hero to published page...");

    await client.query(
      `
      INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [PUBLISHED_ID, heroId, "contact.hero", "hero", 1],
    );

    console.log(`✅ Linked hero to published page`);

    // Step 6: Link elite_stack (reuse existing component 34)
    console.log("\n📝 Step 6: Linking elite_stack component...");

    await client.query(
      `
      INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [PUBLISHED_ID, 34, "contact.elite-stack", "elite_stack", 2],
    );

    console.log(`✅ Linked elite_stack to published page`);

    // Step 7: Update FAQ order
    console.log("\n📝 Step 7: Updating FAQ order...");

    await client.query(
      `
      UPDATE contact_pages_cmps 
      SET "order" = 3
      WHERE entity_id = $1 AND field = 'faq'
    `,
      [PUBLISHED_ID],
    );

    console.log(`✅ Updated FAQ order`);

    // Step 8: Link final_cta (reuse existing component 70)
    console.log("\n📝 Step 8: Linking final_cta component...");

    await client.query(
      `
      INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [PUBLISHED_ID, 70, "homepage.cta", "final_cta", 4],
    );

    console.log(`✅ Linked final_cta to published page`);

    // Step 9: Verify the result
    console.log("\n🔍 Step 9: Verifying the result...");

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

    // Verify hero has contact form
    const heroVerify = await client.query(
      `
      SELECT 
        ch.id,
        ch.title,
        chc.field,
        chc.cmp_id,
        chc.component_type
      FROM components_contact_heroes ch
      LEFT JOIN components_contact_heroes_cmps chc ON ch.id = chc.entity_id
      WHERE ch.id = $1
    `,
      [heroId],
    );

    console.log("\n📊 Hero component with nested contact form:");
    console.table(heroVerify.rows);

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
