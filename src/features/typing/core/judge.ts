// /features/typing/core/judge.ts

export type JudgeKind = 'progress' | 'complete' | 'mismatch';

export interface JudgeResult {
    kind: JudgeKind;
    // 必要であれば拡張用のフィールド
    // matchedLength: number;
}

export function judgeTyping(targetWord: string, typed: string): JudgeResult {
    if (typed.length === 0) {
        return { kind: 'progress' };
    }

    // 途中まで合っているか？
    const prefix = targetWord.slice(0, typed.length);

    if (typed === targetWord) {
        return { kind: 'complete' };
    }

    if (typed === prefix) {
        // まだ途中だけど、ここまでは合っている
        return { kind: 'progress' };
    }

    // ここまで来たら不一致
    return { kind: 'mismatch' };
}
