import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams  } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import ReplyIcon from '@mui/icons-material/Reply';
import InputLabel from '@mui/material/InputLabel';
import SendIcon from '@mui/icons-material/Send';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Alert from '@mui/material/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import StaffSearch from './StaffSearch';



export default function StaffDetail() {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const [ staffStatus, setStaffStatus] = useState(true);
    const { id } = useParams();
    const [ staffInfo, setStaffInfo] = useState({
      id:0,
      Name:'',
      StaffId: id,
      EnglishName:'',
      BirthDay:'',
      Gender:'',
      IsMarried:0,
      HasLicense:0,
      Height:0,
      Weight:0,
      IdentityNo:'',
      HasCrimeRecord:0,
      Memo:''
    });


    const fetchStaffDetailData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/staff/detail?id=${id}`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setStaffInfo(response.data);
            console.log(response.data)
          }
          if(response.status === 204) {
            setStaffStatus(false)
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchStaffDetailData();
    }, []); 
    const navigate = useNavigate();

    const handleBackClick = () => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/admin/staffmanage`);
    };

    const handleInputChange = (event, propertyName) => {
      const value = event.target ? event.target.value : event;
      if(propertyName === 'HasCrimeRecord') {
          // eslint-disable-next-line no-restricted-globals
          if(!isNaN(value)) {
            setStaffInfo((prevData) => ({
              ...prevData,
              [propertyName]: Number(value),
            })); 
          }else {
            alert('請輸入數字')
          }
 
      }else {
        setStaffInfo((prevData) => ({
          ...prevData,
          [propertyName]: value,
      }));
      }
    };
    const handleSubmit = async () => {   
      console.log(staffInfo)
      if (staffInfo.HasCrimeRecord !== 0 && staffInfo.HasCrimeRecord !== 1) {
        alert("無效的值！只允許0或1。");
        return ;
      }
       
      try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/details`, staffInfo ,config);
        if (response.status === 200) {
        alert('成功');
        fetchStaffDetailData();
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert('失敗 欄位有誤');
    } 
    }
  

  return (
    <>
    <Box
      sx={{
        margin:'auto',
        width: '70%',
        height: 700,
      }}
    >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>      
                  <Typography variant="h2" component="h2">
                      個人資料
                  </Typography>
              </Grid>
              {!staffStatus ?              
                <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>      
                    <Alert severity="error">此員工尚未填寫個人資訊</Alert>
                </Grid>:null 
              }

              <Grid item xs={4}>

                <TextField
                  id="outlined-helperText"
                  label="編號 - Id"
                  value={staffInfo.id}
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="此欄位自動輸入 無須填寫"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="姓名 - Name"
                  value={staffInfo.Name}
                  onChange={(e) => handleInputChange(e, 'Name')}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="英文姓名 - EnglishName"
                  value={staffInfo.EnglishName}
                  onChange={(e) => handleInputChange(e, 'EnglishName')}
                />
              </Grid>
              <Grid item xs={4}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                      婚姻狀態
                  </InputLabel>  
                  <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={staffInfo.IsMarried || 0}
                      label="IsMarried"
                      size="small"
                      onChange={(e) => handleInputChange(e, 'IsMarried')}
                      style={{width:'100%'}}
                      >
                        <MenuItem key={1} value={0}>
                            未婚
                        </MenuItem>
                        <MenuItem key={2} value={1}>
                            已婚
                        </MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={4}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                            性別
                  </InputLabel>  
                  <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={staffInfo.Gender !== ''? staffInfo.Gender : '男性'}
                      label="gender"
                      size="small"
                      onChange={(e) => handleInputChange(e, 'Gender')}
                      style={{width:'100%'}}
                      >
                        <MenuItem key={1} value='男性'>
                            男性
                        </MenuItem>
                        <MenuItem key={2} value='女性'>
                            女性
                        </MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={4}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                            有無駕照
                  </InputLabel>  
                  <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={staffInfo.HasLicense || 0}
                      label="HasLicense"
                      onChange={(e) => handleInputChange(e, 'HasLicense')}
                      size="small"
                      style={{width:'100%'}}
                      >
                        <MenuItem key={1} value={1}>
                            有駕照
                        </MenuItem>
                        <MenuItem key={2} value={0}>
                            無駕照
                        </MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="生日 - Birthday"
                  value={staffInfo.BirthDay !== ''? staffInfo.BirthDay.split('T')[0]:getCurrentDate()}
                  onChange={(e) => handleInputChange(e, 'Birthday')}
                  helperText="請輸入YYYY-MM-DD格式"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="身高 - Height"
                  value={staffInfo.Height}
                  onChange={(e) => handleInputChange(e, 'Height')}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="體重 -Weight"
                  value={staffInfo.Weight}
                  onChange={(e) => handleInputChange(e, 'Weight')}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="身分證 - IdentityNo"
                  value={staffInfo.IdentityNo}
                  onChange={(e) => handleInputChange(e, 'IdentityNo')}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="良民證狀態 - Has Crime Record"
                  value={staffInfo.HasCrimeRecord}
                  onChange={(e) => handleInputChange(e, 'HasCrimeRecord')}
                  helperText="有良民證請填 1 無良民證請填 0"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="備註 - Memo"
                  value={staffInfo.Memo}
                  onChange={(e) => handleInputChange(e, 'Memo')}                 
                />
              </Grid>
              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>     
                <Button variant="contained" startIcon={<ReplyIcon />} onClick={handleBackClick} style={{ marginRight: '10px' }}>
                   返回
                </Button> 
                <Button variant="contained" startIcon={<SendIcon />} onClick={handleSubmit}>
                   送出
                </Button>
              </Grid>
            </Grid>
          </Box>
      </Box>

    </>
  );
}

function formatDateToYYYYMMDD(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function daysBetweenDates(date1Str, date2Str) {
    // 将日期字符串转换为日期对象
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
  
    // 计算两个日期对象的时间戳，并找出它们之间的差异（以毫秒为单位）
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  
    // 将时间差异转换为天数
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    return diffDays;
}
    