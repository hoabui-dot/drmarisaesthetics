#!/usr/bin/env node

/**
 * Configure the Service list for header-menu administration.
 *
 * This only changes Content Manager view preferences. It does not mutate
 * service content, navigationOrder values, or publication state.
 */
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
  config.settings = {
    ...(config.settings || {}),
    pageSize: 10,
    defaultSortBy: 'navigationOrder',
    defaultSortOrder: 'ASC',
  }
  config.layouts = config.layouts || {}
  config.layouts.list = ['navigationOrder', 'title', 'slug', 'updatedAt']

  await client.query('UPDATE strapi_core_store_settings SET value = $1 WHERE key = $2', [JSON.stringify(config), key])
  console.log('Configured Service list: navigationOrder ASC, 10 entries per page.')
}

run()
  .catch((error) => {
    console.error(`[FAILED] ${error.message}`)
    process.exitCode = 1
  })
  .finally(() => client.end())
