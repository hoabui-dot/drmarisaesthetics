#!/usr/bin/env node

/** Keep Services Overview presentation-only: service cards provide a title, while cards come from service-details. */
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;
const { Client } = require('pg');

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const client = new Client({ host: process.env.DATABASE_HOST || 'dental-postgres', port: Number(process.env.DATABASE_PORT || 5432), database: process.env.DATABASE_NAME || 'dental_cms_strapi', user: process.env.DATABASE_USERNAME || 'postgres', password: process.env.DATABASE_PASSWORD || 'postgres' });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query("UPDATE components_services_overview_service_cards SET title = 'Explore Our Services'");
    await client.query("DELETE FROM files_related_mph WHERE related_type = 'services-overview.service-item'");
    await client.query('DELETE FROM components_services_overview_service_items');
    await client.query('DELETE FROM components_services_overview_service_cards WHERE id NOT IN (SELECT cmp_id FROM services_overview_cmps WHERE component_type = \'services-overview.service-cards\')');
    await client.query('COMMIT');
    const current = await api('/api/services-overview?populate[layout][populate]=*');
    const card = current.data?.layout?.find((block) => block.__component === 'services-overview.service-cards');
    console.log(`[SERVICES OVERVIEW] removed service-item records; retained presentation card title: ${card?.title || 'missing'}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[SERVICES OVERVIEW] failed: ${error.message}`); process.exitCode = 1; });
