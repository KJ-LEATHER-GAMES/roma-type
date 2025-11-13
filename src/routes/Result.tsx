import { useNavigate } from 'react-router-dom';

import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';

export default function Result() {
    const navigate = useNavigate();
    const score = 123; // ダミースコア

    return (
        <div style={{ padding: 16 }}>
            <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <h1 className="pixel-font-tight" style={{ margin: 0 }}>
                    Roma Type Quest
                </h1>
                <ThemeSwitcher />
            </header>
            <PixelPanel pixcel-rounded={false}>
                <h2 className="pixel-font-tight" style={{ marginTop: 0 }}>
                    Result
                </h2>
                <p>
                    あなたのスコア：<strong>{score}</strong>
                </p>
                <p>正確度：98%、コンボ：42</p>

                <div style={{ display: 'flex', gap: 8 }}>
                    <PixelButton className="btn" onClick={() => void navigate('/play')}>
                        🔁 もう一度プレイ
                    </PixelButton>
                    <PixelButton className="btn" onClick={() => void navigate('/')}>
                        🏠 ホームへ
                    </PixelButton>
                </div>
            </PixelPanel>
        </div>
    );
}
