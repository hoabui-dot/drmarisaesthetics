#!/usr/bin/env node

/**
 * Final Fix: Manual Component Cloning for Strapi 5 "Publish" Integrity
 * 
 * Corrected for Strapi 5 "Document System", ensuring that Draft and Published records
 * have their own unique component IDs. This prevents data loss when clicking "Publish".
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function manualCloningRestoration() {
  const client = new Client(DB_CONFIG);
  
  console.log("=".repeat(80));
  console.log("MANUAL CLONING RESTORATION (FINAL FIX)");
  console.log("=".repeat(80));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // 1. Find Media IDs
    const imgUrls = [
      "/uploads/happy_customers_hero.jpg", "/uploads/patient_smile.jpg", 
      "/uploads/family_dental.jpg", "/uploads/patient_consultation.jpg"
    ];
    const filesMap = {};
    for (const url of imgUrls) {
      const res = await client.query("SELECT id FROM files WHERE url = $1", [url]);
      if (res.rows.length > 0) filesMap[url] = res.rows[0].id;
    }

    // 2. Clear all existing customer data
    console.log("PART 1: Cleaning up existing data...");
    const tables = [
      "components_customer_hero", "components_customer_success_stories", 
      "components_customer_success_stories_cmps", "components_customer_story_items", 
      "components_customer_benefits", "components_customer_benefits_cmps", "components_customer_benefit_items",
      "components_customer_statistics", "components_customer_statistics_cmps", "components_customer_stat_items",
      "components_customer_faq", "components_customer_faq_cmps", "components_customer_faq_items",
      "components_customer_cta", "components_customer_cta_cmps", "components_customer_contact_info_items",
      "customers_cmps", "files_related_mph"
    ];
    for (const table of tables) {
      await client.query(`DELETE FROM ${table}`).catch(() => {});
    }

    // 3. Registering the Customer Singleton
    const docId = 'customers-singleton';
    const draftId = 3;
    const publishedId = 6;
    
    // Ensure parent records exist (Draft & Published)
    await client.query("DELETE FROM customers WHERE document_id = $1", [docId]);
    await client.query("INSERT INTO customers (id, document_id, title, description, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, NULL, NOW(), NOW())", [draftId, docId, "Our Customers", "Trusted by Thousands"]);
    await client.query("INSERT INTO customers (id, document_id, title, description, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())", [publishedId, docId, "Our Customers", "Trusted by Thousands"]);

    // 4. Seeding Components with Cloning
    const seedWithClones = async (table, data, componentType, order) => {
      // 1. Create Draft clone
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      
      const insDraft = await client.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`, values);
      const draftCmpId = insDraft.rows[0].id;
      
      // 2. Create Published clone
      const insPub = await client.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`, values);
      const pubCmpId = insPub.rows[0].id;
      
      // 3. Link them separately
      await client.query("INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'layout', $4)", [draftId, draftCmpId, componentType, order]);
      await client.query("INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'layout', $4)", [publishedId, pubCmpId, componentType, order]);
      
      return { draft: draftCmpId, published: pubCmpId };
    };

    console.log("PART 2: Double-seeding all 6 sections (Manual Cloning)...");

    // 4.1 HERO
    console.log("  Restoring Hero...");
    const heroIds = await seedWithClones("components_customer_hero", {
      badge: "Our Customers", title: "Trusted by Thousands of Happy Patients", 
      subtitle: "Your smile is our success story", description: "For over 15 years, we have been honored to serve patients from around the world."
    }, "customer.hero", 1);
    
    // Link media to BOTH clones
    const fields = ['image1', 'image2', 'image3', 'image4'];
    const urls = ["/uploads/happy_customers_hero.jpg", "/uploads/patient_smile.jpg", "/uploads/family_dental.jpg", "/uploads/patient_consultation.jpg"];
    for (const cmpId of [heroIds.draft, heroIds.published]) {
        for (let i = 0; i < 4; i++) {
            if (filesMap[urls[i]]) {
                await client.query("INSERT INTO files_related_mph (file_id, related_id, related_type, field, \"order\") VALUES ($1, $2, 'customer.hero', $3, 1)", [filesMap[urls[i]], cmpId, fields[i]]);
            }
        }
    }

    // 4.2 STORIES
    console.log("  Restoring Stories...");
    const ssIds = await seedWithClones("components_customer_success_stories", {
      badge: "Stories", title: "Real Patients, Real Results", description: "Feedback."
    }, "customer.success-stories", 2);
    
    const stories = [
      { name: "Sarah Thompson", loc: "Australia", t: "Smile Makeover", q: "Exceeded my expectations.", r: 5, i: "Star" },
      { name: "Michael Chen", loc: "Singapore", t: "Implants", q: "Comfortable and stress-free.", r: 5, i: "Heart" }
    ];
    for (const parentId of [ssIds.draft, ssIds.published]) {
        for (let i = 0; i < stories.length; i++) {
            const s = stories[i];
            const sId = (await client.query("INSERT INTO components_customer_story_items (name, location, treatment, quote, rating, icon, before_after) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id", [s.name, s.loc, s.t, s.q, s.r, s.i])).rows[0].id;
            await client.query("INSERT INTO components_customer_success_stories_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'stories', $4)", [parentId, sId, "customer.story-item", i + 1]);
        }
    }

    // 4.3 BENEFITS
    console.log("  Restoring Benefits...");
    const benIds = await seedWithClones("components_customer_benefits", { badge: "Why Us", title: "Exceptional Benefits", description: "World-class care." }, "customer.benefits", 3);
    const bens = [{t:"Quality Standards", i:"Award"}, {t:"Flexible Scheduling", i:"Clock"}];
    for (const parentId of [benIds.draft, benIds.published]) {
        for (let i = 0; i < bens.length; i++) {
            const bId = (await client.query("INSERT INTO components_customer_benefit_items (title, description, icon) VALUES ($1, $2, $3) RETURNING id", [bens[i].t, "High quality care.", bens[i].i])).rows[0].id;
            await client.query("INSERT INTO components_customer_benefits_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'benefits', $4)", [parentId, bId, "customer.benefit-item", i + 1]);
        }
    }

    // 4.4 STATS
    console.log("  Restoring Stats...");
    const statIds = await seedWithClones("components_customer_statistics", { badge: "Stats", title: "By The Numbers" }, "customer.statistics", 4);
    const stats = [{n:"15,000+", l:"Happy Patients", i:"Users"}, {n:"98%", l:"Satisfaction", i:"ThumbsUp"}];
    for (const parentId of [statIds.draft, statIds.published]) {
        for (let i = 0; i < stats.length; i++) {
            const sId = (await client.query("INSERT INTO components_customer_stat_items (number, label, icon) VALUES ($1, $2, $3) RETURNING id", [stats[i].n, stats[i].l, stats[i].i])).rows[0].id;
            await client.query("INSERT INTO components_customer_statistics_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'stats', $4)", [parentId, sId, "customer.stat-item", i + 1]);
        }
    }

    // 4.5 FAQ
    console.log("  Restoring FAQ...");
    const faqIds = await seedWithClones("components_customer_faq", { badge: "FAQ", title: "Questions", description: "Answers" }, "customer.faq", 5);
    const faqs = [{q:"How to book?", a:"Call 1900 8089."}, {q:"English?", a:"Yes."}];
    for (const parentId of [faqIds.draft, faqIds.published]) {
        for (let i = 0; i < faqs.length; i++) {
            const qId = (await client.query("INSERT INTO components_customer_faq_items (question, answer) VALUES ($1, $2) RETURNING id", [faqs[i].q, faqs[i].a])).rows[0].id;
            await client.query("INSERT INTO components_customer_faq_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'questions', $4)", [parentId, qId, "customer.faq-item", i + 1]);
        }
    }

    // 4.6 CTA
    console.log("  Restoring CTA...");
    const ctaIds = await seedWithClones("components_customer_cta", { badge: "Join", title: "Ready?", description: "Join us", primary_button_text: "Book Now", primary_button_link: "/contact" }, "customer.cta", 6);
    const contacts = [{t:"hotline"}, {t:"email"}];
    for (const parentId of [ctaIds.draft, ctaIds.published]) {
        for (let i = 0; i < contacts.length; i++) {
            const itemId = (await client.query("INSERT INTO components_customer_contact_info_items (text) VALUES ($1) RETURNING id", [contacts[i].t])).rows[0].id;
            await client.query("INSERT INTO components_customer_cta_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, $3, 'contact_info', $4)", [parentId, itemId, "shared.contact-info", i + 1]);
        }
    }

    console.log("\n" + "=".repeat(80));
    console.log("FINAL CLONING RESTORATION COMPLETE");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("\n[ERROR] Restoration failed:", error.message);
  } finally {
    await client.end();
  }
}

manualCloningRestoration();
