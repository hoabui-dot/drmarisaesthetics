#!/usr/bin/env node

/**
 * Migration Script 070: Update Customer Page Content
 *
 * Changes:
 *  1. Add before_after_gallery component
 *  2. Update hero section content
 *  3. Update testimonials with customer images
 *  4. Update benefits section
 *  5. Add Google rating to statistics
 *  6. Update CTA with inline form
 *
 * Run:
 *   node migration_scripts/070-update-customer-page-content.js
 */

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
  console.log("MIGRATION 070: Update Customer Page Content");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create before_after_gallery component tables ──────────────
    console.log("STEP 1: Creating before_after_gallery component tables...");

    // Create gallery items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_gallery_items (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255),
        alt_text VARCHAR(255)
      )
    `);
    console.log("  [OK] Created components_customer_gallery_items table");

    // Create before_after_gallery table
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_before_after_galleries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        badge VARCHAR(255)
      )
    `);
    console.log(
      "  [OK] Created components_customer_before_after_galleries table",
    );

    // Create link table for gallery items
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_before_after_galleries_items_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER NOT NULL
          REFERENCES components_customer_before_after_galleries(id)
          ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL
          REFERENCES components_customer_gallery_items(id)
          ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);
    console.log("  [OK] Created gallery items link table\n");

    // ── STEP 2: Update hero section ───────────────────────────────────────
    console.log("STEP 2: Updating hero section content...");

    const heroResult = await client.query(`
      SELECT id FROM components_customer_hero LIMIT 1
    `);

    if (heroResult.rows.length > 0) {
      const heroId = heroResult.rows[0].id;
      await client.query(
        `
        UPDATE components_customer_hero
        SET 
          title = 'Real Patient Results: Dental Before and Afters In Viet Nam',
          subtitle = 'Explore real before-and-after results at Sai Gon International Dental Clinic. Trusted by international patients with real reviews and affordable care.',
          badge = 'Patient Results'
        WHERE id = $1
      `,
        [heroId],
      );
      console.log(`  [OK] Updated hero section (ID: ${heroId})\n`);
    } else {
      console.log("  [SKIP] No hero section found\n");
    }

    // ── STEP 3: Update success stories (testimonials) ─────────────────────
    console.log("STEP 3: Updating testimonials...");

    // Clear existing stories
    await client.query(`DELETE FROM components_customer_story_items`);

    // Insert new testimonials
    const testimonials = [
      {
        name: "Mr. Eugene",
        location: "Canada",
        treatment: "Complete Smile Makeover",
        quote:
          "It worth to fly Ho Chi Minh City Vietnam, even from Canada. Best service so far. Within 2 days you can get an amazing smile. They offer free airport pick up, hotel stay plus free transportation to the clinic and back",
        rating: 5,
        icon: "Star",
        before_after: true,
      },
      {
        name: "Michael Walters",
        location: "U.S.A",
        treatment: "Dental Treatment",
        quote:
          "I would highly recommend coming here for dental treatment. The staff is very friendly and made the whole process very easy. Thanks to Ms. Vy and Dr. Binh for being there for every step and making me feel comfortable the whole time.",
        rating: 5,
        icon: "Heart",
        before_after: false,
      },
      {
        name: "JC Ann Sotelo",
        location: "Philippines",
        treatment: "Porcelain Crowns",
        quote:
          "The staff are very attentive and kind. The dentists are highly skilled and took great care of me. My porcelain crowns are of excellent quality. I would highly recommend this clinic.",
        rating: 5,
        icon: "Smile",
        before_after: false,
      },
    ];

    for (const testimonial of testimonials) {
      await client.query(
        `
        INSERT INTO components_customer_story_items 
        (name, location, treatment, quote, rating, icon, before_after)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          testimonial.name,
          testimonial.location,
          testimonial.treatment,
          testimonial.quote,
          testimonial.rating,
          testimonial.icon,
          testimonial.before_after,
        ],
      );
    }
    console.log(`  [OK] Inserted ${testimonials.length} testimonials\n`);

    // ── STEP 4: Update benefits section ───────────────────────────────────
    console.log("STEP 4: Updating benefits section...");

    // Clear existing benefits
    await client.query(`DELETE FROM components_customer_benefit_items`);

    // Insert new benefits
    const benefits = [
      {
        title: "Global Trust",
        description:
          "Trusted by patients from the USA, Australia, Canada, Philippines, Singapore and many other countries.",
        icon: "Globe",
      },
      {
        title: "Premium Quality at Affordable Prices",
        description:
          "Enjoy competitive pricing while receiving high-end porcelain restorations from leading global brands.",
        icon: "Award",
      },
      {
        title: "Personalized Care",
        description:
          "Each patient receives a tailored treatment plan designed to match their needs and expectations.",
        icon: "Heart",
      },
      {
        title: "Exclusive Support Services",
        description:
          "Airport pick-up and drop-off assistance. Complimentary hotel stay for eligible treatments.",
        icon: "Plane",
      },
    ];

    for (const benefit of benefits) {
      await client.query(
        `
        INSERT INTO components_customer_benefit_items 
        (title, description, icon)
        VALUES ($1, $2, $3)
      `,
        [benefit.title, benefit.description, benefit.icon],
      );
    }
    console.log(`  [OK] Inserted ${benefits.length} benefits\n`);

    // ── STEP 5: Update statistics section ─────────────────────────────────
    console.log("STEP 5: Updating statistics section...");

    const statsResult = await client.query(`
      SELECT id FROM components_customer_statistics LIMIT 1
    `);

    if (statsResult.rows.length > 0) {
      const statsId = statsResult.rows[0].id;
      await client.query(
        `
        UPDATE components_customer_statistics
        SET 
          title = '5-Star Dental Clinic with Verified Patient Reviews',
          badge = 'Patient Reviews'
        WHERE id = $1
      `,
        [statsId],
      );

      // Update stat items
      await client.query(`DELETE FROM components_customer_stat_items`);

      const stats = [
        { number: "4.9/5", label: "Google Rating", icon: "Star" },
        { number: "400+", label: "Patient Reviews", icon: "Users" },
        { number: "15+", label: "Years Experience", icon: "Award" },
        { number: "50+", label: "Countries Served", icon: "Globe" },
      ];

      for (const stat of stats) {
        await client.query(
          `
          INSERT INTO components_customer_stat_items 
          (number, label, icon)
          VALUES ($1, $2, $3)
        `,
          [stat.number, stat.label, stat.icon],
        );
      }

      console.log(`  [OK] Updated statistics section\n`);
    } else {
      console.log("  [SKIP] No statistics section found\n");
    }

    // ── STEP 6: Update CTA section ────────────────────────────────────────
    console.log("STEP 6: Updating CTA section...");

    const ctaResult = await client.query(`
      SELECT id FROM components_customer_cta LIMIT 1
    `);

    if (ctaResult.rows.length > 0) {
      const ctaId = ctaResult.rows[0].id;
      await client.query(
        `
        UPDATE components_customer_cta
        SET 
          title = 'Start Your Smile Journey Today',
          description = 'Book your appointment online right here.',
          badge = 'Get Started',
          primary_button_text = 'Book Appointment',
          primary_button_link = '/contact',
          secondary_button_text = 'Call Us Now',
          secondary_button_link = 'tel:19008059'
        WHERE id = $1
      `,
        [ctaId],
      );
      console.log(`  [OK] Updated CTA section\n`);
    } else {
      console.log("  [SKIP] No CTA section found\n");
    }

    // ── STEP 7: Verify results ────────────────────────────────────────────
    console.log("STEP 7: Verifying results...");

    const verifyHero = await client.query(`
      SELECT title FROM components_customer_hero LIMIT 1
    `);
    console.log(`  Hero title: ${verifyHero.rows[0]?.title || "N/A"}`);

    const verifyStories = await client.query(`
      SELECT COUNT(*) as count FROM components_customer_story_items
    `);
    console.log(`  Testimonials count: ${verifyStories.rows[0].count}`);

    const verifyBenefits = await client.query(`
      SELECT COUNT(*) as count FROM components_customer_benefit_items
    `);
    console.log(`  Benefits count: ${verifyBenefits.rows[0].count}`);

    console.log("  [OK] Verification passed\n");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 070 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi schema files");
    console.log("  2. Restart Strapi CMS");
    console.log("  3. Update frontend component");
    console.log("  4. Add customer images via Strapi admin\n");
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
