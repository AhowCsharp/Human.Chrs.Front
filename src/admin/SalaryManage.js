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
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import SalarySettingSearch from './SalarySettingSearch';

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
          </>

        ),
      } 
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [staffs,setStaffs] = useState([]);
    const [isCreate,setIsCreate] = useState(false);
    const [request,setRequest] = useState({
      id:0,
      StaffId:1,
      CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
      BasicSalary:0,
      FullCheckInMoney:0,
      OtherPercent:0
    })

    const navigate = useNavigate();

    const handleCalculateClick = (id) => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/admin/calculatesalary/${id}`);
    };
    const [open, setOpen] = useState(false);

    const handleClickOpen = (status) => {
      setRequest({
        id:0,
        StaffId:1,
        CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
        BasicSalary:0,
        FullCheckInMoney:0,
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
      }
  };

  const fetchStaffsData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/staffs`,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setStaffs(response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
      console.log(value)
      setRequest((prevData) => ({
          ...prevData,
          [propertyName]: value,
      }));   
  };
  const handleSubmit = async () => {
    
    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/salarysetting`, request ,config);
        if (response.status === 200) {
        alert('成功');
        fetchData();
        handleClose();
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert('失敗 該員工已有薪資設定/該員工雇用類別不為全職');
    }          
}

const handleDeleteSubmit = async (id) => {
    
  try {
      const response = await axios.post(`${appsetting.apiUrl}/admin/salarysetting?id=${id}`, request ,config);
      if (response.status === 200) {
        alert('成功');
        fetchData();
      }
  } catch (error) {
      console.error("Error logging in:", error);
      alert('請先更改該員工就職狀態');
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


            <Grid item xs={2}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={()=>handleClickOpen(true)}>新增設定</Button>

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

const getCurrentMonthBounds = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // 獲取當下月份的第一天
  const start = new Date(year, month, 1);
  const startDateString = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;


  // 獲取當下月份的最後一天
  const end = new Date(year, month + 1, 0);
  const endDateString = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

  return { start: startDateString, end: endDateString };
}
    