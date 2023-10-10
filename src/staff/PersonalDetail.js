import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { useLocation,useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PageDeviceError from '../pages/PageDeviceError';
import appsetting from '../Appsetting';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function PersonalDetail() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
        }
    };
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [staffDetail,setStaffDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [avatarUrl, setAvatarUrl] = useState(sessionStorage.getItem('AvatarUrl'));

    useEffect(() => {
        // 監聽 sessionStorage 中 AvatarUrl 的變化
        setAvatarUrl(sessionStorage.getItem('AvatarUrl'));
    }, [sessionStorage.getItem('AvatarUrl')]);

    useEffect(() => {
        if (!fileInputRef.current) {
            return undefined;  // 明確的返回 undefined
        }
        
        const handleFileChange = (e) => {
            if (e.target.files.length === 0) { // If no files are selected
                setFile(null);
            }
        };
        
        // Attach the event listener
        fileInputRef.current.addEventListener('change', handleFileChange);
        
        // Cleanup the event listener on component unmount
        return () => {
            fileInputRef.current.removeEventListener('change', handleFileChange);
        };
    }, []);
    


    const fetchStaffDetailData = async () => {
        setIsLoading(true);  // 開始加載
        try {       
            const response = await axios.get(`${appsetting.apiUrl}/staff/detail`,config);
            if (response.status === 200) {
                setStaffDetail(response.data);

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);  // 結束加載
        }
    };
    useEffect(() => {
            fetchStaffDetailData();
    }, []); 

    const onFileChange = async (e) => {
        setFile(e.target.files[0]);
    
        // 調整此處，確保已選擇檔案後再上傳
        if (e.target.files[0]) {
            await uploadAvatar();
        }
    };

    const uploadAvatar = async () => {
        if (!file) {
            console.error('No file selected!');
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', file);
    
        try {
            const response = await axios.post(`${appsetting.apiUrl}/staff/avatar`, formData, config);
            if(response.status === 200) {
                const newAvatarUrl = `${appsetting.apiUrl}${response.data}`;
                sessionStorage.setItem('AvatarUrl', newAvatarUrl);
                setAvatarUrl(newAvatarUrl); // 這行會觸發組件重新渲染
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };
    if(!isMobile) {
        return(
            <>
                <PageDeviceError/>
            </>
        )
    }


    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '85vh', 
                    backgroundColor: 'black' 
                }}>
                <CircularProgress color="success" />
            </Box>
        );
    }

    if(!staffDetail) {
        return (
        <>
            <div>
                該員工尚未設置詳細資料 請通知貴司人資
            </div>
        </>
        );
    }
    

    return (
        <>
            {isMobile && staffDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height}px`,backgroundColor:'black',padding:'5%'}}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>    
                                <Avatar
                                    alt={sessionStorage.getItem('StaffName')}
                                    src={avatarUrl}
                                    sx={{ width: 48, height: 48 }}
                                    onClick={()=>alert(6)}
                                /> 
                                <Typography variant="h3" gutterBottom style={{color:'white',marginLeft:'5%'}}>
                                    {staffDetail.Name}的個人資料
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>    
                                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} style={{color:'white'}}>
                                    更換大頭貼
                                    <VisuallyHiddenInput type="file" onChange={onFileChange} ref={fileInputRef}/>
                                </Button>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>     
                                <Typography variant="h6" gutterBottom style={{color:'white'}}>
                                    {staffDetail.EnglishName} 您好
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'10%' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="部門"
                                value={staffDetail.Department}
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
                                value={staffDetail.PhoneNumber}
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
                                label="信箱"
                                value={staffDetail.Email}
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
                                label="職稱"
                                value={staffDetail.LevelPosition}
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
                                label="工作地點"
                                value={staffDetail.WorkLocation}
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
                                value={staffDetail.CompanyName}
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
                                label="到職日"
                                value={staffDetail.EntryDate.split('T')[0]}
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