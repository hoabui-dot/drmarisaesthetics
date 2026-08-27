const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const https = require("https");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN = process.env.STRAPI_API_TOKEN || "your-api-token-here";

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// Image URLs to download and upload
const imageUrls = [
  {
    url: "https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=1080&q=80",
    name: "dental_team.jpg",
    alt: "Dental clinic team",
  },
  {
    url: "https://images.unsplash.com/photo-1684607632313-ededff0c700e?w=1080&q=80",
    name: "patient_consultation.jpg",
    alt: "Patient consultation",
  },
  {
    url: "https://images.unsplash.com/photo-1720180244267-67c2eb52f3a3?w=1080&q=80",
    name: "clinic_interior.jpg",
    alt: "Modern clinic interior",
  },
  {
    url: "https://images.unsplash.com/photo-1630438994394-3deff7a591bf?w=1080&q=80",
    name: "happy_patient.jpg",
    alt: "Happy patient smiling",
  },
  {
    url: "https://images.unsplash.com/photo-1691068765153-4de8f11b6c85?w=1080&q=80",
    name: "achievements.jpg",
    alt: "Achievements and certifications",
  },
  {
    url: "https://images.unsplash.com/photo-1770321119305-f191c09c5801?w=1080&q=80",
    name: "dental_technology.jpg",
    alt: "Dental technology equipment",
  },
];

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function uploadImageToStrapi(filepath, name, alt) {
  try {
    const formData = new FormData();
    formData.append("files", fs.createReadStream(filepath), name);

    const response = await axiosInstance.post(
      `${STRAPI_URL}/api/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    console.log(`✓ Uploaded ${name} with ID: ${response.data[0].id}`);
    return response.data[0];
  } catch (error) {
    console.error(
      `✗ Failed to upload ${name}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function uploadImages() {
  console.log("📸 Downloading and uploading images...\n");

  const uploadedImages = {};
  const tempDir = path.join(__dirname, "temp_images");

  // Create temp directory
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  for (const img of imageUrls) {
    try {
      const filepath = path.join(tempDir, img.name);

      console.log(`Downloading ${img.name}...`);
      await downloadImage(img.url, filepath);

      console.log(`Uploading ${img.name} to Strapi...`);
      const uploaded = await uploadImageToStrapi(filepath, img.name, img.alt);

      uploadedImages[img.name] = uploaded.id;

      // Clean up temp file
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error(`Failed to process ${img.name}:`, error.message);
    }
  }

  // Clean up temp directory
  try {
    fs.rmdirSync(tempDir);
  } catch (e) {
    // Ignore if directory not empty
  }

  console.log("\n✓ All images uploaded successfully\n");
  return uploadedImages;
}

async function updateAboutUsPage(imageIds) {
  console.log("📝 Updating About Us page...\n");

  const aboutUsContent = {
    hero: {
      badge: "About Us",
      title: "About Saigon International Dental Clinic",
      subtitle: "Your lifelong partner in oral health and confident smiles.",
      description:
        "Saigon International Dental Clinic is a leading provider of advanced dental care in Vietnam. We combine modern technology, international standards, and a highly experienced team to deliver safe, effective, and aesthetic dental solutions.",
      images: [
        { id: imageIds["dental_team.jpg"] },
        { id: imageIds["patient_consultation.jpg"] },
        { id: imageIds["clinic_interior.jpg"] },
        { id: imageIds["happy_patient.jpg"] },
      ].filter((img) => img.id),
    },
    achievements: {
      badge: "Our Achievements",
      title: "Recognized Excellence in Dental Care",
      description:
        "We are proud to be recognized as a leading dental clinic in Southeast Asia, with hundreds of successful implant and orthodontic cases each year.",
      imageId: imageIds["achievements.jpg"],
      features: [
        {
          icon: "Award",
          title: "International Certifications",
          description:
            "Accredited by leading international dental organizations",
        },
        {
          icon: "TrendingUp",
          title: "Advanced Implant Technology",
          description:
            "State-of-the-art equipment for precise and minimally invasive procedures",
        },
        {
          icon: "Users",
          title: "Thousands of Satisfied Patients",
          description:
            "Building lasting relationships through exceptional care and results",
        },
      ],
    },
    whyChooseUs: {
      badge: "Why Choose Us",
      title: "Why Patients Choose Us",
      description:
        "Our clinic is equipped with state-of-the-art facilities and a team of highly skilled dentists committed to delivering personalized care.",
      features: [
        {
          icon: "Scan",
          title: "Advanced 3D Scanning & CAD/CAM Technology",
          description:
            "Precision diagnostics and treatment planning with cutting-edge digital tools",
          imageId: imageIds["dental_technology.jpg"],
        },
        {
          icon: "UserCheck",
          title: "Experienced Specialists",
          description:
            "Our team of highly qualified dentists with international training",
          imageId: imageIds["patient_consultation.jpg"],
        },
        {
          icon: "FileText",
          title: "Transparent Treatment Plans",
          description:
            "Clear communication and detailed cost breakdowns before treatment",
          imageId: imageIds["clinic_interior.jpg"],
        },
        {
          icon: "Sofa",
          title: "Comfortable Modern Environment",
          description: "Relaxing atmosphere designed to reduce dental anxiety",
          imageId: imageIds["happy_patient.jpg"],
        },
      ],
      images: [
        { id: imageIds["dental_technology.jpg"] },
        { id: imageIds["patient_consultation.jpg"] },
        { id: imageIds["happy_patient.jpg"] },
        { id: imageIds["clinic_interior.jpg"] },
      ].filter((img) => img.id),
    },
    philosophy: {
      badge: "Our Philosophy",
      title: "Our Philosophy",
      quote: "Healthy smiles begin from the roots.",
      description:
        "We believe that long-term oral health starts with a strong foundation. Our mission is to provide not only beautiful smiles but also sustainable dental health for every patient. By focusing on preventive care, patient education, and personalized treatment plans, we ensure that your dental health is maintained for years to come.",
      imageId: imageIds["patient_consultation.jpg"],
      pillars: [
        { title: "Prevention", subtitle: "First" },
        { title: "Education", subtitle: "Always" },
        { title: "Excellence", subtitle: "Guaranteed" },
      ],
    },
    coreValues: {
      badge: "Core Values",
      title: "Our Core Values",
      description: "Three fundamental principles that guide everything we do",
      values: [
        {
          icon: "Lightbulb",
          title: "Innovation",
          description:
            "We continuously adopt advanced technologies to improve treatment outcomes",
        },
        {
          icon: "Shield",
          title: "Integrity",
          description: "We prioritize honesty, transparency, and patient trust",
        },
        {
          icon: "Heart",
          title: "Care",
          description:
            "We treat every patient with compassion and personalized attention",
        },
      ],
    },
    commitment: {
      badge: "Our Commitment",
      title: "Our Commitment to Excellence",
      description:
        "Five pillars that define our dedication to providing exceptional dental care",
      commitments: [
        {
          number: "1",
          icon: "Smile",
          title: "Patient Experience",
          subtitle: "Customer Experience",
          description:
            "We ensure a comfortable and stress-free journey from the moment you walk in",
        },
        {
          number: "2",
          icon: "Star",
          title: "Service Quality",
          subtitle: "Customer Service",
          description:
            "Delivering consistent, high-quality dental care that exceeds expectations",
        },
        {
          number: "3",
          icon: "Shield",
          title: "Safety & Hygiene",
          subtitle: "Cleanliness & Safety",
          description:
            "Strict sterilization protocols and international safety standards at all times",
        },
        {
          number: "4",
          icon: "Heart",
          title: "Compassionate Care",
          subtitle: "Compassion & Care",
          description:
            "Understanding and supporting every patient with empathy and personalized attention",
        },
        {
          number: "5",
          icon: "Users",
          title: "Community Responsibility",
          subtitle: "Community Commitment",
          description:
            "Contributing to better oral health awareness and accessible dental care for all",
        },
      ],
    },
    cta: {
      badge: "Get Started Today",
      title: "Ready to transform your smile?",
      description:
        "Book a consultation with our expert dental team today and take the first step towards a healthier, more confident smile.",
      primaryButtonText: "Book Appointment",
      primaryButtonLink: "#contact",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/services",
      contactInfo: [
        { text: "Hotline: 1900 8089" },
        { text: "info@saigondental.com" },
      ],
    },
  };

  const aboutUsData = {
    data: {
      title: "About Us - Saigon International Dental Clinic",
      slug: "about-us",
      description:
        "Learn about our mission, values, and the team behind Saigon International Dental Clinic",
      content: JSON.stringify(aboutUsContent),
      publishedAt: new Date().toISOString(),
    },
  };

  try {
    // Find the about-us page
    const pagesResponse = await axiosInstance.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=about-us`,
    );

    if (pagesResponse.data.data.length === 0) {
      console.log("About Us page not found, creating new one...");
      const createResponse = await axiosInstance.post(
        `${STRAPI_URL}/api/pages`,
        aboutUsData,
      );
      console.log(
        `✓ Created About Us page with ID: ${createResponse.data.data.id}`,
      );
    } else {
      const page = pagesResponse.data.data[0];
      const documentId = page.documentId;
      console.log(`Found About Us page with documentId: ${documentId}`);

      const updateResponse = await axiosInstance.put(
        `${STRAPI_URL}/api/pages/${documentId}`,
        aboutUsData,
      );
      console.log(`✓ Updated About Us page successfully`);
    }

    console.log("\n✅ About Us page updated with images!\n");
  } catch (error) {
    console.error(
      "✗ Failed to update About Us page:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting About Us page update with images...\n");

    // Step 1: Upload images
    const imageIds = await uploadImages();

    // Step 2: Update About Us page
    await updateAboutUsPage(imageIds);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
