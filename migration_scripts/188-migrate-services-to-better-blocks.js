#!/usr/bin/env node

/** Import the authoritative Service DOCX files directly into Better Blocks JSON. */
const fs = require("node:fs");
const path = require("node:path");
const { docxToBetterBlocks } = require("../strapi-cms/src/lib/docx-better-blocks");

const BASE = (process.env.STRAPI_URL || "http://127.0.0.1:22345").replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN;
const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "services-docs", "docx-docs", "content dịch vụ");
const DRY_RUN = process.argv.includes("--dry-run");
const sources = {
  "nâng ngực.docx": "breast-augmentation",
  "hút mỡ.docx": "liposuction",
  "trẻ hoá vùng mắt.docx": "blepharoplasty",
  "thu nhỏ dạ dày.docx": "gastric-sleeve",
  "căng da mặt.docx": "facelift",
  "nâng mông.docx": "buttock-augmentation",
  "tạo hình vùng kín.docx": "labiaplasty",
};

function removeServiceMetadata(blocks) {
  let firstContentHeading = true;
  return blocks.filter((block) => {
    if (firstContentHeading && block.type === "heading" && block.level === 1) {
      firstContentHeading = false;
      return false;
    }
    firstContentHeading = false;
    const text = (block.children || [])
      .filter((child) => child.type === "text")
      .map((child) => child.text)
      .join("")
      .trim();
    return !/^Meta Description\s*:/i.test(text);
  });
}

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  if (!TOKEN) throw new Error("STRAPI_API_TOKEN is required");
  for (const [fileName, slug] of Object.entries(sources)) {
    const filePath = path.join(SOURCE_DIR, fileName);
    const imported = await docxToBetterBlocks(fs.readFileSync(filePath));
    const blocks = removeServiceMetadata(imported.blocks);
    const warnings = imported.warnings;
    const current = (await api(`/api/services?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`)).data?.[0];
    if (!current) { console.warn(`[SKIP] No Service entry for ${slug}`); continue; }
    console.log(`[IMPORT] ${slug}: ${blocks.length} blocks${warnings.length ? ` (${warnings.length} warnings)` : ""}`);
    warnings.forEach((warning) => console.warn(`  [WARN] ${warning}`));
    if (!DRY_RUN) await api(`/api/services/${current.documentId || current.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: { contentBetterBlocks: blocks } }) });
  }
  console.log(`[DONE] ${DRY_RUN ? "Dry run complete." : "Service Better Blocks content imported."}`);
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); if (error.details) console.error(JSON.stringify(error.details, null, 2)); process.exitCode = 1; });
