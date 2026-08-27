import type { PageSeoInput } from "./seo-manager";
import { publicUrl, resolveCanonicalUrl } from "./seo-manager";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import { apiClient } from "@/src/lib/api/client";

type PageType = "home" | "about" | "contact" | "services" | "service" | "page" | "blog" | "news";
type JsonLdEntity = Record<string, unknown>;
export interface StructuredDataBreadcrumb { name: string; path: string; }
export interface StructuredDataInput {
  pageType: PageType; path: string; title: string; description?: string | null; image?: unknown; pageSeo?: PageSeoInput | null;
  breadcrumbs?: StructuredDataBreadcrumb[]; publishedAt?: string | null; updatedAt?: string | null; authorName?: string | null;
  contentId?: string | number | null; serviceType?: string | null; areaServed?: string | null; faqItems?: Array<{ question: string; answer: string }>;
}
interface StructuredDataSettings { structured_data_enabled?: boolean; structured_data_business_type?: string | null; }
const ALLOWED_BUSINESS_TYPES = new Set(["Organization", "Dentist", "MedicalBusiness", "MedicalClinic", "ProfessionalService"]);
const FALLBACK_SETTINGS = { structured_data_enabled: true, structured_data_business_type: "Dentist" } as const;
function siteOrigin(): string { return (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:1234").replace(/\/$/, ""); }
function cleanText(value: unknown): string | undefined { if (typeof value !== "string") return undefined; const text = value.replace(/\s+/g, " ").trim(); return text || undefined; }
function isoDate(value?: string | null): string | undefined { if (!value) return undefined; const date = new Date(value); return Number.isNaN(date.getTime()) ? undefined : date.toISOString(); }
function absolutePath(path: string): string { if (/^https?:\/\//i.test(path)) return path; return `${siteOrigin()}${path.startsWith("/") ? path : `/${path}`}`; }
function mediaValue(media: unknown): string | undefined {
  if (typeof media === "string") return media;
  if (!media || typeof media !== "object") return undefined;
  const candidate = media as { url?: unknown; data?: { url?: unknown; attributes?: { url?: unknown } | null } | null };
  const nested = candidate.data?.attributes || candidate.data || candidate;
  return typeof nested?.url === "string" ? nested.url : undefined;
}
function absoluteImage(media: unknown): string | undefined {
  const value = mediaValue(media); if (!value) return undefined;
  try { const parsed = new URL(value, siteOrigin()); return parsed.pathname.startsWith("/uploads/") ? `${siteOrigin()}/api/strapi-media${parsed.pathname}` : parsed.toString(); }
  catch { return publicUrl(value); }
}
function compact(entity: JsonLdEntity): JsonLdEntity { return Object.fromEntries(Object.entries(entity).filter(([, value]) => value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0))); }
function customEntities(value: unknown): JsonLdEntity[] {
  if (!value) return [];
  let parsed = value;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch { return []; }
  }
  if (Array.isArray(parsed)) return parsed.filter((item): item is JsonLdEntity => Boolean(item && typeof item === "object" && !Array.isArray(item)));
  if (!parsed || typeof parsed !== "object") return [];
  const graph = (parsed as { "@graph"?: unknown })["@graph"];
  if (Array.isArray(graph)) return graph.filter((item): item is JsonLdEntity => Boolean(item && typeof item === "object" && !Array.isArray(item)));
  return [parsed as JsonLdEntity];
}
async function getSettings(): Promise<StructuredDataSettings> {
  try {
    const request = apiClient<{ data?: StructuredDataSettings }>("/api/seo-manager-settings", { params: { populate: "*" }, tags: ["seo-manager-settings", "structured-data-settings"] });
    const response = await Promise.race([request, new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 1500))]);
    return response?.data || FALLBACK_SETTINGS;
  } catch { return FALLBACK_SETTINGS; }
}
function buildOrganization(type: string): JsonLdEntity {
  const origin = siteOrigin(); const logo = `${origin}/api/strapi-media/uploads/logo_37125485af.png`;
  return compact({ "@type": type, "@id": `${origin}/#organization`, name: CLINIC_INFO.name, alternateName: CLINIC_INFO.vietNamName, url: `${origin}/`, logo, image: logo, telephone: CLINIC_INFO.phone1, email: CLINIC_INFO.email, address: { "@type": "PostalAddress", streetAddress: CLINIC_INFO.address, addressLocality: "Ho Chi Minh City", addressCountry: "VN" }, geo: { "@type": "GeoCoordinates", latitude: CLINIC_INFO.coordinates.lat, longitude: CLINIC_INFO.coordinates.lng }, openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "08:00", closes: "19:00" }, sameAs: [CLINIC_INFO.youtube, CLINIC_INFO.facebook, CLINIC_INFO.zalo, CLINIC_INFO.instagram] });
}
function buildBreadcrumbs(items: StructuredDataBreadcrumb[], currentCanonical: string): JsonLdEntity | undefined {
  if (!items.length) return undefined;
  return { "@type": "BreadcrumbList", "@id": `${currentCanonical}#breadcrumb`, itemListElement: items.map((item, index) => compact({ "@type": "ListItem", position: index + 1, name: cleanText(item.name), item: index === items.length - 1 ? currentCanonical : absolutePath(item.path) })) };
}
function pageSchemaType(pageType: PageType): string { return pageType === "about" ? "AboutPage" : pageType === "contact" ? "ContactPage" : "WebPage"; }
function buildArticleEntity(input: StructuredDataInput, canonical: string, organizationId: string): JsonLdEntity {
  const articleType = input.pageType === "news" ? "NewsArticle" : "BlogPosting"; const authorName = cleanText(input.authorName);
  const author = authorName ? compact({ "@type": "Person", "@id": `${canonical}#person`, name: authorName, worksFor: { "@id": organizationId } }) : undefined;
  return compact({ "@type": articleType, "@id": `${canonical}#article`, headline: cleanText(input.title), description: cleanText(input.description), image: absoluteImage(input.image), datePublished: isoDate(input.publishedAt), dateModified: isoDate(input.updatedAt || input.publishedAt), author, publisher: { "@id": organizationId }, mainEntityOfPage: { "@id": `${canonical}#webpage` }, url: canonical });
}
async function resolveStructuredDataUnsafe(input: StructuredDataInput): Promise<JsonLdEntity | null> {
  const settings = await getSettings(); if (settings.structured_data_enabled === false || input.pageSeo?.structured_data_enabled === false || input.pageSeo?.no_index === true) return null;
  const canonical = await Promise.race([resolveCanonicalUrl(input.path, input.pageSeo), new Promise<string>((resolve) => setTimeout(() => resolve(absolutePath(input.path)), 1500))]);
  const businessType = settings.structured_data_business_type && ALLOWED_BUSINESS_TYPES.has(settings.structured_data_business_type) ? settings.structured_data_business_type : FALLBACK_SETTINGS.structured_data_business_type;
  const organization = buildOrganization(businessType); const organizationId = `${siteOrigin()}/#organization`; const websiteId = `${siteOrigin()}/#website`; const webpageId = `${canonical}#webpage`; const contentEntityId = `${canonical}#${input.pageType === "service" ? "service" : "article"}`;
  const webpage = compact({ "@type": pageSchemaType(input.pageType), "@id": webpageId, url: canonical, name: cleanText(input.title), description: cleanText(input.description), isPartOf: { "@id": websiteId }, primaryImageOfPage: absoluteImage(input.image) ? { "@type": "ImageObject", contentUrl: absoluteImage(input.image) } : undefined, datePublished: isoDate(input.publishedAt), dateModified: isoDate(input.updatedAt || input.publishedAt) });
  const graph: JsonLdEntity[] = [organization, { "@type": "WebSite", "@id": websiteId, url: `${siteOrigin()}/`, name: CLINIC_INFO.name, publisher: { "@id": organizationId } }, webpage];
  const breadcrumbs = buildBreadcrumbs(input.breadcrumbs || [], canonical); if (breadcrumbs) graph.push(breadcrumbs);
  if (input.pageType === "about" || input.pageType === "contact") webpage.mainEntity = { "@id": organizationId };
  else if (input.pageType === "service") {
    graph.push(compact({ "@type": "Service", "@id": contentEntityId, name: cleanText(input.title), description: cleanText(input.description), url: canonical, image: absoluteImage(input.image), provider: { "@id": organizationId }, serviceType: cleanText(input.serviceType) || cleanText(input.title), areaServed: cleanText(input.areaServed) || "Ho Chi Minh City, Vietnam" })); webpage.mainEntity = { "@id": contentEntityId };
    const faq = (input.faqItems || []).filter((item) => cleanText(item.question) && cleanText(item.answer)); if (faq.length) graph.push({ "@type": "FAQPage", "@id": `${canonical}#faq`, mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) });
  } else if (input.pageType === "blog" || input.pageType === "news") { graph.push(buildArticleEntity(input, canonical, organizationId)); webpage.mainEntity = { "@id": contentEntityId }; }
  const custom = customEntities(input.pageSeo?.structured_data_json);
  if (custom.length) {
    const existingIds = new Set(graph.map((entity) => typeof entity["@id"] === "string" ? entity["@id"] : undefined).filter(Boolean));
    graph.push(...custom.filter((entity) => typeof entity["@id"] !== "string" || !existingIds.has(entity["@id"] as string)));
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export async function resolveStructuredData(input: StructuredDataInput): Promise<JsonLdEntity | null> {
  try {
    return await resolveStructuredDataUnsafe(input);
  } catch (error) {
    console.warn("[StructuredData] Optional schema generation failed:", error);
    return null;
  }
}
export function StructuredDataScript({ data }: { data: JsonLdEntity | null }) { if (!data) return null; return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />; }
