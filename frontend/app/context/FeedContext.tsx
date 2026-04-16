'use client';

import { createContext, useContext, useState } from 'react';

type SortType = 'time' | 'popularity';

interface FeedContextType {
    sortType: SortType;
    setSortType: (sort: SortType) => void;
}

const FeedContext = createContext<FeedContextType | null>(null);

export function FeedProvider({ children }: { children: React.ReactNode }) {
    const [sortType, setSortType] = useState<SortType>('time');

    return (
        <FeedContext.Provider value={{ sortType, setSortType }}>
            {children}
        </FeedContext.Provider>
    );
}

export const useFeed = () => {
    const context = useContext(FeedContext);
    if (!context) throw new Error('useFeed must be used within FeedProvider');
    return context;
};