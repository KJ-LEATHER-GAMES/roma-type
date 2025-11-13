// src/features/typing/core/useTypingCore.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { TypingAPI, TypingState } from './types';

/**
 * 英字のみ受付（a-z）。修飾キー/リピートは無視。
 */
const isLetter = (e: KeyboardEvent): boolean => {
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return false;
    const k = e.key.toLowerCase();
    return /^[a-z]$/.test(k);
};

/**
 * タイピング入力の最小コア。
 * - startRound(): 入力受付開始（typedをクリア）
 * - stopRound(): 入力受付停止
 * - reset(): 状態を初期化
 * S1-1では正誤判定を一切行わず「入力の取得」に専念します。
 */
export function useTypingCore(): TypingAPI {
    const [state, setState] = useState<TypingState>({ status: 'idle', typed: '' });
    const runningRef = useRef(false); // 最新の稼働フラグ（useEffect内から参照）

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
            // ここでは「入力を積む」のみに専念（判定はS1-2へ委譲）
            setState((s) => ({
                ...s,
                typed: s.typed + k,
                lastKey: k,
            }));
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            runningRef.current = false;
        };
    }, []);

    return useMemo(
        () => ({ state, startRound, stopRound, reset }),
        [state, startRound, stopRound, reset],
    );
}
