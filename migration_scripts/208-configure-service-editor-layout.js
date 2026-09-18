#!/usr/bin/env node

/** Configure the persisted Strapi Content Manager edit layout for Services. */
const { Client } = require('../strapi-cms/node_modules/pg')

const client = new Client({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 15432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
})

const key = 'plugin_content_manager_configuration_content_types::api::service.service'

async function run() {
  await client.connect()
  const result = await client.query('SELECT value FROM strapi_core_store_settings WHERE key = $1', [key])
  if (!result.rows[0]) throw new Error(`Missing Content Manager configuration: ${key}`)

  const config = JSON.parse(result.rows[0].value)
  config.layouts = config.layouts || {}
  config.layouts.edit = [
    [{ name: 'seo', size: 12 }],
    [{ name: 'title', size: 6 }, { name: 'navigationLabel', size: 6 }],
    [{ name: 'slug', size: 6 }, { name: 'navigationOrder', size: 6 }],
    [{ name: 'category', size: 6 }, { name: 'coverImage', size: 6 }],
    [{ name: 'metaDescription', size: 12 }],
    [{ name: 'contentBetterBlocks', size: 12 }],
    [{ name: 'faq', size: 12 }],
  ]

  await client.query('UPDATE strapi_core_store_settings SET value = $1 WHERE key = $2', [JSON.stringify(config), key])
  console.log('Updated Service Content Manager layout: navigationLabel beside title.')
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`)
  process.exitCode = 1
}).finally(() => client.end())
