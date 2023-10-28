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
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import AmendRecordSearch from './AmendRecordSearch';
import ErrorAlert from '../errorView/ErrorAlert';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function AmendRecordsManage() {
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
          field: 'Applicant',
          headerName: '姓名',
          width: 100,
          editable: true,
      },
      {
          field: 'ApplicationDate',
          headerName: '申請日期',
          width: 100,
          editable: true,
          renderCell: (params) => {
            const date = new Date(params.value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
      },
      {
        field: 'CheckDate',
        headerName: '補卡日期',
        width: 100,
        editable: true,
        renderCell: (params) => {
          const date = new Date(params.value);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
      },
      {
        field: 'CheckTime',
        headerName: '補卡時間',
        width: 100,
        editable: true,
        renderCell: (params) => `${params.value.split('T')[1]}`,
      },
      {
        field: 'Reason',
        headerName: '理由',
        width: 150,
        editable: true,
      },
      {
          field: 'IsValidate',
          headerName: '審核狀態',
          width: 150,
          editable: true,
          renderCell: (params) => {
            switch (params.value) {
                case 1:
                    return "已通過";
                case -1:
                    return "未通過";
                case 0:
                default:
                    return "未審核";
            }
        },
      },
      {
        field: 'Inspector',
        headerName: '審核人名稱',
        width: 150,
        editable: true,
      },
      {
        field: 'ValidateDate',
        headerName: '審核日期',
        width: 150,
        editable: true,
        renderCell: (params) => {
            if (!params.value) { // Checks for null, undefined, and empty string
                return '';
            }
            const date = new Date(params.value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
      }    
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [timePeriod,setTimePeriod] = useState(getCurrentMonthBounds());
    const [selectedRecord,setSelectedAmendRecord] = useState(null);
    const [open, setOpen] = useState(false);
    const [errOpen,setErropen] = useState(false);
    const [errMsg ,setErrMsg]= useState('');	

    const handleClickOpen = (params) => {
      if(params.row.IsValidate === 1) {
        return;
      }
      setSelectedAmendRecord(params.row);
      console.log(params.row);
      setOpen(true);
    };

    const handleErrOpen = () => {
      setErropen(true);
    }
  
    const handleClose = () => {
      setSelectedAmendRecord(null);
      setOpen(false);
    };

    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/amendrecord?start=${timePeriod.start}&end=${timePeriod.end}`,config);
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
    const handleVerify = async (isPass) => {     
        const request = {
          AmendRecordId : selectedRecord.id,
          IsPass:isPass
        }
        try {
          const response = await axios.patch(`${appsetting.apiUrl}/admin/amendrecord`, request ,config);
          if (response.status === 200) {
            fetchData();
            handleClose();
          }
        } catch (error) {
          console.error("Error logging in:", error);
          fetchData();
          handleClose();
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
                    補打卡申請列表
                </Typography>
            </Grid>
            <Grid item xs={2} style={{marginLeft:'2%'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateField']}>
                  <DemoItem label="搜尋起始日">
                    <DateField value={dayjs(timePeriod.start)} format="YYYY-MM-DD"           
                    onChange={(e) => {
                    const newDate = e.format('YYYY-MM-DD');
                    setTimePeriod(prev => ({ ...prev, start: newDate }));
                    }}/>
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateField']}>
                  <DemoItem label="搜尋截止日">
                    <DateField value={dayjs(timePeriod.end)} format="YYYY-MM-DD"
                    onChange={(e) => {
                      const newDate = e.format('YYYY-MM-DD'); // 取得新的日期值
                      setTimePeriod(prev => ({ ...prev, end: newDate }));
                    }}/>
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',paddingTop:'4%' }}>
              <Button variant="contained" endIcon={<SearchIcon />} onClick={fetchData}>
                  Search
              </Button>
            </Grid>
            <Grid item xs={12}>      
                <AmendRecordSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>


            {/* <Grid item xs={2}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={()=>handleClickOpen(true)}>新增員工</Button>
            </Grid>      */}
        </Grid>
        <DataGrid
            rows={filterRows}
            columns={columns}
            onCellDoubleClick={(params) => handleClickOpen(params)}
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>審核補卡紀錄</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
            {selectedRecord !== null ? (
              <>
                  <Box sx={{ flexGrow: 1 }} style={{width:'300px'}}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" gutterBottom>
                            是否通過員工:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {selectedRecord.Applicant} 申請的補打卡呢?
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" gutterBottom>
                        補卡型別:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {selectedRecord.CheckType === 0 ? '上班' : (selectedRecord.CheckType === 1 ? '下班' : '未知')}
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" gutterBottom>
                        補卡日為:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                          {selectedRecord.CheckDate.split("T")[0]}  
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" gutterBottom>
                        補卡時間為:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                          {selectedRecord.CheckTime.split("T")[1]}
                      </Grid>
                    </Grid>
                  </Box>
              </>
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消操作</Button>
          <Button onClick={()=>handleVerify(true)}>同意</Button>
          <Button onClick={()=>handleVerify(false)}>不同意</Button>
        </DialogActions>
      </Dialog>
      <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
    </>
  );
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
    