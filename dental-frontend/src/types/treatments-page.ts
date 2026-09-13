export type TreatmentPageItem = {
  number?: string
  title: string
  description?: string
}

export type TreatmentPageSection = {
  sectionKey: string
  eyebrow?: string
  title: string
  lead?: string
  paragraphOne?: string
  paragraphTwo?: string
  image?: string
  imageAlt?: string
  items: TreatmentPageItem[]
}

export type TreatmentPageData = {
  hero: {
    eyebrow?: string
    title: string
    description?: string
    reviewLabel?: string
    image?: string
    imageAlt?: string
  }
  sections: TreatmentPageSection[]
}
