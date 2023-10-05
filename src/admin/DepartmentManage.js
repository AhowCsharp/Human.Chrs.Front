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
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import AlertTitle from '@mui/material/AlertTitle';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import SalarySettingSearch from './SalarySettingSearch';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function DepartmentManage() {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const columns = [
     
        {   field: 'id', headerName: 'ID', width: 150 },
        {
            field: 'CompanyName',
            headerName: '公司名稱',
            width: 200,
            editable: true,
        },
        {
            field: 'DepartmentName',
            headerName: '部門/分店名稱',
            width: 150,
            editable: true,
        },
        {
            field: 'CompanyRuleId',
            headerName: '部門準則編號',
            width: 150,
            editable: true,
        }
    ];
    const [rows,setRows] = useState([]);
    const [editedRows, setEditedRows] = React.useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [departmentName,setDepartmentName] = useState('');
    const isDisabled = editedRows.length === 0;

    const handleClickOpen = (params) => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/departments`,config);
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data);
          setFilterRows(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

    useEffect(() => {
      fetchData();
    }, []); 

    const handleInsertSubmmit = async () => {     
        const request = {
          DepartmentName :departmentName,
        }
        try {
          const response = await axios.post(`${appsetting.apiUrl}/admin/newdepartment`,request,config);
          if (response.status === 200) {
            setRows(response.data);
            setFilterRows(response.data);
            alert('新增成功')
            handleClose();
          }
        } catch (error) {
          console.error("Error logging in:", error);
          alert('新增失敗');
        }          
    }
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


    const handleMultUpdateSave = async () => {
      const modifiedRows = editedRows.map(item => ({
        ...item,
      }));
      console.log(modifiedRows)
      try {
        const response = await axios.patch(`${appsetting.apiUrl}/admin/modifydepartment`, modifiedRows,config);
        if(response.status === 200) {     

          alert('修改成功');
          setRows(response.data);
          setFilterRows(response.data);
          setEditedRows([]);
        }
  
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('修改失敗');
      }
  };

  return (
    <>
      <Box
        sx={{
          margin:'auto',
          width: '60%',
          height: 700,
        }}
      >
        <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    公司部門列表
                </Typography>
            </Grid>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Alert severity="warning">
                  <AlertTitle>請注意</AlertTitle>
                  若是部門準則編號為0 即代表該部門尚未設置上下班時間<strong>--請馬上處理 避免打卡錯誤</strong>
                </Alert>
            </Grid>
            {/* <Grid item xs={12}>      
                <SalarySettingSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid> */}

            <Grid item xs={2}>      
                <Button variant="outlined" endIcon={<MapsHomeWorkIcon/>} onClick={handleClickOpen}>新增部門</Button>
            </Grid>
            <Grid item xs={2}>  
                <Button variant="outlined" disabled={isDisabled} onClick={handleMultUpdateSave}  startIcon={<SaveIcon />}> 
                儲存修改
                </Button>
            </Grid>
            <Grid item xs={2}>  
                <Button variant="outlined" disabled={isDisabled} onClick={()=>setEditedRows([])}  startIcon={<ClearIcon />}> 
                  取消修改
                </Button>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>新增部門</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="部門名稱"
                  type="email"
                  fullWidth
                  variant="standard"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleInsertSubmmit}>送出</Button>
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
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={error=>alert(error)}
            onRowEditCommit={(rowId, e) => {
              handleMultUpdateSave(rowId,e);
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
    