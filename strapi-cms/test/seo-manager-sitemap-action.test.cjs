'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const plugin = require('../src/plugins/seo-manager/strapi-server');

test('Admin revalidation action delegates to the existing authenticated Next.js webhook', async () => {
  const previousUrl = process.env.NEXTJS_URL;
  const previousSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const previousFetch = global.fetch;
  process.env.NEXTJS_URL = 'http://frontend.internal:2234';
  process.env.STRAPI_WEBHOOK_SECRET = 'test-secret';
  let request;
  global.fetch = async (url, options) => {
    request = { url: String(url), options };
    return { ok: true, status: 200, json: async () => ({ revalidated: true, tags: ['sitemap'], paths: ['/sitemap.xml', '/service-sitemap.xml', '/news-sitemap.xml', '/page-sitemap.xml'] }) };
  };

  try {
    const ctx = {};
    await plugin.controllers.sitemap.revalidate(ctx);
    assert.equal(request.url, 'http://frontend.internal:2234/api/revalidate');
    assert.equal(request.options.method, 'POST');
    assert.equal(request.options.headers['x-strapi-secret'], 'test-secret');
    assert.deepEqual(JSON.parse(request.options.body), { event: 'entry.update', model: 'seo-manager-settings', entry: {} });
    assert.deepEqual(ctx.body.data.paths, ['/sitemap.xml', '/service-sitemap.xml', '/news-sitemap.xml', '/page-sitemap.xml']);
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.NEXTJS_URL;
    else process.env.NEXTJS_URL = previousUrl;
    if (previousSecret === undefined) delete process.env.STRAPI_WEBHOOK_SECRET;
    else process.env.STRAPI_WEBHOOK_SECRET = previousSecret;
  }
});

test('Admin revalidation reports configuration failure without attempting an unauthenticated request', async () => {
  const previousUrl = process.env.NEXTJS_URL;
  const previousSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const previousFetch = global.fetch;
  const previousStrapi = global.strapi;
  delete process.env.NEXTJS_URL;
  delete process.env.STRAPI_WEBHOOK_SECRET;
  global.fetch = async () => { throw new Error('fetch must not be called without server configuration'); };
  global.strapi = { log: { error() {} } };
  try {
    const ctx = {};
    await plugin.controllers.sitemap.revalidate(ctx);
    assert.equal(ctx.status, 503);
    assert.match(ctx.body.error.message, /not configured/i);
  } finally {
    global.fetch = previousFetch;
    if (previousStrapi === undefined) delete global.strapi;
    else global.strapi = previousStrapi;
    if (previousUrl === undefined) delete process.env.NEXTJS_URL;
    else process.env.NEXTJS_URL = previousUrl;
    if (previousSecret === undefined) delete process.env.STRAPI_WEBHOOK_SECRET;
    else process.env.STRAPI_WEBHOOK_SECRET = previousSecret;
  }
});
