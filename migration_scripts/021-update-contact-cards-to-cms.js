const axios = require("axios");
const https = require("https");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN = process.env.STRAPI_API_TOKEN || "your-api-token-here";

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function updateContactPageWithCards() {
  console.log("📝 Updating Contact page with contact cards in CMS...\n");

  // Contact cards data
  const contactCards = [
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
  ];

  // Clinic locations data
  const locations = [
    {
      name: "Saigon International Dental - District 1",
      address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
      phone: "1900 8059",
      imageUrl:
        "https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZW50YWwlMjBjbGluaWMlMjByZWNlcHRpb258ZW58MXx8fHwxNzc0MzQyNjk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      mapUrl: "https://maps.google.com",
    },
    {
      name: "Saigon International Dental - District 7",
      address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
      phone: "1900 8059",
      imageUrl:
        "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjBpbnRlcmlvciUyMGJyaWdodHxlbnwxfHx8fDE3NzQzNDI2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      mapUrl: "https://maps.google.com",
    },
  ];

  // Form configuration
  const formConfig = {
    title: "Send us a message",
    description:
      "Fill out the form below and we'll get back to you as soon as possible.",
    imageUrl:
      "https://images.unsplash.com/photo-1770321119162-05c18fbcfdb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZW50aXN0JTIwcGF0aWVudCUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NzQzNDI2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
  };

  // Map section configuration
  const mapConfig = {
    enabled: true,
    title: "Interactive Map",
    description:
      "Google Maps integration would be displayed here showing both clinic locations.",
    note: "(Requires Google Maps API key in production)",
    markers: [
      { name: "District 1", address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam" },
      { name: "District 7", address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam" },
    ],
  };

  // CTA section configuration
  const ctaConfig = {
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
  };

  // Complete contact page data structure
  const contactPageData = {
    hero: {
      icon: "Sparkles",
      title: "Contact Us",
      subtitle: "We're here to help you achieve a healthy and confident smile.",
    },
    contactCards: contactCards,
    form: formConfig,
    locations: locations,
    map: mapConfig,
    cta: ctaConfig,
  };

  const pageData = {
    data: {
      title: "Contact Us - Saigon International Dental Clinic",
      slug: "contact",
      description:
        "Get in touch with Saigon International Dental Clinic. Visit our locations, call us, or send us a message.",
      content: JSON.stringify(contactPageData),
      publishedAt: new Date().toISOString(),
    },
  };

  try {
    // Find the contact page
    const pagesResponse = await axiosInstance.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=contact`,
    );

    if (pagesResponse.data.data.length === 0) {
      console.log("❌ Contact page not found");
      return;
    }

    const page = pagesResponse.data.data[0];
    const documentId = page.documentId;
    console.log(`Found Contact page with documentId: ${documentId}`);

    const updateResponse = await axiosInstance.put(
      `${STRAPI_URL}/api/pages/${documentId}`,
      pageData,
    );
    console.log(`✓ Updated Contact page with structured data`);

    console.log("\n✅ Contact page updated successfully!\n");
    console.log("📋 Data structure:");
    console.log("  - Hero section (icon, title, subtitle)");
    console.log("  - Contact cards (4 cards with icons)");
    console.log("  - Form configuration (fields, validation, image)");
    console.log("  - Clinic locations (2 locations with images)");
    console.log("  - Map configuration (markers, description)");
    console.log("  - CTA section (buttons, stats)");
    console.log("\n💡 All data is now editable in Strapi CMS!");
  } catch (error) {
    console.error(
      "✗ Failed to update Contact page:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting Contact page CMS update...\n");

    await updateContactPageWithCards();

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
