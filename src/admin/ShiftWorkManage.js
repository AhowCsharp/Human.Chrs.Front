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
import Tooltip from '@mui/material/Tooltip';
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
import Chip from '@mui/material/Chip';
import TagFacesIcon from '@mui/icons-material/TagFaces';
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

const ListChip = styled('li')({
  margin: '1px',
});

const StyledChip = styled(Chip)({
    backgroundColor: '#4a90e2', // 例如，设置为蓝色
    color: 'white',
    '&:hover, &:focus': {
      backgroundColor: '#357abd', // 鼠标悬停或聚焦时的颜色
    },
});


export default function ShiftWorkManage () {
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

    const [shiftWorkAddOpen,setShiftWorkAddOpen] = useState(false)
    const [workClassOpen,setWorkClassAddOpen] = useState(false)
    const [staffs,setStaffs] = useState([]);
    const [chooseWorkClass,setChooseWorkClass] = useState(0);
    const [events,setEvents] = useState([]);
    const [shiftworks,setShiftworks]= useState([]);
    const [selectedEvent,setSelectEvent] = useState(null);
    const [selectedDate,setSelectedDate] = useState(null);
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

    const [workClassRequest, setWorkClassRequest] = useState({
        ClassName:'早班',
        StartTime:'08:00:00',
        EndTime:'17:00:00',
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
    fetchShiftWorksData();
  }, []); 

  useEffect(() => {
    if(chooseWorkClass !== 0) {
        const filteredworkClass = shiftworks.find(workclass => workclass.id === chooseWorkClass);
        setEventRequest({
            ...eventRequest,
            StartTime:filteredworkClass.StartTime,
            EndTime:filteredworkClass.EndTime,
            Title:`${formatDateToYYYYMMDD(selectedDate.start)} : ${filteredworkClass.ClassName}`
        })
    }
  }, [chooseWorkClass,selectedDate]); 

  const fetchStaffsData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/staffs`, config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        const filteredStaffs = response.data.filter(staff => staff.EmploymentTypeId === 4);
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
    
  const fetchShiftWorksData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/admin/shiftwork`, config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setShiftworks(response.data)
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
        const response = await axios.get(`${appsetting.apiUrl}/admin/workeventdetails`, config);
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
      if (error.response) {         
        console.error('Server Response', error.response);
        const serverMessage = error.response.data;

        handleErrOpen();
        setErrMsg(serverMessage);
      }
    }
}; 

const handleEventInputChange = (value, fieldName) => {    
    setEventRequest((prevRequest) => ({
        ...prevRequest,
        [fieldName]: value.target ? value.target.value : value, 
    }));                  
};

const handleWorkClassInputChange = (value, fieldName) => {    
    setWorkClassRequest((prevRequest) => ({
        ...prevRequest,
        [fieldName]: value.target ? value.target.value : value, 
    }));                  
};

const handleEventSubmit = async () => {
    const request = {
        StaffId:eventRequest.StaffId,
        Title:eventRequest.Title,
        LevelStatus:eventRequest.LevelStatus,
        EventStartDate:eventRequest.EventStartDate.format(`YYYY-MM-DDT00:00:00`) ,
        EventEndDate:eventRequest.EventEndDate.format(`YYYY-MM-DDT00:00:00`) ,
        StartTime:eventRequest.StartTime,
        EndTime:eventRequest.EndTime,
        Detail:eventRequest.Detail
    }
    console.log(request)
    if(eventRequest.StaffId === 0) {
        handleErrOpen();
        setErrMsg('尚未選擇員工');
        return;
    }

    if(chooseWorkClass === 0) {
        handleErrOpen();
        setErrMsg('尚未選擇班別');
        return;
    }

    if(eventRequest.Title.trim() === "") {
        handleErrOpen();
        setErrMsg('標題不得為空');
        return;
    }

    if (eventRequest.EventEndDate.isBefore(eventRequest.EventStartDate)) {
        handleErrOpen();
        setErrMsg('起始時間不得大於終止時間');
        return;
    } 

    try {
        const response = await axios.post(`${appsetting.apiUrl}/admin/shiftworkevent`, request, config);
        if (response.status === 200) {
        handleOkOpen();
        fetchEventData();
        }
        setShiftWorkAddOpen(false);
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

const handleWorkClassSubmit = async () => {
    try {
        // 验证workClassRequest.StartTime是否符合"HH:MM:SS"的格式
        const isValidTimeFormat = (time) => {
            const timeRegExp = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            return timeRegExp.test(time);
        };

        if (!workClassRequest.StartTime || !isValidTimeFormat(workClassRequest.StartTime)) {
            handleErrOpen();
            setErrMsg('時間格式無效。請確保時間是在 HH:MM:SS 的格式');
            return;
        }
        if (!workClassRequest.EndTime || !isValidTimeFormat(workClassRequest.EndTime)) {
            handleErrOpen();
            setErrMsg('時間格式無效。請確保時間是在 HH:MM:SS 的格式');
            return;
        }

        // 如果时间格式有效，则继续进行API调用
        const response = await axios.post(`${appsetting.apiUrl}/admin/shiftwork`, workClassRequest, config);
        if (response.status === 200) {
            handleOkOpen();
            fetchShiftWorksData();
        }
        setWorkClassAddOpen(false);
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


const handleDelete = async (data) => {
    try {
        // 调用后端API进行删除
        const response = await axios.delete(`${appsetting.apiUrl}/admin/shiftwork`, {
            ...config,
            params: { id: data.id }
        }); 
        if (response.status === 200) {
            fetchShiftWorksData();
        } else {
            // 处理错误情况
            console.error('Error occurred:', response);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        if (error.response) {         
            console.error('Server Response', error.response);
            const serverMessage = error.response.data;
    
            handleErrOpen();
            setErrMsg(serverMessage);
          }
    }
};

const handleSelect = (slotInfo) => {  
    setSelectedDate(slotInfo);
    setShiftWorkAddOpen(true);
};


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
        <Grid item xs={1} style={{display:'flex',justifyContent:'center', alignItems: 'center'}}>
            <Typography variant="h6" gutterBottom>
                目前班別:
            </Typography>
        </Grid>
        <Grid item xs={11} style={{display:'flex'}}>
            <Paper
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
            backgroundColor: 'transparent', // 设置Paper背景为透明
            boxShadow: 'none', // 可选：移除Paper的阴影，使其更加透明化
            }}
            component="ul"
        >
            <li>
                <IconButton color="primary">
                    <AddIcon onClick={()=>setWorkClassAddOpen(true)}/>
                </IconButton>
            </li>
            {shiftworks.length === 0 ? (
            <li style={{ lineHeight: '50px' }}>目前並無設置班别</li>
                ) : (
                shiftworks.map((data) => (
                    <>
                        <ListChip key={data.id}>
                        <Tooltip 
                            title={`${data.StartTime}~${data.EndTime}` || "No additional information"} // 你想显示的信息
                            placement="top" // 工具提示的位置，可选值有 "left", "right", "bottom", "top-start", 等等.
                        >
                            <StyledChip
                                label={data.ClassName}
                                onDelete={() => handleDelete(data)}
                            />
                        </Tooltip>
                        </ListChip>
                    </>
                ))
            )}
            </Paper>
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
        <Grid item xs={4} style={{display:'flex',justifyContent:'center'}}>
            <IconButton color="primary" onClick={() => toolbarProps.onNavigate('PREV')}>
                <NavigateBeforeIcon/>
            </IconButton>
        </Grid>
        <Grid item xs={4} style={{display:'flex',justifyContent:'center'}}>
            <Button variant="text" onClick={() =>  toolbarProps.onNavigate('TODAY')}>
                Today
            </Button>
        </Grid>
        <Grid item xs={4} style={{display:'flex',justifyContent:'center'}}>
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
        selectable
        onSelectSlot={handleSelect}
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
    <Dialog open={shiftWorkAddOpen} onClose={()=>setShiftWorkAddOpen(false)}>
            <DialogTitle>{selectedDate!== null? formatDateToYYYYMMDD(selectedDate.start):''}排班</DialogTitle>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '20px' }}>
                        <InputLabel shrink htmlFor="bootstrap-input">
                            員工姓名
                        </InputLabel>  
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={eventRequest.StaffId}
                            label=""
                            size="small"
                            style={{ marginBottom:'3%' }}
                            onChange={(e) => handleEventInputChange(e, 'StaffId')}
                        >
                            <MenuItem key={0} value={0}>
                                尚未選擇
                            </MenuItem>
                            {staffs.map((staff) => (
                                <MenuItem key={staff.id} value={staff.id}>
                                    {staff.StaffName}--{staff.Department}--{staff.LevelPosition}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <InputLabel shrink htmlFor="bootstrap-input">
                            班別
                        </InputLabel>  
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={chooseWorkClass}
                            label=""
                            size="small"
                            style={{ marginBottom:'3%' }}
                            onChange={(e) => setChooseWorkClass(e.target.value)} // 这里应该是一个不同的处理函数或参数
                        >
                            <MenuItem key={0} value={0}>
                                尚未選擇
                            </MenuItem>
                            {shiftworks.map((workclass) => (
                                <MenuItem key={workclass.id} value={workclass.id}>
                                    {workclass.ClassName}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <TextField
                id="outlined-multiline-static"
                label="請輸入工作地址"
                multiline
                rows={2}
                style={{marginTop:'5%',width:'100%'}}
                value={eventRequest.Detail}
                onChange={(e) => handleEventInputChange(e.target.value, 'Detail')}
                />
            </DialogContent>
            <DialogActions>
            
            <Button onClick={()=>setShiftWorkAddOpen(false)}>取消</Button>
            <Button onClick={handleEventSubmit}>新增</Button>
            </DialogActions>
        </Dialog>
    

        <Dialog open={workClassOpen} onClose={()=>setWorkClassAddOpen(false)} >
            <DialogTitle>班別新增</DialogTitle>
            <DialogContent style={{width:'200px'}}>
                <TextField
                id="outlined-multiline-static"
                label="班別名稱"
                style={{marginTop:'10%',width:'100%'}}
                value={workClassRequest.ClassName}
                size="small"
                onChange={(e) => handleWorkClassInputChange(e.target.value, 'ClassName')}
                />
                <TextField
                id="outlined-multiline-static"
                label="起始時間"
                style={{marginTop:'10%',width:'100%'}}
                value={workClassRequest.StartTime}
                placeholder='HH:MM:SS'
                size="small"
                onChange={(e) => handleWorkClassInputChange(e.target.value, 'StartTime')}
                />
                <TextField
                id="outlined-multiline-static"
                label="終止時間"
                style={{marginTop:'10%',width:'100%'}}
                value={workClassRequest.EndTime}
                placeholder='HH:MM:SS'
                size="small"
                onChange={(e) => handleWorkClassInputChange(e.target.value, 'EndTime')}
                />
            </DialogContent>
            <DialogActions>
            
            <Button onClick={()=>setWorkClassAddOpen(false)}>取消</Button>
            <Button onClick={handleWorkClassSubmit}>新增</Button>
            </DialogActions>
        </Dialog>
        <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
        <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
    </>

  );
}


function formatDateToYYYYMMDD(dateString) {
    // 将输入的日期字符串转换为Date对象
    const originalDate = new Date(dateString);

    // 获取年、月、日组件
    const year = originalDate.getFullYear();
    const month = originalDate.getMonth() + 1; // 月份是从0开始计数的，因此实际月份需要加1
    const day = originalDate.getDate();

    // 构建并返回格式化的日期字符串
    // 使用padStart确保月和日的字符串表示形式为两位数
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// 使用示例：



