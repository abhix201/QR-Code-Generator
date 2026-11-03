import { useEffect, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';

export type ThemeChoice = 'system' | 'light' | 'dark';
const KEY = 'qr:theme';

export function useTheme() {
    const [theme, setTheme] = useState<ThemeChoice>(() => readJson<ThemeChoice>(KEY, 'system'));

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'system') delete root.dataset.theme;
        else root.dataset.theme = theme;
        writeJson(KEY, theme);
    }, [theme]);

    const cycle = () => setTheme((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'));
    return { theme, cycle };
}
