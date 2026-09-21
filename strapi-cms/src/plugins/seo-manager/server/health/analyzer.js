'use strict';

const SEVERITY_WEIGHT = Object.freeze({ critical: 10, warning: 3, recommendation: 1 });
const CATEGORY_LABELS = Object.freeze({
  metadata: 'Metadata', indexing: 'Indexing', canonical: 'Canonical', sitemap: 'Sitemap',
  redirect: 'Redirects', 'structured-data': 'Structured data', image: 'Images', content: 'Content trust',
});
const INCLUDED_COLLECTION_TYPES = new Set(['api::page.page', 'api::blog.blog', 'api::service.service']);
const INCLUDED_STATIC_PATHS = new Set([
  '/', '/about-us', '/contact', '/our-team/dr-huy', '/our-team/dr-cuong', '/results', '/treatments',
  '/services', '/news',
]);

const clean = (value) => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
const normalizePath = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const parsed = new URL(value, 'https://seo-health.invalid');
    const pathname = parsed.pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
    return pathname;
  } catch {
    return '';
  }
};
const normalizeComparable = (value) => clean(value).toLocaleLowerCase().replace(/\s+/g, ' ');
const getSeo = (document) => document?.seo && typeof document.seo === 'object' ? document.seo : {};
const getMedia = (value) => {
  if (!value || typeof value !== 'object') return null;
  return value.data?.attributes || value.data || value.attributes || value;
};
const hasMedia = (value) => Boolean(getMedia(value)?.url);
const mediaHasAlt = (value) => Boolean(clean(getMedia(value)?.alternativeText));

function scoreCategory(category) {
  const total = category.passed + category.critical + category.warning + category.recommendation;
  if (!total) return null;
  const penalty = category.critical * SEVERITY_WEIGHT.critical
    + category.warning * SEVERITY_WEIGHT.warning
    + category.recommendation * SEVERITY_WEIGHT.recommendation;
  return Math.max(0, Math.round(100 * (1 - penalty / (total * SEVERITY_WEIGHT.critical))));
}

function analyzeSeoHealth(input) {
  const issues = [];
  const categoryStats = Object.fromEntries(Object.keys(CATEGORY_LABELS).map((category) => [category, {
    passed: 0, critical: 0, warning: 0, recommendation: 0,
  }]));
  let passed = 0;
  let noindexPages = 0;
  let nofollowPages = 0;
  let indexablePages = 0;
  let auditedPages = 0;
  let sitemapExpected = 0;
  let sitemapExcluded = 0;

  const recordPass = (category) => {
    passed += 1;
    categoryStats[category].passed += 1;
  };
  const addIssue = (issue) => {
    const id = [issue.code, issue.contentType || 'site', issue.documentId || issue.path || '', issue.locale || '', issue.field || '']
      .map((part) => String(part).replace(/[^a-zA-Z0-9_-]/g, '-')).join(':');
    const managerTab = issue.contentType === 'Redirect' ? 'redirects'
      : issue.contentType === 'Canonical rule' ? 'canonicals'
        : issue.contentType === 'Robots settings' ? 'robots'
          : issue.contentType === 'SEO settings' ? 'metadata' : '';
    const normalized = {
      id,
      status: 'open',
      ...(managerTab ? { adminEditUrl: `/plugins/seo-manager?tab=${managerTab}` } : {}),
      ...issue,
    };
    issues.push(normalized);
    categoryStats[issue.category][issue.severity] += 1;
  };

  const publishedPaths = new Map();
  const draftPaths = new Set(input.draftDocuments.map((document) => document.path).filter(Boolean));
  for (const document of input.documents) {
    if (document.path && (document.isDefaultLocale !== false || !publishedPaths.has(document.path))) publishedPaths.set(document.path, document);
  }
  const activeRedirects = input.redirects.filter((item) => item.is_active !== false);
  const redirectsBySource = new Map();
  for (const redirect of activeRedirects) {
    const source = isPathValue(redirect.source_path) ? normalizePath(redirect.source_path) : '';
    if (!source) continue;
    if (!redirectsBySource.has(source)) redirectsBySource.set(source, []);
    redirectsBySource.get(source).push(redirect);
  }
  const activeCanonicalRules = new Map();
  for (const rule of input.canonicalRules.filter((item) => item.is_active !== false)) {
    const source = isPathValue(rule.source_path) ? normalizePath(rule.source_path) : '';
    if (source && !activeCanonicalRules.has(source)) activeCanonicalRules.set(source, rule);
  }

  const global = input.globalSettings || {};
  const globalOpenGraphImage = input.globalOpenGraphImage;
  const robots = input.robots || {};
  const sitemapEnabled = global.sitemap_enabled !== false;
  const sitemapPolicy = input.sitemapPolicy || { contentTypes: {}, staticPaths: {} };
  const indexingEnabled = robots.indexing_enabled !== false;
  const knownPublicPaths = new Set([
    ...INCLUDED_STATIC_PATHS,
    ...INCLUDED_STATIC_PATHS,
    ...input.documents.map((document) => document.path).filter(Boolean),
  ]);

  const effectiveMetadata = (document) => {
    const seo = getSeo(document);
    const pageSeo = document.pageSeoConsumed === false ? {} : seo;
    const title = clean(pageSeo.meta_title || pageSeo.metaTitle || document.seo_title || document.metadata_title || document.title || document.navigationLabel);
    let description = clean(pageSeo.meta_description || pageSeo.metaDescription || document.seo_description || document.metadata_description);
    if (!description && document.uid === 'api::blog.blog') description = clean(document.metaDescription || title);
    if (!description && document.uid === 'api::page.page') description = clean(document.description || `Learn more about ${title}`);
    if (!description && document.uid === 'api::service.service') description = clean(document.metaDescription);
    if (!description && document.uid === 'api::deep-plane-facelift-specialist.deep-plane-facelift-specialist') description = clean(document.seo_description);
    return { title, description, seo };
  };

  if (!indexingEnabled) {
    addIssue({ code: 'SITE_INDEXING_DISABLED', category: 'indexing', severity: 'critical', title: 'Search engine indexing is disabled', description: 'robots.txt currently disallows all crawlers. Verify that this is intentional for the live website.', field: 'indexing_enabled', currentValue: false });
  } else recordPass('indexing');

  if (!sitemapEnabled) {
    sitemapExcluded += input.documents.filter((document) => document.publishedAt).length;
    addIssue({ code: 'SITEMAP_DISABLED', category: 'sitemap', severity: 'warning', title: 'Sitemap generation is disabled', description: 'The frontend returns an empty sitemap while this setting is off. Confirm the site should remain discoverable through other means.', field: 'sitemap_enabled', currentValue: false });
  } else recordPass('sitemap');

  const sitemapUrl = clean(robots.sitemap_url);
  if (sitemapUrl) {
    let valid = false;
    try { const url = new URL(sitemapUrl); valid = ['http:', 'https:'].includes(url.protocol); } catch { valid = false; }
    if (!valid) addIssue({ code: 'ROBOTS_SITEMAP_URL_INVALID', category: 'indexing', severity: 'warning', title: 'robots.txt has an invalid sitemap URL', description: 'Use an absolute HTTP or HTTPS URL for the Sitemap directive.', field: 'sitemap_url', currentValue: sitemapUrl });
    else recordPass('indexing');
  } else recordPass('indexing');

  const robotsRules = Array.isArray(robots.rules) ? robots.rules : [];
  for (const rule of robotsRules) {
    const allow = String(rule.allow || '').split(/[\r\n,]+/).map((value) => value.trim()).filter(Boolean);
    const disallow = String(rule.disallow || '').split(/[\r\n,]+/).map((value) => value.trim()).filter(Boolean);
    const contradictory = allow.filter((path) => disallow.includes(path));
    if (contradictory.length) addIssue({ code: 'ROBOTS_RULE_CONFLICT', category: 'indexing', severity: 'warning', title: 'A robots rule both allows and disallows the same path', description: `Review the conflicting path(s): ${contradictory.join(', ')}. Crawler handling of overlapping rules can be confusing.`, contentType: 'Robots settings', field: 'rules', currentValue: contradictory });
    else recordPass('indexing');
  }
  const extraDirectives = typeof robots.additional_directives === 'string' ? robots.additional_directives : '';
  if (indexingEnabled && /(?:^|\n)\s*disallow\s*:\s*\/\s*(?:#.*)?(?:\n|$)/i.test(extraDirectives)) {
    addIssue({ code: 'ROBOTS_EXTRA_BLOCKS_ALL', category: 'indexing', severity: 'critical', title: 'An additional robots directive may block the whole site', description: 'The additional directives contain `Disallow: /` while indexing is enabled. Check crawler behavior before publishing.', contentType: 'Robots settings', field: 'additional_directives' });
  } else recordPass('indexing');

  const titleGroups = new Map();
  const descriptionGroups = new Map();
  for (const document of input.documents) {
    if (!document.path || !document.publishedAt) continue;
    auditedPages += 1;
    const seo = getSeo(document);
    const metadata = effectiveMetadata(document);
    const pageSeoActive = document.pageSeoConsumed !== false;
    const isNoindex = (pageSeoActive && (seo.no_index === true || seo.noIndex === true)) || document.no_index === true;
    const isSitemapExcluded = pageSeoActive && seo.include_in_sitemap === false;
    const isNofollow = pageSeoActive && (seo.no_follow === true || seo.noFollow === true);
    if (isNoindex) noindexPages += 1;
    else indexablePages += 1;
    if (isNofollow) nofollowPages += 1;

    if (document.auditMetadata !== false && !metadata.title) addIssue({ code: 'META_TITLE_MISSING', category: 'metadata', severity: 'critical', title: 'Effective meta title is missing', description: 'Neither the page SEO title nor its frontend title fallback is available.', ...issueDocument(document), field: 'meta_title' });
    else if (document.auditMetadata !== false) {
      const titleLength = metadata.title.length;
      if (titleLength > 60) addIssue({ code: 'META_TITLE_LONG', category: 'metadata', severity: 'recommendation', title: 'Meta title may be too long', description: `This title is ${titleLength} characters. Shorter titles may display more consistently; this is editorial guidance, not a ranking rule.`, ...issueDocument(document), field: 'meta_title', currentValue: metadata.title });
      else recordPass('metadata');
      const titleKey = `${document.locale || ''}:${normalizeComparable(metadata.title)}`;
      if (!titleGroups.has(titleKey)) titleGroups.set(titleKey, []);
      titleGroups.get(titleKey).push(document);
    }

    if (document.auditMetadata !== false && !metadata.description) addIssue({ code: 'META_DESCRIPTION_MISSING', category: 'metadata', severity: 'warning', title: 'Effective meta description is missing', description: 'No page description or applicable fallback is available. Add a concise, page-specific description where this content type supports it.', ...issueDocument(document), field: 'meta_description' });
    else if (document.auditMetadata !== false) {
      const descriptionLength = metadata.description.length;
      const fallbackIsTitle = metadata.description === metadata.title;
      if (fallbackIsTitle) addIssue({ code: 'META_DESCRIPTION_TITLE_FALLBACK', category: 'metadata', severity: 'recommendation', title: 'Description falls back to the page title', description: 'The frontend has a basic fallback, but a descriptive summary would communicate this page more clearly.', ...issueDocument(document), field: 'meta_description', currentValue: metadata.description });
      else if (descriptionLength > 160 || descriptionLength < 50) addIssue({ code: 'META_DESCRIPTION_LENGTH', category: 'metadata', severity: 'recommendation', title: 'Review meta description length', description: `This description is ${descriptionLength} characters. Consider a concise summary around 50–160 characters; this is editorial guidance, not a ranking requirement.`, ...issueDocument(document), field: 'meta_description', currentValue: metadata.description });
      else recordPass('metadata');
      const descriptionKey = `${document.locale || ''}:${normalizeComparable(metadata.description)}`;
      if (!descriptionGroups.has(descriptionKey)) descriptionGroups.set(descriptionKey, []);
      descriptionGroups.get(descriptionKey).push(document);
    }

    const pageImage = document.pageSeoConsumed === false ? null : (seo.meta_image || seo.metaImage);
    const contentImage = document.coverImage || document.cover || document.metadata_image || document.heroImage;
    const image = pageImage || contentImage || (document.globalImageFallback === false ? null : globalOpenGraphImage);
    if (document.auditMetadata !== false && (!image || !hasMedia(image))) addIssue({ code: 'OG_IMAGE_MISSING', category: 'image', severity: 'recommendation', title: 'No effective Open Graph image is available', description: 'The page SEO image, content image and configured global Open Graph fallback are all empty.', ...issueDocument(document), field: 'meta_image' });
    else if (document.auditMetadata !== false) {
      recordPass('image');
      if ((pageImage || contentImage) && !mediaHasAlt(pageImage || contentImage)) addIssue({ code: 'SEO_IMAGE_ALT_MISSING', category: 'image', severity: 'recommendation', title: 'SEO image has no alternative text', description: 'Add descriptive alternative text to the selected Media Library image. The current frontend may use a title fallback in some contexts.', ...issueDocument(document), field: pageImage ? 'seo.meta_image' : document.cover ? 'cover' : document.metadata_image ? 'metadata_image' : 'coverImage' });
      else recordPass('image');
    }

    const explicitCanonical = document.pageSeoConsumed === false ? '' : clean(seo.canonical_url || seo.canonicalUrl);
    const override = activeCanonicalRules.get(document.path);
    if (explicitCanonical && !/^https:\/\//i.test(explicitCanonical)) {
      addIssue({ code: 'CANONICAL_INVALID', category: 'canonical', severity: 'critical', title: 'Page canonical URL is not a valid HTTPS URL', description: 'The frontend only accepts absolute HTTPS page-level canonical URLs; this value will be ignored and a fallback canonical used.', ...issueDocument(document), field: 'seo.canonical_url', currentValue: explicitCanonical });
    } else if (explicitCanonical && override && !canonicalEquivalent(explicitCanonical, override.canonical_url)) {
      addIssue({ code: 'CANONICAL_OVERRIDE_CONFLICT', category: 'canonical', severity: 'warning', title: 'Page canonical and global canonical rule disagree', description: 'The frontend gives the page-level canonical precedence. Confirm that the global rule is still needed.', ...issueDocument(document), field: 'seo.canonical_url', currentValue: { page: explicitCanonical, rule: override.canonical_url } });
    } else if (explicitCanonical || override || document.canonicalSupported) recordPass('canonical');
    else addIssue({ code: 'CANONICAL_NOT_MANAGED', category: 'canonical', severity: 'warning', title: 'Canonical output is not managed by the shared SEO builder', description: 'This route does not use the shared canonical metadata builder, so a canonical link may not be emitted. Verify the rendered page source.', ...issueDocument(document), field: 'canonical_url' });

    const canonicalValue = explicitCanonical || override?.canonical_url;
    if (canonicalValue && /^https:\/\//i.test(canonicalValue)) {
      const targetPath = normalizePath(canonicalValue);
      const targetPage = publishedPaths.get(targetPath);
      if (targetPage) {
        const targetSeo = getSeo(targetPage);
        if ((targetPage.pageSeoConsumed !== false && (targetSeo.no_index === true || targetSeo.noIndex === true)) || targetPage.no_index === true) addIssue({ code: 'CANONICAL_TARGET_NOINDEX', category: 'canonical', severity: 'critical', title: 'Canonical points to a noindex page', description: `The canonical target ${targetPath} is published with noindex enabled. Make the target indexable or update the canonical.`, ...issueDocument(document), field: 'canonical_url', currentValue: canonicalValue });
        else recordPass('canonical');
      } else if (draftPaths.has(targetPath)) addIssue({ code: 'CANONICAL_TARGET_UNPUBLISHED', category: 'canonical', severity: 'warning', title: 'Canonical points to unpublished content', description: `The canonical target ${targetPath} exists only as a draft in the audited content types.`, ...issueDocument(document), field: 'canonical_url', currentValue: canonicalValue });
      else if (redirectsBySource.has(targetPath)) addIssue({ code: 'CANONICAL_TARGET_REDIRECTS', category: 'canonical', severity: 'warning', title: 'Canonical points to a redirect source', description: `The canonical target ${targetPath} is also an active redirect source. Point the canonical to the final destination.`, ...issueDocument(document), field: 'canonical_url', currentValue: canonicalValue });
      else if (knownPublicPaths.has(targetPath)) recordPass('canonical');
    }

    const sitemapEligibleType = INCLUDED_COLLECTION_TYPES.has(document.uid) || INCLUDED_STATIC_PATHS.has(document.path);
    const sitemapSourceEnabled = INCLUDED_COLLECTION_TYPES.has(document.uid)
      ? sitemapPolicy.contentTypes[document.uid] !== false
      : sitemapPolicy.staticPaths[document.path] !== false;
    if (document.isSitemapLocale !== false && sitemapEnabled && sitemapSourceEnabled && !isNoindex && !isSitemapExcluded) {
      sitemapExpected += 1;
      if (!sitemapEligibleType) addIssue({ code: 'SITEMAP_CONTENT_NOT_INCLUDED', category: 'sitemap', severity: 'warning', title: 'Published content is not included by the current sitemap source list', description: 'This content type has no corresponding collection route or application-managed static route in the sitemap registry.', ...issueDocument(document), field: 'sitemap' });
      else if (redirectsBySource.has(document.path)) addIssue({ code: 'SITEMAP_REDIRECT_SOURCE', category: 'sitemap', severity: 'warning', title: 'A redirecting URL is eligible for the sitemap', description: 'An active redirect uses this published URL as its source. Remove the source from sitemap generation or retire the redirect.', ...issueDocument(document), field: 'sitemap' });
      else recordPass('sitemap');
    } else if (document.isSitemapLocale !== false) {
      sitemapExcluded += 1;
      if (sitemapEnabled && sitemapEligibleType && (isNoindex || isSitemapExcluded || !sitemapSourceEnabled)) recordPass('sitemap');
    }

    if (document.structuredDataOverridesConsumed !== false && global.structured_data_enabled !== false && seo.structured_data_enabled !== false && seo.no_index !== true && (document.structured_data_json || seo.structured_data_json || seo.structuredDataJson)) {
      const value = document.structured_data_json || seo.structured_data_json || seo.structuredDataJson;
      let parsed = value;
      if (typeof value === 'string') {
        try { parsed = JSON.parse(value); } catch {
          addIssue({ code: 'STRUCTURED_DATA_INVALID_JSON', category: 'structured-data', severity: 'critical', title: 'Custom structured data is invalid JSON', description: 'Fix the JSON syntax before relying on this custom Schema.org entity.', ...issueDocument(document), field: 'structured_data_json' });
          parsed = null;
        }
      }
      if (parsed) {
        const entities = Array.isArray(parsed) ? parsed : Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed];
        if (!parsed || typeof parsed !== 'object' || !entities.length || entities.some((entity) => !entity || typeof entity !== 'object' || typeof entity['@type'] !== 'string')) addIssue({ code: 'STRUCTURED_DATA_TYPE_MISSING', category: 'structured-data', severity: 'warning', title: 'Custom structured data is missing a schema type', description: 'Each custom Schema.org entity should be an object with an @type value.', ...issueDocument(document), field: 'structured_data_json' });
        else recordPass('structured-data');
      }
    } else if (document.structuredDataGenerated && seo.structured_data_enabled !== false && seo.no_index !== true && global.structured_data_enabled !== false) recordPass('structured-data');
  }

  for (const group of titleGroups.values()) {
    if (group.length < 2) continue;
    for (const document of group) addIssue({ code: 'META_TITLE_DUPLICATE', category: 'metadata', severity: 'warning', title: 'Duplicate effective meta title', description: `${group.length} published pages in this locale resolve to the same title. Differentiate the pages where appropriate.`, ...issueDocument(document), field: 'meta_title', currentValue: effectiveMetadata(document).title });
  }
  for (const group of descriptionGroups.values()) {
    if (group.length < 2) continue;
    for (const document of group) addIssue({ code: 'META_DESCRIPTION_DUPLICATE', category: 'metadata', severity: 'warning', title: 'Duplicate effective meta description', description: `${group.length} published pages in this locale resolve to the same description. Review whether each page needs a distinct summary.`, ...issueDocument(document), field: 'meta_description', currentValue: effectiveMetadata(document).description });
  }

  const canonicalTargetGroups = new Map();
  for (const document of input.documents) {
    if (!document.publishedAt) continue;
    const seo = getSeo(document);
    const target = clean((document.pageSeoConsumed === false ? '' : (seo.canonical_url || seo.canonicalUrl)) || activeCanonicalRules.get(document.path)?.canonical_url);
    if (!target || !/^https:\/\//i.test(target)) continue;
    const normalizedTarget = canonicalEquivalentKey(target);
    if (!canonicalTargetGroups.has(normalizedTarget)) canonicalTargetGroups.set(normalizedTarget, []);
    canonicalTargetGroups.get(normalizedTarget).push(document);
  }
  for (const group of canonicalTargetGroups.values()) {
    if (group.length < 2) continue;
    for (const document of group) addIssue({ code: 'CANONICAL_TARGET_SHARED', category: 'canonical', severity: 'recommendation', title: 'Multiple pages share one canonical target', description: 'Several pages point to this same canonical path. This can be intentional, but confirm it is not a path-mapping mistake.', ...issueDocument(document), field: 'canonical_url' });
  }

  const redirectTargets = new Map();
  for (const redirect of activeRedirects) {
    const source = normalizePath(redirect.source_path);
    const destinationValue = clean(redirect.destination_path);
    const destination = internalPath(destinationValue, input.publicOrigin);
    const externalDestination = isHttpUrl(destinationValue);
    if (!source || (!destination && !externalDestination)) {
      addIssue({ code: 'REDIRECT_URL_INVALID', category: 'redirect', severity: 'critical', title: 'Redirect source or destination is invalid', description: 'Use a normalized absolute path or a valid HTTP(S) destination.', contentType: 'Redirect', documentId: redirect.documentId, field: 'source_path', currentValue: { source: redirect.source_path, destination: redirect.destination_path } });
      continue;
    }
    if (source === destination) addIssue({ code: 'REDIRECT_SELF_LOOP', category: 'redirect', severity: 'critical', title: 'Redirect points to itself', description: 'Change the destination or remove this redirect.', contentType: 'Redirect', documentId: redirect.documentId, field: 'destination_path', currentValue: source });
    if (!redirectTargets.has(source)) redirectTargets.set(source, []);
    if (destination) redirectTargets.get(source).push({ redirect, destination });
    else recordPass('redirect');
  }

  const visitedCycles = new Set();
  for (const source of redirectTargets.keys()) {
    const path = [];
    const positions = new Map();
    let current = source;
    while (redirectTargets.has(current) && redirectTargets.get(current).length) {
      if (positions.has(current)) {
        const cycle = path.slice(positions.get(current));
        const key = [...cycle].sort().join('|');
        if (!visitedCycles.has(key)) {
          visitedCycles.add(key);
          addIssue({ code: 'REDIRECT_LOOP', category: 'redirect', severity: 'critical', title: 'Redirect loop detected', description: `The active redirect chain loops through ${cycle.join(' → ')} → ${cycle[0]}.`, contentType: 'Redirect', path: cycle[0], currentValue: cycle });
        }
        break;
      }
      positions.set(current, path.length);
      path.push(current);
      current = redirectTargets.get(current)[0].destination;
      if (path.length > 20) break;
    }
    if (path.length > 1 && !visitedCycles.has([...path].sort().join('|')) && !redirectTargets.has(current)) {
      const first = redirectTargets.get(source)?.[0]?.redirect;
      addIssue({ code: 'REDIRECT_CHAIN', category: 'redirect', severity: 'warning', title: 'Redirect chain detected', description: `${path.join(' → ')} → ${current}. Update the source to point directly to the final destination where practical.`, contentType: 'Redirect', documentId: first?.documentId, path: source, field: 'destination_path', currentValue: [...path, current] });
    }
  }
  for (const [source, rows] of redirectTargets) {
    if (rows.length > 1) addIssue({ code: 'REDIRECT_DUPLICATE_SOURCE', category: 'redirect', severity: 'critical', title: 'Multiple active redirects share the same source', description: `There are ${rows.length} active redirect records for ${source}.`, contentType: 'Redirect', documentId: rows[0].redirect.documentId, path: source, field: 'source_path' });
    const destination = rows[0]?.destination;
    if (destination && !redirectTargets.has(destination) && !publishedPaths.has(destination) && !knownPublicPaths.has(destination)) addIssue({ code: 'REDIRECT_DESTINATION_UNVERIFIED', category: 'redirect', severity: 'warning', title: 'Internal redirect destination is not in audited published routes', description: `The destination ${destination} does not match the audited CMS documents or known static routes. Confirm the route resolves in the frontend.`, contentType: 'Redirect', documentId: rows[0].redirect.documentId, path: source, field: 'destination_path', currentValue: rows[0].redirect.destination_path });
    else recordPass('redirect');
  }

  for (const rule of input.canonicalRules) {
    if (rule.is_active === false) continue;
    if (!isPathValue(rule.source_path) || !/^https:\/\//i.test(clean(rule.canonical_url))) addIssue({ code: 'CANONICAL_RULE_INVALID', category: 'canonical', severity: 'critical', title: 'Canonical rule has an invalid source or target', description: 'Canonical rules require an absolute source path and an absolute HTTPS canonical URL.', contentType: 'Canonical rule', documentId: rule.documentId, path: normalizePath(rule.source_path), field: 'canonical_url', currentValue: rule.canonical_url });
    else recordPass('canonical');
  }

  const structuredDataEnabled = global.structured_data_enabled !== false;
  const configuredBusinessType = clean(global.structured_data_business_type);
  const allowedBusinessTypes = new Set(['Organization', 'MedicalBusiness', 'MedicalClinic', 'ProfessionalService']);
  if (!structuredDataEnabled) addIssue({ code: 'STRUCTURED_DATA_DISABLED', category: 'structured-data', severity: 'recommendation', title: 'Structured data generation is disabled', description: 'The frontend will not emit generated structured data while the global switch is off. Confirm this is intentional.', contentType: 'SEO settings', field: 'structured_data_enabled', currentValue: false });
  else if (configuredBusinessType && !allowedBusinessTypes.has(configuredBusinessType)) addIssue({ code: 'STRUCTURED_DATA_BUSINESS_TYPE_INVALID', category: 'structured-data', severity: 'warning', title: 'Structured data business type is unsupported', description: 'The frontend falls back to MedicalBusiness for an unsupported value. Choose a supported Schema.org business type.', contentType: 'SEO settings', field: 'structured_data_business_type', currentValue: configuredBusinessType });
  else recordPass('structured-data');

  const summaryCounts = {
    critical: issues.filter((issue) => issue.severity === 'critical').length,
    warnings: issues.filter((issue) => issue.severity === 'warning').length,
    recommendations: issues.filter((issue) => issue.severity === 'recommendation').length,
    passed,
    auditedPages,
    indexablePages,
    noindexPages,
    nofollowPages,
    sitemapExpected,
    sitemapExcluded,
    activeRedirects: activeRedirects.length,
    redirectLoops: issues.filter((issue) => issue.code === 'REDIRECT_LOOP' || issue.code === 'REDIRECT_SELF_LOOP').length,
    redirectChains: issues.filter((issue) => issue.code === 'REDIRECT_CHAIN').length,
  };
  const totalChecks = passed + issues.length;
  const scorePenalty = issues.reduce((sum, issue) => sum + SEVERITY_WEIGHT[issue.severity], 0);
  const score = totalChecks ? Math.max(0, Math.round(100 * (1 - scorePenalty / (totalChecks * SEVERITY_WEIGHT.critical)))) : 100;
  const categories = Object.fromEntries(Object.entries(categoryStats).map(([category, stats]) => [category, {
    label: CATEGORY_LABELS[category],
    score: scoreCategory(stats),
    issues: stats.critical + stats.warning + stats.recommendation,
    ...stats,
  }]));

  return {
    score,
    summary: summaryCounts,
    categories,
    issues,
    filters: {
      locales: [...new Set(input.documents.map((document) => document.locale).filter(Boolean))].sort(),
      contentTypes: [...new Set(input.documents.map((document) => document.contentTypeLabel || document.uid).filter(Boolean))].sort(),
    },
    generatedAt: new Date().toISOString(),
    methodology: 'First-party CMS and current frontend SEO configuration checks. This is not a search-engine crawl or Google ranking score.',
  };
}

function issueDocument(document) {
  return {
    content: document.title || document.slug || document.path || document.uid,
    contentType: document.contentTypeLabel || document.uid,
    contentTypeUid: document.uid,
    documentId: document.documentId,
    locale: document.locale,
    path: document.path,
  };
}

function isPathValue(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(value);
}

function internalPath(value, publicOrigin) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const parsed = new URL(value, 'https://seo-health.invalid');
    if (parsed.origin !== 'https://seo-health.invalid') {
      if (!isHttpUrl(value) || !publicOrigin) return '';
      if (new URL(publicOrigin).origin !== parsed.origin) return '';
    }
    return normalizePath(parsed.pathname);
  } catch {
    return '';
  }
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function canonicalEquivalent(left, right) {
  return canonicalEquivalentKey(left) !== '' && canonicalEquivalentKey(left) === canonicalEquivalentKey(right);
}

function canonicalEquivalentKey(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return '';
    url.hash = '';
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/$/, '');
    return `${url.origin.toLowerCase()}${url.pathname}${url.search}`;
  } catch {
    return '';
  }
}

function paginateIssues(issues, query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(10, Number.parseInt(query.pageSize, 10) || 25));
  const search = clean(query.search).toLocaleLowerCase();
  const filtered = issues.filter((issue) =>
    (!query.severity || issue.severity === query.severity)
    && (!query.category || issue.category === query.category)
    && (!query.contentType || issue.contentType === query.contentType)
    && (!query.locale || issue.locale === query.locale)
    && (!search || [issue.title, issue.description, issue.content, issue.path, issue.code].some((value) => clean(value).toLocaleLowerCase().includes(search))),
  );
  const severityOrder = { critical: 0, warning: 1, recommendation: 2 };
  filtered.sort((left, right) => severityOrder[left.severity] - severityOrder[right.severity] || String(left.content || '').localeCompare(String(right.content || '')));
  return { items: filtered.slice((page - 1) * pageSize, page * pageSize), pagination: { page, pageSize, total: filtered.length, pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)) } };
}

module.exports = { analyzeSeoHealth, paginateIssues, normalizePath, internalPath, SEVERITY_WEIGHT, CATEGORY_LABELS, INCLUDED_COLLECTION_TYPES, INCLUDED_STATIC_PATHS };
