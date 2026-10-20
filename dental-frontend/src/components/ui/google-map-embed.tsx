import React from 'react';
import { cn } from '@/src/lib/utils';

export interface GoogleMapEmbedProps {
    lat: number;
    lng: number;
    zoom?: number;
    title?: string;
    query?: string; // Optional search query (e.g. "Clinic Name + Address")
    embedUrl?: string;
    placeUrl?: string;
    className?: string; // Standard Tailwind overrides
}

/**
 * Shared Google Maps renderer. A verified Google "Embed a map" URL can pin an
 * exact facility without requiring an API key; address/coordinate queries are
 * retained as a fallback for existing consumers.
 */
export function GoogleMapEmbed({
    lat,
    lng,
    zoom = 15,
    title = "Location Map",
    query,
    embedUrl,
    placeUrl,
    className,
}: GoogleMapEmbedProps) {
    let trustedEmbedUrl: string | undefined;
    let trustedPlaceUrl: string | undefined;
    if (embedUrl) {
        try {
            const parsedUrl = new URL(embedUrl);
            const allowedHosts = new Set(['google.com', 'www.google.com', 'maps.google.com']);
            if (parsedUrl.protocol === 'https:' && allowedHosts.has(parsedUrl.hostname) && parsedUrl.pathname.startsWith('/maps/embed')) {
                trustedEmbedUrl = parsedUrl.toString();
            }
        } catch {
            // Fall back to the CMS display name/address or coordinates.
        }
    }
    if (placeUrl) {
        try {
            const parsedUrl = new URL(placeUrl);
            const allowedHosts = new Set(['google.com', 'www.google.com', 'maps.google.com']);
            if (parsedUrl.protocol === 'https:' && allowedHosts.has(parsedUrl.hostname) && /^\/maps\/(place|search)(\/|$)/.test(parsedUrl.pathname)) {
                trustedPlaceUrl = parsedUrl.toString();
            }
        } catch {
            // Keep the map preview usable without an external place link.
        }
    }
    const mapQuery = query ? encodeURIComponent(query) : `${lat},${lng}`;
    // A place/address search renders a map pin; the Contact explorer supplies
    // the selected hospital's own name and verified address.
    return (
        <>
        <iframe
            className={cn('w-full h-full border-0', className)}
            src={trustedEmbedUrl || `https://www.google.com/maps?q=${mapQuery}&z=${zoom}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            allowFullScreen
            style={trustedPlaceUrl ? { pointerEvents: 'none' } : undefined}
        />
        {trustedPlaceUrl ? (
            <a
                className="absolute inset-0 z-10 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-blue-700"
                href={trustedPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title.replace(/^Google Maps preview for /, '')} in Google Maps`}
                title="Open this location in Google Maps"
            />
        ) : null}
        </>
    );
}
