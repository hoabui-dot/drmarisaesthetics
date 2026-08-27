#!/usr/bin/env node

/**
 * Migration Script 072: Create About Page via Strapi Admin API
 *
 * Uses Strapi's Admin REST API (not the public API) to:
 * 1. Login and get JWT token
 * 2. Grant Public role access to about-page
 * 3. Create/upsert the About Page content via Admin API
 *    (so Strapi correctly handles the DB schema)
 *
 * Content from about-us-requirement.md (Section 5: SOURCE DOCUMENT)
 */

const BASE = "https://guild-biblical-expectations-easily.trycloudflare.com";

const ADMIN_EMAIL = "vanhoa.bui2628@gmail.com";
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

// ── Content from about-us-requirement.md ─────────────────────────────────────
const ABOUT_PAGE_DATA = {
  hero: {
    badge: "About Us",
    title: "About Saigon International Dental Clinic: Dental Care in VN",
    subtitle: "Dental Care in Vietnam",
    description:
      "Welcome to Saigon International Dental Clinic, where top-tier dentistry meets absolute transparency. For over 15 years, we have been the trusted partner for international patients seeking high-quality, reliable dental care in Vietnam.",
  },
  excellence: {
    badge: "Recognized Excellence",
    title: "Recognized Excellence and Proven Track Record",
    description:
      "Numbers speak louder than words. Our extensive clinical experience ensures that your smile is in the hands of seasoned experts.",
    stats: [
      {
        value: "25,000+",
        label: "Satisfied Customers Worldwide",
        icon: "Users",
      },
      { value: "10,000+", label: "Successful Dental Implants", icon: "Award" },
      {
        value: "5,000+",
        label: "Cosmetic Porcelain Veneers and Crowns",
        icon: "Star",
      },
    ],
  },
  why_choose_us: {
    badge: "Why Choose Us",
    title: "Why International Patients Choose Us",
    description:
      "We prioritize your peace of mind by offering strict medical standards, transparent processes, and zero hidden fees.",
    features: [
      {
        icon: "FileText",
        title: "100% Transparent Pricing and Treatment",
        description:
          "Complete clarity on costs, doctors' profiles, and material origins. We strictly guarantee no hidden fees throughout your journey.",
      },
      {
        icon: "UserCheck",
        title: "Top-Tier Dental Specialists",
        description:
          "Our dedicated team consists of experts with over 10 years of intensive clinical experience. You have the full right to change your attending doctor if you feel uncomfortable.",
      },
      {
        icon: "Scan",
        title: "Advanced European Technology",
        description:
          "Access to state-of-the-art equipment. We offer complimentary consultations, including clinical examinations, CT Cone beam scans, and customized treatment plans—even if you decide not to proceed.",
      },
      {
        icon: "Shield",
        title: "Legally Binding Guarantees",
        description:
          "We provide comprehensive medical records, legally binding contracts, and warranty policies for your absolute protection.",
      },
    ],
  },
  philosophy: {
    badge: "Our Philosophy",
    title: "Our Treatment Philosophy: Preserving Your Natural Smile",
    quote:
      "We believe in minimally invasive dentistry, preserving your natural tooth structure while achieving maximum aesthetic and functional results.",
    tabs: [
      {
        key: "prevention",
        label: "Prevention",
        icon: "Sprout",
        title: "Maximum Tooth Preservation",
        description:
          "We utilize advanced techniques to minimize tooth reduction to just 0.5 - 1.5mm, ensuring your natural teeth remain strong and healthy.",
        highlight: "0.5 - 1.5mm tooth reduction",
      },
      {
        key: "quality",
        label: "Quality",
        icon: "Award",
        title: "Genuine and Safe Materials",
        description:
          "Say no to bad breath and irritation. We exclusively use premium, imported German porcelain that is 5 times stronger than natural teeth, offering 20+ natural shades.",
        highlight: "5x stronger than natural teeth",
      },
      {
        key: "verification",
        label: "Verification",
        icon: "Star",
        title: "Real-Time Verification",
        description:
          "For porcelain treatments, you are involved in the process. We allow patients to view the actual porcelain block and record the milling process for absolute peace of mind.",
        highlight: "100% patient-verified process",
      },
    ],
  },
  core_values: {
    badge: "Core Values",
    title: "Our Core Values",
    description:
      "The foundational principles that guide every interaction at Saigon International Dental Clinic.",
    values: [
      {
        icon: "Lightbulb",
        title: "Innovation",
        description:
          "Continuously updating our European-imported, Ministry of Health-approved equipment.",
      },
      {
        icon: "Shield",
        title: "Integrity",
        description:
          "Honest diagnoses and treatment plans. We never recommend unnecessary procedures.",
      },
      {
        icon: "Heart",
        title: "Care",
        description:
          "A dedicated, English-speaking environment designed to make your dental visits stress-free.",
      },
    ],
  },
  commitment: {
    badge: "Our Commitment",
    title: "Our Firm Guarantees to You",
    description:
      "Your safety, satisfaction, and financial security are our top priorities.",
    commitments: [
      {
        icon: "TrendingUp",
        title: "Guaranteed Results",
        subtitle: "Visual Preview Included",
        description:
          "Comprehensive warranty policies and visual previews of your final smile before treatment begins.",
      },
      {
        icon: "UserCheck",
        title: "Elite Expertise",
        subtitle: "Qualified Specialists Only",
        description:
          "Treatment is strictly performed by highly qualified specialists, never by unverified practitioners.",
      },
      {
        icon: "FileText",
        title: "Zero Financial Surprises",
        subtitle: "Price Locked at Consultation",
        description:
          "The price you are quoted during your free consultation is the final price you pay.",
      },
    ],
  },
  cta: {
    badge: "Book Now",
    title: "Ready to Transform Your Smile?",
    description:
      "Achieve a flawless, bright smile in just 48 hours. Send us a message today to schedule your completely FREE comprehensive consultation, X-rays, and treatment planning.",
    primary_button_text: "Book Your Free Consultation",
    primary_button_link: "/contact",
    secondary_button_text: "Learn More About Our Doctors",
    secondary_button_link: "/about-us#team",
  },
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} at ${url}: ${text.substring(0, 500)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function run() {
  console.log("=".repeat(70));
  console.log("MIGRATION 072: Create About Page via Strapi Admin API");
  console.log("=".repeat(70));

  // ── STEP 1: Admin Login ───────────────────────────────────────────────────
  console.log("\nSTEP 1: Admin login...");
  const loginRes = await fetchJSON(`${BASE}/admin/login`, {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const jwt = loginRes.data?.token;
  if (!jwt)
    throw new Error("No JWT token in response: " + JSON.stringify(loginRes));
  console.log("  [OK] JWT obtained\n");
  const authHeaders = { Authorization: `Bearer ${jwt}` };

  // ── STEP 2: Grant Public permissions for about-page ───────────────────────
  console.log("STEP 2: Granting public permissions for about-page...");
  // Get all roles
  const rolesRes = await fetchJSON(`${BASE}/users-permissions/roles`, {
    headers: authHeaders,
  });
  const publicRole = rolesRes.roles?.find((r) => r.type === "public");
  if (!publicRole) throw new Error("Public role not found");

  // Get full role with permissions
  const roleRes = await fetchJSON(
    `${BASE}/users-permissions/roles/${publicRole.id}`,
    { headers: authHeaders },
  );
  const perms = roleRes.role?.permissions || {};

  // Enable find for about-page
  if (!perms["api::about-page"]) perms["api::about-page"] = { controllers: {} };
  if (!perms["api::about-page"].controllers)
    perms["api::about-page"].controllers = {};
  if (!perms["api::about-page"].controllers["about-page"])
    perms["api::about-page"].controllers["about-page"] = {};
  perms["api::about-page"].controllers["about-page"]["find"] = {
    enabled: true,
    policy: "",
  };

  await fetchJSON(`${BASE}/users-permissions/roles/${publicRole.id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({ permissions: perms }),
  });
  console.log("  [OK] Public role updated - about-page.find = true\n");

  // ── STEP 3: Create/update About Page via Content Manager (single-types) ───
  console.log("STEP 3: Upserting About Page content via Admin API...");

  const payload = {
    data: ABOUT_PAGE_DATA,
  };

  // Strapi Admin API for single types uses PUT
  const cmRes = await fetchJSON(
    `${BASE}/content-manager/single-types/api::about-page.about-page`,
    {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(payload),
    },
  );

  if (cmRes.error) {
    throw new Error("Admin API error: " + JSON.stringify(cmRes.error));
  }
  console.log("  [OK] About Page content created/updated\n");
  console.log("  Response fields:", Object.keys(cmRes.data || cmRes));

  // ── STEP 4: Publish ───────────────────────────────────────────────────────
  console.log("STEP 4: Publishing About Page...");
  const publishRes = await fetchJSON(
    `${BASE}/content-manager/single-types/api::about-page.about-page/actions/publish`,
    { method: "POST", headers: authHeaders, body: JSON.stringify({}) },
  );
  if (publishRes.error)
    throw new Error("Publish error: " + JSON.stringify(publishRes.error));
  console.log("  [OK] Published\n");

  // ── STEP 5: Verify public API ─────────────────────────────────────────────
  console.log("STEP 5: Verifying public API...");
  await new Promise((r) => setTimeout(r, 1000));
  const verifyRes = await fetchJSON(
    `${BASE}/api/about-page?populate[hero]=*&populate[excellence][populate][stats]=*&populate[why_choose_us][populate][features]=*&populate[philosophy][populate][tabs]=*&populate[core_values][populate][values]=*&populate[commitment][populate][commitments]=*&populate[cta]=*&status=published`,
  );
  const d = verifyRes.data;
  if (!d)
    throw new Error(
      "No data in public API response: " + JSON.stringify(verifyRes),
    );

  console.log("  ✓ hero.title:", d.hero?.title || "MISSING");
  console.log("  ✓ excellence.title:", d.excellence?.title || "MISSING");
  console.log(
    "  ✓ excellence.stats:",
    (d.excellence?.stats || []).length,
    "items",
  );
  console.log(
    "  ✓ why_choose_us.features:",
    (d.why_choose_us?.features || []).length,
    "items",
  );
  console.log(
    "  ✓ philosophy.tabs:",
    (d.philosophy?.tabs || []).length,
    "items",
  );
  console.log(
    "  ✓ core_values.values:",
    (d.core_values?.values || []).length,
    "items",
  );
  console.log(
    "  ✓ commitment.commitments:",
    (d.commitment?.commitments || []).length,
    "items",
  );
  console.log("  ✓ cta.title:", d.cta?.title || "MISSING");

  console.log("\n" + "=".repeat(70));
  console.log("MIGRATION 072 COMPLETED SUCCESSFULLY");
  console.log("=".repeat(70));
  console.log("\nAll 7 sections seeded and published via Strapi Admin API.");
  console.log("Verify frontend at: http://localhost:3000/about-us\n");
}

run().catch((err) => {
  console.error("\n[FATAL]", err.message);
  process.exit(1);
});
