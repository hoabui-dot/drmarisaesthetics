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
    url: "https://images.unsplash.com/photo-1770321119162-05c18fbcfdb9?w=1080&q=80",
    name: "dental_consultation.jpg",
    alt: "Professional dentist patient consultation",
  },
  {
    url: "https://images.unsplash.com/photo-1762625570087-6d98fca29531?w=1080&q=80",
    name: "clinic_reception_d1.jpg",
    alt: "Modern dental clinic reception District 1",
  },
  {
    url: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=1080&q=80",
    name: "clinic_interior_d7.jpg",
    alt: "Dental clinic interior bright District 7",
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

async function createContactPage(imageIds) {
  console.log("📝 Creating Contact page...\n");

  const contactContent = {
    hero: {
      icon: "Sparkles",
      title: "Contact Us",
      subtitle: "We're here to help you achieve a healthy and confident smile.",
    },
    quickContact: {
      cards: [
        {
          icon: "Phone",
          title: "Hotline",
          content: "1900 8059",
          subtitle: "Available 24/7",
        },
        {
          icon: "Mail",
          title: "Email",
          content: "contact@nhakhoasaigon.vn",
          subtitle: "We reply within 24h",
        },
        {
          icon: "Clock",
          title: "Working Hours",
          content: "Mon–Fri: 08:00–18:00",
          subtitle: "Sat: 09:00–15:00",
        },
        {
          icon: "MessageCircle",
          title: "Live Chat",
          content: "Chat with us",
          subtitle: "Online support",
        },
      ],
    },
    contactForm: {
      title: "Send us a message",
      description:
        "Fill out the form below and we'll get back to you as soon as possible.",
      imageId: imageIds["dental_consultation.jpg"],
      badge: {
        title: "Trusted by 10,000+ patients",
        subtitle: "We're committed to your dental health",
      },
      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "John Doe",
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
          placeholder: "+84 123 456 789",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "john@example.com",
        },
        {
          name: "service",
          label: "Service",
          type: "select",
          required: true,
          options: [
            { value: "general", label: "General Checkup" },
            { value: "cleaning", label: "Teeth Cleaning" },
            { value: "whitening", label: "Teeth Whitening" },
            { value: "braces", label: "Braces & Orthodontics" },
            { value: "implants", label: "Dental Implants" },
            { value: "emergency", label: "Emergency Care" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: false,
          placeholder: "Tell us more about your needs...",
          rows: 4,
        },
      ],
    },
    clinicLocations: {
      title: "Our Clinic Locations",
      subtitle: "Visit us at any of our convenient locations",
      locations: [
        {
          name: "Saigon International Dental - District 1",
          address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
          phone: "1900 8059",
          imageId: imageIds["clinic_reception_d1.jpg"],
          mapUrl: "https://maps.google.com",
        },
        {
          name: "Saigon International Dental - District 7",
          address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
          phone: "1900 8059",
          imageId: imageIds["clinic_interior_d7.jpg"],
          mapUrl: "https://maps.google.com",
        },
      ],
    },
    mapSection: {
      enabled: true,
      title: "Interactive Map",
      description:
        "Google Maps integration would be displayed here showing both clinic locations.",
      note: "(Requires Google Maps API key in production)",
      markers: [
        { name: "District 1", address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam" },
        { name: "District 7", address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam" },
      ],
    },
    cta: {
      title: "Book your consultation today",
      description:
        "Our experts are ready to help you achieve your perfect smile. Don't wait—take the first step towards better dental health.",
      primaryButtonText: "Book Appointment",
      primaryButtonLink: "#contact",
      secondaryButtonText: "Call Us: 1900 8059",
      secondaryButtonLink: "tel:19008059",
      stats: [
        { value: "10,000+", label: "Happy Patients" },
        { value: "15+", label: "Years Experience" },
        { value: "2", label: "Modern Clinics" },
      ],
    },
  };

  const contactData = {
    data: {
      title: "Contact Us - Saigon International Dental Clinic",
      slug: "contact",
      description:
        "Get in touch with Saigon International Dental Clinic. Visit our locations, call us, or send us a message.",
      content: JSON.stringify(contactContent),
      publishedAt: new Date().toISOString(),
    },
  };

  try {
    // Check if contact page already exists
    const pagesResponse = await axiosInstance.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=contact`,
    );

    if (pagesResponse.data.data.length === 0) {
      console.log("Contact page not found, creating new one...");
      const createResponse = await axiosInstance.post(
        `${STRAPI_URL}/api/pages`,
        contactData,
      );
      console.log(
        `✓ Created Contact page with ID: ${createResponse.data.data.id}`,
      );
    } else {
      const page = pagesResponse.data.data[0];
      const documentId = page.documentId;
      console.log(`Found Contact page with documentId: ${documentId}`);

      const updateResponse = await axiosInstance.put(
        `${STRAPI_URL}/api/pages/${documentId}`,
        contactData,
      );
      console.log(`✓ Updated Contact page successfully`);
    }

    console.log("\n✅ Contact page created/updated with images!\n");
  } catch (error) {
    console.error(
      "✗ Failed to create/update Contact page:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting Contact page creation...\n");

    // Step 1: Upload images
    const imageIds = await uploadImages();

    // Step 2: Create Contact page
    await createContactPage(imageIds);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
