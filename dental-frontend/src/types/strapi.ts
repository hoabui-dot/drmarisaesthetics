/**
 * Strapi TypeScript Types
 *
 * Type definitions for Strapi API responses and frontend data structures.
 */

// ============================================================================
// Strapi API Response Types (Raw)
// ============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: any;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
}

// ============================================================================
// Strapi Content Type Attributes
// ============================================================================

export interface PageAttributes {
  title: string;
  slug: string;
  content?: string; // Rich text content field
  cover?: StrapiMedia; // Cover image
  description?: string; // Text description
  publishDate?: string; // Publish date
  metaTitle?: string | null;
  metaDescription?: string | null;
  layout?: BlockComponent[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seo?: PageSeo;
}

export interface PageSeo {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_image?: StrapiMedia | null;
  canonical_url?: string | null;
  no_index?: boolean | null;
  no_follow?: boolean | null;
  open_graph_title?: string | null;
  open_graph_description?: string | null;
  structured_data_enabled?: boolean | null;
  structured_data_json?: unknown;
}

export type BlockComponent = HeroComponent | ServicesComponent | CTAComponent;

export interface HeroComponent {
  __component: "blocks.hero";
  id: number;
  heading: string;
  subheading: string | null;
  image: StrapiMedia;
}

export interface ServicesComponent {
  __component: "blocks.services";
  id: number;
  heading: string;
  items: ServiceItem[];
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image: StrapiMedia;
}

export interface CTAComponent {
  __component: "blocks.cta";
  id: number;
  text: string;
  buttonLabel: string;
  link: string;
}

// ============================================================================
// Strapi API Response Types (Typed)
// ============================================================================

export type StrapiPage = StrapiResponse<StrapiEntity<PageAttributes>>;
export type StrapiPages = StrapiResponse<StrapiEntity<PageAttributes>[]>;

// ============================================================================
// Frontend Types (Transformed)
// ============================================================================

export interface Page {
  id: number;
  title: string;
  slug: string;
  updatedAt?: string;
  content?: string; // Rich text content field
  cover?: Media; // Cover image
  description?: string; // Text description
  publishDate?: string; // Publish date
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaImage?: Media;
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
    openGraphTitle?: string;
    openGraphDescription?: string;
  };
  layout: Block[];
}

export type Block = HeroBlock | ServicesBlock | CTABlock;

export interface HeroBlock {
  blockType: "hero";
  heading: string;
  subheading?: string;
  image?: Media;
}

export interface ServicesBlock {
  blockType: "services";
  heading: string;
  items: {
    title: string;
    description: string;
    image?: Media;
  }[];
}

export interface CTABlock {
  blockType: "cta";
  text: string;
  buttonLabel: string;
  link: string;
}

export interface Media {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface StrapiNavigation {
  data: {
    id: number;
    documentId: string;
    navigation: NavItem[];
    logo?: any;
    ctaText?: string;
    ctaLink?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export interface NavChild {
  id: number;
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string | null;
}

export interface NavItem {
  id: number;
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string | null;
  children?: NavChild[];
}

export interface Navigation {
  navigation: NavItem[];
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  ctaText?: string;
  ctaLink?: string;
}

// ============================================================================
// Footer Types
// ============================================================================

export interface StrapiFooter {
  data: {
    id: number;
    documentId: string;
    logo?: StrapiMedia;
    description: string;
    contact_info: StrapiContactInfo;
    footer_links: FooterLink[];
    social_links: SocialLink[];
    link_groups?: FooterLinkGroup[];
    appointment_label?: string;
    appointment_href?: string;
    copyright_text?: string;
    tagline?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export interface StrapiContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  address_icon?: StrapiMedia;
  phone_icon?: StrapiMedia;
  email_icon?: StrapiMedia;
}

export interface ContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  addressIcon?: Media;
  phoneIcon?: Media;
  emailIcon?: Media;
}

export interface FooterLink {
  id: number;
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  id: number;
  heading: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  iconClass?: string;
}

export interface Footer {
  logo?: Media;
  description: string;
  contactInfo: ContactInfo;
  links: FooterLink[];
  linkGroups: FooterLinkGroup[];
  socialLinks: SocialLink[];
  appointmentLabel: string;
  appointmentHref: string;
  copyrightText?: string;
  tagline: string;
}

// ============================================================================
// News Page Types
// ============================================================================


// ============================================================================
// Homepage Types
// ============================================================================

export interface StrapiHomepage {
  data: {
    id: number;
    documentId: string;
    title: string;
    layout: HomepageBlockComponent[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export type HomepageBlockComponent =
  | HomepageVideoHeroComponent
  | HomepageHeroComponent
  | HomepageTrustComponent
  | HomepageServicesComponent
  | HomepageProcessComponent
  | HomepageDoctorComponent
  | HomepageAboutComponent
  | HomepageCombinedTestimonialResultComponent
  | HomepageResultsSectionComponent
  | HomepageTestimonialsSectionComponent
  | HomepagePressSectionComponent
  | HomepageCertificationComponent
  | HomepagePapersSectionComponent
  | HomepageFAQComponent
  | HomepageCTAComponent
  | HomepageBlogCollectionComponent
  | HomepageProofShowcaseComponent
  | HomepageTechnologyFeatureComponent
  | HomepageEquipmentShowcaseComponent
  | HomepageSocialProofComponent
  | HomepageConsultationComponent;
  
export interface HomepageProofShowcaseComponent { __component: "homepage.proof-showcase"; id: number; eyebrow?: string; title: string; description?: string; primary_image?: any; secondary_image?: any; metrics?: Array<{ id: number; value: string; suffix?: string; label: string; icon?: any }>; }
export interface HomepageTechnologyFeatureComponent { __component: "homepage.technology-feature"; id: number; eyebrow?: string; title: string; heading_line_1?: string; heading_line_2?: string; heading_accent?: string; description?: string; background_image?: any; image?: any; cta_label?: string; cta_link?: string; features?: Array<{ id: number; title: string; description?: string; icon?: any }>; technologies?: Array<{ id: number; index: number; title: string; description: string; image?: any; thumbnail?: any }>; }
export interface HomepageEquipmentShowcaseComponent { __component: "homepage.equipment-showcase"; id: number; eyebrow?: string; title: string; subtitle?: string; items?: Array<{ id: number; title: string; description?: string; image?: any; image_alt?: string; link?: string }>; }
export interface HomepageSocialProofComponent { __component: "homepage.social-proof"; id: number; eyebrow?: string; title: string; subtitle?: string; portrait?: any; reviews?: Array<{ id: number; author_name: string; quote: string; rating: number; author_meta?: string; avatar?: any }>; press_logos?: Array<{ id: number; name: string; image?: any; url?: string }>; }
export interface HomepageConsultationComponent { __component: "homepage.consultation"; id: number; title: string; description?: string; form_heading?: string; clinic_eyebrow?: string; contact_heading?: string; expert_name?: string; expert_role?: string; expert_image?: any; address?: string; phone?: string; opening_hours?: string; international_patients?: string; email?: string; submit_label?: string; help_text?: string; }

export interface HomepageVideoHeroComponent {
  __component: "homepage.video-hero";
  id: number;
  titleLines?: Array<{ id: number; text: string }>;
  subtitle: string;
  ctaText: string;
  videoMedia?: any; // Replace with precise media type if desired, using any for simplicity to match posterImage which uses any in queries
  posterImage?: any;
  mobileBackgroundImage?: any;
  isActive: boolean;
}

export interface HomepageHeroComponent {
  __component: "homepage.hero";
  id: number;
  heading: string;
  heading_line_1?: string;
  heading_line_2?: string;
  eyebrow?: string;
  subheading?: string;
  image?: any;
  background_image?: any;
  cta_label?: string;
  cta_link?: string;
  secondary_cta_label?: string;
  secondary_cta_link?: string;
  secondary_cta_action?: 'video-dialog' | 'internal-route' | 'external-url';
  secondary_cta_video_url?: string;
  trust_label?: string;
  trust_value?: string;
  trust_rating?: number;
  user_avatars?: any[];
  patient_avatars?: any[];
}

export interface HomepageServicesComponent {
  __component: "homepage.services";
  id: number;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  view_more_label?: string;
  view_more_link?: string;
  items: HomepageServiceItem[];
}

export interface HomepageServiceItem {
  id: number;
  title: string;
  description: string;
  image?: any;
  link?: string;
}

export interface HomepageAboutComponent {
  __component: "homepage.about";
  id: number;
  title: string;
  content: string;
  image?: any;
}

export interface HomepageCombinedTestimonialResultComponent {
  __component: "homepage.combined-testimonial-result";
  id: number;
  title: string;
  subtitle?: string;
  items: HomepageCombinedTestimonialResultItem[];
}

export interface HomepageCombinedTestimonialResultItem {
  id: number;
  customerName: string;
  content: string;
  rating: number;
  country?: string;
  beforeImage?: any;
  avatar?: any;
  afterImage?: any;
}

export interface HomepageResultsSectionComponent {
  __component: "homepage.results-section";
  id: number;
  eyebrow: string;
  heading: string;
  intro: string;
  stories: Array<{
    id: number;
    title: string;
    description: string;
    treatments: string[];
    before_image: any;
    after_image: any;
    patient_portrait: any;
    portrait_alt?: string;
    quote: string;
  }>;
}

export interface HomepageTestimonialsSectionComponent {
  __component: "homepage.testimonials-section";
  id: number;
  eyebrow: string;
  heading: string;
  section_image: any;
  section_image_alt?: string;
  testimonials: Array<{
    id: number;
    rating: number;
    quote: string;
    patient_name: string;
    patient_location?: string;
    patient_avatar?: any;
    patient_avatar_alt?: string;
  }>;
}

export interface HomepagePressSectionComponent {
  __component: "homepage.press-section";
  id: number;
  eyebrow: string;
  heading: string;
  logos: any[];
}

export interface HomepageCTAComponent {
  __component: "homepage.cta";
  id: number;
  heading: string;
  highlight_text?: string;
  button_label: string;
  button_link: string;
  background_image?: any;
  human_image?: any;
}

export interface HomepageBlogCollectionComponent {
  __component: "homepage.blog-collection-section";
  id: number;
  title: string;
  subtitle?: string;
  posts: any;
  layout?: "grid_2" | "grid_3" | "grid_4";
  showFeatured?: boolean;
  isActive?: boolean;
}

export interface HomepageTrustComponent {
  __component: "homepage.trust";
  id: number;
  title: string;
  subtitle?: string;
  stats: Array<{
    id: number;
    number: string;
    label: string;
    suffix?: string;
    icon?: any;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    image?: any;
  }>;
}

export interface HomepageProcessComponent {
  __component: "homepage.process";
  id: number;
  title: string;
  subtitle?: string;
  steps: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface HomepageDoctorComponent {
  __component: "homepage.doctor";
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  view_all_label?: string;
  view_all_link?: string;
  doctors: Array<{
    id: number;
    name: string;
    specialization?: string;
    bio?: string;
    image?: any;
    image_alt?: string;
    profile_link?: string;
    linkedin_url?: string;
    experience_years?: number;
    badges?: Array<{ id: number; label: string }>;
    stats?: Array<{ id: number; label: string }>;
  }>;
}

export interface HomepageCertificationComponent {
  __component: "homepage.certification";
  id: number;
  eyebrow?: string;
  heading: string;
  bundles: Array<{
    id: number;
    organization_logo?: any;
    organization_name: string;
    summary: string;
    certificate_image?: any;
    certificate_alt?: string;
  }>;
}

export interface HomepagePapersSectionComponent {
  __component: "homepage.papers-section";
  id: number;
  title: string;
  subtitle?: string;
  papers: Array<{
    id: number;
    image?: any;
    link: string;
  }>;
}

export interface HomepageFAQComponent {
  __component: "homepage.faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

// Frontend Homepage Types (Normalized)

export interface Homepage {
  title: string;
  metadataTitle?: string;
  metadataDescription?: string;
  metadataImage?: any;
  seo?: PageSeo;
  blocks: HomepageBlock[];
}

export type HomepageBlock =
  | HomepageVideoHeroBlock
  | HomepageHeroBlock
  | HomepageTrustBlock
  | HomepageServicesBlock
  | HomepageProcessBlock
  | HomepageDoctorBlock
  | HomepageAboutBlock
  | HomepageCombinedTestimonialResultBlock
  | HomepageResultsSectionBlock
  | HomepageTestimonialsSectionBlock
  | HomepagePressSectionBlock
  | HomepageCertificationBlock
  | HomepagePapersSectionBlock
  | HomepageFAQBlock
  | HomepageCTABlock
  | HomepageBlogCollectionBlock
  | HomepageProofShowcaseBlock
  | HomepageTechnologyFeatureBlock
  | HomepageEquipmentShowcaseBlock
  | HomepageSocialProofBlock
  | HomepageConsultationBlock;

export interface HomepageProofShowcaseBlock { blockType: "proof-showcase"; id: number; eyebrow?: string; title: string; headingLine1?: string; headingLine2?: string; description?: string; benefits: Array<{ id: number; label: string }>; ctaLabel?: string; ctaLink?: string; primaryTeamImage?: Media; experienceValue?: string; experienceLabel?: string; technologyImage?: Media; patientStoryImage?: Media; patientStatImage?: Media; patientStatValue?: string; patientStatLabel?: string; primaryImage?: Media; secondaryImage?: Media; metrics: Array<{ id: number; value: string; suffix?: string; label: string; icon?: Media }>; }
export interface HomepageTechnologyFeatureBlock { blockType: "technology-feature"; id: number; eyebrow?: string; title: string; headingLine1?: string; headingLine2?: string; headingAccent?: string; description?: string; backgroundImage?: Media; image?: Media; ctaLabel?: string; ctaLink?: string; features: Array<{ id: number; title: string; description?: string; icon?: Media }>; technologies: Array<{ id: number; index: number; title: string; description: string; image?: Media; thumbnail?: Media }>; }
export interface HomepageEquipmentShowcaseBlock { blockType: "equipment-showcase"; id: number; eyebrow?: string; title: string; subtitle?: string; items: Array<{ id: number; title: string; description?: string; image?: Media; imageAlt?: string; link?: string }>; }
export interface HomepageSocialProofBlock { blockType: "social-proof"; id: number; eyebrow?: string; title: string; subtitle?: string; portrait?: Media; reviews: Array<{ id: number; authorName: string; quote: string; rating: number; authorMeta?: string; avatar?: Media }>; pressLogos: Array<{ id: number; name: string; image?: Media; url?: string }>; }
export interface HomepageConsultationBlock { blockType: "consultation"; id: number; title: string; description?: string; formHeading?: string; clinicEyebrow?: string; contactHeading?: string; expertName?: string; expertRole?: string; expertImage?: Media; address?: string; phone?: string; openingHours?: string; internationalPatients?: string; email?: string; submitLabel?: string; helpText?: string; serviceOptions?: Array<{ value: string; label: string }>; }

export interface HomepageVideoHeroBlock {
  blockType: "video-hero";
  id: number;
  titleLines?: Array<{ id: number; text: string }>;
  subtitle: string;
  ctaText: string;
  videoUrl: string;
  posterImage?: Media;
  mobileBackgroundImage?: Media;
  isActive: boolean;
}

export interface HomepageHeroBlock {
  blockType: "hero";
  id: number;
  heading: string;
  headingLine1?: string;
  headingLine2?: string;
  eyebrow?: string;
  subheading?: string;
  image?: Media;
  backgroundImage?: Media;
  ctaLabel?: string;
  ctaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  secondaryCtaAction?: 'video-dialog' | 'internal-route' | 'external-url';
  secondaryCtaVideoUrl?: string;
  trustLabel?: string;
  trustValue?: string;
  trustRating?: number;
  userAvatars?: Media[];
  patientAvatars?: Media[];
}

export interface HomepageServicesBlock {
  blockType: "services";
  id: number;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  viewMoreLabel?: string;
  viewMoreLink?: string;
  items: {
    id: number;
    title: string;
    description: string;
    image?: Media;
    link?: string;
  }[];
}

export interface HomepageAboutBlock {
  blockType: "about";
  id: number;
  title: string;
  content: string;
  image?: Media;
}

export interface HomepageCombinedTestimonialResultBlock {
  blockType: "combined-testimonial-result";
  id: number;
  title: string;
  subtitle?: string;
  items: Array<{
    id: number;
    customerName: string;
    content: string;
    rating: number;
    country?: string;
    beforeImage?: Media;
    afterImage?: Media;
    avatar?: Media;
  }>;
}

export interface HomepageResultsSectionBlock {
  blockType: "results-section";
  id: number;
  eyebrow: string;
  heading: string;
  intro: string;
  stories: Array<{
    id: number;
    title: string;
    description: string;
    treatments: string[];
    beforeImage: Media;
    afterImage: Media;
    patientPortrait: Media;
    portraitAlt?: string;
    quote: string;
  }>;
}

export interface HomepageTestimonialsSectionBlock {
  blockType: "testimonials-section";
  id: number;
  eyebrow: string;
  heading: string;
  sectionImage: Media;
  sectionImageAlt?: string;
  testimonials: Array<{
    id: number;
    rating: number;
    quote: string;
    patientName: string;
    patientLocation?: string;
    patientAvatar?: Media;
    patientAvatarAlt?: string;
  }>;
}

export interface HomepagePressSectionBlock {
  blockType: "press-section";
  id: number;
  eyebrow: string;
  heading: string;
  logos: Media[];
}

export interface HomepageCTABlock {
  blockType: "cta";
  id: number;
  heading: string;
  subheading?: string;
  highlightText?: string;
  buttonLabel: string;
  buttonLink: string;
  backgroundImage?: Media;
  humanImage?: Media;
}

export interface HomepageTrustBlock {
  blockType: "trust";
  id: number;
  title: string;
  subtitle?: string;
  stats: Array<{
    id: number;
    number: string;
    label: string;
    suffix?: string;
    icon?: Media;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    image?: Media;
  }>;
}

export interface HomepageProcessBlock {
  blockType: "process";
  id: number;
  title: string;
  subtitle?: string;
  steps: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface HomepageDoctorBlock {
  blockType: "doctor";
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllLink?: string;
  doctors: Array<{
    id: number;
    name: string;
    specialization?: string;
    bio?: string;
    image?: Media;
    imageAlt?: string;
    profileLink?: string;
    experienceYears?: number;
    badges: string[];
    stats: string[];
  }>;
}

export interface HomepageCertificationBlock {
  blockType: "certification";
  id: number;
  eyebrow?: string;
  heading: string;
  bundles: Array<{
    id: number;
    organizationLogo?: Media;
    organizationName: string;
    summary: string;
    certificateImage?: Media;
    certificateAlt?: string;
  }>;
}

export interface HomepagePapersSectionBlock {
  blockType: "papers-section";
  id: number;
  title: string;
  subtitle?: string;
  papers: Array<{
    id: number;
    image?: Media;
    link: string;
  }>;
}

export interface HomepageFAQBlock {
  blockType: "faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

export interface HomepageBlogCollectionBlock {
  blockType: "blog-collection-section";
  id: number;
  title: string;
  subtitle?: string;
  posts: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
      excerpt?: string;
      coverImage?: StrapiMedia;
      publishedAt: string;
    };
  }>;
  showFeatured?: boolean;
  isActive?: boolean;
}

// ============================================================================
// Contact Method Types
// ============================================================================

export interface StrapiContactMethod {
  id: number;
  documentId: string;
  type: string;
  label: string;
  href: string;
  icon?: StrapiMedia;
  color?: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiContactMethods {
  data: StrapiContactMethod[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ContactMethod {
  id: number;
  type: string;
  label: string;
  href: string;
  icon?: Media;
  iconUrl?: string;
  color?: string;
  order: number;
  isActive: boolean;
}
