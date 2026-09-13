#!/usr/bin/env node

/*
 * Rebuild the CMS service sections from the last complete frontend service
 * registry. The DOCX source fields are deliberately preserved as the audit
 * copy; this script only replaces the presentation fields used by the UI.
 */
const fs = require("fs");
const path = require("path");
const { Module } = require("module");
const ts = require(path.resolve(__dirname, "../dental-frontend/node_modules/typescript"));

const BASE = process.env.STRAPI_URL || "http://127.0.0.1:22345";
const TOKEN = process.env.STRAPI_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const registryFile = path.resolve(__dirname, "../dental-frontend/src/data/service-details.ts");

function loadRegistry() {
  const source = fs.readFileSync(registryFile, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = new Module(registryFile, module);
  mod.filename = registryFile;
  mod.paths = Module._nodeModulePaths(path.dirname(registryFile));
  mod._compile(output, registryFile);
  return mod.exports.SERVICE_DETAILS;
}

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(data)}`);
  return data;
}

function item(title, description = "") {
  return { title, description };
}

function pointItems(points = []) {
  return points.map((point) => item(point));
}

function editorial(section, key, eyebrow, imageId) {
  const items = section.highlights || section.steps || section.timeline || section.items || section.points;
  return {
    __component: "service-detail.editorial-section",
    section_key: key,
    anchor_label: section.title,
    eyebrow,
    title: section.title,
    body: section.body,
    image: imageId,
    items: Array.isArray(items)
      ? items.map((value) => typeof value === "string" ? item(value) : item(value.title, value.description))
      : [],
  };
}

function specialty(section, key, imageId) {
  const points = section.points || section.cards || [];
  return {
    __component: "service-detail.specialty-section",
    section_key: key,
    anchor_label: section.title,
    eyebrow: "SERVICE-SPECIFIC CONSIDERATIONS",
    title: section.title,
    body: section.body,
    image: imageId,
    items: points.map((point) => typeof point === "string" ? item(point) : item(point.title, point.description)),
  };
}

function buildSections(service, imageId) {
  const sections = [
    editorial(service.overview, "overview", "UNDERSTANDING THE PROCEDURE", imageId),
    editorial(service.suitability, "suitability", "WHO IT MAY BE FOR", imageId),
    editorial(service.approach, "approach", "SURGEON-LED CARE", imageId),
    editorial(service.planning, "planning", "CLINICAL PLANNING", imageId),
    editorial(service.hospital, "hospital", "HOSPITAL-BASED SURGERY", imageId),
    editorial(service.recovery, "recovery", "RECOVERY & AFTERCARE", imageId),
    editorial(service.risks, "risks", "SAFETY & CONSIDERATIONS", imageId),
    editorial(service.expectations, "expectations", "REALISTIC EXPECTATIONS", imageId),
    editorial(service.international, "international", "INTERNATIONAL PATIENTS", imageId),
    specialty(service.specialty, "specialty", imageId),
    ...(service.specialtySections || []).map((section) => specialty(section, `specialty-${section.id}`, imageId)),
    {
      __component: "service-detail.pricing-table",
      section_key: "pricing",
      anchor_label: "Pricing",
      eyebrow: "INTERNATIONAL PRICE REFERENCE",
      title: service.pricing.title,
      intro: service.pricing.intro,
      items: service.pricing.items.map((price) => ({ ...price })),
      note: service.pricing.note,
      assessment_only: Boolean(service.pricing.assessmentOnly),
    },
    {
      __component: "service-detail.faq",
      anchor_label: "Frequently Asked Questions",
      title: service.faq.title,
      items: service.faq.items.map((faq) => ({ question: faq.question, answer: faq.answer })),
    },
    {
      __component: "service-detail.consultation",
      anchor_label: "Consultation",
      step_number: "01",
      title: "Begin with an individual assessment",
      subtitle: "Discuss your anatomy, goals and realistic options with Dr. Maris.",
      address: "City International Hospital, Ho Chi Minh City, Vietnam",
      hotline: "+84 28 1234 5678",
      email: "concierge@drmarisaesthetics.com",
      working_hours: "By appointment",
      map_embed_url: "https://maps.google.com/maps?q=City%20International%20Hospital%20Ho%20Chi%20Minh%20City&output=embed",
    },
  ];
  return sections;
}

async function run() {
  if (!TOKEN) throw new Error("STRAPI_API_TOKEN is required");
  const registry = loadRegistry();
  const uploads = await api("/api/upload/files?pagination[pageSize]=1000");
  const imageId = uploads.find((file) => /doctor|clinic|hospital|surgery/i.test(file.name || ""))?.id || uploads[0]?.id;
  if (!imageId) throw new Error("No uploaded image is available for service media");
  const existing = await api("/api/service-details?pagination[pageSize]=100&populate=hero_image");
  const records = new Map((existing.data || []).map((record) => [record.slug, record]));

  for (const [slug, service] of Object.entries(registry)) {
    const current = records.get(slug);
    if (!current) throw new Error(`Missing Strapi service record: ${slug}`);
    const sections = buildSections(service, imageId);
    const data = {
      title: service.title,
      breadcrumb_label: service.title.toUpperCase(),
      description: service.description,
      hero_image: current.hero_image?.id || imageId,
      primary_cta_label: current.primary_cta_label || "Book a Consultation",
      primary_cta_link: current.primary_cta_link || "/contact",
      secondary_cta_label: current.secondary_cta_label || "Explore the Procedure",
      secondary_cta_link: current.secondary_cta_link || "#service-detail-pricing",
      trust_label: service.trustPoints?.[0] || current.trust_label || "Direct surgeon-led care",
      trust_rating: current.trust_rating || "Hospital-based surgery",
      sections,
    };
    console.log(`[VERIFY] ${slug}: ${sections.length} sections, ${service.pricing.items.length} price rows, ${service.faq.items.length} FAQ items`);
    if (!DRY_RUN) {
      await api(`/api/service-details/${current.documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, status: "published" }),
      });
      console.log(`[SYNC] published ${slug}`);
    }
  }
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); process.exitCode = 1; });
