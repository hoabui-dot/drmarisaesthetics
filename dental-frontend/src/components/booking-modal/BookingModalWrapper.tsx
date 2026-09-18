'use client';

import { BookingModalProvider, type BookingServiceOption } from './BookingModalContext';
import { BookingModal } from './BookingModal';
import type { ReactNode } from 'react';
import type { WebsiteSettingBookingForm } from '@/src/types/strapi';
import { MobileBookingButton } from '@/src/components/ui/MobileBookingButton';

/**
 * Wraps the app with the BookingModal context provider and renders
 * the modal portal. Used in the root layout (server component).
 */
export function BookingModalWrapper({ children, serviceOptions = [], bookingForm }: { children: ReactNode, serviceOptions?: BookingServiceOption[], bookingForm?: WebsiteSettingBookingForm }) {
    return (
        <BookingModalProvider serviceOptions={serviceOptions} bookingForm={bookingForm}>
            {children}
            <MobileBookingButton />
            <BookingModal />
        </BookingModalProvider>
    );
}
