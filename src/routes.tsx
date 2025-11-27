import Home from './pages/Home';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '智能空调方案推荐',
    path: '/',
    element: <Home />
  }
];

export default routes;