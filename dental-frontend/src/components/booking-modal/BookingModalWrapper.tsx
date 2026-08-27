'use client';

import { BookingModalProvider } from './BookingModalContext';
import { BookingModal } from './BookingModal';
import type { ReactNode } from 'react';

/**
 * Wraps the app with the BookingModal context provider and renders
 * the modal portal. Used in the root layout (server component).
 */
export function BookingModalWrapper({ children, serviceOptions = [] }: { children: ReactNode, serviceOptions?: string[] }) {
    return (
        <BookingModalProvider serviceOptions={serviceOptions}>
            {children}
            <BookingModal />
        </BookingModalProvider>
    );
}
