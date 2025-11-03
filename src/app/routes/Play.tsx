import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Play() {
    const navigate = useNavigate();
    const [typed, setTyped] = useState('');
    const target = 'roma'; // ダミー問題

    function handleKeyDown(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setTyped(value);
    }

    return (
        <section aria-labelledby="play-title">
            <h1 id="play-title">Typing Stage</h1>
            <p>以下の単語を入力してください：</p>
            <h2 style={{ fontSize: '2rem', letterSpacing: '2px' }}>{target}</h2>

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

            <div style={{ marginTop: '24px' }}>
                <button className="btn" onClick={() => void navigate('/result')}>
                    ▶ 結果を見る（ダミー）
                </button>
                <button className="btn" onClick={() => void navigate('/')}>
                    ← ホームへ戻る
                </button>
            </div>
        </section>
    );
}
