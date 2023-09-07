import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { useState,useRef,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import {
    AppTasks
  } from '../sections/@dashboard/app';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function PersonalInfo() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckIn, setIsCheckIn] = useState(false);
        // 计算距离上班时间的剩余小时和分钟
    const workStartTime = new Date();
    workStartTime.setHours(8, 0, 0); // 设置上班时间为上午八点整
    const timeDiff = workStartTime - currentTime;
    const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const punchInDeadline = new Date();
    punchInDeadline.setHours(10, 0, 0);

    let remainingTime = '';
    if (currentTime < workStartTime) {
        remainingTime = `距離上班 ${formatTimeDiff(workStartTime - currentTime)}`;
    } else if (currentTime < punchInDeadline) {
        remainingTime = `距離打卡截止 ${formatTimeDiff(punchInDeadline - currentTime)}`;
    } else {
        const timeDiff = currentTime - punchInDeadline;
        remainingTime = `已超過打卡时间 ${formatTimeDiff(timeDiff)}`;
    }

    useEffect(() => {
        const timerId = setInterval(updateCurrentTime, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);
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
    
    return (
        <>
            {isMobile && (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height*2}px`,backgroundColor:'black'}}>

                    <Box sx={{ width: '90%', height: `${windowDimensions.height/2}px`,backgroundColor:'red'
                    ,margin:'auto',borderRadius: '10px',padding:'25px',marginTop:'5%'}}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                    {getCurrentDate()}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '30px' }}>     
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </Grid>
                                {!isCheckIn && (
                                    <>
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                            {remainingTime}
                                        </Grid>
                                    </>
                                )}
                                {isCheckIn && (
                                    <>
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                            {remainingTime}
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'10%' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
                                    </Button>
                                </Grid>      
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold' }}>     
                                    工作時間
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '15px' }}>     
                                    午休時間 12:00~1:00 
                                </Grid>  
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '15px' }}>     
                                    上班時間 9:00~10:30 下班時間 6:00~7:30
                                </Grid> 

                            </Grid>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height:`${windowDimensions.height/5}px`,marginTop:'5%'}}>
                        <Box sx={{ flexGrow: 1,margin:'5%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
                                    </Button>
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>     
                                    <Button variant="contained" endIcon={<FactCheckIcon />} size="large">
                                        Send
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
                                    title="Tasks"
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
            )}
        </>
    );
}