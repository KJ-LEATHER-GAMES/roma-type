// src/components/ui/ThemaSwitcher.tsx
// 1. インポート
import React from 'react';

import { setTheme, type ThemeKey } from '../../shared/theme.ts';
// 2. テーマスイッチャー関数

export function ThemeSwitcher() {
    const change = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setTheme(e.target.value as ThemeKey);

    return (
        <select onChange={change} defaultValue={document.documentElement.dataset.theme || 'fam'}>
            <option value="fam">Famicom Warm</option>
            <option value="gb">GB Mono</option>
            <option value="neon">Arcade Neon</option>
        </select>
    );
}
