#!/usr/bin/env node

/**
 * Migration Script: Fix Customer Single Type Database Structure
 * 
 * This script truncates existing customer components and completely 
 * re-populates them WITH the correct nested relationships (_cmps tables) 
 * for Strapi 4 based on 024-create-customer-page.js data and 027-create-customer-schemas.js configuration.
 * 
 * Run: node migration_scripts/029-fix-customer-single-type-db.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

const customerPageData = {
  hero: {
    badge: "Our Customers",
    title: "Trusted by Thousands of Happy Patients",
    subtitle: "Your smile is our success story",
    description: "For over 15 years, we have been honored to serve patients from around the world. Our commitment to excellence has earned us the trust of thousands of families who rely on us for their dental care needs.",
    images: [
      { type: "strapi", path: "/uploads/happy_customers_hero.jpg", alt: "Happy dental patients" },
      { type: "strapi", path: "/uploads/patient_smile.jpg", alt: "Patient with beautiful smile" },
      { type: "strapi", path: "/uploads/family_dental.jpg", alt: "Family dental care" },
      { type: "strapi", path: "/uploads/patient_consultation.jpg", alt: "Patient consultation" }
    ]
  },
  successStories: {
    badge: "Success Stories",
    title: "Real Stories from Real Patients",
    description: "Hear from our patients about their transformative dental experiences and the confidence they've gained through our care.",
    stories: [
      { name: "Sarah Thompson", location: "Australia", treatment: "Full Smile Makeover", quote: "I traveled from Sydney specifically for my treatment here. The results exceeded my expectations - my new smile has completely changed my confidence level.", rating: 5, beforeAfter: true, icon: "Star" },
      { name: "Michael Chen", location: "Singapore", treatment: "Dental Implants", quote: "After losing two teeth in an accident, I was devastated. The team here not only restored my smile but made the entire process comfortable and stress-free.", rating: 5, beforeAfter: true, icon: "Heart" },
      { name: "Emma Williams", location: "United Kingdom", treatment: "Invisalign Treatment", quote: "As an adult, I was hesitant about orthodontic treatment. The Invisalign solution was perfect - discreet and effective. I couldn't be happier!", rating: 5, beforeAfter: true, icon: "Smile" },
      { name: "David Park", location: "South Korea", treatment: "Teeth Whitening", quote: "Professional, efficient, and the results speak for themselves. My teeth are now several shades whiter and I feel years younger.", rating: 5, beforeAfter: false, icon: "Sparkles" }
    ]
  },
  customerBenefits: {
    badge: "Why Patients Choose Us",
    title: "The Benefits Our Customers Enjoy",
    description: "We go above and beyond to ensure every patient receives exceptional care and value.",
    benefits: [
      { icon: "Award", title: "International Quality Standards", description: "Our clinic meets and exceeds international dental care standards, ensuring you receive world-class treatment." },
      { icon: "Clock", title: "Flexible Scheduling", description: "We offer convenient appointment times including weekends and evenings to fit your busy lifestyle." },
      { icon: "Globe", title: "Multilingual Staff", description: "Our team speaks multiple languages including English, Vietnamese, Korean, and Japanese for your comfort." },
      { icon: "Shield", title: "Comprehensive Warranty", description: "All major treatments come with extended warranties, giving you peace of mind for years to come." },
      { icon: "Plane", title: "Dental Tourism Support", description: "We assist international patients with accommodation recommendations, airport transfers, and treatment planning." },
      { icon: "CreditCard", title: "Flexible Payment Options", description: "Choose from various payment plans and financing options to make your treatment affordable." }
    ]
  },
  statistics: {
    badge: "By The Numbers",
    title: "Our Track Record Speaks for Itself",
    stats: [
      { number: "15,000+", label: "Happy Patients", suffix: "", icon: "Users" },
      { number: "98%", label: "Satisfaction Rate", suffix: "", icon: "ThumbsUp" },
      { number: "50+", label: "Countries Served", suffix: "", icon: "Globe" },
      { number: "25,000+", label: "Successful Treatments", suffix: "", icon: "CheckCircle" }
    ]
  },
  faq: {
    badge: "Customer FAQ",
    title: "Frequently Asked Questions",
    description: "Find answers to common questions from our patients",
    questions: [
      { question: "How do I book my first appointment?", answer: "You can book your appointment through our website, by calling our hotline at 1900 8089, or by sending us an email. Our team will respond within 24 hours to confirm your booking." },
      { question: "Do you offer services in English?", answer: "Yes! Our entire team is fluent in English, and we have staff members who speak Korean, Japanese, and Mandarin as well. We ensure clear communication throughout your treatment." },
      { question: "What payment methods do you accept?", answer: "We accept cash (VND and USD), credit/debit cards (Visa, Mastercard, JCB), bank transfers, and various financing options. International patients can also use their travel insurance." },
      { question: "Is there parking available at the clinic?", answer: "Yes, we provide free parking for all patients at both of our clinic locations. Motorcycle and car parking are available." },
      { question: "How long does a typical treatment take?", answer: "Treatment duration varies depending on the procedure. Simple checkups take 30-45 minutes, while complex treatments like implants may require multiple visits over several months. We provide detailed timelines during your consultation." },
      { question: "Do you offer aftercare support?", answer: "Absolutely! We provide comprehensive aftercare instructions, follow-up appointments, and 24/7 emergency support for our patients. Your long-term oral health is our priority." }
    ]
  },
  cta: {
    badge: "Join Our Family",
    title: "Ready to Experience the Difference?",
    description: "Join thousands of satisfied patients and discover why we're the trusted choice for dental care in Vietnam.",
    primaryButtonText: "Book Your Consultation",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View Our Services",
    secondaryButtonLink: "/services",
    contactInfo: [
      { text: "Hotline: 1900 8089" },
      { text: "info@saigondental.com" }
    ]
  }
};

async function fixCustomerSingleType() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION: Fix Customer Component Relationships in DB");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL database\n");

    // =========================================================================
    // STEP 1: Truncate existing customer data
    // =========================================================================
    console.log("STEP 1: Truncating old customer tables...\n");
    await client.query(`
      TRUNCATE TABLE customers RESTART IDENTITY CASCADE;
      TRUNCATE TABLE customers_cmps RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_hero RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_story_items RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_success_stories RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_success_stories_cmps RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_benefit_items RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_benefits RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_benefits_cmps RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_stat_items RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_statistics RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_statistics_cmps RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_faq_items RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_faq RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_faq_cmps RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_contact_info_items RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_cta RESTART IDENTITY CASCADE;
      TRUNCATE TABLE components_customer_cta_cmps RESTART IDENTITY CASCADE;
    `);
    console.log("  [OK] Tables truncated");

    // =========================================================================
    // STEP 2: Create customers single-type record
    // =========================================================================
    console.log("\nSTEP 2: Creating Customers single-type record...\n");
    const customersResult = await client.query(
      `
      INSERT INTO customers (document_id, title, description, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id;
    `,
      [
        "customers-singleton",
        "Our Customers - Saigon International Dental Clinic",
        "Discover why thousands of patients trust Saigon International Dental Clinic for their dental care needs.",
        new Date().toISOString(),
      ]
    );
    const customersId = customersResult.rows[0].id;
    console.log(`  [OK] Created Customers record with ID: ${customersId}`);

    // =========================================================================
    // STEP 3: Insert components & relations
    // =========================================================================
    console.log("\nSTEP 3: Inserting components with correct child links...\n");
    let componentOrder = 1;

    // 1. Hero
    const hero = customerPageData.hero;
    const heroResult = await client.query(
      `INSERT INTO components_customer_hero (badge, title, subtitle, description, images)
       VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [hero.badge, hero.title, hero.subtitle, hero.description, JSON.stringify(hero.images)]
    );
    await client.query(
      `INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, $3, $4, $5);`,
      [customersId, heroResult.rows[0].id, "customer.hero", "layout", componentOrder++]
    );

    // 2. Success Stories
    const successStories = customerPageData.successStories;
    const storiesResult = await client.query(
      `INSERT INTO components_customer_success_stories (badge, title, description)
       VALUES ($1, $2, $3) RETURNING id;`,
      [successStories.badge, successStories.title, successStories.description]
    );
    await client.query(
      `INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, $3, $4, $5);`,
      [customersId, storiesResult.rows[0].id, "customer.success-stories", "layout", componentOrder++]
    );
    
    let childOrder = 1;
    for (const story of successStories.stories) {
      const itemResult = await client.query(
        `INSERT INTO components_customer_story_items (name, location, treatment, quote, rating, before_after, icon)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
        [story.name, story.location, story.treatment, story.quote, story.rating, story.beforeAfter, story.icon]
      );
      await client.query(
        `INSERT INTO components_customer_success_stories_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5);`,
        [storiesResult.rows[0].id, itemResult.rows[0].id, "customer.story-item", "stories", childOrder++]
      );
    }

    // 3. Benefits
    const benefits = customerPageData.customerBenefits;
    const benefitsResult = await client.query(
      `INSERT INTO components_customer_benefits (badge, title, description)
       VALUES ($1, $2, $3) RETURNING id;`,
      [benefits.badge, benefits.title, benefits.description]
    );
    await client.query(
      `INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, $3, $4, $5);`,
      [customersId, benefitsResult.rows[0].id, "customer.benefits", "layout", componentOrder++]
    );
    
    childOrder = 1;
    for (const benefit of benefits.benefits) {
      const itemResult = await client.query(
        `INSERT INTO components_customer_benefit_items (icon, title, description)
         VALUES ($1, $2, $3) RETURNING id;`,
        [benefit.icon, benefit.title, benefit.description]
      );
      await client.query(
        `INSERT INTO components_customer_benefits_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5);`,
        [benefitsResult.rows[0].id, itemResult.rows[0].id, "customer.benefit-item", "benefits", childOrder++]
      );
    }

    // 4. Statistics
    const statistics = customerPageData.statistics;
    const statResult = await client.query(
      `INSERT INTO components_customer_statistics (badge, title)
       VALUES ($1, $2) RETURNING id;`,
      [statistics.badge, statistics.title]
    );
    await client.query(
      `INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, $3, $4, $5);`,
      [customersId, statResult.rows[0].id, "customer.statistics", "layout", componentOrder++]
    );
    
    childOrder = 1;
    for (const stat of statistics.stats) {
      const itemResult = await client.query(
        `INSERT INTO components_customer_stat_items (number, label, suffix, icon)
         VALUES ($1, $2, $3, $4) RETURNING id;`,
        [stat.number, stat.label, stat.suffix, stat.icon]
      );
      await client.query(
        `INSERT INTO components_customer_statistics_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5);`,
        [statResult.rows[0].id, itemResult.rows[0].id, "customer.stat-item", "stats", childOrder++]
      );
    }

    // 5. FAQ
    const faq = customerPageData.faq;
    const faqResult = await client.query(
      `INSERT INTO components_customer_faq (badge, title, description)
       VALUES ($1, $2, $3) RETURNING id;`,
      [faq.badge, faq.title, faq.description]
    );
    await client.query(
      `INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, $3, $4, $5);`,
      [customersId, faqResult.rows[0].id, "customer.faq", "layout", componentOrder++]
    );
    
    childOrder = 1;
    for (const q of faq.questions) {
      const itemResult = await client.query(
        `INSERT INTO components_customer_faq_items (question, answer)
         VALUES ($1, $2) RETURNING id;`,
        [q.question, q.answer]
      );
      await client.query(
        `INSERT INTO components_customer_faq_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5);`,
        [faqResult.rows[0].id, itemResult.rows[0].id, "customer.faq-item", "questions", childOrder++]
      );
    }

    // 6. CTA
    const cta = customerPageData.cta;
    const ctaResult = await client.query(
      `INSERT INTO components_customer_cta (badge, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
      [cta.badge, cta.title, cta.description, cta.primaryButtonText, cta.primaryButtonLink, cta.secondaryButtonText, cta.secondaryButtonLink]
    );
    await client.query(
      `INSERT INTO customers_cmps (entity_id, cmp_id, component_type, field, "order")
       VALUES ($1, $2, $3, $4, $5);`,
      [customersId, ctaResult.rows[0].id, "customer.cta", "layout", componentOrder++]
    );
    
    childOrder = 1;
    for (const info of cta.contactInfo) {
      const itemResult = await client.query(
        `INSERT INTO components_customer_contact_info_items (text)
         VALUES ($1) RETURNING id;`,
        [info.text]
      );
      await client.query(
        `INSERT INTO components_customer_cta_cmps (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5);`,
        [ctaResult.rows[0].id, itemResult.rows[0].id, "customer.contact-info-item", "contact_info", childOrder++]
      );
    }

    console.log("  [OK] Successfully populated customer data with complete child connections.");
    console.log("\nMIGRATION COMPLETED SUCCESSFULLY");
  } catch (error) {
    if (error.code === '42P01') {
      console.log(`\nNote: some cmps tables might not exist yet if Strapi was never restarted. Strapi creates _cmps tables when it boots with the new schemas. You MUST restart Strapi before this script can find the _cmps tables!`);
    }
    console.error("\n[ERROR] Migration failed:", error.message);
  } finally {
    await client.end();
  }
}

fixCustomerSingleType();
