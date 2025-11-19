/// <reference types="vitest" />

import { judgeTyping } from './judge';

const SHASHIN = ['shashin', 'syasin'];

describe('拗音: しゃしん', () => {
    test('sha 経路で complete までいける', () => {
        expect(judgeTyping(SHASHIN, 's').kind).toBe('progress');
        expect(judgeTyping(SHASHIN, 'sh').matchedTarget).toBe('shashin');
        expect(judgeTyping(SHASHIN, 'shashin').kind).toBe('complete');
    });

    test('sya 経路で complete までいける', () => {
        expect(judgeTyping(SHASHIN, 'sy').matchedTarget).toBe('syasin');
        expect(judgeTyping(SHASHIN, 'syasin').kind).toBe('complete');
    });
});
