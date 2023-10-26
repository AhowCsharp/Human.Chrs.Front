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
import WorkIcon from '@mui/icons-material/Work';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useLanguage } from '../layouts/LanguageContext'
import PageDeviceError from '../pages/PageDeviceError';
import appsetting from '../Appsetting';

export default function PersonalOverTimeList() {
    const { language, chooseLang } = useLanguage();
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
        }
    };
    const [isLoading, setIsLoading] = useState(true); 
    const [overTimelist,setOverTimelist] = useState([]); 
    const [amendChecklist,setAmendChecklist] = useState([]); 
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [model,setModel] = useState('加班紀錄'); 
    const fetchOvertimeListData = async () => {
        setIsLoading(true);  // 開始加載
        try {       
            const response = await axios.get(`${appsetting.apiUrl}/staff/monthovertime?month=${month}`,config);
            if (response.status === 200) {
                setOverTimelist(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);  // 結束加載
        }
    };

    const fetchAmendCheckListData = async () => {
      setIsLoading(true);  // 開始加載
      try {       
          const response = await axios.get(`${appsetting.apiUrl}/staff/amendchecklist`,config);
          console.log(response.data)
          if (response.status === 200) {
            setAmendChecklist(response.data);
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setIsLoading(false);  // 結束加載
      }
  };



  useEffect(() => {
    if (model === '加班紀錄') {
      fetchOvertimeListData();
    } else if (model === '補卡紀錄') {
      fetchAmendCheckListData();
    }
  }, [model, month]); 
 

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
              {model === '加班紀錄' ? (language === 'TW' ? '加班紀錄' : 'Overtime Record') : ''}
              {model === '補卡紀錄'? (language === 'TW' ? '補卡紀錄' : 'Card Replacement Record') : ''}
          </Typography>
          <ButtonGroup variant="text" aria-label="text button group">
              <Button style={{ color: 'black' }} onClick={() => setModel('加班紀錄')}> {language === 'TW' ? '加班申請紀錄' : 'Overtime Application Record'}</Button>
              <Button style={{ color: 'black' }} onClick={() => setModel('補卡紀錄')}> {language === 'TW' ? '補卡申請紀錄' : 'Card Replacement Application Record'}</Button>

          </ButtonGroup>
          {
            model !== '補卡紀錄' ? (
          <FormControl variant="standard" sx={{ m: 1, minWidth: 12}}>
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
          </FormControl> ) : null
          }
        </Box>

        {
  model === '加班紀錄' ? (
    overTimelist.map((item) => (
      <ListItem key={item.id}>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item ? `${item.OvertimeDate.split('T')[0]}` : "N/A"}
          secondary={`${language === 'TW' ? '時數' : 'Hours'}: ${item.OverHours} ${language === 'TW' ? '審核情況' : 'Validation Status'}: ${getValidationStatus(item.IsValidate,language)}`}
        />
        <Tooltip title={item.Reason}>
          <IconButton>
            <WorkHistoryIcon />
          </IconButton>
        </Tooltip>
      </ListItem>
          ))
        ) : (
          amendChecklist.map((item) => (
            <ListItem key={item.id}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.CheckDate ? `${item.CheckDate.split('T')[0]} ${language === 'TW' ? '補卡類別' : 'Card Replacement Type'}: ${getCheckType(item.CheckType, language)}` : "N/A"}
                secondary={`${language === 'TW' ? '時間' : 'Time'}: ${item.CheckTime.split('T')[1]} ${language === 'TW' ? '審核情況' : 'Validation Status'}: ${getValidationStatus(item.IsValidate, language)}`}
              />
              <Tooltip title={item.Reason}>
                <IconButton>
                  <WorkHistoryIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))
        )
      }

      </List>
    </>
  );
}

const getValidationStatus = (status, language) => {
  switch (status) {
    case -1:
      return language === 'TW' ? '未通過' : 'Not Approved';
    case 0:
      return language === 'TW' ? '未審核' : 'Not Reviewed';
    case 1:
      return language === 'TW' ? '已通過' : 'Approved';
    default:
      return ''; // 或者其他默認值
  }
};


const getCheckType = (type, language) => {
  switch (type) {
    case 0:
      return language === 'TW' ? '上班' : 'Check In';
    case 1:
      return language === 'TW' ? '下班' : 'Check Out';
    default:
      return ''; // 或者其他默認值
  }
};

