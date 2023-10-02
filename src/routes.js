import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';

import PersonalInfo from './staff/PersonalInfo';
import PersonalDetail from './staff/PersonalDetail';

import StaffManage from './admin/StaffManage';
import StaffDetail from './admin/StaffDetail';
import VacationsManage from './admin/VacationsManage';
import SalaryManage from './admin/SalaryManage';
import SalaryCalculate from './admin/SalaryCalculate';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/staff',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/staff/info" />, index: true },
        // { path: 'app', element: <DashboardAppPage /> },
        // { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
        { path: 'info', element: <PersonalInfo /> },
        { path: 'detail', element: <PersonalDetail /> },
      ],
    },
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/admin/staffmanage" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'staffmanage', element: <StaffManage /> },
        { path: 'salarymanage', element: <SalaryManage /> },
        { path: 'vacationsmanage', element: <VacationsManage /> },
        { path: 'details/:id', element: <StaffDetail /> },
        { path: 'calculatesalary/:id', element: <SalaryCalculate /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
