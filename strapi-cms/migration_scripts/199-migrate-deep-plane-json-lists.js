#!/usr/bin/env node

/**
 * One-off, idempotent migration for Deep Plane list fields.
 *
 * It converts editor-hostile JSON arrays into repeatable Strapi components
 * without changing the section order or the scalar page content. Run this
 * only after the component schema has been deployed:
 *
 * STRAPI_URL=http://127.0.0.1:22345 STRAPI_API_TOKEN=... \
 *   node migration_scripts/199-migrate-deep-plane-json-lists.js
 */

const baseUrl = (process.env.STRAPI_URL || "http://127.0.0.1:1337").replace(/\/$/, "");
const token = process.env.STRAPI_API_TOKEN;
const endpoint = `${baseUrl}/api/deep-plane-facelift-specialist`;
const fs = require("node:fs");
const path = require("node:path");

if (!token) {
  throw new Error("STRAPI_API_TOKEN is required");
}

const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method || "GET"} ${url} failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

function mediaUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.url || value.data?.attributes?.url || "";
}

function text(value) {
  return typeof value === "string" ? value : value?.text || value?.label || value?.title || "";
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function loadFrontendFallback() {
  const file = path.resolve(__dirname, "../../dental-frontend/src/lib/constants/deep-plane-facelift-specialist.ts");
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/export const DEEP_PLANE_FACELIFT_SPECIALIST = ([\s\S]*?) as const\n/);
  if (!match) throw new Error("Could not read Deep Plane fallback constant");
  return Function(`return (${match[1]})`)();
}

function componentList(value, factory) {
  return list(value).map(factory).filter(Boolean);
}

async function loadMediaIds(values) {
  const mediaIds = new Map();
  for (const value of values) {
    if (!value || typeof value !== "string") continue;
    const query = encodeURIComponent(value);
    const result = await request(`${baseUrl}/api/upload/files?filters%5Burl%5D%5B%24eq%5D=${query}&pagination%5BpageSize%5D=1`);
    const file = Array.isArray(result) ? result[0] : result?.data?.[0];
    if (file?.id) {
      mediaIds.set(value, file.id);
      mediaIds.set(value.replace(/^\//, ""), file.id);
    }
  }
  return mediaIds;
}

function mediaId(value, mediaIds) {
  if (!value) return undefined;
  if (typeof value === "object" && (value.id || value.data?.id)) return value.id || value.data.id;
  const url = mediaUrl(value);
  return mediaIds.get(url) || mediaIds.get(url.replace(/^\//, ""));
}

async function main() {
  const current = await request(`${endpoint}?populate[sections][populate]=*&status=draft`);
  const sections = current.data?.sections || [];
  const fallback = loadFrontendFallback();
  const mediaValues = [];
  for (const section of sections) {
    mediaValues.push(mediaUrl(section.image));
    for (const item of [...(section.cards || []), ...(section.steps || [])]) mediaValues.push(mediaUrl(item?.image));
  }
  const mediaIds = await loadMediaIds(mediaValues);

  const migrated = sections.map((section) => {
    const base = { __component: section.__component, id: section.id };
    switch (section.__component) {
      case "deep-plane.hero":
        {
        const source = (section.checklist?.[0]?.text === "TEST" || !section.checklist?.length)
          ? fallback.hero
          : section;
        return {
          ...base, eyebrow: section.eyebrow, title: section.title, description: section.description,
          image: mediaId(section.image, mediaIds), image_alt: section.image_alt,
          verified_label: section.verified_label, verified_title: section.verified_title, verified_meta: section.verified_meta,
          checklist: componentList(source.checklist, (item) => ({ text: text(item) })),
          metrics: componentList(source.metrics, (item) => ({ value: Array.isArray(item) ? item[0] : item.value, label: Array.isArray(item) ? item[1] : item.label })),
        };
        }
      case "deep-plane.journey":
        {
        const source = section.steps?.length ? section : fallback.journey;
        return {
          ...base, section_id: section.section_id, eyebrow: section.eyebrow, title: section.title, description: section.description,
          steps: componentList(source.steps, (item) => Array.isArray(item)
            ? { number: item[0], badge: item[1], title: item[2], description: item[3], phase: item[4] }
            : item),
        };
        }
      case "deep-plane.recovery":
        {
        const source = fallback.recovery;
        return {
          ...base, section_id: section.section_id, eyebrow: section.eyebrow, title: section.title, description: section.description, note: section.note,
          stages: componentList(section.stages?.length ? section.stages : source.stages, (item) => Array.isArray(item)
            ? { stage_label: item[0], title: item[1], summary: item[2], description: item[3], items: componentList(item[4], (entry) => ({ text: text(entry) })) }
            : item),
          steps: componentList(section.steps, (step) => ({
            id: step.id, number: step.number, title: step.title, description: step.description,
            items: componentList(step.items?.length ? step.items : (source.steps.find((entry) => entry.number === step.number)?.items || []), (item) => ({ text: text(item) })),
            image: mediaId(step.image, mediaIds), image_alt: step.image_alt,
          })),
        };
        }
      case "deep-plane.certifications":
        {
        const source = section.cards?.length ? section : fallback.certifications;
        return {
          ...base, section_id: section.section_id, eyebrow: section.eyebrow, title: section.title, description: section.description,
          cards: componentList(source.cards, (card) => ({ image: mediaId(card.image, mediaIds), image_alt: card.image_alt || card.imageAlt })),
        };
        }
      case "deep-plane.safety":
        {
        const source = section.cards?.length ? section : fallback.safety;
        return {
          ...base, section_id: section.section_id, eyebrow: section.eyebrow, title: section.title, description: section.description, note: section.note,
          cards: componentList(source.cards, (card) => ({
            eyebrow: card.eyebrow, title: card.title, alt: card.alt || card.image_alt,
            image: mediaId(card.image, mediaIds), items: componentList(card.items, (item) => ({ text: text(item) })),
          })),
        };
        }
      case "deep-plane.credentials":
        {
        const source = section.paragraphs?.length || section.cards?.length ? section : fallback.credentials;
        return {
          ...base, section_id: section.section_id, eyebrow: section.eyebrow, title: section.title,
          image: mediaId(section.image, mediaIds), image_alt: section.image_alt,
          paragraphs: componentList(source.paragraphs, (item) => ({ text: text(item) })),
          cards: componentList(source.cards, (item) => Array.isArray(item)
            ? { title: item[0], description: item[1] }
            : item),
        };
        }
      case "deep-plane.faq":
        {
        const source = section.items?.length ? section : fallback.faq;
        return {
          ...base, section_id: section.section_id, eyebrow: section.eyebrow, title: section.title, description: section.description,
          items: componentList(source.items, (item) => Array.isArray(item)
            ? { question: item[0], answer: item[1] }
            : item),
        };
        }
      case "deep-plane.consultation":
        return { ...section };
      default:
        return section;
    }
  });

  const result = await request(endpoint, { method: "PUT", body: JSON.stringify({ data: { sections: migrated } }) });
  console.log(JSON.stringify({ documentId: result.data?.documentId, sections: migrated.length, migrated: true }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
