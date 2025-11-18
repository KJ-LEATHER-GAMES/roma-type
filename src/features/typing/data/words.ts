// src/features/typing/data/words.ts

export type RomajiWord = {
    id: string; // "gakkou_01" など一意なID
    kanji?: string; // "学校"（漢字がない単語は undefined でOK）
    kana: string; // "がっこう"
    romajiVariants: string[]; // ["gakkou", "gakko-"] など
    grade: number; // 学年 or 難易度
    hint?: string; // 意味やメモ（静的なヒント）
};

export const ROMAJI_WORDS: RomajiWord[] = [
    {
        id: 'kame_01',
        kanji: '亀',
        kana: 'かめ',
        romajiVariants: ['kame'],
        grade: 1,
        hint: 'かめ（turtle）',
    },
    {
        id: 'neko_01',
        kanji: '猫',
        kana: 'ねこ',
        romajiVariants: ['neko'],
        grade: 1,
        hint: 'ねこ（cat）',
    },
    {
        id: 'inu_01',
        kanji: '犬',
        kana: 'いぬ',
        romajiVariants: ['inu'],
        grade: 1,
        hint: 'いぬ（dog）',
    },
    {
        id: 'saru_01',
        kanji: '猿',
        kana: 'さる',
        romajiVariants: ['saru'],
        grade: 1,
        hint: 'さる（monkey）',
    },
    {
        id: 'tori_01',
        kanji: '鳥',
        kana: 'とり',
        romajiVariants: ['tori'],
        grade: 1,
        hint: 'とり（bird）',
    },
];
