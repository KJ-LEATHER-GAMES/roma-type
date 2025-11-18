// /features/typing/core/judge.ts

export type JudgeKind = 'progress' | 'complete' | 'mismatch';

export interface JudgeResult {
    kind: JudgeKind;

    // どのローマ字パターンにマッチしているか（UI側で typed / remaining を出すために使う）
    matchedTarget?: string;
    matchedIndex?: number;
}
// オーバーロード
export function judgeTyping(targetWord: string, typed: string): JudgeResult;
export function judgeTyping(targetWords: string[], typed: string): JudgeResult;

export function judgeTyping(targetWord: string | string[], typed: string): JudgeResult {
    const targets = Array.isArray(targetWord) ? targetWord : [targetWord];

    // 未入力ならとりあえず progress
    if (typed.length === 0) {
        return {
            kind: 'progress',
            matchedTarget: targets[0],
            matchedIndex: 0,
        };
    }

    let progressIndex: number | null = null;

    for (let i = 0; i < targets.length; i += 1) {
        const t = targets[i];

        if (typed === t) {
            return {
                kind: 'complete',
                matchedTarget: t,
                matchedIndex: i,
            };
        }

        const prefix = t.slice(0, typed.length);
        if (typed === prefix) {
            if (progressIndex === null) {
                progressIndex = i;
            }
        }
    }

    if (progressIndex !== null) {
        const t = targets[progressIndex];
        return {
            kind: 'progress',
            matchedTarget: t,
            matchedIndex: progressIndex,
        };
    }

    return { kind: 'mismatch' };
}
