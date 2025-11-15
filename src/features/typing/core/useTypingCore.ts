// src/features/typing/core/useTypingCore.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { judgeTyping } from './judge';
import type { JudgeResult } from './judge';
import type { TypingState } from './types';

/**
 * 英字のみ受付（a-z）。修飾キー/リピートは無視。
 */
const isLetter = (e: KeyboardEvent): boolean => {
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return false;
    const k = e.key.toLowerCase();
    return /^[a-z]$/.test(k);
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
 * - state: S1-1 で定義したタイピング状態（status / typed / startedAt など）
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
 * S1-2 では、targetWord との比較結果（judgeResult, remaining）も提供する。
 */
export function useTypingCore(options: TypingCoreOptions): TypingCoreAPI {
    const { targetWord } = options;

    const [state, setState] = useState<TypingState>({
        status: 'idle',
        typed: '',
    });

    // 最新の稼働フラグ（useEffect内から参照）
    const runningRef = useRef(false);

    const startRound = useCallback(() => {
        runningRef.current = true;
        setState({
            status: 'running',
            typed: '',
            startedAt: typeof performance !== 'undefined' ? performance.now() : Date.now(),
        });
    }, []);

    const stopRound = useCallback(() => {
        runningRef.current = false;
        setState((s) => ({ ...s, status: 'stopped' }));
    }, []);

    const reset = useCallback(() => {
        runningRef.current = false;
        setState({ status: 'idle', typed: '' });
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!runningRef.current) return;
            if (!isLetter(e)) return;

            const k = e.key.toLowerCase();
            // ここでは「入力を積む」のみに専念し、判定は judgeTyping に委譲
            setState((s) => ({
                ...s,
                typed: (s.typed ?? '') + k,
                lastKey: k,
            }));
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            runningRef.current = false;
        };
    }, []);

    // state から typed を取り出し（undefined の場合に備えてフォールバック）
    const typed = state.typed ?? '';

    // 残り文字列（UI のための派生値）
    const remaining = useMemo(() => targetWord.slice(typed.length), [targetWord, typed]);

    // 正誤判定（前方一致 / 完全一致 / 不一致）
    const judgeResult = useMemo(() => judgeTyping(targetWord, typed), [targetWord, typed]);

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
