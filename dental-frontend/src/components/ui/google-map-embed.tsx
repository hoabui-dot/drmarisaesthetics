import React from 'react';
import { cn } from '@/src/lib/utils';

export interface GoogleMapEmbedProps {
    lat: number;
    lng: number;
    zoom?: number;
    title?: string;
    query?: string; // Optional search query (e.g. "Clinic Name + Address")
    embedUrl?: string;
    className?: string; // Standard Tailwind overrides
}

/**
 * A highly reusable, DRY component to normalize Google Maps rendering globally.
 * Strictly consumes internal generic Maps API avoiding opaque `pb` payload tracking.
 */
export function GoogleMapEmbed({
    lat,
    lng,
    zoom = 15,
    title = "Location Map",
    query,
    embedUrl,
    className,
}: GoogleMapEmbedProps) {
    let trustedEmbedUrl: string | undefined;
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
    const mapQuery = query ? encodeURIComponent(query) : `${lat},${lng}`;
    return (
        <iframe
            className={cn('w-full h-full border-0', className)}
            src={trustedEmbedUrl || `https://maps.google.com/maps?q=${mapQuery}&z=${zoom}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            allowFullScreen
        />
    );
}
