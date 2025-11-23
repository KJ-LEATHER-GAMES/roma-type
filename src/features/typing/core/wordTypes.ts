// src/features/typing/core/wordTypes.ts

// romaji_dict.json の1エントリ
export type RomajiWord = {
    id: string;
    kanji: string;
    kana: string;
    english: string;
    romajiVariants: string[];
    grade: number; // 1〜3
};
