import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// @mui
import { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
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
  const [loginRequest, setLoginRequest] = useState({
    Account:'',
    Password:''
  })
  const [resetRequest,setResetRequest] = useState({
    Email:'',
    Account:''
  })


  const handleResetClickOpen = () => {
    setResetOpen(true);
  };

  const handleResetClose = () => {
    setResetOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (isLogin) {
      if(isStaff) {
        navigate('/staff', { replace: true }); 
      }else {
        navigate('/admin', { replace: true });
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
    // 創建一個物件來存儲帳號和密碼
    // 設定 header 的 token
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
            setIsStaff(false);
          }
      }
      setOpen(true);
    } catch (error) {
      setOpen(true);
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

  return (
    <>
      <Backdrop open={isLoading} style={{ zIndex: 1301, color: '#fff' }}>  {/* 增加 zIndex 使遮罩在其他元素之上 */}
        <CircularProgress color="inherit" />
      </Backdrop>
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
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{isLogin ? `${sessionStorage.getItem('StaffName')}，您好！` : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          {isLogin ? "登入成功 按下OK轉導頁面" : "登入失敗，請再試一次"}
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
    </>
  );
}
