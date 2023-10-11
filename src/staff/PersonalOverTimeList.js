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
import PageDeviceError from '../pages/PageDeviceError';
import appsetting from '../Appsetting';

export default function PersonalOverTimeList() {
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
    const [isLoading, setIsLoading] = useState(true); 
    const [list,setList] = useState([]); 
    const [month,setMonth] = useState(9); 
    const [model,setModel] = useState('加班紀錄'); 
    const Language = sessionStorage.getItem('Language');
    const fetchOvertimeListData = async () => {
        setIsLoading(true);  // 開始加載
        try {       
            const response = await axios.get(`${appsetting.apiUrl}/staff/monthovertime?month=${month}`,config);
            if (response.status === 200) {
                setList(response.data);
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
              setList(response.data);
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setIsLoading(false);  // 結束加載
      }
  };



    useEffect(() => {
      if(model === '加班紀錄') {
        fetchOvertimeListData();
      }
    }, [month]); 

    useEffect(() => {
      if(model === '加班紀錄') {
        fetchOvertimeListData();
      }
      if(model === '補卡紀錄') {
        fetchAmendCheckListData();
      }
    }, [model]); 


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
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} style={{height:'85vh'}}>    
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
              {model === '加班紀錄' ? (Language === 'TW' ? '加班紀錄' : 'Overtime Record') : ''}
              {model === '補卡紀錄' ? (Language === 'TW' ? '加班紀錄' : 'Card Replacement Record') : ''}
          </Typography>
          <ButtonGroup variant="text" aria-label="text button group">
              <Button style={{ color: 'black' }} onClick={() => setModel(Language === 'TW' ? '加班紀錄' : 'Overtime Record')}> {Language === 'TW' ? '加班申請紀錄' : 'Overtime Application Record'}</Button>
              <Button style={{ color: 'black' }} onClick={() => setModel(Language === 'TW' ? '補卡紀錄' : 'Card Replacement Record')}> {Language === 'TW' ? '補卡申請紀錄' : 'Card Replacement Application Record'}</Button>

          </ButtonGroup>
          {
            model !== '補卡紀錄' ? (
          <FormControl variant="standard" sx={{ m: 1, minWidth: 12}}>
            <InputLabel id="demo-simple-select-standard-label">{Language === 'TW' ? '月份' : 'Month'}</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={month}
              onChange={(e)=>setMonth(e.target.value)}
              label="月份"
            >
                <MenuItem value={1}>{Language === 'TW' ? '1月' : 'January'}</MenuItem>
                <MenuItem value={2}>{Language === 'TW' ? '2月' : 'February'}</MenuItem>
                <MenuItem value={3}>{Language === 'TW' ? '3月' : 'March'}</MenuItem>
                <MenuItem value={4}>{Language === 'TW' ? '4月' : 'April'}</MenuItem>
                <MenuItem value={5}>{Language === 'TW' ? '5月' : 'May'}</MenuItem>
                <MenuItem value={6}>{Language === 'TW' ? '6月' : 'June'}</MenuItem>
                <MenuItem value={7}>{Language === 'TW' ? '7月' : 'July'}</MenuItem>
                <MenuItem value={8}>{Language === 'TW' ? '8月' : 'August'}</MenuItem>
                <MenuItem value={9}>{Language === 'TW' ? '9月' : 'September'}</MenuItem>
                <MenuItem value={10}>{Language === 'TW' ? '10月' : 'October'}</MenuItem>
                <MenuItem value={11}>{Language === 'TW' ? '11月' : 'November'}</MenuItem>
                <MenuItem value={12}>{Language === 'TW' ? '12月' : 'December'}</MenuItem>

            </Select>
          </FormControl> ) : null
          }
        </Box>

        {list.map((item) => (
          <ListItem key={item.id}>
            <ListItemAvatar>
              <Avatar>
                  <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={model === '加班紀錄' 
                    ? (item.OvertimeDate ? `${item.OvertimeDate.split('T')[0]}` : "N/A")
                    : (item.CheckDate ? `${item.CheckDate.split('T')[0]} ${Language === 'TW' ? '補卡類別' : 'Card Replacement Type'}: ${getCheckType(item.CheckType,Language)}` : "N/A")}
                secondary={model === '加班紀錄' 
                    ? `${Language === 'TW' ? '時數' : 'Hours'}: ${item.OverHours} ${Language === 'TW' ? '審核情況' : 'Validation Status'}: ${getValidationStatus(item.IsValidate)}`
                    : `${Language === 'TW' ? '時間' : 'Time'}: ${item.CheckTime.split('T')[1]} ${Language === 'TW' ? '審核情況' : 'Validation Status'}: ${getValidationStatus(item.IsValidate,Language)}`}
            />

              <Tooltip title={item.Reason}>
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

