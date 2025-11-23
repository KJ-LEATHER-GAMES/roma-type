// src/pages/Play.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';
import { useTypingCore } from '@/features/typing/core';
import { useQuestionRunner } from '@/features/typing/core/useQuestionRunner';
import { useQuestionSet } from '@/features/typing/core/useQuestionSet';

/**
 * タイピング入力画面 (S2-5: 辞書 + 出題システム統合)
 * - romaji_dict.json から useQuestionSet で出題セットを生成
 * - useQuestionRunner で「何問目か」「終了したか」「スコア」などを管理
 * - Startで1問目から開始（Start前はお題非表示）
 * - 1単語 complete で Flash → 少し待って自動で次の単語へ
 * - 全問終わったら Finish 状態に遷移し、再プレイ／タイトル戻るを選択可能
 * - 上部：タイトル＋Theme＋進行表示
 * - 中央：漢字＋かな表示＋[typed][remaining]
 * - 下部：Start or Finishボタン（プレイ中はボタンなし）
 */

// 画面フェーズ
type ViewPhase = 'ready' | 'playing' | 'finished';

export default function Play() {
    const navigate = useNavigate();

    // 出題セット（30語辞書から生成）
    const { questions } = useQuestionSet({
        minGrade: 1,
        maxGrade: 3,
        shuffle: true,
        mode: 'kanaToRomaji',
    });

    const {
        currentQuestion,
        currentIndex,
        totalCount,
        // isFinished, // 今回は独自フェーズ管理で制御するので未使用
        sessionStats,
        // questionResults, // 将来「1問ごとの結果」を表示したくなったら使う
        // startQuestion,   // ひとまず未使用（必要になったら導入）
        // registerKey,     // useTypingCore 側の拡張と一緒に有効化予定
        completeCurrentQuestion,
        goNext,
        resetAll,
    } = useQuestionRunner(questions);

    // 現在の問題のワード（Question → RomajiWord）
    const currentWord = currentQuestion?.word ?? null;
    const totalQuestions = totalCount;

    // 画面フェーズ管理
    const [phase, setPhase] = useState<ViewPhase>('ready');

    // 演出用クラス（Flash / Shake / Miss）
    const [effectClass, setEffectClass] = useState<string | null>(null);

    // 1問分のタイピングコア
    // currentWord がまだ null の場合は空配列を渡しておき、実質入力不能状態にしておく
    const { typed, remaining, judgeResult, startRound, stopRound, reset } = useTypingCore({
        targetRomajiVariants: currentWord?.romajiVariants ?? [],
    });

    // ヘッダーに表示する「何問目か」
    // ready: 0 / N, playing: n / N, finished: N / N
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
            if (!currentQuestion) return;

            const lastIndex = totalQuestions - 1;

            // 最終問題が終わった
            if (currentIndex >= lastIndex) {
                // この問題の完了を記録
                completeCurrentQuestion();
                // フェーズを finished にして入力受付を停止
                setPhase('finished');
                stopRound();
                return;
            }

            // まだ残りの問題がある → 次の単語へ
            completeCurrentQuestion();
            goNext();
            startRound(); // typed をクリア＆ running にする
        }, 220); // Flash が見える程度のディレイ

        return () => {
            clearTimeout(timer);
        };
    }, [
        judgeResult.kind,
        phase,
        currentQuestion,
        currentIndex,
        totalQuestions,
        completeCurrentQuestion,
        goNext,
        startRound,
        stopRound,
    ]);

    // ====== Start（ゲーム開始） ======
    const handleStart = () => {
        // 出題ランナーとタイピング状態を初期化してから開始
        resetAll();
        reset(); // state: idle / typed: ''
        setPhase('playing');
        startRound(); // typed クリア＆ running
    };

    // ====== Finish 画面からの Retry ======
    const handleRetry = () => {
        resetAll();
        reset();
        setPhase('playing');
        startRound();
    };

    // ====== タイトルへ戻る ======
    const handleBackToTitle = () => {
        resetAll();
        reset();
        setPhase('ready');
        void navigate('/'); // ルーティングに合わせて必要なら変更
    };

    // 辞書がまだ空だった場合のフォールバック（基本的には発生しない想定）
    if (questions.length === 0) {
        return (
            <PixelPanel pixcel-rounded className="u-stack u-gap-3">
                <div className="u-row u-space-between u-align-center">
                    <h1 className="pixel-font-tight">Play</h1>
                    <ThemeSwitcher />
                </div>
                <p className="pixel-font-tight">Loading dictionary...</p>
            </PixelPanel>
        );
    }

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

            {/* ▼ PLAYING（問題出題中） ▼ */}
            {phase === 'playing' && currentWord && (
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

            {/* ▼ FINISHED（全問完了時のFinishパネル） ▼ */}
            {phase === 'finished' && (
                <FinishPanel
                    onRetry={handleRetry}
                    onBackToTitle={handleBackToTitle}
                    score={sessionStats.score}
                    mistypes={sessionStats.totalMistypes}
                    cleared={sessionStats.clearedQuestions}
                    total={sessionStats.totalQuestions}
                />
            )}
        </PixelPanel>
    );
}

type FinishPanelProps = {
    onRetry: () => void;
    onBackToTitle: () => void;
    score: number;
    mistypes: number;
    cleared: number;
    total: number;
};

function FinishPanel({
    onRetry,
    onBackToTitle,
    score,
    mistypes,
    cleared,
    total,
}: FinishPanelProps) {
    return (
        <div className="play-main">
            <div className="play-finish-panel u-stack u-gap-3 u-align-center u-justify-center">
                <div className="pixel-font-tight play-finish-title u-flash">Finish!</div>
                <p className="pixel-font play-finish-message">おつかれさま！ もういちど あそぶ？</p>

                {/* スコア表示（S2-5の成果） */}
                <div className="pixel-font-tight">
                    <div>Score: {score}</div>
                    <div>
                        Questions: {cleared} / {total}
                    </div>
                    <div>Mistypes: {mistypes}</div>
                </div>

                <div className="u-row u-gap-2 u-justify-center">
                    <PixelButton onClick={onRetry}>もういちどあそぶ</PixelButton>
                    <PixelButton onClick={onBackToTitle}>タイトルにもどる</PixelButton>
                </div>
            </div>
        </div>
    );
}
