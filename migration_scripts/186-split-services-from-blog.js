#!/usr/bin/env node

/** Move Plastic Surgery service entries from Blog into the separate Service collection. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${path}: ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const blogs = await api('/api/blogs?filters[category][$eq]=Plastic%20Surgery&pagination[pageSize]=100&populate=*');
  const services = blogs.data || [];
  console.log(`[VERIFY] Found ${services.length} Plastic Surgery blog entries to split.`);

  for (const entry of services) {
    const data = entry.attributes || entry;
    const payload = {
      title: data.title,
      slug: data.slug,
      category: 'Plastic Surgery',
      coverImage: data.coverImage?.data?.id || data.coverImage?.id || null,
      excerpt: data.excerpt,
      metaDescription: data.metaDescription,
      authorName: data.authorName || 'Dr. Maris Aesthetics',
      readingTime: data.readingTime,
      metaImage: data.metaImage?.data?.id || data.metaImage?.id || data.coverImage?.data?.id || data.coverImage?.id || null,
      content: data.content,
      seo: data.seo?.data?.id || data.seo?.id || undefined,
      publishedAt: data.publishedAt || new Date().toISOString(),
    };
    console.log(`[MIGRATE] ${payload.slug}`);
    if (DRY_RUN) continue;

    const existing = await api(`/api/services?filters[slug][$eq]=${encodeURIComponent(payload.slug)}&pagination[pageSize]=1`);
    const current = existing.data?.[0];
    const endpoint = current ? `/api/services/${current.documentId || current.id}` : '/api/services';
    await api(endpoint, {
      method: current ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });
    await api(`/api/blogs/${entry.documentId || entry.id}`, { method: 'DELETE' });
  }
  console.log(`[DONE] ${DRY_RUN ? 'Dry run complete.' : `Split ${services.length} services into the Service collection.`}`);
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); process.exitCode = 1; });
