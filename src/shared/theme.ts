// /src/shared/theme.ts
export type ThemeKey = 'fam' | 'gb' | 'neon';
export const setTheme = (key: ThemeKey) => {
    document.documentElement.dataset.theme = key;
    localStorage.setItem('rtq.theme', key);
};
export const initTheme = () => {
    document.documentElement.dataset.theme =
        (localStorage.getItem('rtq.theme') as ThemeKey) || 'fam';
};
