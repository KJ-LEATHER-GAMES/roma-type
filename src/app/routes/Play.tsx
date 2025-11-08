import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PixelButton } from '../../components/ui/PixelButton';
import { PixelPanel } from '../../components/ui/PixelPanel';
import { ThemeSwitcher } from '../../components/ui/ThemeSwitcher';

export default function Play() {
    const navigate = useNavigate();
    const [typed, setTyped] = useState('');
    const target = 'roma'; // ダミー問題

    function handleKeyDown(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setTyped(value);
    }

    return (
        <div style={{ padding: 16 }}>
            <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <h1 className="pixel-font-tight" style={{ margin: 0 }}>
                    Roma Type Quest
                </h1>
                <ThemeSwitcher />
            </header>
            <PixelPanel>
                <h2 className="pixel-font-tight" style={{ marginTop: 0 }}>
                    Play
                </h2>
                <input
                    type="text"
                    value={typed}
                    onChange={handleKeyDown}
                    placeholder="ここに入力..."
                    className="btn"
                    style={{ width: '200px', marginTop: '12px' }}
                />

                <p style={{ marginTop: '8px' }}>
                    {typed === target ? '✅ クリア！' : `入力中: ${typed || '（まだ未入力）'}`}
                </p>
                <p style={{ marginTop: 0 }}>
                    ここにゲームのコアループ（入力→判定→スコア）UIを配置します。
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                    <PixelButton>Pause</PixelButton>
                    <PixelButton rounded={false}>Give up</PixelButton>
                </div>
            </PixelPanel>
            <section aria-labelledby="play-title">
                <h1 id="play-title">Typing Stage</h1>
                <p>以下の単語を入力してください：</p>
                <h2 style={{ fontSize: '2rem', letterSpacing: '2px' }}>{target}</h2>

                <div style={{ marginTop: '24px' }}>
                    <button className="btn" onClick={() => void navigate('/result')}>
                        ▶ 結果を見る（ダミー）
                    </button>
                    <button className="btn" onClick={() => void navigate('/')}>
                        ← ホームへ戻る
                    </button>
                </div>
            </section>
        </div>
    );
}
