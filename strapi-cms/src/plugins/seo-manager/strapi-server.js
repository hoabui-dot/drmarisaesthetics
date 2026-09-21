'use strict';

const { analyzeSeoHealth, paginateIssues } = require('./server/health/analyzer');
const path = require('node:path');
const { getSitemapReport } = require(path.resolve(process.cwd(), 'src/lib/sitemap.js'));

const HEALTH_PERMISSION = 'plugin::seo-manager.health';
const SITEMAP_PERMISSION = 'plugin::seo-manager.sitemap';
const CACHE_TTL_MS = 30_000;
const PAGE_SIZE = 100;
const MAX_PAGES_PER_QUERY = 50;
let snapshot = null;
let snapshotCreatedAt = 0;

const CONTENT_MODELS = [
  {
    uid: 'api::page.page', label: 'Page', kind: 'collection', path: (item) => item.slug ? `/${item.slug}` : '',
    fields: ['title', 'slug', 'description', 'publishDate', 'publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] }, cover: true }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: true, pageSeoConsumed: true,
  },
  {
    uid: 'api::blog.blog', label: 'Blog', kind: 'collection', path: (item) => item.slug ? `/news/${item.slug}` : '',
    fields: ['title', 'slug', 'metaDescription', 'publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] }, coverImage: true }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: true, pageSeoConsumed: true,
  },
  {
    uid: 'api::service.service', label: 'Service', kind: 'collection', path: (item) => item.slug ? `/services/${item.slug}` : '',
    fields: ['title', 'slug', 'metaDescription', 'publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] }, coverImage: true }, canonicalSupported: false,
    sitemapSupported: true, structuredDataGenerated: false, pageSeoConsumed: false, globalImageFallback: false,
  },
  {
    uid: 'api::homepage.homepage', label: 'Homepage', kind: 'single', path: () => '/', fields: ['title', 'publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] }, metadata_image: true }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: true, auditMetadata: false,
  },
  {
    uid: 'api::about-page.about-page', label: 'About Us', kind: 'single', path: () => '/about-us', fields: ['publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] } }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: true, auditMetadata: false,
  },
  {
    uid: 'api::contact-page.contact-page', label: 'Contact', kind: 'single', path: () => '/contact', fields: ['title', 'description', 'publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] } }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: true, auditMetadata: false,
  },
  {
    uid: 'api::treatments-page.treatments-page', label: 'Treatments', kind: 'single', path: () => '/treatments', fields: ['publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] } }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: false, auditMetadata: false,
  },
  {
    uid: 'api::our-team.our-team', label: 'Dr. Huy', kind: 'single', path: () => '/our-team/dr-huy', fields: ['publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] } }, canonicalSupported: true,
    sitemapSupported: true, structuredDataGenerated: true, auditMetadata: false,
  },
  {
    uid: 'api::deep-plane-facelift-specialist.deep-plane-facelift-specialist', label: 'Dr. Cuong', kind: 'single',
    path: () => '/our-team/dr-cuong', fields: ['seo_title', 'seo_description', 'publishedAt', 'updatedAt'],
    populate: { seo: { populate: ['meta_image'] } }, canonicalSupported: false, sitemapSupported: true,
    structuredDataGenerated: false, globalImageFallback: false,
  },
];

function adminEditUrl(uid, kind, documentId, locale) {
  const target = kind === 'single'
    ? `/content-manager/single-types/${uid}`
    : documentId ? `/content-manager/collection-types/${uid}/${encodeURIComponent(documentId)}` : '';
  if (!target) return undefined;
  return locale ? `${target}?plugins[i18n][locale]=${encodeURIComponent(locale)}` : target;
}

async function getLocales(strapi) {
  const configuredDefault = strapi.config.get('plugin.i18n.config.defaultLocale');
  try {
    const locales = await strapi.plugin('i18n').service('locales').find();
    if (Array.isArray(locales) && locales.length) {
      const codes = locales.map((locale) => locale.code).filter(Boolean);
      if (configuredDefault && codes.includes(configuredDefault)) return [configuredDefault, ...codes.filter((code) => code !== configuredDefault)];
      if (codes.length) return codes;
    }
  } catch (error) {
    strapi.log.warn(`[seo-manager] locale discovery failed; using Strapi default locale (${error instanceof Error ? error.message : 'unknown error'})`);
  }
  return [strapi.config.get('plugin.i18n.config.defaultLocale') || 'en'];
}

async function findAllDocuments(strapi, uid, params) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES_PER_QUERY; page += 1) {
    const batch = await strapi.documents(uid).findMany({
      ...params,
      pagination: { page, pageSize: PAGE_SIZE },
    });
    if (!Array.isArray(batch) || batch.length === 0) break;
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return rows;
}

async function findContentDocuments(strapi, locales) {
  const published = [];
  const drafts = [];
  for (const model of CONTENT_MODELS) {
    for (const locale of locales) {
      const base = { locale, fields: model.fields, populate: model.populate };
      const query = model.kind === 'single'
        ? async (status) => {
          const row = await strapi.documents(model.uid).findFirst({ ...base, status });
          return row ? [row] : [];
        }
        : async (status) => findAllDocuments(strapi, model.uid, { ...base, status });

      let publishedRows = [];
      try { publishedRows = await query('published'); }
      catch (error) {
        strapi.log.warn(`[seo-manager] published content query failed uid=${model.uid} locale=${locale}: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
      for (const item of publishedRows) {
        const path = model.path(item);
        if (!path) continue;
        published.push({
          ...item,
          uid: model.uid,
          contentTypeLabel: model.label,
          kind: model.kind,
          path,
          locale: item.locale || locale,
          isDefaultLocale: (item.locale || locale) === locales[0],
          isSitemapLocale: (item.locale || locale) === locales[0],
          canonicalSupported: model.canonicalSupported,
          sitemapSupported: model.sitemapSupported,
          structuredDataGenerated: model.structuredDataGenerated,
          pageSeoConsumed: model.pageSeoConsumed === true,
          structuredDataOverridesConsumed: model.pageSeoConsumed === true,
          globalImageFallback: model.globalImageFallback !== false,
          auditMetadata: model.auditMetadata !== false,
          adminEditUrl: adminEditUrl(model.uid, model.kind, item.documentId, item.locale || locale),
        });
      }

      let draftRows = [];
      try { draftRows = await query('draft'); }
      catch (error) {
        strapi.log.warn(`[seo-manager] draft route check skipped uid=${model.uid} locale=${locale}: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
      for (const item of draftRows) {
        const path = model.path(item);
        if (path) drafts.push({ path, uid: model.uid, locale: item.locale || locale });
      }
    }
  }
  return { published, drafts };
}

async function findSingle(strapi, uid, locale, populate = {}) {
  try {
    return await strapi.documents(uid).findFirst({ status: 'published', locale, populate }) || {};
  } catch (error) {
    strapi.log.warn(`[seo-manager] settings query failed uid=${uid}: ${error instanceof Error ? error.message : 'unknown error'}`);
    return {};
  }
}

async function findRules(strapi, uid) {
  try { return await findAllDocuments(strapi, uid, { status: 'published', sort: ['source_path:asc'] }); }
  catch (error) {
    strapi.log.error(`[seo-manager] SEO rules query failed uid=${uid}: ${error instanceof Error ? error.message : 'unknown error'}`);
    return [];
  }
}

async function createSnapshot(strapi) {
  const locales = await getLocales(strapi);
  const defaultLocale = locales[0];
  const [{ published, drafts }, globalSettings, robots, websiteSettings, redirects, canonicalRules] = await Promise.all([
    findContentDocuments(strapi, locales),
    findSingle(strapi, 'api::seo-manager-settings.seo-manager-settings', defaultLocale),
    findSingle(strapi, 'api::robots-settings.robots-settings', defaultLocale, { rules: true }),
    findSingle(strapi, 'api::website-setting.website-setting', defaultLocale, { default_open_graph_image: true }),
    findRules(strapi, 'api::redirect.redirect'),
    findRules(strapi, 'api::canonical-rule.canonical-rule'),
  ]);
  const sitemapReport = await getSitemapReport(strapi);
  const staticSitemapPaths = Object.fromEntries(sitemapReport.staticRoutes.map((route) => [route.path, route.enabled]));
  const audit = analyzeSeoHealth({
    documents: published,
    draftDocuments: drafts,
    globalSettings,
    robots,
    globalOpenGraphImage: websiteSettings.default_open_graph_image,
    redirects,
    canonicalRules,
    publicOrigin: strapi.config.get('server.url'),
    sitemapPolicy: { contentTypes: sitemapReport.policy.contentTypes, staticPaths: staticSitemapPaths },
  });
  const sitemapStats = audit.categories.sitemap;
  for (const finding of sitemapReport.issues) {
    if (audit.issues.some((existing) => existing.code === finding.code && existing.path === finding.path)) continue;
    const normalized = {
      id: `${finding.code}:${String(finding.path || 'site').replace(/[^a-zA-Z0-9_-]/g, '-')}`,
      category: 'sitemap',
      contentType: 'Sitemap',
      field: 'sitemap',
      status: 'open',
      ...finding,
    };
    audit.issues.push(normalized);
    if (finding.severity === 'critical') {
      audit.summary.critical += 1;
      sitemapStats.critical += 1;
    } else if (finding.severity === 'recommendation') {
      audit.summary.recommendations += 1;
      sitemapStats.recommendation += 1;
    } else {
      audit.summary.warnings += 1;
      sitemapStats.warning += 1;
    }
  }
  if (!sitemapReport.issues.length) {
    audit.summary.passed += 1;
    sitemapStats.passed += 1;
  }
  audit.summary.sitemapExpected = sitemapReport.summary.included;
  audit.summary.sitemapExcluded = sitemapReport.summary.excluded;
  const categoryTotal = sitemapStats.passed + sitemapStats.critical + sitemapStats.warning + sitemapStats.recommendation;
  const categoryPenalty = sitemapStats.critical * 10 + sitemapStats.warning * 3 + sitemapStats.recommendation;
  sitemapStats.issues = sitemapStats.critical + sitemapStats.warning + sitemapStats.recommendation;
  sitemapStats.score = categoryTotal ? Math.max(0, Math.round(100 * (1 - categoryPenalty / (categoryTotal * 10)))) : null;
  const totalChecks = audit.summary.passed + audit.issues.length;
  const penalty = audit.issues.reduce((sum, issue) => sum + ({ critical: 10, warning: 3, recommendation: 1 }[issue.severity] || 0), 0);
  audit.score = totalChecks ? Math.max(0, Math.round(100 * (1 - penalty / (totalChecks * 10)))) : 100;
  return audit;
}

async function getSnapshot(strapi, refresh) {
  if (refresh || !snapshot || Date.now() - snapshotCreatedAt > CACHE_TTL_MS) {
    snapshot = await createSnapshot(strapi);
    snapshotCreatedAt = Date.now();
  }
  return snapshot;
}

module.exports = {
  register({ strapi }) {
    strapi.admin.services.permission.actionProvider.register({
      section: 'plugins',
      displayName: 'View SEO Health Dashboard',
      uid: 'health',
      subCategory: 'seo-manager',
      pluginName: 'seo-manager',
    });
    strapi.admin.services.permission.actionProvider.register({
      section: 'plugins',
      displayName: 'View Sitemap Diagnostics',
      uid: 'sitemap',
      subCategory: 'seo-manager',
      pluginName: 'seo-manager',
    });
  },
  controllers: {
    health: {
      async find(ctx) {
        try {
          const refresh = ctx.query.refresh === 'true';
          const result = await getSnapshot(strapi, refresh);
          const paged = paginateIssues(result.issues, ctx.query);
          ctx.body = {
            data: {
              score: result.score,
              summary: result.summary,
              categories: result.categories,
              generatedAt: result.generatedAt,
              methodology: result.methodology,
              issues: paged.items,
              pagination: paged.pagination,
              filters: {
                locales: [...new Set([...result.filters.locales, ...result.issues.map((issue) => issue.locale).filter(Boolean)])],
                contentTypes: [...new Set([...result.filters.contentTypes, ...result.issues.map((issue) => issue.contentType).filter(Boolean)])],
              },
            },
          };
        } catch (error) {
          strapi.log.error(`[seo-manager] health analysis failed: ${error instanceof Error ? error.message : 'unknown error'}`);
          ctx.internalServerError('SEO health analysis could not be completed. Retry the audit or check Strapi logs.');
        }
      },
    },
    sitemap: {
      async find(ctx) {
        try {
          ctx.body = { data: await getSitemapReport(strapi) };
        } catch (error) {
          strapi.log.error(`[seo-manager] sitemap report failed: ${error instanceof Error ? error.message : 'unknown error'}`);
          ctx.internalServerError('Sitemap diagnostics could not be completed.');
        }
      },
      async revalidate(ctx) {
        const configuredFrontend = process.env.NEXTJS_URL || process.env.FRONTEND_URL;
        const secret = process.env.STRAPI_WEBHOOK_SECRET;
        if (!configuredFrontend || !secret) {
          strapi.log.error('[seo-manager] sitemap revalidation requires NEXTJS_URL/FRONTEND_URL and STRAPI_WEBHOOK_SECRET.');
          ctx.status = 503;
          ctx.body = { error: { message: 'Sitemap revalidation is not configured.' } };
          return;
        }
        try {
          const frontend = new URL(configuredFrontend);
          if (!['http:', 'https:'].includes(frontend.protocol)) throw new Error('Frontend URL must use HTTP or HTTPS.');
          const response = await fetch(new URL('/api/revalidate', frontend), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-strapi-secret': secret },
            body: JSON.stringify({ event: 'entry.update', model: 'seo-manager-settings', entry: {} }),
            signal: AbortSignal.timeout(10_000),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.revalidated !== true || (Array.isArray(result.errors) && result.errors.length)) {
            strapi.log.warn(`[seo-manager] sitemap revalidation returned status=${response.status}; partialErrors=${Array.isArray(result.errors) ? result.errors.length : 0}`);
            ctx.status = 502;
            ctx.body = { error: { message: 'Sitemap settings were saved, but frontend cache revalidation did not complete. The existing cached sitemap remains available.' } };
            return;
          }
          ctx.body = { data: { revalidated: true, paths: result.paths || [], tags: result.tags || [] } };
        } catch (error) {
          strapi.log.error(`[seo-manager] sitemap revalidation failed: ${error instanceof Error ? error.message : 'unknown error'}`);
          ctx.status = 502;
          ctx.body = { error: { message: 'Sitemap settings were saved, but frontend cache revalidation failed. The existing cached sitemap remains available.' } };
        }
      },
    },
  },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        {
          method: 'GET',
          path: '/sitemap',
          handler: 'sitemap.find',
          config: { policies: [{ name: 'admin::hasPermissions', config: { actions: [SITEMAP_PERMISSION] } }] },
        },
        {
          method: 'POST',
          path: '/sitemap/revalidate',
          handler: 'sitemap.revalidate',
          config: { policies: [{ name: 'admin::hasPermissions', config: { actions: [SITEMAP_PERMISSION] } }] },
        },
        {
          method: 'GET',
          path: '/health',
          handler: 'health.find',
          config: { policies: [{ name: 'admin::hasPermissions', config: { actions: [HEALTH_PERMISSION] } }] },
        },
      ],
    },
  },
};
