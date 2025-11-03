// src/app/components/Header.tsx
import { NavLink } from 'react-router-dom';

export function Header() {
    return (
        <header className="header" role="banner" aria-label="App Header">
            <a href="#main" className="skip-link">
                メインコンテンツへスキップ
            </a>
            <div className="container">
                <nav className="nav" aria-label="Primary">
                    <NavLink to="/" end>
                        Home
                    </NavLink>
                    <NavLink to="/play">Play</NavLink>
                    <NavLink to="/result">Result</NavLink>
                </nav>
            </div>
        </header>
    );
}
