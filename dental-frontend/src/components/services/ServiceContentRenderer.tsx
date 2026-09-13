'use client'

import { useLayoutEffect, useRef } from 'react'
import { BlocksRenderer } from '@qkix/better-blocks-react-renderer'

type BetterBlocksValue = Record<string, unknown>

const normalizeUploadUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value) return value
  if (value.startsWith('/uploads/')) return `/api/strapi-media${value}`
  try {
    const parsed = new URL(value)
    return parsed.pathname.startsWith('/uploads/') ? `/api/strapi-media${parsed.pathname}` : value
  } catch {
    return value
  }
}

const normalizeImageMedia = (media: BetterBlocksValue) => {
  const normalized: BetterBlocksValue = { ...media, url: normalizeUploadUrl(media.url) }
  if (media.formats && typeof media.formats === 'object' && !Array.isArray(media.formats)) {
    normalized.formats = Object.fromEntries(
      Object.entries(media.formats as BetterBlocksValue).map(([key, format]) => [
        key,
        format && typeof format === 'object' && !Array.isArray(format)
          ? { ...(format as BetterBlocksValue), url: normalizeUploadUrl((format as BetterBlocksValue).url) }
          : format,
      ]),
    )
  }
  return normalized
}

const normalizeBetterBlocksImages = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalizeBetterBlocksImages)
  if (!value || typeof value !== 'object') return value

  const node = value as BetterBlocksValue
  const normalized: BetterBlocksValue = Object.fromEntries(
    Object.entries(node).map(([key, child]) => [key, normalizeBetterBlocksImages(child)]),
  )
  if (node.type === 'image' && node.image && typeof node.image === 'object' && !Array.isArray(node.image)) {
    normalized.image = normalizeImageMedia(node.image as BetterBlocksValue)
  }
  return normalized
}

export function ServiceContentRenderer({ content, sectionIds }: { content: unknown[]; sectionIds: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const headings = Array.from(root.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'))
    headings.slice(0, sectionIds.length).forEach((heading, index) => {
      heading.id = sectionIds[index]
    })
  }, [sectionIds])

  return (
    <div ref={rootRef} className="service-detail-markdown service-detail-blocks">
      <BlocksRenderer content={normalizeBetterBlocksImages(content) as never} />
    </div>
  )
}
