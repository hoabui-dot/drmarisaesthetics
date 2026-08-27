'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface CallModalContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const CallModalContext = createContext<CallModalContextType>({
    isOpen: false,
    open: () => {},
    close: () => {},
});

export function CallModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <CallModalContext.Provider value={{ isOpen, open, close }}>
            {children}
        </CallModalContext.Provider>
    );
}

export function useCallModal() {
    return useContext(CallModalContext);
}
