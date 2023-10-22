import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// @mui
import { useState,useContext,useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { isMobile,isTablet } from 'react-device-detect';
import { LoadingButton } from '@mui/lab';
// components
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
// components
import Iconify from '../../../components/iconify';
import appsetting from '../../../Appsetting';

// ----------------------------------------------------------------------


export default function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [open, setOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [deviceStatus, setDeviceStatus] = useState('');

  const [loginRequest, setLoginRequest] = useState({
    Account:'',
    Password:''
  })
  const [resetRequest,setResetRequest] = useState({
    Email:'',
    Account:''
  })
  const isSuperAdmin = sessionStorage.getItem('SuperToken')!== null;

  const handleResetClickOpen = () => {
    setResetOpen(true);
  };

  const handleResetClose = () => {
    setResetOpen(false);
  };

  const handleDeviceClickOpen = () => {
    setDeviceOpen(true);
  };

  const handleDeviceClose = () => {
    setDeviceOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (isLogin) {
      if(isStaff) {
        navigate('/staff', { replace: true }); 
      }else {
        if(isSuperAdmin) {
          navigate('/super', { replace: true });
        }
        if(!isSuperAdmin) {
          navigate('/admin', { replace: true });
        }      
      }
    }
  };


  const handleInputChange = (event, propertyName) => {
    const value = event.target.value;

    setLoginRequest((prevData) => ({
      ...prevData,
      [propertyName]: value,
    }));
  };

  const handleResetInputChange = (event, propertyName) => {
    const value = event.target.value;

    setResetRequest((prevData) => ({
      ...prevData,
      [propertyName]: value,
    }));
  };

  const handleSubmit = async () => {
    const config = {
      headers: {
        'X-Ap-Token': appsetting.token
      }
    };

    // 發送 POST 請求
    try {
      const response = await axios.post(`${appsetting.apiUrl}/login/verify`, loginRequest, config);

      if(response.status === 200) {
          setIsLogin(true);
          if(response.data.AdminToken === null) {      
            VerifyDeviceSubmit();    
            sessionStorage.setItem('UserId',response.data.UserId);
            sessionStorage.setItem('CompanyId',response.data.CompanyId.toString());
            sessionStorage.setItem('DepartmentId',response.data.DepartmentId.toString());
            sessionStorage.setItem('StaffName',response.data.StaffName);
            sessionStorage.setItem('StaffNo',response.data.StaffNo);
            sessionStorage.setItem('AvatarUrl',`${appsetting.apiUrl}${response.data.AvatarUrl}`);
            sessionStorage.setItem('Auth',response.data.Auth.toString());
            setIsStaff(true);
          }
          else {
            sessionStorage.setItem('UserId',response.data.UserId);
            sessionStorage.setItem('CompanyId',response.data.CompanyId.toString());
            sessionStorage.setItem('DepartmentId',response.data.DepartmentId.toString());
            sessionStorage.setItem('StaffName',response.data.StaffName);
            sessionStorage.setItem('StaffNo',response.data.StaffNo);
            sessionStorage.setItem('Auth',response.data.Auth.toString());
            sessionStorage.setItem('AdminToken',response.data.AdminToken);
            sessionStorage.setItem('AvatarUrl',`${appsetting.apiUrl}${response.data.AvatarUrl}`);
            if(response.data.SuperToken !== null) {
              sessionStorage.setItem('SuperToken',response.data.SuperToken);
            }
            setIsStaff(false);
            setOpen(true);
          }
      }
      
    } catch (error) {
      setOpen(true);
      console.error("Error logging in:", error);
    }
  };

  const VerifyDeviceSubmit = async () => {
    const config = {
      headers: {
        'X-Ap-Token': appsetting.token
      }
    };
    const deviceRequest = {
      ...loginRequest,
      DeviceId:visitorId
    }
    // 發送 POST 請求
    try {
      const response = await axios.post(`${appsetting.apiUrl}/login/deviceid`, deviceRequest, config);

      if(response.status === 200) {
        const resultCode = response.data;
        switch (resultCode) {
          case 0:
            setDeviceStatus('尚未綁定');
            setOpen(false);
            handleDeviceClickOpen();
            break;
          case 1:
            setDeviceStatus('符合該設備');
            setOpen(true);
            break;
          case -1:
            setDeviceStatus('不支援多重設備登入');
            setIsLogin(false);
            setOpen(true);
            break;
          default:
            console.error('未知的返回代码', resultCode);
            break;
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const RegisterDeviceIdSubmit = async () => {
    const config = {
      headers: {
        'X-Ap-Token': appsetting.token
      }
    };
    const deviceRequest = {
      ...loginRequest,
      DeviceId:visitorId
    }
    // 發送 POST 請求
    try {
      const response = await axios.put(`${appsetting.apiUrl}/login/deviceid`, deviceRequest, config);

      if(response.status === 200) {
          alert('綁定成功')
          handleDeviceClose();
      }
    } catch (error) {
      alert('綁定失敗')
      handleDeviceClose();
      console.error("Error logging in:", error);
    }
  };

  const handleResetSubmit = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        'X-Ap-Token': appsetting.token
      }
    };

    // 發送 POST 請求
    try {
      const response = await axios.post(`${appsetting.apiUrl}/login/send`, resetRequest, config);

      if(response.status === 200) {
        alert('請至信箱收取新密碼')
        setResetOpen(false)
      }
    } catch (error) {
      setResetOpen(false)
      console.error("Error logging in:", error);
    }finally {
      setIsLoading(false);  // 關閉過場動畫
    }
  };

  useEffect(() => {
    try {
      // 获取用户代理信息中的平台部分
      const platform = navigator.platform; // 例如 'iPhone', 'Android' 等

      // 获取屏幕分辨率
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;

      // 组合成一个基本的“指纹”字符串
      const fingerprint = `${platform}-${screenWidth}x${screenHeight}`;

      // 设置 visitorId 状态
      setVisitorId(fingerprint);

      // TODO: 可以选择将此 fingerprint 发送到服务器
      // 或进行其他操作
    } catch (error) {
      console.error("Failed to generate fingerprint", error);
    }
  }, []);

  let message;
  switch (deviceStatus) {
    case '':
      message = "登入失敗，請再試一次";  
      break;
    case '尚未綁定':
      message = "帳號尚未綁定";
      break;
    case '符合該設備':
      message = "登入成功 即將跳轉";
      break;
    case '不支援多重設備登入':
      message = "請勿幫人代打卡";
      break;
    default:
      message = "登入失敗，請再試一次";  
  }

  return (
    <>
      <Backdrop open={isLoading} style={{ zIndex: 1301, color: '#fff' }}>  {/* 增加 zIndex 使遮罩在其他元素之上 */}
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box       sx={{
        marginBottom: isMobile ? '50px' : '0px',
      }}>
        <Stack spacing={3}>
          <TextField name="staff" label="Account" 
          onChange={(e) => handleInputChange(e, 'Account')}/>

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => handleInputChange(e, 'Password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Button variant="text" size="small" style={{marginTop:'5%',width:'20%'}} onClick={handleResetClickOpen}>
            忘記密碼
        </Button>
        <LoadingButton style={{marginTop:'20px'}} fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
          Login
        </LoadingButton>
      </Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{isLogin ? `${sessionStorage.getItem('StaffName')}，您好！` : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          {isLogin ? "登入成功 按下OK轉導頁面" : message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={resetOpen} onClose={handleResetClose}>
        <DialogTitle>忘記密碼</DialogTitle>
        <DialogContent>
          <DialogContentText>
            請輸入當時註冊信箱與您的帳號<br/>
            輸入成功後會寄信置您信箱<br/>
            用暫時密碼登入後請記得更改密碼
          </DialogContentText>
          <TextField 
          style={{marginTop:'5%'}}
          name="staff" label="Account" 
          fullWidth
          variant='standard'
          onChange={(e) => handleResetInputChange(e, 'Account')}/>


          <TextField          
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => handleResetInputChange(e, 'Email')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetClose}>取消</Button>
          <Button onClick={handleResetSubmit}>送出</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deviceOpen} onClose={handleDeviceClose}>
        <DialogTitle>初次登入 請綁定設備</DialogTitle>
        <DialogContent>
          <DialogContentText>
            綁定設備後不得更換設備登入<br/>
            若需要更換設備登入<br/>
            請洽公司人資消除設備綁定<br/>
            綁定成功後請重新登入
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeviceClose}>取消</Button>
          <Button onClick={RegisterDeviceIdSubmit}>送出</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
