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



export default function SalaryCalculate() {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const { id } = useParams();
    const [calculateResult,setCalculateResult] = useState(null);
    const [salaryRequest,setSalaryRequest] = useState({
      BasicSalary:0,
      FullCheckInMoney:0,
      OverTimeHours:0,
      Bonus:0,
      SickHours:0,
      ThingHours:0,
      MenstruationHours:0,
      ChildbirthHours:0,
      TackeCareBabyHours:0,
      IncomeTax:0,
      HealthInsurance:0,
      WorkerInsurance:0,
      EmployeeRetirement:0,
      SupplementaryPremium:0, //
      HealthInsuranceFromCompany:0,
      WorkerInsuranceFromCompany:0,
      EmployeeRetirementFromCompany:0,
      AdvanceFundFromCompany:0,
    });
    const [paymoeny,setPaymoney] = useState(0);
    const fetchStaffDetailData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/admin/paymoeny?id=${id}`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setCalculateResult(response.data.Data);
            console.log(response.data)
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
        navigate(`/admin/manage`);
    };

    // const handleInputChange = (event, propertyName) => {
    //   const value = event.target ? event.target.value : event;
    //   if(propertyName === 'HasCrimeRecord') {
    //       // eslint-disable-next-line no-restricted-globals
    //       if(!isNaN(value)) {
    //         setStaffInfo((prevData) => ({
    //           ...prevData,
    //           [propertyName]: Number(value),
    //         })); 
    //       }else {
    //         alert('請輸入數字')
    //       }
 
    //   }else {
    //     setStaffInfo((prevData) => ({
    //       ...prevData,
    //       [propertyName]: value,
    //   }));
    //   }
    // };
  //   const handleSubmit = async () => {   
  //     console.log(staffInfo)
  //     if (staffInfo.HasCrimeRecord !== 0 && staffInfo.HasCrimeRecord !== 1) {
  //       alert("無效的值！只允許0或1。");
  //       return ;
  //     }
       
  //     try {
  //       const response = await axios.post(`${appsetting.apiUrl}/admin/details`, staffInfo ,config);
  //       if (response.status === 200) {
  //       alert('成功');
  //       fetchStaffDetailData();
  //       }
  //   } catch (error) {
  //       console.error("Error logging in:", error);
  //       alert('失敗 欄位有誤');
  //   } 
  // }
  const currentDate = new Date();      // 获取当前日期
  currentDate.setMonth(currentDate.getMonth() - 1);   // 将日期设置为上个月
  const lastMonth = currentDate.getMonth() + 1;       // JavaScript中的月份是从0开始的，所以我们需要+1来获取实际的月份


  return (
    <>
    <Box
      sx={{
        margin:'auto',
        width: '95%',
        height: 1000,
      }}
    >     {calculateResult !== null ? <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>      
                  <Typography variant="h2" component="h2">
                  {lastMonth}月份薪資單
                  </Typography>
              </Grid>
              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>      
                <TextField
                  id="outlined-helperText"
                  label="總薪資"
                  value={paymoeny}
                  helperText="請業主根據下方資訊自行計算薪資"
                  onChange={(e) => setPaymoney(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="姓名"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.SalarySetting.StaffName}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="員編"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.SalarySetting.StaffNo}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="基本薪資"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.SalarySetting.BasicSalary}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="全勤獎金"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.SalarySetting.FullCheckInMoney}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="獎金%數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={`${calculateResult.SalarySetting.OtherPercent}%`}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="遲到天數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalCheckInLateDays}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="遲到總分鐘"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalCheckInLateMinutes}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="早退天數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalCheckOutEarlyDays}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="早退總分鐘"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalCheckOutEarlyMinutes}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="上班定位外天數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.OutLocationCheckInDays}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="下班定位外天數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.OutLocationCheckOutDays}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="特休時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalSpecialRestHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="病假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalSickHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="事假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalThingHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="產假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalChildbirthHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="喪假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalDeathHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="公假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalWorkthingHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="工傷病假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalWorkhurtHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="婚假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalMarryHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="生理假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalMenstruationHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="安胎假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalTocolysisHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="育嬰假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalTackeCareBabyHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="產檢假時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.TotalPrenatalCheckUpHours}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="加班時數"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.OverTimeHours}
                />
              </Grid>

              <Grid item xs={12} style={{marginTop:'1%'}}>             
                  <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="基本薪資"
                  value={salaryRequest.BasicSalary}
                />
                                +
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="全勤獎金"
                  value={salaryRequest.FullCheckInMoney}
                />
                                +
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="業績獎金"
                  value={salaryRequest.Bonus}
                />
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="病假扣款"
                  value={salaryRequest.SickHours}
                />
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="事假扣款"
                  value={salaryRequest.ThingHours}
                />
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="生理假扣款"
                  value={salaryRequest.MenstruationHours}
                />
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="產假扣款"
                  value={salaryRequest.ChildbirthHours}
                /> 
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="育嬰假扣款"
                  value={salaryRequest.TackeCareBabyHours}
                />
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="薪資所得稅代扣"
                  value={salaryRequest.IncomeTax}
                />   
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="健保費"
                  value={salaryRequest.HealthInsurance}
                />
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="勞保費"
                  value={salaryRequest.WorkerInsurance}
                />   
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="員工勞退"
                  value={salaryRequest.EmployeeRetirement}
                />   
                                -
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'1%'}}
                  label="補充保費"
                  value={salaryRequest.SupplementaryPremium}
                />         
              </Grid>



              <Grid item xs={12} style={{fontSize:'14px'}}>
                  薪資加項 = 基本薪資 {calculateResult.SalarySetting.BasicSalary}+全勤獎金 {calculateResult.SalarySetting.FullCheckInMoney}
                  +業績獎金*{`${calculateResult.SalarySetting.OtherPercent}%`}
              </Grid>
              <Grid item xs={12} style={{fontSize:'14px'}}>               
                  薪資減項 :<br/>
                  該員工每小時時薪 = {calculateResult.PerHourSalary} <br/>
                  病假扣款總額 = 病假總時數 {calculateResult.TotalSickHours} * 每小時時薪/2 = {calculateResult.TotalSickHours * calculateResult.PerHourSalary/2}<br/>
                  事假扣款總額 = 事假總時數 {calculateResult.TotalThingHours} * 每小時時薪 = {calculateResult.TotalThingHours * calculateResult.PerHourSalary}<br/>
                  生理假扣款總額 = 生理假總時數 {calculateResult.TotalMenstruationHours} * 每小時時薪/2 = {calculateResult.TotalMenstruationHours * calculateResult.PerHourSalary/2}<br/>
                  安胎假扣款總額 = 安胎假總時數 {calculateResult.TotalTocolysisHours} * 每小時時薪/2 = {calculateResult.TotalTocolysisHours * calculateResult.PerHourSalary/2}<br/>
                  育嬰假扣款總額 = 育嬰假總時數 {calculateResult.TotalTackeCareBabyHours} * 每小時時薪 = {calculateResult.TotalTackeCareBabyHours * calculateResult.PerHourSalary}<br/>
                  特殊情況:<br/>
                  產假 <br/>
                  1. 分娩 = 若年資滿半年以上 則不扣薪 若未滿半年 則產假總時數 {calculateResult.TotalChildbirthHours} * 每小時時薪/2<br/>
                  2. 妊娠3個月以上流產 = 若年資滿半年以上 則不扣薪 若未滿半年 則產假總時數 {calculateResult.TotalChildbirthHours} * 每小時時薪/2<br/>
                  3. 妊娠2個月以上，未滿3個月流產 = 產假總時數 {calculateResult.TotalChildbirthHours} * 每小時時薪<br/>
                  4. 妊娠未滿2個月流產 = 產假總時數 {calculateResult.TotalChildbirthHours} * 每小時時薪<br/>               
              </Grid>


              {/* <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>     
                <Button variant="contained" startIcon={<ReplyIcon />} onClick={handleBackClick} style={{ marginRight: '10px' }}>
                  返回
                </Button> 
                <Button variant="contained" startIcon={<SendIcon />} onClick={handleSubmit}>
                  送出
                </Button>
              </Grid> */}
            </Grid>
          </Box>
          :null}
          
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
    