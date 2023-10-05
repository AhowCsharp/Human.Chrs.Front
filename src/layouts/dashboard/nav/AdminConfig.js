// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const AdminConfig = [
  {
    title: 'dashboard',
    path: '/admin/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'adminList',
    path: '/admin/adminlist',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/admin/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/admin/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'staffs',
    path: '/admin/staffmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: 'vacations',
    path: '/admin/vacationsmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: 'overtimes',
    path: '/admin/overtimesmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: 'salarySetting',
    path: '/admin/salarymanage',
    icon: icon('ic_disabled'),
  },
  {
    title: 'departments',
    path: '/admin/departmentmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: 'companyRule',
    path: '/admin/companyrulemanage',
    icon: icon('ic_disabled'),
  },
];

export default AdminConfig;
