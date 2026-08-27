'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface BookingModalContextType {
    isOpen: boolean;
    serviceOptions: string[];
    open: () => void;
    close: () => void;
}

const BookingModalContext = createContext<BookingModalContextType>({
    isOpen: false,
    serviceOptions: [],
    open: () => { },
    close: () => { },
});

export function BookingModalProvider({ children, serviceOptions = [] }: { children: ReactNode, serviceOptions?: string[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <BookingModalContext.Provider value={{ isOpen, serviceOptions, open, close }}>
            {children}
        </BookingModalContext.Provider>
    );
}

export function useBookingModal() {
    return useContext(BookingModalContext);
}
