#!/usr/bin/env node

/** Hide the technical ID and expose the service menu order in the list view. */
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
  config.layouts.list = ['title', 'navigationLabel', 'navigationOrder', 'slug']
  config.metadatas = config.metadatas || {}
  config.metadatas.navigationOrder = config.metadatas.navigationOrder || { edit: {}, list: {} }
  config.metadatas.navigationOrder.list = {
    ...config.metadatas.navigationOrder.list,
    label: 'navigationOrder',
    searchable: true,
    sortable: true,
  }

  await client.query('UPDATE strapi_core_store_settings SET value = $1 WHERE key = $2', [JSON.stringify(config), key])
  console.log('Updated Service list view: hidden ID, added navigationOrder.')
}

run().catch((error) => {
  console.error(`[FAILED] ${error.message}`)
  process.exitCode = 1
}).finally(() => client.end())
