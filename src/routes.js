import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';

import PersonalInfo from './staff/PersonalInfo';
import PersonalDetail from './staff/PersonalDetail';
import PersonalSalaryList from './staff/PersonalSalaryList';
import PersonalSalaryDetail from './staff/PersonalSalaryDetail';
import PersonalCheckList from './staff/PersonalCheckList';
import PersonalOverTimeList from './staff/PersonalOverTimeList';

import StaffManage from './admin/StaffManage';
import StaffDetail from './admin/StaffDetail';
import VacationsManage from './admin/VacationsManage';
import OvertTimeManage from './admin/OvertTimeManage';
import SalaryManage from './admin/SalaryManage';
import SalaryCalculate from './admin/SalaryCalculate';
import AdminDetail from './admin/AdminDetail';
import CompanyRuleManage from './admin/CompanyRuleManage';
import DepartmentManage from './admin/DepartmentManage';
import ParttimeManage from './admin/ParttimeManage';
import AmendRecordsManage from './admin/AmendRecordsManage';
import ParttimeWorkManage from './admin/ParttimeWorkManage';
import MeetManage from './admin/MeetManage';

import CompanyManage from './super/CompanyManage';
import ContractManage from './super/ContractManage';
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
        { path: 'overtimelist', element: <PersonalOverTimeList /> },
        { path: 'salarylist', element: <PersonalSalaryList /> },
        { path: 'checklist', element: <PersonalCheckList /> },
        { path: 'salarydetail/:id', element: <PersonalSalaryDetail /> },
      ],
    },
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/admin/staffmanage" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'adminlist', element: <AdminPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'staffmanage', element: <StaffManage /> },
        { path: 'salarymanage', element: <SalaryManage /> },
        { path: 'vacationsmanage', element: <VacationsManage /> },
        { path: 'overtimesmanage', element: <OvertTimeManage /> },
        { path: 'departmentmanage', element: <DepartmentManage /> },
        { path: 'companyrulemanage', element: <CompanyRuleManage /> },
        { path: 'parttimemanage', element: <ParttimeManage /> },
        { path: 'parttimeworkmanage', element: <ParttimeWorkManage /> },
        { path: 'meetmanage', element: <MeetManage /> },
        { path: 'amendrecordmanage', element: <AmendRecordsManage /> },
        { path: 'detail', element: <AdminDetail /> },
        { path: 'details/:id', element: <StaffDetail /> },
        { path: 'calculatesalary/:id', element: <SalaryCalculate /> },
      ],
    },
    {
      path: '/super',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/super/companylist" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'companylist', element: <CompanyManage /> },
        { path: 'contracts', element: <ContractManage /> },
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
