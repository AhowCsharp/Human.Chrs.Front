// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const SuperAdminConfig = [
  {
    title: 'dashboard',
    path: '/super/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'companyList',
    path: '/super/companylist',
    icon: icon('ic_user'),
  },
  {
    title: 'contractList',
    path: '/super/contracts',
    icon: icon('ic_user'),
  }
];

export default SuperAdminConfig;
