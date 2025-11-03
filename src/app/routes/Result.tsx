import { useNavigate } from 'react-router-dom';

export default function Result() {
    const navigate = useNavigate();
    const score = 123; // ダミースコア

    return (
        <section aria-labelledby="result-title">
            <h1 id="result-title">Result</h1>
            <p>
                あなたのスコア：<strong>{score}</strong>
            </p>
            <p>正確度：98%、コンボ：42</p>

            <div style={{ marginTop: '24px' }}>
                <button className="btn" onClick={() => void navigate('/play')}>
                    🔁 もう一度プレイ
                </button>
                <button className="btn" onClick={() => void navigate('/')}>
                    🏠 ホームへ
                </button>
            </div>
        </section>
    );
}
