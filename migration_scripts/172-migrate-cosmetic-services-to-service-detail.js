#!/usr/bin/env node

/* Replace legacy dental service records with the seven DOCX-backed cosmetic services. */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BASE = process.env.STRAPI_URL || "http://127.0.0.1:22345";
const TOKEN = process.env.STRAPI_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const DOCS_ROOT = path.resolve(__dirname, "../services-docs/docx-docs");
const services = [
  ["blepharoplasty", "trẻ hoá vùng mắt.docx", "Blepharoplasty in Vietnam: Upper & Lower Eyelid Rejuvenation"],
  ["breast-augmentation", "nâng ngực.docx", "Breast Augmentation and Revision Surgery in Vietnam"],
  ["buttock-augmentation", "nâng mông.docx", "Buttock Augmentation and BBL Planning in Vietnam"],
  ["facelift", "căng da mặt.docx", "Facelift and Facial Rejuvenation Surgery in Vietnam"],
  ["gastric-sleeve", "thu nhỏ dạ dày.docx", "Gastric Sleeve Surgery in Vietnam"],
  ["labiaplasty", "tạo hình vùng kín.docx", "Labiaplasty and Intimate Cosmetic Surgery in Vietnam"],
  ["liposuction", "hút mỡ.docx", "Liposuction and Body Contouring in Vietnam"],
];

const prices = {
  blepharoplasty: [
    ["Upper Eyelid Surgery (Upper Blepharoplasty)", "60,750,000 VND", "A$3,380", "US$2,340", "NZ$3,800"],
    ["Lower Eyelid Surgery (Lower Blepharoplasty)", "47,250,000 VND", "A$2,630", "US$1,820", "NZ$2,950"],
    ["Eyebrow Lift", "60,750,000 VND", "A$3,380", "US$2,340", "NZ$3,800"],
  ],
  "breast-augmentation": [
    ["Breast Augmentation – Motiva Implants (Smooth, No Chip)", "114,750,000 VND", "A$6,380"],
    ["Breast Augmentation – Motiva Ergonomix (Single-Chip)", "168,750,000 VND", "A$9,380"],
    ["Breast Augmentation – Motiva Ergonomix 2", "209,250,000 VND", "A$11,630"],
    ["Breast Lift (Mastopexy)", "168,750,000 VND", "A$9,380"],
    ["Symmastia Correction (Implant Bridging Repair)", "135,000,000 VND", "A$7,500"],
    ["Free Silicone Removal (Breast)", "135,000,000 VND", "A$7,500"],
    ["Implant Removal & Capsulectomy", "101,250,000 VND", "A$5,630"],
  ],
  "buttock-augmentation": [["Buttock Augmentation – Fat Transfer (BBL)", "105,000,000 VND", "A$5,830", "US$4,040", "NZ$6,560"], ["Buttock Augmentation – Implants", "195,000,000 VND", "A$10,830", "US$7,500", "NZ$12,190"]],
  facelift: [["Mini Facelift", "114,750,000 VND", "A$6,380"], ["Neck Lift", "87,750,000 VND", "A$4,880"], ["Forehead Lift (Brow Lift)", "101,250,000 VND", "A$5,630"]],
  "gastric-sleeve": [],
  labiaplasty: [["Labiaplasty (External Genital Contouring)", "101,250,000 VND", "A$5,630"], ["Vaginal Tightening (Vaginoplasty)", "87,750,000 VND", "A$4,880"]],
  liposuction: [["360° Abdomen Liposuction — Front Abdomen, Lower Back & Waist", "128,250,000 VND", "A$7,130"], ["Abdominoplasty with Muscle Repair — Tummy Tuck", "162,000,000 VND", "A$9,000"], ["Arm Liposuction", "74,250,000 VND", "A$4,130"], ["Arm Lift — Brachioplasty", "101,250,000 VND", "A$5,630"], ["Thigh Liposuction", "128,250,000 VND", "A$7,130"], ["Thigh Lift", "168,750,000 VND", "A$9,380"], ["Back Liposuction", "87,750,000 VND", "A$4,880"], ["Double Chin Liposuction", "74,250,000 VND", "A$4,130"]],
};

function docxText(file) {
  const xml = execFileSync("unzip", ["-p", file, "word/document.xml"], { encoding: "utf8" });
  return xml.replace(/<w:tab[^>]*\/?/g, "\t").replace(/<w:br[^>]*\/?/g, "\n").replace(/<\/w:tc>/g, "\t").replace(/<\/w:p>/g, "\n").replace(/<\/w:tr>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).split(/\n+/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
}

function blocks(text) {
  const lines = text.split("\n");
  const starts = /^(Understanding |Who May |Common Concerns|Dr\. Maris|How |Surgery at |Recovery|International |Risks |Results |Why International|Frequently Asked Questions|Upper Blepharoplasty|Lower Blepharoplasty|Eyebrow Lift|Liposuction|Breast |Buttock |Vaginal |Normal variation)/i;
  const result = [];
  let current = null;
  for (const line of lines) {
    if (line.length < 100 && starts.test(line) && !/[.!?:]$/.test(line)) {
      if (current) result.push(current);
      current = { title: line, body: [] };
    } else if (current) current.body.push(line);
  }
  if (current) result.push(current);
  return result.filter((item) => item.body.length);
}

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(data)}`);
  return data;
}

async function run() {
  if (!TOKEN) throw new Error("STRAPI_API_TOKEN is required");
  const uploads = await api("/api/upload/files?pagination[pageSize]=1000");
  const imageId = uploads.find((item) => /doctor|clinic|hospital|surgery/i.test(item.name || ""))?.id || uploads[0]?.id;
  if (!imageId) throw new Error("No uploaded image is available for service hero media");
  const payloads = [];
  const sourceDirName = fs.readdirSync(DOCS_ROOT).find((name) => /^content /i.test(name));
  if (!sourceDirName) throw new Error(`Missing DOCX source directory under ${DOCS_ROOT}`);
  const sourceDir = path.join(DOCS_ROOT, sourceDirName);
  const sourceFiles = fs.readdirSync(sourceDir);
  for (const [slug, filename, title] of services) {
    const resolvedFilename = sourceFiles.find((candidate) => candidate.normalize("NFC") === filename.normalize("NFC") || candidate.normalize("NFD") === filename.normalize("NFD"));
    const file = path.join(sourceDir, resolvedFilename || filename);
    if (!fs.existsSync(file)) throw new Error(`Missing DOCX: ${file}`);
    const sourceContent = docxText(file);
    for (const row of prices[slug]) if (!sourceContent.includes(row[0]) || !sourceContent.includes(row[1])) throw new Error(`Price verification failed: ${slug} / ${row[0]}`);
    const extracted = blocks(sourceContent);
    const commonCount = Math.max(1, Math.ceil(extracted.length * 0.7));
    const sections = extracted.slice(0, commonCount).map((item, index) => ({ __component: "service-detail.editorial-section", section_key: `common-${index + 1}`, anchor_label: item.title, eyebrow: "SURGEON-LED CARE", title: item.title, body: item.body.join("\n"), image: imageId }));
    sections.push(...extracted.slice(commonCount).map((item, index) => ({ __component: "service-detail.specialty-section", section_key: `${slug}-${index + 1}`, anchor_label: item.title, eyebrow: "SERVICE-SPECIFIC CONSIDERATIONS", title: item.title, body: item.body.join("\n"), image: imageId })));
    sections.push({ __component: "service-detail.pricing-table", section_key: "pricing", anchor_label: "Pricing", eyebrow: "INTERNATIONAL PRICE REFERENCE", title: `${title.split(" in Vietnam")[0]} Cost in Vietnam`, intro: "Indicative starting prices from the approved DR. MARIS international price information.", items: prices[slug].map(([procedure, vnd, aud, usd, nzd]) => ({ procedure, vnd, aud, usd, nzd })), note: slug === "gastric-sleeve" ? "No approved DR. MARIS bariatric price has been supplied. Do not estimate this price from another procedure or competitor source." : "Prices are indicative starting rates. Final pricing requires individual assessment; foreign-currency values are reference conversions and final invoicing follows the applicable bank exchange rate.", assessment_only: slug === "gastric-sleeve" });
    const faqStart = sourceContent.indexOf("Frequently Asked Questions");
    sections.push({ __component: "service-detail.faq", anchor_label: "Frequently Asked Questions", title: `Frequently Asked Questions About ${title}`, items: [{ question: "Source document clinical guidance", answer: faqStart >= 0 ? sourceContent.slice(faqStart) : sourceContent }] });
    sections.push({ __component: "service-detail.consultation", anchor_label: "Consultation", step_number: "01", title: "Begin with an individual assessment", subtitle: "Discuss your anatomy, goals and realistic options with Dr. Maris.", address: "City International Hospital, Ho Chi Minh City, Vietnam", hotline: "+84 28 1234 5678", email: "concierge@drmarisaesthetics.com", working_hours: "By appointment", map_embed_url: "https://maps.google.com/maps?q=City%20International%20Hospital%20Ho%20Chi%20Minh%20City&output=embed" });
    payloads.push({ slug, title, breadcrumb_label: title.toUpperCase(), description: sourceContent.split("\n")[2] || title, hero_image: imageId, source_file: `services-docs/docx-docs/${sourceDirName}/${resolvedFilename || filename}`, source_content: sourceContent, primary_cta_label: "Book a Consultation", primary_cta_link: "/contact", secondary_cta_label: "Explore the Procedure", secondary_cta_link: "#service-detail-pricing", trust_label: "Direct surgeon-led care", trust_rating: "Hospital-based surgery", sections });
    console.log(`[VERIFY] ${slug}: ${sourceContent.split("\n").length} source lines, ${prices[slug].length} price rows, ${sections.length} sections`);
  }
  if (DRY_RUN) return;
  const existing = await api("/api/service-details?pagination[pageSize]=100");
  for (const item of existing.data || []) await api(`/api/service-details/${item.documentId}`, { method: "DELETE" });
  for (const data of payloads) {
    const created = await api("/api/service-details", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
    await api(`/api/service-details/${created.data.documentId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: {}, status: "published" }) });
    console.log(`[MIGRATE] published ${data.slug}`);
  }
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); process.exitCode = 1; });
