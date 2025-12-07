'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface RefreshContextType {
    lastRefresh: number;
    manualRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType>({
    lastRefresh: Date.now(),
    manualRefresh: () => { },
});

interface RefreshProviderProps {
    children: ReactNode;
}

export function RefreshProvider({ children }: RefreshProviderProps) {
    const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

    const manualRefresh = useCallback(() => {
        setLastRefresh(Date.now());
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLastRefresh(Date.now());
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <RefreshContext.Provider value={{ lastRefresh, manualRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefresh() {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefresh must be used within a RefreshProvider');
    }
    return context;
}
