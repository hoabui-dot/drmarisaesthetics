#!/usr/bin/env node

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Data directly synced from PAGE_DATA inside ServicesPageClient.tsx
const PAGE_DATA = {
  hero: {
    badge: 'Premium Dental Services',
    title: 'World-Class Dental Care\nin Ho Chi Minh City',
    description: 'Evidence-based treatments by internationally trained specialists. From cosmetic refinements to full restorations — curated for you.',
    trust: [
      { icon: 'Star', label: '4.9 / 5', sub: '500+ verified reviews' },
      { icon: 'Users', label: '2,000+ Patients', sub: 'Local & international' },
      { icon: 'Clock', label: '15+ Years', sub: 'Clinical experience' },
    ],
  },
  services: [
    {
      slug: 'dental-implants',
      title: 'Dental Implants',
      category: 'Implants',
      description: 'Permanent tooth replacement with titanium implants — restoring function, aesthetics, and confidence for life.',
      image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=900',
    },
    {
      slug: 'dental-braces',
      title: 'Dental Braces',
      category: 'Orthodontics',
      description: 'Metal, ceramic, and clear aligners — precisely aligned smiles with the right system for your lifestyle.',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffbb083ac22?auto=format&fit=crop&q=80&w=900',
    },
    {
      slug: 'dental-bleaching',
      title: 'Teeth Whitening',
      category: 'Cosmetic',
      description: 'Clinically proven bleaching — in-office Zoom, at-home trays, or combination therapy for lasting brightness.',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900',
    },
    {
      slug: 'dental-veneers',
      title: 'Dental Veneers',
      category: 'Cosmetic',
      description: 'Ultra-thin porcelain laminates bonded to natural teeth — flawless smile transformation in 24 hours.',
      image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=900',
    },
    {
      slug: 'dental-veneers-cost',
      title: 'Dental Crowns',
      category: 'Cosmetic',
      description: 'Zirconia, Emax, and Lava Plus crowns — clinical-grade protection with premium natural aesthetics.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=900',
    },
    {
      slug: 'general-check-up',
      title: 'General Dentistry',
      category: 'General',
      description: 'Comprehensive exams, professional cleaning, fillings, and preventive care — your oral health foundation.',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=900',
    },
  ],
  features: [
    {
      icon: 'Shield',
      title: 'International Standards',
      description: 'JCI-aligned protocols and ISO-certified materials from leading dental manufacturers worldwide.',
    },
    {
      icon: 'ScanLine',
      title: 'Advanced Diagnostics',
      description: 'Digital X-ray, 3D CBCT scanning, and intraoral cameras for precise, evidence-based treatment planning.',
    },
    {
      icon: 'Globe',
      title: 'Global Patient Care',
      description: 'English-speaking team with experience serving patients from 30+ countries across Asia and beyond.',
    },
  ],
};

async function run() {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL");
    
    // Create timestamps
    const now = new Date().toISOString();

    await client.query("BEGIN"); // Use transaction

    // 1. Insert Singleton Page Data (published) with Strapi v5 tracker constraints
    const docId = 'serviceoverv000000000001';
    
    // Clean up first to prevent duplicates
    await client.query("DELETE FROM services_overview");
    await client.query("DELETE FROM services_overview_cmps");
    
    const { rows: [{ id: parentId }] } = await client.query(`
      INSERT INTO services_overview (document_id, locale, title, description, created_at, updated_at, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [docId, "en", "Services Overview", "Dental services listing", now, now, now]);
    console.log(`[OK] Inserted main single-type row with ID ${parentId}`);

    // Track order for layout dynamic zone
    let layoutOrder = 1;

    // 2. Insert Hero
    const { rows: [{ id: heroId }] } = await client.query(`
      INSERT INTO components_services_overview_hero (title, description, badge)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [PAGE_DATA.hero.title, PAGE_DATA.hero.description, PAGE_DATA.hero.badge]);
    console.log(`[OK] Inserted Hero container ID ${heroId}`);

    // Hero -> Trust Metrics
    for (let i = 0; i < PAGE_DATA.hero.trust.length; i++) {
      const item = PAGE_DATA.hero.trust[i];
      const { rows: [{ id: trustId }] } = await client.query(`
        INSERT INTO components_services_overview_trust_items (icon, label, sub)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [item.icon, item.label, item.sub]);

      await client.query(`
        INSERT INTO components_services_overview_hero_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'services-overview.trust-item', 'trust', $3)
      `, [heroId, trustId, i + 1]);
    }

    // Link Hero to Dynamic Zone layout
    await client.query(`
      INSERT INTO services_overview_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, 'services-overview.hero', 'layout', $3)
    `, [parentId, heroId, layoutOrder++]);

    // 3. Insert Service Cards
    const { rows: [{ id: cardsId }] } = await client.query(`
      INSERT INTO components_services_overview_service_cards DEFAULT VALUES
      RETURNING id
    `);
    console.log(`[OK] Inserted Service Cards container ID ${cardsId}`);

    for (let i = 0; i < PAGE_DATA.services.length; i++) {
        const item = PAGE_DATA.services[i];
        const { rows: [{ id: srvId }] } = await client.query(`
          INSERT INTO components_services_overview_service_items (slug, title, category, description, image_url)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `, [item.slug, item.title, item.category, item.description, item.image]);

        await client.query(`
          INSERT INTO components_services_overview_service_cards_cmps (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'services-overview.service-item', 'services', $3)
        `, [cardsId, srvId, i + 1]);
    }

    // Link Service Cards to Dynamic Zone layout
    await client.query(`
      INSERT INTO services_overview_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, 'services-overview.service-cards', 'layout', $3)
    `, [parentId, cardsId, layoutOrder++]);


    // 4. Insert Features
    const { rows: [{ id: featuresId }] } = await client.query(`
      INSERT INTO components_services_overview_features DEFAULT VALUES
      RETURNING id
    `);
    console.log(`[OK] Inserted Features container ID ${featuresId}`);

    for (let i = 0; i < PAGE_DATA.features.length; i++) {
        const item = PAGE_DATA.features[i];
        const { rows: [{ id: featId }] } = await client.query(`
          INSERT INTO components_services_overview_feature_items (icon, title, description)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [item.icon, item.title, item.description]);

        await client.query(`
          INSERT INTO components_services_overview_features_cmps (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'services-overview.feature-item', 'features', $3)
        `, [featuresId, featId, i + 1]);
    }

    // Link Features to Dynamic Zone layout
    await client.query(`
      INSERT INTO services_overview_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, 'services-overview.features', 'layout', $3)
    `, [parentId, featuresId, layoutOrder++]);

    await client.query("COMMIT");
    console.log("Migration (Seed Services Overview) completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
