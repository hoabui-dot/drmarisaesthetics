#!/usr/bin/env node

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const data = { structured_data_enabled: true, structured_data_business_type: 'Dentist' };
  await api('/api/seo-manager-settings', { method: 'PUT', body: JSON.stringify({ data }) });
  console.log('[STRUCTURED DATA] settings seeded and published');
}

run().catch((error) => { console.error(`[STRUCTURED DATA] failed: ${error.message}`); process.exitCode = 1; });
