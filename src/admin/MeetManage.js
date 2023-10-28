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
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ErrorAlert from '../errorView/ErrorAlert';
import FinishedAlert from '../finishView/FinishedAlert';
import appsetting from '../Appsetting';

const eventStyles = {
    0: { backgroundColor: "#466CA6", color: "white" },
    1: { backgroundColor: "green", color: "white" },
    2: { backgroundColor: "red", color: "white" },
    3: { backgroundColor: "orange", color: "white" },
    4: { backgroundColor: "#BE77FF", color: "white" },
};


export default function MeetManage () {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    moment.locale('zh-cn');
    const localizer = momentLocalizer(moment);

    const [meetAddOpen,setMeetAddOpen] = useState(false)
    const [staffs,setStaffs] = useState([]);
    const [departments,setDepartments] = useState([]);
    const [events,setEvents] = useState([]);
    const [selectedEvent,setSelectEvent] = useState(null);

    const [eventRequest, setEventRequest] = useState({
        Title:'',
        LevelStatus:4,
        MeetType:1,
        DepartmentId:0,
        StaffId:0,
        EventStartDate: dayjs().millisecond(0),
        StartTime: dayjs().millisecond(0), 
        EndTime: dayjs().millisecond(0), 
        Detail:''
    })
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
    fetchStaffsData();
    fetchEventData();
    fetchDepartmentData();
  }, []); 

  const fetchStaffsData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/staffs`, config);
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

const fetchDepartmentData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/departments`,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setDepartments(response.data);
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

const handleDeleteMeet = async (id) => {      
        try {
            const response = await axios.delete(`${appsetting.apiUrl}/admin/meet?id=${id}`,config);
            if (response.status === 200) {
                const transformedEvents = response.data.map(apiEvent => ({
                    title: apiEvent.Title,
                    start: moment(apiEvent.Start).toDate(),
                    end: moment(apiEvent.End).toDate(),
                    allDay: apiEvent.AllDay,
                    detail:apiEvent.Detail,
                    level:apiEvent.LevelStatus,
                    staffId:apiEvent.StaffId,
                    staffName:apiEvent.StaffName
                }));
                setEvents(transformedEvents);
                setSelectEvent(null);
                handleOkOpen();
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

const fetchEventData = async () => {
    try {
        const response = await axios.get(`${appsetting.apiUrl}/admin/meetdetails`, config);
        if(response.status === 200) {
            const transformedEvents = response.data.map(apiEvent => ({
                id:apiEvent.id,
                title: apiEvent.Title,
                start: moment(apiEvent.Start).toDate(),
                end: moment(apiEvent.End).toDate(),
                allDay: apiEvent.AllDay,
                detail:apiEvent.Detail,
                level:apiEvent.LevelStatus,
                staffId:apiEvent.StaffId,
                staffName:apiEvent.StaffName,
                meetId:apiEvent.MeetId
            }));
            setEvents(transformedEvents);
        }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      if (error.response) {         
        console.error('Server Response', error.response);
        const serverMessage = error.response.data;

        handleErrOpen();
        setErrMsg(serverMessage);
      }
    }
}; 

const handleEventInputChange = (value, fieldName) => {   
    console.log(value);
    console.log(fieldName);
    if (fieldName === 'EventStartDate') {
        setEventRequest((prevRequest) => ({
          ...prevRequest,
          EventStartDate: value // directly use the value if it's a dayjs object
        }));
    }else if(fieldName === 'MeetType') {
        setEventRequest((prevRequest) => ({
            ...prevRequest,
            MeetType: parseInt(value, 10) // Convert value to an integer
          }));
    }else if(fieldName === 'StartTime') {
        setEventRequest((prevRequest) => ({
            ...prevRequest,
            StartTime: value // directly use the value if it's a dayjs object
          }));
    }else if(fieldName === 'EndTime') {
        setEventRequest((prevRequest) => ({
            ...prevRequest,
            EndTime: value // directly use the value if it's a dayjs object
          }));
    }else {
        setEventRequest((prevRequest) => ({
            ...prevRequest,
            [fieldName]: value.target ? value.target.value : value, 
        }));  
    }               
};

const handleMeetSubmit = async () => {
    const request = {
        StaffId:eventRequest.StaffId,
        MeetType:eventRequest.MeetType,
        DepartmentId:eventRequest.DepartmentId,
        Title:eventRequest.Title,
        LevelStatus:eventRequest.LevelStatus,
        EventStartDate:eventRequest.EventStartDate.format(`YYYY-MM-DDTHH:mm:00`) ,
        StartTime:eventRequest.StartTime.format(`HH:mm:00`) ,
        EndTime:eventRequest.EndTime.format(`HH:mm:00`) ,
        Detail:eventRequest.Detail
    }

    if(eventRequest.StaffId === 0 && eventRequest.MeetType === 3) {
        handleErrOpen();
        setErrMsg('尚未選擇員工');
        return;
    }

    if(eventRequest.DepartmentId === 0 && eventRequest.MeetType === 2) {
        handleErrOpen();
        setErrMsg('尚未選擇部門');
        return;
    }

    if(eventRequest.Title.trim() === "") {
        handleErrOpen();
        setErrMsg('標題不得為空');
        return;
    }

    if (eventRequest.EndTime.isBefore(eventRequest.StartTime)) {
        handleErrOpen();
        setErrMsg('起始時間不能大於終止時間');
        return;
    } 

    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/meet`, request, config);
        if (response.status === 200) {
        handleOkOpen();
        fetchEventData();
        }
        setMeetAddOpen(false);
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


  const CustomToolbar = (toolbarProps) => {          
    const currentMonth = toolbarProps.date.getMonth()+1;
    const currentYear = toolbarProps.date.getFullYear(); // 获取年份
    const currentDay = toolbarProps.date.getDate(); // 获取日（1-31）
    return (
    <Grid container spacing={2} style={{marginBottom:'5%',marginTop:'2%'}}>
        <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>
            <Typography variant="h3" gutterBottom>
                會議管理列表
            </Typography>
        </Grid>
        <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>
            <Typography variant="h6" gutterBottom>
                {`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`}   
            </Typography>
        </Grid>
        <Grid item xs={3}/>
        <Grid item xs={3}>
            <Button variant="outlined" onClick={() => toolbarProps.onView('day')}>
                Day
            </Button>
        </Grid>
        <Grid item xs={3}>
            <Button variant="outlined" onClick={() => toolbarProps.onView('month')}>
                Month
            </Button>
        </Grid>
        <Grid item xs={3}>
            <Button variant="outlined" onClick={() => toolbarProps.onView('week')}>
                Week
            </Button>
        </Grid>
        <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>
            <IconButton color="primary" onClick={() => toolbarProps.onNavigate('PREV')}>
                <NavigateBeforeIcon/>
            </IconButton>
        </Grid>
        <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>
            <IconButton color="primary"  onClick={() => setMeetAddOpen(true)}>
                <AddIcon />
            </IconButton>
        </Grid>
        <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>
            <Button variant="text" onClick={() =>  toolbarProps.onNavigate('TODAY')}>
                Today
            </Button>
        </Grid>
        <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>
            <IconButton color="primary" size="small" onClick={() => toolbarProps.onNavigate('NEXT')}>
                <NavigateNextIcon/>
            </IconButton>
        </Grid>


    </Grid>
    );
};

  return (
    <>
    <Box style={{ height: '1500px',width:'100%',marginBottom:'5%' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="zh-CN" // 設置為中文
        onSelectEvent={(event) => {
            setSelectEvent(event)
        }}
        components={{
            toolbar: (toolbarProps) => <CustomToolbar {...toolbarProps} />, // 使用自定義工具欄
        }}
        eventPropGetter={(event, start, end, isSelected) => {
            const style = eventStyles[event.level] || {}; // fallback to empty object if level is not defined
            return { style };
        }}
        views={["month", "week", "day", "agenda"]}
        firstDay={1} // 週一為第一天 
      />
    <List>
        {selectedEvent !== null?
            <ListItem>
                <ListItemText 
                    primary={`會議主題: ${selectedEvent.title}`}
                    secondary={`內容: ${selectedEvent.detail} 
                會議期間: ${moment(selectedEvent.start).format('HH:mm')} 到 ${moment(selectedEvent.end).format('HH:mm')} 
                總計: ${moment(selectedEvent.end).diff(moment(selectedEvent.start), 'hours')}小時${moment(selectedEvent.end).diff(moment(selectedEvent.start), 'minutes') % 60}分鐘`}
/>

                <Button variant="text" startIcon={<DeleteIcon />} style={{color:'red'}} onClick={()=>handleDeleteMeet(selectedEvent.id)}/>
            </ListItem>
            :
            null
        }
        <Divider />
    </List>
    </Box>
    <Dialog open={meetAddOpen} onClose={()=>setMeetAddOpen(false)}>
            <DialogTitle>會議新增</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="會議標題"
                        fullWidth
                        value={eventRequest.Title}
                        onChange={(e) => handleEventInputChange(e.target.value, 'Title')}
                        variant="outlined"
                        style={{ flex: 1 }} // 拉伸以占据可用空间
                    />
                </div>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={eventRequest.MeetType}
                        onChange={(e) => handleEventInputChange(e.target.value, 'MeetType')}
                    >
                        <FormControlLabel value={1} control={<Radio />} label="全體會議" />
                        <FormControlLabel value={2} control={<Radio />} label="部門會議" />
                        <FormControlLabel value={3} control={<Radio />} label="個人面談" />
                    </RadioGroup>
                </FormControl>
                {
                    eventRequest.MeetType === 3 && (
                        <>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                員工姓名
                            </InputLabel>  
                                <Select
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                value={eventRequest.StaffId }
                                label=""
                                size="small"
                                style={{width:'100%',marginBottom:'3%'}}
                                onChange={(e) => handleEventInputChange(e, 'StaffId')}
                                >
                                    <MenuItem key={0} value={0}>
                                        尚未選擇
                                    </MenuItem>
                                {
                                    staffs.map((staff) => (
                                    <MenuItem key={staff.id} value={staff.id}>
                                        {staff.StaffName}--{staff.Department}--{staff.LevelPosition}
                                    </MenuItem>
                                    ))
                                }
                            </Select>
                        </>
                    )
                }

                {
                    // 根据 MEETTYPE 来决定是否渲染部門名稱下拉式
                    eventRequest.MeetType === 2 && (
                        <>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                部門名稱
                            </InputLabel>  
                                <Select
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                value={eventRequest.DepartmentId }
                                label=""
                                size="small"
                                style={{width:'100%',marginBottom:'3%'}}
                                onChange={(e) => handleEventInputChange(e, 'DepartmentId')}
                                >
                                    <MenuItem key={0} value={0}>
                                        尚未選擇
                                    </MenuItem>
                                {
                                    departments.map((department) => (
                                    <MenuItem key={department.id} value={department.id}>
                                        {department.DepartmentName}
                                    </MenuItem>
                                    ))
                                }
                            </Select>
                        </>
                    )
                }

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDatePicker']}>
                        <MobileDatePicker 
                            label="起始日"
                            value={eventRequest.EventStartDate}
                            onChange={(e) => {
                                const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                handleEventInputChange(formattedDate, 'EventStartDate');
                            }}
                            format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                        />
                    </DemoContainer>
                    <DemoContainer components={['TimePicker', 'TimePicker']}>
                        <div style={{ display: 'flex', justifyContent: 'space-between',marginTop:'2%' }}>
                            <TimePicker
                                label="起始時間"
                                value={eventRequest.StartTime}
                                style={{ width: '45%' }}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleEventInputChange(formattedDate, 'StartTime');
                                }}
                                format="HH:mm:00" 
                            />
                            ~
                            <TimePicker
                                label="截止時間"
                                value={eventRequest.EndTime}
                                style={{ width: '45%' }}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleEventInputChange(formattedDate, 'EndTime');
                                }}
                                format="HH:mm:00" 
                            />
                        </div>
                    </DemoContainer>
                </LocalizationProvider>
                <TextField
                id="outlined-multiline-static"
                label="會議內容"
                multiline
                rows={2}
                style={{marginTop:'5%',width:'100%'}}
                value={eventRequest.Detail}
                onChange={(e) => handleEventInputChange(e.target.value, 'Detail')}
                />
            </DialogContent>
            <DialogActions>
            
            <Button onClick={()=>setMeetAddOpen(false)}>取消</Button>
            <Button onClick={handleMeetSubmit}>新增</Button>
            </DialogActions>
        </Dialog>
        <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
        <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
    </>

  );
}

