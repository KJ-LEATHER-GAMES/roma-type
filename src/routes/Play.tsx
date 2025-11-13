// src/pages/Play.tsx
import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';
import { useTypingCore } from '@/features/typing/core';

/**
 * タイピング入力コア (S1-1)
 * - Startで入力受付開始
 * - Stopで入力停止
 * - Resetで状態初期化
 * - Status / Typed / LastKey をUIに反映
 */
export default function Play() {
    const { state, startRound, stopRound, reset } = useTypingCore();

    return (
        <PixelPanel className="u-stack u-gap-2">
            {/* ヘッダー */}
            <div className="u-row u-space-between u-align-center">
                <h1 className="pixel-font-tight">Play</h1>
                <ThemeSwitcher />
            </div>

            {/* ステータス表示 */}
            <div className="pixel-font-tight">Status: {state.status}</div>
            <div className="pixel-font-tight">Typed: [{state.typed}]</div>
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
