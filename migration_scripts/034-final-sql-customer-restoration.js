#!/usr/bin/env node

/**
 * Migration Script: Final SQL Customer Restoration (v4 - Corrected IDs)
 * 
 * Precise Draft/Published component cloning for Strapi 5 "Document System",
 * using EXISTING media IDs (30, 28, 29, 27) from the Media Library.
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function finalSqlRestoration() {
  const client = new Client(DB_CONFIG);
  console.log("=".repeat(80));
  console.log("FINAL SQL CUSTOMER RESTORATION (v4 - CORRECTED IDS)");
  console.log("=".repeat(80));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    const docId = 'customers-singleton';
    const draftId = 3;
    const publishedId = 6;
    
    // Identified existing IDs from files table research:
    const mediaIds = [
      30, // happy_patient_3d6d7753d6.jpg
      28, // patient_consultation_dcf1a32d50.jpg
      29, // clinic_interior_7e7f0773e2.jpg
      27  // dental_team_323916ec46.jpg
    ];

    // 1. Clear previous attempts
    console.log("PART 1: Clearing all existing component relations...");
    const cleanupTables = [
      "customers_cmps", "components_customer_hero", "components_customer_hero_cmps",
      "components_customer_success_stories", "components_customer_success_stories_cmps", 
      "components_customer_story_items", "components_customer_benefits", 
      "components_customer_benefits_cmps", "components_customer_benefit_items",
      "components_customer_statistics", "components_customer_statistics_cmps", "components_customer_stat_items",
      "components_customer_faq", "components_customer_faq_cmps", "components_customer_faq_items",
      "components_customer_cta", "components_customer_cta_cmps", "components_customer_contact_info_items",
      "files_related_mph"
    ];
    for (const table of cleanupTables) {
      await client.query(`DELETE FROM ${table}`).catch(() => {});
    }

    // 2. Re-initialize the Singleton Document
    console.log("PART 2: Re-initializing Customer Document (Draft & Published)...");
    await client.query("DELETE FROM customers WHERE document_id = $1", [docId]);
    await client.query("INSERT INTO customers (id, document_id, title, description, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, NULL, NOW(), NOW())", [draftId, docId, "Our Customers", "Trusted by Thousands"]);
    await client.query("INSERT INTO customers (id, document_id, title, description, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())", [publishedId, docId, "Our Customers", "Trusted by Thousands"]);

    // 3. Helper for Component Cloning
    const seedClones = async (table, data, componentType, order) => {
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const host = values.map((_, i) => `$${i + 1}`).join(', ');
      
      const rDraft = await client.query(`INSERT INTO ${table} (${columns}) VALUES (${host}) RETURNING id`, values);
      const dCmpId = rDraft.rows[0].id;
      
      const rPub = await client.query(`INSERT INTO ${table} (${columns}) VALUES (${host}) RETURNING id`, values);
      const pCmpId = rPub.rows[0].id;
      
      await client.query("INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'layout', $4)", [draftId, dCmpId, componentType, order]);
      await client.query("INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'layout', $4)", [publishedId, pCmpId, componentType, order]);
      
      return { d: dCmpId, p: pCmpId };
    };

    // 4. SEED SECTIONS
    console.log("  Restoring Hero clones (with Media IDs 30, 28, 29, 27)...");
    const hero = await seedClones("components_customer_hero", {
      badge: "OUR CUSTOMERS", title: "Trusted by Thousands of Happy Patients", 
      subtitle: "Your smile is our success story", 
      description: "For over 15 years, we have been honored to serve patients from around the world. Our commitment to excellence has earned us the trust of thousands of families who rely on us for their dental care needs."
    }, "customer.hero", 1);
    
    // Link media to BOTH Hero clones
    const fields = ['image1', 'image2', 'image3', 'image4'];
    for (const cmpId of [hero.d, hero.p]) {
      for (let i = 0; i < 4; i++) {
        await client.query("INSERT INTO files_related_mph (file_id, related_id, related_type, field, \"order\") VALUES ($1, $2, 'customer.hero', $3, 1)", [mediaIds[i], cmpId, fields[i]]);
      }
    }

    // 4.1 Rest of sections
    console.log("  Restoring Stories...");
    const ss = await seedClones("components_customer_success_stories", { badge: "Success Stories", title: "Real Stories from Real Patients", description: "Feedback." }, "customer.success-stories", 2);
    const storyData = [
      { n:"Sarah Thompson", l:"Australia", q:"Exceeded my expectations.", r:5, i:"Star" },
      { n:"Michael Chen", l:"Singapore", q:"Comfortable and stress-free.", r:5, i:"Heart" }
    ];
    for (const p of [ss.d, ss.p]) {
      for (let i=0; i<storyData.length; i++) {
        const s = storyData[i];
        const res = await client.query("INSERT INTO components_customer_story_items (name, location, treatment, quote, rating, icon, before_after) VALUES ($1, $2, 'Makeover', $3, $4, $5, true) RETURNING id", [s.n, s.l, s.q, s.r, s.i]);
        await client.query("INSERT INTO components_customer_success_stories_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'customer.story-item', 'stories', $3)", [p, res.rows[0].id, i+1]);
      }
    }

    console.log("  Restoring Benefits, Stats, FAQ, CTA...");
    // Ben
    const ben = await seedClones("components_customer_benefits", { badge: "BENEFITS", title: "Why Choose Us", description: "World-class care." }, "customer.benefits", 3);
    const benData = [{t:"Quality Standards", i:"Award"}, {t:"Flexible Scheduling", i:"Clock"}];
    for (const p of [ben.d, ben.p]) {
      for (let i=0; i<benData.length; i++) {
        const res = await client.query("INSERT INTO components_customer_benefit_items (title, description, icon) VALUES ($1, 'International standards.', $2) RETURNING id", [benData[i].t, benData[i].i]);
        await client.query("INSERT INTO components_customer_benefits_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'customer.benefit-item', 'benefits', $3)", [p, res.rows[0].id, i+1]);
      }
    }
    // Stats
    const stats = await seedClones("components_customer_statistics", { badge: "STATS", title: "Our Record" }, "customer.statistics", 4);
    const statsData = [{n:"15,000+", l:"Happy Patients", i:"Users"}, {n:"98%", l:"Satisfaction", i:"ThumbsUp"}];
    for (const p of [stats.d, stats.p]) {
      for (let i=0; i<statsData.length; i++) {
        const res = await client.query("INSERT INTO components_customer_stat_items (number, label, icon) VALUES ($1, $2, $3) RETURNING id", [statsData[i].n, statsData[i].l, statsData[i].i]);
        await client.query("INSERT INTO components_customer_statistics_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'customer.stat-item', 'stats', $3)", [p, res.rows[0].id, i+1]);
      }
    }
    // FAQ
    const faq = await seedClones("components_customer_faq", { badge: "FAQ", title: "Questions & Answers", description: "Answers" }, "customer.faq", 5);
    const faqData = [{q:"How to book?", a:"Call 1900 8089."}, {q:"English?", a:"Yes."}];
    for (const p of [faq.d, faq.p]) {
      for (let i=0; i<faqData.length; i++) {
        const res = await client.query("INSERT INTO components_customer_faq_items (question, answer) VALUES ($1, $2) RETURNING id", [faqData[i].q, faqData[i].a]);
        await client.query("INSERT INTO components_customer_faq_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'customer.faq-item', 'questions', $3)", [p, res.rows[0].id, i+1]);
      }
    }
    // CTA
    const cta = await seedClones("components_customer_cta", { badge: "JOIN US", title: "Ready for your smile?", description: "Join us", primary_button_text: "Book Now", primary_button_link: "/contact" }, "customer.cta", 6);
    for (const p of [cta.d, cta.p]) {
      const res = await client.query("INSERT INTO components_customer_contact_info_items (text) VALUES ('Hotline: 1900 8089') RETURNING id");
      await client.query("INSERT INTO components_customer_cta_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'shared.contact-info', 'contact_info', 1)", [p, res.rows[0].id]);
    }

    console.log("\n" + "=".repeat(80));
    console.log("RESTORED SUCCESSFULLY WITH CORECT IDS (30, 28, 29, 27)");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("\n[ERROR] Restoration failed:", error.message);
  } finally {
    await client.end();
  }
}

finalSqlRestoration();
