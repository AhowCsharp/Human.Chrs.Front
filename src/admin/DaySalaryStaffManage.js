import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
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
import IconButton from '@mui/material/IconButton';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import StaffSearch from './StaffSearch';
import InsuranceClass from '../Insurance/Insurance';

const Transition = React.forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);



export default function DaySalaryStaffManage() {
   
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
            field: 'StaffNo',
            headerName: '員工編號',
            width: 100,
            editable: true,
        },
        {
            field: 'StaffName',
            headerName: '姓名',
            width: 100,
            editable: true,
        },
        {
            field: 'Department',
            headerName: '部門',
            width: 100,
            editable: true,
        },
        {
            field: 'LevelPosition',
            headerName: '職稱',
            width: 100,
            editable: true,
        },
        {
            field: 'Email',
            headerName: '信箱',
            width: 200,
            editable: true,
        },
        {
            field: 'StaffPhoneNumber',
            headerName: '手機號碼',
            width: 200,
            editable: true,
        },
        {
            field: 'DaySalary',
            headerName: '日薪',
            width: 100,
            editable: true,
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
    const [open, setOpen] = useState(false);
    const [selectedRow,setSelectedRow] = useState(null);
    const [staffId,setStaffId] = useState(0);
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [excelOpen, setExcelOpen] = useState(false);
    const [overTimeopen, setOverTimeopen] = useState(false); 
    const [insuranceLevel,setInsuranceLevel]= useState(22);
    const [month,setMonth] = useState(9);
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
      });  

    const handleClickOpen = (row) => {
        setOpen(true);
        setSelectedRow(row)
    };

    const handleExcelOpen = (id) => {
        setStaffId(id);
        setExcelOpen(true);
    };

    const handleoverTimeClickOpen = (id) => {
        setStaffId(id);
        setOverTimeopen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    const fetchData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/admin/daysalarystaffs`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setRows(response.data);
            setFilterRows(response.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
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
        if(salaryRequest.WorkerInsuranceFromCompany === 0 || salaryRequest.HealthInsuranceFromCompany === 0 
          || salaryRequest.EmployeeRetirementFromCompany === 0 || salaryRequest.CompanyCostAmount === 0) {
          alert('請確認雇主負擔部分是否正確  不要觸犯勞基法');
          return;
        }
        
        const newSalaryRequest = { ...salaryRequest };
        newSalaryRequest.StaffActualIncomeAmount = salaryRequest.StaffIncomeAmount - salaryRequest.StaffDeductionAmount;
        newSalaryRequest.ParttimeSalary = calculateWage(selectedRow.ParttimeMoney, selectedRow.TotalPartimeHours, selectedRow.TotalPartimeMinutes);
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

    useEffect(() => {
        fetchData();
    }, []); 
    

  return (
    <>
    <Box
      sx={{
        margin:'2%',
        width: '95%',
        height: 700,
      }}
    >

        <Grid container spacing={0} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    日薪制員工發放系統
                </Typography>
            </Grid>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Alert severity="warning">
                  <AlertTitle>請注意</AlertTitle>
                  員工信箱請填寫正確 若填寫不正確 則無法啟用忘記密碼功能<strong>--若需要修改 請雙擊該列</strong>
                </Alert>
            </Grid>
            <Grid item xs={6} >      
                <StaffSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>
            <Grid item xs={6}/>
            {/* <Grid item xs={2}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={()=>handleClickOpen(true)}>新增員工</Button>
            </Grid>      */}
        </Grid>
        
        <DataGrid
            rows={filterRows}
            columns={columns}
            // onCellDoubleClick={handleGetDetail}
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
                                        value={selectedRow !== null ? selectedRow.ParttimeOverTimeTotalMony:0}
                                        onChange={(e) => handleInputChange(e, 'BasicSalary')}/>
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

    