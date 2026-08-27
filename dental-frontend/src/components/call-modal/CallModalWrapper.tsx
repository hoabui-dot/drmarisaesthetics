'use client';

import { CallModalProvider } from './CallModalContext';
import { CallModal } from './CallModal';
import type { ReactNode } from 'react';

export function CallModalWrapper({ children }: { children: ReactNode }) {
    return (
        <CallModalProvider>
            {children}
            <CallModal />
        </CallModalProvider>
    );
}
