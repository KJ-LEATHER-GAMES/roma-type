// src/pages/Play.tsx
import { useEffect, useState } from 'react';

import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';
import { useTypingCore } from '@/features/typing/core';

/**
 * タイピング入力コア (S1-2)
 * - Startで入力受付開始
 * - Stopで入力停止
 * - Resetで状態初期化
 * - Status / Typed / LastKey をUIに反映
 * - targetWord に対して [typed][remaining] を表示
 * - 正解/ミス時に簡易演出（.u-flash / .u-shake）を付与
 */
export default function Play() {
    // S1-3 までは固定のお題でOK
    const targetWord = 'kame';

    const [effectClass, setEffectClass] = useState<string | null>(null);

    const { state, typed, remaining, judgeResult, startRound, stopRound, reset } = useTypingCore({
        targetWord,
    });

    // 判定結果に応じて演出クラスを一時的に付与
    useEffect(() => {
        if (judgeResult.kind === 'mismatch') {
            setEffectClass('u-shake');
        } else if (judgeResult.kind === 'complete') {
            setEffectClass('u-flash');
        } else {
            // progress のときは何もしない
            return;
        }

        const timeout = setTimeout(() => {
            setEffectClass(null);
        }, 250); // CSS の animation-duration と揃える

        return () => {
            clearTimeout(timeout);
        };
    }, [judgeResult.kind]);

    return (
        <PixelPanel pixcel-rounded className="u-stack u-gap-2">
            {/* ヘッダー */}
            <div className="u-row u-space-between u-align-center">
                <h1 className="pixel-font-tight">Play</h1>
                <ThemeSwitcher />
            </div>

            {/* お題表示（かな＋ローマ字） */}
            <div className="pixel-font">
                <div className="target-kana">かめ</div>

                {/* ★ S1-2 の主役：typed / remaining の分割表示 */}
                <div className={`target-romaji ${effectClass ?? ''}`}>
                    <span className="typed">{typed}</span>
                    <span className="remaining">{remaining}</span>
                </div>
            </div>

            {/* ステータス表示（デバッグ / 学習用） */}
            <div className="pixel-font-tight">Status: {state.status}</div>
            <div className="pixel-font-tight">Typed: [{typed}]</div>
            <div className="pixel-font-tight">LastKey: {state.lastKey ?? '-'}</div>

            {/* 操作ボタン */}
            <div className="u-row u-gap-2">
                <PixelButton onClick={startRound}>Start</PixelButton>
                <PixelButton onClick={stopRound}>Stop</PixelButton>
                <PixelButton onClick={reset}>Reset</PixelButton>
            </div>
        </PixelPanel>
    );
}
