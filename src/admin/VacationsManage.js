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
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Select from '@mui/material/Select';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import VacationSearch from './VacationSearch';
import ErrorAlert from '../errorView/ErrorAlert';
import FinishedAlert from '../finishView/FinishedAlert';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function VacationsManage() {
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
          editable: true,
      },
      {
          field: 'StaffNo',
          headerName: '員編',
          width: 100,
          editable: true,
      },
      {
          field: 'VacationTypeName',
          headerName: '假別',
          width: 100,
          editable: false,
      },
      {
          field: 'ApplyDate',
          headerName: '申請日期',
          width: 120,
          editable: true,
          renderCell: (params) => {
            const date = new Date(params.value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
      },
      {
          field: 'ActualStartDate',
          headerName: '請假起始',
          width: 120,
          editable: true,
          renderCell: (params) => {
            const date = new Date(params.value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
      },
      {
          field: 'ActualEndDate',
          headerName: '請假結束',
          width: 120,
          editable: true,
          renderCell: (params) => {
            const date = new Date(params.value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
      },
      {
          field: 'Hours',
          headerName: '時數',
          width: 60,
          editable: true,
      },
      {
        field: 'Reason',
        headerName: '理由',
        width: 150,
        editable: true,
      },
      {
          field: 'IsPass',
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
        field: 'ApproverName',
        headerName: '審核人名稱',
        width: 150,
        editable: true,
      },
      {
        field: 'AuditDate',
        headerName: '審核日期',
        width: 150,
        editable: true,
      },
    ];
    const [rows,setRows] = useState([]);
    const [errOpen,setErropen] = useState(false);
    const [errMsg ,setErrMsg]= useState('');
    const [filterRows,setFilterRows] = useState([]);
    const [timePeriod,setTimePeriod] = useState(getCurrentMonthBounds());
    const [selectedStaff,setSelectedStaff] = useState(null);
    const [open, setOpen] = useState(false);
    const [hourModel,setHourModel] = useState(true);
    const [staffs,setStaffs] = useState([]);
    const [vacationRequest, setVacationRequest] = useState({
      Hours:0,
      StartDate:dayjs().millisecond(0),
      EndDate:dayjs().millisecond(0),
      Type:0,
      Reason:'',
      StaffId:0
    })
    const startDate = vacationRequest.StartDate.clone().millisecond(0).second(0);
    const endDate = vacationRequest.EndDate.clone().millisecond(0).second(0);
    const durationInMinutes = endDate.diff(startDate, 'minutes');
    const durationInDays = endDate.diff(startDate, 'days');
   const [vacationOpen, setVacationOpen] = useState(false);
   const [okOpen,setOkopen] = useState(false);
   const handleOkOpen = () => {
     setOkopen(true);
   }

    const handleErrOpen = () => {
      setErropen(true);
    }

    const handleClickOpen = (params) => {
      setSelectedStaff(params.row);
      setOpen(true);
    };

    const handleVacationClickOpen = () => {
      setVacationOpen(true);
    };

    const handleVacationClose = () => {
      setVacationOpen(false);
    };
  
    const handleClose = () => {
      setSelectedStaff(null);
      setOpen(false);
    };

    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/vacations?start=${timePeriod.start}&end=${timePeriod.end}`,config);
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
        setStaffs(response.data);
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

  const handleVacationSubmit = async () => {
    console.log(vacationRequest)
    const request = {
        Hours:vacationRequest.Hours,
        StartDate:vacationRequest.StartDate.format(`YYYY-MM-DDTHH:mm:00`) ,
        EndDate:vacationRequest.EndDate.format(`YYYY-MM-DDTHH:mm:00`) ,
        Type:vacationRequest.Type,
        Reason:vacationRequest.Reason,
        StaffId:vacationRequest.StaffId
    }
    
    if (vacationRequest.StaffId === 0) {
      handleErrOpen();
      setErrMsg('尚未選擇員工');
      return;
  } 
    if (endDate.isBefore(startDate)) {
        handleErrOpen();
        setErrMsg('起始時間不能大於終止時間');
        return;
    } 

    if (durationInMinutes < 60) {       
      handleErrOpen();
      setErrMsg('請假時數至少1小時');
      return;
    }    
    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/vacation`, request, config);
        if (response.status === 200) {
          handleOkOpen();
          fetchData();
        }
        handleVacationClose();
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
  const handleVacationInputChange = (value, fieldName) => {   
    if (fieldName === 'StartDate') {
        setVacationRequest((prevRequest) => ({
          ...prevRequest,
          StartDate: value // directly use the value if it's a dayjs object
        }));
    }else if(fieldName === 'EndDate') {
        setVacationRequest((prevRequest) => ({
            ...prevRequest,
            EndDate: value // directly use the value if it's a dayjs object
          }));
    }else {
        setVacationRequest((prevRequest) => ({
            ...prevRequest,
            [fieldName]: value.target ? value.target.value : value, 
        }));  
    }               
};

    useEffect(() => {
      fetchData();
      fetchStaffsData();
    }, []); 

    useEffect(() => {
      setVacationRequest({
          Hours:0,
          StartDate:dayjs().millisecond(0),
          EndDate:dayjs().millisecond(0),
          Type:0,
          Reason:'',
          StaffId:0
      })
  }, [hourModel]);

  useEffect(() => {
      if(endDate.isBefore(startDate)) {
          setVacationRequest((prevRequest) => ({
              ...prevRequest,
              Hours: 0, 
          })); 
      }
      if(!endDate.isBefore(startDate)) {
          if(hourModel) {
              if(durationInMinutes < 60) {
                  setVacationRequest((prevRequest) => ({
                      ...prevRequest,
                      Hours: 0, 
                  })); 
              }
              if(durationInMinutes % 60 === 0 && durationInMinutes > 0) {
                  setVacationRequest((prevRequest) => ({
                      ...prevRequest,
                      Hours: (durationInMinutes/60), 
                  })); 
              }
              if(durationInMinutes % 60 !== 0 && durationInMinutes > 60) {
                  setVacationRequest((prevRequest) => ({
                      ...prevRequest,
                      Hours: Math.ceil(durationInMinutes/60), 
                  })); 
              }
          }   
          if(!hourModel) {
              if(durationInDays === 0) {
                  setVacationRequest((prevRequest) => ({
                      ...prevRequest,
                      Hours: 8, 
                  })); 
              }
  
              if(durationInDays !== 0) {
                  setVacationRequest((prevRequest) => ({
                      ...prevRequest,
                      Hours: (durationInDays*8+8), 
                  })); 
              }
          }
      }       
  }, [vacationRequest.StartDate, vacationRequest.EndDate]);

    const handleVerify = async (isPass) => {     
        const request = {
          VacationId : selectedStaff.id,
          IsPass:isPass
        }
        try {
          const response = await axios.patch(`${appsetting.apiUrl}/admin/vacation`, request ,config);
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
                    請假列表
                </Typography>
            </Grid>
            <Grid item xs={2} style={{marginLeft:'2%'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateField']}>
                  <DemoItem label="搜尋起始日">
                    <DateField value={dayjs(timePeriod.start)} format="YYYY-MM-DD"           
                    onChange={(e) => {
                    const newDate = e.format('YYYY-MM-DD');
                    console.log(newDate) // 取得新的日期值
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
            <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',paddingTop:'4%' }}>
              <Button variant="contained" endIcon={<SearchIcon />} onClick={fetchData}>
                  Search
              </Button>
            </Grid>
            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',paddingTop:'4%' }}>
              <Button variant="contained" endIcon={<PostAddIcon />} onClick={handleVacationClickOpen}>
                  Add Vacation
              </Button>
            </Grid>
            <Grid item xs={12}>      
                <VacationSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>
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
        <DialogTitle>審核請假</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
            {selectedStaff !== null ? (
              <>
                是否通過員工: {selectedStaff.StaffName} 申請的{selectedStaff.VacationTypeName}呢?
                <br />
                起始日為: {selectedStaff.ActualStartDate}
                <br />
                截止日為: {selectedStaff.ActualEndDate}
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


      <Dialog open={vacationOpen} onClose={handleVacationClose}>
                <DialogTitle>休假申請</DialogTitle>
                <DialogContent>
                    <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">申請模式</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={hourModel}
                            onChange={()=>setHourModel(!hourModel)}
                        >
                            <FormControlLabel value='true' control={<Radio />} label='小時' />
                            <FormControlLabel value='false' control={<Radio />} label='天數'/>
                        </RadioGroup>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {hourModel === true ?
                        <DemoContainer components={['MobileDatePicker']}>
                            <MobileDateTimePicker 
                                label='起始日'
                                value={vacationRequest.StartDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'StartDate');
                                }}
                                format="YYYY-MM-DD HH:mm" // 指定日期格式为 YYYY-MM-DD
                            />
                            <MobileDateTimePicker 
                                label='截止日'
                                value={vacationRequest.EndDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'EndDate');
                                }}
                                format="YYYY-MM-DD HH:mm" // 指定日期格式为 YYYY-MM-DD
                            />
                        </DemoContainer>
                        :                         
                        <DemoContainer components={['MobileDatePicker']}>
                            <MobileDatePicker 
                                label='起始日'
                                value={vacationRequest.StartDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'StartDate');
                                }}
                                format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                            />
                            <MobileDatePicker 
                                label='截止日'
                                value={vacationRequest.EndDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'EndDate');
                                }}
                                format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                            />
                        </DemoContainer>
                    }
                      
                    </LocalizationProvider>
                    <TextField
                        id="outlined-multiline-static"
                        label='時數'
                        style={{marginTop:'5%',width:'30%',marginRight:'10px'}}
                        value={vacationRequest.Hours}
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <FormControl required style={{width:'30%',marginTop:'5%',marginRight:'10px'}} size="small">
                        <InputLabel id="demo-simple-select-required-label">休假員工</InputLabel>
                        <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={vacationRequest.StaffId}
                        label="休假員工"
                        onChange={(e) => handleVacationInputChange(e.target.value, 'StaffId')}
                        >
                          <MenuItem key={0} value={0}>
                          尚未選擇
                          </MenuItem>
                          {
                            staffs.map((staff) => (
                              <MenuItem key={staff.id} value={staff.id}>
                                {staff.StaffName}
                              </MenuItem>
                            ))
                          }
                        </Select>
                    </FormControl>               
                    <FormControl required style={{width:'30%',marginTop:'5%',marginRight:'10px'}} size="small">
                        <InputLabel id="demo-simple-select-required-label">休假類別</InputLabel>
                        <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={vacationRequest.Type}
                        label="休假類別"
                        onChange={(e) => handleVacationInputChange(e.target.value, 'Type')}
                        >
                        <MenuItem value={0}>
                        特休
                        </MenuItem>
                        <MenuItem value={1}>
                        病假
                        </MenuItem>
                        <MenuItem value={2}>
                        事假
                        </MenuItem>
                        <MenuItem value={3}>
                        生育假
                        </MenuItem>
                        <MenuItem value={4}>
                        喪假
                        </MenuItem>
                        <MenuItem value={5}>
                        婚假
                        </MenuItem>
                        <MenuItem value={6}>
                        公假
                        </MenuItem>
                        <MenuItem value={7}>
                        工傷病假
                        </MenuItem>
                        <MenuItem value={8}>
                        生理假
                        </MenuItem>
                        <MenuItem value={9}>
                        育嬰留職停薪假
                        </MenuItem>
                        <MenuItem value={10}>
                        安胎假
                        </MenuItem>
                        <MenuItem value={11}>
                        產檢假
                        </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="outlined-multiline-static"
                        label='請假原因'
                        multiline
                        rows={2}
                        style={{marginTop:'5%',width:'100%'}}
                        value={vacationRequest.Reason}
                        onChange={(e) => handleVacationInputChange(e.target.value, 'Reason')}
                        />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleVacationClose}>取消</Button>
                <Button onClick={handleVacationSubmit}>申請</Button>
                </DialogActions>
            </Dialog>
            <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
            <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
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
    