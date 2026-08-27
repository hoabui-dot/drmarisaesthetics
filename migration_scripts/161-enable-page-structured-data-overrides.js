#!/usr/bin/env node

/** Ensure the About Page has the reusable Page SEO component for page-specific JSON-LD overrides. */
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const current = await api('/api/about-page?populate[seo]=*');
  if (!current.data?.seo) {
    await api('/api/about-page', {
      method: 'PUT',
      body: JSON.stringify({ data: { seo: { structured_data_enabled: true } } }),
    });
    console.log('[STRUCTURED DATA] enabled page-specific Page SEO fields for About Page');
    return;
  }
  console.log('[STRUCTURED DATA] About Page already has Page SEO fields');
}

run().catch((error) => {
  console.error(`[STRUCTURED DATA] failed: ${error.message}`);
  process.exitCode = 1;
});
