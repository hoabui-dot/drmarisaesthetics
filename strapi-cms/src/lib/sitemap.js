'use strict';

const DEFAULT_LOCALE = 'en';
const PAGE_SIZE = 100;
const MAX_PAGES = 100;
const RETIRED_STATIC_ROUTE_IDS = new Set(['sitemap']);

// Public sitemap filenames are developer-owned. These descriptors are shared
// by the API and Sitemap Manager; content editors can only control inclusion.
const SITEMAP_GROUPS = [
  { key: 'service', label: 'Services', path: '/service-sitemap.xml' },
  { key: 'news', label: 'News', path: '/news-sitemap.xml' },
  { key: 'page', label: 'Pages', path: '/page-sitemap.xml' },
];

// This registry is the single source for CMS-to-frontend route identity.
// Keep it aligned with the actual Next.js route tree when adding a new route.
const STATIC_ROUTES = [
  { id: 'home', path: '/', label: 'Home', group: 'Pages', sitemapKey: 'page', uid: 'api::homepage.homepage', kind: 'single' },
  { id: 'about-us', path: '/about-us', label: 'About Us', group: 'Pages', sitemapKey: 'page', uid: 'api::about-page.about-page', kind: 'single' },
  { id: 'contact', path: '/contact', label: 'Contact', group: 'Pages', sitemapKey: 'page', uid: 'api::contact-page.contact-page', kind: 'single' },
  { id: 'our-team', path: '/our-team/dr-huy', label: 'Dr. Huy', group: 'Our Doctors', sitemapKey: 'page', uid: 'api::our-team.our-team', kind: 'single' },
  { id: 'results', path: '/results', label: 'Patient Results', group: 'Patient Resources', sitemapKey: 'page', uid: 'api::result.result', kind: 'single', hasSeo: false },
  { id: 'treatments', path: '/treatments', label: 'Treatments', sitemapKey: 'page', uid: 'api::treatments-page.treatments-page', kind: 'single' },
  { id: 'deep-plane-facelift-specialist', path: '/our-team/dr-cuong', label: 'Dr. Cuong', group: 'Our Doctors', sitemapKey: 'page', uid: 'api::deep-plane-facelift-specialist.deep-plane-facelift-specialist', kind: 'single', hasSeo: false },
  { id: 'services', path: '/services', label: 'Services', group: 'Services', sitemapKey: 'page', kind: 'static' },
  { id: 'news', path: '/news', label: 'News', group: 'Resources', sitemapKey: 'page', kind: 'static' },
];

const COLLECTION_ROUTES = [
  { uid: 'api::service.service', sitemapKey: 'service', label: 'Services', singularLabel: 'Service', group: 'Services', prefix: '/services', routePattern: '/services/:slug', slugField: 'slug', fields: ['title', 'slug', 'updatedAt', 'publishedAt', 'locale'], populate: { seo: true } },
  { uid: 'api::blog.blog', sitemapKey: 'news', label: 'News', singularLabel: 'News article', group: 'News', prefix: '/news', routePattern: '/news/:slug', slugField: 'slug', fields: ['title', 'slug', 'updatedAt', 'publishedAt', 'locale'], populate: { seo: true } },
  { uid: 'api::page.page', sitemapKey: 'page', label: 'Pages', singularLabel: 'Page', group: 'Pages', prefix: '', routePattern: '/:slug', slugField: 'slug', fields: ['title', 'slug', 'updatedAt', 'publishedAt', 'locale'], populate: { seo: true } },
];

function enabledByConfig(config, key) {
  return !config || typeof config !== 'object' || Array.isArray(config) || config[key] !== false;
}

function getSourceConfiguration(settings) {
  const contentTypes = settings?.sitemap_content_types;
  const staticRoutes = settings?.sitemap_static_routes;
  return {
    contentTypes: contentTypes && typeof contentTypes === 'object' && !Array.isArray(contentTypes) ? contentTypes : {},
    staticRoutes: staticRoutes && typeof staticRoutes === 'object' && !Array.isArray(staticRoutes) ? staticRoutes : {},
  };
}

const cleanPath = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  const path = `/${value.trim()}`.replace(/\/{2,}/g, '/').split(/[?#]/, 1)[0];
  return path.length > 1 ? path.replace(/\/$/, '') : '/';
};

function getPublicOrigin() {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.FRONTEND_URL;
  if (!configured) {
    if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000';
    throw new Error('NEXT_PUBLIC_SERVER_URL or FRONTEND_URL is required for sitemap generation.');
  }
  const url = new URL(configured);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Sitemap site URL must use HTTP or HTTPS.');
  return url.origin;
}

function indexingAllowed() {
  if (process.env.SITE_INDEXING_ENABLED === undefined) return process.env.NODE_ENV === 'production';
  return !['false', '0', 'no', 'off'].includes(process.env.SITE_INDEXING_ENABLED.toLowerCase());
}

async function getLocales(strapi) {
  try {
    const locales = await strapi.plugin('i18n').service('locales').find();
    const codes = Array.isArray(locales) ? locales.map((locale) => locale.code).filter(Boolean) : [];
    if (codes.length) {
      const configuredDefault = strapi.config.get('plugin.i18n.config.defaultLocale');
      return { defaultLocale: codes.includes(configuredDefault) ? configuredDefault : codes[0], locales: codes };
    }
  } catch (error) {
    strapi.log.warn(`[sitemap] Locale lookup failed; using the configured default locale: ${error.message}`);
  }
  return { defaultLocale: strapi.config.get('plugin.i18n.config.defaultLocale') || DEFAULT_LOCALE, locales: [strapi.config.get('plugin.i18n.config.defaultLocale') || DEFAULT_LOCALE] };
}

async function findMany(strapi, uid, query) {
  const entries = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await strapi.documents(uid).findMany({
      ...query,
      pagination: { page, pageSize: PAGE_SIZE },
    });
    if (!Array.isArray(batch) || batch.length === 0) break;
    entries.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return entries;
}

async function findSingle(strapi, uid, locale, populate = {}, status = 'published') {
  try {
    return await strapi.documents(uid).findFirst({ status, locale, populate });
  } catch (error) {
    strapi.log.warn(`[sitemap] Could not resolve published route uid=${uid} locale=${locale}: ${error.message}`);
    return null;
  }
}

async function findRules(strapi, uid, fields) {
  try {
    return await findMany(strapi, uid, { status: 'published', fields });
  } catch (error) {
    strapi.log.error(`[sitemap] Could not load ${uid}: ${error.message}`);
    return [];
  }
}

function canonicalFor(entry, path, canonicalRules, origin) {
  const seo = entry?.seo || {};
  const explicit = typeof seo.canonical_url === 'string' ? seo.canonical_url.trim() : '';
  const rule = canonicalRules.get(path);
  const value = explicit || rule || '';
  if (!value) return `${origin}${path}`;
  try {
    const target = new URL(value, origin);
    if (!['http:', 'https:'].includes(target.protocol)) return null;
    if (target.search || target.hash) return null;
    target.pathname = cleanPath(target.pathname);
    return target.href;
  } catch {
    return null;
  }
}

function canonicalPath(url, origin) {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== origin) return null;
    return cleanPath(parsed.pathname);
  } catch {
    return null;
  }
}

function reasonFor(entry, path, canonical, origin, settings, robots, redirectSources, sourceEnabled) {
  if (!indexingAllowed()) return 'Search indexing is disabled for this deployment';
  if (settings?.sitemap_enabled === false) return 'Sitemap disabled in SEO settings';
  if (!sourceEnabled) return 'Sitemap source disabled in SEO Manager';
  if (robots?.indexing_enabled === false) return 'Site indexing disabled in robots settings';
  if (entry?.seo?.include_in_sitemap === false) return 'Excluded by entry SEO setting';
  if (entry?.no_index === true || entry?.seo?.no_index === true) return 'Noindex is enabled';
  if (!canonical) return 'Canonical URL is invalid';
  if (new URL(canonical).origin !== origin) return 'Canonical URL points outside the configured site';
  const finalPath = canonicalPath(canonical, origin);
  if (!finalPath) return 'Canonical URL is invalid';
  if (redirectSources.has(path) || redirectSources.has(finalPath)) return 'URL is an active redirect source';
  return '';
}

function issue(code, severity, title, path, description) {
  return { code, severity, title, path, description };
}

function adminEditUrl(candidate) {
  const uid = candidate.uid;
  if (!uid) return undefined;
  const locale = encodeURIComponent(candidate.locale || 'en');
  if (candidate.kind === 'single') return `/content-manager/single-types/${uid}?plugins[i18n][locale]=${locale}`;
  if (candidate.kind === 'collection' && candidate.entry?.documentId) {
    return `/content-manager/collection-types/${uid}/${encodeURIComponent(candidate.entry.documentId)}?plugins[i18n][locale]=${locale}`;
  }
  return undefined;
}

async function getSitemapReport(strapi) {
  const origin = getPublicOrigin();
  const { defaultLocale, locales } = await getLocales(strapi);
  const [settings, robots, redirects, canonicalRows] = await Promise.all([
    findSingle(strapi, 'api::seo-manager-settings.seo-manager-settings', defaultLocale),
    findSingle(strapi, 'api::robots-settings.robots-settings', defaultLocale, { rules: true }),
    findRules(strapi, 'api::redirect.redirect', ['source_path', 'destination_path', 'is_active']),
    findRules(strapi, 'api::canonical-rule.canonical-rule', ['source_path', 'canonical_url', 'is_active']),
  ]);
  const sourceConfig = getSourceConfiguration(settings);

  const canonicalRules = new Map(canonicalRows.filter((row) => row.is_active !== false && row.source_path && row.canonical_url).map((row) => [cleanPath(row.source_path), row.canonical_url]));
  const activeRedirects = redirects.filter((row) => row.is_active !== false);
  const redirectSources = new Set(activeRedirects.map((row) => cleanPath(row.source_path)).filter(Boolean));
  const items = [];
  const excluded = [];
  const issues = [];
  const candidatePaths = new Set();
  const canonicalOwners = new Map();
  const eligibleCanonicalPaths = new Set();
  const canonicalReferences = [];
  const sourceCounts = new Map();
  const knownContentTypes = new Set(COLLECTION_ROUTES.map((model) => model.uid));
  const knownStaticRoutes = new Set(STATIC_ROUTES.map((route) => route.id));
  for (const uid of Object.keys(sourceConfig.contentTypes)) {
    if (!knownContentTypes.has(uid)) issues.push(issue('SITEMAP_CONFIG_UNKNOWN_CONTENT_TYPE', 'warning', 'Unknown sitemap content type configuration', '/', `The saved sitemap policy references ${uid}, which has no route mapping in the application.`));
  }
  for (const id of Object.keys(sourceConfig.staticRoutes)) {
    if (RETIRED_STATIC_ROUTE_IDS.has(id)) continue;
    if (!knownStaticRoutes.has(id)) issues.push(issue('SITEMAP_CONFIG_UNKNOWN_STATIC_ROUTE', 'warning', 'Unknown sitemap static route configuration', '/', `The saved sitemap policy references ${id}, which is not present in the application route registry.`));
  }

  const addCandidate = (candidate) => {
    const path = cleanPath(candidate.path);
    if (!path || candidatePaths.has(path)) {
      issues.push(issue('SITEMAP_DUPLICATE_ROUTE', 'critical', 'Duplicate sitemap route', path || candidate.path, 'More than one sitemap source resolves to this frontend route.'));
      return;
    }
    candidatePaths.add(path);
    const canonical = canonicalFor(candidate.entry, path, canonicalRules, origin);
    const sourceEnabled = candidate.sourceCategory === 'static'
      ? enabledByConfig(sourceConfig.staticRoutes, candidate.sourceKey)
      : candidate.sourceCategory === 'collection'
        ? enabledByConfig(sourceConfig.contentTypes, candidate.sourceKey)
        : true;
    const exclusionReason = reasonFor(candidate.entry, path, canonical, origin, settings, robots, redirectSources, sourceEnabled);
    if (exclusionReason) {
      excluded.push({ path, label: candidate.label, contentType: candidate.contentType, locale: candidate.locale || defaultLocale, reason: exclusionReason });
      if (exclusionReason === 'Canonical URL is invalid' || exclusionReason === 'Canonical URL points outside the configured site') {
        issues.push(issue('SITEMAP_CANONICAL_INVALID', 'critical', exclusionReason, path, 'Sitemap entries must use a valid canonical URL on the configured public origin.'));
      } else if (exclusionReason === 'URL is an active redirect source') {
        issues.push(issue('SITEMAP_REDIRECT_SOURCE', 'warning', 'Redirect source excluded from sitemap', path, 'The URL is an active redirect source; only its final destination should be indexed.'));
      }
      return;
    }
    const finalPath = canonicalPath(canonical, origin);
    if (finalPath !== path) {
      excluded.push({ path, label: candidate.label, contentType: candidate.contentType, locale: candidate.locale || defaultLocale, reason: `Canonical points to ${finalPath}` });
      canonicalReferences.push({ path, target: finalPath });
      return;
    }
    eligibleCanonicalPaths.add(finalPath);
    if (canonicalOwners.has(canonical)) {
      issues.push(issue('SITEMAP_DUPLICATE_CANONICAL', 'critical', 'Duplicate canonical URL', path, `This URL shares a canonical target with ${canonicalOwners.get(canonical)}.`));
      excluded.push({ path, label: candidate.label, contentType: candidate.contentType, locale: candidate.locale || defaultLocale, reason: 'Duplicate canonical URL' });
      return;
    }
    canonicalOwners.set(canonical, path);
    if (!candidate.entry?.updatedAt && candidate.entry) issues.push(issue('SITEMAP_LASTMOD_MISSING', 'recommendation', 'Last modified date is unavailable', path, 'No meaningful updatedAt or publishedAt date is available for this record.'));
    const date = candidate.entry?.updatedAt || candidate.entry?.publishedAt;
    items.push({
      url: canonical,
      path: canonicalPath(canonical, origin),
      sitemapKey: candidate.sitemapKey,
      label: candidate.label || candidate.entry?.title || candidate.entry?.slug || path,
      group: candidate.group || SITEMAP_GROUPS.find((group) => group.key === candidate.sitemapKey)?.label || 'Pages',
      contentType: candidate.contentType,
      locale: candidate.locale || defaultLocale,
      lastModified: date && !Number.isNaN(new Date(date).getTime()) ? new Date(date).toISOString() : undefined,
      // This report contains only URLs that passed every sitemap inclusion
      // rule. Keep the admin status explicit; the public API maps a safe DTO.
      sitemapIncluded: true,
      adminEditUrl: adminEditUrl(candidate),
    });
    if (candidate.sourceKey) sourceCounts.set(candidate.sourceKey, (sourceCounts.get(candidate.sourceKey) || 0) + 1);
  };

  // The frontend has one route set today. Keep locale identity in the DTO,
  // but do not emit duplicate locale URLs until the frontend route tree has
  // localized URL prefixes and matching hreflang output.
  for (const route of STATIC_ROUTES) {
    const entry = route.uid ? await findSingle(strapi, route.uid, defaultLocale, route.hasSeo === false ? {} : { seo: true }) : null;
    if (route.uid && !entry) {
      const draft = await findSingle(strapi, route.uid, defaultLocale, {}, 'draft');
      excluded.push({ path: route.path, label: route.label, contentType: route.uid, locale: defaultLocale, reason: draft ? 'Draft is not published' : 'No published CMS document exists for this route' });
      if (!draft) issues.push(issue('SITEMAP_STATIC_CONTENT_UNPUBLISHED', 'warning', 'Published content is missing for a CMS-backed route', route.path, `${route.label} has no published document in the default locale.`));
      continue;
    }
    await addCandidate({ ...route, path: route.path, sourceKey: route.id, sourceCategory: 'static', entry, contentType: route.uid || 'Frontend route', locale: defaultLocale });
  }

  for (const model of COLLECTION_ROUTES) {
    for (const locale of locales) {
      // Localized content without localized frontend URLs must not create
      // duplicate <loc> values. The DTO remains locale-aware for future routes.
      if (locale !== defaultLocale) continue;
      let rows = [];
      try {
        rows = await findMany(strapi, model.uid, { status: 'published', locale, fields: model.fields, populate: model.populate, sort: ['updatedAt:desc'] });
      } catch (error) {
        strapi.log.error(`[sitemap] Collection query failed uid=${model.uid} locale=${locale}: ${error.message}`);
        issues.push(issue('SITEMAP_SOURCE_UNAVAILABLE', 'warning', 'Sitemap content source could not be read', model.prefix || '/', `Could not read ${model.label} entries from Strapi.`));
      }
      for (const entry of rows) {
        if (!entry.slug) {
          issues.push(issue('SITEMAP_SLUG_MISSING', 'critical', 'Published entry has no route slug', model.prefix || '/', `${model.label} is published but has no slug.`));
          continue;
        }
        await addCandidate({
          path: `${model.prefix}/${encodeURIComponent(entry.slug)}`,
          entry,
          label: entry.title || entry.slug,
          group: model.group,
          sitemapKey: model.sitemapKey,
          contentType: model.singularLabel,
          locale,
          kind: 'collection',
          sourceKey: model.uid,
          sourceCategory: 'collection',
          uid: model.uid,
        });
      }
      try {
        const drafts = await findMany(strapi, model.uid, { status: 'draft', locale, fields: model.fields });
        const publishedSlugs = new Set(rows.map((entry) => entry.slug).filter(Boolean));
        for (const draft of drafts) {
          if (!draft.slug || publishedSlugs.has(draft.slug)) continue;
          excluded.push({
            path: `${model.prefix}/${encodeURIComponent(draft.slug)}`,
            label: draft.title || draft.slug,
            contentType: model.label,
            locale,
            reason: 'Draft is not published',
          });
        }
      } catch (error) {
        strapi.log.warn(`[sitemap] Draft exclusion diagnostics skipped uid=${model.uid} locale=${locale}: ${error.message}`);
      }
    }
  }

  // Report active redirect records that are not already associated with a
  // public route, as they may be stale or missing an explicit destination.
  for (const redirect of activeRedirects) {
    const source = cleanPath(redirect.source_path);
    if (!source || !redirect.destination_path) issues.push(issue('SITEMAP_REDIRECT_INVALID', 'critical', 'Active redirect is incomplete', source, 'Provide a valid source and destination path.'));
  }

  for (const reference of canonicalReferences) {
    if (!eligibleCanonicalPaths.has(reference.target)) {
      issues.push(issue('SITEMAP_CANONICAL_TARGET_MISSING', 'critical', 'Canonical target is not an eligible published sitemap URL', reference.path, `The canonical target ${reference.target} is not present as a published, indexable route.`));
    }
  }

  const redirectMap = new Map();
  for (const redirect of activeRedirects) {
    const source = cleanPath(redirect.source_path);
    const destinationValue = typeof redirect.destination_path === 'string' ? redirect.destination_path.trim() : '';
    const destination = destinationValue.startsWith('/') && !destinationValue.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(destinationValue)
      ? cleanPath(destinationValue)
      : '';
    if (!source || !destination) continue;
    if (!redirectMap.has(source)) redirectMap.set(source, []);
    redirectMap.get(source).push(destination);
  }
  const reportedRedirectProblems = new Set();
  for (const [source, destinations] of redirectMap) {
    if (destinations.length > 1) {
      reportedRedirectProblems.add(source);
      issues.push(issue('SITEMAP_REDIRECT_DUPLICATE_SOURCE', 'critical', 'Multiple active redirects share a source', source, `${destinations.length} active redirect rules have the same source path.`));
    }
    const path = [];
    const positions = new Map();
    let current = source;
    while (redirectMap.has(current) && redirectMap.get(current).length) {
      if (positions.has(current)) {
        const cycle = path.slice(positions.get(current));
        const cycleKey = [...cycle].sort().join('|');
        if (!reportedRedirectProblems.has(cycleKey)) {
          reportedRedirectProblems.add(cycleKey);
          issues.push(issue('SITEMAP_REDIRECT_LOOP', 'critical', 'Redirect loop detected', source, `Active redirects form a loop: ${cycle.join(' → ')} → ${cycle[0]}.`));
        }
        break;
      }
      positions.set(current, path.length);
      path.push(current);
      current = redirectMap.get(current)[0];
      if (path.length > 20) break;
    }
    if (path.length > 1 && !redirectMap.has(current)) {
      const chainKey = `chain:${source}`;
      if (!reportedRedirectProblems.has(chainKey)) {
        reportedRedirectProblems.add(chainKey);
        issues.push(issue('SITEMAP_REDIRECT_CHAIN', 'warning', 'Redirect chain detected', source, `Resolve this chain directly to its final destination: ${[...path, current].join(' → ')}.`));
      }
    }
  }

  items.sort((left, right) => (left.group || '').localeCompare(right.group || '') || left.path.localeCompare(right.path));
  const generatedAt = new Date().toISOString();
  const sitemapGroups = SITEMAP_GROUPS.map((group) => {
    const groupItems = items.filter((item) => item.sitemapKey === group.key);
    const lastModified = groupItems.reduce((latest, item) => item.lastModified && (!latest || item.lastModified > latest) ? item.lastModified : latest, undefined);
    return { ...group, enabled: groupItems.length > 0, urlCount: groupItems.length, ...(lastModified ? { lastModified } : {}) };
  });
  return {
    generatedAt,
    origin,
    enabled: indexingAllowed() && settings?.sitemap_enabled !== false && robots?.indexing_enabled !== false,
    locale: defaultLocale,
    locales,
    items,
    sitemapGroups,
    excluded,
    issues,
    summary: {
      total: items.length + excluded.length,
      included: items.length,
      excluded: excluded.length,
      critical: issues.filter((entry) => entry.severity === 'critical').length,
      warnings: issues.filter((entry) => entry.severity === 'warning').length,
      recommendations: issues.filter((entry) => entry.severity === 'recommendation').length,
    },
    contentTypes: COLLECTION_ROUTES.map((model) => ({
      uid: model.uid,
      sitemapKey: model.sitemapKey,
      sitemapPath: SITEMAP_GROUPS.find((group) => group.key === model.sitemapKey)?.path,
      label: model.label,
      routePattern: model.routePattern,
      slugField: model.slugField,
      enabled: enabledByConfig(sourceConfig.contentTypes, model.uid),
      included: sourceCounts.get(model.uid) || 0,
      management: 'code',
    })),
    staticRoutes: STATIC_ROUTES.map((route) => ({
      id: route.id,
      sitemapKey: route.sitemapKey,
      sitemapPath: SITEMAP_GROUPS.find((group) => group.key === route.sitemapKey)?.path,
      label: route.label,
      path: route.path,
      enabled: enabledByConfig(sourceConfig.staticRoutes, route.id),
      included: sourceCounts.get(route.id) || 0,
      management: 'code',
    })),
    policy: {
      contentTypes: sourceConfig.contentTypes,
      staticRoutes: sourceConfig.staticRoutes,
    },
  };
}

async function getRobotsConfiguration(strapi) {
  const { defaultLocale } = await getLocales(strapi);
  const settings = await findSingle(strapi, 'api::robots-settings.robots-settings', defaultLocale, { rules: true });
  const rules = Array.isArray(settings?.rules) ? settings.rules.map((rule) => ({
    user_agent: typeof rule.user_agent === 'string' ? rule.user_agent : '*',
    allow: typeof rule.allow === 'string' ? rule.allow : '',
    disallow: typeof rule.disallow === 'string' ? rule.disallow : '',
  })) : [];
  return {
    indexingEnabled: settings?.indexing_enabled !== false,
    rules,
    additionalDirectives: typeof settings?.additional_directives === 'string' ? settings.additional_directives : '',
  };
}

module.exports = { getSitemapReport, getRobotsConfiguration, STATIC_ROUTES, COLLECTION_ROUTES, SITEMAP_GROUPS, cleanPath, getPublicOrigin, indexingAllowed };
