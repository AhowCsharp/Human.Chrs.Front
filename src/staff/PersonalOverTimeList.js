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
              {model}
          </Typography>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button style={{color:'black'}} onClick={() => setModel('加班紀錄')}>加班申請紀錄</Button>
            <Button style={{color:'black'}} onClick={() => setModel('補卡紀錄')}>補卡申請紀錄</Button>
          </ButtonGroup>
          {
            model !== '補卡紀錄' ? (
          <FormControl variant="standard" sx={{ m: 1, minWidth: 12}}>
            <InputLabel id="demo-simple-select-standard-label">月份</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={month}
              onChange={(e)=>setMonth(e.target.value)}
              label="月份"
            >
              <MenuItem value={1}>1月</MenuItem>
              <MenuItem value={2}>2月</MenuItem>
              <MenuItem value={3}>3月</MenuItem>
              <MenuItem value={4}>4月</MenuItem>
              <MenuItem value={5}>5月</MenuItem>
              <MenuItem value={6}>6月</MenuItem>
              <MenuItem value={7}>7月</MenuItem>
              <MenuItem value={8}>8月</MenuItem>
              <MenuItem value={9}>9月</MenuItem>
              <MenuItem value={10}>10月</MenuItem>
              <MenuItem value={11}>11月</MenuItem>
              <MenuItem value={12}>12月</MenuItem>
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
            <ListItemText primary={model === '加班紀錄' 
            ? (item.OvertimeDate ? `${item.OvertimeDate.split('T')[0]}` : "N/A")
            : (item.CheckDate ? `${item.CheckDate.split('T')[0]} 補卡類別: ${getCheckType(item.CheckType)}` : "N/A")}

            secondary={model === '加班紀錄' ?`時數: ${item.OverHours} 審核情況: ${getValidationStatus(item.IsValidate)}` : `時間: ${item.CheckTime.split('T')[1]} 審核情況: ${getValidationStatus(item.IsValidate)}`}  />
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

const getValidationStatus = (status) => {
  switch (status) {
    case -1:
      return '未通過';
    case 0:
      return '未審核';
    case 1:
      return '已通過';
    default:
      return ''; // 或者其他默認值
  }
};

const getCheckType = (type) => {
  switch (type) {
    case 0:
      return '上班';
    case 1:
      return '下班';
    default:
      return ''; // 或者其他默認值
  }
};
