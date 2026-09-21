const test = require('node:test');
const assert = require('node:assert/strict');
const { getSitemapReport, getRobotsConfiguration, cleanPath } = require('../src/lib/sitemap');

function createStrapiFixture({ services = [], redirects = [], canonicals = [], indexingEnabled = true, sitemapEnabled = true, contentTypes = {}, staticRoutes = {} } = {}) {
  const singleTypes = {
    'api::seo-manager-settings.seo-manager-settings': { sitemap_enabled: sitemapEnabled, sitemap_content_types: contentTypes, sitemap_static_routes: staticRoutes },
    'api::robots-settings.robots-settings': { indexing_enabled: indexingEnabled, rules: [] },
  };
  for (const route of require('../src/lib/sitemap').STATIC_ROUTES) {
    if (route.uid) singleTypes[route.uid] = { title: route.label, publishedAt: '2026-09-01T00:00:00.000Z', updatedAt: '2026-09-02T00:00:00.000Z', seo: {} };
  }

  const collections = {
    'api::service.service': services,
    'api::redirect.redirect': redirects,
    'api::canonical-rule.canonical-rule': canonicals,
    'api::blog.blog': [],
    'api::page.page': [],
  };

  return {
    config: { get: (key) => key === 'plugin.i18n.config.defaultLocale' ? 'en' : undefined },
    plugin: () => ({ service: () => ({ find: async () => [{ code: 'en' }] }) }),
    documents: (uid) => ({
      findFirst: async () => singleTypes[uid] || null,
      findMany: async (query) => query.status === 'draft' ? [] : collections[uid] || [],
    }),
    log: { warn() {}, error() {} },
  };
}

test('normalizes route paths without changing root', () => {
  assert.equal(cleanPath('services//face-lift/?x=1'), '/services/face-lift');
  assert.equal(cleanPath('/'), '/');
});

test('does not expose the retired HTML sitemap route in URLs or diagnostics', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({ staticRoutes: { sitemap: true } }));
    assert.ok(!report.items.some((item) => item.path === '/sitemap'));
    assert.ok(!report.issues.some((item) => item.code === 'SITEMAP_CONFIG_UNKNOWN_STATIC_ROUTE' && item.path === '/'));
    assert.ok(!report.staticRoutes.some((route) => route.path === '/sitemap'));
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('publishes the canonical doctor profile paths rather than their legacy routes', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture());
    assert.ok(report.items.some((item) => item.path === '/our-team/dr-huy' && item.label === 'Dr. Huy'));
    assert.ok(report.items.some((item) => item.path === '/our-team/dr-cuong' && item.label === 'Dr. Cuong'));
    assert.ok(!report.items.some((item) => item.path === '/our-team' || item.path === '/deep-plane-facelift-specialist'));
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('assigns stable sitemap keys and meaningful child descriptors from the central route registry', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({
      services: [{ title: 'Facelift', slug: 'facelift', updatedAt: '2026-09-12T10:00:00.000Z', seo: {} }],
    }));
    const service = report.items.find((item) => item.path === '/services/facelift');
    assert.equal(service.sitemapKey, 'service');
    assert.equal(report.items.find((item) => item.path === '/').sitemapKey, 'page');
    assert.deepEqual(report.sitemapGroups.map(({ key, path }) => [key, path]), [
      ['service', '/service-sitemap.xml'],
      ['news', '/news-sitemap.xml'],
      ['page', '/page-sitemap.xml'],
    ]);
    assert.equal(report.sitemapGroups.find((group) => group.key === 'service').urlCount, 1);
    assert.equal(report.sitemapGroups.find((group) => group.key === 'service').lastModified, '2026-09-12T10:00:00.000Z');
    assert.equal(report.sitemapGroups.find((group) => group.key === 'news').enabled, false);
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('includes published canonical URLs and excludes noindex, redirects and cross-domain canonicals', async () => {
  const previous = {
    origin: process.env.NEXT_PUBLIC_SERVER_URL,
    indexing: process.env.SITE_INDEXING_ENABLED,
  };
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example/';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({
      services: [
        { title: 'Facelift', slug: 'facelift', updatedAt: '2026-09-10T10:00:00.000Z', seo: {} },
        { title: 'Hidden', slug: 'hidden', seo: { no_index: true } },
        { title: 'Editor excluded', slug: 'editor-excluded', seo: { include_in_sitemap: false } },
        { title: 'Old Route', slug: 'old-route', seo: {} },
        { title: 'External Canonical', slug: 'external', seo: { canonical_url: 'https://other.example/page' } },
        { title: 'Alias to noindex', slug: 'alias', seo: { canonical_url: 'https://clinic.example/services/hidden' } },
      ],
      redirects: [{ source_path: '/services/old-route', destination_path: '/services/facelift', is_active: true }],
    }));

    assert.ok(report.items.some((item) => item.url === 'https://clinic.example/services/facelift'));
    assert.equal(report.items.find((item) => item.path === '/services/facelift').sitemapIncluded, true);
    assert.ok(!report.items.some((item) => item.path === '/services/hidden'));
    assert.ok(!report.items.some((item) => item.path === '/services/editor-excluded'));
    assert.ok(!report.items.some((item) => item.path === '/services/old-route'));
    assert.ok(!report.items.some((item) => item.path === '/services/external'));
    assert.ok(!report.items.some((item) => item.path === '/services/alias'));
    assert.ok(report.excluded.some((item) => item.path === '/services/hidden' && item.reason === 'Noindex is enabled'));
    assert.ok(report.excluded.some((item) => item.path === '/services/editor-excluded' && item.reason === 'Excluded by entry SEO setting'));
    assert.ok(report.issues.some((item) => item.code === 'SITEMAP_REDIRECT_SOURCE'));
    assert.ok(report.issues.some((item) => item.code === 'SITEMAP_CANONICAL_INVALID'));
    assert.ok(report.issues.some((item) => item.code === 'SITEMAP_CANONICAL_TARGET_MISSING'));
  } finally {
    if (previous.origin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previous.origin;
    if (previous.indexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previous.indexing;
  }
});

test('reports internal redirect chains for the sitemap health dashboard', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({
      redirects: [
        { source_path: '/legacy-a', destination_path: '/legacy-b', is_active: true },
        { source_path: '/legacy-b', destination_path: '/services/facelift', is_active: true },
      ],
    }));
    assert.ok(report.issues.some((item) => item.code === 'SITEMAP_REDIRECT_CHAIN'));
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('does not emit URLs when deployment indexing is disabled', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'false';
  try {
    const report = await getSitemapReport(createStrapiFixture());
    assert.equal(report.enabled, false);
    assert.equal(report.items.length, 0);
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('disabling a collection source excludes its published entries without changing entry SEO', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  const entry = { title: 'Facelift', slug: 'facelift', publishedAt: '2026-09-01T00:00:00.000Z', seo: {} };
  try {
    const report = await getSitemapReport(createStrapiFixture({
      services: [entry],
      contentTypes: { 'api::service.service': false },
    }));
    assert.ok(!report.items.some((item) => item.path === '/services/facelift'));
    assert.ok(report.excluded.some((item) => item.path === '/services/facelift' && item.reason === 'Sitemap source disabled in SEO Manager'));
    assert.equal(report.contentTypes.find((item) => item.uid === 'api::service.service').enabled, false);
    assert.equal(report.sitemapGroups.find((group) => group.key === 'service').enabled, false);
    assert.equal(report.sitemapGroups.find((group) => group.key === 'service').urlCount, 0);
    assert.equal(entry.seo.include_in_sitemap, undefined);
    assert.equal(entry.seo.no_index, undefined);
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('disabling a static route excludes it while keeping its route definition read-only', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({ staticRoutes: { contact: false } }));
    assert.ok(!report.items.some((item) => item.path === '/contact'));
    assert.ok(report.excluded.some((item) => item.path === '/contact' && item.reason === 'Sitemap source disabled in SEO Manager'));
    assert.deepEqual(report.staticRoutes.find((item) => item.id === 'contact'), {
      id: 'contact', sitemapKey: 'page', sitemapPath: '/page-sitemap.xml', label: 'Contact', path: '/contact', enabled: false, included: 0, management: 'code',
    });
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('source enablement does not override entry noindex, redirects or canonical safety', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({
      services: [
        { title: 'Noindex', slug: 'noindex', seo: { no_index: true } },
        { title: 'Redirect source', slug: 'redirect-source', seo: {} },
        { title: 'External canonical', slug: 'external', seo: { canonical_url: 'https://other.example/page' } },
      ],
      redirects: [{ source_path: '/services/redirect-source', destination_path: '/services/final', is_active: true }],
      contentTypes: { 'api::service.service': true },
    }));
    assert.equal(report.items.filter((item) => item.contentType === 'Services').length, 0);
    assert.ok(report.excluded.some((item) => item.path === '/services/noindex' && item.reason === 'Noindex is enabled'));
    assert.ok(report.excluded.some((item) => item.path === '/services/redirect-source' && item.reason === 'URL is an active redirect source'));
    assert.ok(report.excluded.some((item) => item.path === '/services/external' && item.reason === 'Canonical URL points outside the configured site'));
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('unknown saved source toggles are surfaced instead of silently rewriting route definitions', async () => {
  const previousOrigin = process.env.NEXT_PUBLIC_SERVER_URL;
  const previousIndexing = process.env.SITE_INDEXING_ENABLED;
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://clinic.example';
  process.env.SITE_INDEXING_ENABLED = 'true';
  try {
    const report = await getSitemapReport(createStrapiFixture({ contentTypes: { 'api::removed.removed': false } }));
    assert.ok(report.issues.some((item) => item.code === 'SITEMAP_CONFIG_UNKNOWN_CONTENT_TYPE'));
    assert.equal(report.policy.contentTypes['api::removed.removed'], false);
  } finally {
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousOrigin;
    if (previousIndexing === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = previousIndexing;
  }
});

test('exposes only public robots directives from the CMS source', async () => {
  const config = await getRobotsConfiguration(createStrapiFixture({ indexingEnabled: false }));
  assert.equal(config.indexingEnabled, false);
  assert.deepEqual(config.rules, []);
  assert.equal(config.additionalDirectives, '');
});
