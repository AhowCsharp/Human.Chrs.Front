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
import appsetting from '../Appsetting';

const eventStyles = {
    0: { backgroundColor: "#466CA6", color: "white" },
    1: { backgroundColor: "green", color: "white" },
    2: { backgroundColor: "red", color: "white" },
    3: { backgroundColor: "orange", color: "white" },
};


export default function ParttimeWorkManage () {
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

    const [parttimeAddOpen,setParttimeAddOpen] = useState(false)
    const [staffs,setStaffs] = useState([]);
    const [events,setEvents] = useState([]);
    const [selectedEvent,setSelectEvent] = useState(null);

    const [eventRequest, setEventRequest] = useState({
        Title:'',
        LevelStatus:3,
        StaffId:0,
        EventStartDate: dayjs().millisecond(0),
        EventEndDate: dayjs().millisecond(0),
        StartTime: dayjs().millisecond(0), 
        EndTime: dayjs().millisecond(0), 
        Detail:''
    })

useEffect(() => {
    fetchStaffsData();
    fetchEventData();
  }, []); 

  const fetchStaffsData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/staffs`, config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        const filteredStaffs = response.data.filter(staff => staff.EmploymentTypeId === 2);
        setStaffs(filteredStaffs);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

const handleDeleteEvent = async (id) => {      
        try {
            const response = await axios.delete(`${appsetting.apiUrl}/staff/event?id=${id}`,config);
            if (response.status === 200) {
                const transformedEvents = response.data.map(apiEvent => ({
                    title: `${apiEvent.Title}-${apiEvent.StaffName}`,
                    start: moment(apiEvent.Start).toDate(),
                    end: moment(apiEvent.End).toDate(),
                    allDay: apiEvent.AllDay,
                    detail:apiEvent.Detail,
                    level:apiEvent.LevelStatus,
                    staffId:apiEvent.StaffId,
                    staffName:apiEvent.StaffName
                }));
                setEvents(transformedEvents);
                alert('成功');
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert('失敗');
        }          
    }
const fetchEventData = async () => {
    try {
        const response = await axios.get(`${appsetting.apiUrl}/admin/eventdetails`, config);
        if(response.status === 200) {
            const transformedEvents = response.data.map(apiEvent => ({
                id:apiEvent.id,
                title: `${apiEvent.Title}-${apiEvent.StaffName}`,
                start: moment(apiEvent.Start).toDate(),
                end: moment(apiEvent.End).toDate(),
                allDay: apiEvent.AllDay,
                detail:apiEvent.Detail,
                level:apiEvent.LevelStatus,
                staffId:apiEvent.StaffId,
                staffName:apiEvent.StaffName
            }));
            setEvents(transformedEvents);
        }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
}; 

const handleEventInputChange = (value, fieldName) => {    
    if (fieldName === 'EventStartDate') {
        setEventRequest((prevRequest) => ({
          ...prevRequest,
          EventStartDate: value // directly use the value if it's a dayjs object
        }));
    }else if(fieldName === 'EventEndDate') {
        setEventRequest((prevRequest) => ({
            ...prevRequest,
            EventEndDate: value // directly use the value if it's a dayjs object
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

const handleEventSubmit = async () => {
    const request = {
        StaffId:eventRequest.StaffId,
        Title:eventRequest.Title,
        LevelStatus:eventRequest.LevelStatus,
        EventStartDate:eventRequest.EventStartDate.format(`YYYY-MM-DDTHH:mm:00`) ,
        EventEndDate:eventRequest.EventEndDate.format(`YYYY-MM-DDTHH:mm:00`) ,
        StartTime:eventRequest.StartTime.format(`HH:mm:00`) ,
        EndTime:eventRequest.EndTime.format(`HH:mm:00`) ,
        Detail:eventRequest.Detail
    }

    if(eventRequest.StaffId === 0) {
        alert('尚未選擇員工');
        return;
    }

    if(eventRequest.Title.trim() === "") {
        alert('標題不得為空');
        return;
    }

    if (eventRequest.EventEndDate.isBefore(eventRequest.EventStartDate)) {
        alert('起始時間不能大於終止時間');
        return;
    } 

    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/event`, request, config);
        if (response.status === 200) {
        alert('新增成功');
        fetchEventData();
        }
        setParttimeAddOpen(false);
    } catch (error) {
        console.error("Error logging in:", error);
        alert('發生錯誤');
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
                員工排班列表
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
            <IconButton color="primary"  onClick={() => setParttimeAddOpen(true)}>
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
                    primary={`${selectedEvent.title}`}
                    secondary={`上班地址: ${selectedEvent.detail} 員工: ${selectedEvent.staffName} 
                工作時間: ${moment(selectedEvent.start).format('HH:mm')} 到 ${moment(selectedEvent.end).format('HH:mm')} 
                總計: ${moment(selectedEvent.end).diff(moment(selectedEvent.start), 'hours')}小時${moment(selectedEvent.end).diff(moment(selectedEvent.start), 'minutes') % 60}分鐘`}
/>

                <Button variant="text" startIcon={<DeleteIcon />} style={{color:'red'}} onClick={()=>handleDeleteEvent(selectedEvent.id)}/>
            </ListItem>
            :
            null
        }
        <Divider />
    </List>
    </Box>
    <Dialog open={parttimeAddOpen} onClose={()=>setParttimeAddOpen(false)}>
            <DialogTitle>行事曆新增</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="事件標題"
                        fullWidth
                        value={eventRequest.Title}
                        onChange={(e) => handleEventInputChange(e.target.value, 'Title')}
                        variant="outlined"
                        style={{ flex: 1 }} // 拉伸以占据可用空间
                    />
                    <FormControl sx={{ m: 1, minWidth: 60 }} size="small" style={{ marginLeft: '20px' }}>
                        <InputLabel id="demo-select-small-label">緊急性</InputLabel>
                        <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={eventRequest.LevelStatus}
                        onChange={(e) => handleEventInputChange(e.target.value, 'LevelStatus')}
                        >
                        <MenuItem value={0}>日常</MenuItem>
                        <MenuItem value={1}>普通</MenuItem>
                        <MenuItem value={2}>緊急</MenuItem>
                        <MenuItem value={3}>工作</MenuItem>
                        </Select>
                    </FormControl>
                </div>
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
                        <MobileDatePicker 
                            label="截止日"
                            value={eventRequest.EventEndDate}
                            onChange={(e) => {
                                const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                handleEventInputChange(formattedDate, 'EventEndDate');
                            }}
                            format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                        />
                    </DemoContainer>
                    <DemoContainer components={['TimePicker', 'TimePicker']}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                label="請輸入工作地止"
                multiline
                rows={2}
                style={{marginTop:'5%',width:'100%'}}
                value={eventRequest.Detail}
                onChange={(e) => handleEventInputChange(e.target.value, 'Detail')}
                />
            </DialogContent>
            <DialogActions>
            
            <Button onClick={()=>setParttimeAddOpen(false)}>取消</Button>
            <Button onClick={handleEventSubmit}>新增</Button>
            </DialogActions>
        </Dialog>
    
    </>

  );
}

