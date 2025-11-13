// src/app/routes/Home.tsx
// 1. インポート
import { useNavigate } from 'react-router-dom';

import { PixelPanel, PixelButton, ThemeSwitcher } from '@/components/ui';

// 6. ホームコンポーネント
export default function Home() {
    // 7. ナビゲーション関数
    const navigate = useNavigate();
    // 8. ベースピクセル
    const basePixel = 16;
    // 9. レンダリング
    return (
        <div style={{ padding: 16 }}>
            <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <h1 className="pixel-font-tight" style={{ margin: 0 }}>
                    Roma Type Quest
                </h1>
                <ThemeSwitcher />
            </header>
            <PixelPanel pixcel-rounded>
                <p style={{ margin: '0 0 12px' }}>
                    レトロテーマのベース適用済み。
                    <br />
                    下のボタンでプレイ画面へ進めます。
                </p>
                <PixelButton className="pixcel-font-press" onClick={() => void navigate('/play')}>
                    PLAY
                </PixelButton>
            </PixelPanel>
            <div className="pixel-panel" style={{ marginBottom: 12 }}>
                <section aria-labelledby="home-title">
                    <h1 id="home-title">Roma Type Quest</h1>
                    <img
                        className="pixelated"
                        style={{ width: 10 * basePixel, height: 'auto' }}
                        src="/src/assets/graphics/RomaTypeQuestTitle.png"
                        alt="Roma Type Quest"
                    />
                    <p>
                        ようこそ！これはローマ字タイピングの冒険ゲームです。
                        <br />
                        60秒のタイピングバトルに挑戦して、ハイスコアを目指しましょう！
                    </p>

                    <div style={{ marginTop: '16px' }}>
                        <button className="btn" onClick={() => void navigate('/play')}>
                            ▶ ゲームスタート
                        </button>
                    </div>
                </section>
                <p>ファミコン風UIのベースが入りました。</p>
            </div>
            <button className="pixel-button">Play</button>
        </div>
    );
}
