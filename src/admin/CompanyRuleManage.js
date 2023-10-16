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
     
        {   field: 'id', headerName: 'ID', width: 30 },
        {
            field: 'DepartmentName',
            headerName: '部門名稱',
            width: 150,
            editable: false,        
        },
        {
            field: 'NeedWorkMinute',
            headerName: '工作時長',
            width: 120,
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
          headerName: '上班時段',
          width: 120,
          editable: true,
        },       
        {   
          field: 'action1', 
          headerName: '', 
          width: 10 ,
          sortable:false,
          renderCell: () => `~`,
        },
        {
            field: 'CheckInEndTime',
            headerName: '上班時段',
            width: 120,
            editable: true,
        },
        {
          field: 'CheckOutStartTime',
          headerName: '下班時段',
          width: 120,
          editable: true,
      },
      {   
        field: 'action2', 
        headerName: '', 
        width: 10 ,
        sortable: false,
        renderCell: () => `~`,
      },
      {
        field: 'CheckOutEndTime',
        headerName: '下班時段',
        width: 120,
        editable: true,
      },     
      {
        field: 'AfternoonTime',
        headerName: '午休時段',
        width: 150,
        editable: true,
      },
      {
        field: 'WorkAddress',
        headerName: '工作定位',
        width: 250,
        editable: true,
      },
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [editedRows, setEditedRows] = React.useState([]);
    const [ruleRequest,setRuleRequest] = useState({
      id:0,
      NeedWorkMinute:0,
      DepartmentName:'',
      DepartmentId:1,
      CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
      CheckInStartTime:'09:00:00',
      CheckInEndTime:'09:00:00',
      CheckOutStartTime:'18:00:00',
      CheckOutEndTime:'18:00:00',
      AfternoonTime:'',
      WorkAddress:''
    });
    const [departments,setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const isDisabled = editedRows.length === 0;

    const handleRuleUpdateSave = async () => {
      const modifiedRows = editedRows.map(item => ({
        ...item,
      }));
      const allTimesValid = modifiedRows.every(row => 
        isValidTime(row.CheckInStartTime) &&
        isValidTime(row.CheckInEndTime) &&
        isValidTime(row.CheckOutStartTime) &&
        isValidTime(row.CheckOutEndTime)
      );

      if (!allTimesValid) {
          alert('請確認所有的時間格式是否正確 (HH:MM:SS)');
          return;
      }

        try {
          const response = await axios.post(`${appsetting.apiUrl}/admin/modifyrule`, modifiedRows,config);
          if(response.status === 200) {     
            alert('修改成功');
            fetchData();
            setEditedRows([]);
          }
   
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          alert('修改失敗 請確認地址及其他欄位是否正確');
        }
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
      fetchData();
    };
    const handleClickOpen = () => {

      setOpen(true);
    };
  
    const handleClose = () => {

      setOpen(false);
    };

    const isValidTime = (timeStr) => {
      const regex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
      return regex.test(timeStr);
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


    const handleInsert = async () => {  
      if(!isValidTime(ruleRequest.CheckInStartTime) || 
         !isValidTime(ruleRequest.CheckInEndTime) || 
         !isValidTime(ruleRequest.CheckOutStartTime) || 
         !isValidTime(ruleRequest.CheckOutEndTime)) {
          alert('請確認時間格式是否正確 (HH:MM:SS)');
          return;
      }
  
      if(ruleRequest.WorkAddress.length < 5) {
          alert('請確認地址部分輸入是否正確');
          return;
      }   
  
      try {
          const response = await axios.patch(`${appsetting.apiUrl}/admin/newrule`, ruleRequest, config);
          if (response.status === 200) {
              alert('新增成功');
              fetchData();
              handleClose();
          }
      } catch (error) {
          console.error("Error logging in:", error);
          alert('請確認該部門是否已有規定/或是地址部分輸入是否正確');
      }          
  }
    const handleInputChange = (event, propertyName) => {
      const value = event.target ? event.target.value : event;
      console.log(value)
      setRuleRequest((prevData) => ({
          ...prevData,
          [propertyName]: value,
      }));   
  };

  return (
    <>
      <Box
        sx={{
          margin:'auto',
          width: '100%',
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


            <Grid item xs={4}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={handleClickOpen}>新增規定</Button>

                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>新增規定</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      請注意  一個部門只能有設置單一規定 請勿重複設置
                    </DialogContentText>
                    <Grid container spacing={2} style={{marginBottom:'1%'}}>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="工作時數"
                              type="number"
                              variant="standard"
                              value={ruleRequest.NeedWorkMinute}
                              onChange={(e) => handleInputChange(e, 'NeedWorkMinute')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">部門</InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={ruleRequest.DepartmentId}
                              label="Age"
                              onChange={(e) => handleInputChange(e, 'DepartmentId')}
                            >
                              {departments.map((option) => (
                                <MenuItem  key={option.id} value={option.id}>
                                  {option.DepartmentName}
                                </MenuItem >
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="上班時段起"
                              variant="standard"
                              value={ruleRequest.CheckInStartTime}
                              onChange={(e) => handleInputChange(e, 'CheckInStartTime')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="上班時段止"
                              variant="standard"
                              value={ruleRequest.CheckInEndTime}
                              onChange={(e) => handleInputChange(e, 'CheckInEndTime')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="下班時段起"
                              variant="standard"
                              value={ruleRequest.CheckOutStartTime}
                              onChange={(e) => handleInputChange(e, 'CheckOutStartTime')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="下班時段止"
                              variant="standard"
                              value={ruleRequest.CheckOutEndTime}
                              onChange={(e) => handleInputChange(e, 'CheckOutEndTime')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="午休時段"
                              variant="standard"
                              placeholder='自由設定'
                              value={ruleRequest.AfternoonTime}
                              onChange={(e) => handleInputChange(e, 'AfternoonTime')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="工作定位地址"
                              variant="standard"
                              placeholder='請輸入正確的地址'
                              value={ruleRequest.WorkAddress}
                              onChange={(e) => handleInputChange(e, 'WorkAddress')}
                            />
                        </Grid>
                    </Grid>

                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleInsert}>新增</Button>
                  </DialogActions>
                </Dialog>

                <Button variant="outlined" disabled={isDisabled} onClick={handleRuleUpdateSave}  endIcon={<SaveIcon />} style={{marginLeft:'2%'}}> 
                儲存修改
                </Button>

                <Button variant="outlined" disabled={isDisabled} onClick={handleCancelUpdate}  endIcon={<ClearIcon />} style={{marginLeft:'2%'}}> 
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
            rowHeight={80}
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
    