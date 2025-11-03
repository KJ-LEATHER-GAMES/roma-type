import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <section aria-labelledby="home-title">
            <h1 id="home-title">Roma Type Quest</h1>
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
    );
}
