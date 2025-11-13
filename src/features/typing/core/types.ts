// src/features/typing/core/types.ts
export type TypingStatus = 'idle' | 'running' | 'stopped';

export type TypingState = {
    status: TypingStatus;
    typed: string; // ユーザーが打った英字の累積
    lastKey?: string; // 直近に打たれたキー（演出/デバッグ用）
    startedAt?: number; // 開始時刻（S1-3でWPM等に利用予定）
};

export type TypingAPI = {
    state: TypingState;
    startRound: () => void;
    stopRound: () => void;
    reset: () => void;
};
