import React from 'react';
import { cn } from '@/src/lib/utils';

export interface GoogleMapEmbedProps {
    lat: number;
    lng: number;
    zoom?: number;
    title?: string;
    query?: string; // Optional search query (e.g. "Clinic Name + Address")
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
    className,
}: GoogleMapEmbedProps) {
    const mapQuery = query ? encodeURIComponent(query) : `${lat},${lng}`;
    return (
        <iframe
            className={cn('w-full h-full border-0', className)}
            src={`https://maps.google.com/maps?q=${mapQuery}&z=${zoom}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            allowFullScreen
        />
    );
}
