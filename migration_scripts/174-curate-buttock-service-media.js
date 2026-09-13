#!/usr/bin/env node

/*
 * Curate the visual story for the buttock augmentation service.
 *
 * The service UI intentionally uses clinical/planning imagery only. These
 * remote assets are downloaded into Strapi's Upload Library, then linked to
 * the four BBL-specific sections so the frontend never depends on remote
 * image URLs at render time.
 */
const BASE = process.env.STRAPI_URL || "http://127.0.0.1:22345";
const TOKEN = process.env.STRAPI_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const fs = require("fs");
const path = require("path");
const { Module } = require("module");
const ts = require(path.resolve(__dirname, "../dental-frontend/node_modules/typescript"));

const assets = [
  {
    key: "bbl-consultation",
    name: "buttock-bbl-clinical-consultation.jpg",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85",
    alt: "Clinical consultation and planning in a modern medical setting",
  },
  {
    key: "bbl-planning",
    name: "buttock-bbl-surgical-planning.jpg",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1800&q=85",
    alt: "Medical team reviewing a patient's surgical plan",
  },
  {
    key: "buttock-implant-planning",
    name: "buttock-implant-planning.jpg",
    url: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=85",
    alt: "Surgeon-led anatomical planning before a procedure",
  },
  {
    key: "bbl-safety-hospital",
    name: "buttock-bbl-hospital-safety.jpg",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=85",
    alt: "Modern hospital environment for safe surgical care",
  },
];

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(data)}`);
  return data;
}

async function uploadOrReuse(asset, existingFiles) {
  const existing = existingFiles.find((file) => file.name === asset.name);
  if (existing) return existing.id;
  const source = await fetch(asset.url);
  if (!source.ok) throw new Error(`Unable to download ${asset.url}: ${source.status}`);
  const blob = await source.blob();
  const form = new FormData();
  form.append("files", blob, asset.name);
  form.append("fileInfo", JSON.stringify({ name: asset.name, alternativeText: asset.alt, caption: asset.alt }));
  const uploaded = await api("/api/upload", { method: "POST", body: form });
  return uploaded[0]?.id;
}

function loadButtockService() {
  const registryFile = path.resolve(__dirname, "../dental-frontend/src/data/service-details.ts");
  const source = fs.readFileSync(registryFile, "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const serviceModule = new Module(registryFile, module);
  serviceModule.filename = registryFile;
  serviceModule.paths = Module._nodeModulePaths(path.dirname(registryFile));
  serviceModule._compile(output, registryFile);
  return serviceModule.exports.SERVICE_DETAILS["buttock-augmentation"];
}

async function run() {
  if (!TOKEN && !DRY_RUN) throw new Error("STRAPI_API_TOKEN is required");
  const existingFiles = DRY_RUN ? [] : await api("/api/upload/files?pagination[pageSize]=1000");
  const media = {};
  for (const asset of assets) {
    media[asset.key] = DRY_RUN ? null : await uploadOrReuse(asset, existingFiles);
    console.log(`[MEDIA] ${asset.key} -> ${media[asset.key] || "dry-run"}`);
  }

  const current = await api("/api/service-details?filters[slug][$eq]=buttock-augmentation&pagination[pageSize]=1");
  const record = current.data?.[0];
  if (!record) throw new Error("Buttock augmentation service record was not found");
  const sections = await api(`/api/service-details/${record.documentId}?populate[sections][on][service-detail.specialty-section][populate][image]=true`);
  const currentSections = sections.data?.sections || [];
  const source = loadButtockService();
  const sourceSections = {
    specialty: source.specialty,
    "specialty-bbl-stages": source.specialtySections.find((section) => section.id === "bbl-stages"),
    "specialty-buttock-implants": source.specialtySections.find((section) => section.id === "buttock-implants"),
    "specialty-bbl-safety": source.specialtySections.find((section) => section.id === "bbl-safety"),
  };
  const imageBySection = {
    specialty: media["bbl-consultation"],
    "specialty-bbl-stages": media["bbl-planning"],
    "specialty-buttock-implants": media["buttock-implant-planning"],
    "specialty-bbl-safety": media["bbl-safety-hospital"],
  };
  const updatedSections = currentSections.map((section) => {
    const { id, documentId, createdAt, updatedAt, publishedAt, ...attributes } = section;
    const cleanItems = Array.isArray(attributes.items)
      ? attributes.items.map((item) => { const { id: itemId, documentId: itemDocumentId, createdAt: itemCreatedAt, updatedAt: itemUpdatedAt, ...itemAttributes } = item; return itemAttributes; })
      : attributes.items;
    return imageBySection[section.section_key]
      ? { ...attributes, items: (sourceSections[section.section_key]?.points || sourceSections[section.section_key]?.cards || []).map((item) => ({ title: typeof item === "string" ? item : item.title, description: typeof item === "string" ? "" : item.description || "" })), image: imageBySection[section.section_key] }
      : { ...attributes, items: cleanItems };
  });
  console.log(`[VERIFY] ${updatedSections.filter((section) => imageBySection[section.section_key]).length} BBL specialty sections mapped`);
  if (!DRY_RUN) {
    await api(`/api/service-details/${record.documentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { sections: updatedSections }, status: "published" }),
    });
    console.log("[SYNC] Buttock augmentation media published");
  }
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`);
  process.exitCode = 1;
});
