#!/usr/bin/env node

/** Seed safe global SEO defaults and crawler settings. Idempotent via Strapi REST. */
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function upsertSingle(uid, data) {
  await api(`/api/${uid}`, { method: 'PUT', body: JSON.stringify({ data }) });
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  await upsertSingle('seo-manager-settings', {
    default_meta_title: 'Smilux Dental | Saigon International Dental Clinic',
    meta_title_template: '%page_title% | Smilux Dental',
    default_meta_description: 'Trusted dental care with advanced technology and experienced specialists in Ho Chi Minh City.',
    site_name: 'Smilux Dental',
    default_open_graph_title: 'Smilux Dental | Saigon International Dental Clinic',
    default_open_graph_description: 'Trusted dental care with advanced technology and experienced specialists in Ho Chi Minh City.',
    sitemap_enabled: true,
    sitemap_default_change_frequency: 'weekly',
    sitemap_default_priority: 0.5,
  });
  await upsertSingle('robots-settings', {
    indexing_enabled: true,
    rules: [{ user_agent: '*', allow: '/', disallow: '/admin/\n/api/\n/_next/\n/preview' }],
    sitemap_url: '',
    additional_directives: '',
  });
  console.log('[SEO] seeded default metadata and robots.txt');
}

run().catch((error) => { console.error(`[SEO] failed: ${error.message}`); process.exitCode = 1; });
