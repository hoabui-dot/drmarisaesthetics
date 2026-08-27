/**
 * Data Transformers
 *
 * Transforms CMS API responses to frontend-friendly format.
 * Handles Strapi's nested data structure and converts it to a flat format.
 *
 * Key transformations:
 * 1. Flatten data.attributes structure
 * 2. Convert __component to blockType
 * 3. Extract media URLs from nested objects
 * 4. Map SEO fields
 */

import type { StrapiPage, Page, Block, Media } from "@/src/types/strapi";

const API_URL = process.env.STRAPI_URL;

/**
 * Transform CMS page response to frontend format
 *
 * CMS wraps data in { data: { id, attributes: {...} } }
 * We need to flatten this for easier use in components.
 *
 * @param strapiPage - Raw CMS API response
 * @returns Transformed page data
 */
export function transformPage(strapiPage: StrapiPage): Page {
  const pageData = strapiPage.data;

  // Handle both Strapi v4 (with attributes) and v5 (flat structure)
  const attributes = pageData.attributes || pageData;
  const id = pageData.id;

  return {
    id,
    title: attributes.title || "",
    slug: attributes.slug || "",
    content: attributes.content || undefined,
    cover: attributes.cover ? transformMedia(attributes.cover) : undefined,
    description:
      attributes.description && !attributes.description.trim().startsWith("{")
        ? attributes.description
        : undefined,
    publishDate: attributes.publishDate || undefined,
    seo: {
      metaTitle: attributes.seo?.meta_title || attributes.metaTitle || attributes.title || "",
      metaDescription: attributes.seo?.meta_description || attributes.metaDescription || attributes.description || "",
      metaImage: attributes.seo?.meta_image ? transformMedia(attributes.seo.meta_image) : undefined,
      canonicalUrl: attributes.seo?.canonical_url || undefined,
      noIndex: attributes.seo?.no_index || false,
      noFollow: attributes.seo?.no_follow || false,
      openGraphTitle: attributes.seo?.open_graph_title || undefined,
      openGraphDescription: attributes.seo?.open_graph_description || undefined,
    },
    layout: attributes.layout?.map(transformBlock) || [],
  };
}

/**
 * Transform CMS block to frontend format
 *
 * Changes __component to blockType for consistency with existing code.
 * Handles different block types and their specific data structures.
 *
 * @param block - CMS block from dynamic zone
 * @returns Transformed block
 */
function transformBlock(block: any): Block {
  // Extract block type from __component (e.g., 'blocks.hero' -> 'hero')
  const componentName = block.__component.split(".")[1];

  // Base block structure
  const baseBlock = {
    blockType: componentName,
  };

  // Transform based on block type
  switch (componentName) {
    case "hero":
      return {
        ...baseBlock,
        blockType: "hero",
        heading: block.heading || "",
        subheading: block.subheading || undefined,
        image: block.image ? transformMedia(block.image) : undefined,
      } as Block;

    case "services":
      return {
        ...baseBlock,
        blockType: "services",
        heading: block.heading || "",
        items:
          block.items?.map((item: any) => ({
            title: item.title || "",
            description: item.description || "",
            image: item.image ? transformMedia(item.image) : undefined,
          })) || [],
      } as Block;

    case "cta":
      return {
        ...baseBlock,
        blockType: "cta",
        text: block.text || "",
        buttonLabel: block.buttonLabel || "",
        link: block.link || "",
      } as Block;

    default:
      // Unknown block type - return as-is with blockType
      console.warn(`Unknown block type: ${componentName}`);
      return {
        ...baseBlock,
        ...block,
      } as Block;
  }
}

/**
 * Transform CMS media object
 *
 * Extracts URL and alt text from CMS media format.
 * Handles both relative and absolute URLs.
 *
 * @param media - CMS media object
 * @returns Transformed media object or undefined
 */
function transformMedia(media: any): Media | undefined {
  if (!media) return undefined;

  // Handle different media structures
  let attributes = media;

  // If media is wrapped in data.attributes
  if (media.data?.attributes) {
    attributes = media.data.attributes;
  }
  // If media is an array, take first item
  else if (Array.isArray(media) && media[0]) {
    attributes = media[0].data?.attributes || media[0];
  }

  if (!attributes.url) return undefined;

  // Build full URL
  let url = attributes.url;
  if (url.startsWith("/")) {
    url = `${API_URL}${url}`;
  }

  return {
    url,
    alt: attributes.alternativeText || attributes.alt || "",
    width: attributes.width || 0,
    height: attributes.height || 0,
  };
}
