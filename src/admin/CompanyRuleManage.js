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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import SalarySettingSearch from './SalarySettingSearch';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function CompanyRuleManage() {
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
            field: 'DepartmentId',
            headerName: '部門編號',
            width: 100,
            editable: true,
        },
        {
            field: 'DepartmentName',
            headerName: '部門名稱',
            width: 150,
            editable: true,        
            renderCell: (params) => (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <Select 
                    value={params.formattedValue}
                    onChange={(e) => {
                      const newValue = e.target.value;               
                      const updatedRows = filterRows.map((row) => {
                        if (row.id === params.id) {
                          const newRow = {...row, DepartmentName: newValue}   
                          processRowUpdate(newRow)                      
                          return { ...row, DepartmentName: newValue };                       
                        }
                        return row;
                      });                    
                      setFilterRows(updatedRows);
                    }}
                  >
                    {departments.map((option) => (
                      <MenuItem  key={option.id} value={option.DepartmentName}>
                        {option.DepartmentName}
                      </MenuItem >
                    ))}
                  </Select >
              </FormControl>
            ),
        },
        {
            field: 'NeedWorkMinute',
            headerName: '工作需滿分鐘',
            width: 152,
            editable: false,    
            renderCell: (params) => {
              const hours = Math.floor(params.value / 60);
              const minutes = params.value % 60;
        
              if (minutes === 0) {
                return `${hours} 小時`;
              }
              return `${hours} 小時 ${minutes} 分鐘`;
            }
        },
        {
          field: 'CheckInStartTime',
          headerName: '上班打卡時段',
          width: 120,
          editable: true,
          renderCell: (params) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                style={{ width: '120px' }}
                label=""
                value={dayjs().hour(params.value.split(':')[0]).minute(params.value.split(':')[1])}
              />
            </LocalizationProvider>
          ),
        },       
        {   
          field: 'action1', 
          headerName: '', 
          width: 10 ,
          sortable:false,
          renderCell: () => {
            return `~`;
          },
        },
        {
            field: 'CheckInEndTime',
            headerName: '上班打卡時段',
            width: 120,
            editable: true,
            renderCell: (params) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  style={{ width: '120px' }}
                  label=""
                  value={dayjs().hour(params.value.split(':')[0]).minute(params.value.split(':')[1])}
                />
              </LocalizationProvider>
            ),
        },
        {
          field: 'CheckOutStartTime',
          headerName: '下班打卡時段',
          width: 120,
          editable: true,
          renderCell: (params) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                style={{ width: '120px' }}
                label=""
                value={dayjs().hour(params.value.split(':')[0]).minute(params.value.split(':')[1])}
              />
            </LocalizationProvider>
          ),
      },
      {   
        field: 'action2', 
        headerName: '', 
        width: 10 ,
        sortable: false,
        renderCell: () => {
          return `~`;
        },
      },
      {
          field: 'CheckOutEndTime',
          headerName: '下班打卡時段',
          width: 120,
          editable: true,
          renderCell: (params) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                style={{ width: '120px'}}
                label=""
                value={dayjs().hour(params.value.split(':')[0]).minute(params.value.split(':')[1])}
              />
            </LocalizationProvider>
          ),
          renderEditCell: (params) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                style={{ width: '120px' }}
                label=""
                value={dayjs().hour(params.value.split(':')[0]).minute(params.value.split(':')[1])}
                onChange={(newValue) => {
                  const formattedValue = dayjs(newValue).format('HH:mm:00');
                  console.log(formattedValue);
                }}
              />
            </LocalizationProvider>
          ),
      },
      {
        field: 'AfternoonTime',
        headerName: '午休時段',
        width: 150,
        editable: true,
      },
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [editedRows, setEditedRows] = React.useState([]);
    const [selectedStaff,setSelectedStaff] = useState(null);
    const [departments,setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const isDisabled = editedRows.length === 0;

    const handleRuleUpdateSave = async () => {
      const modifiedRows = editedRows.map(item => ({
        ...item,
      }));
      console.log(modifiedRows)
        // try {
        //   const response = await axios.patch(`${apiUrl}/member/updateinfo`, modifiedRows, {
        //     headers: {
        //         'X-Ap-Token':`${token}`,  // 
        //         'Content-Type': 'application/json'
        //     }
        // });
        //   if(response.status === 200) {     
        //     const newData = await axios.get(`${apiUrl}/member/student`, {
        //       headers: {
        //         'X-Ap-Token':`${token}`
        //       }
        //     });
        //     alert('修改成功');
        //     setRows(newData.data.List);
        //     setFilterRows(newData.data.List);
        //     setEditedRows([]);
        //   }else {
        //     alert('修改失敗');
        //   }
    
        // } catch (error) {
        //   console.error('Failed to fetch user data:', error);
        //   alert('修改失敗');
        // }
    };

    const processRowUpdate = (newRow, oldRow) => {
      // 透過 newRow 的 id 找到 editedRows 陣列中的索引
      const index = editedRows.findIndex(row => row.id === newRow.id);
    
      // 若找到相同的 id，則先刪除
      if (index > -1) {
        editedRows.splice(index, 1);
      }
    
      // 將 newRow 加入 editedRows 陣列
      setEditedRows([...editedRows, newRow]);
      return newRow;
    };
    const handleCancelUpdate = () => {
      setEditedRows([]);
      setFilterRows(rows);
    };
    const handleClickOpen = (params) => {

      setOpen(true);
    };
  
    const handleClose = () => {

      setOpen(false);
    };

    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/rules`,config);
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data);
          setFilterRows(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  const fetchDepartmentData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/departments`,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

    useEffect(() => {
      fetchData();
      fetchDepartmentData();
    }, []); 
    const handleVerify = async (isPass) => {     
        const request = {
          VacationId : selectedStaff.id,
          IsPass:isPass
        }
        try {
          const response = await axios.patch(`${appsetting.apiUrl}/admin/rules`,config);
          if (response.status === 200) {
            fetchData();
            handleClose();
          }
        } catch (error) {
          console.error("Error logging in:", error);
          fetchData();
          handleClose();
          alert('該員工之請假額度已到，故系統審核未通過2');
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
                    公司各部門上班規定
                </Typography>
            </Grid>
            {/* <Grid item xs={12}>      
                <SalarySettingSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid> */}


            <Grid item xs={1}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={()=>handleClickOpen(true)}>新增員工</Button>
            </Grid>  
            <Grid item xs={1}>  
                <Button variant="outlined" disabled={isDisabled} onClick={handleRuleUpdateSave}  endIcon={<SaveIcon />}> 
                儲存修改
                </Button>
            </Grid>
            <Grid item xs={1}>  
                <Button variant="outlined" disabled={isDisabled} onClick={handleCancelUpdate}  endIcon={<ClearIcon />}> 
                  取消修改
                </Button>
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
            disableColumnMenu
            pageSizeOptions={[30,20,10]}
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={error=>alert(error)}
            onRowEditCommit={(rowId, e) => {
              handleRuleUpdateSave(rowId,e);
            }}
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
    