#!/usr/bin/env node

/**
 * Seed the new About Us section configuration without duplicating canonical data.
 *
 * Doctors are rendered from the Homepage Doctor block.
 * Services are rendered from the Services Overview page by ordered slug.
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) throw new Error("STRAPI_API_TOKEN is required");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function request(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path}: ${response.status} ${JSON.stringify(payload)}`);
  }
  return payload;
}

const aboutSectionConfig = {
  doctors: {
    title: "Meet Our Doctors",
    view_all_label: "VIEW ALL DOCTORS",
    view_all_link: "/doctors",
  },
  featured_services: {
    title: "Featured Services",
    services: [
      { service_slug: "dental-implants" },
      { service_slug: "dental-braces" },
      { service_slug: "dental-bleaching" },
      { service_slug: "dental-veneers" },
      { service_slug: "dental-crowns" },
      { service_slug: "general-check-up" },
    ],
  },
};

async function main() {
  console.log(`[ABOUT SEED] Updating About Us section configuration at ${STRAPI_URL}`);

  await request("/content-manager/single-types/api::about-page.about-page", {
    method: "PUT",
    body: JSON.stringify({ data: aboutSectionConfig }),
  });
  console.log("[ABOUT SEED] Doctors and Featured Services configuration saved");

  await request("/content-manager/single-types/api::about-page.about-page/actions/publish", {
    method: "POST",
    body: JSON.stringify({}),
  });
  console.log("[ABOUT SEED] About Us published");

  const verify = await request("/api/about-page?populate[doctors]=*&populate[featured_services][populate][services]=*&status=published");
  const data = verify.data || {};
  console.log(`[ABOUT SEED] doctors=${data.doctors ? "present" : "missing"}`);
  console.log(`[ABOUT SEED] featured_services=${data.featured_services?.services?.length || 0} ordered references`);
}

main().catch((error) => {
  console.error(`[ABOUT SEED] ${error.message}`);
  process.exit(1);
});
