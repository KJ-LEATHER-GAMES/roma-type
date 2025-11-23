// src/features/typing/core/useQuestionRunner.ts

import { useCallback, useMemo, useState } from 'react';

import type { Question, QuestionResult, SessionStats } from '@/features/typing/core/questionTypes';
import { calcQuestionScore } from '@/features/typing/core/score';

export type UseQuestionRunnerResult = {
    currentQuestion: Question | null;
    currentIndex: number;
    totalCount: number;
    isFinished: boolean;

    // セッション統計
    sessionStats: SessionStats;
    questionResults: QuestionResult[];

    // ライフサイクル制御
    startQuestion: () => void;
    registerKey: (options: { isMistype: boolean }) => void;
    completeCurrentQuestion: () => void;
    goNext: () => void;
    resetAll: () => void;
};

export function useQuestionRunner(questions: Question[]): UseQuestionRunnerResult {
    const totalCount = questions.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

    // SessionStats は questionResults から計算してもOKだけど、
    // ここでは簡単のために useMemo で算出する
    const sessionStats: SessionStats = useMemo(() => {
        const totalQuestions = totalCount;
        let clearedQuestions = 0;
        let totalMistypes = 0;
        let totalKeystrokes = 0;
        let score = 0;

        for (const result of questionResults) {
            clearedQuestions += 1;
            totalMistypes += result.mistypeCount;
            totalKeystrokes += result.keystrokeCount;
            score += calcQuestionScore(result.mistypeCount);
        }

        const accuracy =
            totalKeystrokes === 0 ? 1 : (totalKeystrokes - totalMistypes) / totalKeystrokes;

        return {
            totalQuestions,
            clearedQuestions,
            totalMistypes,
            totalKeystrokes,
            score,
            accuracy,
        };
    }, [questionResults, totalCount]);

    const isFinished = currentIndex >= totalCount;

    const currentQuestion: Question | null = !isFinished ? questions[currentIndex] : null;

    const startQuestion = useCallback(() => {
        // 現在問題の startedAt を更新（まだなければ作成）
        const question = currentQuestion;
        if (!question) return;

        setQuestionResults((prev) => {
            const now = Date.now();
            const idx = prev.findIndex((r) => r.questionId === question.word.id);
            if (idx === -1) {
                return [
                    ...prev,
                    {
                        questionId: question.word.id,
                        mistypeCount: 0,
                        keystrokeCount: 0,
                        startedAt: now,
                        completedAt: now,
                    },
                ];
            }
            const copy = [...prev];
            copy[idx] = {
                ...copy[idx],
                startedAt: now,
            };
            return copy;
        });
    }, [currentQuestion]);

    const registerKey = useCallback(
        (options: { isMistype: boolean }) => {
            const question = currentQuestion;
            if (!question) return;

            setQuestionResults((prev) => {
                const idx = prev.findIndex((r) => r.questionId === question.word.id);
                // まだ結果レコードがなければ作る
                const now = Date.now();
                if (idx === -1) {
                    return [
                        ...prev,
                        {
                            questionId: question.word.id,
                            mistypeCount: options.isMistype ? 1 : 0,
                            keystrokeCount: 1,
                            startedAt: now,
                            completedAt: now,
                        },
                    ];
                }

                const copy = [...prev];
                const existing = copy[idx];
                copy[idx] = {
                    ...existing,
                    mistypeCount: existing.mistypeCount + (options.isMistype ? 1 : 0),
                    keystrokeCount: existing.keystrokeCount + 1,
                };
                return copy;
            });
        },
        [currentQuestion],
    );

    const completeCurrentQuestion = useCallback(() => {
        const question = currentQuestion;
        if (!question) return;

        setQuestionResults((prev) => {
            const now = Date.now();
            const idx = prev.findIndex((r) => r.questionId === question.word.id);
            if (idx === -1) {
                // まだなければ最小限のレコードを作る
                return [
                    ...prev,
                    {
                        questionId: question.word.id,
                        mistypeCount: 0,
                        keystrokeCount: 0,
                        startedAt: now,
                        completedAt: now,
                    },
                ];
            }
            const copy = [...prev];
            const existing = copy[idx];
            copy[idx] = {
                ...existing,
                completedAt: now,
            };
            return copy;
        });
    }, [currentQuestion]);

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => prev + 1);
    }, []);

    const resetAll = useCallback(() => {
        setCurrentIndex(0);
        setQuestionResults([]);
    }, []);

    return {
        currentQuestion,
        currentIndex,
        totalCount,
        isFinished,
        sessionStats,
        questionResults,
        startQuestion,
        registerKey,
        completeCurrentQuestion,
        goNext,
        resetAll,
    };
}
