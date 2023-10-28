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
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
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
import { useLanguage } from '../layouts/LanguageContext'
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

const views = {
    day: true,   // 顯示日視圖
    month: true, // 顯示月視圖
};

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
        Language:'TW'
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
    const { language, chooseLang } = useLanguage();
    const [errOpen,setErropen] = useState(false);
    const [errMsg ,setErrMsg]= useState('');
    const [okOpen,setOkopen] = useState(false);
    const handleOkOpen = () => {
      setOkopen(true);
    }		

    const handleErrOpen = () => {
      setErropen(true);
    }

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
    const TIME_LABELS = {
        tw: {
          hours: '小時',
          minutes: '分鐘',
          seconds: '秒'
        },
        en: {
          hours: 'hours',
          minutes: 'minutes',
          seconds: 'seconds'
        }
    };
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
    const timeFormatOptions = viewInfo.Language === 'TW'
    ? { hour: '2-digit', minute: '2-digit', hour12: true }
    : { hour: '2-digit', minute: '2-digit', hour12: true };
  
    const locale = viewInfo.Language === 'TW' ? 'zh-TW' : 'en-US';
    const formattedTime = currentTime.toLocaleTimeString(locale, timeFormatOptions);
    const MESSAGES = {
        tw: {
          beforeWork: '距離上班',
          beforeDeadline: '距離打卡截止',
          afterDeadline: '已超過打卡時間',
          workedFor: '已經努力了',
          restWell: '請好好休息 別打開這軟體了'
        },
        en: {
          beforeWork: 'Until work starts',
          beforeDeadline: 'Until punch-in deadline',
          afterDeadline: 'Overdue for punch-in',
          workedFor: 'You have worked for',
          restWell: 'Rest well and don\'t open this app'
        }
      };
      
      const lang = viewInfo.Language === 'TW' ? 'tw' : 'en';

      let remainingTime = '';
      if(!viewInfo.IsCheckIn) {
          if (currentTime < workStartTime) {
              remainingTime = `${MESSAGES[lang].beforeWork} ${formatTimeDiff((workStartTime - currentTime), lang)}`;
          } else if (workStartTime < currentTime && currentTime < punchInDeadline) {
              remainingTime = `${MESSAGES[lang].beforeDeadline} ${formatTimeDiff((punchInDeadline - currentTime), lang)}`;
          } else {
              const timeDiff = currentTime - punchInDeadline;
              remainingTime = `${MESSAGES[lang].afterDeadline} ${formatTimeDiff(timeDiff, lang)}`;
          }
      }
      
      if(viewInfo.IsCheckIn && !viewInfo.IsCheckOut) {
          remainingTime = `${MESSAGES[lang].workedFor} ${formatTimeDiff((currentTime-CheckInTime), lang)}`;      
      }
      
      if(viewInfo.IsCheckIn && viewInfo.IsCheckOut) {
          remainingTime = MESSAGES[lang].restWell;
      }
      
    useEffect(() => {
       
        setViewInfo({
            ...viewInfo,
            Language:language
        }); // e.newValue
        sessionStorage.setItem('Language',language);
      }, [language]);

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
                    staffName:apiEvent.StaffName,
                }));
                console.log(transformedEvents)
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
    const fetchData = async () => {
        try {
            const response = await axios.get(`${appsetting.apiUrl}/staff/view?longitude=${center.lng}&latitude=${center.lat}`, config);
        
            if(response.status === 200) {
                sessionStorage.getItem('Lauguage',response.data.Language);
                if(response.data.Language !== 'TW') {
                    chooseLang('en');
                } else {
                    chooseLang('tw');
                }

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
                    Language:response.data.Language,
                    DeathDays:response.data.DeathDays,
                    MarriedDays:response.data.MarriedDays,
                    PrenatalCheckUpDays:response.data.PrenatalCheckUpDays,
                    SickDays:response.data.SickDays,
                    SpecialRestDays:response.data.SpecialRestDays,
                    ThingDays:response.data.ThingDays,

                  });
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
    function formatTimeDiff(timeDiff, lang = 'tw') {
        const labels = TIME_LABELS[lang];
    
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return `${hours} ${labels.hours} ${minutes} ${labels.minutes} ${seconds} ${labels.seconds}`;
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
                handleOkOpen();
                fetchData();
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
            
            handleClose('check');
          }, () => {
            handleErrOpen();
            setErrMsg('您未允許地理位置權限，請允許以繼續操作');
          });
        } else {
            handleErrOpen();
            setErrMsg('您的瀏覽器不支援定位功能');
        }
      };
      const handleOverTimeSubmit = async () => {
        if(overTimeRequest.Hours === 0) {
            handleErrOpen();
            setErrMsg('加班時數不得為0');
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
              const response = await axios.post(`${appsetting.apiUrl}/staff/overtime`, overTimeRequest, config);
              if (response.status === 200) {
                handleOkOpen();
                fetchData();
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
                handleErrOpen();
                setErrMsg('起始時間不能大於終止時間');
                return;
            } 

            if (durationInMinutes < 60) {               
                handleErrOpen();
                setErrMsg('請假時數至少1小時為單位');
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
                handleOkOpen();
                fetchData();
                }
                handleClose('vacation')
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
                    handleOkOpen();
                    fetchData();
                }
                handleClose('amendCheck')
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
                handleErrOpen();
                setErrMsg('標題不得為空');
                return;
            }
            
            if (eventRequest.EventEndDate.isBefore(eventRequest.EventStartDate)) {
                handleErrOpen();
                setErrMsg('起始時間不能大於終止時間');
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
                    handleOkOpen();
                }
                fetchEventData();
                setThingAddOpen(false);
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
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', position: 'relative', overflow: 'hidden', WebkitOverflowScrolling: 'touch', overflowScrolling: 'touch' }}>
                <Box sx={{width: '100%',minHeight: '1350px', height:`${windowDimensions.height*1.6}px`,backgroundColor:'black'}}>

                    <Box sx={{ width: '85%', height: `${windowDimensions.height/1.2}px`,minHeight: '750px',backgroundColor:'white'
                    ,margin:'auto',borderRadius: '10px',padding:'25px',marginTop:'5%'}}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                    {getCurrentDate()}
                                </Grid>
                                <Grid item xs={12} sx={gradientTextStyle}>     
                                    {viewInfo.CompanyName}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '30px',textAlign: 'center', }}>     
                                        {formattedTime}
                                </Grid>
                                {!viewInfo.IsCheckIn && (
                                    <>
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',textAlign: 'center', }}>     
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
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'5%' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'black'}} onClick={()=>handleClickOpen('check')}>
                                        {viewInfo.Language === 'TW' ? '申報打卡' : 'Apply for Check-in'}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'1%' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'black',marginLeft:'1%'}} onClick={()=>handleClickOpen('overTime')}>
                                        {viewInfo.Language === 'TW' ? '申報加班' : 'Apply for Overtime'}
                                    </Button>  
                                </Grid>   
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold',marginTop:'5%'  }}>     
                                    {viewInfo.Language === 'TW' ? '工作時段' : 'Work Hours'}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '13px' }}>     
                                    {viewInfo.Language === 'TW' ? '午休時間' : 'Lunch Break'} {viewInfo.AfternoonRange === null ? '自由安排' : viewInfo.AfternoonRange}
                                </Grid>  
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '13px' }}>
                                    {viewInfo.Language === 'TW' ? '上班時間' : 'Start Time'} {viewInfo.CheckInRange}
                                    {viewInfo.Language !== 'TW' ? <><br /></>:'~'}
                                    {viewInfo.Language === 'TW' ? '下班時間' : 'End Time'} {viewInfo.CheckOutRange}
                                </Grid>
 

                            </Grid>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/5}px`,marginTop:'2%'}}>
                        <Box sx={{ flexGrow: 1,margin:'5%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>     
                                    <Button variant="contained" endIcon={<CalendarMonthIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('calendar')}>
                                        {viewInfo.Language === 'TW' ? '行事' : 'Calendar'}
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<PermContactCalendarIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('vacation')}>
                                        {viewInfo.Language === 'TW' ? '休假' : 'Leave'}
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('amendCheck')}>
                                        {viewInfo.Language === 'TW' ? '補卡' : 'Clock-In'}
                                    </Button>

                                    <Dialog open={amendCheckOpen} onClose={()=>handleClose('overTime')}>
                                        <DialogTitle>{viewInfo.Language === 'TW' ? '補打卡申請' : 'Clock-In Request'}</DialogTitle>
                                        <DialogContent>
                                            <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label"> {viewInfo.Language === 'TW' ? '打卡類別' : 'Clock-In Category'}</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                    value={amendCheckRequest.CheckType}
                                                    onChange={(e) => handleAmendCheckInputChange(e.target.value, 'CheckType')}
                                                >
                                                <FormControlLabel value={0} control={<Radio />} label={viewInfo.Language === 'TW' ? '上班' : 'Clock-In'} />
                                                <FormControlLabel value={1} control={<Radio />} label={viewInfo.Language === 'TW' ? '下班' : 'Clock-Out'} />

                                                </RadioGroup>
                                            </FormControl>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                      
                                                <DemoContainer components={['MobileDatePicker','MobileTimePicker',]}>
                                                    <MobileDatePicker 
                                                        label={viewInfo.Language === 'TW' ? '選擇補卡日期' : 'Select Make-up Clock Date'}
                                                        value={amendCheckRequest.CheckDate}
                                                        onChange={(e) => {
                                                            const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                                            handleAmendCheckInputChange(formattedDate, 'CheckDate');
                                                        }}
                                                        format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                                                    />
                                                    <MobileTimePicker  
                                                        label={viewInfo.Language === 'TW' ? '打卡時間' : 'Clock Time'}
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
                                                label={viewInfo.Language === 'TW' ? '補卡緣由' : 'Reason for Make-up Clock'}
                                                multiline
                                                rows={2}
                                                style={{marginTop:'5%',width:'100%'}}
                                                value={amendCheckRequest.Reason}
                                                onChange={(e) => handleAmendCheckInputChange(e.target.value, 'Reason')}
                                                />
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={()=>handleClose('amendCheck')}>{viewInfo.Language === 'TW' ? '取消' : 'Cancel'}</Button>
                                        <Button onClick={handleAmendCheckSubmit}>{viewInfo.Language === 'TW' ? '申請' : 'Submit'}</Button>
                                        </DialogActions>
                                    </Dialog>


                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={handleCheckListClick}>
                                    {viewInfo.Language === 'TW' ? '出勤' : 'Work'}
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={handleSalaryListClick}>
                                    {viewInfo.Language === 'TW' ? '薪資' : 'Salary'}
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={handleOverTimeListClick}>
                                    {viewInfo.Language === 'TW' ? '紀錄' : 'Records'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/2}px`,minHeight: '500px'}}>
                        <Box sx={{ flexGrow: 1,margin:'1%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>     
                                    <AppTasks
                                    title={viewInfo.Language === 'TW' ? '請假紀錄' : 'Leave Records'}
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
                {viewInfo.Language === 'TW'
                    ? (viewInfo.IsOverLocation === true
                        ? '您目前不在公司 確定要打卡嗎？'
                        : '您目前位於打卡範圍內 請安心打卡')
                    : (viewInfo.IsOverLocation === true
                        ? 'You are currently not at the company. Are you sure you want to clock in?'
                        : 'You are currently within the clock-in range. Please proceed to clock in.')}
                </DialogContentText>
                <TextField
                    id="outlined-multiline-static"
                    label={viewInfo.Language === 'TW' ? '備註' : 'Memo'}
                    multiline
                    rows={6}
                    style={{marginTop:'10%',width:'100%'}}
                    value={memo}
                    onChange={(e)=>setMemo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleClose('check')}>{viewInfo.Language === 'TW' ? '取消' : 'Cancel'}</Button>
                <Button onClick={handleSubmit}>{viewInfo.Language === 'TW' ? '打卡' : 'Check-In-Out'}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={overTimeOpen} onClose={()=>handleClose('overTime')}>
                <DialogTitle>{viewInfo.Language === 'TW' ? '加班申請' : 'Overtime Application'}</DialogTitle>
                <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MobileDatePicker']}>
                                <MobileDatePicker
                                label={viewInfo.Language === 'TW' ? '加班日期' : 'Overtime Date'}
                                value={overTimeRequest.ChooseDate}
                                onChange={(e) => handleOverTimeInputChange(e, 'ChooseDate')}
                                format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                                />

                        </DemoContainer>                       
                    </LocalizationProvider>
                <TextField
                    id="outlined-multiline-static"
                    label={viewInfo.Language === 'TW' ? '時數' : 'Hours'}
                    style={{marginTop:'10%',width:'100%'}}
                    value={overTimeRequest.Hours}
                    onChange={(e) => handleOverTimeInputChange(e.target.value, 'Hours')}
                />
                <TextField
                    id="outlined-multiline-static"
                    label={viewInfo.Language === 'TW' ? '加班緣由' : 'Overtime Reason'}
                    multiline
                    rows={4}
                    style={{marginTop:'10%',width:'100%'}}
                    value={overTimeRequest.Reason}
                    onChange={(e) => handleOverTimeInputChange(e.target.value, 'Reason')}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleClose('overTime')}>{viewInfo.Language === 'TW' ? '取消' : 'Cancel'}</Button>
                <Button onClick={handleOverTimeSubmit}>{viewInfo.Language === 'TW' ? '申報' : 'Submit'}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={vacationOpen} onClose={()=>handleClose('overTime')}>
                <DialogTitle>{viewInfo.Language === 'TW' ? '休假申請' : 'Leave Application'}</DialogTitle>
                <DialogContent>
                    <div style={{
                    display: 'flex', 
                    overflowX: 'auto', 
                    whiteSpace: 'nowrap',
                    gap: '20px'  // 可根据需要调整
                    }}>
                    <Stack spacing={2} direction="row" style={{marginBottom:'5%'}}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate"value={Math.min(100, (viewInfo.ThingDays/120) * 100)} size={80} color='inherit'/>
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                >事假<br/>{`${Math.floor(viewInfo.ThingDays / 8)}天${ viewInfo.ThingDays % 8}小時`}</Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Stack spacing={2} direction="row" style={{marginBottom:'5%'}}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate"value={Math.min(100, (viewInfo.SickDays/240) * 100)} size={80} color='success'/>
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                >病假<br/>{`${Math.floor(viewInfo.SickDays / 8)}天${ viewInfo.SickDays % 8}小時`}</Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Stack spacing={2} direction="row" style={{marginBottom:'5%'}}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate"value={Math.min(100, (viewInfo.PrenatalCheckUpDays/56) * 100)} size={80} color='secondary'/>
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                >產檢假<br/>{`${Math.floor(viewInfo.PrenatalCheckUpDays / 8)}天${ viewInfo.PrenatalCheckUpDays % 8}小時`}</Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Stack spacing={2} direction="row" style={{marginBottom:'5%'}}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate"value={Math.min(100, (viewInfo.SpecialRestDays/240) * 100)} size={80} color='info'/>
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                >特休<br/>{`${Math.floor(viewInfo.SpecialRestDays / 8)}天${ viewInfo.SpecialRestDays % 8}小時`}</Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Stack spacing={2} direction="row" style={{marginBottom:'5%'}}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate"value={Math.min(100, (viewInfo.DeathDays/56) * 100)} size={80} color='warning'/>
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                >喪假<br/>{`${Math.floor(viewInfo.DeathDays / 8)}天${ viewInfo.DeathDays % 8}小時`}</Typography>
                            </Box>
                        </Box>
                    </Stack>
                    </div>
                    <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">{viewInfo.Language === 'TW' ? '申請模式' : 'Application Mode'}</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={hourModel}
                            onChange={()=>setHourModel(!hourModel)}
                        >
                            <FormControlLabel value='true' control={<Radio />} label={viewInfo.Language === 'TW' ? '小時' : 'Hours'} />
                            <FormControlLabel value='false' control={<Radio />} label={viewInfo.Language === 'TW' ? '天數' : 'Days'} />
                        </RadioGroup>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {hourModel === true ?
                        <DemoContainer components={['MobileDatePicker']}>
                            <MobileDateTimePicker 
                                label={viewInfo.Language === 'TW' ? '起始日' : 'Start Date'}
                                value={vacationRequest.StartDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'StartDate');
                                }}
                                format="YYYY-MM-DD HH:mm" // 指定日期格式为 YYYY-MM-DD
                            />
                            <MobileDateTimePicker 
                                label={viewInfo.Language === 'TW' ? '截止日' : 'End Date'}
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
                                label={viewInfo.Language === 'TW' ? '起始日' : 'Start Date'}
                                value={vacationRequest.StartDate}
                                onChange={(e) => {
                                    const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                    handleVacationInputChange(formattedDate, 'StartDate');
                                }}
                                format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                            />
                            <MobileDatePicker 
                                label={viewInfo.Language === 'TW' ? '截止日' : 'End Date'}
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
                        label={viewInfo.Language === 'TW' ? '時數' : 'Hours'}
                        style={{marginTop:'10%',width:'100%'}}
                        value={vacationRequest.Hours}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <FormControl required style={{minWidth:'120px',marginTop:'5%'}} size="small">
                        <InputLabel id="demo-simple-select-required-label">{viewInfo.Language === 'TW' ? '休假類別' : 'Leave Type'}</InputLabel>
                        <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={vacationRequest.Type}
                        label="休假類別"
                        onChange={(e) => handleVacationInputChange(e.target.value, 'Type')}
                        >
                        <MenuItem value={0}>
                            {viewInfo.Language === 'TW' ? '特休' : 'Vacation'}
                        </MenuItem>
                        <MenuItem value={1}>
                            {viewInfo.Language === 'TW' ? '病假' : 'Sick Leave'}
                        </MenuItem>
                        <MenuItem value={2}>
                            {viewInfo.Language === 'TW' ? '事假' : 'Personal Leave'}
                        </MenuItem>
                        <MenuItem value={3}>
                            {viewInfo.Language === 'TW' ? '生育假' : 'Maternity Leave'}
                        </MenuItem>
                        <MenuItem value={4}>
                            {viewInfo.Language === 'TW' ? '喪假' : 'Bereavement Leave'}
                        </MenuItem>
                        <MenuItem value={5}>
                            {viewInfo.Language === 'TW' ? '婚假' : 'Marriage Leave'}
                        </MenuItem>
                        <MenuItem value={6}>
                            {viewInfo.Language === 'TW' ? '公假' : 'Public Holiday'}
                        </MenuItem>
                        <MenuItem value={7}>
                            {viewInfo.Language === 'TW' ? '工傷病假' : 'Work-Related Injury Leave'}
                        </MenuItem>
                        <MenuItem value={8}>
                            {viewInfo.Language === 'TW' ? '生理假' : 'Menstrual Leave'}
                        </MenuItem>
                        <MenuItem value={9}>
                            {viewInfo.Language === 'TW' ? '育嬰留職停薪假' : 'Maternity Unpaid Leave'}
                        </MenuItem>
                        <MenuItem value={10}>
                            {viewInfo.Language === 'TW' ? '安胎假' : 'Pregnancy Safety Leave'}
                        </MenuItem>
                        <MenuItem value={11}>
                            {viewInfo.Language === 'TW' ? '產檢假' : 'Prenatal Examination Leave'}
                        </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="outlined-multiline-static"
                        label={viewInfo.Language === 'TW' ? '請假原因' : 'Reason'}
                        multiline
                        rows={2}
                        style={{marginTop:'5%',width:'100%'}}
                        value={vacationRequest.Reason}
                        onChange={(e) => handleVacationInputChange(e.target.value, 'Reason')}
                        />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleClose('vacation')}>{viewInfo.Language === 'TW' ? '取消' : 'Cancel'}</Button>
                <Button onClick={handleVacationSubmit}>{viewInfo.Language === 'TW' ? '申請' : 'Submit'}</Button>
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
                    {viewInfo.Language === 'TW' ? '行事曆' : 'Calandar'}
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
                        {selectedEvent !== null ? (
                            <ListItem>
                                {selectedEvent.level !== 3 ? (
                                    selectedEvent.level !== 4 ? (
                                        <>
                                            <ListItemText
                                                primary={selectedEvent.title}
                                                secondary={`${viewInfo.Language === 'TW' ? '內容' : 'Content'}: ${selectedEvent.detail}`}
                                            />
                                            <Button variant="text" startIcon={<DeleteIcon />} style={{ color: 'red' }} onClick={() => handleDeleteEvent(selectedEvent.id)} />
                                        </>
                                    ) : (
                                        <>
                                            <ListItemText
                                                primary={`${viewInfo.Language === 'TW' ? '會議主題' : 'Meeting Topic'}: ${selectedEvent.title}`}
                                                secondary={`${viewInfo.Language === 'TW' ? '內容' : 'Content'}: ${selectedEvent.detail}`}
                                            />
                                        </>
                                    )
                                ) : (
                                    (() => {
                                        const workMinutes = calculateWorkHours(selectedEvent.start, selectedEvent.end);
                                        const hours = Math.floor(workMinutes / 60);
                                        const minutes = workMinutes % 60;
                                        return (
                                            <ListItemText
                                                primary={`${viewInfo.Language === 'TW' ? selectedEvent.title : 'Meeting Topic'} - ${selectedEvent.staffName}`}
                                                secondary={`${viewInfo.Language === 'TW' ? '上班地址' : 'Work Location'}: ${selectedEvent.detail} ${viewInfo.Language === 'TW' ? '員工' : 'Employee'}: ${selectedEvent.staffName}
                                                            ${viewInfo.Language === 'TW' ? '工作時間' : 'Work Time'}: ${moment(selectedEvent.start).format('HH:mm')} ~ ${moment(selectedEvent.end).format('HH:mm')}
                                                            ${viewInfo.Language === 'TW' ? '總計' : 'Total'}: ${hours}${viewInfo.Language === 'TW' ? '小時' : 'hours'}${minutes}${viewInfo.Language === 'TW' ? '分鐘' : 'minutes'}`}
                                            />
                                        );
                                    })()
                                )}
                            </ListItem>
                        ) : null}
                        <Divider />
                    </List>
            </Dialog>
            <Dialog open={thingAddOpen} onClose={()=>setThingAddOpen(false)}>
                    <DialogTitle>{viewInfo.Language === 'TW' ? '行事曆新增' : 'Calendar Add'}</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label={viewInfo.Language === 'TW' ? '事件標題' : 'Event Title'}
                                fullWidth
                                value={eventRequest.Title}
                                onChange={(e) => handleEventInputChange(e.target.value, 'Title')}
                                variant="outlined"
                                style={{ flex: 1 }} // 拉伸以占据可用空间
                            />
                            <FormControl sx={{ m: 1, minWidth: 60 }} size="small" style={{ marginLeft: '20px' }}>
                                <InputLabel id="demo-select-small-label">{viewInfo.Language === 'TW' ? '緊急性' : 'Urgency'}</InputLabel>
                                <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={eventRequest.LevelStatus}
                                onChange={(e) => handleEventInputChange(e.target.value, 'LevelStatus')}
                                >
                                <MenuItem value={0}>{viewInfo.Language === 'TW' ? '日常' : 'Routine'}</MenuItem>
                                <MenuItem value={1}>{viewInfo.Language === 'TW' ? '普通' : 'Normal'}</MenuItem>
                                <MenuItem value={2}>{viewInfo.Language === 'TW' ? '緊急' : 'Urgent'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['MobileDatePicker']}>
                                <MobileDatePicker 
                                    label={viewInfo.Language === 'TW' ? '起始日' : 'Start Date'}
                                    value={eventRequest.EventStartDate}
                                    onChange={(e) => {
                                        const formattedDate = e.clone().millisecond(0).second(0); // 將毫秒和秒設為 0
                                        handleEventInputChange(formattedDate, 'EventStartDate');
                                    }}
                                    format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                                />
                                <MobileDatePicker 
                                    label={viewInfo.Language === 'TW' ? '截止日' : 'End Date'}
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
                                        label={viewInfo.Language === 'TW' ? '起始時間' : 'Start Time'}
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
                                        label={viewInfo.Language === 'TW' ? '截止時間' : 'End Time'}
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
                        label={viewInfo.Language === 'TW' ? '事件內容' : 'Event Content'}
                        multiline
                        rows={2}
                        style={{marginTop:'5%',width:'100%'}}
                        value={eventRequest.Detail}
                        onChange={(e) => handleEventInputChange(e.target.value, 'Detail')}
                        />
                    </DialogContent>
                    <DialogActions>
                    
                    <Button onClick={()=>setThingAddOpen(false)}>{viewInfo.Language === 'TW' ? '取消' : 'Cancel'}</Button>
                    <Button onClick={handleEventSubmit}>{viewInfo.Language === 'TW' ? '新增' : 'Add'}</Button>
                    </DialogActions>
                </Dialog>
          </>
        )}
        <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
        <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
        </>
    );
}


const calculateWorkHours = (start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);
    
    const WORK_START_HOUR = startMoment.hours();
    const WORK_END_HOUR = endMoment.hours();
    const ONE_DAY_MINUTES = (WORK_END_HOUR - WORK_START_HOUR) * 60;

    if (startMoment.isSame(endMoment, 'day')) {
        return endMoment.diff(startMoment, 'minutes');
    }

    let totalMinutes = 0;
    totalMinutes += moment(startMoment).set({ hour: WORK_END_HOUR, minute: 0 }).diff(startMoment, 'minutes');
    startMoment.add(1, 'days');

    while (!startMoment.isSame(endMoment, 'day')) {
        totalMinutes += ONE_DAY_MINUTES;
        startMoment.add(1, 'days');
    }

    totalMinutes += endMoment.diff(moment(endMoment).set({ hour: WORK_START_HOUR, minute: 0 }), 'minutes');
    return totalMinutes;
};


