import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { useState,useRef,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
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

export default function PersonalDetail() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    
    return (
        <>
            {isMobile && (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height}px`,backgroundColor:'black',padding:'5%'}}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>     
                                <Typography variant="h3" gutterBottom style={{color:'white'}}>
                                    h3. Heading
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>     
                                <Typography variant="h6" gutterBottom style={{color:'white'}}>
                                    h3. Heading
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'25%' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="部門"
                                defaultValue="Hello World"
                                variant="standard"
                                color="warning"
                                InputProps={{
                                    style: {
                                        color: 'white', // 文字變白色
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'white', // 標籤變白色
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="電話號碼"
                                defaultValue="Hello World"
                                variant="standard"
                                color="warning"
                                InputProps={{
                                    style: {
                                        color: 'white', // 文字變白色
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'white', // 標籤變白色
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="Email"
                                defaultValue="Hello World"
                                variant="standard"
                                color="warning"
                                InputProps={{
                                    style: {
                                        color: 'white', // 文字變白色
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'white', // 標籤變白色
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="雇用類別"
                                defaultValue="Hello World"
                                variant="standard"
                                color="warning"
                                InputProps={{
                                    style: {
                                        color: 'white', // 文字變白色
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'white', // 標籤變白色
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="任職公司"
                                defaultValue="Hello World"
                                variant="standard"
                                color="warning"
                                InputProps={{
                                    style: {
                                        color: 'white', // 文字變白色
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'white', // 標籤變白色
                                    },
                                }}
                                />
                            </Grid>
                        </Grid>
                    </Box>                 
                </Box>
            </Box>
            )}
        </>
    );
}