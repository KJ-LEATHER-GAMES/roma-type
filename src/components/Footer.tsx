// src/app/components/Footer.tsx
export function Footer() {
    return (
        <footer className="footer" role="contentinfo" aria-label="App Footer">
            <div className="container">
                <small>© {new Date().getFullYear()} RomaTypeQuest</small>
            </div>
        </footer>
    );
}
