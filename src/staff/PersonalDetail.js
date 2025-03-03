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
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fingerprint from '@mui/icons-material/Fingerprint';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PageDeviceError from '../pages/PageDeviceError';
import PageDetailInfoError from '../pages/PageDetailInfoError';
import appsetting from '../Appsetting';
import ErrorAlert from '../errorView/ErrorAlert';
import FinishedAlert from '../finishView/FinishedAlert';

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
    const Language = sessionStorage.getItem('Language');
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
    const [open, setOpen] = React.useState(false);
    const [resetRequest,setResetRequest] = useState({
        Password:'',
        NewPassword:'',
    });
    const [errOpen,setErropen] = useState(false);
    const [errMsg ,setErrMsg]= useState('');
    const [okOpen,setOkopen] = useState(false);
    const handleOkOpen = () => {
      setOkopen(true);
    }		

    const handleErrOpen = () => {
      setErropen(true);
    }


    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

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
            if (error.response) {         
                console.error('Server Response', error.response);
                const serverMessage = error.response.data;
        
                handleErrOpen();
                setErrMsg(serverMessage);
            }
        } finally {
            setIsLoading(false);  // 結束加載
        }
    };
    useEffect(() => {
            fetchStaffDetailData();
    }, []); 

    const onFileChange = async (e) => {
        if (e.target.files.length === 0) {
            return;
        }
    
        const selectedFile = e.target.files[0];
        // 直接將文件作為參數傳遞
        await uploadAvatar(selectedFile);
    
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const uploadAvatar = async (fileToUpload) => {
        if (!fileToUpload) {
            console.error('No file selected!');
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', fileToUpload);
    
        try {
            const response = await axios.post(`${appsetting.apiUrl}/staff/avatar`, formData, config);
            if(response.status === 200) {
                const newAvatarUrl = `${appsetting.apiUrl}${response.data}`;
                sessionStorage.setItem('AvatarUrl', newAvatarUrl);
                setAvatarUrl(newAvatarUrl); // 這行會觸發組件重新渲染
            }
        } catch (error) {
            if (error.response) {         
                console.error('Server Response', error.response);
                const serverMessage = error.response.data;
        
                handleErrOpen();
                setErrMsg(serverMessage);
            }else {
                handleErrOpen();
                setErrMsg('請選擇畫質較低之圖檔');
            }
            
            console.error('Error uploading avatar:', error);
        }
    };

    const handleReset = async () => {
        try {
          const response = await axios.put(
              `${appsetting.apiUrl}/staff/resetpw`, 
              resetRequest, // 如果你不需要傳遞body，可以設為null
              {
                  ...config, // 展開你的config，使其成為這個配置對象的一部分
              }
          );
          if (response.status === 200) {
              handleOkOpen();
              handleClose();
          } 

      } catch (error) {
          if (error.response) {         
            console.error('Server Response', error.response);
            const serverMessage = error.response.data;
    
            handleErrOpen();
            setErrMsg(serverMessage);
          }
          console.error('Error calling API:', error);
      }
    };


    const handleInputChange = (event, propertyName) => {
        const value = event.target ? event.target.value : event;
        
        setResetRequest((prevData) => ({
            ...prevData,
            [propertyName]: value,
        }));   
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
                <PageDetailInfoError/>
            </>
        );
    }
    

    return (
        <>
            {isMobile && staffDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%',position: 'relative' }}>
                <Box sx={{width: '100%', height:`800px`,backgroundColor:'black',padding:'5%'}}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>    
                                <Avatar
                                    alt={sessionStorage.getItem('StaffName')}
                                    src={avatarUrl}
                                    sx={{ width: 48, height: 48 }}
                                /> 
                                <Typography variant="h3" gutterBottom style={{color:'white',marginLeft:'5%'}}>
                                    {staffDetail.Name}'s {Language === 'TW' ? '個人資料' : 'Personal Information'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>    
                                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} style={{color:'white'}}>
                                    {Language === 'TW' ? '更換大頭貼' : 'Change Profile Picture'}
                                    <VisuallyHiddenInput type="file" onChange={onFileChange} ref={fileInputRef}/>
                                </Button>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>     
                                <Typography variant="h6" gutterBottom style={{color:'white'}}>
                                    {staffDetail.EnglishName} {Language === 'TW' ? '你好' : 'Hello'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',marginTop:'10%' }}>     
                                <TextField
                                disabled
                                id="outlined-required"
                                label={Language === 'TW' ? '部門' : 'Department'}
                                value={staffDetail.Department}
                                style={{width:'80%'}}
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
                                label={Language === 'TW' ? '電話號碼' : 'Phone Number'}
                                value={staffDetail.PhoneNumber}
                                style={{width:'80%'}}
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
                                label={Language === 'TW' ? '信箱' : 'Mail'}
                                value={staffDetail.Email}
                                style={{width:'80%'}}
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
                                label={Language === 'TW' ? '職稱' : 'Job Title'}
                                value={staffDetail.LevelPosition}
                                style={{width:'80%'}}
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
                                label={Language === 'TW' ? '工作地點' : 'Work Location'}
                                value={staffDetail.WorkLocation}
                                style={{width:'80%'}}
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
                                label={Language === 'TW' ? '任職公司' : 'Company Name'}
                                value={staffDetail.CompanyName}
                                style={{width:'80%'}}
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
                                label={Language === 'TW' ? '到職日' : 'Date of Hire'}
                                value={staffDetail.EntryDate.split('T')[0]}
                                style={{width:'80%'}}
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
                                    <Button variant="text" endIcon={<Fingerprint style={{color:'red'}}/>} style={{color:'white'}} onClick={handleClickOpen}>
                                            變更密碼
                                    </Button>                       
                            </Grid>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>變更密碼-ResetPassword</DialogTitle>
                                <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="原密碼-Now Password"
                                    type="password"
                                    value={resetRequest.Password}
                                    onChange={(e) => handleInputChange(e, 'Password')}
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="新密碼-New Password"
                                    type="password"
                                    value={resetRequest.NewPassword}
                                    onChange={(e) => handleInputChange(e, 'NewPassword')}
                                    fullWidth
                                    variant="standard"
                                />
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleClose}>取消-Cancel</Button>
                                <Button onClick={handleReset}>送出-Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Box>                 
                </Box>
            </Box>
            )}

            <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
            <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
        </>
    );
}