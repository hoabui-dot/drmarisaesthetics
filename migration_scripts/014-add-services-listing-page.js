/**
 * Migration Script: Add Services Listing Page Data
 *
 * This script creates a services listing page content type in Strapi
 * with hero section, service cards, and CTA content.
 *
 * Run: node migration_scripts/014-add-services-listing-page.js
 */

const axios = require("axios");
const { Pool } = require("pg");

// Configuration
const STRAPI_URL =
  process.env.STRAPI_URL ||
  "https://corp-circle-register-restricted.trycloudflare.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.STRAPI_API_TOKEN;

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

const pool = new Pool(DB_CONFIG);

// Service cards data
const serviceCards = [
  {
    slug: "implant",
    title: "Cấy ghép Implant",
    titleEn: "Dental Implants",
    description:
      "Giải pháp phục hồi răng mất vĩnh viễn với công nghệ cấy ghép Implant hiện đại",
    icon: "🦷",
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "invisalign",
    title: "Niềng răng Invisalign",
    titleEn: "Invisalign Clear Aligners",
    description:
      "Chỉnh nha trong suốt hiện đại, thẩm mỹ cao không cần mắc cài kim loại",
    icon: "✨",
    color: "from-purple-500 to-pink-500",
  },
  {
    slug: "veneer",
    title: "Bọc răng sứ thẩm mỹ",
    titleEn: "Cosmetic Porcelain Crowns",
    description:
      "Răng sứ cao cấp, bền đẹp, màu sắc tự nhiên cho nụ cười hoàn hảo",
    icon: "💎",
    color: "from-amber-500 to-orange-500",
  },
  {
    slug: "whitening",
    title: "Tẩy trắng răng",
    titleEn: "Teeth Whitening",
    description:
      "Răng trắng sáng an toàn với công nghệ Laser Whitening hiện đại",
    icon: "⭐",
    color: "from-green-500 to-emerald-500",
  },
];

async function updateServicesListingInDatabase() {
  const client = await pool.connect();

  try {
    console.log("🔄 Starting database update for services listing page...\n");

    // Check if services_listing table exists, if not we'll store in pages table
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'services_listing'
      );
    `;

    const tableExists = await client.query(checkTableQuery);

    if (!tableExists.rows[0].exists) {
      console.log("ℹ️  services_listing table does not exist");
      console.log(
        '📝 Storing services listing data in pages table with slug "services-listing"\n',
      );

      // Check if services-listing page exists
      const checkPageQuery = `
        SELECT id, document_id FROM pages WHERE slug = 'services-listing';
      `;

      const pageResult = await client.query(checkPageQuery);

      const servicesData = {
        hero: {
          title: "Dịch vụ nha khoa chuyên nghiệp",
          description:
            "Chúng tôi cung cấp đa dạng các dịch vụ nha khoa với công nghệ hiện đại và đội ngũ bác sĩ giàu kinh nghiệm",
        },
        services: serviceCards,
        cta: {
          title: "Bạn cần tư vấn về dịch vụ nha khoa?",
          description:
            "Đội ngũ bác sĩ chuyên khoa của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn",
          primaryButton: {
            text: "Đặt lịch tư vấn miễn phí",
            link: "/booking",
          },
          secondaryButton: {
            text: "Liên hệ ngay",
            link: "/contact",
          },
        },
        features: [
          {
            icon: "🏆",
            title: "Đội ngũ chuyên nghiệp",
            description: "Bác sĩ giàu kinh nghiệm, được đào tạo bài bản",
          },
          {
            icon: "🔬",
            title: "Công nghệ hiện đại",
            description: "Trang thiết bị tiên tiến, công nghệ cập nhật",
          },
          {
            icon: "💯",
            title: "Cam kết chất lượng",
            description: "Bảo hành dài hạn, hỗ trợ sau điều trị",
          },
        ],
      };

      if (pageResult.rows.length > 0) {
        // Update existing page
        const updateQuery = `
          UPDATE pages 
          SET 
            title = $1,
            description = $2,
            content = $3,
            updated_at = NOW()
          WHERE slug = 'services-listing'
          RETURNING id;
        `;

        await client.query(updateQuery, [
          "Dịch vụ nha khoa",
          "Các dịch vụ nha khoa chuyên nghiệp",
          JSON.stringify(servicesData),
        ]);

        console.log("✅ Updated services-listing page in database");
      } else {
        // Create new page
        const insertQuery = `
          INSERT INTO pages (
            document_id,
            title,
            slug,
            description,
            content,
            published_at,
            created_at,
            updated_at,
            created_by_id,
            updated_by_id,
            locale
          ) VALUES (
            gen_random_uuid()::text,
            $1,
            'services-listing',
            $2,
            $3,
            NOW(),
            NOW(),
            NOW(),
            1,
            1,
            'en'
          )
          RETURNING id;
        `;

        await client.query(insertQuery, [
          "Dịch vụ nha khoa",
          "Các dịch vụ nha khoa chuyên nghiệp",
          JSON.stringify(servicesData),
        ]);

        console.log("✅ Created services-listing page in database");
      }
    }

    console.log("\n✅ Services listing page data updated successfully!");
    console.log("\n📊 Services Data:");
    console.log("   - Hero section with title and description");
    console.log("   - 4 service cards with icons and descriptions");
    console.log("   - CTA section with booking buttons");
    console.log("   - 3 feature highlights");
  } catch (error) {
    console.error("❌ Error updating services listing:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    console.log("🚀 Services Listing Page Migration\n");
    console.log("📍 Database:", DB_CONFIG.host);
    console.log("📍 Strapi API:", STRAPI_URL);
    console.log("");

    await updateServicesListingInDatabase();

    console.log("\n✨ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Update Next.js frontend to fetch services listing data");
    console.log("   2. Implement service template UI components");
    console.log("   3. Test the services listing page");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
