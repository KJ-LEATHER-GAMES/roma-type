// src/providers/PixelUIProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'famicom' | 'gb' | 'neon';
const KEY = 'rtq.theme';

const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);

export const PixelUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(KEY) as Theme) || 'famicom',
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(KEY, theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const usePixelUI = () => {
    const v = useContext(Ctx);
    if (!v) throw new Error('usePixelUI must be used within PixelUIProvider');
    return v;
};
