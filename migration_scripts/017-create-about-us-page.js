/**
 * Migration Script: Create About Us Page
 *
 * This script creates an about us page with:
 * - Hero section with title and description
 * - Mission & Vision sections
 * - Team/Doctor profiles
 * - Values/Features
 * - Statistics
 * - CTA section
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

const aboutUsPageData = {
  title: "About Us - Saigon International Dental Clinic",
  slug: "about-us",
  description:
    "Learn about our mission, values, and the team behind Saigon International Dental Clinic",
  content: JSON.stringify({
    hero: {
      title: "About Saigon International Dental Clinic",
      subtitle:
        "Delivering world-class dental care with advanced technology and a dedicated team of specialists",
      description:
        "For over 15 years, we have been committed to providing exceptional dental care to our community. Our state-of-the-art facility and experienced team ensure that every patient receives personalized, high-quality treatment in a comfortable environment.",
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop",
    },
    mission: {
      title: "Our Mission",
      content:
        "To provide comprehensive, patient-centered dental care using the latest technology and techniques, while maintaining the highest standards of professionalism, ethics, and compassion. We strive to create beautiful, healthy smiles that last a lifetime.",
      icon: "Heart",
    },
    vision: {
      title: "Our Vision",
      content:
        "To be the leading dental clinic in Vietnam, recognized for excellence in patient care, innovation in dental technology, and commitment to continuous improvement. We aim to set new standards in dental healthcare and patient satisfaction.",
      icon: "Eye",
    },
    values: [
      {
        title: "Excellence",
        description:
          "We maintain the highest standards in every aspect of dental care, from diagnosis to treatment and follow-up.",
        icon: "Award",
      },
      {
        title: "Compassion",
        description:
          "We treat every patient with empathy, respect, and understanding, ensuring a comfortable and stress-free experience.",
        icon: "Heart",
      },
      {
        title: "Innovation",
        description:
          "We continuously invest in the latest dental technology and techniques to provide cutting-edge treatments.",
        icon: "Lightbulb",
      },
      {
        title: "Integrity",
        description:
          "We operate with transparency, honesty, and ethical practices in all our interactions with patients and partners.",
        icon: "Shield",
      },
    ],
    stats: [
      {
        number: "15+",
        label: "Years of Experience",
        icon: "Calendar",
      },
      {
        number: "10,000+",
        label: "Happy Patients",
        icon: "Users",
      },
      {
        number: "50+",
        label: "Expert Dentists",
        icon: "UserCheck",
      },
      {
        number: "98%",
        label: "Success Rate",
        icon: "TrendingUp",
      },
    ],
    team: [
      {
        name: "Dr. Nguyen Van An",
        title: "Chief Dental Officer",
        specialization: "Implantology & Prosthodontics",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        credentials: [
          "DDS, University of Medicine Ho Chi Minh City",
          "Master in Implantology, Seoul National University",
          "20+ years of experience",
          "Member of International Congress of Oral Implantologists",
        ],
      },
      {
        name: "Dr. Tran Thi Binh",
        title: "Senior Orthodontist",
        specialization: "Orthodontics & Invisalign",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
        credentials: [
          "DDS, Hanoi Medical University",
          "Certified Invisalign Provider",
          "15+ years of experience",
          "Member of World Federation of Orthodontists",
        ],
      },
      {
        name: "Dr. Le Minh Chau",
        title: "Cosmetic Dentistry Specialist",
        specialization: "Aesthetic & Restorative Dentistry",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        credentials: [
          "DDS, Can Tho University of Medicine",
          "Advanced Certificate in Cosmetic Dentistry",
          "12+ years of experience",
          "Member of American Academy of Cosmetic Dentistry",
        ],
      },
    ],
    facilities: {
      title: "State-of-the-Art Facilities",
      description:
        "Our clinic is equipped with the latest dental technology to ensure accurate diagnosis and effective treatment.",
      features: [
        {
          title: "3D Imaging & CT Scan",
          description:
            "Advanced imaging technology for precise diagnosis and treatment planning",
          icon: "Scan",
        },
        {
          title: "Digital Dentistry",
          description:
            "CAD/CAM technology for same-day crowns and precise restorations",
          icon: "Monitor",
        },
        {
          title: "Laser Dentistry",
          description:
            "Minimally invasive treatments with faster healing and less discomfort",
          icon: "Zap",
        },
        {
          title: "Sterilization Center",
          description:
            "Hospital-grade sterilization ensuring the highest hygiene standards",
          icon: "Shield",
        },
      ],
    },
    cta: {
      title: "Ready to Experience World-Class Dental Care?",
      description:
        "Schedule your consultation today and discover the difference our expertise can make",
      buttonText: "Book Appointment",
      buttonLink: "/booking",
    },
  }),
};

async function createAboutUsPage() {
  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Check if about-us page already exists
    const existingPage = await client.query(
      `SELECT id, document_id FROM pages WHERE slug = $1`,
      [aboutUsPageData.slug],
    );

    if (existingPage.rows.length > 0) {
      console.log("⚠️  About Us page already exists, updating...");

      await client.query(
        `UPDATE pages 
         SET title = $1, description = $2, content = $3, updated_at = NOW(), published_at = NOW()
         WHERE slug = $4`,
        [
          aboutUsPageData.title,
          aboutUsPageData.description,
          aboutUsPageData.content,
          aboutUsPageData.slug,
        ],
      );

      console.log("✅ About Us page updated successfully!");
      console.log(`   Document ID: ${existingPage.rows[0].document_id}`);
    } else {
      console.log("📝 Creating About Us page...");

      // Generate document_id
      const documentId = `about-us-${Date.now()}`;

      const result = await client.query(
        `INSERT INTO pages (
          document_id, title, slug, description, content, 
          published_at, created_at, updated_at, created_by_id, updated_by_id
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), 1, 1)
        RETURNING id, document_id`,
        [
          documentId,
          aboutUsPageData.title,
          aboutUsPageData.slug,
          aboutUsPageData.description,
          aboutUsPageData.content,
        ],
      );

      console.log("✅ About Us page created successfully!");
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Document ID: ${result.rows[0].document_id}`);
    }

    // Display the content structure
    console.log("\n📊 About Us Page Content Structure:");
    const content = JSON.parse(aboutUsPageData.content);

    console.log("\n🎯 Hero Section:");
    console.log(`   Title: ${content.hero.title}`);
    console.log(`   Subtitle: ${content.hero.subtitle}`);

    console.log("\n🎯 Mission & Vision:");
    console.log(`   Mission: ${content.mission.title}`);
    console.log(`   Vision: ${content.vision.title}`);

    console.log(`\n💎 Core Values (${content.values.length}):`);
    content.values.forEach((value) => {
      console.log(
        `   - ${value.title}: ${value.description.substring(0, 50)}...`,
      );
    });

    console.log(`\n📊 Statistics (${content.stats.length}):`);
    content.stats.forEach((stat) => {
      console.log(`   - ${stat.number} ${stat.label}`);
    });

    console.log(`\n👨‍⚕️ Team Members (${content.team.length}):`);
    content.team.forEach((member) => {
      console.log(`   - ${member.name} - ${member.title}`);
    });

    console.log(
      `\n🏥 Facilities (${content.facilities.features.length} features):`,
    );
    content.facilities.features.forEach((feature) => {
      console.log(`   - ${feature.title}`);
    });

    // Verify the page can be fetched
    const verifyPage = await client.query(
      `SELECT id, document_id, title, slug, published_at FROM pages WHERE slug = $1`,
      [aboutUsPageData.slug],
    );

    if (verifyPage.rows.length > 0) {
      console.log("\n✅ Verification successful!");
      console.log(
        `   Page is published: ${verifyPage.rows[0].published_at ? "Yes" : "No"}`,
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await client.end();
    console.log("\n✅ Database connection closed");
  }
}

// Run migration
createAboutUsPage()
  .then(() => {
    console.log("\n✅ Migration complete!");
    console.log("\n📌 Next steps:");
    console.log(
      "   1. Frontend will fetch this page from: /api/pages?filters[slug][$eq]=about-us",
    );
    console.log("   2. Create About Us page component in Next.js");
    console.log("   3. Content can be edited in Strapi admin panel");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
