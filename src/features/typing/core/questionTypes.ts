// src/features/typing/core/questionTypes.ts

import type { RomajiWord } from '@/features/typing/core/wordTypes.ts';
export type QuestionMode = 'kanaToRomaji' | 'kanjiToRomaji' | 'kanjiToEnglish';

export type Question = {
    word: RomajiWord;
    mode: QuestionMode;
};

export type SessionStats = {
    totalQuestions: number;
    clearedQuestions: number;
    totalMistypes: number;
    totalKeystrokes: number;
    score: number;
    accuracy: number; // 0〜1 or 0〜100
};

export type QuestionResult = {
    questionId: string; // word.id
    mistypeCount: number;
    keystrokeCount: number;
    startedAt: number; // Date.now()
    completedAt: number; // Date.now()
    // 将来: isGivenUp なども追加可能
};
