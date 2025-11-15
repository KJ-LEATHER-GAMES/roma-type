// src/pages/Play.tsx
import { useEffect, useState } from 'react';

import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';
import { useTypingCore } from '@/features/typing/core';
import { SIMPLE_WORDS } from '@/features/typing/data/simpleWords';

/**
 * タイピング入力画面 (S1-3)
 * - 清音のみの最小辞書（5語）を small round として出題
 * - Startで1問目から開始
 * - 1単語 complete で Flash → 少し待って自動で次の単語へ
 * - 5問終わったら Finish 状態に遷移
 */
export default function Play() {
    // 小問管理用の状態
    const [currentIndex, setCurrentIndex] = useState(0); // 0〜SIMPLE_WORDS.length-1
    const [isFinished, setIsFinished] = useState(false); // 5問をすべて完了したか

    // 演出用クラス（Flash / Shake）
    const [effectClass, setEffectClass] = useState<string | null>(null);

    const currentWord = SIMPLE_WORDS[currentIndex];

    // 1問分のタイピングコア
    const { state, typed, remaining, judgeResult, startRound, stopRound, reset } = useTypingCore({
        targetWord: currentWord.romaji,
    });

    // ====== 演出クラス（Flash / Shake）を付けるだけの Effect ======
    useEffect(() => {
        if (judgeResult.kind === 'mismatch') {
            setEffectClass('u-shake');
        } else if (judgeResult.kind === 'complete') {
            setEffectClass('u-flash');
        }
        // progress のときは何もしない（クラスはそのまま）
    }, [judgeResult.kind]);

    // ====== effectClass が付いたら 250ms 後にクリアする Effect ======
    useEffect(() => {
        if (!effectClass) return;

        const timeout = setTimeout(() => {
            setEffectClass(null);
        }, 250);

        return () => {
            clearTimeout(timeout);
        };
    }, [effectClass]);

    // ====== complete → 次の単語へ自動遷移 ======
    useEffect(() => {
        if (judgeResult.kind !== 'complete') return;
        if (isFinished) return;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                const lastIndex = SIMPLE_WORDS.length - 1;

                if (next > lastIndex) {
                    // 5問すべて完了
                    setIsFinished(true);
                    stopRound(); // 入力受付を停止
                    return prev; // これ以上はインデックスを進めない
                }

                // まだ残りの問題がある → 次の単語へ
                startRound(); // typed をクリア＆ running にする
                return next;
            });
        }, 220); // Flash が見える程度のディレイ（200〜250ms あたり）

        return () => {
            clearTimeout(timer);
        };
    }, [judgeResult.kind, isFinished, startRound, stopRound]);

    // ====== ボタンハンドラ ======
    const handleStart = () => {
        // 1問目から再スタート
        setCurrentIndex(0);
        setIsFinished(false);
        startRound(); // typed クリア＆ running
    };

    const handleStop = () => {
        stopRound();
    };

    const handleReset = () => {
        reset(); // state: idle / typed: ''
        setCurrentIndex(0);
        setIsFinished(false);
        setEffectClass(null);
    };

    return (
        <PixelPanel pixcel-rounded className="u-stack u-gap-2">
            {/* ヘッダー */}
            <div className="u-row u-space-between u-align-center">
                <h1 className="pixel-font-tight">Play</h1>
                <ThemeSwitcher />
            </div>

            {/* 進行状況（何問目か） */}
            <div className="pixel-font-tight">
                {currentIndex + 1} / {SIMPLE_WORDS.length}
            </div>

            {/* お題表示（かな＋ローマ字） */}
            <div className="pixel-font">
                {/* かな表記 */}
                <div className="target-kana">{currentWord.kana}</div>

                {/* typed / remaining の分割表示 */}
                <div className={`target-romaji ${effectClass ?? ''}`}>
                    <span className="typed">{typed}</span>
                    <span className="remaining">{remaining}</span>
                </div>
            </div>

            {/* Finish メッセージ（5問完了時） */}
            {isFinished && <div className="pixel-font-tight u-flash">Finish!</div>}

            {/* ステータス表示（デバッグ / 学習用） */}
            <div className="pixel-font-tight">Status: {state.status}</div>
            <div className="pixel-font-tight">Typed: [{typed}]</div>
            <div className="pixel-font-tight">LastKey: {state.lastKey ?? '-'}</div>
            <div className="pixel-font-tight">Judge: {judgeResult.kind}</div>

            {/* 操作ボタン */}
            <div className="u-row u-gap-2">
                <PixelButton onClick={handleStart}>Start</PixelButton>
                <PixelButton onClick={handleStop}>Stop</PixelButton>
                <PixelButton onClick={handleReset}>Reset</PixelButton>
            </div>
        </PixelPanel>
    );
}
