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
import Switch from '@mui/material/Switch';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import CalculateIcon from '@mui/icons-material/Calculate';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import StaffSearch from './StaffSearch';
import SalaryDetailList from './SalaryDetailList';

const currentDate = new Date();      // 获取当前日期
currentDate.setMonth(currentDate.getMonth() - 1);   // 将日期设置为上个月
const lastMonth = currentDate.getMonth() + 1;       // JavaScript中的月份是从0开始的，所以我们需要+1来获取实际的月份

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
      StaffId:parseInt(id, 10),
      BasicSalary:0,
      FullCheckInMoney:0,
      OverTimeHours:0,
      Bonus:0,
      SickHours:0,
      ThingHours:0,
      MenstruationHours:0,
      ChildbirthHours:0,
      TakeCareBabyHours:0,
      IncomeTax:0,
      HealthInsurance:0,
      WorkerInsurance:0,
      EmployeeRetirement:0,
      SupplementaryPremium:0, //
      HealthInsuranceFromCompany:0,
      WorkerInsuranceFromCompany:0,
      EmployeeRetirementFromCompany:0,
      AdvanceFundFromCompany:0,
      EarlyOrLateAmount:0, // C#補這欄位
      OutLocationAmount:0,
      OverTimeMoney:0 // C#補這欄位
    });
    const [plusTotal,setPlusTotal]= useState(0);
    const [minusTotal,setMinusTotal]= useState(0);
    const [companyCostTotal,setCompanyCostTotal]= useState(0);
    const [paymoeny,setPaymoney] = useState(0);
    const [finalTotal,setFinalResult] = useState(0);
    const [checked, setChecked] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const fetchStaffSalaryData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/admin/paymoeny?id=${id}`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setCalculateResult(response.data.Data);
            console.log(response.data.Data)
            setSalaryRequest((prevSalaryRequest) => ({
              ...prevSalaryRequest, // 保留原有的属性
              BasicSalary: response.data.Data.SalarySetting.BasicSalary,
              FullCheckInMoney:response.data.Data.SalarySetting.FullCheckInMoney,
            }));
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchStaffSalaryData();
    }, []); 

    const navigate = useNavigate();

    const handleBackClick = () => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/admin/salarymanage`);
    };
    const handleSwitch = () => {
      setChecked(!checked);
    };
  
    const handleInputChange = (event, propertyName) => {
      const value = event.target.value;
  
      // 使用 Number.isNaN 代替全局的 isNaN
      if (!Number.isNaN(Number(value)) || value === '') {
          setSalaryRequest((prevData) => ({
              ...prevData,
              [propertyName]: value === '' ? '' : Number(value),
          }));
      } else {
          alert('請輸入數字');
      }
  };


    const handleFinalResult = () => {
      if(salaryRequest.BasicSalary !== null && salaryRequest.Bonus !== null && salaryRequest.FullCheckInMoney !== null && !checked) {
        setPlusTotal(salaryRequest.BasicSalary+salaryRequest.Bonus+salaryRequest.FullCheckInMoney)
      }
      if(salaryRequest.BasicSalary !== null && salaryRequest.Bonus !== null && salaryRequest.FullCheckInMoney !== null && checked && salaryRequest.OverTimeHours !== null) {
        setPlusTotal(salaryRequest.BasicSalary+salaryRequest.Bonus+salaryRequest.FullCheckInMoney+salaryRequest.OverTimeHours)
      }
      if(salaryRequest.HealthInsuranceFromCompany !== null && salaryRequest.WorkerInsuranceFromCompany !== null&& salaryRequest.AdvanceFundFromCompany !== null && salaryRequest.EmployeeRetirementFromCompany !== null) {
        setCompanyCostTotal(salaryRequest.HealthInsuranceFromCompany+salaryRequest.WorkerInsuranceFromCompany+salaryRequest.AdvanceFundFromCompany+salaryRequest.EmployeeRetirementFromCompany)
      }

      if (
        salaryRequest.SickHours !== null &&
        salaryRequest.ThingHours !== null &&
        salaryRequest.MenstruationHours !== null &&
        salaryRequest.ChildbirthHours !== null &&
        salaryRequest.TakeCareBabyHours !== null &&
        salaryRequest.IncomeTax !== null &&
        salaryRequest.HealthInsurance !== null &&
        salaryRequest.WorkerInsurance !== null &&
        salaryRequest.EmployeeRetirement !== null &&
        salaryRequest.EarlyOrLateAmount !== null &&
        salaryRequest.OutLocationAmount !== null &&
        salaryRequest.SupplementaryPremium !== null
      ) {
        // 计算 setMinusTotal 的值
        setMinusTotal(
            salaryRequest.SickHours +
            salaryRequest.OutLocationAmount +
            salaryRequest.EarlyOrLateAmount +
            salaryRequest.ThingHours +
            salaryRequest.MenstruationHours +
            salaryRequest.ChildbirthHours +
            salaryRequest.TakeCareBabyHours +
            salaryRequest.IncomeTax +
            salaryRequest.HealthInsurance +
            salaryRequest.WorkerInsurance +
            salaryRequest.EmployeeRetirement +
            salaryRequest.SupplementaryPremium
        );
      }
    };

    const handlePostResult = () => {
      if(plusTotal !== 0 && minusTotal !== 0 && companyCostTotal !== 0) {
        setFinalResult(plusTotal-minusTotal);
      }else {
        alert('請將下方所有欄位填妥再計算');
      }  
    };

    const handleSalarySubmit = async () => {   
      if(plusTotal === 0 || minusTotal === 0 || companyCostTotal === 0) {
        alert('請將下方所有欄位填妥再送出');
        return;
      }   
      if(salaryRequest.WorkerInsuranceFromCompany === 0 || salaryRequest.HealthInsuranceFromCompany === 0 || salaryRequest.EmployeeRetirementFromCompany === 0) {
        alert('請確認雇主負擔部分是否正確  不要觸犯勞基法');
        return;
      }   
      const newSalaryRequest = { ...salaryRequest };
      newSalaryRequest.SalaryOfMonth = lastMonth;
      newSalaryRequest.StaffIncomeAmount = plusTotal;
      newSalaryRequest.StaffActualIncomeAmount = (plusTotal-minusTotal);
      newSalaryRequest.StaffDeductionAmount= minusTotal;
      newSalaryRequest.CompanyCostAmount = companyCostTotal;
      if (checked) {
          newSalaryRequest.OverTimeHours = calculateResult.OverTimeHours;
          newSalaryRequest.ChangeOverTimeToMoney = checked;       
      } else {
          newSalaryRequest.OverTimeHours = 0;
          newSalaryRequest.ChangeOverTimeToMoney = checked;
          newSalaryRequest.OverTimeMoney = 0;
      }
  
  
      try {
          const response = await axios.post(`${appsetting.apiUrl}/admin/paymoney`, newSalaryRequest, config);
          if (response.status === 200) {
              alert('成功');
              handleClose();
          }
      } catch (error) {
          console.error("Error logging in:", error);
          alert('失敗 已重複發放該月薪資');
      }
  }
  



  return (
    <>
    <Box
      sx={{
        margin:'auto',
        width: '100%',
      }}
    >     {calculateResult !== null ? 
          <Box sx={{ flexGrow: 1 }}>
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
                  value={finalTotal}
                  style={{width:'200px'}}
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="公式為 => 薪資加項 - 薪資減項"
                />
              </Grid>
              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>     
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleClickOpen} style={{ marginRight: '10px' }}>
                  送出該薪資單
                </Button> 
                <Button variant="contained" endIcon={<CalculateIcon />} onClick={handlePostResult}>
                  計算最終總額
                </Button>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>確定送出該薪資單嗎?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      請詳細確認各種細項，金額是否正確，請勿違反勞基法
                    </DialogContentText>

                    <SalaryDetailList detail={salaryRequest} plusTotal={plusTotal} minusTotal={minusTotal} companyCostTotal={companyCostTotal}/>

                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSalarySubmit}>送出</Button>
                  </DialogActions>
                </Dialog>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  label="姓名"
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={calculateResult.OverTimeHours}
                />
              </Grid>
              <Grid item xs={12} style={{margin:'1%'}}/>
              <Grid item xs={2}> 
                  是否將加班時數轉成加班費     
                  <Switch
                    checked={checked}
                    onChange={handleSwitch}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
              </Grid>
              <Grid item xs={10} />
              <Grid item xs={1}>
                  薪資加項
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="基本薪資"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={salaryRequest.BasicSalary}
                  onChange={(e) => handleInputChange(e, 'BasicSalary')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                    id="outlined-helperText"
                    style={{marginTop:'3%'}}
                    label="全勤獎金"
                    type="number" 
                    value={salaryRequest.FullCheckInMoney}
                    onChange={(e) => handleInputChange(e, 'FullCheckInMoney')}
                  />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                    id="outlined-helperText"
                    style={{marginTop:'3%'}}
                    label="業績獎金"
                    value={salaryRequest.Bonus}
                    onChange={(e) => handleInputChange(e, 'Bonus')}
                  />
              </Grid>
              {checked?
                <>
                  <Grid item xs={1}>
                    +
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                        id="outlined-helperText"
                        style={{marginTop:'3%'}}
                        label="加班費"
                        value={salaryRequest.OverTimeMoney}
                        onChange={(e) => handleInputChange(e, 'OverTimeMoney')}
                      />
                  </Grid>
                </>:null
              }
              <Grid item xs={1}>
                =
              </Grid>
              <Grid item xs={2}>
                <TextField
                    id="outlined-helperText"
                    style={{marginTop:'1%'}}
                    label="薪資加項總額"
                    value={plusTotal}
                  />
              </Grid>
              <Grid item xs={12} style={{margin:'1%'}}/>

              <Grid item xs={1}>
                  薪資減項
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="病假扣款"
                  value={salaryRequest.SickHours}
                  onChange={(e) => handleInputChange(e, 'SickHours')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="事假扣款"
                  value={salaryRequest.ThingHours}
                  onChange={(e) => handleInputChange(e, 'ThingHours')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="生理假扣款"
                  value={salaryRequest.MenstruationHours}
                  onChange={(e) => handleInputChange(e, 'MenstruationHours')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="產假扣款"
                  value={salaryRequest.ChildbirthHours}
                  onChange={(e) => handleInputChange(e, 'ChildbirthHours')}
                /> 
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="育嬰假扣款"
                  value={salaryRequest.TakeCareBabyHours}
                  onChange={(e) => handleInputChange(e, 'TakeCareBabyHours')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="遲到早退扣款"
                  value={salaryRequest.EarlyOrLateAmount}
                  onChange={(e) => handleInputChange(e, 'EarlyOrLateAmount')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="打卡超出範圍扣款"
                  value={salaryRequest.OutLocationAmount}
                  onChange={(e) => handleInputChange(e, 'OutLocationAmount')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="所得稅代扣"
                  value={salaryRequest.IncomeTax}
                  onChange={(e) => handleInputChange(e, 'IncomeTax')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="健保費"
                  value={salaryRequest.HealthInsurance}
                  onChange={(e) => handleInputChange(e, 'HealthInsurance')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="勞保費"
                  value={salaryRequest.WorkerInsurance}
                  onChange={(e) => handleInputChange(e, 'WorkerInsurance')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="員工勞退"
                  value={salaryRequest.EmployeeRetirement}
                  onChange={(e) => handleInputChange(e, 'EmployeeRetirement')}
                />
              </Grid>              
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="補充保費"
                  value={salaryRequest.SupplementaryPremium}
                  onChange={(e) => handleInputChange(e, 'SupplementaryPremium')}
                />
              </Grid>
              <Grid item xs={1}>
                =
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="薪資扣項總和"
                  value={minusTotal}
                />
              </Grid>
              <Grid item xs={12} style={{margin:'1%'}}/>
              <Grid item xs={1}>
                  雇主負擔
              </Grid>
              <Grid item xs={1}>
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'3%'}}
                  label="健保費"
                  value={salaryRequest.HealthInsuranceFromCompany}
                  onChange={(e) => handleInputChange(e, 'HealthInsuranceFromCompany')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={1}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="勞保費"
                  value={salaryRequest.WorkerInsuranceFromCompany}
                  onChange={(e) => handleInputChange(e, 'WorkerInsuranceFromCompany')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={1}>
                <TextField
                  id="outlined-helperText"
                  style={{width:'100px',marginTop:'3%'}}
                  label="勞退提繳"
                  value={salaryRequest.EmployeeRetirementFromCompany}
                  onChange={(e) => handleInputChange(e, 'EmployeeRetirementFromCompany')}
                />
              </Grid>
              <Grid item xs={1}>
                +
              </Grid>
              <Grid item xs={1}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="墊償基金"
                  value={salaryRequest.AdvanceFundFromCompany}
                  onChange={(e) => handleInputChange(e, 'AdvanceFundFromCompany')}
                /> 
              </Grid>
              <Grid item xs={1}>
                =
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-helperText"
                  style={{marginTop:'3%'}}
                  label="企業負擔總額"
                  value={companyCostTotal}
                /> 
              </Grid>
              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>     
                <Button variant="contained" startIcon={<ReplyIcon />} onClick={handleBackClick} style={{ marginRight: '10px' }}>
                  返回
                </Button> 
                <Button variant="contained" startIcon={<SendIcon />} onClick={handleFinalResult}>
                  計算總額
                </Button>
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
              <Grid item xs={12} style={{fontSize:'14px'}}>
                  健保費負擔比例：<br/>
                  一般公司行號受僱員工為健保第一類身分，健保費用雇主：勞工：政府分擔比例＝6：3：1，因此雇主應負擔60%、勞工應負擔30%、政府應負擔10%保險費。
              </Grid>
              <Grid item xs={12} style={{fontSize:'14px'}}>
                  健保費負擔金額計算: <br/>
                  如果員工有眷屬依附在其名下保健保，還要再加上眷屬人數來計算健保費用，若超過3位眷屬則最多計算3人，因此最多只會計算4人的健保費。<br/> 
                  員工自行負擔健保費用計算公式為「投保薪資×健保費率（5.17%）×負擔比例（積數先四捨五入）X（本人+眷屬人數）。（以元為單位，角以下四捨五入）」。
              </Grid>
              <Grid item xs={12} style={{fontSize:'14px'}}>
                  勞就保費負擔比例<br/>
                  勞保局已公告明年（2023年）勞保普通事故費率將調升0.5%，從現行的11.5%調升為12%，因此明年的勞就保費率為12%（含勞保普通事故保險費率11%、就業保險費率1%），而一般公司行號勞保費用雇主：勞工：政府分擔比例=7：2：1，因此雇主應負擔70%、勞工應負擔20%、政府應負擔10%保險費。
              </Grid>
              <Grid item xs={12} style={{fontSize:'14px'}}>
                  勞就保費負擔金額計算: <br/>
                  勞保負擔費用計算公式為「月投保薪資×勞工保險費率（11%）×負擔比例。（以元為單位，角以下四捨五入）」、就保負擔費用計算公式為「月投保薪資×就業保險費率（1%）×負擔比例。（以元為單位，角以下四捨五入）」。
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
    