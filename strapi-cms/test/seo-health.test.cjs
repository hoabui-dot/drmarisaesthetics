'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeSeoHealth, paginateIssues } = require('../src/plugins/seo-manager/server/health/analyzer');

const baseInput = (overrides = {}) => ({
  documents: [], draftDocuments: [], globalSettings: { sitemap_enabled: true, structured_data_enabled: true, structured_data_business_type: 'MedicalClinic' },
  robots: { indexing_enabled: true, rules: [] }, globalOpenGraphImage: { url: '/uploads/global.webp' }, redirects: [], canonicalRules: [], ...overrides,
});
const page = (overrides = {}) => ({
  uid: 'api::page.page', kind: 'collection', documentId: 'doc-1', locale: 'en', path: '/about', title: 'About our clinic',
  description: 'A sufficiently detailed page description for the clinic and its patient services.', publishedAt: '2026-01-01T00:00:00.000Z',
  pageSeoConsumed: true, canonicalSupported: true, sitemapSupported: true, structuredDataGenerated: true,
  seo: { meta_title: 'About our clinic', meta_description: 'A sufficiently detailed page description for the clinic and its patient services.', meta_image: { url: '/uploads/about.webp', alternativeText: 'Clinic team' }, canonical_url: 'https://example.test/about' },
  ...overrides,
});

test('reports missing effective metadata, while honoring frontend fallbacks and ignored CMS SEO fields', () => {
  const missing = page({ title: '', description: '', seo: {}, pageSeoConsumed: true });
  const ignored = page({ uid: 'api::service.service', title: 'Service title', metaDescription: 'Service description long enough to be useful for search snippets.', seo: { meta_title: '', meta_description: '' }, pageSeoConsumed: false, canonicalSupported: false, sitemapSupported: false });
  const result = analyzeSeoHealth(baseInput({ documents: [missing, ignored] }));
  assert.equal(result.issues.some((issue) => issue.code === 'META_TITLE_MISSING' && issue.documentId === 'doc-1'), true);
  assert.equal(result.issues.some((issue) => issue.code === 'META_TITLE_MISSING' && issue.contentTypeUid === 'api::service.service'), false);
  assert.equal(result.issues.some((issue) => issue.code === 'META_DESCRIPTION_MISSING' && issue.contentTypeUid === 'api::service.service'), false);
});

test('duplicate metadata is detected within a locale but not across locales', () => {
  const result = analyzeSeoHealth(baseInput({ documents: [page(), page({ documentId: 'doc-2', path: '/about-us', locale: 'vi' }), page({ documentId: 'doc-3', path: '/team', locale: 'en' })] }));
  const duplicate = result.issues.filter((issue) => issue.code === 'META_TITLE_DUPLICATE');
  assert.equal(duplicate.length, 2);
  assert.ok(duplicate.every((issue) => issue.locale === 'en'));
});

test('noindex is counted and excluded from sitemap expectation', () => {
  const result = analyzeSeoHealth(baseInput({ documents: [page({ seo: { ...page().seo, no_index: true } })] }));
  assert.equal(result.summary.noindexPages, 1);
  assert.equal(result.summary.indexablePages, 0);
  assert.equal(result.summary.sitemapExpected, 0);
  assert.equal(result.summary.sitemapExcluded, 1);
});

test('canonical to a noindex document is critical', () => {
  const target = page({ documentId: 'target', path: '/target', seo: { ...page().seo, no_index: true } });
  const source = page({ documentId: 'source', path: '/source', seo: { ...page().seo, canonical_url: 'https://example.test/target' } });
  const result = analyzeSeoHealth(baseInput({ documents: [source, target] }));
  assert.equal(result.issues.some((issue) => issue.code === 'CANONICAL_TARGET_NOINDEX' && issue.documentId === 'source'), true);
});

test('detects redirect loops and chains; accepts external HTTP destinations', () => {
  const redirects = [
    { documentId: 'a', source_path: '/a', destination_path: '/b', is_active: true },
    { documentId: 'b', source_path: '/b', destination_path: '/a', is_active: true },
    { documentId: 'c', source_path: '/c', destination_path: '/d', is_active: true },
    { documentId: 'd', source_path: '/d', destination_path: '/final', is_active: true },
    { documentId: 'external', source_path: '/legacy', destination_path: 'https://other.test/final', is_active: true },
    { documentId: 'same-origin', source_path: '/old-about', destination_path: 'https://example.test/about?source=legacy', is_active: true },
  ];
  const result = analyzeSeoHealth(baseInput({ redirects, publicOrigin: 'https://example.test' }));
  assert.equal(result.summary.redirectLoops, 1);
  assert.equal(result.summary.redirectChains, 1);
  assert.equal(result.issues.some((issue) => issue.code === 'REDIRECT_URL_INVALID' && issue.documentId === 'external'), false);
  assert.equal(result.issues.some((issue) => issue.code === 'REDIRECT_URL_INVALID' && issue.documentId === 'same-origin'), false);
});

test('recognizes registered service routes and flags unregistered dynamic types', () => {
  const result = analyzeSeoHealth(baseInput({ documents: [page({ uid: 'api::service.service', path: '/services/facelift', pageSeoConsumed: false })] }));
  assert.equal(result.issues.some((issue) => issue.code === 'SITEMAP_CONTENT_NOT_INCLUDED'), false);
  const unregistered = analyzeSeoHealth(baseInput({ documents: [page({ uid: 'api::doctor.doctor', path: '/doctors/dr-huy', pageSeoConsumed: false })] }));
  assert.equal(unregistered.issues.some((issue) => issue.code === 'SITEMAP_CONTENT_NOT_INCLUDED'), true);
});

test('SEO Health respects disabled sitemap sources without flagging intentional exclusions', () => {
  const service = page({ uid: 'api::service.service', path: '/services/facelift', pageSeoConsumed: false });
  const result = analyzeSeoHealth(baseInput({
    documents: [service],
    sitemapPolicy: { contentTypes: { 'api::service.service': false }, staticPaths: {} },
  }));
  assert.equal(result.summary.sitemapExpected, 0);
  assert.equal(result.summary.sitemapExcluded, 1);
  assert.equal(result.issues.some((issue) => issue.code === 'SITEMAP_CONTENT_NOT_INCLUDED'), false);
});

test('validates custom structured data and configured business type', () => {
  const malformed = page({ seo: { ...page().seo, structured_data_json: '{invalid' } });
  const result = analyzeSeoHealth(baseInput({ documents: [malformed], globalSettings: { structured_data_enabled: true, structured_data_business_type: 'Dentist' } }));
  assert.equal(result.issues.some((issue) => issue.code === 'STRUCTURED_DATA_INVALID_JSON'), true);
  assert.equal(result.issues.some((issue) => issue.code === 'STRUCTURED_DATA_BUSINESS_TYPE_INVALID'), true);
});

test('detects a whole-site robots block without treating a scoped path block as global', () => {
  const blocked = analyzeSeoHealth(baseInput({ robots: { indexing_enabled: true, rules: [], additional_directives: 'Disallow: /\n' } }));
  const scoped = analyzeSeoHealth(baseInput({ robots: { indexing_enabled: true, rules: [], additional_directives: 'Disallow: /private/\n' } }));
  assert.equal(blocked.issues.some((issue) => issue.code === 'ROBOTS_EXTRA_BLOCKS_ALL'), true);
  assert.equal(scoped.issues.some((issue) => issue.code === 'ROBOTS_EXTRA_BLOCKS_ALL'), false);
});

test('reports disabled structured-data output as a recommendation rather than a pass', () => {
  const result = analyzeSeoHealth(baseInput({ globalSettings: { sitemap_enabled: true, structured_data_enabled: false } }));
  assert.equal(result.issues.some((issue) => issue.code === 'STRUCTURED_DATA_DISABLED' && issue.severity === 'recommendation'), true);
  assert.equal(result.categories['structured-data'].passed, 0);
});

test('health score is bounded and pagination applies filters and search', () => {
  const documents = Array.from({ length: 3 }, (_, index) => page({ documentId: `doc-${index}`, path: `/page-${index}`, seo: { ...page().seo, meta_description: '' } }));
  const result = analyzeSeoHealth(baseInput({ documents }));
  assert.ok(result.score >= 0 && result.score <= 100);
  const filtered = paginateIssues(result.issues, { severity: 'warning', search: 'description', page: '1', pageSize: '10' });
  assert.ok(filtered.items.length > 0);
  assert.ok(filtered.items.every((issue) => issue.severity === 'warning'));
});
