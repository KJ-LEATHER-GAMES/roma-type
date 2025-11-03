// src/app/layout/AppLayout.tsx
// 1. インポート
import { Outlet } from 'react-router-dom';

// 2. コンポーネントインポート
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export default function AppLayout() {
    return (
        <div className="app-shell">
            <Header />
            <main id="main" className="main" role="main" aria-live="polite">
                {/* Routerのchild要素がここに差し込まれる */}
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
