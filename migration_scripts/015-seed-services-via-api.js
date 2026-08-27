const BASE = "https://guild-biblical-expectations-easily.trycloudflare.com";
const ADMIN_EMAIL = "vanhoa.bui2628@gmail.com";
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

const PAGE_DATA = {
  title: "Services Overview",
  description: "Dental services listing",
  layout: [
    {
      __component: "services-overview.hero",
      badge: "Premium Dental Services",
      title: "World-Class Dental Care\nin Ho Chi Minh City",
      description:
        "Evidence-based treatments by internationally trained specialists. From cosmetic refinements to full restorations — curated for you.",
      trust: [
        { icon: "Star", label: "4.9 / 5", sub: "500+ verified reviews" },
        {
          icon: "Users",
          label: "2,000+ Patients",
          sub: "Local & international",
        },
        { icon: "Clock", label: "15+ Years", sub: "Clinical experience" },
      ],
    },
    {
      __component: "services-overview.service-cards",
      services: [
        {
          slug: "dental-implants",
          title: "Dental Implants",
          category: "Implants",
          description:
            "Permanent tooth replacement with titanium implants — restoring function, aesthetics, and confidence for life.",
          image_url:
            "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=900",
        },
        {
          slug: "dental-braces",
          title: "Dental Braces",
          category: "Orthodontics",
          description:
            "Metal, ceramic, and clear aligners — precisely aligned smiles with the right system for your lifestyle.",
          image_url:
            "https://images.unsplash.com/photo-1588776814546-1ffbb083ac22?auto=format&fit=crop&q=80&w=900",
        },
        {
          slug: "dental-bleaching",
          title: "Teeth Whitening",
          category: "Cosmetic",
          description:
            "Clinically proven bleaching — in-office Zoom, at-home trays, or combination therapy for lasting brightness.",
          image_url:
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900",
        },
        {
          slug: "dental-veneers",
          title: "Dental Veneers",
          category: "Cosmetic",
          description:
            "Ultra-thin porcelain laminates bonded to natural teeth — flawless smile transformation in 24 hours.",
          image_url:
            "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=900",
        },
        {
          slug: "dental-veneers-cost",
          title: "Dental Crowns",
          category: "Cosmetic",
          description:
            "Zirconia, Emax, and Lava Plus crowns — clinical-grade protection with premium natural aesthetics.",
          image_url:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=900",
        },
        {
          slug: "general-check-up",
          title: "General Dentistry",
          category: "General",
          description:
            "Comprehensive exams, professional cleaning, fillings, and preventive care — your oral health foundation.",
          image_url:
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=900",
        },
      ],
    },
    {
      __component: "services-overview.features",
      features: [
        {
          icon: "Shield",
          title: "International Standards",
          description:
            "JCI-aligned protocols and ISO-certified materials from leading dental manufacturers worldwide.",
        },
        {
          icon: "ScanLine",
          title: "Advanced Diagnostics",
          description:
            "Digital X-ray, 3D CBCT scanning, and intraoral cameras for precise, evidence-based treatment planning.",
        },
        {
          icon: "Globe",
          title: "Global Patient Care",
          description:
            "English-speaking team with experience serving patients from 30+ countries across Asia and beyond.",
        },
      ],
    },
  ],
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function run() {
  console.log("STEP 1: Admin login...");
  const loginRes = await fetchJSON(`${BASE}/admin/login`, {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const jwt = loginRes.data.token;
  const authHeaders = { Authorization: `Bearer ${jwt}` };

  console.log(
    "\nSTEP 2: Granting public permissions for services-overview (update action)...",
  );
  const rolesRes = await fetchJSON(`${BASE}/users-permissions/roles`, {
    headers: authHeaders,
  });
  const publicRole = rolesRes.roles.find((r) => r.type === "public");
  const roleRes = await fetchJSON(
    `${BASE}/users-permissions/roles/${publicRole.id}`,
    { headers: authHeaders },
  );
  const perms = roleRes.role.permissions || {};

  if (!perms["api::services-overview"])
    perms["api::services-overview"] = { controllers: {} };
  if (!perms["api::services-overview"].controllers["services-overview"])
    perms["api::services-overview"].controllers["services-overview"] = {};

  // Enable update & publish
  perms["api::services-overview"].controllers["services-overview"]["update"] = {
    enabled: true,
    policy: "",
  };

  await fetchJSON(`${BASE}/users-permissions/roles/${publicRole.id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({ permissions: perms }),
  });

  console.log("\nSTEP 3: Seed via Standard Entity API...");
  // Now hit the Standard Strapi API (not Admin) - the Public role can update it!
  const putRes = await fetchJSON(`${BASE}/api/services-overview`, {
    method: "PUT",
    body: JSON.stringify({
      data: { ...PAGE_DATA, publishedAt: new Date().toISOString() },
    }),
  });

  console.log("DONE! Verifying schema layout count...");
  const verifyRes = await fetchJSON(
    `${BASE}/api/services-overview?populate[layout][populate]=*`,
  );
  console.log(
    `Verified layout blocks inserted: ${verifyRes.data?.layout?.length}`,
  );

  // Clean up: Disable public update
  perms["api::services-overview"].controllers["services-overview"]["update"] = {
    enabled: false,
    policy: "",
  };
  await fetchJSON(`${BASE}/users-permissions/roles/${publicRole.id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({ permissions: perms }),
  });
}

run().catch((err) => {
  console.error("FATAL", err.message);
  process.exit(1);
});
