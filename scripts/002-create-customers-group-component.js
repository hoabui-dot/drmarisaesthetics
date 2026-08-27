/**
 * Script: Create Customers Group Component for Strapi CMS
 *
 * This script creates the customers group component in Content-Type Builder
 * matching the schema in migration_scripts/024-create-customer-page.js
 *
 * Components created:
 * - customers.hero
 * - customers.success-story (repeatable)
 * - customers.benefit (repeatable)
 * - customers.statistic (repeatable)
 * - customers.faq-item (repeatable)
 * - customers.cta
 * - customers.contact-info (repeatable)
 *
 * Single Type: customers-page
 */

const { Client } = require("pg");
const axios = require("axios");
const https = require("https");

// Environment variables from dental-frontend/.env.local
const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.STRAPI_API_TOKEN;

const client = new Client({
  host: process.env.DB_HOST || "100.68.50.41",
  port: process.env.DB_PORT || 5437,
  database: process.env.DB_NAME || "dental_cms_strapi",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function healthCheck() {
  console.log("🔍 Performing Health Check...\n");

  try {
    // Check Strapi API
    console.log("📡 Checking Strapi API...");
    const response = await axiosInstance.get(`${STRAPI_URL}/api`);
    console.log(`✓ Strapi API is accessible at ${STRAPI_URL}`);

    // Check database connection
    console.log("\n📦 Checking Database Connection...");
    await client.connect();
    console.log("✓ Database connection successful");

    // Check existing tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'components_%'
      ORDER BY table_name;
    `);
    console.log(`✓ Found ${tablesResult.rows.length} component tables`);

    // Check for existing customer components
    const customerTables = tablesResult.rows.filter((r) =>
      r.table_name.includes("customer"),
    );
    if (customerTables.length > 0) {
      console.log("\n⚠️ Existing customer component tables:");
      customerTables.forEach((t) => console.log(`  - ${t.table_name}`));
    } else {
      console.log("\n✓ No existing customer component tables found");
    }

    return true;
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    if (error.response) {
      console.error("  Response status:", error.response.status);
      console.error("  Response data:", error.response.data);
    }
    return false;
  }
}

async function createCustomersComponents() {
  console.log("\n🚀 Creating Customers Group Components...\n");

  try {
    // 1. Create component tables
    console.log("📦 Creating component tables...\n");

    // Components customers hero
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_heroes (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        subtitle VARCHAR(500),
        description TEXT
      );
    `);
    console.log("✓ Created components_customers_heroes table");

    // Components customers image item (for hero images)
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_image_items (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        path VARCHAR(500),
        alt VARCHAR(255)
      );
    `);
    console.log("✓ Created components_customers_image_items table");

    // Components customers success story
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_success_stories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        location VARCHAR(255),
        treatment VARCHAR(255),
        quote TEXT,
        rating INTEGER DEFAULT 5,
        before_after BOOLEAN DEFAULT false,
        icon VARCHAR(100)
      );
    `);
    console.log("✓ Created components_customers_success_stories table");

    // Components customers benefit
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_benefits (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100),
        title VARCHAR(255),
        description TEXT
      );
    `);
    console.log("✓ Created components_customers_benefits table");

    // Components customers statistic
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_statistics (
        id SERIAL PRIMARY KEY,
        number VARCHAR(50),
        label VARCHAR(255),
        suffix VARCHAR(50),
        icon VARCHAR(100)
      );
    `);
    console.log("✓ Created components_customers_statistics table");

    // Components customers faq item
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_faq_items (
        id SERIAL PRIMARY KEY,
        question TEXT,
        answer TEXT
      );
    `);
    console.log("✓ Created components_customers_faq_items table");

    // Components customers contact info
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_contact_infos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255)
      );
    `);
    console.log("✓ Created components_customers_contact_infos table");

    // Components customers cta
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_ctas (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT,
        primary_button_text VARCHAR(255),
        primary_button_link VARCHAR(500),
        secondary_button_text VARCHAR(255),
        secondary_button_link VARCHAR(500)
      );
    `);
    console.log("✓ Created components_customers_ctas table");

    // Components customers success stories section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_success_stories_sections (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );
    `);
    console.log(
      "✓ Created components_customers_success_stories_sections table",
    );

    // Components customers benefits section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_benefits_sections (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );
    `);
    console.log("✓ Created components_customers_benefits_sections table");

    // Components customers statistics section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_statistics_sections (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500)
      );
    `);
    console.log("✓ Created components_customers_statistics_sections table");

    // Components customers faq section
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_faq_sections (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );
    `);
    console.log("✓ Created components_customers_faq_sections table");

    // 2. Create customers single-type table
    console.log("\n📄 Creating customers single-type table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS customers_pages (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255) UNIQUE,
        title VARCHAR(500),
        slug VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      );
    `);
    console.log("✓ Created customers_pages table");

    // Create dynamic zone table for components
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers_pages_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER REFERENCES customers_pages(id) ON DELETE CASCADE,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION
      );
    `);
    console.log("✓ Created customers_pages_cmps table");

    // Create link tables for repeatable components
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_heroes_images_lnk (
        id SERIAL PRIMARY KEY,
        hero_id INTEGER,
        image_item_id INTEGER,
        image_order DOUBLE PRECISION
      );
    `);
    console.log("✓ Created components_customers_heroes_images_lnk table");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_success_stories_sections_stories_lnk (
        id SERIAL PRIMARY KEY,
        section_id INTEGER,
        story_id INTEGER,
        story_order DOUBLE PRECISION
      );
    `);
    console.log("✓ Created stories link table");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_benefits_sections_benefits_lnk (
        id SERIAL PRIMARY KEY,
        section_id INTEGER,
        benefit_id INTEGER,
        benefit_order DOUBLE PRECISION
      );
    `);
    console.log("✓ Created benefits link table");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_statistics_sections_stats_lnk (
        id SERIAL PRIMARY KEY,
        section_id INTEGER,
        stat_id INTEGER,
        stat_order DOUBLE PRECISION
      );
    `);
    console.log("✓ Created statistics link table");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_faq_sections_questions_lnk (
        id SERIAL PRIMARY KEY,
        section_id INTEGER,
        question_id INTEGER,
        question_order DOUBLE PRECISION
      );
    `);
    console.log("✓ Created faq link table");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customers_ctas_contact_info_lnk (
        id SERIAL PRIMARY KEY,
        cta_id INTEGER,
        contact_info_id INTEGER,
        contact_order DOUBLE PRECISION
      );
    `);
    console.log("✓ Created cta contact info link table");

    console.log("\n✅ All customers component tables created successfully!");

    return true;
  } catch (error) {
    console.error("❌ Failed to create component tables:", error.message);
    throw error;
  }
}

async function populateCustomersContent() {
  console.log("\n💾 Populating customers content...\n");

  try {
    // Get the content data from migration script 024
    const customerContent = {
      hero: {
        badge: "Our Customers",
        title: "Trusted by Thousands of Happy Patients",
        subtitle: "Your smile is our success story",
        description:
          "For over 15 years, we have been honored to serve patients from around the world. Our commitment to excellence has earned us the trust of thousands of families who rely on us for their dental care needs.",
        images: [
          {
            type: "strapi",
            path: "/uploads/happy_customers_hero.jpg",
            alt: "Happy dental patients",
          },
          {
            type: "strapi",
            path: "/uploads/patient_smile.jpg",
            alt: "Patient with beautiful smile",
          },
          {
            type: "strapi",
            path: "/uploads/family_dental.jpg",
            alt: "Family dental care",
          },
          {
            type: "strapi",
            path: "/uploads/patient_consultation.jpg",
            alt: "Patient consultation",
          },
        ],
      },
      successStories: {
        badge: "Success Stories",
        title: "Real Stories from Real Patients",
        description:
          "Hear from our patients about their transformative dental experiences and the confidence they've gained through our care.",
        stories: [
          {
            name: "Sarah Thompson",
            location: "Australia",
            treatment: "Full Smile Makeover",
            quote:
              "I traveled from Sydney specifically for my treatment here. The results exceeded my expectations - my new smile has completely changed my confidence level.",
            rating: 5,
            beforeAfter: true,
            icon: "Star",
          },
          {
            name: "Michael Chen",
            location: "Singapore",
            treatment: "Dental Implants",
            quote:
              "After losing two teeth in an accident, I was devastated. The team here not only restored my smile but made the entire process comfortable and stress-free.",
            rating: 5,
            beforeAfter: true,
            icon: "Heart",
          },
          {
            name: "Emma Williams",
            location: "United Kingdom",
            treatment: "Invisalign Treatment",
            quote:
              "As an adult, I was hesitant about orthodontic treatment. The Invisalign solution was perfect - discreet and effective. I couldn't be happier!",
            rating: 5,
            beforeAfter: true,
            icon: "Smile",
          },
          {
            name: "David Park",
            location: "South Korea",
            treatment: "Teeth Whitening",
            quote:
              "Professional, efficient, and the results speak for themselves. My teeth are now several shades whiter and I feel years younger.",
            rating: 5,
            beforeAfter: false,
            icon: "Sparkles",
          },
        ],
      },
      customerBenefits: {
        badge: "Why Patients Choose Us",
        title: "The Benefits Our Customers Enjoy",
        description:
          "We go above and beyond to ensure every patient receives exceptional care and value.",
        benefits: [
          {
            icon: "Award",
            title: "International Quality Standards",
            description:
              "Our clinic meets and exceeds international dental care standards, ensuring you receive world-class treatment.",
          },
          {
            icon: "Clock",
            title: "Flexible Scheduling",
            description:
              "We offer convenient appointment times including weekends and evenings to fit your busy lifestyle.",
          },
          {
            icon: "Globe",
            title: "Multilingual Staff",
            description:
              "Our team speaks multiple languages including English, Vietnamese, Korean, and Japanese for your comfort.",
          },
          {
            icon: "Shield",
            title: "Comprehensive Warranty",
            description:
              "All major treatments come with extended warranties, giving you peace of mind for years to come.",
          },
          {
            icon: "Plane",
            title: "Dental Tourism Support",
            description:
              "We assist international patients with accommodation recommendations, airport transfers, and treatment planning.",
          },
          {
            icon: "CreditCard",
            title: "Flexible Payment Options",
            description:
              "Choose from various payment plans and financing options to make your treatment affordable.",
          },
        ],
      },
      statistics: {
        badge: "By The Numbers",
        title: "Our Track Record Speaks for Itself",
        stats: [
          {
            number: "15,000+",
            label: "Happy Patients",
            suffix: "",
            icon: "Users",
          },
          {
            number: "98%",
            label: "Satisfaction Rate",
            suffix: "",
            icon: "ThumbsUp",
          },
          {
            number: "50+",
            label: "Countries Served",
            suffix: "",
            icon: "Globe",
          },
          {
            number: "25,000+",
            label: "Successful Treatments",
            suffix: "",
            icon: "CheckCircle",
          },
        ],
      },
      faq: {
        badge: "Customer FAQ",
        title: "Frequently Asked Questions",
        description: "Find answers to common questions from our patients",
        questions: [
          {
            question: "How do I book my first appointment?",
            answer:
              "You can book your appointment through our website, by calling our hotline at 1900 8089, or by sending us an email. Our team will respond within 24 hours to confirm your booking.",
          },
          {
            question: "Do you offer services in English?",
            answer:
              "Yes! Our entire team is fluent in English, and we have staff members who speak Korean, Japanese, and Mandarin as well. We ensure clear communication throughout your treatment.",
          },
          {
            question: "What payment methods do you accept?",
            answer:
              "We accept cash (VND and USD), credit/debit cards (Visa, Mastercard, JCB), bank transfers, and various financing options. International patients can also use their travel insurance.",
          },
          {
            question: "Is there parking available at the clinic?",
            answer:
              "Yes, we provide free parking for all patients at both of our clinic locations. Motorcycle and car parking are available.",
          },
          {
            question: "How long does a typical treatment take?",
            answer:
              "Treatment duration varies depending on the procedure. Simple checkups take 30-45 minutes, while complex treatments like implants may require multiple visits over several months. We provide detailed timelines during your consultation.",
          },
          {
            question: "Do you offer aftercare support?",
            answer:
              "Absolutely! We provide comprehensive aftercare instructions, follow-up appointments, and 24/7 emergency support for our patients. Your long-term oral health is our priority.",
          },
        ],
      },
      cta: {
        badge: "Join Our Family",
        title: "Ready to Experience the Difference?",
        description:
          "Join thousands of satisfied patients and discover why we're the trusted choice for dental care in Vietnam.",
        primaryButtonText: "Book Your Consultation",
        primaryButtonLink: "/contact",
        secondaryButtonText: "View Our Services",
        secondaryButtonLink: "/services",
        contactInfo: [
          { text: "Hotline: 1900 8089" },
          { text: "info@saigondental.com" },
        ],
      },
    };

    // Insert or update customers_pages record
    const customersResult = await client.query(
      `
      INSERT INTO customers_pages (document_id, title, slug, description, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())
      ON CONFLICT (document_id) DO UPDATE
      SET title = $2, slug = $3, description = $4, published_at = NOW(), updated_at = NOW()
      RETURNING id;
    `,
      [
        "customers-page-singleton",
        "Our Customers - Saigon International Dental Clinic",
        "customers",
        "Discover why thousands of patients trust Saigon International Dental Clinic for their dental care needs.",
      ],
    );

    const customersPageId = customersResult.rows[0].id;
    console.log(`✓ Created/Updated customers page with ID: ${customersPageId}`);

    // Clear existing components for this page
    await client.query(
      `DELETE FROM customers_pages_cmps WHERE entity_id = $1`,
      [customersPageId],
    );
    console.log("✓ Cleared existing component associations");

    let componentOrder = 1;

    // Insert Hero component
    const heroResult = await client.query(
      `
      INSERT INTO components_customers_heroes (badge, title, subtitle, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `,
      [
        customerContent.hero.badge,
        customerContent.hero.title,
        customerContent.hero.subtitle,
        customerContent.hero.description,
      ],
    );

    const heroId = heroResult.rows[0].id;

    // Insert hero images
    for (let i = 0; i < customerContent.hero.images.length; i++) {
      const img = customerContent.hero.images[i];
      const imageResult = await client.query(
        `
        INSERT INTO components_customers_image_items (type, path, alt)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [img.type, img.path, img.alt],
      );

      await client.query(
        `
        INSERT INTO components_customers_heroes_images_lnk (hero_id, image_item_id, image_order)
        VALUES ($1, $2, $3);
      `,
        [heroId, imageResult.rows[0].id, i + 1],
      );
    }

    await client.query(
      `
      INSERT INTO customers_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5);
    `,
      [customersPageId, heroId, "customers.hero", "layout", componentOrder++],
    );
    console.log("✓ Inserted hero component with images");

    // Insert Success Stories Section
    const storiesSectionResult = await client.query(
      `
      INSERT INTO components_customers_success_stories_sections (badge, title, description)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [
        customerContent.successStories.badge,
        customerContent.successStories.title,
        customerContent.successStories.description,
      ],
    );

    const storiesSectionId = storiesSectionResult.rows[0].id;

    // Insert stories
    for (let i = 0; i < customerContent.successStories.stories.length; i++) {
      const story = customerContent.successStories.stories[i];
      const storyResult = await client.query(
        `
        INSERT INTO components_customers_success_stories (name, location, treatment, quote, rating, before_after, icon)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `,
        [
          story.name,
          story.location,
          story.treatment,
          story.quote,
          story.rating,
          story.beforeAfter,
          story.icon,
        ],
      );

      await client.query(
        `
        INSERT INTO components_customers_success_stories_sections_stories_lnk (section_id, story_id, story_order)
        VALUES ($1, $2, $3);
      `,
        [storiesSectionId, storyResult.rows[0].id, i + 1],
      );
    }

    await client.query(
      `
      INSERT INTO customers_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5);
    `,
      [
        customersPageId,
        storiesSectionId,
        "customers.success-stories-section",
        "layout",
        componentOrder++,
      ],
    );
    console.log("✓ Inserted success stories section");

    // Insert Benefits Section
    const benefitsSectionResult = await client.query(
      `
      INSERT INTO components_customers_benefits_sections (badge, title, description)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [
        customerContent.customerBenefits.badge,
        customerContent.customerBenefits.title,
        customerContent.customerBenefits.description,
      ],
    );

    const benefitsSectionId = benefitsSectionResult.rows[0].id;

    // Insert benefits
    for (let i = 0; i < customerContent.customerBenefits.benefits.length; i++) {
      const benefit = customerContent.customerBenefits.benefits[i];
      const benefitResult = await client.query(
        `
        INSERT INTO components_customers_benefits (icon, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [benefit.icon, benefit.title, benefit.description],
      );

      await client.query(
        `
        INSERT INTO components_customers_benefits_sections_benefits_lnk (section_id, benefit_id, benefit_order)
        VALUES ($1, $2, $3);
      `,
        [benefitsSectionId, benefitResult.rows[0].id, i + 1],
      );
    }

    await client.query(
      `
      INSERT INTO customers_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5);
    `,
      [
        customersPageId,
        benefitsSectionId,
        "customers.benefits-section",
        "layout",
        componentOrder++,
      ],
    );
    console.log("✓ Inserted benefits section");

    // Insert Statistics Section
    const statsSectionResult = await client.query(
      `
      INSERT INTO components_customers_statistics_sections (badge, title)
      VALUES ($1, $2)
      RETURNING id;
    `,
      [customerContent.statistics.badge, customerContent.statistics.title],
    );

    const statsSectionId = statsSectionResult.rows[0].id;

    // Insert stats
    for (let i = 0; i < customerContent.statistics.stats.length; i++) {
      const stat = customerContent.statistics.stats[i];
      const statResult = await client.query(
        `
        INSERT INTO components_customers_statistics (number, label, suffix, icon)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `,
        [stat.number, stat.label, stat.suffix, stat.icon],
      );

      await client.query(
        `
        INSERT INTO components_customers_statistics_sections_stats_lnk (section_id, stat_id, stat_order)
        VALUES ($1, $2, $3);
      `,
        [statsSectionId, statResult.rows[0].id, i + 1],
      );
    }

    await client.query(
      `
      INSERT INTO customers_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5);
    `,
      [
        customersPageId,
        statsSectionId,
        "customers.statistics-section",
        "layout",
        componentOrder++,
      ],
    );
    console.log("✓ Inserted statistics section");

    // Insert FAQ Section
    const faqSectionResult = await client.query(
      `
      INSERT INTO components_customers_faq_sections (badge, title, description)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [
        customerContent.faq.badge,
        customerContent.faq.title,
        customerContent.faq.description,
      ],
    );

    const faqSectionId = faqSectionResult.rows[0].id;

    // Insert questions
    for (let i = 0; i < customerContent.faq.questions.length; i++) {
      const q = customerContent.faq.questions[i];
      const questionResult = await client.query(
        `
        INSERT INTO components_customers_faq_items (question, answer)
        VALUES ($1, $2)
        RETURNING id;
      `,
        [q.question, q.answer],
      );

      await client.query(
        `
        INSERT INTO components_customers_faq_sections_questions_lnk (section_id, question_id, question_order)
        VALUES ($1, $2, $3);
      `,
        [faqSectionId, questionResult.rows[0].id, i + 1],
      );
    }

    await client.query(
      `
      INSERT INTO customers_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5);
    `,
      [
        customersPageId,
        faqSectionId,
        "customers.faq-section",
        "layout",
        componentOrder++,
      ],
    );
    console.log("✓ Inserted FAQ section");

    // Insert CTA Section
    const ctaResult = await client.query(
      `
      INSERT INTO components_customers_ctas (badge, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `,
      [
        customerContent.cta.badge,
        customerContent.cta.title,
        customerContent.cta.description,
        customerContent.cta.primaryButtonText,
        customerContent.cta.primaryButtonLink,
        customerContent.cta.secondaryButtonText,
        customerContent.cta.secondaryButtonLink,
      ],
    );

    const ctaId = ctaResult.rows[0].id;

    // Insert contact info
    for (let i = 0; i < customerContent.cta.contactInfo.length; i++) {
      const info = customerContent.cta.contactInfo[i];
      const contactResult = await client.query(
        `
        INSERT INTO components_customers_contact_infos (text)
        VALUES ($1)
        RETURNING id;
      `,
        [info.text],
      );

      await client.query(
        `
        INSERT INTO components_customers_ctas_contact_info_lnk (cta_id, contact_info_id, contact_order)
        VALUES ($1, $2, $3);
      `,
        [ctaId, contactResult.rows[0].id, i + 1],
      );
    }

    await client.query(
      `
      INSERT INTO customers_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5);
    `,
      [customersPageId, ctaId, "customers.cta", "layout", componentOrder++],
    );
    console.log("✓ Inserted CTA section");

    console.log(
      `\n✅ All ${componentOrder - 1} components populated successfully!`,
    );

    return true;
  } catch (error) {
    console.error("❌ Failed to populate content:", error.message);
    throw error;
  }
}

async function verifyCustomersSetup() {
  console.log("\n🔍 Verifying Customers Setup...\n");

  try {
    // Check customers_pages
    const pagesResult = await client.query(`
      SELECT id, document_id, title, slug, published_at IS NOT NULL as is_published
      FROM customers_pages;
    `);

    if (pagesResult.rows.length === 0) {
      console.log("❌ No customers page found");
      return false;
    }

    console.log("✓ Customers page found:");
    console.log(`  ID: ${pagesResult.rows[0].id}`);
    console.log(`  Document ID: ${pagesResult.rows[0].document_id}`);
    console.log(`  Title: ${pagesResult.rows[0].title}`);
    console.log(`  Slug: ${pagesResult.rows[0].slug}`);
    console.log(`  Published: ${pagesResult.rows[0].is_published}`);

    // Check components
    const cmpsResult = await client.query(`
      SELECT component_type, COUNT(*) as count
      FROM customers_pages_cmps
      GROUP BY component_type
      ORDER BY "order";
    `);

    console.log("\n✓ Components attached to customers page:");
    cmpsResult.rows.forEach((row) => {
      console.log(`  - ${row.component_type}: ${row.count}`);
    });

    // Count items in each component table
    console.log("\n✓ Component data counts:");

    const heroCount = await client.query(
      `SELECT COUNT(*) FROM components_customers_heroes`,
    );
    console.log(`  - Heroes: ${heroCount.rows[0].count}`);

    const storiesCount = await client.query(
      `SELECT COUNT(*) FROM components_customers_success_stories`,
    );
    console.log(`  - Success Stories: ${storiesCount.rows[0].count}`);

    const benefitsCount = await client.query(
      `SELECT COUNT(*) FROM components_customers_benefits`,
    );
    console.log(`  - Benefits: ${benefitsCount.rows[0].count}`);

    const statsCount = await client.query(
      `SELECT COUNT(*) FROM components_customers_statistics`,
    );
    console.log(`  - Statistics: ${statsCount.rows[0].count}`);

    const faqCount = await client.query(
      `SELECT COUNT(*) FROM components_customers_faq_items`,
    );
    console.log(`  - FAQ Items: ${faqCount.rows[0].count}`);

    return true;
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  Strapi CMS - Customers Group Component Creation Script   ║");
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n",
  );

  try {
    // Health check
    const healthOk = await healthCheck();
    if (!healthOk) {
      console.log(
        "\n⚠️ Health check failed. Please verify your configuration.",
      );
      process.exit(1);
    }

    // Create component tables
    await createCustomersComponents();

    // Populate content
    await populateCustomersContent();

    // Verify setup
    const verified = await verifyCustomersSetup();

    if (verified) {
      console.log(
        "\n╔════════════════════════════════════════════════════════════╗",
      );
      console.log(
        "║              ✅ MIGRATION COMPLETED SUCCESSFULLY            ║",
      );
      console.log(
        "╚════════════════════════════════════════════════════════════╝",
      );
      console.log("\n📋 Next Steps:");
      console.log("  1. Restart Strapi to load new component schemas");
      console.log("  2. Access Strapi admin and verify customers content type");
      console.log("  3. Test /api/customers-page endpoint");
      console.log(
        "  4. Frontend will fetch from: /api/customers-page?populate=deep",
      );
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n✓ Database connection closed");
  }
}

main();
