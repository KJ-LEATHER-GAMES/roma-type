// src/features/typing/data/simpleWords.ts
export type SimpleWord = {
    id: string; // "kame" など（ログやキー用）
    kana: string; // "かめ"
    romaji: string; // "kame"（この1パターンのみ正解）
};

export const SIMPLE_WORDS: SimpleWord[] = [
    { id: 'kame', kana: 'かめ', romaji: 'kame' },
    { id: 'neko', kana: 'ねこ', romaji: 'neko' },
    { id: 'inu', kana: 'いぬ', romaji: 'inu' },
    { id: 'saru', kana: 'さる', romaji: 'saru' },
    { id: 'tori', kana: 'とり', romaji: 'tori' },
];
