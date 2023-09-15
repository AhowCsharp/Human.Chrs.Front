import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { useState,useRef,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import dayjs from 'dayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {AppTasks} from '../sections/@dashboard/app';
import Map from '../googleMap/Map'
import appsetting from '../Appsetting';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

const config = {
    headers: {
      'X-Ap-Token': appsetting.token,
      'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
      'X-Ap-UserId': sessionStorage.getItem('UserId'),
    }
};
const staffName = sessionStorage.getItem('StaffName');
let Name = ``;
if(staffName !== null) {
    Name = `您好,${staffName.slice(1, 3)}`;
}

const currentDate = new Date();
// 获取年、月、日、小时、分钟和秒
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
// 将这些值组合成 'YYYY-MM-DD HH:mm:ss' 格式的字符串
const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

export default function PersonalInfo() {
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
    const [checkOpen, setCheckOpen] = useState(false);
    const [overTimeOpen, setOverTimeOpen] = useState(false);
    const [memo, setMemo] = useState('');
    const [center, setCenter] = useState({lat: 41.3851, lng: 2.1734 });

    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [overTimeRequest, setOverTimeRequest] = useState({
        Hours:0,
        Date:dayjs(formattedDate),
        Reason:''
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
    const fetchData = async () => {
        try {
            const response = await axios.get(`${appsetting.apiUrl}/staff/view?longitude=${center.lng}&latitude=${center.lat}`, config);
            console.log(response.data)
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
          default:
        }
      };
    
    const handleClose = (type) => {
        switch (type) {
            case 'check':
              setCheckOpen(false);
              break;
            case 'overTime':
              setOverTimeOpen(false);
              break;
            default:
          }
    };

    const handleSubmit = async () => {
        // 創建一個物件來存儲帳號和密碼
        // 設定 header 的 token
        const config = {
          headers: {
            'X-Ap-Token': appsetting.token,
            'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
            'X-Ap-UserId': sessionStorage.getItem('UserId'),
          }
        };
        const checkRequest = {
            Latitude: center.lat,
            Longitude: center.lng,
            Memo: memo
        }
        // 發送 POST 請求
        try {
          const response = await axios.post(`${appsetting.apiUrl}/staff/checkinout`, checkRequest, config);
    
          if(response.status === 200) {
            alert('打卡成功');
            fetchData();
          }        
        } catch (error) {
          console.error("Error logging in:", error);
          alert('打卡失敗 發生未知錯誤');
        }
        handleClose('check');
    };

    const handleOverTimeInputChange = (event, propertyName) => {
        const value = event.target.value;
    
        setOverTimeRequest((prevData) => ({
          ...prevData,
          [propertyName]: value,
        }));
    };
    
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
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'10%' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'black'}} onClick={()=>handleClickOpen('check')}>
                                        打卡
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
                                    <Button variant="contained" endIcon={<CalendarMonthIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}}>
                                        行事
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<PermContactCalendarIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}}>
                                        休假
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}}>
                                        請款
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}}>
                                        出勤
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}}>
                                        薪資
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large" style={{background:'orange',whiteSpace: 'nowrap'}} onClick={()=>handleClickOpen('overTime')}>
                                        加班
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/2}px`,marginTop:'5%'}}>
                        <Box sx={{ flexGrow: 1,margin:'1%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>     
                                    <AppTasks
                                    title="請假紀錄"
                                    list={[
                                        { id: '1', label: 'Create FireStone Logo' },
                                        { id: '2', label: 'Add SCSS and JS files if required' },
                                        { id: '3', label: 'Stakeholder Meeting' },
                                        { id: '4', label: 'Scoping & Estimations' },
                                        { id: '5', label: 'Sprint Showcase' },
                                    ]}
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
                <DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                            <DateTimePicker
                            label="加班日期"
                            value={overTimeRequest.Date}
                            onChange={(e) => handleOverTimeInputChange(e, 'Date')}
                            />
                            <DemoItem label="Mobile variant">
                                <MobileDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
                            </DemoItem>
                        </DemoContainer>                       
                    </LocalizationProvider>
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
                <Button onClick={()=>handleClose('overTime')}>取消</Button>
                <Button onClick={handleSubmit}>打卡</Button>
                </DialogActions>
            </Dialog>
          </>
            )}
        </>
    );
}