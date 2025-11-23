// src/features/typing/core/useQuestionSet.ts
import { useMemo } from 'react';

import dict from '@/features/data/romaji_dict.json';
import type { Question, QuestionMode } from '@/features/typing/core/questionTypes';
import type { RomajiWord } from '@/features/typing/core/wordTypes';

export type QuestionSetOptions = {
    minGrade?: number; // 例: 1
    maxGrade?: number; // 例: 3
    limit?: number; // 例: 10（将来の短時間モード用）
    shuffle?: boolean; // true ならシャッフル
    mode?: QuestionMode; // とりあえず 'kanaToRomaji' を渡す
};

export type UseQuestionSetResult = {
    questions: Question[];
};

const ALL_WORDS = dict as RomajiWord[];

// シンプルな Fisher-Yates シャッフル
function shuffleArray<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}

export function useQuestionSet(options?: QuestionSetOptions): UseQuestionSetResult {
    const {
        minGrade = 1,
        maxGrade = 3,
        limit,
        shuffle = true,
        mode = 'kanaToRomaji',
    } = options ?? {};

    const questions = useMemo<Question[]>(() => {
        // 1. grade でフィルタ
        const filtered = ALL_WORDS.filter((w) => w.grade >= minGrade && w.grade <= maxGrade);

        // 2. Question 型に変換
        let asQuestions: Question[] = filtered.map((word) => ({
            word,
            mode,
        }));

        // 3. シャッフル
        if (shuffle) {
            asQuestions = shuffleArray(asQuestions);
        }

        // 4. limit があれば切り出し
        if (typeof limit === 'number' && limit > 0) {
            asQuestions = asQuestions.slice(0, limit);
        }

        return asQuestions;
    }, [minGrade, maxGrade, limit, shuffle, mode]);

    return { questions };
}
