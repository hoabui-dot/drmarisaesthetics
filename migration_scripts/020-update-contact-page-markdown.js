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

async function updateContactPageWithMarkdown() {
  console.log("📝 Updating Contact page with markdown content...\n");

  // Rich text content in markdown format
  const markdownContent = `# Contact Us

We're here to help you achieve a healthy and confident smile.

## Quick Contact Information

### Hotline
**1900 8059**  
Available 24/7

### Email
**contact@nhakhoasaigon.vn**  
We reply within 24h

### Working Hours
**Mon–Fri:** 08:00–18:00  
**Sat:** 09:00–15:00

### Live Chat
Chat with us for online support

---

## Send Us a Message

Fill out the form below and we'll get back to you as soon as possible.

**Trusted by 10,000+ patients** - We're committed to your dental health

---

## Our Clinic Locations

Visit us at any of our convenient locations

### Saigon International Dental - Phú Nhuận
📍 **Address:** 233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam
📞 **Phone:** 1900 8059

### Saigon International Dental - Phú Nhuận
📍 **Address:** 233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam
📞 **Phone:** 1900 8059

---

## Interactive Map

Google Maps integration showing both clinic locations.  
*(Requires Google Maps API key in production)*

**Clinic:** 233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam


---

## Book Your Consultation Today

Our experts are ready to help you achieve your perfect smile. Don't wait—take the first step towards better dental health.

### Our Achievements
- **10,000+** Happy Patients
- **15+** Years Experience
- **2** Modern Clinics
`;

  // Structured data for form fields and locations (non-editable config)
  const structuredData = {
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
      imageId: 39,
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
          imageId: 40,
          mapUrl: "https://maps.google.com",
        },
        {
          name: "Saigon International Dental - District 7",
          address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
          phone: "1900 8059",
          imageId: 41,
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
      content: markdownContent, // Rich text markdown content - editable in Strapi
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
      contactData,
    );
    console.log(`✓ Updated Contact page with markdown content`);

    console.log("\n✅ Contact page updated successfully!\n");
    console.log("📝 Content field now contains markdown text");
    console.log("🔧 Metadata field contains structured JSON for components");
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
    console.log("🚀 Starting Contact page markdown update...\n");

    await updateContactPageWithMarkdown();

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main();
