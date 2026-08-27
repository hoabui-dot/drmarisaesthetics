/**
 * Script: Verify and Fix About Us Page Structure
 *
 * This script:
 * 1. Queries the PostgreSQL database to check About Us structure
 * 2. Verifies group components exist and are properly linked
 * 3. Creates/updates About Us single type if needed
 * 4. Ensures content manager can work with About Us single type
 * 5. Validates Strapi API returns correct data
 */

const { Client } = require("pg");
const axios = require("axios");
const https = require("https");

// Environment variables
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
  timeout: 30000,
});

async function checkDatabaseStructure() {
  console.log("🔍 Step 1: Checking Database Structure for About Us...\n");

  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Check for about_us table
    console.log("📋 Checking for about_us table...");
    const aboutUsTableResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'about_us'
      ORDER BY ordinal_position;
    `);

    if (aboutUsTableResult.rows.length > 0) {
      console.log("✓ about_us table exists with columns:");
      aboutUsTableResult.rows.forEach((col) => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });

      // Check data in about_us
      const aboutUsDataResult = await client.query(`
        SELECT id, document_id, title, description, published_at IS NOT NULL as is_published
        FROM about_us;
      `);

      if (aboutUsDataResult.rows.length > 0) {
        console.log("\n✓ About Us record found:");
        console.log(`  ID: ${aboutUsDataResult.rows[0].id}`);
        console.log(`  Document ID: ${aboutUsDataResult.rows[0].document_id}`);
        console.log(`  Title: ${aboutUsDataResult.rows[0].title}`);
        console.log(`  Published: ${aboutUsDataResult.rows[0].is_published}`);
      } else {
        console.log("\n⚠️ about_us table exists but no data found");
      }
    } else {
      console.log("⚠️ about_us table not found");
    }

    // Check for about_us_cmps (dynamic zone)
    console.log("\n📋 Checking for about_us_cmps table (dynamic zone)...");
    const cmpsTableResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'about_us_cmps'
      ORDER BY ordinal_position;
    `);

    if (cmpsTableResult.rows.length > 0) {
      console.log("✓ about_us_cmps table exists");

      // Check components linked
      const cmpsDataResult = await client.query(`
        SELECT component_type, COUNT(*) as count, MIN("order") as min_order
        FROM about_us_cmps
        GROUP BY component_type
        ORDER BY min_order;
      `);

      if (cmpsDataResult.rows.length > 0) {
        console.log("\n✓ Components linked to About Us:");
        cmpsDataResult.rows.forEach((row) => {
          console.log(
            `  - ${row.component_type}: ${row.count} (order: ${row.min_order})`,
          );
        });
      } else {
        console.log("\n⚠️ No components linked to About Us");
      }
    } else {
      console.log("⚠️ about_us_cmps table not found");
    }

    // Check component tables for About
    console.log("\n📋 Checking About component tables...");
    const componentTablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'components_about_%'
      ORDER BY table_name;
    `);

    if (componentTablesResult.rows.length > 0) {
      console.log("✓ Found About component tables:");
      for (const row of componentTablesResult.rows) {
        const countResult = await client.query(
          `SELECT COUNT(*) FROM "${row.table_name}"`,
        );
        console.log(
          `  - ${row.table_name}: ${countResult.rows[0].count} records`,
        );
      }
    } else {
      console.log("⚠️ No About component tables found");
    }

    // Check pages table for about-us
    console.log("\n📋 Checking pages table for about-us...");
    const pagesResult = await client.query(`
      SELECT id, document_id, slug, title, content IS NOT NULL as has_content, published_at IS NOT NULL as is_published
      FROM pages
      WHERE slug = 'about-us';
    `);

    if (pagesResult.rows.length > 0) {
      console.log("✓ about-us page found in pages table:");
      console.log(`  ID: ${pagesResult.rows[0].id}`);
      console.log(`  Document ID: ${pagesResult.rows[0].document_id}`);
      console.log(`  Has Content: ${pagesResult.rows[0].has_content}`);
      console.log(`  Published: ${pagesResult.rows[0].is_published}`);
    } else {
      console.log("⚠️ about-us not found in pages table");
    }

    return true;
  } catch (error) {
    console.error("❌ Database check failed:", error.message);
    return false;
  }
}

async function checkStrapiAPI() {
  console.log("\n🔍 Step 2: Checking Strapi API for About Us...\n");

  try {
    // Try to get about-us from pages API
    console.log("📡 Checking /api/pages?filters[slug][$eq]=about-us...");
    try {
      const pagesResponse = await axiosInstance.get(
        `${STRAPI_URL}/api/pages?filters[slug][$eq]=about-us&populate=*`,
      );

      if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
        const page = pagesResponse.data.data[0];
        console.log("✓ Found about-us in pages API:");
        console.log(`  ID: ${page.id}`);
        console.log(`  Title: ${page.title}`);
        console.log(`  Has Content: ${!!page.content}`);

        if (page.content) {
          try {
            const content = JSON.parse(page.content);
            console.log(
              `  Content sections: ${Object.keys(content).join(", ")}`,
            );
          } catch (e) {
            console.log(`  Content: (raw text, not JSON)`);
          }
        }
      } else {
        console.log("⚠️ about-us not found in pages API response");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("⚠️ Pages API returned 404");
      } else {
        console.log(`⚠️ Pages API error: ${error.message}`);
      }
    }

    // Try to get about-us single type API
    console.log("\n📡 Checking /api/about-us (single type)...");
    try {
      const aboutUsResponse = await axiosInstance.get(
        `${STRAPI_URL}/api/about-us?populate=deep`,
      );

      if (aboutUsResponse.data.data) {
        console.log("✓ Found about-us single type:");
        console.log(`  ID: ${aboutUsResponse.data.data.id}`);
        console.log(`  Title: ${aboutUsResponse.data.data.title || "N/A"}`);

        if (aboutUsResponse.data.data.layout) {
          console.log(
            `  Layout components: ${aboutUsResponse.data.data.layout.length}`,
          );
          aboutUsResponse.data.data.layout.forEach((comp, i) => {
            console.log(`    ${i + 1}. ${comp.__component}`);
          });
        }
      } else {
        console.log("⚠️ about-us single type returned empty data");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("⚠️ About Us single type API not found (404)");
        console.log(
          "   This means the content type may not be registered in Strapi",
        );
      } else {
        console.log(`⚠️ About Us single type API error: ${error.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ API check failed:", error.message);
    return false;
  }
}

async function createOrUpdateAboutUsStructure() {
  console.log("\n🔧 Step 3: Creating/Updating About Us Structure...\n");

  try {
    // First, ensure component tables exist
    console.log("📦 Ensuring component tables exist...\n");

    const componentTablesSql = [
      // Pillar item
      `CREATE TABLE IF NOT EXISTS components_about_pillar_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(500)
      );`,

      // Feature item
      `CREATE TABLE IF NOT EXISTS components_about_feature_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100),
        title VARCHAR(255),
        description TEXT
      );`,

      // Value item
      `CREATE TABLE IF NOT EXISTS components_about_value_items (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100),
        title VARCHAR(255),
        description TEXT
      );`,

      // Commitment item
      `CREATE TABLE IF NOT EXISTS components_about_commitment_items (
        id SERIAL PRIMARY KEY,
        number VARCHAR(50),
        icon VARCHAR(100),
        title VARCHAR(255),
        subtitle VARCHAR(500),
        description TEXT
      );`,

      // Contact info item
      `CREATE TABLE IF NOT EXISTS components_about_contact_info_items (
        id SERIAL PRIMARY KEY,
        text VARCHAR(500)
      );`,

      // Image item
      `CREATE TABLE IF NOT EXISTS components_about_image_items (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        path VARCHAR(500),
        alt VARCHAR(255),
        strapi_media_id INTEGER
      );`,

      // Hero component
      `CREATE TABLE IF NOT EXISTS components_about_heroes (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        subtitle VARCHAR(500),
        description TEXT
      );`,

      // Achievements component
      `CREATE TABLE IF NOT EXISTS components_about_achievements (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );`,

      // Why choose us component
      `CREATE TABLE IF NOT EXISTS components_about_why_choose_us (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );`,

      // Philosophy component
      `CREATE TABLE IF NOT EXISTS components_about_philosophies (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        quote VARCHAR(500),
        description TEXT
      );`,

      // Core values component
      `CREATE TABLE IF NOT EXISTS components_about_core_values (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );`,

      // Commitment component
      `CREATE TABLE IF NOT EXISTS components_about_commitments (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT
      );`,

      // CTA component
      `CREATE TABLE IF NOT EXISTS components_about_ctas (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(255),
        title VARCHAR(500),
        description TEXT,
        primary_button_text VARCHAR(255),
        primary_button_link VARCHAR(500),
        secondary_button_text VARCHAR(255),
        secondary_button_link VARCHAR(500)
      );`,

      // About Us single type table
      `CREATE TABLE IF NOT EXISTS about_us (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255) UNIQUE,
        title VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      );`,

      // Dynamic zone for about_us
      `CREATE TABLE IF NOT EXISTS about_us_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER,
        cmp_id INTEGER,
        component_type VARCHAR(255),
        field VARCHAR(255),
        "order" DOUBLE PRECISION
      );`,

      // Link tables for repeatable components
      `CREATE TABLE IF NOT EXISTS components_about_heroes_images_lnk (
        id SERIAL PRIMARY KEY,
        hero_id INTEGER,
        image_id INTEGER,
        image_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_achievements_features_lnk (
        id SERIAL PRIMARY KEY,
        achievement_id INTEGER,
        feature_id INTEGER,
        feature_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_why_choose_us_features_lnk (
        id SERIAL PRIMARY KEY,
        why_choose_us_id INTEGER,
        feature_id INTEGER,
        feature_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_why_choose_us_images_lnk (
        id SERIAL PRIMARY KEY,
        why_choose_us_id INTEGER,
        image_id INTEGER,
        image_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_philosophies_pillars_lnk (
        id SERIAL PRIMARY KEY,
        philosophy_id INTEGER,
        pillar_id INTEGER,
        pillar_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_core_values_values_lnk (
        id SERIAL PRIMARY KEY,
        core_value_id INTEGER,
        value_id INTEGER,
        value_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_commitments_items_lnk (
        id SERIAL PRIMARY KEY,
        commitment_id INTEGER,
        item_id INTEGER,
        item_order DOUBLE PRECISION
      );`,

      `CREATE TABLE IF NOT EXISTS components_about_ctas_contact_info_lnk (
        id SERIAL PRIMARY KEY,
        cta_id INTEGER,
        contact_id INTEGER,
        contact_order DOUBLE PRECISION
      );`,
    ];

    for (const sql of componentTablesSql) {
      await client.query(sql);
    }
    console.log("✓ All component tables created/verified");

    // Check if we need to populate About Us content
    const aboutUsResult = await client.query(`SELECT id FROM about_us LIMIT 1`);

    if (aboutUsResult.rows.length === 0) {
      console.log("\n📝 Creating About Us content...");
      await populateAboutUsContent();
    } else {
      console.log("\n✓ About Us record already exists, checking components...");

      // Check if components are linked
      const cmpsResult = await client.query(
        `
        SELECT COUNT(*) FROM about_us_cmps WHERE entity_id = $1
      `,
        [aboutUsResult.rows[0].id],
      );

      if (parseInt(cmpsResult.rows[0].count) === 0) {
        console.log("⚠️ No components linked, populating content...");
        await populateAboutUsContent();
      } else {
        console.log(`✓ ${cmpsResult.rows[0].count} components already linked`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Structure creation failed:", error.message);
    return false;
  }
}

async function populateAboutUsContent() {
  console.log("\n💾 Populating About Us Content...\n");

  try {
    // Get content from pages table if exists
    let existingContent = {};
    const pagesResult = await client.query(`
      SELECT content FROM pages WHERE slug = 'about-us'
    `);

    if (pagesResult.rows.length > 0 && pagesResult.rows[0].content) {
      try {
        existingContent = JSON.parse(pagesResult.rows[0].content);
        console.log("✓ Found existing content in pages table");
      } catch (e) {
        console.log("⚠️ Could not parse existing content, using defaults");
      }
    }

    // Default content structure matching migration 018
    const defaultContent = {
      hero: {
        badge: "About Us",
        title: "Nha Khoa Quốc Tế Sài Gòn",
        subtitle: "Saigon International Dental Clinic",
        description:
          "Hơn 15 năm kinh nghiệm, chúng tôi cam kết mang đến dịch vụ nha khoa chất lượng quốc tế với đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại nhất.",
        images: [
          {
            type: "strapi",
            path: "/uploads/about_hero_1.jpg",
            alt: "Dental clinic interior",
          },
          {
            type: "strapi",
            path: "/uploads/about_hero_2.jpg",
            alt: "Modern dental equipment",
          },
          {
            type: "strapi",
            path: "/uploads/about_hero_3.jpg",
            alt: "Friendly dental staff",
          },
          {
            type: "strapi",
            path: "/uploads/about_hero_4.jpg",
            alt: "Patient care",
          },
        ],
      },
      achievements: {
        badge: "Thành Tựu",
        title: "Những Con Số Ấn Tượng",
        description:
          "Sự tin tưởng của khách hàng là động lực để chúng tôi không ngừng phát triển",
        features: [
          { icon: "Calendar", title: "15+", description: "Năm kinh nghiệm" },
          {
            icon: "Users",
            title: "50,000+",
            description: "Khách hàng tin tưởng",
          },
          { icon: "Award", title: "100+", description: "Giải thưởng y tế" },
          { icon: "Heart", title: "98%", description: "Khách hàng hài lòng" },
        ],
      },
      whyChooseUs: {
        badge: "Tại Sao Chọn Chúng Tôi",
        title: "Cam Kết Chất Lượng Vượt Trội",
        description:
          "Chúng tôi luôn đặt sức khỏe và sự hài lòng của khách hàng lên hàng đầu",
        features: [
          {
            icon: "Shield",
            title: "Chất Lượng Quốc Tế",
            description: "Đạt chuẩn JCI và ISO quốc tế",
          },
          {
            icon: "Sparkles",
            title: "Công Nghệ Hiện Đại",
            description: "Trang thiết bị tiên tiến nhất",
          },
          {
            icon: "Users",
            title: "Đội Ngũ Chuyên Gia",
            description: "Bác sĩ được đào tạo tại nước ngoài",
          },
          {
            icon: "Clock",
            title: "Phục Vụ 24/7",
            description: "Luôn sẵn sàng hỗ trợ bạn",
          },
        ],
        images: [],
      },
      philosophy: {
        badge: "Triết Lý",
        title: "Triết Lý Điều Trị",
        quote: "Sức khỏe răng miệng là nền tảng của nụ cười tự tin",
        description:
          "Chúng tôi tin rằng mỗi bệnh nhân đều xứng đáng được chăm sóc với sự tôn trọng, tận tâm và kỹ thuật tốt nhất.",
        pillars: [
          { title: "Tận Tâm", subtitle: "Đặt bệnh nhân làm trung tâm" },
          {
            title: "Chuyên Môn",
            subtitle: "Không ngừng học hỏi và phát triển",
          },
          { title: "Đổi Mới", subtitle: "Ứng dụng công nghệ tiên tiến" },
          { title: "Minh Bạch", subtitle: "Rõ ràng trong mọi quy trình" },
        ],
      },
      coreValues: {
        badge: "Giá Trị Cốt Lõi",
        title: "Những Giá Trị Định Hình Chúng Tôi",
        description:
          "Các giá trị này hướng dẫn mọi quyết định và hành động của chúng tôi",
        values: [
          {
            icon: "Heart",
            title: "Tận Tâm",
            description: "Chăm sóc từng bệnh nhân như người thân",
          },
          {
            icon: "Award",
            title: "Xuất Sắc",
            description: "Luôn phấn đấu đạt kết quả tốt nhất",
          },
          {
            icon: "Shield",
            title: "Chính Trực",
            description: "Minh bạch và trung thực trong mọi việc",
          },
          {
            icon: "Lightbulb",
            title: "Sáng Tạo",
            description: "Đổi mới để mang lại giải pháp tốt hơn",
          },
        ],
      },
      commitment: {
        badge: "Cam Kết",
        title: "Cam Kết Của Chúng Tôi",
        description:
          "Những lời hứa chúng tôi đặt ra cho bản thân và khách hàng",
        commitments: [
          {
            number: "01",
            icon: "Shield",
            title: "An Toàn",
            subtitle: "Tuyệt đối",
            description: "Tiêu chuẩn vệ sinh và an toàn cao nhất",
          },
          {
            number: "02",
            icon: "Clock",
            title: "Đúng Giờ",
            subtitle: "Tôn trọng thời gian",
            description: "Luôn đảm bảo lịch hẹn đúng giờ",
          },
          {
            number: "03",
            icon: "CreditCard",
            title: "Giá Cả",
            subtitle: "Minh bạch",
            description: "Báo giá rõ ràng, không phát sinh",
          },
          {
            number: "04",
            icon: "HeartHandshake",
            title: "Hỗ Trợ",
            subtitle: "Trọn đời",
            description: "Chăm sóc sau điều trị suốt đời",
          },
        ],
      },
      cta: {
        badge: "Đặt Lịch Hẹn",
        title: "Sẵn Sàng Trải Nghiệm?",
        description:
          "Hãy để chúng tôi chăm sóc nụ cười của bạn với dịch vụ nha khoa chất lượng quốc tế",
        primaryButtonText: "Đặt Lịch Ngay",
        primaryButtonLink: "/booking",
        secondaryButtonText: "Xem Dịch Vụ",
        secondaryButtonLink: "/services",
        contactInfo: [
          { text: "Hotline: 1900 8089" },
          { text: "Email: info@saigondental.com" },
        ],
      },
    };

    // Merge with existing content
    const content = { ...defaultContent, ...existingContent };

    // Insert/update about_us record
    const aboutUsResult = await client.query(
      `
      INSERT INTO about_us (document_id, title, description, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW(), NOW())
      ON CONFLICT (document_id) DO UPDATE
      SET title = $2, description = $3, published_at = NOW(), updated_at = NOW()
      RETURNING id;
    `,
      [
        "about-us-singleton",
        "About Us - Saigon International Dental Clinic",
        "Learn about our mission, values, and the team behind Saigon International Dental Clinic",
      ],
    );

    const aboutUsId = aboutUsResult.rows[0].id;
    console.log(`✓ About Us record ID: ${aboutUsId}`);

    // Clear existing component associations
    await client.query(`DELETE FROM about_us_cmps WHERE entity_id = $1`, [
      aboutUsId,
    ]);

    let componentOrder = 1;

    // Insert Hero
    if (content.hero) {
      const heroResult = await client.query(
        `
        INSERT INTO components_about_heroes (badge, title, subtitle, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `,
        [
          content.hero.badge,
          content.hero.title,
          content.hero.subtitle,
          content.hero.description,
        ],
      );

      const heroId = heroResult.rows[0].id;

      // Insert images
      if (content.hero.images) {
        for (let i = 0; i < content.hero.images.length; i++) {
          const img = content.hero.images[i];
          const imageResult = await client.query(
            `
            INSERT INTO components_about_image_items (type, path, alt)
            VALUES ($1, $2, $3)
            RETURNING id;
          `,
            [img.type || "strapi", img.path, img.alt],
          );

          await client.query(
            `
            INSERT INTO components_about_heroes_images_lnk (hero_id, image_id, image_order)
            VALUES ($1, $2, $3);
          `,
            [heroId, imageResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [aboutUsId, heroId, "about.hero", "layout", componentOrder++],
      );
      console.log("✓ Inserted hero component");
    }

    // Insert Achievements
    if (content.achievements) {
      const achievementsResult = await client.query(
        `
        INSERT INTO components_about_achievements (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          content.achievements.badge,
          content.achievements.title,
          content.achievements.description,
        ],
      );

      const achievementsId = achievementsResult.rows[0].id;

      if (content.achievements.features) {
        for (let i = 0; i < content.achievements.features.length; i++) {
          const feature = content.achievements.features[i];
          const featureResult = await client.query(
            `
            INSERT INTO components_about_feature_items (icon, title, description)
            VALUES ($1, $2, $3)
            RETURNING id;
          `,
            [feature.icon, feature.title, feature.description],
          );

          await client.query(
            `
            INSERT INTO components_about_achievements_features_lnk (achievement_id, feature_id, feature_order)
            VALUES ($1, $2, $3);
          `,
            [achievementsId, featureResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          achievementsId,
          "about.achievements",
          "layout",
          componentOrder++,
        ],
      );
      console.log("✓ Inserted achievements component");
    }

    // Insert Why Choose Us
    if (content.whyChooseUs) {
      const whyChooseUsResult = await client.query(
        `
        INSERT INTO components_about_why_choose_us (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          content.whyChooseUs.badge,
          content.whyChooseUs.title,
          content.whyChooseUs.description,
        ],
      );

      const whyChooseUsId = whyChooseUsResult.rows[0].id;

      if (content.whyChooseUs.features) {
        for (let i = 0; i < content.whyChooseUs.features.length; i++) {
          const feature = content.whyChooseUs.features[i];
          const featureResult = await client.query(
            `
            INSERT INTO components_about_feature_items (icon, title, description)
            VALUES ($1, $2, $3)
            RETURNING id;
          `,
            [feature.icon, feature.title, feature.description],
          );

          await client.query(
            `
            INSERT INTO components_about_why_choose_us_features_lnk (why_choose_us_id, feature_id, feature_order)
            VALUES ($1, $2, $3);
          `,
            [whyChooseUsId, featureResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          whyChooseUsId,
          "about.why-choose-us",
          "layout",
          componentOrder++,
        ],
      );
      console.log("✓ Inserted why-choose-us component");
    }

    // Insert Philosophy
    if (content.philosophy) {
      const philosophyResult = await client.query(
        `
        INSERT INTO components_about_philosophies (badge, title, quote, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `,
        [
          content.philosophy.badge,
          content.philosophy.title,
          content.philosophy.quote,
          content.philosophy.description,
        ],
      );

      const philosophyId = philosophyResult.rows[0].id;

      if (content.philosophy.pillars) {
        for (let i = 0; i < content.philosophy.pillars.length; i++) {
          const pillar = content.philosophy.pillars[i];
          const pillarResult = await client.query(
            `
            INSERT INTO components_about_pillar_items (title, subtitle)
            VALUES ($1, $2)
            RETURNING id;
          `,
            [pillar.title, pillar.subtitle],
          );

          await client.query(
            `
            INSERT INTO components_about_philosophies_pillars_lnk (philosophy_id, pillar_id, pillar_order)
            VALUES ($1, $2, $3);
          `,
            [philosophyId, pillarResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          philosophyId,
          "about.philosophy",
          "layout",
          componentOrder++,
        ],
      );
      console.log("✓ Inserted philosophy component");
    }

    // Insert Core Values
    if (content.coreValues) {
      const coreValuesResult = await client.query(
        `
        INSERT INTO components_about_core_values (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          content.coreValues.badge,
          content.coreValues.title,
          content.coreValues.description,
        ],
      );

      const coreValuesId = coreValuesResult.rows[0].id;

      if (content.coreValues.values) {
        for (let i = 0; i < content.coreValues.values.length; i++) {
          const value = content.coreValues.values[i];
          const valueResult = await client.query(
            `
            INSERT INTO components_about_value_items (icon, title, description)
            VALUES ($1, $2, $3)
            RETURNING id;
          `,
            [value.icon, value.title, value.description],
          );

          await client.query(
            `
            INSERT INTO components_about_core_values_values_lnk (core_value_id, value_id, value_order)
            VALUES ($1, $2, $3);
          `,
            [coreValuesId, valueResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          coreValuesId,
          "about.core-values",
          "layout",
          componentOrder++,
        ],
      );
      console.log("✓ Inserted core-values component");
    }

    // Insert Commitment
    if (content.commitment) {
      const commitmentResult = await client.query(
        `
        INSERT INTO components_about_commitments (badge, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [
          content.commitment.badge,
          content.commitment.title,
          content.commitment.description,
        ],
      );

      const commitmentId = commitmentResult.rows[0].id;

      if (content.commitment.commitments) {
        for (let i = 0; i < content.commitment.commitments.length; i++) {
          const item = content.commitment.commitments[i];
          const itemResult = await client.query(
            `
            INSERT INTO components_about_commitment_items (number, icon, title, subtitle, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
          `,
            [
              item.number,
              item.icon,
              item.title,
              item.subtitle,
              item.description,
            ],
          );

          await client.query(
            `
            INSERT INTO components_about_commitments_items_lnk (commitment_id, item_id, item_order)
            VALUES ($1, $2, $3);
          `,
            [commitmentId, itemResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [
          aboutUsId,
          commitmentId,
          "about.commitment",
          "layout",
          componentOrder++,
        ],
      );
      console.log("✓ Inserted commitment component");
    }

    // Insert CTA
    if (content.cta) {
      const ctaResult = await client.query(
        `
        INSERT INTO components_about_ctas (badge, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `,
        [
          content.cta.badge,
          content.cta.title,
          content.cta.description,
          content.cta.primaryButtonText,
          content.cta.primaryButtonLink,
          content.cta.secondaryButtonText,
          content.cta.secondaryButtonLink,
        ],
      );

      const ctaId = ctaResult.rows[0].id;

      if (content.cta.contactInfo) {
        for (let i = 0; i < content.cta.contactInfo.length; i++) {
          const info = content.cta.contactInfo[i];
          const infoResult = await client.query(
            `
            INSERT INTO components_about_contact_info_items (text)
            VALUES ($1)
            RETURNING id;
          `,
            [info.text],
          );

          await client.query(
            `
            INSERT INTO components_about_ctas_contact_info_lnk (cta_id, contact_id, contact_order)
            VALUES ($1, $2, $3);
          `,
            [ctaId, infoResult.rows[0].id, i + 1],
          );
        }
      }

      await client.query(
        `
        INSERT INTO about_us_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5);
      `,
        [aboutUsId, ctaId, "about.cta", "layout", componentOrder++],
      );
      console.log("✓ Inserted cta component");
    }

    console.log(
      `\n✅ Total ${componentOrder - 1} components populated successfully!`,
    );
    return true;
  } catch (error) {
    console.error("❌ Content population failed:", error.message);
    throw error;
  }
}

async function verifyFinalSetup() {
  console.log("\n🔍 Step 4: Final Verification...\n");

  try {
    // Verify database
    const aboutUsResult = await client.query(`
      SELECT id, document_id, title, published_at IS NOT NULL as is_published
      FROM about_us;
    `);

    if (aboutUsResult.rows.length > 0) {
      console.log("✓ About Us Database Record:");
      console.log(`  ID: ${aboutUsResult.rows[0].id}`);
      console.log(`  Document ID: ${aboutUsResult.rows[0].document_id}`);
      console.log(`  Published: ${aboutUsResult.rows[0].is_published}`);
    }

    // Count components
    const cmpsResult = await client.query(`
      SELECT component_type, COUNT(*) as count
      FROM about_us_cmps
      GROUP BY component_type
      ORDER BY MIN("order");
    `);

    console.log("\n✓ Components in About Us:");
    cmpsResult.rows.forEach((row) => {
      console.log(`  - ${row.component_type}`);
    });

    // Test API
    console.log("\n📡 Testing Strapi API...");

    // Try pages API
    try {
      const pagesResponse = await axiosInstance.get(
        `${STRAPI_URL}/api/pages?filters[slug][$eq]=about-us`,
      );
      if (pagesResponse.data.data?.length > 0) {
        console.log("✓ /api/pages?filters[slug][$eq]=about-us - Working");
      }
    } catch (e) {
      console.log(`⚠️ Pages API: ${e.message}`);
    }

    // Try about-us single type
    try {
      const aboutUsResponse = await axiosInstance.get(
        `${STRAPI_URL}/api/about-us?populate=deep`,
      );
      if (aboutUsResponse.data.data) {
        console.log("✓ /api/about-us?populate=deep - Working");
      }
    } catch (e) {
      console.log(`⚠️ About Us Single Type API: ${e.message}`);
      console.log(
        "   Note: You may need to restart Strapi to register the new content type",
      );
    }

    return true;
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  Strapi CMS - Verify & Fix About Us Structure Script      ║");
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n",
  );

  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔐 API Token: ${API_TOKEN.substring(0, 20)}...`);
  console.log("");

  try {
    // Step 1: Check database structure
    await checkDatabaseStructure();

    // Step 2: Check Strapi API
    await checkStrapiAPI();

    // Step 3: Create/Update structure
    await createOrUpdateAboutUsStructure();

    // Step 4: Final verification
    await verifyFinalSetup();

    console.log(
      "\n╔════════════════════════════════════════════════════════════╗",
    );
    console.log(
      "║              ✅ VERIFICATION COMPLETED                      ║",
    );
    console.log(
      "╚════════════════════════════════════════════════════════════╝",
    );
    console.log("\n📋 Next Steps:");
    console.log("  1. Restart Strapi to load content type changes");
    console.log("  2. Access Strapi admin → Content Manager → About Us");
    console.log("  3. Verify frontend displays content correctly");
    console.log("  4. Test API: GET /api/about-us?populate=deep");
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n✓ Database connection closed");
  }
}

main();
