// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const AdminConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/admin/app',
  //   icon: icon('ic_analytics'),
  // },
  {
    title: '管理者列表',
    path: '/admin/adminlist',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'product',
  //   path: '/admin/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/admin/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: '公司員工列表',
    path: '/admin/staffmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '正職人員薪資',
    path: '/admin/salarymanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '日薪制人員薪資',
    path: '/admin/daysalarymanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '部分工時人員薪資',
    path: '/admin/parttimemanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '休假申請列表',
    path: '/admin/vacationsmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '加班申請列表',
    path: '/admin/overtimesmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '補打卡申請列表',
    path: '/admin/amendrecordmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '部分工時人員排班系統',
    path: '/admin/parttimeworkmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '會議安排系統',
    path: '/admin/meetmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '部門新增設定',
    path: '/admin/departmentmanage',
    icon: icon('ic_disabled'),
  },
  {
    title: '公司規定設置',
    path: '/admin/companyrulemanage',
    icon: icon('ic_disabled'),
  },
];

export default AdminConfig;
