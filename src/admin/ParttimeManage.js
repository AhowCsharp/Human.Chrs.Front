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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import SearchIcon from '@mui/icons-material/Search';
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
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import ParttimeSearch from './ParttimeSearch';
import InsuranceClass from '../Insurance/Insurance';
import OverTimeDetailList from './OverTimeDetailList';
import ErrorAlert from '../errorView/ErrorAlert';
import FinishedAlert from '../finishView/FinishedAlert';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function ParttimeManage() {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const columns = [
     
      {   field: 'id', headerName: 'ID', width: 90 },
      {
          field: 'StaffName',
          headerName: '姓名',
          width: 100,
          editable: false,
      },
      {
          field: 'StaffNo',
          headerName: '員編',
          width: 100,
          editable: false,
      },
      {
        field: 'totalTime',
        headerName: '本月時數',
        width: 200,
        editable: false,
        valueGetter: (params) => 
            `${params.row.TotalPartimeHours} 小時又 ${params.row.TotalPartimeMinutes} 分鐘`
      },
      {
        field: 'ParttimeMoney',
        headerName: '時薪',
        width: 100,
        editable: false,
      },
      {
        field: 'ParttimeOverTimeHours',
        headerName: '加班時數',
        width: 120,
        editable: false,
      },
      {
        field: 'Actions',
        headerName: '本月薪資單',
        width: 120,
        renderCell: (params) => (
          <>
            <IconButton aria-label="delete" onClick={() => handleClickOpen(params.row)}>
              <LocalAtmIcon />
            </IconButton>
          </>

        ),
      },
      {
        field: 'List',
        headerName: '本月出勤單',
        width: 120,
        renderCell: (params) => (
          <>
            <IconButton aria-label="delete" onClick={() => handleExcelOpen(params.row.id)}>
              <ReceiptLongIcon />
            </IconButton>
          </>

        ),
      },
      {
        field: 'OverTimeList',
        headerName: '本月加班單',
        width: 120,
        renderCell: (params) => (
          <>
            <IconButton aria-label="delete" onClick={()=>handleoverTimeClickOpen(params.row.id)}>
              <ListAltIcon />
            </IconButton>
          </>

        ),
      },
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [insuranceLevel,setInsuranceLevel]= useState(0);
    const [overTimeopen, setOverTimeopen] = useState(false);  

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [selectedRow,setSelectedRow] = useState(null);
    const [salaryRequest,setSalaryRequest] = useState({
      StaffId:0,
      BasicSalary:0,
      FoodSuportMoney:0,
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
      EarlyOrLateAmount:0, 
      OutLocationAmount:0,
      OverTimeMoney:0,
      SalaryOfMonth:month,
      StaffIncomeAmount:0 ,
      StaffActualIncomeAmount:0,
      StaffDeductionAmount:0,
      CompanyCostAmount:0,
      ChangeOverTimeToMoney:true,
      TotalDaySalary:0
    }); 

    const [open, setOpen] = useState(false);
    const [excelOpen, setExcelOpen] = useState(false);
    const [staffId,setStaffId] = useState(0);
    const [errOpen,setErropen] = useState(false);
    const [errMsg ,setErrMsg]= useState('');		
    const [okOpen,setOkopen] = useState(false);



    const handleOkOpen = () => {
      setOkopen(true);
    }

    const handleErrOpen = () => {
      setErropen(true);
    }

    useEffect(() => {
      const matchedItem = InsuranceClass.find(item => item.id === insuranceLevel);
      if(selectedRow) {
        setSalaryRequest({
          StaffId:selectedRow.id,
          BasicSalary:0,
          FoodSuportMoney:0,
          FullCheckInMoney:0,
          OverTimeHours:selectedRow.OverTimeHours,
          Bonus:0,
          SickHours:0,
          ThingHours:0,
          MenstruationHours:0,
          ChildbirthHours:0,
          TakeCareBabyHours:0,
          TocolysisHours:0,
          IncomeTax:0,
          HealthInsurance:matchedItem.HealthInsurance,
          WorkerInsurance:matchedItem.WorkInsurance,
          EmployeeRetirement:0,
          SupplementaryPremium:0, //
          HealthInsuranceFromCompany:matchedItem.HealthInsuranceCompany,
          WorkerInsuranceFromCompany:matchedItem.WorkInsuranceCompany,
          EmployeeRetirementFromCompany:matchedItem.Retirement,
          AdvanceFundFromCompany:0,
          EarlyOrLateAmount:0, 
          OutLocationAmount:0,
          OverTimeMoney:selectedRow.ParttimeOverTimeTotalMony,
          SalaryOfMonth:month,
          StaffIncomeAmount:calculateWage(selectedRow.ParttimeMoney,selectedRow.TotalPartimeHours,selectedRow.TotalPartimeMinutes)+selectedRow.ParttimeOverTimeTotalMony ,
          StaffActualIncomeAmount:0,
          StaffDeductionAmount:0,
          CompanyCostAmount:0,
          ChangeOverTimeToMoney:true,
          TotalDaySalary:0
        })
      }
    }, [selectedRow]); 

    useEffect(() => {
      const matchedItem = InsuranceClass.find(item => item.id === insuranceLevel);
      
      if (matchedItem) {
        setSalaryRequest((prevSalaryRequest) => ({
          ...prevSalaryRequest, // 保留原有的属性
          HealthInsuranceFromCompany:matchedItem.HealthInsuranceCompany,
          WorkerInsuranceFromCompany:matchedItem.WorkInsuranceCompany,
          EmployeeRetirementFromCompany:matchedItem.Retirement,
          HealthInsurance:matchedItem.HealthInsurance,
          WorkerInsurance:matchedItem.WorkInsurance
        }))
      }
    }, [insuranceLevel]);

    const handleoverTimeClickOpen = (id) => {
      setStaffId(id);
      setOverTimeopen(true);
    };
    const handleoverTimeClose = () => {
      setOverTimeopen(false);
    };

    const handleClickOpen = (row) => {
      setOpen(true);
      setSelectedRow(row)
    };
  
    const handleClose = () => {
      setOpen(false);
      setSelectedRow(null);
    };

    const handleExcelOpen = (id) => {
      setStaffId(id);
      setExcelOpen(true);
    };

    const handleExcelClose = () => {
      setExcelOpen(false);
    };

    const downloadExcel = async () => {
      try {
          const response = await axios.get(`${appsetting.apiUrl}/admin/downloadexcel?staffId=${staffId}&month=${month}`, {
              ...config,
              responseType: 'blob'
          });
          
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '出勤打卡單.xlsx'); // or any other format you want
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);  // Once download is done, remove the link from the DOM
          handleExcelClose();
      } catch (error) {
          console.error("Error downloading the file:", error);
          if (error.response) {         
            console.error('Server Response', error.response);
            const serverMessage = error.response.data;
    
            handleErrOpen();
            setErrMsg(serverMessage);
          }
      }
    }

    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/parttime?month=${month}`,config);
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data);
          setFilterRows(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {         
          console.error('Server Response', error.response);
          const serverMessage = error.response.data;
  
          handleErrOpen();
          setErrMsg(serverMessage);
        }
      }
  };
    useEffect(() => {
      fetchData();
    }, []); 

    useEffect(() => {
      fetchData();
    }, [month]);

    useEffect(() => {
      console.log(salaryRequest)
      if(selectedRow) {
        setSalaryRequest({
          ...salaryRequest,
          StaffIncomeAmount:calculateWage(selectedRow.ParttimeMoney,selectedRow.TotalPartimeHours,selectedRow.TotalPartimeMinutes) + Number(salaryRequest.Bonus)
           + Number(salaryRequest.OverTimeMoney)+ Number(salaryRequest.FoodSuportMoney)
        })
        
      }
      if((salaryRequest.FoodSuportMoney === 0 || !salaryRequest.FoodSuportMoney) && selectedRow) {
        setSalaryRequest({
          ...salaryRequest,
          StaffIncomeAmount:calculateWage(selectedRow.ParttimeMoney,selectedRow.TotalPartimeHours,selectedRow.TotalPartimeMinutes)
          +Number(salaryRequest.OverTimeMoney)+ Number(salaryRequest.FoodSuportMoney)
        })
      }
    }, [salaryRequest.FoodSuportMoney,salaryRequest.Bonus,salaryRequest.OverTimeMoney]);

    useEffect(() => {
      handleMinusTotal();
  }, [salaryRequest.IncomeTax,salaryRequest.SupplementaryPremium,salaryRequest.EmployeeRetirement,salaryRequest.EarlyOrLateAmount,salaryRequest.OutLocationAmount]); 

    const handleInputChange = (event, propertyName) => {
      const value = event.target.value;
      if(propertyName === 'FoodSuportMoney' && value > 2400) {
        handleErrOpen();
        setErrMsg('伙食津貼不列入稅收，不得超過每月2400額度');    
        return;
      }
      // 使用 Number.isNaN 代替全局的 isNaN
      if (!Number.isNaN(Number(value)) || value === '') {
          setSalaryRequest((prevData) => ({
              ...prevData,
              [propertyName]: value === '' ? '' : Number(value),
          }));
      } else {
        handleErrOpen();
        setErrMsg('請輸入數字');
      }
  };
  

  const handleMinusTotal = () => {
    setSalaryRequest({
      ...salaryRequest,
      StaffDeductionAmount: salaryRequest.IncomeTax + salaryRequest.HealthInsurance 
      + salaryRequest.WorkerInsurance + salaryRequest.EmployeeRetirement + salaryRequest.SupplementaryPremium
    })
  }
  const handleCompanyCostTotal = () => {
    setSalaryRequest({
      ...salaryRequest,
      CompanyCostAmount: salaryRequest.HealthInsuranceFromCompany + salaryRequest.WorkerInsuranceFromCompany 
      + salaryRequest.EmployeeRetirementFromCompany + salaryRequest.AdvanceFundFromCompany
    })
  }



  const handleSalarySubmit = async () => {   
    // if(salaryRequest.WorkerInsuranceFromCompany === 0 || salaryRequest.HealthInsuranceFromCompany === 0 
    //   || salaryRequest.EmployeeRetirementFromCompany === 0 || salaryRequest.CompanyCostAmount === 0) {
    //   handleErrOpen();
    //   setErrMsg('請確認雇主負擔部分是否正確  不要觸犯勞基法');
    //   return;
    // }
    
    const newSalaryRequest = { ...salaryRequest };
    newSalaryRequest.StaffActualIncomeAmount = salaryRequest.StaffIncomeAmount - salaryRequest.StaffDeductionAmount;
    newSalaryRequest.ParttimeSalary = calculateWage(selectedRow.ParttimeMoney, selectedRow.TotalPartimeHours, selectedRow.TotalPartimeMinutes);
    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/paymoney`, newSalaryRequest, config);
        if (response.status === 200) {
            handleOkOpen();
            handleClose();
        }
    } catch (error) {
        console.error("Error logging in:", error);
        if (error.response) {         
          console.error('Server Response', error.response);
          const serverMessage = error.response.data;
  
          handleErrOpen();
          setErrMsg(serverMessage);
        }
    }
}

  return (
    <>
      <Box
        sx={{
          margin:'auto',
          width: '90%',
          height: 700,
        }}
      >
        <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    部分工時人員薪資列表
                </Typography>
            </Grid>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Alert severity="warning">
                  <AlertTitle>請注意</AlertTitle>
                  若該員工當月沒有打卡或出席<strong>--則該員工不會出現於列表上</strong>
                </Alert>
            </Grid>
            <Grid item xs={4} >      
                <ParttimeSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>   
              <FormControl variant="standard" sx={{ m: 0, minWidth: 12}}>
                <InputLabel id="demo-simple-select-standard-label">月份</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={month}
                  onChange={(e)=>setMonth(e.target.value)}
                  label="月份"
                >
                  <MenuItem value={1}>1月</MenuItem>
                  <MenuItem value={2}>2月</MenuItem>
                  <MenuItem value={3}>3月</MenuItem>
                  <MenuItem value={4}>4月</MenuItem>
                  <MenuItem value={5}>5月</MenuItem>
                  <MenuItem value={6}>6月</MenuItem>
                  <MenuItem value={7}>7月</MenuItem>
                  <MenuItem value={8}>8月</MenuItem>
                  <MenuItem value={9}>9月</MenuItem>
                  <MenuItem value={10}>10月</MenuItem>
                  <MenuItem value={11}>11月</MenuItem>
                  <MenuItem value={12}>12月</MenuItem>
                </Select>
              </FormControl> 
            </Grid>
            <Grid item xs={2}>      
            <Dialog open={open} 
              onClose={handleClose}
              TransitionComponent={Transition}
              keepMounted>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>薪資單</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            margin:'auto',
                            width: '100%',
                            height: 'auto',                    
                        }}
                        >
                              <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>                      
                                    <Button size="small" onClick={()=>setInsuranceLevel(22)}>基本投保級距</Button>
                              </Grid>
                              <Grid item xs={12} style={{display:'flex',justifyContent:'center',marginBottom:'2%'}}>
                                <FormControl variant="standard">
                                  <InputLabel id="demo-simple-select-label">投保級距</InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={insuranceLevel}
                                    onChange={(e)=>setInsuranceLevel(e.target.value)}
                                  >
                                  {InsuranceClass.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.min}~{item.max}
                                    </MenuItem>
                                  ))}
                                  </Select>
                                </FormControl>
                              </Grid> 

                            <Grid container spacing={2} >
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom>
                                      薪資加項
                                  </Typography>    
                                </Grid>              
                                <Grid item xs={3}>
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        時薪*時數
                                    </InputLabel>  
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        value={selectedRow !== null ? calculateWage(selectedRow.ParttimeMoney, selectedRow.TotalPartimeHours, selectedRow.TotalPartimeMinutes):0}/>
                                </Grid>
                                <Grid item xs={3}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        獎金
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={salaryRequest.Bonus}
                                        onChange={(e) => handleInputChange(e, 'Bonus')}
                                        onBlur={(e) => {
                                          if(e.target.value === "" || e.target.value === null) {
                                            setSalaryRequest({
                                              ...salaryRequest,
                                              Bonus:0
                                            })
                                          }
                                      }} 
                                        />
                                </Grid>
                                <Grid item xs={3}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        伙食津貼
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={salaryRequest.FoodSuportMoney}
                                        onChange={(e) => handleInputChange(e, 'FoodSuportMoney')}
                                        onBlur={(e) => {
                                          if(e.target.value === "" || e.target.value === null) {
                                            setSalaryRequest({
                                              ...salaryRequest,
                                              FoodSuportMoney:0
                                            })
                                          }
                                      }} />
                                </Grid>
                                <Grid item xs={3}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        加班費
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        size="small"
                                        value={salaryRequest.OverTimeMoney}
                                        onChange={(e) => handleInputChange(e, 'OverTimeMoney')}
                                        onBlur={(e) => {
                                          if(e.target.value === "" || e.target.value === null) {
                                            setSalaryRequest({
                                              ...salaryRequest,
                                              OverTimeMoney:0
                                            })
                                          }
                                      }} />
                                </Grid>
                                <Grid item xs={3}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        總額
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        value={salaryRequest.StaffIncomeAmount}
                                      />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom>
                                      薪資減項
                                  </Typography>    
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="text" onClick={handleMinusTotal}>計算減項總額</Button>    
                                </Grid>   
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        所得稅
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.IncomeTax}`}
                                        onChange={(e) => handleInputChange(e, 'IncomeTax')}/>
                                </Grid> 
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        補充保費
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.SupplementaryPremium}`}
                                        onChange={(e) => handleInputChange(e, 'SupplementaryPremium')}/>
                                </Grid> 
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        健保費
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.HealthInsurance}`}
                                        onChange={(e) => handleInputChange(e, 'HealthInsurance')}/>
                                </Grid>    
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        勞保費
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.WorkerInsurance}`}
                                        onChange={(e) => handleInputChange(e, 'WorkerInsurance')}/>
                                </Grid>    
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        員工勞退
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.EmployeeRetirement}`}
                                        onChange={(e) => handleInputChange(e, 'EmployeeRetirement')}/>
                                </Grid>  
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        總額
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        value={`${salaryRequest.StaffDeductionAmount}`}
                                    />
                                </Grid> 
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom>
                                      雇主負擔
                                  </Typography>    
                                </Grid> 
                                <Grid item xs={12}>
                                    <Button variant="text" onClick={handleCompanyCostTotal}>計算雇主負擔總額</Button>    
                                </Grid>
                                <Grid item xs={3}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        員工勞退
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.EmployeeRetirementFromCompany}`}
                                        onChange={(e) => handleInputChange(e, 'EmployeeRetirementFromCompany')}/>
                                </Grid> 
                                <Grid item xs={3}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                      墊償基金
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.AdvanceFundFromCompany}`}
                                        onChange={(e) => handleInputChange(e, 'AdvanceFundFromCompany')}/>
                                </Grid>   
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        健保費
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.HealthInsuranceFromCompany}`}
                                        onChange={(e) => handleInputChange(e, 'HealthInsuranceFromCompany')}/>
                                </Grid>    
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        勞保費
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        value={`${salaryRequest.WorkerInsuranceFromCompany}`}
                                        onChange={(e) => handleInputChange(e, 'WorkerInsuranceFromCompany')}/>
                                </Grid>    
                                <Grid item xs={2}>      
                                    <InputLabel shrink htmlFor="bootstrap-input">
                                        總額
                                    </InputLabel>       
                                    <TextField id="StaffNo" 
                                        type="number" size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        value={`${salaryRequest.CompanyCostAmount}`}
                                        onChange={(e) => handleInputChange(e, 'CompanyCostAmount')}/>
                                </Grid> 
                            </Grid>
                        </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>取消</Button>
                  <Button onClick={handleSalarySubmit}>送出</Button>
                </DialogActions>
              </Dialog>
  
            </Grid>     
        </Grid>
        <DataGrid
            rows={filterRows}
            columns={columns}
            // onCellDoubleClick={(params) => handleClickOpen(params)}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 30,
                },
            },
            }}
            pageSizeOptions={[30,20,10]}
            disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={excelOpen} onClose={handleExcelClose}>
        <DialogTitle>出勤狀況Excel下載申請</DialogTitle>
        <DialogContent>
          <DialogContentText>
              請選擇月份，下載該員工出勤狀況
          </DialogContentText>
            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%',marginTop:'5%' }}>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 20}}>
                <InputLabel id="demo-simple-select-standard-label">月份</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  style={{width:'100%'}}
                  value={month}
                  onChange={(e)=>setMonth(e.target.value)}
                  label="月份"
                >
                  <MenuItem value={1}>1月</MenuItem>
                  <MenuItem value={2}>2月</MenuItem>
                  <MenuItem value={3}>3月</MenuItem>
                  <MenuItem value={4}>4月</MenuItem>
                  <MenuItem value={5}>5月</MenuItem>
                  <MenuItem value={6}>6月</MenuItem>
                  <MenuItem value={7}>7月</MenuItem>
                  <MenuItem value={8}>8月</MenuItem>
                  <MenuItem value={9}>9月</MenuItem>
                  <MenuItem value={10}>10月</MenuItem>
                  <MenuItem value={11}>11月</MenuItem>
                  <MenuItem value={12}>12月</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          
        </DialogContent>
        <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%',marginTop:'5%' }}>
            <DialogActions>
              <Button onClick={handleExcelClose}>Cancel</Button>
              <Button onClick={downloadExcel}>下載EXCEL</Button>
            </DialogActions>
        </Grid>
      </Dialog>

      <Dialog open={overTimeopen} onClose={handleoverTimeClose}>
        <DialogTitle>{month}月加班狀況</DialogTitle>
        <DialogContent>

          <OverTimeDetailList staffId={parseInt(staffId, 10)}/>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleoverTimeClose}>退出</Button>
        </DialogActions>
      </Dialog>
      <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
      <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
    </>
  );
}


function calculateWage(hourlyRate, hours, minutes) {
  // 每30分鐘為一個單位，超過30分鐘但未滿60分鐘算半小時
  const totalHours = hours + Math.floor(minutes / 30) * 0.5;

  // 計算工資
  const wage = hourlyRate * totalHours;

  return wage;
}
    