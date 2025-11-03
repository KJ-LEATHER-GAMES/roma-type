import { createBrowserRouter } from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import Home from './routes/Home';
import Play from './routes/Play';
import Result from './routes/Result';

export const router = createBrowserRouter([
    {
        element: <AppLayout />, // ← レイアウト配下に子ルート
        children: [
            { path: '/', element: <Home /> },
            { path: '/play', element: <Play /> },
            { path: '/result', element: <Result /> },
        ],
    },
]);
