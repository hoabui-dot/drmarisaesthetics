'use client';

import { createContext, useContext, useState, useCallback, type MouseEvent, type ReactNode } from 'react';

interface BookingModalContextType {
    isOpen: boolean;
    serviceOptions: string[];
    context: ConsultationContext;
    open: (context?: Partial<ConsultationContext> | MouseEvent<HTMLButtonElement>) => void;
    close: () => void;
}

export interface ConsultationContext {
    source: string;
    consultationType: 'primary' | 'revision' | '';
    procedure: string;
}

const defaultContext: ConsultationContext = { source: 'website', consultationType: '', procedure: '' };

const BookingModalContext = createContext<BookingModalContextType>({
    isOpen: false,
    serviceOptions: [],
    context: defaultContext,
    open: () => { },
    close: () => { },
});

export function BookingModalProvider({ children, serviceOptions = [] }: { children: ReactNode, serviceOptions?: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [context, setContext] = useState<ConsultationContext>(defaultContext);

    const open = useCallback((nextContext?: Partial<ConsultationContext> | MouseEvent<HTMLButtonElement>) => {
        const isEvent = nextContext && 'currentTarget' in nextContext;
        setContext({ ...defaultContext, ...(isEvent ? {} : (nextContext as Partial<ConsultationContext> | undefined)) });
        setIsOpen(true);
    }, []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <BookingModalContext.Provider value={{ isOpen, serviceOptions, context, open, close }}>
            {children}
        </BookingModalContext.Provider>
    );
}

export function useBookingModal() {
    return useContext(BookingModalContext);
}
