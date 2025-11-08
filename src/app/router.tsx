// src/app/router.tsx
import { createBrowserRouter, createHashRouter, type RouteObject } from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import Home from './routes/Home';
import Play from './routes/Play';
import Result from './routes/Result';

const routes: RouteObject[] = [
    {
        element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/play', element: <Play /> },
            { path: '/result', element: <Result /> },
        ],
    },
];

const mode = (import.meta.env.VITE_ROUTER_MODE ?? 'browser') as 'hash' | 'browser';

export const router = mode === 'hash' ? createHashRouter(routes) : createBrowserRouter(routes);
