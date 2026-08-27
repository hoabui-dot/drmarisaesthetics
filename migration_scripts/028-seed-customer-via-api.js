const axios = require("axios");
const https = require("https");

const STRAPI_URL = "https://corp-circle-register-restricted.trycloudflare.com";
const API_TOKEN =
  process.env.STRAPI_API_TOKEN;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

const customerPageData = {
  hero: {
    __component: "customer.hero",
    badge: "Our Customers",
    title: "Trusted by Thousands of Happy Patients",
    subtitle: "Your smile is our success story",
    description:
      "For over 15 years, we have been honored to serve patients from around the world. Our commitment to excellence has earned us the trust of thousands of families who rely on us for their dental care needs.",
    images: [
      {
        type: "strapi",
        path: "/uploads/happy_customers_hero.jpg",
        alt: "Happy dental patients",
      },
      {
        type: "strapi",
        path: "/uploads/patient_smile.jpg",
        alt: "Patient with beautiful smile",
      },
      {
        type: "strapi",
        path: "/uploads/family_dental.jpg",
        alt: "Family dental care",
      },
      {
        type: "strapi",
        path: "/uploads/patient_consultation.jpg",
        alt: "Patient consultation",
      },
    ],
  },
  successStories: {
    __component: "customer.success-stories",
    badge: "Success Stories",
    title: "Real Stories from Real Patients",
    description:
      "Hear from our patients about their transformative dental experiences and the confidence they've gained through our care.",
    stories: [
      {
        name: "Sarah Thompson",
        location: "Australia",
        treatment: "Full Smile Makeover",
        quote:
          "I traveled from Sydney specifically for my treatment here. The results exceeded my expectations - my new smile has completely changed my confidence level.",
        rating: 5,
        before_after: true,
        icon: "Star",
      },
      {
        name: "Michael Chen",
        location: "Singapore",
        treatment: "Dental Implants",
        quote:
          "After losing two teeth in an accident, I was devastated. The team here not only restored my smile but made the entire process comfortable and stress-free.",
        rating: 5,
        before_after: true,
        icon: "Heart",
      },
      {
        name: "Emma Williams",
        location: "United Kingdom",
        treatment: "Invisalign Treatment",
        quote:
          "As an adult, I was hesitant about orthodontic treatment. The Invisalign solution was perfect - discreet and effective. I couldn't be happier!",
        rating: 5,
        before_after: true,
        icon: "Smile",
      },
      {
        name: "David Park",
        location: "South Korea",
        treatment: "Teeth Whitening",
        quote:
          "Professional, efficient, and the results speak for themselves. My teeth are now several shades whiter and I feel years younger.",
        rating: 5,
        before_after: false,
        icon: "Sparkles",
      },
    ],
  },
  customerBenefits: {
    __component: "customer.benefits",
    badge: "Why Patients Choose Us",
    title: "The Benefits Our Customers Enjoy",
    description:
      "We go above and beyond to ensure every patient receives exceptional care and value.",
    benefits: [
      {
        icon: "Award",
        title: "International Quality Standards",
        description:
          "Our clinic meets and exceeds international dental care standards, ensuring you receive world-class treatment.",
      },
      {
        icon: "Clock",
        title: "Flexible Scheduling",
        description:
          "We offer convenient appointment times including weekends and evenings to fit your busy lifestyle.",
      },
      {
        icon: "Globe",
        title: "Multilingual Staff",
        description:
          "Our team speaks multiple languages including English, Vietnamese, Korean, and Japanese for your comfort.",
      },
      {
        icon: "Shield",
        title: "Comprehensive Warranty",
        description:
          "All major treatments come with extended warranties, giving you peace of mind for years to come.",
      },
      {
        icon: "Plane",
        title: "Dental Tourism Support",
        description:
          "We assist international patients with accommodation recommendations, airport transfers, and treatment planning.",
      },
      {
        icon: "CreditCard",
        title: "Flexible Payment Options",
        description:
          "Choose from various payment plans and financing options to make your treatment affordable.",
      },
    ],
  },
  statistics: {
    __component: "customer.statistics",
    badge: "By The Numbers",
    title: "Our Track Record Speaks for Itself",
    stats: [
      { number: "15,000+", label: "Happy Patients", suffix: "", icon: "Users" },
      {
        number: "98%",
        label: "Satisfaction Rate",
        suffix: "",
        icon: "ThumbsUp",
      },
      { number: "50+", label: "Countries Served", suffix: "", icon: "Globe" },
      {
        number: "25,000+",
        label: "Successful Treatments",
        suffix: "",
        icon: "CheckCircle",
      },
    ],
  },
  faq: {
    __component: "customer.faq",
    badge: "Customer FAQ",
    title: "Frequently Asked Questions",
    description: "Find answers to common questions from our patients",
    questions: [
      {
        question: "How do I book my first appointment?",
        answer:
          "You can book your appointment through our website, by calling our hotline at 1900 8089, or by sending us an email. Our team will respond within 24 hours to confirm your booking.",
      },
      {
        question: "Do you offer services in English?",
        answer:
          "Yes! Our entire team is fluent in English, and we have staff members who speak Korean, Japanese, and Mandarin as well. We ensure clear communication throughout your treatment.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cash (VND and USD), credit/debit cards (Visa, Mastercard, JCB), bank transfers, and various financing options. International patients can also use their travel insurance.",
      },
      {
        question: "Is there parking available at the clinic?",
        answer:
          "Yes, we provide free parking for all patients at both of our clinic locations. Motorcycle and car parking are available.",
      },
      {
        question: "How long does a typical treatment take?",
        answer:
          "Treatment duration varies depending on the procedure. Simple checkups take 30-45 minutes, while complex treatments like implants may require multiple visits over several months. We provide detailed timelines during your consultation.",
      },
      {
        question: "Do you offer aftercare support?",
        answer:
          "Absolutely! We provide comprehensive aftercare instructions, follow-up appointments, and 24/7 emergency support for our patients. Your long-term oral health is our priority.",
      },
    ],
  },
  cta: {
    __component: "customer.cta",
    badge: "Join Our Family",
    title: "Ready to Experience the Difference?",
    description:
      "Join thousands of satisfied patients and discover why we're the trusted choice for dental care in Vietnam.",
    primary_button_text: "Book Your Consultation",
    primary_button_link: "/contact",
    secondary_button_text: "View Our Services",
    secondary_button_link: "/services",
    contact_info: [
      { text: "Hotline: 1900 8089" },
      { text: "info@saigondental.com" },
    ],
  },
};

async function seedCustomerType() {
  console.log("Seeding Customer Single Type Data...");

  const payload = {
    data: {
      title: "Our Customers - Saigon International Dental Clinic",
      description:
        "Discover why thousands of patients trust Saigon International Dental Clinic for their dental care needs.",
      layout: [
        customerPageData.hero,
        customerPageData.successStories,
        customerPageData.customerBenefits,
        customerPageData.statistics,
        customerPageData.faq,
        customerPageData.cta,
      ],
    },
  };

  try {
    const res = await axiosInstance.put(`${STRAPI_URL}/api/customer`, payload);
    console.log(
      "Success! Customer single type data has been seeded successfully.",
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error(
        `Failed to seed data: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      );
    } else {
      console.error(`Request failed: ${error.message}`);
    }
  }
}

seedCustomerType();
