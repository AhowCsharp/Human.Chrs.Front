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
    icon: icon('admin'),
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
    icon: icon('staff'),
  },
  {
    title: '正職人員薪資',
    path: '/admin/salarymanage',
    icon: icon('salaryTypeOne'),
  },
  {
    title: '日薪制人員薪資',
    path: '/admin/daysalarymanage',
    icon: icon('salaryTypeTwo'),
  },
  {
    title: '部分工時人員薪資',
    path: '/admin/parttimemanage',
    icon: icon('salaryTypeThree'),
  },
  {
    title: '休假申請列表',
    path: '/admin/vacationsmanage',
    icon: icon('vacation'),
  },
  {
    title: '加班申請列表',
    path: '/admin/overtimesmanage',
    icon: icon('workhard'),
  },
  {
    title: '補打卡申請列表',
    path: '/admin/amendrecordmanage',
    icon: icon('check'),
  },
  {
    title: '部分工時人員排班系統',
    path: '/admin/parttimeworkmanage',
    icon: icon('scheduling'),
  },
  {
    title: '輪班制人員排班系統',
    path: '/admin/shiftworkmanage',
    icon: icon('scheduling2'),
  },
  {
    title: '會議安排系統',
    path: '/admin/meetmanage',
    icon: icon('meet'),
  },
  {
    title: '部門新增設定',
    path: '/admin/departmentmanage',
    icon: icon('department'),
  },
  {
    title: '公司規定設置',
    path: '/admin/companyrulemanage',
    icon: icon('law'),
  },
];

export default AdminConfig;
