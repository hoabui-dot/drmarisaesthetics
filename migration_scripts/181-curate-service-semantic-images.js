#!/usr/bin/env node

/*
 * Curate a new visual set for every service-detail page.
 *
 * This intentionally uploads new files instead of reusing doctor-updated.png
 * or any other existing service asset. The service records keep the same
 * editorial content; only the visual media and semantic layout metadata are
 * updated.
 */
const BASE = process.env.STRAPI_URL || "http://127.0.0.1:22345";
const TOKEN = process.env.STRAPI_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

const assets = [
  ["blepharoplasty-hero", "service-blepharoplasty-hero.jpg", "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=84", "Clinical facial assessment in a calm medical setting"],
  ["breast-augmentation-hero", "service-breast-augmentation-hero.jpg", "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=84", "Surgeon preparing a patient for an individualised procedure"],
  ["buttock-augmentation-hero", "service-buttock-augmentation-hero.jpg", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1800&q=84", "Surgical planning discussion between a clinician and patient"],
  ["facelift-hero", "service-facelift-hero.jpg", "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=84", "Surgeon reviewing anatomy before facial rejuvenation surgery"],
  ["gastric-sleeve-hero", "service-gastric-sleeve-hero.jpg", "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1800&q=84", "Hospital team preparing a safe surgical pathway"],
  ["labiaplasty-hero", "service-labiaplasty-hero.jpg", "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1800&q=84", "Private clinical consultation focused on patient comfort"],
  ["liposuction-hero", "service-liposuction-hero.jpg", "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1800&q=84", "Clinical body contouring consultation and planning"],
  ["assessment", "service-visual-assessment.jpg", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=84", "Surgeon and patient reviewing an individual assessment"],
  ["planning", "service-visual-planning.jpg", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=84", "Medical team reviewing a treatment plan"],
  ["hospital", "service-visual-hospital.jpg", "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=1800&q=84", "Modern hospital corridor supporting safe surgical care"],
  ["recovery", "service-visual-recovery.jpg", "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1800&q=84", "Quiet clinical recovery environment for supervised aftercare"],
  ["approach", "service-visual-surgeon-approach.jpg", "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=82", "Surgeon-led conversation about anatomy, goals and realistic options"],
  ["suitability", "service-visual-suitability.jpg", "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1800&q=82", "Private consultation focused on suitability and patient wellbeing"],
  ["safety", "service-visual-safety.jpg", "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1800&q=82", "Hospital team and clinical safeguards supporting a procedure"],
  ["expectations", "service-visual-expectations.jpg", "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=82", "Clinician explaining outcomes and recovery expectations"],
  ["international", "service-visual-international-patients.jpg", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=82", "Remote consultation and planning for an international patient"],
  ["specialty", "service-visual-specialty.jpg", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=82", "Clinician explaining procedure-specific considerations"],
  ["bleph-eye-planning", "blepharoplasty-eye-specific-planning.jpg", "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1800&q=82", "Detailed facial assessment for eye-specific surgical planning"],
  ["bleph-upper", "blepharoplasty-upper-eyelid.jpg", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=82", "Surgeon discussing upper eyelid anatomy and options"],
  ["bleph-lower", "blepharoplasty-lower-eyelid.jpg", "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=82", "Clinical consultation focused on lower eyelid and under-eye anatomy"],
  ["bleph-brow", "blepharoplasty-brow-versus-eyelid.jpg", "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=82", "Facial assessment comparing brow position with eyelid concerns"],
];

const serviceHero = {
  "blepharoplasty": "blepharoplasty-hero",
  "breast-augmentation": "breast-augmentation-hero",
  "buttock-augmentation": "buttock-augmentation-hero",
  "facelift": "facelift-hero",
  "gastric-sleeve": "gastric-sleeve-hero",
  "labiaplasty": "labiaplasty-hero",
  "liposuction": "liposuction-hero",
};

function layoutFor(section, slug) {
  const key = String(section.section_key || "").toLowerCase();
  if (slug === "blepharoplasty" && section.__component === "service-detail.specialty-section") return "cover";
  if (key === "hospital" || key.includes("safety")) return "cover";
  if (key === "recovery" || key.includes("stages") || key.includes("journey")) return "timeline";
  if (key === "planning" || key === "international" || key.includes("assessment")) return "left";
  return "right";
}

function visualKeyFor(section, slug) {
  const key = String(section.section_key || "").toLowerCase();
  if (slug === "blepharoplasty") {
    const bleph = { specialty: "bleph-eye-planning", "specialty-upper-blepharoplasty": "bleph-upper", "specialty-lower-blepharoplasty": "bleph-lower", "specialty-brow-vs-eyelid": "bleph-brow" };
    if (bleph[key]) return bleph[key];
  }
  if (key === "hospital") return "hospital";
  if (key.includes("safety") || key === "risks") return "safety";
  if (key === "recovery" || key.includes("stages") || key.includes("journey")) return "recovery";
  if (key === "planning" || key.includes("assessment")) return "planning";
  if (key === "international") return "international";
  if (key === "suitability") return "suitability";
  if (key === "approach") return "approach";
  if (key === "expectations") return "expectations";
  if (key.startsWith("specialty")) return "specialty";
  return "assessment";
}

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(data)}`);
  return data;
}

async function upload(asset, existing) {
  const found = existing.find((file) => file.name === asset[1]);
  if (found) return found.id;
  const response = await fetch(asset[2]);
  if (!response.ok) throw new Error(`Unable to download ${asset[2]} (${response.status})`);
  const form = new FormData();
  form.append("files", await response.blob(), asset[1]);
  form.append("fileInfo", JSON.stringify({ name: asset[1], alternativeText: asset[3], caption: asset[3] }));
  const result = await api("/api/upload", { method: "POST", body: form });
  return result[0]?.id;
}

function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (["id", "documentId", "createdAt", "updatedAt", "publishedAt", "createdBy", "updatedBy"].includes(key)) continue;
    if (key === "image" && item && typeof item === "object") continue;
    result[key] = clean(item);
  }
  return result;
}

async function run() {
  if (!TOKEN && !DRY_RUN) throw new Error("STRAPI_API_TOKEN is required");
  const existing = DRY_RUN ? [] : await api("/api/upload/files?pagination[pageSize]=1000");
  const media = {};
  for (const asset of assets) {
    media[asset[0]] = DRY_RUN ? null : await upload(asset, existing);
    console.log(`[MEDIA] ${asset[0]} -> ${media[asset[0]] || "dry-run"}`);
  }

  const list = await api("/api/service-details?pagination[pageSize]=100&fields[0]=slug&fields[1]=title");
  for (const record of list.data || []) {
    const slug = record.slug;
    const detail = await api(`/api/service-details/${record.documentId}?populate[hero_image]=true&populate[sections][on][service-detail.editorial-section][populate][image]=true&populate[sections][on][service-detail.editorial-section][populate][items][populate]=*&populate[sections][on][service-detail.specialty-section][populate][image]=true&populate[sections][on][service-detail.specialty-section][populate][items][populate]=*`);
    const heroKey = serviceHero[slug] || "assessment";
    const heroAsset = assets.find((asset) => asset[0] === heroKey);
    const sections = (detail.data?.sections || []).map((section) => {
      if (!["service-detail.editorial-section", "service-detail.specialty-section"].includes(section.__component)) return clean(section);
      const visualKey = visualKeyFor(section, slug);
      const asset = assets.find((candidate) => candidate[0] === visualKey) || assets.find((candidate) => candidate[0] === "assessment");
      return { ...clean(section), image: media[visualKey], image_alt: asset[3], image_layout: layoutFor(section, slug) };
    });
    console.log(`[PLAN] ${slug}: hero=${heroKey}, sections=${sections.length}`);
    if (DRY_RUN) continue;
    await api(`/api/service-details/${record.documentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { hero_image: media[heroKey] || media.assessment, sections }, status: "published" }),
    });
    console.log(`[SYNC] ${slug} published with semantic media layouts`);
  }
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); process.exitCode = 1; });
