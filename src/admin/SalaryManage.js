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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import SalarySettingSearch from './SalarySettingSearch';
import ErrorAlert from '../errorView/ErrorAlert';
import FinishedAlert from '../finishView/FinishedAlert';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function SalaryManage() {
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
          field: 'BasicSalary',
          headerName: '基本薪資',
          width: 100,
          editable: false,
      },
      {
          field: 'FullCheckInMoney',
          headerName: '全勤獎金',
          width: 120,
          editable: false,
      },
      {
        field: 'FoodSuportMoney',
        headerName: '伙食津貼',
        width: 120,
        editable: false,
      },
      {
          field: 'OtherPercent',
          headerName: '分紅%數',
          width: 120,
          editable: true,
          valueFormatter: (params) => 
          `${params.value}%`
      },
      {
        field: 'Calculate',
        headerName: '發放薪資',
        width: 150,
        renderCell: (params) => (
          <Button onClick={() => handleCalculateClick(params.row.StaffId)}>
            計算當月薪資
          </Button>
        ),
      } 
      ,
      {
        field: 'Actions',
        headerName: '',
        width: 200,
        renderCell: (params) => (
          <>
            <IconButton aria-label="delete" onClick={() => handleEditClickOpen(params.row,false)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDeleteSubmit(params.row.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleExcelOpen(params.row.StaffId)}>
              <ReceiptLongIcon />
            </IconButton>
          </>

        ),
      } 
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [staffs,setStaffs] = useState([]);
    const [month,setMonth] = useState(9);
    const [isCreate,setIsCreate] = useState(false);
    const [request,setRequest] = useState({
      id:0,
      StaffId:1,
      CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
      BasicSalary:0,
      FullCheckInMoney:0,
      FoodSuportMoney:0,
      OtherPercent:0
    })

    const navigate = useNavigate();

    const handleCalculateClick = (id) => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/admin/calculatesalary/${id}`);
    };
    const [open, setOpen] = useState(false);
    const [excelOpen, setExcelOpen] = useState(false);
    const [salaryExcelOpen, setSalaryExcelOpen] = useState(false);
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

    const handleClickOpen = (status) => {
      setRequest({
        id:0,
        StaffId:1,
        CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
        BasicSalary:0,
        FullCheckInMoney:0,
        FoodSuportMoney:0,
        OtherPercent:0
      })
      setIsCreate(status)
      setOpen(true);
    };

    const handleEditClickOpen = (row,status) => {
      setRequest({
        ...request,
        ...row
      })
      setIsCreate(status)
      setOpen(true);
    };
    const handleExcelOpen = (id) => {
      setStaffId(id);
      setExcelOpen(true);
    };
    const handleExcelClose = () => {
      setExcelOpen(false);
    };

    const handleSalaryExcelOpen = () => {
      setSalaryExcelOpen(true);
    };
    const handleSalaryExcelClose = () => {
      setSalaryExcelOpen(false);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/salarysettings`,config);
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data.Data);
          setFilterRows(response.data.Data);
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

  const fetchStaffsData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/staffs`,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        const filteredStaffs = response.data.filter(staff => staff.EmploymentTypeId === 1);
  
        // 更新 state，只包括 DepartmentId 为 1 的员工
        setStaffs(filteredStaffs);
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
      fetchStaffsData();
      fetchData();
    }, []); 

    // useEffect(() => {
    //     fetchStaffDetailData();
    // }, []); 
    // const navigate = useNavigate();

    const handleInputChange = (event, propertyName) => {
      const value = event.target ? event.target.value : event;
      if(propertyName === 'FoodSuportMoney' && value > 2400) {
        handleErrOpen();
        setErrMsg('伙食津貼不列入稅收，不得超過每月2400額度');
        return;
      }
      
      setRequest((prevData) => ({
          ...prevData,
          [propertyName]: value,
      }));   
  };
  const handleSubmit = async () => {
    
    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/salarysetting`, request ,config);
        if (response.status === 200) {
        handleOkOpen();
        fetchData();
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

const handleDeleteSubmit = async (id) => {
    
  try {
      const response = await axios.delete(`${appsetting.apiUrl}/admin/salarysetting`, {
          ...config,
          params: { id }
      });

      if (response.status === 200) {
          handleOkOpen();
          fetchData();
      }
  } catch (error) {
      console.error("Error deleting record:", error);
      if (error.response) {         
        console.error('Server Response', error.response);
        const serverMessage = error.response.data;

        handleErrOpen();
        setErrMsg(serverMessage);
      }
  }          
}

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

const downloadSalaryExcel = async () => {
  try {
      const response = await axios.get(`${appsetting.apiUrl}/admin/downloadsalaryexcel?month=${month}`, {
          ...config,
          responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '薪資發放單.xlsx'); // or any other format you want
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);  // Once download is done, remove the link from the DOM
      handleSalaryExcelClose();
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
                    薪資設定列表
                </Typography>
            </Grid>
            <Grid item xs={12}>      
                <SalarySettingSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>


            <Grid item xs={4}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={()=>handleClickOpen(true)}>新增設定</Button>
                <Button variant="outlined" style={{marginLeft:'15px'}} endIcon={<FactCheckIcon/>} onClick={handleSalaryExcelOpen}>下載公司薪資單</Button>
            </Grid>   

                            <Dialog open={open} 
                  onClose={handleClose}
                  TransitionComponent={Transition}
                  keepMounted>
                  <DialogTitle>{isCreate?'新增薪資設定':'修改薪資設定'}</DialogTitle>
                  <DialogContent>
                      <Box
                          sx={{
                              margin:'auto',
                              width: '100%',
                              height: 'auto',                    
                          }}
                          >
                              <Grid container spacing={2} >                          
                                  <Grid item xs={3}>
                                      <InputLabel shrink htmlFor="bootstrap-input">
                                          員工姓名
                                      </InputLabel>  
                                      <Select
                                      labelId="demo-simple-select-required-label"
                                      id="demo-simple-select-required"
                                      value={request.StaffId }
                                      inputProps={{ readOnly: !isCreate }}
                                      label=""
                                      size="small"
                                      style={{width:'100%'}}
                                      onChange={(e) => handleInputChange(e, 'StaffId')}
                                      >
                                        {
                                          staffs.map((staff) => (
                                            <MenuItem key={staff.id} value={staff.id}>
                                              {staff.StaffName}
                                            </MenuItem>
                                          ))
                                        }
                                      </Select>
                                  </Grid>
                                  <Grid item xs={4}>      
                                      <InputLabel shrink htmlFor="bootstrap-input">
                                          基本薪水
                                      </InputLabel>       
                                      <TextField id="StaffNo" 
                                          type="number" size="small"
                                          value={request.BasicSalary}
                                          onChange={(e) => handleInputChange(e, 'BasicSalary')}/>
                                  </Grid>

                                  <Grid item xs={4}>      
                                      <InputLabel shrink htmlFor="bootstrap-input">
                                          全勤獎金
                                      </InputLabel>       
                                      <TextField id="StaffNo" 
                                          type="number" size="small"
                                          value={request.FullCheckInMoney}
                                          onChange={(e) => handleInputChange(e, 'FullCheckInMoney')}/>
                                  </Grid>

                                  <Grid item xs={4}>      
                                      <InputLabel shrink htmlFor="bootstrap-input">
                                          伙食津貼
                                      </InputLabel>       
                                      <TextField id="StaffNo" 
                                          type="number" size="small"
                                          value={request.FoodSuportMoney}
                                          onChange={(e) => handleInputChange(e, 'FoodSuportMoney')}/>
                                  </Grid>

                                  <Grid item xs={4}>      
                                      <InputLabel shrink htmlFor="bootstrap-input">
                                          獎金分紅%數設定
                                      </InputLabel>       
                                      <TextField id="StaffNo" 
                                          type="number" size="small"
                                          value={`${request.OtherPercent}`}
                                          onChange={(e) => handleInputChange(e, 'OtherPercent')}/>
                                  </Grid>      
                              </Grid>
                          </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSubmit}>{isCreate?'新增':'修改'}</Button>
                  </DialogActions>
                </Dialog> 
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
        <DialogTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%'}}>出勤狀況Excel下載申請</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%'}}>
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
              <Button onClick={handleExcelClose}>取消</Button>
              <Button onClick={downloadExcel}>下載EXCEL</Button>
            </DialogActions>
        </Grid>
      </Dialog>

      <Dialog open={salaryExcelOpen} onClose={handleSalaryExcelClose}>
        <DialogTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%'}}>薪資發放Excel下載申請</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:'100%'}}>
              請選擇月份
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
              <Button onClick={handleSalaryExcelClose}>取消</Button>
              <Button onClick={downloadSalaryExcel}>下載EXCEL</Button>
            </DialogActions>
        </Grid>
      </Dialog>
      <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
      <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
    </>
  );
}
