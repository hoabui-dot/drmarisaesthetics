const fs = require('node:fs')
const path = require('node:path')
const JSON5 = require('json5')

const projectRoot = path.resolve(__dirname, '..')
const translationPath = path.join(projectRoot, 'src/admin/i18n/vi.json')
const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'))
const missing = []
const discoveredCategories = new Set()
let contentTypeCount = 0
let componentCount = 0
let fieldCount = 0

function visitJsonFiles(directory, callback) {
  if (!fs.existsSync(directory)) return

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) visitJsonFiles(absolutePath, callback)
    else if (entry.name.endsWith('.json')) callback(absolutePath)
  }
}

function requireTranslation(id, source) {
  const value = translations[id]
  if (typeof value !== 'string' || value.trim() === '') missing.push({ id, source })
}

visitJsonFiles(path.join(projectRoot, 'src/api'), (filePath) => {
  const relative = path.relative(path.join(projectRoot, 'src/api'), filePath)
  if (!relative.includes(`${path.sep}content-types${path.sep}`)) return

  const schema = JSON5.parse(fs.readFileSync(filePath, 'utf8'))
  const apiName = relative.split(path.sep)[0]
  const uid = `api::${apiName}.${apiName}`
  contentTypeCount += 1
  requireTranslation(schema.info?.displayName, filePath)

  for (const fieldName of Object.keys(schema.attributes || {})) {
    fieldCount += 1
    requireTranslation(`content-manager.content-types.${uid}.${fieldName}`, filePath)
  }
})

visitJsonFiles(path.join(projectRoot, 'src/components'), (filePath) => {
  const relative = path.relative(path.join(projectRoot, 'src/components'), filePath)
  const uid = relative.replace(/\.json$/, '').split(path.sep).join('.')
  const schema = JSON5.parse(fs.readFileSync(filePath, 'utf8'))
  componentCount += 1
  // Strapi derives the component category from the first segment of its UID.
  discoveredCategories.add(uid.split('.')[0])

  for (const fieldName of Object.keys(schema.attributes || {})) {
    fieldCount += 1
    requireTranslation(`content-manager.components.${uid}.${fieldName}`, filePath)
  }
})

for (const category of discoveredCategories) requireTranslation(category, 'component category')

if (missing.length > 0) {
  console.error(`Missing ${missing.length} Vietnamese Admin translation(s):`)
  for (const item of missing) console.error(`- ${item.id} (${item.source})`)
  process.exitCode = 1
} else {
  console.log(
    `Vietnamese Admin translation coverage passed: ${contentTypeCount} content types, ` +
      `${componentCount} components, ${fieldCount} fields, ${discoveredCategories.size} categories.`,
  )
}
