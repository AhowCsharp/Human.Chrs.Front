import React, { useState, useEffect,useRef } from 'react';
import { useNavigate,useParams  } from 'react-router-dom';
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useLanguage } from '../layouts/LanguageContext'
import PageDeviceError from '../pages/PageDeviceError';
import appsetting from '../Appsetting';

export default function PersonalCheckList() {
   
    const { language, chooseLang } = useLanguage();
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
        }
    };
    const [isLoading, setIsLoading] = useState(true); 
    const [list,setList] = useState([]); 
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const fetchCheckListData = async () => {
        setIsLoading(true);  // 開始加載
        try {       
            const response = await axios.get(`${appsetting.apiUrl}/staff/personalchecks?month=${month}`,config);
            if (response.status === 200) {
                setList(response.data);
                console.log(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);  // 結束加載
        }
    };

    useEffect(() => {
      fetchCheckListData();
    }, [month]); 






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
                    backgroundColor: 'transparent' 
                }}>
                <CircularProgress color="success" />
            </Box>
        );
    }
  return (
    <>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }} style={{height:'80vh',marginTop:'5%'}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{justifyContent:'center',display:'flex' }}>
          <Typography variant="h4" gutterBottom>
            {language === 'TW' ? '出勤狀況' : 'Attendance Status'}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{justifyContent:'center',display:'flex' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 12,marginLeft:'3%'}}>
          <InputLabel id="demo-simple-select-standard-label">{language === 'TW' ? '月份' : 'Month'}</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={month}
            onChange={(e)=>setMonth(e.target.value)}
            label="月份"
          >
            <MenuItem value={1}>{language === 'TW' ? '1月' : 'January'}</MenuItem>
            <MenuItem value={2}>{language === 'TW' ? '2月' : 'February'}</MenuItem>
            <MenuItem value={3}>{language === 'TW' ? '3月' : 'March'}</MenuItem>
            <MenuItem value={4}>{language === 'TW' ? '4月' : 'April'}</MenuItem>
            <MenuItem value={5}>{language === 'TW' ? '5月' : 'May'}</MenuItem>
            <MenuItem value={6}>{language === 'TW' ? '6月' : 'June'}</MenuItem>
            <MenuItem value={7}>{language === 'TW' ? '7月' : 'July'}</MenuItem>
            <MenuItem value={8}>{language === 'TW' ? '8月' : 'August'}</MenuItem>
            <MenuItem value={9}>{language === 'TW' ? '9月' : 'September'}</MenuItem>
            <MenuItem value={10}>{language === 'TW' ? '10月' : 'October'}</MenuItem>
            <MenuItem value={11}>{language === 'TW' ? '11月' : 'November'}</MenuItem>
            <MenuItem value={12}>{language === 'TW' ? '12月' : 'December'}</MenuItem>
          </Select>
        </FormControl>
        </Grid>
      </Grid>
    </Box>
      {list.length === 0?     
      <Alert severity="success" color="info" style={{marginTop:'50%'}}>
        目前還沒有資料 — 請選擇正確月份!<br/>
        There is no data available at the moment - please select the correct month!
      </Alert>:null}
      {list.map((item) => (
        <ListItem key={item.id}>
          <ListItemAvatar>
            <Avatar>
                <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${item.CheckInTime ? item.CheckInTime.split('T')[0] : language === 'TW' ? '未打卡' : 'Not Yet'}`}
            secondary={`${
              language === 'TW' ? '上班' : 'Work In'
            }: ${
              item.CheckInTime 
                ? item.CheckInTime.split('T')[1].substring(0, 5) // 提取 HH:MM
                : language === 'TW' ? '未打卡' : 'Not Yet'
            } ${
              language === 'TW' ? '下班' : 'Work Out'
            }: ${
              item.CheckOutTime 
                ? item.CheckOutTime.split('T')[1].substring(0, 5) // 提取 HH:MM
                : language === 'TW' ? '未打卡' : 'Not Yet'
            }`}
          />
            <Tooltip title={generateTooltip(item,language)}>
                <IconButton>
                  <WorkHistoryIcon />
                </IconButton>
            </Tooltip>
        </ListItem>
      ))}
    </List>
    </>
  );
}


function generateTooltip(record, language) {
  const messages = [];

  if (record.IsCheckInLate === 1) {
    messages.push(`${language === 'TW' ? '遲到' : 'Late'} ${record.CheckInLateTimes} ${language === 'TW' ? '分鐘' : 'minutes'}`);
  }

  if (record.IsCheckOutEarly === 1) {
    messages.push(`${language === 'TW' ? '早退' : 'Early Leave'} ${record.CheckOutEarlyTimes} ${language === 'TW' ? '分鐘' : 'minutes'}`);
  }

  if (record.IsCheckInOutLocation === 1) {
    messages.push(`${language === 'TW' ? '上班打卡位於定位外' : 'Check-in location outside designated area'}`);
  }

  if (record.IsCheckOutOutLocation === 1) {
    messages.push(`${language === 'TW' ? '下班打卡位於定位外' : 'Check-out location outside designated area'}`);
  }

  return messages.join(', ');
}
