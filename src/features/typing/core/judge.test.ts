/// <reference types="vitest" />
import romajiDict from '../../data/romaji_dict.json';

import { judgeTyping } from './judge';
import { describe, it, expect } from 'vitest';

const SHASHIN = ['shashin', 'syasin'];

describe('拗音: しゃしん', () => {
    it('sha 経路で complete までいける', () => {
        expect(judgeTyping(SHASHIN, 's').kind).toBe('progress');
        expect(judgeTyping(SHASHIN, 'sh').matchedTarget).toBe('shashin');
        expect(judgeTyping(SHASHIN, 'shashin').kind).toBe('complete');
    });

    it('sya 経路で complete までいける', () => {
        expect(judgeTyping(SHASHIN, 'sy').matchedTarget).toBe('syasin');
        expect(judgeTyping(SHASHIN, 'syasin').kind).toBe('complete');
    });
});

describe('sokuon (っ) handling', () => {
    const targets = ['gakkou'];

    it('keeps progress for valid prefixes (1〜2回目の子音含む)', () => {
        expect(judgeTyping(targets, 'g').kind).toBe('progress');
        expect(judgeTyping(targets, 'ga').kind).toBe('progress');
        expect(judgeTyping(targets, 'gak').kind).toBe('progress');
        expect(judgeTyping(targets, 'gakk').kind).toBe('progress');
        expect(judgeTyping(targets, 'gakko').kind).toBe('progress');
    });

    it('returns complete when fully matched', () => {
        const result = judgeTyping(targets, 'gakkou');
        expect(result.kind).toBe('complete');
        expect(result.matchedTarget).toBe('gakkou');
    });

    it('returns mismatch on invalid sequence after small tsu position', () => {
        // 例: g a k まで正しいが、次が x なので促音の子音にならない
        const result = judgeTyping(targets, 'gakx');
        expect(result.kind).toBe('mismatch');
    });
});

describe('hatsuon (ん) handling', () => {
    it('hon: n at word end is handled as normal progress/complete', () => {
        const targets = ['hon'];

        expect(judgeTyping(targets, 'h').kind).toBe('progress');
        expect(judgeTyping(targets, 'ho').kind).toBe('progress');

        const result = judgeTyping(targets, 'hon');
        expect(result.kind).toBe('complete');
        expect(result.matchedTarget).toBe('hon');
    });

    it('kanna: nn before na-row is required', () => {
        const targets = ['kanna'];

        expect(judgeTyping(targets, 'ka').kind).toBe('progress');
        expect(judgeTyping(targets, 'kan').kind).toBe('progress'); // まだ途中
        expect(judgeTyping(targets, 'kann').kind).toBe('progress');
        expect(judgeTyping(targets, 'kanna').kind).toBe('complete');

        // 間違って "kana" と打った場合は mismatch になること
        expect(judgeTyping(targets, 'kana').kind).toBe('mismatch');
    });

    it('sannin: nn in the middle is handled correctly', () => {
        const targets = ['sannin'];

        expect(judgeTyping(targets, 'san').kind).toBe('progress');
        expect(judgeTyping(targets, 'sann').kind).toBe('progress');
        expect(judgeTyping(targets, 'sanni').kind).toBe('progress');

        const result = judgeTyping(targets, 'sannin');
        expect(result.kind).toBe('complete');
    });
});

describe('long vowels (ou/oo) handling', () => {
    it('toukyou: ou ou pattern', () => {
        const targets = ['toukyou'];

        expect(judgeTyping(targets, 't').kind).toBe('progress');
        expect(judgeTyping(targets, 'tou').kind).toBe('progress');
        expect(judgeTyping(targets, 'toukyou').kind).toBe('complete');

        // 間違い例: tokyou（う一個足りない）
        expect(judgeTyping(targets, 'tokyou').kind).toBe('mismatch');
    });

    it('obaasan: aa pattern', () => {
        const targets = ['obaasan'];

        expect(judgeTyping(targets, 'obaa').kind).toBe('progress');

        const result = judgeTyping(targets, 'obaasan');
        expect(result.kind).toBe('complete');

        // 間違い例: obasan（あが一つ足りない）
        expect(judgeTyping(targets, 'obasan').kind).toBe('mismatch');
    });

    it('kyoushitsu: combination of youon + long vowel + sokuon', () => {
        const targets = ['kyoushitsu'];

        expect(judgeTyping(targets, 'kyo').kind).toBe('progress');
        expect(judgeTyping(targets, 'kyou').kind).toBe('progress');
        expect(judgeTyping(targets, 'kyoushi').kind).toBe('progress');

        const result = judgeTyping(targets, 'kyoushitsu');
        expect(result.kind).toBe('complete');
    });
});

type JudgeStatus = 'idle' | 'progress' | 'complete' | 'mismatch';

interface JudgeResult {
    status: JudgeStatus;
    matchedTarget?: string | null;
}

interface RomajiWord {
    id: string;
    kanji: string;
    kana: string;
    english: string;
    romajiVariants: string[];
    grade: number;
}

const dict = romajiDict as RomajiWord[];

describe('romaji_dict basic validity', () => {
    it('every entry has required fields', () => {
        for (const word of dict) {
            expect(word.id).toBeTruthy();
            expect(word.kanji).toBeTruthy();
            expect(word.kana).toBeTruthy();
            expect(word.english).toBeTruthy();
            expect(Array.isArray(word.romajiVariants)).toBe(true);
            expect(word.romajiVariants.length).toBeGreaterThan(0);
            expect(typeof word.grade).toBe('number');
        }
    });

    it('all romajiVariants are fully typeable (judgeTyping returns complete)', () => {
        for (const word of dict) {
            for (const variant of word.romajiVariants) {
                const result = judgeTyping(word.romajiVariants, variant);

                expect(result.kind).toBe('complete');
                // 完全一致したときは matchedTarget がその語のどれかになっていることも確認
                expect(word.romajiVariants).toContain(result.matchedTarget);
            }
        }
    });
});
