export type HomepageSectionContent = Record<string, unknown>

export type HomepageEditorialData = {
  title?: string
  metadata_title?: string
  metadata_description?: string
  hero_content?: HomepageSectionContent | null
  video_section?: HomepageSectionContent | null
  signature_procedures?: HomepageSectionContent | null
  surgical_care_process?: HomepageSectionContent | null
  maris_method?: HomepageSectionContent | null
  revision_surgery?: HomepageSectionContent | null
  doctor_assessment?: HomepageSectionContent | null
  hospital_based_surgery?: HomepageSectionContent | null
  international_patients?: HomepageSectionContent | null
  international_journey?: HomepageSectionContent | null
  patient_results?: HomepageSectionContent | null
  consultation?: HomepageSectionContent | null
  frequently_asked_questions?: unknown[] | HomepageSectionContent | null
}

export const HOMEPAGE_SECTION_ORDER = [
  'hero_content',
  'video_section',
  'signature_procedures',
  'surgical_care_process',
  'maris_method',
  'revision_surgery',
  'doctor_assessment',
  'hospital_based_surgery',
  'international_patients',
  'international_journey',
  'patient_results',
  'consultation',
  'frequently_asked_questions',
] as const

export function unwrapHomepageComponent(value: unknown): HomepageSectionContent | unknown[] | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  return (record.content as HomepageSectionContent | unknown[] | undefined) ?? record
}

export function normalizeHomepageEditorial(raw: Record<string, unknown>): HomepageEditorialData {
  const result: HomepageEditorialData = { title: typeof raw.title === 'string' ? raw.title : undefined }
  const componentFields: Record<string, string> = {
    hero_content: 'hero_section',
    video_section: 'video_section',
    signature_procedures: 'signature_procedures_section',
    surgical_care_process: 'surgical_care_process_section',
    maris_method: 'maris_method_section',
    revision_surgery: 'revision_surgery_section',
    doctor_assessment: 'doctor_assessment_section',
    hospital_based_surgery: 'hospital_based_surgery_section',
    international_patients: 'international_patients_section',
    international_journey: 'international_journey_section',
    patient_results: 'patient_results_section',
    consultation: 'consultation_section',
    frequently_asked_questions: 'frequently_asked_questions_section',
  }
  const dynamicSections = Array.isArray(raw.sections) ? raw.sections : []
  const dynamicAliases: Record<string, string> = {
    'hero-section': 'hero_content',
    'video-section': 'video_section',
    'signature-procedures-section': 'signature_procedures',
    'surgical-care-process-section': 'surgical_care_process',
    'maris-method-section': 'maris_method',
    'revision-surgery-section': 'revision_surgery',
    'doctor-assessment-section': 'doctor_assessment',
    'hospital-based-surgery-section': 'hospital_based_surgery',
    'international-patients-section': 'international_patients',
    'international-journey-section': 'international_journey',
    'patient-results-section': 'patient_results',
    'consultation-section': 'consultation',
    'frequently-asked-questions-section': 'frequently_asked_questions',
  }
  for (const section of dynamicSections) {
    if (!section || typeof section !== 'object') continue
    const uid = String((section as Record<string, unknown>).__component || '')
    const alias = dynamicAliases[uid.split('.').pop() || '']
    if (alias) (result as Record<string, unknown>)[alias] = section
  }
  for (const key of HOMEPAGE_SECTION_ORDER) {
    if ((result as Record<string, unknown>)[key]) continue
    const value = unwrapHomepageComponent(raw[componentFields[key]]) ?? unwrapHomepageComponent(raw[key])
    ;(result as Record<string, unknown>)[key] = value
  }
  result.metadata_title = typeof raw.metadata_title === 'string' ? raw.metadata_title : undefined
  result.metadata_description = typeof raw.metadata_description === 'string' ? raw.metadata_description : undefined
  return result
}
