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
// components
import Iconify from '../../../components/iconify';
import appsetting from '../../../Appsetting';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginRequest, setLoginRequest] = useState({
    Account:'',
    Password:''
  })




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
            setIsStaff(false);
          }
      }
      setOpen(true);
    } catch (error) {
      setOpen(true);
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
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
    </>
  );
}
