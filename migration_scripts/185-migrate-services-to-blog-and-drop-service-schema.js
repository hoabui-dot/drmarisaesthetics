#!/usr/bin/env node

/**
 * Move service-detail entries into the canonical Blog collection, then remove
 * the service-page data model. Run with --dry-run before the destructive run.
 *
 * Required environment:
 *   STRAPI_URL (defaults to http://127.0.0.1:22345)
 *   STRAPI_API_TOKEN
 *   POSTGRES_* (only needed for --drop-tables)
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;
const { execFileSync } = require('node:child_process');
const DRY_RUN = process.argv.includes('--dry-run');
const DROP_TABLES = process.argv.includes('--drop-tables');

function unwrap(value) {
  return value?.attributes || value || {};
}

function mediaId(value) {
  return value?.data?.id || value?.id || null;
}

function markdownForService(data) {
  if (data.source_content) return String(data.source_content);
  const lines = [`# ${data.title}`, '', String(data.description || '')];
  for (const section of data.sections || []) {
    const item = unwrap(section);
    if (item.title) lines.push('', `## ${item.title}`);
    if (item.body) lines.push('', String(item.body));
    for (const feature of item.items || []) {
      const entry = unwrap(feature);
      if (entry.title) lines.push('', `### ${entry.title}`);
      if (entry.description) lines.push(String(entry.description));
    }
    if (item.intro) lines.push('', String(item.intro));
    if (item.note) lines.push('', `> ${item.note}`);
    if (item.items && item.__component === 'service-detail.pricing-table') {
      lines.push('', '| Procedure | VND | AUD | USD | NZD |', '| --- | --- | --- | --- | --- |');
      for (const price of item.items) {
        const row = unwrap(price);
        lines.push(`| ${row.procedure || ''} | ${row.vnd || ''} | ${row.aud || ''} | ${row.usd || ''} | ${row.nzd || ''} |`);
      }
    }
  }
  return lines.filter((line, index) => line || lines[index - 1]).join('\n').trim();
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(payload)}`);
  return payload;
}

async function dropServiceTables() {
  const sql = `
    DO $$ DECLARE item record; BEGIN
      FOR item IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
          AND (
            tablename IN ('service_details', 'service_details_cmps', 'services_overview', 'services_overview_cmps')
            OR tablename LIKE 'components_service_detail_%'
            OR tablename LIKE 'components_services_overview_%'
          )
      LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', item.tablename);
      END LOOP;
    END $$;
  `;
  execFileSync('psql', [
    '-h', process.env.POSTGRES_HOST === 'postgres' ? '127.0.0.1' : (process.env.POSTGRES_HOST || '127.0.0.1'),
    '-p', String(process.env.POSTGRES_HOST === 'postgres' ? 15432 : (process.env.POSTGRES_PORT || 15432)),
    '-U', process.env.POSTGRES_USER || 'postgres',
    '-d', process.env.POSTGRES_DB || 'dental_cms_strapi',
    '-v', 'ON_ERROR_STOP=1',
    '-c', sql,
  ], { env: { ...process.env, PGPASSWORD: process.env.POSTGRES_PASSWORD || 'postgres' }, stdio: 'inherit' });
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const response = await api('/api/service-details?pagination[pageSize]=100&populate=*');
  const services = response.data || [];
  console.log(`[VERIFY] Found ${services.length} service-detail entries`);

  const payloads = services.map((entry) => {
    const data = unwrap(entry);
    const content = markdownForService(data);
    return {
      slug: data.slug,
      title: data.title,
      category: 'Plastic Surgery',
      coverImage: mediaId(data.hero_image),
      metaImage: mediaId(data.hero_image),
      excerpt: data.description || data.title,
      metaDescription: data.description || data.title,
      authorName: 'Dr. Maris Aesthetics',
      readingTime: readingTime(content),
      content,
      publishedAt: data.publishedAt || new Date().toISOString(),
    };
  });

  for (const payload of payloads) console.log(`[MIGRATE] ${payload.slug}: ${payload.content.length} chars`);
  if (DRY_RUN) return;

  for (const payload of payloads) {
    const existing = await api(`/api/blogs?filters[slug][$eq]=${encodeURIComponent(payload.slug)}&pagination[pageSize]=1`);
    const current = existing.data?.[0];
    const endpoint = current ? `/api/blogs/${current.documentId || current.id}` : '/api/blogs';
    await api(endpoint, {
      method: current ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });
  }

  const existingServices = await api('/api/service-details?pagination[pageSize]=100');
  for (const entry of existingServices.data || []) {
    await api(`/api/service-details/${entry.documentId || entry.id}`, { method: 'DELETE' });
  }
  if (DROP_TABLES) await dropServiceTables();
  console.log(`[DONE] Migrated ${payloads.length} services to blogs and removed service records${DROP_TABLES ? ' and tables' : ''}.`);
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`);
  process.exitCode = 1;
});
