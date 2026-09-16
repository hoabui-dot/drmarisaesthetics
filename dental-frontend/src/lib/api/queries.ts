/**
 * API Query Functions
 *
 * High-level functions for fetching data from the CMS API.
 * Handles API communication and data transformation.
 */

import { apiClient } from "./client";
import { transformPage } from "./transformers";
import type {
  Page,
  StrapiPages,
  StrapiPage,
  Navigation,
  StrapiNavigation,
  Footer,
  StrapiFooter,
  Homepage,
  StrapiHomepage,
  HomepageVideoHeroComponent,
  HomepageHeroComponent,
  HomepageServicesComponent,
  HomepageAboutComponent,
  HomepageCombinedTestimonialResultComponent,
  HomepageResultsSectionComponent,
  HomepageTestimonialsSectionComponent,
  HomepagePressSectionComponent,
  HomepageCTAComponent,
  HomepageTrustComponent,
  HomepageProcessComponent,
  HomepageDoctorComponent,
  HomepageFAQComponent,
  HomepageBlogCollectionComponent,
  HomepageBlock,
  HomepageBlockComponent,
  HomepageProofShowcaseComponent,
  HomepageTechnologyFeatureComponent,
  HomepageEquipmentShowcaseComponent,
  HomepageConsultationComponent,
  HomepageCertificationComponent,
} from "@/src/types/strapi";
import { normalizeHomepageEditorial, type HomepageEditorialData } from "@/src/types/homepage-editorial";
import { ourTeamMockData, type OurTeamData } from "@/src/data/our-team";
import { resultsMockData, type ResultsData } from "@/src/data/results";
import type { WebsiteSetting } from "@/src/types/strapi";
import type { TreatmentPageData, TreatmentPageItem, TreatmentPageSection } from "@/src/types/treatments-page";

/**
 * Fetches the editorial homepage section components. This is deliberately
 * separate from the legacy dynamic-zone getHomepage() transformer so the
 * Stitch homepage can evolve without coupling to the old block API.
 */
export async function getHomepageEditorial(isDraftMode = false): Promise<HomepageEditorialData | null> {
  try {
    const response = await apiClient<{ data?: Record<string, unknown> }>("/api/homepage", {
      params: { populate: "*" },
      isDraftMode,
      tags: ["homepage"],
    });
    if (!response.data) return null;
    return normalizeHomepageEditorial(response.data);
  } catch (error) {
    console.warn("[getHomepageEditorial] Falling back to the local homepage content", error);
    return null;
  }
}

export async function getTreatmentsPage(isDraftMode = false): Promise<TreatmentPageData | null> {
  try {
    const response = await apiClient<{ data?: any }>("/api/treatments-page", {
      params: { populate: "*" },
      isDraftMode,
      tags: ["treatments-page"],
    });
    const components = Array.isArray(response.data?.sections) ? response.data.sections : [];
    const heroComponent = components.find((item: any) => item.__component === "treatments-page.hero-section") ?? {};
    const sections: TreatmentPageSection[] = components
      .filter((item: any) => item.__component === "treatments-page.editorial-section")
      .map((item: any) => ({
        sectionKey: item.section_key,
        eyebrow: item.eyebrow || undefined,
        title: item.title,
        lead: item.lead || undefined,
        paragraphOne: item.paragraph_one || undefined,
        paragraphTwo: item.paragraph_two || undefined,
        image: item.image ? getMediaUrl(item.image) : undefined,
        imageAlt: item.image_alt || undefined,
        items: Array.isArray(item.items) ? item.items.map((entry: any): TreatmentPageItem => ({
          number: entry.number || undefined,
          title: entry.title,
          description: entry.description || undefined,
        })) : [],
      }));
    if (!heroComponent.title && !sections.length) return null;
    return {
      hero: {
        eyebrow: heroComponent.eyebrow || undefined,
        title: heroComponent.title || "Rhinoplasty Surgery in Vietnam",
        description: heroComponent.description || undefined,
        reviewLabel: heroComponent.review_label || undefined,
        image: heroComponent.image ? getMediaUrl(heroComponent.image) : undefined,
        imageAlt: heroComponent.image_alt || undefined,
      },
      sections,
    };
  } catch (error) {
    console.warn("[getTreatmentsPage] Falling back to local treatments content", error);
    return null;
  }
}

// Helper to prevent JSON strings from being rendered as text descriptions
function cleanDescription(desc: any): string | undefined {
  if (!desc) return undefined;
  // If it's not a string, it shouldn't be rendered as a description/subtitle
  if (typeof desc !== 'string') return undefined;

  // More aggressive HTML stripping
  const cleaned = desc.trim().replace(/^<p>/g, '').replace(/<\/p>$/g, '').trim();

  // If description looks like JSON, it's likely a malformed migration/dump
  // We check for common JSON starting characters
  if (cleaned.startsWith("{") || cleaned.startsWith("[")) {
    try {
      JSON.parse(cleaned);
      return undefined; // Hide it if it's valid JSON
    } catch (e) {
      // If it fails to parse but still looks very much like a JSON dump, 
      // check for common patterns like {"hero": or {"badge":
      if (cleaned.includes('{"hero":') || cleaned.includes('{"badge":')) {
        return undefined;
      }
      return desc;
    }
  }
  return desc;
}

/**
 * Get a page by slug
 *
 * Fetches a single page from the CMS using slug filter.
 * Uses populate=* to include all first-level relations
 *
 * @param slug - Page slug (e.g., "dental-implants")
 * @param isDraftMode - Whether to fetch draft content (for preview)
 * @returns Transformed page data or null if not found
 */
export async function getPageBySlug(
  slug: string,
  isDraftMode: boolean = false,
): Promise<Page | null> {
  try {
    // Query API with filters and populate
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "*",
      },
      isDraftMode,
      tags: ["pages", "page"], // Cache tags for revalidation
    });

    // API returns array even for single result
    if (!response.data || response.data.length === 0) {
      console.warn(`Page not found: ${slug}`);
      return null;
    }

    // Transform first result from API format to frontend format
    const strapiPage: StrapiPage = {
      data: response.data[0],
      meta: response.meta,
    };

    return transformPage(strapiPage);
  } catch (error) {
    return null;
  }
}

/**
 * Get all page slugs
 *
 * Used for static generation (generateStaticParams).
 * Only fetches slug field for performance.
 * Only fetches published pages for production builds.
 *
 * @returns Array of page slugs
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    // Only fetch slug field for performance
    // Only fetch published pages (not drafts) - Strapi v5 uses status=published
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "fields[0]": "slug",
        status: "published", // Strapi v5: Only published pages for static generation
      },
      tags: ["pages"], // Cache tag for revalidation
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Extract slugs from response
    // Handle both Strapi v4 (page.attributes.slug) and v5 (page.slug)
    return response.data
      .map((page) => {
        // Type assertion for v5 flat structure
        const pageData = page as any;
        return page.attributes?.slug || pageData.slug;
      })
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    return [];
  }
}

/**
 * Get all pages
 *
 * Fetches multiple pages with full data.
 * Used for homepage listing or sitemap generation.
 *
 * @param limit - Maximum number of pages to return (default: 10)
 * @returns Array of transformed pages
 */
export async function getAllPages(limit: number = 10): Promise<Page[]> {
  try {
    // Fetch pages with pagination and populate
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "pagination[limit]": limit,
        populate: "*",
        sort: "createdAt:desc", // Newest first
      },
      tags: ["pages"], // Cache tag for revalidation
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Transform all pages
    return response.data.map((page) => {
      const strapiPage: StrapiPage = {
        data: page,
        meta: response.meta,
      };
      return transformPage(strapiPage);
    });
  } catch (error) {
    return [];
  }
}

/** Return the canonical service list used by all appointment forms. */
export async function getServiceOptions(): Promise<Array<{ value: string; label: string }>> {
  try {
    const response = await apiClient<any>("/api/services", {
      params: {
        "filters[category][$eq]": "Plastic Surgery",
        pagination: { pageSize: 100 },
        sort: ["title:asc"],
      },
      isDraftMode: false,
      tags: ["services"],
    });
    return (response?.data || [])
      .filter((service: any) => service.slug && service.title)
      .map((service: any) => ({ value: service.slug, label: service.title }));
  } catch {
    return [];
  }
}

/** Fetch the Strapi single type that powers the Stitch Our Team page. */
export async function getOurTeam(isDraftMode: boolean = false): Promise<OurTeamData | null> {
  try {
    const response = await apiClient<any>("/api/our-team", {
      // Dynamic-zone component fields and nested repeatable components are
      // intentionally populated here. Without this, the Content Manager can
      // contain the data while the frontend receives only component shells.
      params: { populate: "*" },
      isDraftMode,
      tags: ["our-team"],
    });
    const value = response?.data;
    if (!value) return null;
    const sections = Array.isArray(value.sections) ? value.sections : [];
    const hero = sections.find((section: any) => section.__component === "our-team.hero-section");
    const revision = sections.find((section: any) => section.__component === "our-team.revision-section");
    const professional = sections.find((section: any) => section.__component === "our-team.professional-section");
    const international = sections.find((section: any) => section.__component === "our-team.international-section");
    const journey = sections.find((section: any) => section.__component === "our-team.journey-section");
    const consultation = sections.find((section: any) => /consultation/i.test(section.eyebrow || section.title || ""));
    const faq = sections.find((section: any) => section.__component === "our-team.faq-section");
    const authority = sections.find((section: any) => section.__component === "our-team.authority-section");
    const credentials = sections.find((section: any) => section.__component === "our-team.credentials-section");
    const hospital = sections.find((section: any) => section.__component === "our-team.hospital-section");
    const image = (media: any) => getMediaUrl(media) || undefined;
    const steps = (items: any[] = []) => items.map((step: any, index: number) => ({
      number: step.number || String(index + 1).padStart(2, "0"),
      title: step.title || "",
      description: step.description || "",
      image: image(step.image),
      imageAlt: step.image_alt || "",
    })).filter((step: any) => step.title);
    return {
      ...ourTeamMockData,
      authority: authority ? {
        eyebrow: authority.eyebrow || ourTeamMockData.authority.eyebrow,
        title: authority.title || ourTeamMockData.authority.title,
        description: authority.description || ourTeamMockData.authority.description,
        cards: (authority.cards || []).map((card: any) => ({ title: card.title || "", items: (card.items || []).map((item: any) => item.label || item.title || "").filter(Boolean) })),
      } : ourTeamMockData.authority,
      credentials: credentials ? {
        eyebrow: credentials.eyebrow || ourTeamMockData.credentials.eyebrow,
        title: credentials.title || ourTeamMockData.credentials.title,
        description: credentials.description || ourTeamMockData.credentials.description,
        rows: (credentials.rows || []).map((row: any) => ({ label: row.label || "", value: row.value || "" })).filter((row: any) => row.label && row.value),
      } : ourTeamMockData.credentials,
      hospital: hospital ? {
        eyebrow: hospital.eyebrow || ourTeamMockData.hospital.eyebrow,
        title: hospital.title || ourTeamMockData.hospital.title,
        description: hospital.description || ourTeamMockData.hospital.description,
        image: image(hospital.image) || ourTeamMockData.hospital.image,
        imageAlt: hospital.image_alt || ourTeamMockData.hospital.imageAlt,
        proofItems: (hospital.proof_items || []).map((item: any) => item.label || item.title || "").filter(Boolean),
      } : ourTeamMockData.hospital,
      professional: professional ? {
        eyebrow: professional.eyebrow || "PROFESSIONAL JOURNEY",
        title: professional.title || "Experience Across Cosmetic Surgery & Hospital Environments",
        lead: professional.lead || "A surgeon's professional journey is built through disciplined training, hospital experience and responsibility for every patient.",
        description: professional.description || "",
        steps: steps(professional.steps),
        image: image(professional.image),
        imageAlt: professional.image_alt || "Modern premium clinic hallway in Ho Chi Minh City",
      } : ourTeamMockData.professional,
      professionalImage: image(professional?.image) || ourTeamMockData.professionalImage,
      hero: hero ? {
        ...ourTeamMockData.hero,
        eyebrow: hero.eyebrow || ourTeamMockData.hero.eyebrow,
        title: hero.title || ourTeamMockData.hero.title,
        paragraphs: [hero.paragraph_one, hero.paragraph_two].filter(Boolean),
        image: image(hero.image) || ourTeamMockData.hero.image,
        imageAlt: hero.image_alt || ourTeamMockData.hero.imageAlt,
      } : ourTeamMockData.hero,
      revision: revision ? {
        ...ourTeamMockData.revision,
        eyebrow: revision.eyebrow || ourTeamMockData.revision.eyebrow,
        title: revision.title || ourTeamMockData.revision.title,
        description: revision.description || ourTeamMockData.revision.description,
        calloutTitle: revision.callout_title || ourTeamMockData.revision.calloutTitle,
        calloutDescription: revision.callout_description || ourTeamMockData.revision.calloutDescription,
        concerns: (revision.concerns || []).map((item: any) => ({ title: item.label || item.title || "", description: item.description || "" })),
        image: image(revision.image) || ourTeamMockData.revision.image,
        imageAlt: revision.image_alt || ourTeamMockData.revision.imageAlt,
      } : ourTeamMockData.revision,
      internationalImage: image(international?.image) || ourTeamMockData.internationalImage,
      internationalPatients: international ? { ...ourTeamMockData.internationalPatients, eyebrow: international.eyebrow || ourTeamMockData.internationalPatients.eyebrow, title: international.title || ourTeamMockData.internationalPatients.title, description: international.description || ourTeamMockData.internationalPatients.description, steps: international.steps || ourTeamMockData.internationalPatients.steps } : ourTeamMockData.internationalPatients,
      journey: journey ? { ...ourTeamMockData.journey, eyebrow: journey.eyebrow || ourTeamMockData.journey.eyebrow, title: journey.title || ourTeamMockData.journey.title, description: journey.description || ourTeamMockData.journey.description, steps: journey.steps || ourTeamMockData.journey.steps } : ourTeamMockData.journey,
      consultation: consultation ? { ...ourTeamMockData.consultation, title: consultation.title || ourTeamMockData.consultation.title, description: consultation.description || ourTeamMockData.consultation.description } : ourTeamMockData.consultation,
      faq: faq ? { ...ourTeamMockData.faq, eyebrow: faq.eyebrow || ourTeamMockData.faq.eyebrow, title: faq.title || ourTeamMockData.faq.title, backgroundImage: image(faq.background_image), items: (faq.items || []).map((item: any) => ({ question: item.question, answer: item.answer })) } : ourTeamMockData.faq,
    };
  } catch (error) {
    console.warn("[getOurTeam] Unable to fetch Our Team data", error);
    return null;
  }
}

/** Fetch the Strapi single type that powers the Stitch Results page. */
export async function getResults(isDraftMode: boolean = false): Promise<ResultsData | null> {
  try {
    const response = await apiClient<any>("/api/result", {
      params: { status: isDraftMode ? "draft" : "published" },
      isDraftMode,
      cache: "no-store",
      tags: ["results"],
    });
    const value = response?.data;
    if (!value) return null;
    return {
      title: value.title || resultsMockData.title,
      introduction: value.introduction || resultsMockData.introduction,
      cases: (value.cases || []).map((item: any) => {
        const fallbackCase = resultsMockData.cases.find((candidate) => candidate.caseNumber === (item.case_number || item.caseNumber));
        return {
        caseNumber: item.case_number || item.caseNumber || "",
        // Repeatable Strapi components do not always expose their own
        // timestamps. In that case the uploaded composite image timestamp is
        // the closest stable creation signal for the Results API ordering.
        createdAt: item.createdAt || item.created_at || item.image?.createdAt || item.image?.created_at || undefined,
        category: item.category,
        title: item.title || "",
        subtitle: item.subtitle || "",
        image: getMediaUrl(item.image || item.composite_image) || fallbackCase?.image || "",
        imageAlt: item.image_alt || item.imageAlt || `Composite before and after result for ${item.title || "this patient"}`,
        profile: item.profile || "",
        recovery: item.recovery || "",
        };
      }).filter((item: any) => item.image),
      disclaimerLabel: value.disclaimer_label || value.disclaimerLabel || resultsMockData.disclaimerLabel,
      disclaimer: value.disclaimer || resultsMockData.disclaimer,
      ctaTitle: value.cta_title || value.ctaTitle || resultsMockData.ctaTitle,
      ctaDescription: value.cta_description || value.ctaDescription || resultsMockData.ctaDescription,
    };
  } catch (error) {
    console.warn("[getResults] Unable to fetch Results data", error);
    return null;
  }
}

/** Fetch the single source of truth for reusable website identity/contact data. */
export async function getWebsiteSetting(isDraftMode: boolean = false): Promise<WebsiteSetting | null> {
  try {
    const response = await apiClient<any>("/api/website-setting", {
      params: {
        "populate[logo]": "true",
        "populate[favicon]": "true",
        "populate[default_open_graph_image]": "true",
        "populate[contact_methods][populate][icon]": "true",
        "populate[social_links]": "true",
        "populate[booking_form][populate][visual_image]": "true",
        "populate[booking_form][populate][visual_points]": "true",
        status: isDraftMode ? "draft" : "published",
      },
      isDraftMode,
      cache: "no-store",
      tags: ["website-setting"],
    });
    const value = response?.data;
    if (!value) return null;
    return {
      siteName: value.site_name || "DR. MARIS AESTHETICS",
      siteNameLocalized: value.site_name_localized,
      logo: value.logo ? { url: getMediaUrl(value.logo), alt: value.logo.alternativeText || value.site_name, width: value.logo.width || 0, height: value.logo.height || 0 } : undefined,
      favicon: value.favicon ? { url: getMediaUrl(value.favicon), alt: value.favicon.alternativeText || value.site_name, width: value.favicon.width || 0, height: value.favicon.height || 0 } : undefined,
      defaultOpenGraphImage: value.default_open_graph_image ? { url: getMediaUrl(value.default_open_graph_image), alt: value.default_open_graph_image.alternativeText || value.site_name, width: value.default_open_graph_image.width || 0, height: value.default_open_graph_image.height || 0 } : undefined,
      address: value.address || "",
      phonePrimary: value.phone_primary || "",
      openingHours: value.opening_hours,
      website: value.website,
      mapLatitude: value.map_latitude == null ? undefined : Number(value.map_latitude),
      mapLongitude: value.map_longitude == null ? undefined : Number(value.map_longitude),
      mapZoom: value.map_zoom == null ? undefined : Number(value.map_zoom),
      contactMethods: (value.contact_methods || []).filter((item: any) => item.is_active !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any) => ({ ...item, isActive: item.is_active !== false, icon: item.icon ? { url: getMediaUrl(item.icon), alt: item.icon.alternativeText || item.label, width: item.icon.width || 0, height: item.icon.height || 0 } : undefined })),
      socialLinks: (value.social_links || []).filter((item: any) => item.is_active !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any) => ({ ...item, iconClass: item.icon_class, isActive: item.is_active !== false })),
      globalCta: value.global_cta ? {
        eyebrow: value.global_cta.eyebrow || "BEGIN YOUR JOURNEY",
        title: value.global_cta.title || "Your case deserves a surgical plan built around you.",
        editorialLead: value.global_cta.editorial_lead || undefined,
        description: value.global_cta.description || undefined,
        buttonLabel: value.global_cta.button_label || "Start Your Consultation",
        panelEyebrow: value.global_cta.panel_eyebrow || "PRIVATE CONSULTATION",
        panelTitle: value.global_cta.panel_title || "Begin with a clinical review.",
        panelDescription: value.global_cta.panel_description || undefined,
        steps: Array.isArray(value.global_cta.steps) ? value.global_cta.steps.map((step: any) => ({ number: step.number, label: step.label })) : [],
        backgroundImage: value.global_cta.background_image ? getMediaUrl(value.global_cta.background_image) : undefined,
      } : undefined,
      bookingForm: value.booking_form ? {
        visualImage: (value.booking_form.visual_image || value.global_cta?.background_image) ? { url: getMediaUrl(value.booking_form.visual_image || value.global_cta.background_image), alt: (value.booking_form.visual_image || value.global_cta.background_image).alternativeText || value.site_name, width: (value.booking_form.visual_image || value.global_cta.background_image).width || 0, height: (value.booking_form.visual_image || value.global_cta.background_image).height || 0 } : undefined,
        visualEyebrow: value.booking_form.visual_eyebrow || "DIRECT SURGEON CARE",
        visualTitle: value.booking_form.visual_title || "Your case is reviewed before you travel.",
        visualDescription: value.booking_form.visual_description || undefined,
        visualPoints: Array.isArray(value.booking_form.visual_points) ? value.booking_form.visual_points.map((point: any) => ({ id: point.id, label: point.label })).filter((point: any) => point.label) : [],
        formEyebrow: value.booking_form.form_eyebrow || "PRIVATE CONSULTATION",
        formTitle: value.booking_form.form_title || "Tell us about your case.",
        formDescription: value.booking_form.form_description || undefined,
        privacyText: value.booking_form.privacy_text || undefined,
        successEyebrow: value.booking_form.success_eyebrow || "CASE RECEIVED",
        successTitle: value.booking_form.success_title || "Your case has been received.",
        successDescription: value.booking_form.success_description || undefined,
        successActionLabel: value.booking_form.success_action_label || undefined,
        successActionHref: value.booking_form.success_action_href || undefined,
        submitLabel: value.booking_form.submit_label || "Submit Case for Review",
        submittingLabel: value.booking_form.submitting_label || "Sending…",
        procedurePlaceholder: value.booking_form.procedure_placeholder || "Select an area or procedure",
        messagePlaceholder: value.booking_form.message_placeholder || "Tell us what you would like help understanding.",
      } : undefined,
    };
  } catch (error) {
    console.warn("[getWebsiteSetting] Unable to fetch website settings", error);
    return null;
  }
}

/**
 * Get media URL
 *
 * Extracts full URL from CMS media object.
 * Handles both relative and absolute URLs.
 *
 * @param media - Media object from CMS
 * @param size - Image size (optional, for compatibility)
 * @returns Full media URL or empty string
 */
export function getMediaUrl(media: any, size?: string): string {
  if (!media) return "";

  if (typeof media === "string") {
    // The About page adapter already normalizes CMS media to the frontend
    // proxy path. Keep the resolver idempotent so callers can safely pass
    // either raw Strapi paths or an already-normalized URL.
    if (media.startsWith("/api/strapi-media/")) return media;
    return media.startsWith("/") ? `/api/strapi-media${media}` : media;
  }

  // Handle different media object structures
  let url = "";

  // Case 1: Direct media object with url
  const source = Array.isArray(media) ? media[0] : media;
  if (!source) return "";

  // Strapi v5 may return a media entity directly, nested in `data`, or in
  // the v4-compatible `data.attributes` shape. Resolve all supported shapes
  // here so page adapters do not need to know which API response was used.
  const entity = source.data && !Array.isArray(source.data) ? source.data : source;
  const attributes = entity.attributes && typeof entity.attributes === "object" ? entity.attributes : entity;
  const formats = attributes.formats || entity.formats || source.formats;

  if (size && formats?.[size]?.url) {
    url = formats[size].url;
  } else if (attributes.url) {
    url = attributes.url;
  } else if (entity.url) {
    url = entity.url;
  }

  if (!url && source.url) {
    url = source.url;
  }

  if (!url) return "";

  // If URL is relative, prepend API URL
  if (url.startsWith("/")) {
    // Keep uploaded media on the frontend origin. The proxy fetches it from
    // STRAPI_URL internally, so Next Image can optimize local Docker uploads
    // without trying to reach localhost:1337 from inside the frontend.
    return `/api/strapi-media${url}`;
  }

  // Already absolute URL
  return url;
}

/**
 * Get media alt text
 *
 * Extracts alt text from CMS media object.
 * Falls back to provided fallback text.
 *
 * @param media - Media object from CMS
 * @param fallback - Fallback text if alt is not available
 * @returns Alt text or fallback
 */
export function getMediaAlt(media: any, fallback: string = ""): string {
  if (!media) return fallback;

  // Handle different media object structures
  let alt = "";

  // Case 1: Direct media object with alternativeText
  if (media.alternativeText) {
    alt = media.alternativeText;
  }
  // Case 2: Nested in data.attributes
  else if (media.data?.attributes?.alternativeText) {
    alt = media.data.attributes.alternativeText;
  }
  // Case 3: Array of media (take first)
  else if (Array.isArray(media) && media[0]?.alternativeText) {
    alt = media[0].alternativeText;
  }

  return alt || fallback;
}

/**
 * Get navigation menu
 *
 * Fetches navigation menu from CMS.
 * Navigation is a Single Type with repeatable nav items that support dropdown children.
 *
 * @returns Navigation object with items, logo, and CTA
 */
export async function getNavigation(): Promise<Navigation> {
  try {
    // Fetch navigation from Strapi with nested populate for children
    // Strapi v5 requires explicit populate syntax for nested components
    const response = await apiClient<StrapiNavigation>("/api/navigation", {
      params: {
        "populate[navigation][populate][children]": "true",
        "populate[logo]": "true",
      },
      tags: ["navigation"], // Cache tag for revalidation
    });

    // Handle missing or empty data
    if (!response.data || !response.data.navigation) {
      console.warn("[getNavigation] No navigation data found");
      return { navigation: [] };
    }

    // Normalize data: extract navigation items with children
    const hiddenHeaderItems = new Set(['pricing', 'technology']);
    const navigation = response.data.navigation
      .filter((item) => {
        const label = (item.label || '').trim().toLowerCase();
        const href = (item.href || '').trim().toLowerCase().replace(/^\//, '');
        return !hiddenHeaderItems.has(label) && !hiddenHeaderItems.has(href);
      })
      .map((item) => {
      return {
        id: item.id,
        label: item.label || "",
        href: item.href || "#",
        isExternal: item.isExternal || false,
        icon: item.icon || null,
        children: item.children
          ? item.children.map((child) => ({
            id: child.id,
            label: child.label || "",
            href: child.href || "#",
            isExternal: child.isExternal || false,
            icon: child.icon || null,
          }))
          : undefined,
      };
    });

    const result = {
      navigation,
      logo: response.data.logo
        ? {
          url: getMediaUrl(response.data.logo),
          alt: getMediaAlt(response.data.logo, ""),
          width: 0,
          height: 0,
        }
        : undefined,
      ctaText: response.data.ctaText || undefined,
      ctaLink: response.data.ctaLink || undefined,
    };

    return result;
  } catch (error) {
    return { navigation: [] };
  }
}

/**
 * Get footer content
 *
 * Fetches footer content from CMS.
 * Footer is a Single Type with contact info, links, and social links.
 *
 * @returns Footer object with all footer data
 */
export async function getFooter(): Promise<Footer> {
  try {
    // Fetch footer from Strapi
    const response = await apiClient<StrapiFooter>("/api/footer", {
      params: {
        "populate[logo]": "true",
        "populate[contact_info][populate][address_icon]": "true",
        "populate[contact_info][populate][phone_icon]": "true",
        "populate[contact_info][populate][email_icon]": "true",
        "populate[footer_links]": "true",
        "populate[link_groups][populate][links]": "true",
        "populate[social_links]": "true",
      },
      tags: ["footer"], // Cache tag for revalidation
    });

    // Handle missing data
    if (!response.data) {
      console.warn("[getFooter] No footer data found");
      return {
        description: "",
        contactInfo: { id: 0, address: "", phone: "", email: "" },
        links: [],
        linkGroups: [],
        socialLinks: [],
        appointmentLabel: "BOOK APPOINTMENT",
        appointmentHref: "/#home-booking",
        tagline: "Designed with care for your smile.",
      };
    }

    // Normalize data
    const footer: Footer = {
      logo: response.data.logo
        ? {
          url: getMediaUrl(response.data.logo),
          alt: getMediaAlt(response.data.logo, ""),
          width: 0,
          height: 0,
        }
        : undefined,
      description: cleanDescription(response.data.description) || "",
      contactInfo: response.data.contact_info
        ? {
          id: response.data.contact_info.id,
          address: response.data.contact_info.address,
          phone: response.data.contact_info.phone,
          email: response.data.contact_info.email,
          addressIcon: response.data.contact_info.address_icon?.data
            ? {
              url: getMediaUrl(response.data.contact_info.address_icon),
              alt: "",
              width: 0,
              height: 0,
            }
            : undefined,
          phoneIcon: response.data.contact_info.phone_icon?.data
            ? {
              url: getMediaUrl(response.data.contact_info.phone_icon),
              alt: "",
              width: 0,
              height: 0,
            }
            : undefined,
          emailIcon: response.data.contact_info.email_icon?.data
            ? {
              url: getMediaUrl(response.data.contact_info.email_icon),
              alt: "",
              width: 0,
              height: 0,
            }
            : undefined,
        }
        : {
          id: 0,
          address: "",
          phone: "",
          email: "",
        },
      links: response.data.footer_links || [],
      linkGroups: response.data.link_groups || [],
      socialLinks: response.data.social_links || [],
      appointmentLabel: response.data.appointment_label || "BOOK APPOINTMENT",
      appointmentHref: response.data.appointment_href || "/#home-booking",
      copyrightText: response.data.copyright_text,
      tagline: response.data.tagline || "Designed with care for your smile.",
    };

    return footer;
  } catch (error) {
    return {
      description: "",
      contactInfo: { id: 0, address: "", phone: "", email: "" },
      links: [],
      linkGroups: [],
      socialLinks: [],
      appointmentLabel: "BOOK APPOINTMENT",
      appointmentHref: "/#home-booking",
      tagline: "Designed with care for your smile.",
    };
  }
}

/**
 * Get homepage content
 *
 * Fetches homepage with dynamic layout blocks from CMS.
 * Homepage is a Single Type with a Dynamic Zone for flexible layouts.
 *
 * @returns Homepage object with normalized blocks
 */
export async function getHomepage(isDraftMode: boolean = false): Promise<Homepage> {
  try {
    // Fetch homepage from Strapi
    // Custom controller handles all population automatically
    const response = await apiClient<StrapiHomepage>("/api/homepage", {
      params: {},
      isDraftMode,
      tags: ["homepage"],
    });

    // Handle missing data
    if (!response.data) {
      console.warn("[getHomepage] No homepage data found");
      return {
        title: "Homepage",
        visualTheme: 'clinical-blue',
        metadataTitle: undefined,
        metadataDescription: undefined,
        metadataImage: undefined,
        seo: undefined,
        blocks: [],
      };
    }

    // Strapi v5 custom controller returns array, extract first item
    const data = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    if (!data) {
      console.warn("[getHomepage] No homepage data in response");
      return {
        title: "Homepage",
        visualTheme: 'clinical-blue',
        metadataTitle: undefined,
        metadataDescription: undefined,
        metadataImage: undefined,
        seo: undefined,
        blocks: [],
      };
    }

    // Articles are sourced from the canonical Blog collection. The homepage
    // block only controls presentation and does not duplicate article data.
    let canonicalBlogPosts: any[] = [];
    if ((data.layout || []).some((block: HomepageBlockComponent) => block.__component === "homepage.blog-collection-section")) {
      try {
        const blogResponse = await apiClient<any>("/api/blogs", {
          params: { "populate[coverImage]": "true", sort: "publishedAt:desc", "pagination[limit]": 12 },
          isDraftMode,
          tags: ["blogs"],
        });
        canonicalBlogPosts = (blogResponse.data || []).map((post: any) => {
          const postData = post.attributes || post;
          const rawMedia = postData.coverImage || postData.imageCover;
          const mediaData = rawMedia?.data?.attributes || rawMedia;
          return {
            id: post.id,
            documentId: post.documentId,
            ...postData,
            imageUrl: mediaData?.url || null,
            imageAlt: mediaData?.alternativeText || postData.title || "",
          };
        });
      } catch {
        canonicalBlogPosts = [];
      }
    }

    let homepageServiceOptions: Array<{ value: string; label: string }> = [];
    if ((data.layout || []).some((block: HomepageBlockComponent) => block.__component === "homepage.consultation")) {
      try {
        const servicesResponse = await apiClient<any>("/api/services", {
          params: {
            "filters[category][$eq]": "Plastic Surgery",
            pagination: { pageSize: 100 },
            sort: ["title:asc"],
          },
          isDraftMode,
          tags: ["services"],
        });
        homepageServiceOptions = (servicesResponse.data || [])
          .filter((service: any) => service.slug && service.title)
          .map((service: any) => ({ value: service.slug, label: service.title }));
      } catch {
        homepageServiceOptions = [];
      }
    }

    // Normalize blocks: convert __component to blockType
    const blocks = (data.layout || [])
      .map((block: HomepageBlockComponent) => {
        const componentType = block.__component.split(".")[1];

        switch (componentType) {
          case "video-hero":
            return {
              blockType: "video-hero" as const,
              id: block.id,
              titleLines:
                (block as HomepageVideoHeroComponent).titleLines || [],
              subtitle: cleanDescription((block as HomepageVideoHeroComponent).subtitle),
              ctaText: (block as HomepageVideoHeroComponent).ctaText,
              videoUrl: (block as HomepageVideoHeroComponent).videoMedia 
                ? getMediaUrl((block as HomepageVideoHeroComponent).videoMedia) 
                : "",
              posterImage: (block as HomepageVideoHeroComponent).posterImage
                ? {
                  url: getMediaUrl(
                    (block as HomepageVideoHeroComponent).posterImage,
                  ),
                  alt: getMediaAlt(
                    (block as HomepageVideoHeroComponent).posterImage,
                    "Video Hero",
                  ),
                  width:
                    (block as HomepageVideoHeroComponent).posterImage.data
                      ?.attributes?.width ||
                    (block as HomepageVideoHeroComponent).posterImage.width ||
                    0,
                  height:
                    (block as HomepageVideoHeroComponent).posterImage.data
                      ?.attributes?.height ||
                    (block as HomepageVideoHeroComponent).posterImage
                      .height ||
                    0,
                }
                : undefined,
              mobileBackgroundImage: (block as HomepageVideoHeroComponent).mobileBackgroundImage
                ? {
                  url: getMediaUrl(
                    (block as HomepageVideoHeroComponent).mobileBackgroundImage,
                  ),
                  alt: getMediaAlt(
                    (block as HomepageVideoHeroComponent).mobileBackgroundImage,
                    "Mobile Video Hero Background",
                  ),
                  width:
                    (block as HomepageVideoHeroComponent).mobileBackgroundImage.data
                      ?.attributes?.width ||
                    (block as HomepageVideoHeroComponent).mobileBackgroundImage.width ||
                    0,
                  height:
                    (block as HomepageVideoHeroComponent).mobileBackgroundImage.data
                      ?.attributes?.height ||
                    (block as HomepageVideoHeroComponent).mobileBackgroundImage.height ||
                    0,
                }
                : undefined,
              isActive: (block as HomepageVideoHeroComponent).isActive,
            };

          case "hero":
            return {
              blockType: "hero" as const,
              id: block.id,
              eyebrow: (block as HomepageHeroComponent).eyebrow,
              heading: (block as HomepageHeroComponent).heading,
              headingLine1: (block as HomepageHeroComponent).heading_line_1,
              headingLine2: (block as HomepageHeroComponent).heading_line_2,
              subheading: (block as HomepageHeroComponent).subheading,
              backgroundImage: ((block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image)
                ? {
                  url: getMediaUrl((block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image),
                  alt: getMediaAlt(
                    (block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image,
                    (block as HomepageHeroComponent).heading,
                  ),
                  width:
                    ((block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image).data?.attributes
                      ?.width ||
                    ((block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image).width ||
                    0,
                  height:
                    ((block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image).data?.attributes
                      ?.height ||
                    ((block as HomepageHeroComponent).background_image || (block as HomepageHeroComponent).image).height ||
                    0,
                }
                : undefined,
              ctaLabel: (block as HomepageHeroComponent).cta_label,
              ctaLink: (block as HomepageHeroComponent).cta_link,
              secondaryCtaLabel: (block as HomepageHeroComponent).secondary_cta_label,
              secondaryCtaLink: (block as HomepageHeroComponent).secondary_cta_link,
              secondaryCtaAction: (block as HomepageHeroComponent).secondary_cta_action,
              secondaryCtaVideoUrl: (block as HomepageHeroComponent).secondary_cta_video_url,
              trustLabel: (block as HomepageHeroComponent).trust_label,
              trustValue: (block as HomepageHeroComponent).trust_value,
              trustRating: (block as HomepageHeroComponent).trust_rating,
              userAvatars: ((block as HomepageHeroComponent).patient_avatars || (block as HomepageHeroComponent).user_avatars)
                ? ((block as HomepageHeroComponent).patient_avatars || (block as HomepageHeroComponent).user_avatars)!.map(
                  (avatar: any) => ({
                    url: getMediaUrl(avatar),
                    alt: avatar.alternativeText || "User Avatar",
                    width: avatar.width || 100,
                    height: avatar.height || 100,
                  }),
                )
                : undefined,
            };

          case "services":
            return {
              blockType: "services" as const,
              id: block.id,
              eyebrow: (block as HomepageServicesComponent).eyebrow,
              title: (block as HomepageServicesComponent).title,
              subtitle: cleanDescription((block as HomepageServicesComponent).subtitle),
              description: cleanDescription((block as HomepageServicesComponent).description),
              viewMoreLabel: (block as HomepageServicesComponent).view_more_label,
              viewMoreLink: (block as HomepageServicesComponent).view_more_link,
              items:
                (block as HomepageServicesComponent).items?.map((item) => ({
                  id: item.id,
                  title: item.title,
                  description: cleanDescription(item.description),
                  link: item.link,
                  image: item.image
                    ? {
                      url: getMediaUrl(item.image),
                      alt: getMediaAlt(item.image, item.title),
                      width:
                        item.image.data?.attributes?.width ||
                        item.image.width ||
                        0,
                      height:
                        item.image.data?.attributes?.height ||
                        item.image.height ||
                        0,
                    }
                    : undefined,
                })) || [],
            };

          case "about":
            return {
              blockType: "about" as const,
              id: block.id,
              title: (block as HomepageAboutComponent).title,
              content: cleanDescription((block as HomepageAboutComponent).content),
              image: (block as HomepageAboutComponent).image
                ? {
                  url: getMediaUrl((block as HomepageAboutComponent).image),
                  alt: getMediaAlt(
                    (block as HomepageAboutComponent).image,
                    (block as HomepageAboutComponent).title,
                  ),
                  width:
                    (block as HomepageAboutComponent).image.data?.attributes
                      ?.width ||
                    (block as HomepageAboutComponent).image.width ||
                    0,
                  height:
                    (block as HomepageAboutComponent).image.data?.attributes
                      ?.height ||
                    (block as HomepageAboutComponent).image.height ||
                    0,
                }
                : undefined,
            };

          case "combined-testimonial-result":
            return {
              blockType: "combined-testimonial-result" as const,
              id: block.id,
              title: (block as HomepageCombinedTestimonialResultComponent)
                .title,
              subtitle: cleanDescription((block as HomepageCombinedTestimonialResultComponent)
                .subtitle),
              items:
                (
                  block as HomepageCombinedTestimonialResultComponent
                ).items?.map((item) => ({
                  id: item.id,
                  customerName: item.customerName,
                  content: cleanDescription(item.content),
                  rating: item.rating,
                  country: item.country,
                  beforeImage: item.beforeImage
                    ? {
                      url: getMediaUrl(item.beforeImage),
                      alt: getMediaAlt(
                        item.beforeImage,
                        `${item.customerName} - Before`,
                      ),
                      width:
                        item.beforeImage.data?.attributes?.width ||
                        item.beforeImage.width ||
                        0,
                      height:
                        item.beforeImage.data?.attributes?.height ||
                        item.beforeImage.height ||
                        0,
                    }
                    : undefined,
                  avatar: item.avatar
                    ? {
                      url: getMediaUrl(item.avatar),
                      alt: getMediaAlt(item.avatar, item.customerName),
                    }
                    : undefined,
                  afterImage: item.afterImage
                    ? {
                      url: getMediaUrl(item.afterImage),
                      alt: getMediaAlt(
                        item.afterImage,
                        `${item.customerName} - After`,
                      ),
                      width:
                        item.afterImage.data?.attributes?.width ||
                        item.afterImage.width ||
                        0,
                      height:
                        item.afterImage.data?.attributes?.height ||
                        item.afterImage.height ||
                        0,
                    }
                    : undefined,
                })) || [],
            };

          case "cta":
            const ctaBlock = {
              blockType: "cta" as const,
              id: block.id,
              heading: (block as HomepageCTAComponent).heading || "",
              highlightText: (block as HomepageCTAComponent).highlight_text,
              buttonLabel: (block as HomepageCTAComponent).button_label || "",
              buttonLink: (block as HomepageCTAComponent).button_link || "",
              backgroundImage: (block as HomepageCTAComponent).background_image
                ? {
                  url: getMediaUrl(
                    (block as HomepageCTAComponent).background_image,
                  ),
                  alt: getMediaAlt(
                    (block as HomepageCTAComponent).background_image,
                    "CTA Background",
                  ),
                  width: 0,
                  height: 0,
                }
                : undefined,
              humanImage: (block as HomepageCTAComponent).human_image
                ? {
                  url: getMediaUrl(
                    (block as HomepageCTAComponent).human_image,
                  ),
                  alt: getMediaAlt(
                    (block as HomepageCTAComponent).human_image,
                    "Dental Professional",
                  ),
                  width: 0,
                  height: 0,
                }
                : undefined,
            };

            return ctaBlock;

          case "trust":
            return {
              blockType: "trust" as const,
              id: block.id,
              title: (block as HomepageTrustComponent).title,
              subtitle: cleanDescription((block as HomepageTrustComponent).subtitle),
              stats:
                (block as HomepageTrustComponent).stats?.map((stat) => ({
                  id: stat.id,
                  number: stat.number,
                  label: stat.label,
                  suffix: stat.suffix,
                  icon: stat.icon
                    ? {
                      url: getMediaUrl(stat.icon),
                      alt: getMediaAlt(stat.icon, `Icon - ${stat.label}`),
                      width:
                        stat.icon.data?.attributes?.width ||
                        stat.icon.width ||
                        0,
                      height:
                        stat.icon.data?.attributes?.height ||
                        stat.icon.height ||
                        0,
                    }
                    : undefined,
                })) || [],
              certifications: (
                block as HomepageTrustComponent
              ).certifications.map((cert) => ({
                id: cert.id,
                name: cert.name,
                image: cert.image
                  ? {
                    url: getMediaUrl(cert.image),
                    alt: getMediaAlt(cert.image, cert.name),
                    width:
                      cert.image.data?.attributes?.width ||
                      cert.image.width ||
                      0,
                    height:
                      cert.image.data?.attributes?.height ||
                      cert.image.height ||
                      0,
                  }
                  : undefined,
              })),
            };

          case "process":
            return {
              blockType: "process" as const,
              id: block.id,
              title: (block as HomepageProcessComponent).title,
              subtitle: cleanDescription((block as HomepageProcessComponent).subtitle),
              steps: (block as HomepageProcessComponent).steps || [],
            };

          case "doctor":
            return {
              blockType: "doctor" as const,
              id: block.id,
              eyebrow: (block as HomepageDoctorComponent).eyebrow,
              title: (block as HomepageDoctorComponent).title,
              subtitle: cleanDescription((block as HomepageDoctorComponent).subtitle),
              viewAllLabel: (block as HomepageDoctorComponent).view_all_label,
              viewAllLink: (block as HomepageDoctorComponent).view_all_link,
              doctors:
                (block as HomepageDoctorComponent).doctors?.map((doc) => ({
                  id: doc.id,
                  name: doc.name,
                  specialization: doc.specialization,
                  bio: doc.bio,
                  imageAlt: doc.image_alt,
                  profileLink: doc.profile_link,
                  linkedinUrl: doc.linkedin_url,
                  image: doc.image
                    ? {
                      url: getMediaUrl(doc.image),
                      alt: doc.image_alt || getMediaAlt(doc.image, doc.name),
                      width:
                        doc.image.data?.attributes?.width ||
                        doc.image.width ||
                        0,
                      height:
                        doc.image.data?.attributes?.height ||
                        doc.image.height ||
                        0,
                    }
                    : undefined,
                  experienceYears: doc.experience_years,
                  badges: (doc.badges ?? [])
                    .map((b) => b.label)
                    .filter(Boolean),
                  stats: (doc.stats ?? []).map((s) => s.label).filter(Boolean),
                })) || [],
            };

          case "faq":
            return {
              blockType: "faq" as const,
              id: block.id,
              title: (block as HomepageFAQComponent).title,
              subtitle: cleanDescription((block as HomepageFAQComponent).subtitle),
              questions: (block as HomepageFAQComponent).questions || [],
            };

          case "certification":
            return {
              blockType: "certification" as const,
              id: block.id,
              eyebrow: (block as HomepageCertificationComponent).eyebrow,
              heading: (block as HomepageCertificationComponent).heading,
              bundles: (block as HomepageCertificationComponent).bundles?.map((bundle) => ({
                  id: bundle.id,
                  organizationName: bundle.organization_name,
                  summary: bundle.summary,
                  certificateAlt: bundle.certificate_alt,
                  organizationLogo: bundle.organization_logo
                    ? {
                      url: getMediaUrl(bundle.organization_logo),
                      alt: getMediaAlt(bundle.organization_logo, bundle.organization_name),
                      width:
                        bundle.organization_logo.data?.attributes?.width ||
                        bundle.organization_logo.width ||
                        0,
                      height:
                        bundle.organization_logo.data?.attributes?.height ||
                        bundle.organization_logo.height ||
                        0,
                    }
                    : undefined,
                  certificateImage: bundle.certificate_image
                    ? {
                      url: getMediaUrl(bundle.certificate_image),
                      alt: bundle.certificate_alt || getMediaAlt(bundle.certificate_image, bundle.organization_name),
                      width: bundle.certificate_image.data?.attributes?.width || bundle.certificate_image.width || 0,
                      height: bundle.certificate_image.data?.attributes?.height || bundle.certificate_image.height || 0,
                    }
                    : undefined,
                })) || [],
            };

          case "results-section": {
            const value = block as HomepageResultsSectionComponent;
            const media = (raw: any, alt: string) => ({
              url: getMediaUrl(raw),
              alt: getMediaAlt(raw, alt),
              width: raw?.data?.attributes?.width || raw?.width || 0,
              height: raw?.data?.attributes?.height || raw?.height || 0,
            });
            return {
              blockType: "results-section" as const,
              id: block.id,
              eyebrow: value.eyebrow,
              heading: value.heading,
              intro: cleanDescription(value.intro) || "",
              stories: (value.stories || []).map((story) => ({
                id: story.id,
                title: story.title,
                description: cleanDescription(story.description) || "",
                treatments: Array.isArray(story.treatments) ? story.treatments : [],
                image: media(story.image, story.image_alt || `${story.title} - Composite result`),
                imageAlt: story.image_alt,
                patientPortrait: media(story.patient_portrait, story.portrait_alt || `${story.title} - Patient`),
                portraitAlt: story.portrait_alt,
                quote: cleanDescription(story.quote) || "",
              })),
            };
          }

          case "testimonials-section": {
            const value = block as HomepageTestimonialsSectionComponent;
            const media = (raw: any, alt: string) => raw ? {
              url: getMediaUrl(raw),
              alt: getMediaAlt(raw, alt),
              width: raw.data?.attributes?.width || raw.width || 0,
              height: raw.data?.attributes?.height || raw.height || 0,
            } : undefined;
            return {
              blockType: "testimonials-section" as const,
              id: block.id,
              eyebrow: value.eyebrow,
              heading: value.heading,
              sectionImage: media(value.section_image, value.section_image_alt || value.heading)!,
              sectionImageAlt: value.section_image_alt,
              testimonials: (value.testimonials || []).map((testimonial) => ({
                id: testimonial.id,
                rating: testimonial.rating,
                quote: cleanDescription(testimonial.quote) || "",
                patientName: testimonial.patient_name,
                patientLocation: testimonial.patient_location,
                patientAvatar: media(testimonial.patient_avatar, testimonial.patient_avatar_alt || testimonial.patient_name),
                patientAvatarAlt: testimonial.patient_avatar_alt,
              })),
            };
          }

          case "press-section": {
            const value = block as HomepagePressSectionComponent;
            return {
              blockType: "press-section" as const,
              id: block.id,
              eyebrow: value.eyebrow,
              heading: value.heading,
              logos: (value.logos || []).map((logo) => ({
                url: getMediaUrl(logo),
                alt: getMediaAlt(logo, value.heading),
                width: logo.data?.attributes?.width || logo.width || 0,
                height: logo.data?.attributes?.height || logo.height || 0,
              })),
            };
          }

          case "blog-collection-section":
            return {
              blockType: "blog-collection-section" as const,
              id: block.id,
              title: (block as HomepageBlogCollectionComponent).title,
              subtitle: cleanDescription((block as HomepageBlogCollectionComponent).subtitle),
              posts: canonicalBlogPosts.slice(0, 4),
              showFeatured: (block as HomepageBlogCollectionComponent)
                .showFeatured,
              isActive: (block as HomepageBlogCollectionComponent).isActive,
            };

          case "proof-showcase": {
            const value = block as HomepageProofShowcaseComponent;
            const media = (raw: any, alt: string) => raw ? { url: getMediaUrl(raw), alt: getMediaAlt(raw, alt), width: raw.data?.attributes?.width || raw.width || 0, height: raw.data?.attributes?.height || raw.height || 0 } : undefined;
            return { blockType: "proof-showcase" as const, id: block.id, eyebrow: value.eyebrow, title: value.title, headingLine1: (value as any).heading_line_1, headingLine2: (value as any).heading_line_2, description: cleanDescription(value.description), benefits: ((value as any).benefits || []).map((benefit: any) => ({ id: benefit.id, label: benefit.label })), ctaLabel: (value as any).cta_label, ctaLink: (value as any).cta_link, primaryTeamImage: media((value as any).primary_team_image, "Smilux dental team"), experienceValue: (value as any).experience_value, experienceLabel: (value as any).experience_label, technologyImage: media((value as any).technology_image, "Dental technology consultation"), patientStoryImage: media((value as any).patient_story_image, "Smilux patients and team"), patientStatImage: media((value as any).patient_stat_image, "Smilux treatment room"), patientStatValue: (value as any).patient_stat_value, patientStatLabel: (value as any).patient_stat_label, primaryImage: media(value.primary_image, value.title), secondaryImage: media(value.secondary_image, value.title), metrics: (value.metrics || []).map(metric => ({ id: metric.id, value: metric.value, suffix: metric.suffix, label: metric.label, icon: media(metric.icon, metric.label) })) };
          }
          case "technology-feature": {
            const value = block as HomepageTechnologyFeatureComponent;
            const media = (raw: any, alt: string) => raw ? { url: getMediaUrl(raw), alt: getMediaAlt(raw, alt), width: raw.data?.attributes?.width || raw.width || 0, height: raw.data?.attributes?.height || raw.height || 0 } : undefined;
            const cardMedia = (raw: any, alt: string) => media(raw, alt);
            return { blockType: "technology-feature" as const, id: block.id, eyebrow: value.eyebrow, title: value.title, headingLine1: value.heading_line_1, headingLine2: value.heading_line_2, headingAccent: value.heading_accent, description: cleanDescription(value.description), backgroundImage: cardMedia(value.background_image, "Smilux technology background"), image: media(value.image, value.title), ctaLabel: value.cta_label, ctaLink: value.cta_link, features: (value.features || []).map(feature => ({ id: feature.id, title: feature.title, description: cleanDescription(feature.description), icon: media(feature.icon, feature.title) })), technologies: (value.technologies || []).map(card => ({ id: card.id, index: card.index, title: card.title, description: cleanDescription(card.description), image: cardMedia(card.image, card.title), thumbnail: cardMedia(card.thumbnail, `${card.title} thumbnail`) })) };
          }
          case "equipment-showcase": {
            const value = block as HomepageEquipmentShowcaseComponent;
            return { blockType: "equipment-showcase" as const, id: block.id, eyebrow: value.eyebrow, title: value.title, subtitle: cleanDescription(value.subtitle), items: (value.items || []).map(item => ({ id: item.id, title: item.title, description: cleanDescription(item.description), link: item.link, imageAlt: item.image_alt, image: item.image ? { url: getMediaUrl(item.image), alt: item.image_alt || getMediaAlt(item.image, item.title), width: item.image.data?.attributes?.width || item.image.width || 0, height: item.image.data?.attributes?.height || item.image.height || 0 } : undefined })) };
          }
          case "consultation": {
            const value = block as HomepageConsultationComponent;
            return { blockType: "consultation" as const, id: block.id, title: value.title, description: cleanDescription(value.description), formHeading: value.form_heading, clinicEyebrow: value.clinic_eyebrow, contactHeading: value.contact_heading, expertName: value.expert_name, expertRole: value.expert_role, expertImage: value.expert_image ? { url: getMediaUrl(value.expert_image), alt: getMediaAlt(value.expert_image, value.expert_name || value.title), width: value.expert_image.data?.attributes?.width || value.expert_image.width || 0, height: value.expert_image.data?.attributes?.height || value.expert_image.height || 0 } : undefined, address: value.address, phone: value.phone, openingHours: value.opening_hours, internationalPatients: value.international_patients, email: value.email, submitLabel: value.submit_label, helpText: value.help_text, serviceOptions: homepageServiceOptions };
          }

          default:
            console.warn(`[getHomepage] Unknown block type: ${componentType}`);
            return null;
        }
      })
      .filter(
        (block: HomepageBlock | null): block is HomepageBlock => block !== null,
      );

    return {
      title: data.title || "Homepage",
      visualTheme: data.visual_theme || 'clinical-blue',
      metadataTitle: data.metadata_title,
      metadataDescription: data.metadata_description,
      metadataImage: data.metadata_image ? getMediaUrl(data.metadata_image) : undefined,
      blocks,
      seo: data.seo,
    };
  } catch (error) {
    return {
      title: "Homepage",
      blocks: [],
    };
  }
}

/**
 * Fetches the Customers page data from Strapi CMS
 * Priority:
 *   1. /api/customer (new Customer single type with dynamic zone layout)
 *   2. /api/pages?filters[slug][$eq]=customers (legacy pages collection with JSON content)
 *   3. Default fallback content
 */
export async function getCustomersPage(isDraftMode: boolean = false): Promise<{
  page: { title: string; description: string; slug: string } | null;
  content: any;
}> {
  // 1. Try the new Customer single type first
  try {
    const fetchCustomer = async (draft: boolean) => apiClient<any>("/api/customer", {
      params: {
        "populate[layout][populate]": "*",
        "populate[layout][on][customer.hero][populate]":
          "image1,image2,image3,image4",
        "populate[layout][on][customer.combined-testimonial-result][populate][items][populate]":
          "beforeImage,afterImage",
        "populate[layout][on][customer.success-stories][populate][stories][populate]":
          "avatar",
        "populate[layout][on][customer.benefits][populate][benefits][populate]":
          "icon",
        "populate[layout][on][customer.statistics][populate][stats][populate]":
          "icon",
        "populate[layout][on][customer.why-choose-us][populate][features][populate]":
          "icon",
        "populate[layout][on][customer.reviews][populate][checklist][populate]":
          "icon",
        "populate[layout][on][customer.faq][populate][questions][populate]":
          "*",
        "populate[layout][on][customer.cta][populate][contact_info][populate]":
          "address_icon,phone_icon,email_icon",
      },
      tags: ["customer"],
      isDraftMode: draft,
    });

    let customerResponse = await fetchCustomer(isDraftMode);

    // Fallback: If published is empty (e.g. raw SQL migration), fetch draft
    if (!customerResponse?.data && !isDraftMode) {
      customerResponse = await fetchCustomer(true);
    }

    if (customerResponse?.data) {
      // Strapi v5 returns data: { id, documentId, ...attributes }
      const data = customerResponse.data;
      const content = transformCustomersLayoutToContent(data.layout);

      // Customer's page title is the canonical title edited at the single
      // type root. The legacy hero component also has a title field, but the
      // customer UI renders the hero presentation. Keep that presentation in
      // sync so draft preview shows the exact title saved in the CMS.
      if (content?.hero && data.title) {
        content.hero.title = cleanDescription(data.title);
      }
      return {
        page: {
          title: data.title || "",
          description: cleanDescription(data.description) || "",
          slug: "customers",
        },
        content,
      };
    }
  } catch {
  }

  // 2. Fall back to pages collection (legacy - 024-create-customer-page.js data)
  try {
    const fetchPages = async (draft: boolean) => apiClient<any>("/api/pages", {
      params: {
        "filters[slug][$eq]": "customers",
        populate: "*",
      },
      tags: ["pages"],
      isDraftMode: draft,
    });

    let pagesResponse = await fetchPages(isDraftMode);

    if ((!pagesResponse?.data || pagesResponse.data.length === 0) && !isDraftMode) {
      pagesResponse = await fetchPages(true);
    }

    if (pagesResponse?.data && pagesResponse.data.length > 0) {
      const pageData = pagesResponse.data[0];

      let content = null;
      if (pageData.content) {
        try {
          content = JSON.parse(pageData.content);
        } catch {
          content = pageData.content;
        }
      }

      // Clean the legacy content if it has hero/descriptions
      if (content && typeof content === 'object') {
        // 1. Hero
        if (content.hero) {
          content.hero.badge = cleanDescription(content.hero.badge);
          content.hero.title = cleanDescription(content.hero.title);
          content.hero.description = cleanDescription(content.hero.description);
          content.hero.subtitle = cleanDescription(content.hero.subtitle);
        }
        // 2. Success Stories
        if (content.successStories) {
          content.successStories.badge = cleanDescription(content.successStories.badge);
          content.successStories.title = cleanDescription(content.successStories.title);
          content.successStories.description = cleanDescription(content.successStories.description);
          if (Array.isArray(content.successStories.stories)) {
            content.successStories.stories.forEach((s: any) => {
              s.quote = cleanDescription(s.quote);
            });
          }
        }
        // 3. Before After Gallery
        if (content.beforeAfterGallery) {
          content.beforeAfterGallery.title = cleanDescription(content.beforeAfterGallery.title);
          content.beforeAfterGallery.subtitle = cleanDescription(content.beforeAfterGallery.subtitle);
          if (Array.isArray(content.beforeAfterGallery.items)) {
            content.beforeAfterGallery.items.forEach((item: any) => {
              item.content = cleanDescription(item.content);
            });
          }
        }
        // 4. Why Choose Us
        if (content.whyChooseUs) {
          content.whyChooseUs.badge = cleanDescription(content.whyChooseUs.badge);
          content.whyChooseUs.title = cleanDescription(content.whyChooseUs.title);
          content.whyChooseUs.description = cleanDescription(content.whyChooseUs.description);
          if (Array.isArray(content.whyChooseUs.features)) {
            content.whyChooseUs.features.forEach((f: any) => {
              f.description = cleanDescription(f.description);
            });
          }
        }
        // 5. Reviews
        if (content.reviews) {
          content.reviews.badge = cleanDescription(content.reviews.badge);
          content.reviews.title = cleanDescription(content.reviews.title);
          content.reviews.description = cleanDescription(content.reviews.description);
          content.reviews.rating_subtitle = cleanDescription(content.reviews.rating_subtitle);
        }
      }

      return {
        page: {
          title: pageData.title || "",
          description: cleanDescription(pageData.description) || "",
          slug: pageData.slug || "",
        },
        content,
      };
    }
  } catch (pagesError) {
  }

  // 3. Return null result if all API calls fail (will trigger Error UI)
  return { page: null, content: null };
}

/**
 * Transform Customer single type layout components to content structure.
 * Component names match schemas defined in 027-create-customer-schemas.js:
 *   customer.hero, customer.success-stories, customer.benefits,
 *   customer.statistics, customer.faq, customer.cta
 */
function transformCustomersLayoutToContent(layout: any[]): any {
  if (!layout || !Array.isArray(layout)) return null;

  const content: any = {};

  for (const component of layout) {
    // __component format: "customer.success-stories" -> split gives ["customer", "success-stories"]
    const componentType = component.__component?.split(".")[1];

    switch (componentType) {
      case "hero":
        content.hero = {
          badge: cleanDescription(component.badge),
          title: cleanDescription(component.title),
          description: cleanDescription(component.description),
          // Convert separate image fields or JSON field back to the array format expected by the frontend
          images: (Array.isArray(component.images) ? component.images : [
            component.image1,
            component.image2,
            component.image3,
            component.image4,
          ])
            .map((img: any) => {
              if (!img) return null;
              // If it's already a transformed object from JSON field
              if (img.path || img.url) {
                return {
                  type: "strapi",
                  path: img.path || img.url,
                  alt: img.alt || img.alternativeText || img.name || "",
                };
              }
              return null;
            })
            .filter(Boolean),
        };
        break;

      // Matches schema: customer.success-stories
      case "success-stories":
        content.successStories = {
          badge: cleanDescription(component.badge),
          title: cleanDescription(component.title),
          description: cleanDescription(component.description),
          // stories is a repeatable component (customer.story-item)
          stories: (component.stories || []).map((s: any) => ({
            name: s.name,
            treatment: s.treatment,
            quote: cleanDescription(s.quote),
            rating: s.rating ?? 5,
            avatar: s.avatar
              ? {
                url: getMediaUrl(s.avatar),
                alt: s.avatar.alternativeText || s.author || "",
              }
              : null,
          })),
        };
        break;

      // Matches schema: customer.combined-testimonial-result
      case "combined-testimonial-result":
        content.beforeAfterGallery = {
          title: cleanDescription(component.title),
          subtitle: cleanDescription(component.subtitle),
          // items is a repeatable component (customer.combined-testimonial-result-item)
          items: (component.items || []).map((item: any) => ({
            customerName: item.customerName,
            content: cleanDescription(item.content),
            rating: item.rating,
            country: item.country,
            treatmentType: item.treatmentType,
            beforeImage: item.beforeImage
              ? {
                url: getMediaUrl(item.beforeImage),
                alt: getMediaAlt(item.beforeImage, `${item.treatmentType || ""} - Before`),
              }
              : null,
            avatar: item.avatar
              ? {
                url: getMediaUrl(item.avatar),
                alt: getMediaAlt(item.avatar, item.customerName),
              }
              : null,
            afterImage: item.afterImage
              ? {
                url: getMediaUrl(item.afterImage),
                alt: getMediaAlt(item.afterImage, `${item.treatmentType || ""} - After`),
              }
              : null,
          })),
        };
        break;

      // Matches schema: customer.reviews
      case "reviews":
        content.reviews = {
          badge: cleanDescription(component.badge),
          title: cleanDescription(component.title),
          rating: component.rating,
          total_reviews: component.total_reviews,
          rating_subtitle: cleanDescription(component.rating_subtitle),
          description: cleanDescription(component.description),
          // checklist is a repeatable component (customer.review-checklist-item)
          checklist: (component.checklist || []).map((item: any) => ({
            text: cleanDescription(item.text),
            icon: item.icon
              ? {
                url: getMediaUrl(item.icon),
                alt: item.icon.alternativeText || item.text || "",
              }
              : null,
          })),
        };
        break;

      // Matches schema: customer.why-choose-us
      case "why-choose-us":
        content.whyChooseUs = {
          badge: cleanDescription(component.badge),
          title: cleanDescription(component.title),
          description: cleanDescription(component.description),
          // features is a repeatable component (customer.feature-item)
          features: (component.features || []).map((feature: any) => ({
            title: cleanDescription(feature.title),
            description: cleanDescription(feature.description),
            icon: feature.icon
              ? {
                url: getMediaUrl(feature.icon),
                alt: feature.icon.alternativeText || feature.title || "",
              }
              : null,
          })),
        };
        break;

      default:
        console.warn(
          `[transformCustomersLayoutToContent] Unknown component type: ${componentType}`,
        );
    }
  }

  return content;
}

/**
 * Get contact page content
 *
 * Fetches contact page with all sections from CMS.
 * Contact page is a Single Type with hero (including map), form, and CTA.
 *
 * @returns Contact page object with all sections
 */
export interface ContactPageBlock {
  id: string;
  __component: string;
  data: any;
}

export interface ContactPageContent {
  blocks?: ContactPageBlock[];
  seo?: import("@/src/types/strapi").PageSeo;
}

export async function getContactPage(isDraftMode: boolean = false): Promise<ContactPageContent> {
  try {
    const response = await apiClient<any>("/api/contact-page", {
      params: {
        "populate[layout][populate]": "*",
        "populate[layout][on][contact.hero][populate][hero_image]": "*",
        "populate[layout][on][contact.hero][populate][contact_cards]": "*",
        "populate[layout][on][contact.consultation-section][populate]": "*",
        "populate[layout][on][contact.map-section][populate]": "*",
        "populate[layout][on][contact.expectation][populate]": "*",
        "populate[layout][on][contact.faq][populate]": "*",
      },
      isDraftMode,
      tags: ["contact-page"],
    });

    // Flatten data, supporting Strapi v5 structures
    const data = response.data;
    if (!data || !data.layout) {
      console.warn("[getContactPage] No contact page layout found");
      return {};
    }

    const layout = data.layout || [];

    // Map blocks preserving order from CMS
    const blocks: ContactPageBlock[] = layout.map((block: any, index: number) => {
      const type = block.__component;
      let blockData: any = {};

      if (type === "contact.hero") {
        blockData = {
          title: block.title,
          subtitle: cleanDescription(block.subtitle),
          description: cleanDescription(block.description),
          heroImageUrl: block.hero_image ? getMediaUrl(block.hero_image) : undefined,
          contactCards: (block.contact_cards || []).map((card: any) => ({
            label: card.label || '',
            value: cleanDescription(card.value) || '',
            supportingText: cleanDescription(card.supporting_text) || '',
            icon: card.icon || 'phone',
            href: card.href || undefined,
          })),
        };
      } else if (type === "contact.consultation-section") {
        blockData = {
          formTitle: block.form_title || '',
          formIntro: cleanDescription(block.form_intro) || '',
          serviceOptions: [],
          locationOptions: (block.location_options || []).map((option: any) => ({ label: option.label || '', value: option.value || '' })),
          privacyPolicyLabel: block.privacy_policy_label || '',
          privacyPolicyHref: block.privacy_policy_href || '',
          submitLabel: block.submit_label || '',
          infoTitle: block.info_title || '',
          infoDescription: cleanDescription(block.info_description) || '',
          advisorTitle: block.advisor_title || '',
          advisorDescription: cleanDescription(block.advisor_description) || '',
          advisorImage: block.advisor_image ? getMediaUrl(block.advisor_image) : undefined,
          contacts: (block.contacts || []).map((contact: any) => ({
            type: contact.type || 'hotline',
            label: contact.label || '',
            value: contact.value || '',
            href: contact.href || '',
          })),
          trustTitle: block.trust_title || '',
          trustDescription: block.trust_description || '',
        };
      } else if (type === "contact.map-section") {
        blockData = {
          title: block.title || "Vị trí phòng khám",
          address: block.address || "",
          benefits: (block.benefits || []).map((benefit: any) => ({
            icon: benefit.icon || 'location',
            text: benefit.text || '',
          })),
          clinicName: block.clinic_name || "DR. MARIS AESTHETICS",
          directionsLabel: block.directions_label || "CHỈ ĐƯỜNG TRÊN GOOGLE MAPS",
          directionsUrl: block.directions_url || '',
        };
      } else if (type === "contact.expectation") {
        blockData = {
          title: block.title || 'What to Expect',
          items: (block.items || []).map((item: any) => ({ step: item.step || '', title: item.title || '', description: item.description || '' })),
        };
      } else if (type === "contact.faq") {
        blockData = {
          title: block.title || 'Frequently Asked Questions',
          questions: (block.questions || []).map((item: any) => ({ question: item.question || '', answer: item.answer || '' })),
        };
      }

      return {
        id: `contact-block-${index}-${block.id || index}`,
        __component: type,
        data: blockData
      };
    });

    return { blocks, seo: data.seo };
  } catch (error) {
    return {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// About Page
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the About Page single type from Strapi.
 * Returns structured sections for the AboutUsContent component.
 */
export async function getAboutPage(isDraftMode: boolean = false): Promise<any> {
  try {
    const response = await apiClient<any>("/api/about-page", {
      params: {
        "populate[sections][on][about.hero][populate]": "*",
        "populate[sections][on][about.mission-vision][populate]": "*",
        "populate[sections][on][about.core-values][populate]": "*",
        "populate[sections][on][about.doctors][populate]": "*",
        "populate[sections][on][about.featured-services][populate]": "*",
        "populate[sections][on][about.why-choose-us][populate]": "*",
        "populate[sections][on][about.booking][populate]": "*",
        "populate[sections][on][about.surgeon-process][populate]": "*",
        "populate[sections][on][about.assessment][populate]": "*",
        "populate[sections][on][about.surgeon-profile][populate]": "*",
        "populate[sections][on][about.revision][populate]": "*",
        "populate[sections][on][about.international][populate]": "*",
        "populate[sections][on][about.consultation][populate]": "*",
        "populate[sections][on][about.hospital][populate]": "*",
      },
      isDraftMode,
      tags: ["about-page"],
      // The About page is edited from Content Manager; keep hero media changes
      // visible immediately without requiring a frontend image/cache rebuild.
      cache: "no-store",
    });

    // Strapi v5 returns data: { id, documentId, ...attributes }
    const rawData = response?.data;
    if (!rawData) {
      console.warn("[getAboutPage] No data returned from API");
      return null;
    }

    // About content lives directly inside the reorderable dynamic zone.
    // Normalize blocks for the existing section data transformers below.
    const sectionBlocks = Array.isArray(rawData.sections) ? rawData.sections : [];
    const sectionOf = (component: string) => sectionBlocks.find((block: any) => block.__component === component) || null;
    const data = {
      ...rawData,
      aboutSections: sectionBlocks,
      hero: sectionOf("about.hero"),
      mission_vision: sectionOf("about.mission-vision"),
      core_values: sectionOf("about.core-values"),
      doctors: sectionOf("about.doctors"),
      featured_services: sectionOf("about.featured-services"),
      why_choose_us: sectionOf("about.why-choose-us"),
      booking: sectionOf("about.booking"),
    };

    let doctorsSlider: any = null;
    let featuredServices: any = null;
    try {
      if (data.doctors) {
        doctorsSlider = {
          title: data.doctors.title || "Meet Our Doctors",
          viewAllLabel: data.doctors.view_all_label || "VIEW ALL DOCTORS",
          viewAllLink: data.doctors.view_all_link || "/doctors",
          doctors: (data.doctors.doctors || []).map((doctor: any) => ({
            id: doctor.id,
            name: doctor.name || "",
            specialization: doctor.specialization || "",
            profileLink: doctor.profile_link || "",
            linkedinUrl: doctor.linkedin_url || "",
            image: doctor.image ? {
              url: getMediaUrl(doctor.image),
              alt: doctor.image_alt || getMediaAlt(doctor.image, doctor.name || "Doctor portrait"),
            } : undefined,
            highlights: [
              ...(doctor.badges || []).map((badge: any) => badge.label).filter(Boolean),
              ...(doctor.stats || []).map((stat: any) => stat.label).filter(Boolean),
            ],
          })),
        };
      }
      const servicesResponse = await apiClient<any>("/api/services", {
        params: {
          "filters[category][$eq]": "Plastic Surgery",
          pagination: { pageSize: 100 },
          sort: ["title:asc"],
          populate: { coverImage: true },
        },
        isDraftMode,
        tags: ["services"],
      });
      const serviceItems = servicesResponse?.data || [];
      if (serviceItems.length) {
        featuredServices = {
          title: data.featured_services?.title || "Featured Services",
          services: serviceItems.map((service: any) => ({
            id: service.id,
            slug: service.slug || "",
            title: service.title || "",
            description: cleanDescription(service.metaDescription) || "",
            link: service.slug ? `/services/${service.slug}` : "/services",
            image: service.coverImage ? {
              url: getMediaUrl(service.coverImage),
              alt: getMediaAlt(service.coverImage, service.title || "Service illustration"),
            } : undefined,
          })),
        };
        if (data.featured_services?.title) {
          featuredServices.title = data.featured_services.title;
        }
      }
    } catch {
      // The UI has a reference-safe fallback when the canonical doctor block is unavailable.
    }

    // Transform Strapi response → flat structure for frontend
    const hero = data.hero
      ? {
        title: data.hero.title || data.hero.headingPrimary || "",
        eyebrow: data.hero.eyebrow || "",
        editorialLead: cleanDescription(data.hero.editorial_lead || data.hero.supportingParagraph) || "",
        description: cleanDescription(data.hero.description) || "",
        secondaryDescription: cleanDescription(data.hero.secondary_description) || "",
        primaryButtonLabel: data.hero.primary_button_label || "MEET DR. MARIS",
        secondaryButtonLabel: data.hero.secondary_button_label || "REQUEST AN ONLINE CONSULTATION",
        secondaryButtonLink: data.hero.secondary_button_link || "/contact",
        image: data.hero.image ? getMediaUrl(data.hero.image) : data.hero.backgroundImage ? getMediaUrl(data.hero.backgroundImage) : null,
        imageAlt: data.hero.image_alt || getMediaAlt(data.hero.image || data.hero.backgroundImage, "Dr. Maris, Lead Plastic Surgeon at Maris Aesthetics"),
      }
      : null;

    const missionVision = data.mission_vision
      ? {
        backgroundImage: data.mission_vision.backgroundImage ? getMediaUrl(data.mission_vision.backgroundImage) : null,
        missionIcon: data.mission_vision.missionIcon ? getMediaUrl(data.mission_vision.missionIcon) : null,
        visionIcon: data.mission_vision.visionIcon ? getMediaUrl(data.mission_vision.visionIcon) : null,
        missionTitle: data.mission_vision.missionTitle || "",
        missionDescription: cleanDescription(data.mission_vision.missionDescription) || "",
        visionTitle: data.mission_vision.visionTitle || "",
        visionDescription: cleanDescription(data.mission_vision.visionDescription) || "",
      }
      : null;

    const whyChooseUs = data.why_choose_us
      ? {
        title: data.why_choose_us.title || "",
        features: (data.why_choose_us.features || []).map((f: any) => ({
          icon: f.icon || "",
          iconImage: f.icon_image ? getMediaUrl(f.icon_image) : null,
          title: f.title || "",
          description: cleanDescription(f.description) || "",
        })),
        toothImage: data.why_choose_us.toothImage ? getMediaUrl(data.why_choose_us.toothImage) : null,
        statistics: (data.why_choose_us.statistics || []).map((stat: any) => ({
          value: stat.value || "",
          label: stat.label || "",
        })),
        accreditations: (data.why_choose_us.accreditations || []).map((item: any) => ({
          shortName: item.short_name || "",
          description: cleanDescription(item.description) || "",
          logo: item.logo ? getMediaUrl(item.logo) : null,
        })),
      }
      : null;

    const booking = data.booking
      ? {
        heading: data.booking.heading || "Book a Consultation",
        clinicName: data.booking.clinic_name || "DR. MARIS AESTHETICS",
        address: cleanDescription(data.booking.address) || "",
        phone: data.booking.phone || "",
        email: data.booking.email || "",
        openingHours: cleanDescription(data.booking.opening_hours) || "",
        clinicImage: data.booking.clinic_image
          ? { url: getMediaUrl(data.booking.clinic_image), alt: getMediaAlt(data.booking.clinic_image, "DR. MARIS AESTHETICS reception") }
          : undefined,
      }
      : null;

    const coreValues = data.core_values
      ? {
        badge: data.core_values.badge || "",
        title: data.core_values.title || "",
        description: cleanDescription(data.core_values.description) || "",
        centerIcon: data.core_values.center_icon ? getMediaUrl(data.core_values.center_icon) : null,
        values: (data.core_values.values || []).map((v: any) => ({
          iconImage: v.icon_image ? getMediaUrl(v.icon_image) : null,
          title: v.title || "",
          description: cleanDescription(v.description) || "",
        })),
      }
      : null;

    const sectionKeys: Record<string, string> = {
        "about.hero": "hero",
        "about.mission-vision": "mission-vision",
        "about.core-values": "core-values",
        "about.doctors": "doctors",
      "about.featured-services": "featured-services",
      "about.why-choose-us": "why-choose",
      "about.booking": "booking",
      "about.surgeon-process": "surgeon-process",
      "about.assessment": "assessment",
      "about.surgeon-profile": "surgeon-profile",
      "about.revision": "revision",
      "about.international": "international",
      "about.consultation": "consultation",
      "about.hospital": "hospital",
    };
    const sections = sectionBlocks
      .map((section: any) => sectionKeys[section.__component] || "")
      .filter(Boolean);

    return {
      hero,
      // Keep the complete dynamic-zone payload available to the Stitch About
      // page. The later About sections (including surgeon-profile) are read
      // by component UID, so omitting this array silently forces the UI to
      // use fallback content and images.
      aboutSections: sectionBlocks,
      missionVision,
      doctorsSlider,
      featuredServices,
      whyChooseUs,
      coreValues,
      booking,
      sections,
      seo: rawData.seo,
    };
  } catch (error) {
    return null;
  }
}
