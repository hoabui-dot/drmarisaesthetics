const strapi = require("@strapi/strapi");

async function main() {
  const app = await strapi.createStrapi({ distDir: "./dist" }).load();
  
  try {
    console.log("Cleaning up existing contact pages...");
    const existing = await app.documents("api::contact-page.contact-page").findMany();
    // For single types findFirst or findMany can be used
    if (existing && existing.length) {
       for (const doc of existing) {
           await app.documents("api::contact-page.contact-page").delete({
               documentId: doc.documentId
           });
       }
    }
    await app.documents("api::contact-page.contact-page").delete({
        documentId: "contact-page"
    }).catch(e => console.log('not found directly'));

    console.log("Creating new contact page via Strapi Service...");
    const result = await app.documents("api::contact-page.contact-page").create({
      data: {
        hero: {
          icon: "Sparkles",
          title: "Contact Us",
          subtitle: "We are here to help you achieve a healthy and confident smile."
        },
        quick_contact_cards: [
          {
            icon: "Phone",
            title: "Hotline",
            content: "1900 8059",
            subtitle: "hotline 24/7"
          },
          {
            icon: "Mail",
            title: "Email",
            content: "contact@nhakhoaquoctesaigon.vn",
            subtitle: "We'll reply within 24h"
          },
          {
            icon: "Clock",
            title: "Working Hours",
            content: "Mon-Fri: 08:00 - 18:00",
            subtitle: "Sat-Sun: 08:00 - 12:00"
          },
          {
            icon: "MessageCircle",
            title: "Live Chat",
            content: "Chat with us",
            subtitle: "Online Support"
          }
        ],
        contact_form: {
          title: "Send us a message",
          description: "Fill out the form below and we'll get back to you as soon as possible.",
          badge_title: "24/7 Support",
          badge_subtitle: "Expert dental advice whenever you need it",
          formFields: [
            {
              name: "fullName",
              label: "Full Name",
              type: "text",
              required: true,
              placeholder: "John Doe"
            },
            {
              name: "phone",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: "+84 123 456 789"
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
              placeholder: "john@example.com"
            },
            {
              name: "service",
              label: "Service",
              type: "select",
              required: true,
              placeholder: "Select a service",
              options: [
                { value: "general", label: "General Checkup" },
                { value: "implants", label: "Dental Implants" },
                { value: "orthodontics", label: "Orthodontics" },
                { value: "cosmetic", label: "Cosmetic Dentistry" },
                { value: "emergency", label: "Emergency Care" }
              ]
            },
            {
              name: "message",
              label: "Message",
              type: "textarea",
              required: false,
              placeholder: "Tell us more about your needs...",
              rows: 4
            }
          ]
        },
        cta: {
          title: "ĐỒNG HÀNH CÙNG NỤ CƯỜI TỎA SÁNG CỦA BẠN",
          description: "Nha khoa Quốc tế Sài Gòn mang đến giải pháp chăm sóc răng miệng toàn diện với công nghệ hiện đại và đội ngũ chuyên gia tận tâm.",
          primary_button_text: "Book Appointment",
          primary_button_link: "/booking",
          secondary_button_text: "Call Us: 1900 8059",
          secondary_button_link: "tel:19008059",
          stats: [
            { value: "15,000+", label: "Happy Patients" },
            { value: "10+", label: "Years Experience" },
            { value: "99%", label: "Satisfaction Rate" }
          ]
        }
      },
      status: 'published' // Ensure it's published in v5
    });

    console.log("Success! Result:", JSON.stringify(result, null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

main();
