#!/usr/bin/env node

/*
 * Adds the per-step media required by the shared homepage PlanningProcessSection
 * to the Our Team principles/process section. The migration is idempotent and
 * only updates the first editorial section marked as THE PRINCIPLES...
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

const mediaUrl = (file) => file?.url || ''
const findMedia = (files, patterns) => files.find((file) => patterns.some((pattern) => pattern.test(file.name || '')))

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

  const current = await request('/api/our-team?populate=*')
  const value = current.data
  if (!value?.documentId) throw new Error('Our Team single type was not found')

  const sections = Array.isArray(value.sections) ? value.sections : []
  const processIndex = sections.findIndex((section) =>
    section.__component === 'our-team.editorial-section' && /principles/i.test(section.eyebrow || ''),
  )
  if (processIndex < 0) throw new Error('THE PRINCIPLES BEHIND THE PRACTICE section was not found')

  const filesResponse = await request('/api/upload/files?pagination[pageSize]=1000')
  const files = Array.isArray(filesResponse) ? filesResponse : []
  const media = [
    findMedia(files, [/consultion/i, /consultation/i, /patient/i]),
    findMedia(files, [/consultion/i, /consultation/i, /doctor/i]),
    findMedia(files, [/doctor/i, /surgeon/i, /clinic/i]),
    findMedia(files, [/hospital/i, /operating/i, /theatre/i]),
    findMedia(files, [/follow/i, /recovery/i, /revision/i, /patient/i]),
  ]

  const existing = sections[processIndex]
  const existingSteps = Array.isArray(existing.steps) ? existing.steps : []
  const fallbackDescriptions = [
    "Surgery begins with understanding the patient's actual condition, medical history and previous procedures.",
    'Possible outcomes, limitations and recovery requirements are discussed honestly before a procedure is recommended.',
    'Dr. Maris remains personally involved in the consultation, planning and surgical pathway.',
    'Major procedures are performed in an accredited hospital environment with specialist support and medical infrastructure.',
    'Postoperative progress remains part of the surgical process, with clear guidance as recovery develops.',
  ]
  const fallbackTitles = ['Medical Assessment First', 'Realistic Expectations', 'Direct Responsibility', 'Hospital-Based Surgery', 'Responsible Follow-Up']
  const steps = Array.from({ length: Math.max(existingSteps.length, 5) }, (_, index) => {
    const step = existingSteps[index] || {}
    const file = media[index]
    return {
      number: step.number || String(index + 1).padStart(2, '0'),
      title: step.title || fallbackTitles[index],
      description: step.description || fallbackDescriptions[index],
      ...(step.image?.id || file?.id ? { image: step.image?.id || file.id } : {}),
      image_alt: step.image_alt || `Direct surgeon care process: ${step.title || fallbackTitles[index]}`,
    }
  })

  const nextSections = sections.map((section, index) => index === processIndex
    ? { ...section, title: section.title || 'Who will actually perform my surgery?', lead: section.lead || 'Aesthetic goals should never remove the need for medical judgment.', steps }
    : section,
  ).map((section) => {
    const copy = { ...section }
    delete copy.id
    return copy
  })

  console.log(JSON.stringify({
    documentId: value.documentId,
    processIndex,
    stepCount: steps.length,
    stepMedia: steps.map((step) => step.image || null),
    dryRun: DRY_RUN,
  }, null, 2))

  if (!DRY_RUN) {
    await request('/api/our-team', { method: 'PUT', body: JSON.stringify({ data: { sections: nextSections }, status: 'published' }) })
    console.log('[our-team] process step media migration completed')
  }
}

main().catch((error) => {
  console.error(`[our-team-process] failed: ${error.message}`)
  process.exitCode = 1
})
