/**
 * Migration Script: Create Customer Page
 *
 * This script creates a customer page similar to about-us page structure with:
 * - Hero section with title, subtitle, and description
 * - Customer testimonials/success stories
 * - Customer benefits section
 * - Statistics section
 * - FAQ section
 * - CTA section
 * 
 * The content is stored as JSON in the 'content' field, managed via Strapi CMS.
 * Images are referenced by Strapi media IDs for CMS control.
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

const customerPageData = {
  title: "Our Customers - Saigon International Dental Clinic",
  slug: "customers",
  description:
    "Discover why thousands of patients trust Saigon International Dental Clinic for their dental care needs.",
  content: JSON.stringify({
    hero: {
      badge: "Our Customers",
      title: "Trusted by Thousands of Happy Patients",
      subtitle: "Your smile is our success story",
      description:
        "For over 15 years, we have been honored to serve patients from around the world. Our commitment to excellence has earned us the trust of thousands of families who rely on us for their dental care needs.",
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
      description:
        "Hear from our patients about their transformative dental experiences and the confidence they've gained through our care.",
      stories: [
        {
          name: "Sarah Thompson",
          location: "Australia",
          treatment: "Full Smile Makeover",
          quote: "I traveled from Sydney specifically for my treatment here. The results exceeded my expectations - my new smile has completely changed my confidence level.",
          rating: 5,
          beforeAfter: true,
          icon: "Star"
        },
        {
          name: "Michael Chen",
          location: "Singapore",
          treatment: "Dental Implants",
          quote: "After losing two teeth in an accident, I was devastated. The team here not only restored my smile but made the entire process comfortable and stress-free.",
          rating: 5,
          beforeAfter: true,
          icon: "Heart"
        },
        {
          name: "Emma Williams",
          location: "United Kingdom",
          treatment: "Invisalign Treatment",
          quote: "As an adult, I was hesitant about orthodontic treatment. The Invisalign solution was perfect - discreet and effective. I couldn't be happier!",
          rating: 5,
          beforeAfter: true,
          icon: "Smile"
        },
        {
          name: "David Park",
          location: "South Korea",
          treatment: "Teeth Whitening",
          quote: "Professional, efficient, and the results speak for themselves. My teeth are now several shades whiter and I feel years younger.",
          rating: 5,
          beforeAfter: false,
          icon: "Sparkles"
        }
      ]
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
          description: "Our clinic meets and exceeds international dental care standards, ensuring you receive world-class treatment."
        },
        {
          icon: "Clock",
          title: "Flexible Scheduling",
          description: "We offer convenient appointment times including weekends and evenings to fit your busy lifestyle."
        },
        {
          icon: "Globe",
          title: "Multilingual Staff",
          description: "Our team speaks multiple languages including English, Vietnamese, Korean, and Japanese for your comfort."
        },
        {
          icon: "Shield",
          title: "Comprehensive Warranty",
          description: "All major treatments come with extended warranties, giving you peace of mind for years to come."
        },
        {
          icon: "Plane",
          title: "Dental Tourism Support",
          description: "We assist international patients with accommodation recommendations, airport transfers, and treatment planning."
        },
        {
          icon: "CreditCard",
          title: "Flexible Payment Options",
          description: "Choose from various payment plans and financing options to make your treatment affordable."
        }
      ]
    },
    statistics: {
      badge: "By The Numbers",
      title: "Our Track Record Speaks for Itself",
      stats: [
        {
          number: "15,000+",
          label: "Happy Patients",
          suffix: "",
          icon: "Users"
        },
        {
          number: "98%",
          label: "Satisfaction Rate",
          suffix: "",
          icon: "ThumbsUp"
        },
        {
          number: "50+",
          label: "Countries Served",
          suffix: "",
          icon: "Globe"
        },
        {
          number: "25,000+",
          label: "Successful Treatments",
          suffix: "",
          icon: "CheckCircle"
        }
      ]
    },
    faq: {
      badge: "Customer FAQ",
      title: "Frequently Asked Questions",
      description: "Find answers to common questions from our patients",
      questions: [
        {
          question: "How do I book my first appointment?",
          answer: "You can book your appointment through our website, by calling our hotline at 1900 8089, or by sending us an email. Our team will respond within 24 hours to confirm your booking."
        },
        {
          question: "Do you offer services in English?",
          answer: "Yes! Our entire team is fluent in English, and we have staff members who speak Korean, Japanese, and Mandarin as well. We ensure clear communication throughout your treatment."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash (VND and USD), credit/debit cards (Visa, Mastercard, JCB), bank transfers, and various financing options. International patients can also use their travel insurance."
        },
        {
          question: "Is there parking available at the clinic?",
          answer: "Yes, we provide free parking for all patients at both of our clinic locations. Motorcycle and car parking are available."
        },
        {
          question: "How long does a typical treatment take?",
          answer: "Treatment duration varies depending on the procedure. Simple checkups take 30-45 minutes, while complex treatments like implants may require multiple visits over several months. We provide detailed timelines during your consultation."
        },
        {
          question: "Do you offer aftercare support?",
          answer: "Absolutely! We provide comprehensive aftercare instructions, follow-up appointments, and 24/7 emergency support for our patients. Your long-term oral health is our priority."
        }
      ]
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
        { text: "info@saigondental.com" }
      ]
    }
  }),
};

async function createCustomerPage() {
  try {
    await client.connect();
    console.log("Connected to database");

    // Check if customer page already exists
    const existingPage = await client.query(
      `SELECT id, document_id FROM pages WHERE slug = $1`,
      [customerPageData.slug],
    );

    if (existingPage.rows.length > 0) {
      console.log("Customer page already exists, updating...");

      await client.query(
        `UPDATE pages 
         SET title = $1, description = $2, content = $3, updated_at = NOW(), published_at = NOW()
         WHERE slug = $4`,
        [
          customerPageData.title,
          customerPageData.description,
          customerPageData.content,
          customerPageData.slug,
        ],
      );

      console.log("Customer page updated successfully!");
      console.log(`   Document ID: ${existingPage.rows[0].document_id}`);
    } else {
      console.log("Creating Customer page...");

      // Generate document_id
      const documentId = `customers-${Date.now()}`;

      const result = await client.query(
        `INSERT INTO pages (
          document_id, title, slug, description, content, 
          published_at, created_at, updated_at, created_by_id, updated_by_id
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), 1, 1)
        RETURNING id, document_id`,
        [
          documentId,
          customerPageData.title,
          customerPageData.slug,
          customerPageData.description,
          customerPageData.content,
        ],
      );

      console.log("Customer page created successfully!");
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Document ID: ${result.rows[0].document_id}`);
    }

    // Display the content structure
    console.log("\n Customer Page Content Structure:");
    const content = JSON.parse(customerPageData.content);

    console.log("\n Hero Section:");
    console.log(`   Title: ${content.hero.title}`);
    console.log(`   Subtitle: ${content.hero.subtitle}`);

    console.log(`\n Success Stories (${content.successStories.stories.length}):`);
    content.successStories.stories.forEach((story) => {
      console.log(`   - ${story.name} (${story.location}): ${story.treatment}`);
    });

    console.log(`\n Customer Benefits (${content.customerBenefits.benefits.length}):`);
    content.customerBenefits.benefits.forEach((benefit) => {
      console.log(`   - ${benefit.title}`);
    });

    console.log(`\n Statistics (${content.statistics.stats.length}):`);
    content.statistics.stats.forEach((stat) => {
      console.log(`   - ${stat.number} ${stat.label}`);
    });

    console.log(`\n FAQ Questions (${content.faq.questions.length}):`);
    content.faq.questions.forEach((q) => {
      console.log(`   - ${q.question}`);
    });

    // Verify the page can be fetched
    const verifyPage = await client.query(
      `SELECT id, document_id, title, slug, published_at FROM pages WHERE slug = $1`,
      [customerPageData.slug],
    );

    if (verifyPage.rows.length > 0) {
      console.log("\n Verification successful!");
      console.log(`   Page is published: ${verifyPage.rows[0].published_at ? "Yes" : "No"}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  } finally {
    await client.end();
    console.log("\n Database connection closed");
  }
}

// Run migration
createCustomerPage()
  .then(() => {
    console.log("\n Migration complete!");
    console.log("\n Next steps:");
    console.log("   1. Frontend will fetch this page from: /api/pages?filters[slug][$eq]=customers");
    console.log("   2. Customer page component is available at: /customers");
    console.log("   3. Content can be edited in Strapi admin panel under Pages");
    console.log("   4. Images can be updated in Content Manager by editing the JSON content field");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n Migration failed:", error);
    process.exit(1);
  });
