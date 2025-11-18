// src/features/typing/core/useTypingCore.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { judgeTyping } from './judge';
import type { JudgeResult } from './judge';

/**
 * キーボードイベントが「有効な英字キー」かどうかを判定
 * - a〜z のみ受付
 * - repeat / 修飾キー付きは無視
 */
const isLetter = (e: KeyboardEvent): boolean => {
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return false;
    const k = e.key.toLowerCase();
    return /^[a-z]$/.test(k);
};

export type TypingStatus = 'idle' | 'running' | 'stopped' | 'completed';

export type TypingState = {
    status: TypingStatus;
    typed: string;
    lastKey: string | null;
    startedAt: number | null;
    mistakeCount: number;
    judgeResult: JudgeResult;
};

/**
 * useTypingCore に渡すオプション
 * - targetWord: 判定対象となるローマ字文字列
 */
export interface TypingCoreOptions {
    targetWord: string;
}

/**
 * useTypingCore が返すAPI
 * - state: タイピング状態（status / typed / mistakeCount など）
 * - typed: 直近の入力済み文字列（state.typed のショートカット）
 * - remaining: targetWord から typed を除いた残り部分
 * - judgeResult: targetWord と typed の前方一致/完全一致/不一致の判定
 * - startRound / stopRound / reset: 入力ループ制御用の関数
 */
export interface TypingCoreAPI {
    state: TypingState;
    typed: string;
    remaining: string;
    judgeResult: JudgeResult;

    startRound: () => void;
    stopRound: () => void;
    reset: () => void;
}

/**
 * タイピング入力のコア処理。
 * - startRound(): 入力受付開始（typedをクリア）
 * - stopRound(): 入力受付停止
 * - reset(): 状態を初期化
 * S1-4ではミスしても継続可能・mistakeCountをカウントする。
 */
export function useTypingCore(options: TypingCoreOptions): TypingCoreAPI {
    const { targetWord } = options;

    const [state, setState] = useState<TypingState>(() => ({
        status: 'idle',
        typed: '',
        lastKey: null,
        startedAt: null,
        mistakeCount: 0,
        judgeResult: judgeTyping(targetWord, ''),
    }));

    // 最新の稼働フラグ（useEffect内から参照）
    const runningRef = useRef(false);

    const startRound = useCallback(() => {
        runningRef.current = true;
        setState({
            status: 'running',
            typed: '',
            lastKey: null,
            startedAt: typeof performance !== 'undefined' ? performance.now() : Date.now(),
            mistakeCount: 0,
            judgeResult: judgeTyping(targetWord, ''),
        });
    }, [targetWord]);

    const stopRound = useCallback(() => {
        runningRef.current = false;
        setState((s) => ({ ...s, status: 'stopped' }));
    }, []);

    const reset = useCallback(() => {
        runningRef.current = false;
        setState({
            status: 'idle',
            typed: '',
            lastKey: null,
            startedAt: null,
            mistakeCount: 0,
            judgeResult: judgeTyping(targetWord, ''),
        });
    }, [targetWord]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!runningRef.current) return;
            if (!isLetter(e)) return;

            const key = e.key.toLowerCase();

            setState((prev) => {
                if (prev.status !== 'running') return prev;

                const nextTyped = (prev.typed ?? '') + key;
                const nextJudge = judgeTyping(targetWord, nextTyped);

                if (nextJudge.kind === 'mismatch') {
                    return {
                        ...prev,
                        lastKey: key,
                        mistakeCount: prev.mistakeCount + 1,
                        judgeResult: nextJudge,
                    };
                }

                const nextStatus: TypingStatus =
                    nextJudge.kind === 'complete' ? 'completed' : 'running';

                return {
                    ...prev,
                    typed: nextTyped,
                    lastKey: key,
                    judgeResult: nextJudge,
                    status: nextStatus,
                };
            });
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            // ★ ここは消す
            // runningRef.current = false;
        };
    }, [targetWord]);

    // state から typed を取り出し
    const typed = state.typed ?? '';

    // 残り文字列（UI のための派生値）
    const remaining = useMemo(() => targetWord.slice(typed.length), [targetWord, typed]);

    const judgeResult = state.judgeResult;

    // 返却するAPIをまとめてメモ化
    return useMemo(
        () => ({
            state,
            typed,
            remaining,
            judgeResult,
            startRound,
            stopRound,
            reset,
        }),
        [state, typed, remaining, judgeResult, startRound, stopRound, reset],
    );
}
