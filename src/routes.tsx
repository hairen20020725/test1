import Home from './pages/Home';
import AdminHome from './pages/admin/AdminHome';
import ProductManagement from './pages/admin/ProductManagement';
import CaseManagement from './pages/admin/CaseManagement';
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
  },
  {
    name: '管理后台',
    path: '/admin',
    element: <AdminHome />,
    visible: false
  },
  {
    name: '产品管理',
    path: '/admin/products',
    element: <ProductManagement />,
    visible: false
  },
  {
    name: '案例管理',
    path: '/admin/cases',
    element: <CaseManagement />,
    visible: false
  }
];

export default routes;