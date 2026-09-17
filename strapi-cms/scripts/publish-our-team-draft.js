const path = require('node:path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

process.env.PUBLIC_URL ||= process.env.STRAPI_PUBLIC_URL
process.env.HOST ||= '127.0.0.1'
process.env.PORT ||= '22345'
process.env.ADMIN_JWT_SECRET ||= process.env.STRAPI_ADMIN_JWT_SECRET
process.env.APP_KEYS ||= process.env.STRAPI_APP_KEYS
process.env.API_TOKEN_SALT ||= process.env.STRAPI_API_TOKEN_SALT
process.env.TRANSFER_TOKEN_SALT ||= process.env.STRAPI_TRANSFER_TOKEN_SALT
process.env.JWT_SECRET ||= process.env.STRAPI_JWT_SECRET
process.env.DATABASE_HOST ||= '127.0.0.1'
process.env.DATABASE_PORT ||= '15432'
process.env.DATABASE_NAME ||= process.env.POSTGRES_DB
process.env.DATABASE_USERNAME ||= process.env.POSTGRES_USER
process.env.DATABASE_PASSWORD ||= process.env.POSTGRES_PASSWORD
process.env.DATABASE_SSL ||= 'false'
process.env.DATABASE_SCHEMA ||= 'public'

const { createStrapi } = require('@strapi/strapi')

async function publishOurTeamDraft() {
  const appDir = path.resolve(__dirname, '..')
  const app = createStrapi({
    appDir,
    distDir: path.join(appDir, 'dist'),
  })
  await app.load()

  try {
    const documentService = app.documents('api::our-team.our-team')
    const draft = await documentService.findFirst({
      status: 'draft',
      populate: ['sections'],
    })

    if (!draft) {
      throw new Error('Our Team draft document was not found.')
    }

    const internationalSection = (draft.sections || []).find(
      (section) => section.__component === 'our-team.international-section',
    )

    if (!internationalSection) {
      throw new Error('The International Patients section is missing from the draft.')
    }

    await documentService.publish({ documentId: draft.documentId })
    console.log(`Published Our Team document ${draft.documentId} with section ${internationalSection.id}.`)
  } finally {
    await app.destroy()
  }
}

publishOurTeamDraft().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
