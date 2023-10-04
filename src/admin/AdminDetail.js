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
    blackSpace: 'nowrap',
    width: 1,
});

export default function AdminDetail() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [adminDetail,setAdminDetail] = useState(null);
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
    


    const fetchAdminDetailData = async () => {
        setIsLoading(true);  // 開始加載
        try {       
            const response = await axios.get(`${appsetting.apiUrl}/admin/admindetail`,config);
            if (response.status === 200) {
                setAdminDetail(response.data.Data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);  // 結束加載
        }
    };
    useEffect(() => {
            fetchAdminDetailData();
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
            const response = await axios.post(`${appsetting.apiUrl}/admin/avatar`, formData, config);
            if(response.status === 200) {
                const newAvatarUrl = `${appsetting.apiUrl}${response.data}`;
                sessionStorage.setItem('AvatarUrl', newAvatarUrl);
                setAvatarUrl(newAvatarUrl); // 這行會觸發組件重新渲染
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };
    


    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '85vh', 
                    backgroundColor: 'transparent' 
                }}>
                <CircularProgress color="success" />
            </Box>
        );
    }
    

    return (
        <>
            {adminDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`${windowDimensions.height}px`,backgroundColor:'transparent',padding:'5%'}}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>    
                                <Avatar
                                    alt={sessionStorage.getItem('StaffName')}
                                    src={avatarUrl}
                                    sx={{ width: 72, height: 72 }}
                                    onClick={()=>alert('建議尺寸 72*72')}
                                /> 
                                <Typography variant="h2" gutterBottom style={{color:'black',marginLeft:'5%'}}>
                                    {adminDetail.UserName}的個人資料
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>    
                                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} style={{color:'black'}}>
                                    更換大頭貼
                                    <VisuallyHiddenInput type="file" onChange={onFileChange} ref={fileInputRef}/>
                                </Button>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'1%' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="職位"
                                value={adminDetail.WorkPosition}
                                variant="standard"                            
                                color="warning"
                                style={{ width: '30%'}} 
                                InputProps={{
                                    style: {
                                        color: 'black', 
                                        fontSize: '1.2rem', // 文字大小
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black', // 標籤變白色
                                        fontSize: '1.2rem', // 標籤大小
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="帳號"
                                value={adminDetail.Account}
                                variant="standard"
                                color="warning"
                                style={{ width: '30%'}} 
                                InputProps={{
                                    style: {
                                        color: 'black', 
                                        fontSize: '1.2rem', // 文字大小
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black', // 標籤變白色
                                        fontSize: '1.2rem', // 標籤大小
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="權限"
                                value={adminDetail.Auth}
                                variant="standard"
                                color="warning"
                                style={{ width: '30%'}} 
                                InputProps={{
                                    style: {
                                        color: 'black', 
                                        fontSize: '1.2rem', // 文字大小
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black', // 標籤變白色
                                        fontSize: '1.2rem', // 標籤大小
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="員編"
                                value={adminDetail.StaffNo}
                                variant="standard"
                                color="warning"
                                style={{ width: '30%'}} 
                                InputProps={{
                                    style: {
                                        color: 'black', 
                                        fontSize: '1.2rem', // 文字大小
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black', // 標籤變白色
                                        fontSize: '1.2rem', // 標籤大小
                                    },
                                }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label="任職公司"
                                value={adminDetail.CompanyName}
                                style={{ width: '30%'}} // 设置宽度和字体大小
                                variant="standard"
                                color="warning"
                                InputProps={{
                                    style: {
                                        color: 'black', 
                                        fontSize: '1.2rem', // 文字大小
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: 'black', // 標籤變白色
                                        fontSize: '1.2rem', // 標籤大小
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