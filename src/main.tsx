// src/main.tsx
// 1. インポート
import React from 'react';
// 2. ReactDOMインポート
import ReactDOM from 'react-dom/client';
// 3. RouterProviderインポート
import { RouterProvider } from 'react-router-dom';

// 4. ルーターインポート
import { router } from './app/router.tsx';
// 5. CSSインポート
import './styles/globals.css'; // ← 忘れずに

// 6. ReactDOM.createRootを使用してルートをレンダリング
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
