import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/admin/AdminHome';
import ProductManagement from './pages/admin/ProductManagement';
import CaseManagement from './pages/admin/CaseManagement';
import CaseForm from './pages/admin/CaseForm';
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
    name: '管理员登录',
    path: '/admin/login',
    element: <AdminLogin />,
    visible: false
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
  },
  {
    name: '添加案例',
    path: '/admin/case/add',
    element: <CaseForm />,
    visible: false
  },
  {
    name: '编辑案例',
    path: '/admin/case/edit/:id',
    element: <CaseForm />,
    visible: false
  }
];

export default routes;