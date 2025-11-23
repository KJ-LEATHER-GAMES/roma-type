// src/features/typing/core/score.ts

/**
 * 1問あたりのスコアを計算
 * - ベース 100点
 * - ミス1回ごとに -5点
 * - 最低 10点は保証
 */
export function calcQuestionScore(mistypeCount: number): number {
    const BASE = 100;
    const PENALTY = 5;
    const raw = BASE - mistypeCount * PENALTY;
    return Math.max(10, raw);
}
