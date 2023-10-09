import { useState } from 'react';
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
// import Footer from './Footer';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  ...(sessionStorage.getItem('AdminToken') && {
    display: 'flex',            // 设置为flex容器
    flexDirection: 'column',    // 设置子元素垂直堆叠
  }),
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
const MainContent = styled('div')({
  flex: 1,                   // 使其填满所有可用空间
  overflowY: 'auto',         // 在需要时加入滚动条
});

const Footer = styled('div')(({ theme }) => ({
  backgroundColor: 'black', // 设置背景颜色为黑色
  color: 'white', // 设置文本颜色为白色
  padding: theme.spacing(2),
  textAlign: 'center',
  borderTop: '1px solid white', // 添加边框，可以根据需要调整宽度和样式
  fontWeight: 'bold',
  marginTop:'10px' // 设置文本为粗体
}));


// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      {sessionStorage.getItem('AdminToken') ? <Nav openNav={open} onCloseNav={() => setOpen(false)} /> : null}
      <Main>
        <MainContent>
          {sessionStorage.getItem('AdminToken') ? <Nav openNav={open} onCloseNav={() => setOpen(false)} /> : null}
          <Outlet />
        </MainContent>

        {sessionStorage.getItem('AdminToken') ? 
          null :       
          (isMobile ? 
            <Footer>
              © 2023 DoRay Technology Studio.<br/> All Rights Reserved.
            </Footer> 
            : 
            null)
        }
      </Main>
    </StyledRoot>
  );
}
