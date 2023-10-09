import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { useState,useRef,useEffect,useCallback} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Alert, useMediaQuery } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import '../css/Calendar.css';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TodayIcon from '@mui/icons-material/Today';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Slide from '@mui/material/Slide';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {AppTasks} from '../sections/@dashboard/app';
import Map from '../googleMap/Map'
import PageDeviceError from '../pages/PageDeviceError';
import appsetting from '../Appsetting';

const eventStyles = {
    0: { backgroundColor: "#466CA6", color: "white" },
    1: { backgroundColor: "green", color: "white" },
    2: { backgroundColor: "red", color: "white" },
    3: { backgroundColor: "orange", color: "white" },
};

const views = {
    day: true,   // 顯示日視圖
    month: true, // 顯示月視圖
};
// const myEventsList = [
//     {
//       title: 'Birthday Party',
//       start: moment().toDate(),
//       end: moment().add(25, 'hours').toDate(),
//       allDay: false,
//     },
// ];
  
// console.log(myEventsList)
const gradientTextStyle = {
    backgroundImage: 'linear-gradient(to right, pink, blue)',
    WebkitBackgroundClip: 'text', /* WebKit browsers */
    backgroundClip: 'text',
    color: 'transparent', /* 隐藏文字颜色，以显示渐变背景 */
    fontWeight: 'bold',/* 使元素变为行内元素 */
    fontSize: '18px',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
};


const staffName = sessionStorage.getItem('StaffName');
let Name = ``;
if(staffName !== null) {
    Name = `您好,${staffName.slice(1, 3)}`;
}
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

export default function PersonalInfo() {
    const localizer = momentLocalizer(moment);
    const [thingAddOpen,setThingAddOpen] = useState(false)
    const [currentView, setCurrentView] = useState('month'); 
    const [event,setEvents] = useState([]);
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
        }
    };
    const [viewInfo, setViewInfo] = useState({
        IsOverLocation:true,
        IsCheckIn:false,
        IsCheckOut:false,
        CheckInRange: "08:00:00~09:00:00",
        CheckOutRange: "17:00:00~18:00:00",
        AfternoonRange: "",
        VacationLogDTOs: [],
        CompanyName:'',
        ChekinTime: null,
        ChekOutTime:null,
        CheckInStartHour:0,
        CheckInStartMinute:0,
        CheckInEndHour:0,
        CheckInEndMinute:0,
        CheckOutStartHour:0,
        CheckOutStartMinute:0,
        CheckOutEndHour:0,
        CheckOutEndMinute:0,
    })
    const [selectedEvent,setSelectEvent] = useState(null);
    const [checkOpen, setCheckOpen] = useState(false);
    const [overTimeOpen, setOverTimeOpen] = useState(false);
    const [vacationOpen, setVacationOpen] = useState(false);
    const [amendCheckOpen, setAmendCheckOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [memo, setMemo] = useState('');
    const [center, setCenter] = useState({lat: 41.3851, lng: 2.1734 });
    const [hourModel,setHourModel] = useState(true);
    
    const navigate = useNavigate();

    const handleSalaryListClick = () => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/staff/salarylist`);
    };

    const handleOverTimeListClick = () => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/staff/overtimelist`);
    };

    const handleCheckListClick = () => {
        // 在版本6中使用 navigate 函數進行導航
        navigate(`/staff/checklist`);
    };

    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [overTimeRequest, setOverTimeRequest] = useState({
        Hours:0,
        ChooseDate:dayjs(formattedDate),
        Reason:''
    })
    const [vacationRequest, setVacationRequest] = useState({
        Hours:0,
        StartDate:dayjs().millisecond(0),
        EndDate:dayjs().millisecond(0),
        Type:0,
        Reason:''
    })

    const [amendCheckRequest, setAmendCheckRequest] = useState({
        CheckDate:dayjs().millisecond(0),
        CheckTime:dayjs().millisecond(0),
        CheckType:0,
        Reason:''
    })

    const [eventRequest, setEventRequest] = useState({
        Title:'',
        LevelStatus:0,
        EventStartDate: dayjs().millisecond(0),
        EventEndDate: dayjs().millisecond(0),
        StartTime: dayjs().millisecond(0), 
        EndTime: dayjs().millisecond(0), 
        Detail:''
    })
    const [currentTime, setCurrentTime] = useState(new Date());
    const workStartTime = new Date();
    workStartTime.setHours(viewInfo.CheckInStartHour, viewInfo.CheckInStartMinute, 0); // 设置上班时间为上午八点整
    const punchInDeadline = new Date();
    punchInDeadline.setHours(viewInfo.CheckInEndHour, viewInfo.CheckInEndMinute, 0);// 设置打卡截止时间为上午9点整

    const CheckInTime = new Date(viewInfo.ChekinTime);
    const timeDiff = workStartTime - currentTime;
    const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    const startDate = vacationRequest.StartDate.clone().millisecond(0).second(0);
    const endDate = vacationRequest.EndDate.clone().millisecond(0).second(0);
    const durationInMinutes = endDate.diff(startDate, 'minutes');
    const durationInDays = endDate.diff(startDate, 'days');


    let remainingTime = '';
    if(!viewInfo.IsCheckIn)  {
        if (currentTime < workStartTime) {
            remainingTime = `距離上班 ${formatTimeDiff(workStartTime - currentTime)}`;
        } else if (workStartTime < currentTime && currentTime < punchInDeadline) {
            remainingTime = `距離打卡截止 ${formatTimeDiff(punchInDeadline - currentTime)}`;
        } else {
            const timeDiff = currentTime - punchInDeadline;
            remainingTime = `已超過打卡時間 ${formatTimeDiff(timeDiff)}`;
        }
    }

    if(viewInfo.IsCheckIn && !viewInfo.IsCheckOut)  {
        remainingTime = `已經努力了 ${formatTimeDiff(currentTime-CheckInTime)}`;      
    }

    if(viewInfo.IsCheckIn && viewInfo.IsCheckOut)  {
        remainingTime = `請好好休息 別打開這軟體了`;
    }

    useEffect(() => {

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
        const timerId = setInterval(updateCurrentTime, 1000);

        return () => {
            clearInterval(timerId);
        };      
    }, []);
    useEffect(() => {      
        if (calendarOpen) {
            fetchEventData();
        }
        console.log(event)
    }, [calendarOpen]);


    const fetchEventData = async () => {
        try {
            const response = await axios.get(`${appsetting.apiUrl}/staff/eventdetails`, config);
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
                    staffName:apiEvent.StaffName
                }));
                setEvents(transformedEvents);
            }
        } catch (error) {
          console.error('An error occurred while fetching data:', error);
        }
    }; 
    const fetchData = async () => {
        try {
            const response = await axios.get(`${appsetting.apiUrl}/staff/view?longitude=${center.lng}&latitude=${center.lat}`, config);
        
            if(response.status === 200) {
                setViewInfo({
                    IsOverLocation: response.data.IsOverLocation,
                    IsCheckIn: response.data.IsCheckIn,
                    IsCheckOut:response.data.IsCheckOut,
                    CheckInRange: response.data.CheckInRange,
                    CheckOutRange: response.data.CheckOutRange,
                    AfternoonRange: response.data.AfternoonRange,
                    VacationLogDTOs: response.data.VacationLogDTOs,
                    ChekinTime:response.data.ChekinTime,
                    ChekOutTime:response.data.ChekOutTime,
                    CompanyName:response.data.CompanyName,
                    CheckInStartHour:response.data.CheckInStartHour,
                    CheckInStartMinute:response.data.CheckInStartMinute,
                    CheckInEndHour:response.data.CheckInEndHour,
                    CheckInEndMinute:response.data.CheckInEndMinute,
                    CheckOutStartHour:response.data.CheckOutStartHour,
                    CheckOutStartMinute:response.data.CheckOutStartMinute,
                    CheckOutEndHour:response.data.CheckOutEndHour,
                    CheckOutEndMinute:response.data.CheckOutEndMinute,
                  });
            }
        } catch (error) {
          console.error('An error occurred while fetching data:', error);
        }
      }; 
    useEffect(() => {
        if(center.lat < 26  &&  center.lat > 20 && center.lng < 125 && center.lng > 119) {     
              fetchData();  
        }
    }, [center]);

    useEffect(() => {
        setVacationRequest({
            Hours:0,
            StartDate:dayjs().millisecond(0),
            EndDate:dayjs().millisecond(0),
            Type:0,
            Reason:''
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
                        Hours: 0, 
                    })); 
                }
    
                if(durationInDays !== 0) {
                    setVacationRequest((prevRequest) => ({
                        ...prevRequest,
                        Hours: durationInDays, 
                    })); 
                }
            }
        }       
    }, [vacationRequest.StartDate, vacationRequest.EndDate]);

    const updateCurrentTime = () => {
        setCurrentTime(new Date());
    };
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daysOfWeekChinese = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayOfWeek = daysOfWeek[currentDate.getDay()]; 
        const dayOfWeekChinese = daysOfWeekChinese[currentDate.getDay()]; 
        return `${year}-${month}-${day},  ${dayOfWeekChinese},  ${dayOfWeek}`;
    };

    function formatTimeDiff(timeDiff) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return `${hours}小時 ${minutes}分鐘 ${seconds}秒`;
    }
    const handleClickOpen = (type) => {
        switch (type) {
            case 'check':
            setCheckOpen(true);
                break;
            case 'overTime':
            setOverTimeOpen(true);
                break;
            case 'vacation':
            setVacationOpen(true);
                break;
            case 'calendar':
                setCalendarOpen(true);
                    break;
            case 'amendCheck':
                setAmendCheckOpen(true);
                    break;
          default:
        }
      };
    
    const handleClose = (type) => {
        switch (type) {
            case 'check':
                setCheckOpen(false);
              break;
            case 'overTime':
                setOverTimeRequest({
                    Hours:0,
                    ChooseDate:dayjs(formattedDate),
                    Reason:''
                })
                setOverTimeOpen(false);
              break;
            case 'vacation':
                setVacationRequest({
                    Hours:0,
                    StartDate:dayjs().millisecond(0),
                    EndDate:dayjs().millisecond(0),
                    Type:0,
                    Reason:''
                })
                setVacationOpen(false);
                break;
            case 'calendar':
                setCalendarOpen(false);
                break;
            case 'amendCheck':
                setAmendCheckOpen(false);
                    break;
            default:
          }
    };

    const handleSubmit = async () => {
        // 检查是否有地理位置权限
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            // 用户已授予地理位置权限，可以继续发出API请求
            const config = {
              headers: {
                'X-Ap-Token': appsetting.token,
                'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
                'X-Ap-UserId': sessionStorage.getItem('UserId'),
              }
            };
            const checkRequest = {
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude,
              Memo: memo
            };
            
            try {
              const response = await axios.post(`${appsetting.apiUrl}/staff/checkinout`, checkRequest, config);
              if (response.status === 200) {
                alert('打卡成功');
                fetchData();
              }
            } catch (error) {
              console.error("Error logging in:", error);
              alert('打卡失敗 發生未知錯誤');
            }
            
            handleClose('check');
          }, () => {
            // 用户拒绝了地理位置权限，您可以在这里进行相应的处理
            alert('您未允許地理位置權限，請允許以繼續操作。');
          });
        } else {
          // 浏览器不支持地理位置功能
          alert('您的瀏覽器不支持地理位置功能。');
        }
      };
      const handleOverTimeSubmit = async () => {
        const config = {
                headers: {
                'X-Ap-Token': appsetting.token,
                'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
                'X-Ap-UserId': sessionStorage.getItem('UserId'),
                }
            };     
            try {
              const response = await axios.post(`${appsetting.apiUrl}/staff/overtime`, overTimeRequest, config);
              if (response.status === 200) {
                alert('申報成功');
                fetchData();
              }
            } catch (error) {
              console.error("Error logging in:", error);
              alert('申報失敗 已重複申報');
            }          
            handleClose('overTime')
        }
        
        const handleVacationSubmit = async () => {

            const request = {
                Hours:vacationRequest.Hours,
                StartDate:vacationRequest.StartDate.format(`YYYY-MM-DDTHH:mm:00`) ,
                EndDate:vacationRequest.EndDate.format(`YYYY-MM-DDTHH:mm:00`) ,
                Type:vacationRequest.Type,
                Reason:vacationRequest.Reason
            }

            if (endDate.isBefore(startDate)) {
                alert('起始時間不能大於終止時間');
                return;
            } 
            if (endDate.isSame(startDate)) {
                alert('起始時間不能等於終止時間');
                return;
            } 

            if (durationInMinutes < 60) {               
                alert('請假時數至少1小時');
                return;
            }
            const config = {
                headers: {
                'X-Ap-Token': appsetting.token,
                'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
                'X-Ap-UserId': sessionStorage.getItem('UserId'),
                }
            };     
            try {
                const response = await axios.post(`${appsetting.apiUrl}/staff/vacation`, request, config);
                if (response.status === 200) {
                alert('申請成功');
                fetchData();
                }
                handleClose('vacation')
            } catch (error) {
                console.error("Error logging in:", error);
                alert('申請失敗 已重複申請 或是超過該假別上限');
            }                    
        }

        const handleAmendCheckSubmit = async () => {

            const request = {
                CheckDate:amendCheckRequest.CheckDate.format(`YYYY-MM-DDTHH:mm:00`),
                CheckTime:amendCheckRequest.CheckTime.format(`YYYY-MM-DDTHH:mm:00`) ,
                CheckType:amendCheckRequest.CheckType,
                Reason:amendCheckRequest.Reason
            }
            const config = {
                headers: {
                'X-Ap-Token': appsetting.token,
                'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
                'X-Ap-UserId': sessionStorage.getItem('UserId'),
                }
            };     

            try {
                const response = await axios.post(`${appsetting.apiUrl}/staff/amendcheck`, request, config);
                if (response.status === 200) {
                alert('申請成功');
                fetchData();
                }
                handleClose('amendCheck')
            } catch (error) {
                console.error("Error logging in:", error);
                alert('申請失敗 欄位有問題');
            }                    
        }

        const handleEventSubmit = async () => {
            const request = {
                Title:eventRequest.Title,
                LevelStatus:eventRequest.LevelStatus,
                EventStartDate:eventRequest.EventStartDate.format(`YYYY-MM-DDTHH:mm:00`) ,
                EventEndDate:eventRequest.EventEndDate.format(`YYYY-MM-DDTHH:mm:00`) ,
                StartTime:eventRequest.StartTime.format(`HH:mm:00`) ,
                EndTime:eventRequest.EndTime.format(`HH:mm:00`) ,
                Detail:eventRequest.Detail
            }

            if(eventRequest.Title.trim() === "") {
                alert('標題不得為空');
                return;
            }
            console.log(request)
            if (eventRequest.EventEndDate.isBefore(eventRequest.EventStartDate)) {
                alert('起始時間不能大於終止時間');
                return;
            } 
            const config = {
                headers: {
                'X-Ap-Token': appsetting.token,
                'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
                'X-Ap-UserId': sessionStorage.getItem('UserId'),
                }
            };     
            try {
                const response = await axios.post(`${appsetting.apiUrl}/staff/event`, request, config);
                if (response.status === 200) {
                alert('新增成功');
                }
                fetchEventData();
                setThingAddOpen(false);
            } catch (error) {
                console.error("Error logging in:", error);
                alert('發生錯誤');
            }                    
        }
      

        const handleOverTimeInputChange = (value, fieldName) => {
            if (fieldName === 'ChooseDate') {
              setOverTimeRequest((prevRequest) => ({
                ...prevRequest,
                ChooseDate: value.format(formattedDate) // directly use the value if it's a dayjs object
              }));
            } else {
              setOverTimeRequest((prevRequest) => ({
                ...prevRequest,
                [fieldName]: value.target ? value.target.value : value, // conditional check for value
              }));
            }
        };

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

        const handleAmendCheckInputChange = (value, fieldName) => {   
            if (fieldName === 'CheckDate') {
                setAmendCheckRequest((prevRequest) => ({
                  ...prevRequest,
                  CheckDate: value // directly use the value if it's a dayjs object
                }));
            }else if(fieldName === 'CheckTime') {
                setAmendCheckRequest((prevRequest) => ({
                    ...prevRequest,
                    CheckTime: value // directly use the value if it's a dayjs object
                  }));
            }else {
                setAmendCheckRequest((prevRequest) => ({
                    ...prevRequest,
                    [fieldName]: value.target ? value.target.value : value, 
                }));  
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

        const handleDeleteEvent = async (id) => {      
            try {
                const response = await axios.delete(`${appsetting.apiUrl}/staff/event?id=${id}`,config);
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
                    alert('成功');
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert('失敗');
            }          
        }

        const CustomToolbar = (toolbarProps) => {          
            const currentMonth = toolbarProps.date.getMonth()+1;
            const currentYear = toolbarProps.date.getFullYear(); // 获取年份
            const currentDay = toolbarProps.date.getDate(); // 获取日（1-31）
            return (
            <Grid container spacing={2} style={{marginBottom:'5%',marginTop:'2%'}}>
                <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        {`${currentYear}-${currentMonth}-${currentDay}`}   
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
                <Grid item xs={3}/>
                <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>
                    <IconButton color="primary" onClick={() => toolbarProps.onNavigate('PREV')}>
                        <NavigateBeforeIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>
                    <IconButton color="primary" onClick={() => setThingAddOpen(true)}>
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
    if(!isMobile) {
        return(
            <>
                <PageDeviceError/>
            </>
        )
    }
    
    
    return (
        <>
            {isMobile && (
            <>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height*1.5}px`,backgroundColor:'black'}}>

                    <Box sx={{ width: '85%', height: `${windowDimensions.height/1.3}px`,backgroundColor:'white'
                    ,margin:'auto',borderRadius: '10px',padding:'25px',marginTop:'5%'}}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                    {getCurrentDate()}
                                </Grid>
                                <Grid item xs={12} sx={gradientTextStyle}>     
                                    {viewInfo.CompanyName}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '30px' }}>     
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                                </Grid>
                                {!viewInfo.IsCheckIn && (
                                    <>
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                            {remainingTime}
                                        </Grid>
                                    </>
                                )}
                                {viewInfo.IsCheckIn && (
                                    <>
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                            {remainingTime}
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'10%' }}>     
                                    <Map center={center}/>
                                </Grid>                               
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'1%' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'black'}} onClick={()=>handleClickOpen('check')}>
                                        申報打卡
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'1%' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'black',marginLeft:'1%'}} onClick={()=>handleClickOpen('overTime')}>
                                        申報加班
                                    </Button>  
                                </Grid>   
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold' }}>     
                                    工作時間
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '13px' }}>     
                                    午休時間 {viewInfo.AfternoonRange === null ? '自由安排' : viewInfo.AfternoonRange}
                                </Grid>  
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '13px' }}>     
                                    上班時間 {viewInfo.CheckInRange} 下班時間 {viewInfo.CheckOutRange}
                                </Grid> 

                            </Grid>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/5}px`,marginTop:'2%'}}>
                        <Box sx={{ flexGrow: 1,margin:'5%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>     
                                    <Button variant="contained" endIcon={<CalendarMonthIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('calendar')}>
                                        行事
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<PermContactCalendarIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('vacation')}>
                                        休假
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('amendCheck')}>
                                        補卡
                                    </Button>

                                    <Dialog open={amendCheckOpen} onClose={()=>handleClose('overTime')}>
                                        <DialogTitle>休假申請</DialogTitle>
                                        <DialogContent>
                                            <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label">補卡類別</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                    value={amendCheckRequest.CheckType}
                                                    onChange={(e) => handleAmendCheckInputChange(e.target.value, 'CheckType')}
                                                >
                                                    <FormControlLabel value={0} control={<Radio />} label="上班" />
                                                    <FormControlLabel value={1} control={<Radio />} label="下班" />
                                                </RadioGroup>
                                            </FormControl>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                      
                                                <DemoContainer components={['MobileDatePicker','MobileTimePicker',]}>
                                                    <MobileDatePicker 
                                                        label="選擇補卡日期"
                                                        value={amendCheckRequest.CheckDate}
                                                        onChange={(e) => {
                                                            const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                                            handleAmendCheckInputChange(formattedDate, 'CheckDate');
                                                        }}
                                                        format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                                                    />
                                                    <MobileTimePicker  
                                                        label="打卡時間"
                                                        value={amendCheckRequest.CheckTime}
                                                        onChange={(e) => {
                                                            const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                                            handleAmendCheckInputChange(formattedDate, 'CheckTime');
                                                        }}
                                                        format="HH:mm:00" // 指定日期格式为 YYYY-MM-DD
                                                    />
                                                </DemoContainer>
                                            
                                            
                                            </LocalizationProvider>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="補卡緣由"
                                                multiline
                                                rows={2}
                                                style={{marginTop:'5%',width:'100%'}}
                                                value={amendCheckRequest.Reason}
                                                onChange={(e) => handleAmendCheckInputChange(e.target.value, 'Reason')}
                                                />
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={()=>handleClose('amendCheck')}>取消</Button>
                                        <Button onClick={handleAmendCheckSubmit}>申請</Button>
                                        </DialogActions>
                                    </Dialog>


                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={handleCheckListClick}>
                                        出勤
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={handleSalaryListClick}>
                                        薪資
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={handleOverTimeListClick}>
                                        紀錄
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/2}px`}}>
                        <Box sx={{ flexGrow: 1,margin:'1%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>     
                                    <AppTasks
                                    title="請假紀錄"
                                    list={
                                        viewInfo.VacationLogDTOs
                                    }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Dialog open={checkOpen} onClose={()=>handleClose('check')}>
                <DialogTitle>{Name}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                        {viewInfo.IsOverLocation === true? '您目前不在公司 確定要打卡嗎?' : '您目前位於打卡範圍內 請安心打卡'}
                </DialogContentText>
                <TextField
                    id="outlined-multiline-static"
                    label="備註"
                    multiline
                    rows={6}
                    style={{marginTop:'10%',width:'100%'}}
                    value={memo}
                    onChange={(e)=>setMemo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleClose('check')}>取消</Button>
                <Button onClick={handleSubmit}>打卡</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={overTimeOpen} onClose={()=>handleClose('overTime')}>
                <DialogTitle>加班申請</DialogTitle>
                <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MobileDatePicker']}>
                                <MobileDatePicker
                                label="加班日期"
                                value={overTimeRequest.ChooseDate}
                                onChange={(e) => handleOverTimeInputChange(e, 'ChooseDate')}
                                format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                                />

                        </DemoContainer>                       
                    </LocalizationProvider>
                <TextField
                    id="outlined-multiline-static"
                    label="時數"
                    style={{marginTop:'10%',width:'100%'}}
                    value={overTimeRequest.Hours}
                    onChange={(e) => handleOverTimeInputChange(e.target.value, 'Hours')}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="加班緣由"
                    multiline
                    rows={4}
                    style={{marginTop:'10%',width:'100%'}}
                    value={overTimeRequest.Reason}
                    onChange={(e) => handleOverTimeInputChange(e.target.value, 'Reason')}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleClose('overTime')}>取消</Button>
                <Button onClick={handleOverTimeSubmit}>申報</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={vacationOpen} onClose={()=>handleClose('overTime')}>
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
                            <FormControlLabel value='true' control={<Radio />} label="小時" />
                            <FormControlLabel value='false' control={<Radio />} label="天數" />
                        </RadioGroup>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {hourModel === true ?
                        <DemoContainer components={['MobileDatePicker']}>
                            <MobileDateTimePicker 
                                label="起始日"
                                value={vacationRequest.StartDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'StartDate');
                                }}
                                format="YYYY-MM-DD HH:mm" // 指定日期格式为 YYYY-MM-DD
                            />
                            <MobileDateTimePicker 
                                label="截止日"
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
                                label="起始日"
                                value={vacationRequest.StartDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'StartDate');
                                }}
                                format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                            />
                            <MobileDatePicker 
                                label="截止日"
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
                        label="時數"
                        style={{marginTop:'10%',width:'100%'}}
                        value={vacationRequest.Hours}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <FormControl required style={{minWidth:'120px',marginTop:'5%'}} size="small">
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
                        </Select>
                    </FormControl>
                    <TextField
                        id="outlined-multiline-static"
                        label="請假緣由"
                        multiline
                        rows={2}
                        style={{marginTop:'5%',width:'100%'}}
                        value={vacationRequest.Reason}
                        onChange={(e) => handleVacationInputChange(e.target.value, 'Reason')}
                        />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleClose('vacation')}>取消</Button>
                <Button onClick={handleVacationSubmit}>申請</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen
                open={calendarOpen}
                onClose={()=>handleClose('calendar')}
            >
                <AppBar sx={{ position: 'relative' }} style={{backgroundColor:'black'}}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={()=>handleClose('calendar')}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 16, flex: 1 }} variant="h6" component="div" >
                    Calendar
                    </Typography>
                </Toolbar>
                </AppBar>
                <Calendar
                    localizer={localizer}
                    events={event}
                    style={{fontSize:'5px'}}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView='month'
                    selectable
                    views={views}
                    view={currentView}
                    onView={(newView) => setCurrentView(newView)}
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
                />
                 <List>
                    {selectedEvent !== null?
                        <ListItem>
                            {selectedEvent.level !== 3 ? 
                            <>
                                <ListItemText 
                                    primary={selectedEvent.title} 
                                    secondary={`内容: ${selectedEvent.detail}`}
                                />
                                <Button variant="text" startIcon={<DeleteIcon />} style={{color:'red'}} onClick={()=>handleDeleteEvent(selectedEvent.id)}/>
                            </>
                            :
                            <ListItemText 
                                primary={`${selectedEvent.title}-${selectedEvent.staffName}`}
                                secondary={`上班地址: ${selectedEvent.detail} 員工: ${selectedEvent.staffName} 
                                    工作時間: ${moment(selectedEvent.start).format('HH:mm')} ~ ${moment(selectedEvent.end).format('HH:mm')} 
                                    總計: ${moment(selectedEvent.end).diff(moment(selectedEvent.start), 'hours')}小時${moment(selectedEvent.end).diff(moment(selectedEvent.start), 'minutes') % 60}分鐘`}
                            />
                        }                      
                        </ListItem>
                        :
                        null
                    }
                    <Divider />
                </List>
            </Dialog>
            <Dialog open={thingAddOpen} onClose={()=>setThingAddOpen(false)}>
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
                                </Select>
                            </FormControl>
                        </div>
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
                        label="事件內容"
                        multiline
                        rows={2}
                        style={{marginTop:'5%',width:'100%'}}
                        value={eventRequest.Detail}
                        onChange={(e) => handleEventInputChange(e.target.value, 'Detail')}
                        />
                    </DialogContent>
                    <DialogActions>
                    
                    <Button onClick={()=>setThingAddOpen(false)}>取消</Button>
                    <Button onClick={handleEventSubmit}>新增</Button>
                    </DialogActions>
                </Dialog>
          </>
        )}
        </>
    );
}


