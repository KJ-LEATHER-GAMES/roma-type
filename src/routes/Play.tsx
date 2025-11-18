// src/pages/Play.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';
import { useTypingCore } from '@/features/typing/core';
import { ROMAJI_WORDS } from '@/features/typing/data/words';

/**
 * タイピング入力画面 (S1-4: T4-1/T4-2/T4-3 対応)
 * - 清音のみの最小辞書（5語）を small round として出題
 * - Startで1問目から開始（Start前はお題非表示）
 * - 1単語 complete で Flash → 少し待って自動で次の単語へ
 * - 5問終わったら Finish 状態に遷移し、再プレイ／タイトル戻るを選択可能
 * - 上部：タイトル＋Theme＋進行表示
 * - 中央：かな表示＋[typed][remaining]
 * - 下部：Start or Finishボタン（プレイ中はボタンなし）
 */

// 画面フェーズ
type ViewPhase = 'ready' | 'playing' | 'finished';

export default function Play() {
    const navigate = useNavigate();

    // 小問管理用の状態
    const [currentIndex, setCurrentIndex] = useState(0); // 0〜SIMPLE_WORDS.length-1

    // 画面フェーズ管理
    const [phase, setPhase] = useState<ViewPhase>('ready');

    // 演出用クラス（Flash / Shake / Miss）
    const [effectClass, setEffectClass] = useState<string | null>(null);

    const currentWord = ROMAJI_WORDS[currentIndex];
    const totalQuestions = ROMAJI_WORDS.length;

    // 1問分のタイピングコア
    const { typed, remaining, judgeResult, startRound, stopRound, reset } = useTypingCore({
        targetRomajiVariants: currentWord.romajiVariants,
    });

    // ヘッダーに表示する「何問目か」
    // ready: 0 / 5, playing: n / 5, finished: 5 / 5
    const displayQuestionNumber =
        phase === 'ready' ? 0 : phase === 'finished' ? totalQuestions : currentIndex + 1;

    // ====== 演出クラス（Flash / Shake / Miss）を付ける Effect ======
    useEffect(() => {
        if (judgeResult.kind === 'mismatch') {
            // いったんクラスを外してから次フレームで付け直す
            setEffectClass(null);

            const id = window.requestAnimationFrame(() => {
                setEffectClass('u-shake u-miss');
            });

            return () => {
                window.cancelAnimationFrame(id);
            };
        }

        if (judgeResult.kind === 'complete') {
            setEffectClass('u-flash');
        }
    }, [judgeResult]);

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

    // ====== complete → 次の単語へ自動遷移（＋最終問題で Finish） ======
    useEffect(() => {
        if (judgeResult.kind !== 'complete') return;
        if (phase === 'finished') return;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                const lastIndex = ROMAJI_WORDS.length - 1;

                if (next > lastIndex) {
                    // 5問すべて完了 → Finishへ
                    setPhase('finished');
                    stopRound(); // 入力受付を停止
                    return prev; // これ以上はインデックスを進めない
                }

                // まだ残りの問題がある → 次の単語へ
                startRound(); // typed をクリア＆ running にする
                return next;
            });
        }, 220); // Flash が見える程度のディレイ

        return () => {
            clearTimeout(timer);
        };
    }, [judgeResult.kind, phase, startRound, stopRound]);

    // ====== Start（ゲーム開始） ======
    const handleStart = () => {
        // 1問目から開始
        setCurrentIndex(0);
        reset(); // state: idle / typed: ''
        startRound(); // typed クリア＆ running
        setPhase('playing');
    };

    // ====== Finish 画面からの Retry ======
    const handleRetry = () => {
        reset();
        setCurrentIndex(0);
        startRound();
        setPhase('playing');
    };

    // ====== タイトルへ戻る ======
    const handleBackToTitle = () => {
        reset();
        setPhase('ready');
        void navigate('/'); // ルーティングに合わせて必要なら変更
    };

    return (
        <PixelPanel pixcel-rounded className="u-stack u-gap-3">
            {/* ヘッダー行：タイトル & テーマ切替 */}
            <div className="u-row u-space-between u-align-center">
                <h1 className="pixel-font-tight">Play</h1>
                <ThemeSwitcher />
            </div>

            {/* 進行状況（何問目か） */}
            <div className="u-row u-space-between u-align-center pixel-font-tight">
                <span>Small Round</span>
                <span>
                    {displayQuestionNumber} / {totalQuestions}
                </span>
            </div>

            {/* ============================
               ready / playing / finished でメインエリア切り替え
            ============================ */}

            {/* ▼ READY（Start前：お題は見せない） ▼ */}
            {phase === 'ready' && (
                <div className="u-stack u-gap-3 u-align-center u-justify-center play-main">
                    <p className="pixel-font-tight">ローマ字れんしゅう！</p>
                    <p className="pixel-font play-guide-text">すたーとぼたんを おしてね！</p>
                    <PixelButton onClick={handleStart}>START</PixelButton>
                </div>
            )}

            {phase === 'playing' && (
                <div className="u-stack u-gap-3 u-align-center u-justify-center play-main">
                    {/* 漢字＋かな表示 */}
                    <div className="u-stack u-align-center u-gap-1">
                        {/* 漢字があれば漢字を大きく、なければかなを大きく */}
                        <div className="target-word-main pixel-font-tight">
                            {currentWord.kanji ?? currentWord.kana}
                        </div>

                        {/* 漢字があるときだけ、かなをサブ表示 */}
                        {currentWord.kanji && (
                            <div className="target-word-sub pixel-font-tight">
                                {currentWord.kana}
                            </div>
                        )}
                    </div>

                    {/* ローマ字 [typed][remaining] */}
                    <div className={`target-romaji pixel-font-tight ${effectClass ?? ''}`}>
                        <span className="typed">{typed}</span>
                        <span className="remaining">{remaining}</span>
                    </div>

                    {/* ガイド文：プレイ中 */}
                    <p className="pixel-font play-guide-text">ローマ字を にゅうりょくしてね！</p>
                </div>
            )}

            {/* ▼ FINISHED（5問完了時のFinishパネル） ▼ */}
            {phase === 'finished' && (
                <FinishPanel onRetry={handleRetry} onBackToTitle={handleBackToTitle} />
            )}
        </PixelPanel>
    );
}

type FinishPanelProps = {
    onRetry: () => void;
    onBackToTitle: () => void;
};

function FinishPanel({ onRetry, onBackToTitle }: FinishPanelProps) {
    return (
        <div className="play-main">
            <div className="play-finish-panel u-stack u-gap-3 u-align-center u-justify-center">
                <div className="pixel-font-tight play-finish-title u-flash">Finish!</div>
                <p className="pixel-font play-finish-message">おつかれさま！ もういちど あそぶ？</p>
                <div className="u-row u-gap-2 u-justify-center">
                    <PixelButton onClick={onRetry}>もういちどあそぶ</PixelButton>
                    <PixelButton onClick={onBackToTitle}>タイトルにもどる</PixelButton>
                </div>
            </div>
        </div>
    );
}
