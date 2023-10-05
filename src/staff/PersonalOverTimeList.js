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
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CircularProgress from '@mui/material/CircularProgress';
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

    useEffect(() => {
      fetchOvertimeListData();
    }, [month]); 

    const navigate = useNavigate();

    const handleSalaryDetailClick = (id) => {
        navigate(`/staff/salarydetail/${id}`);
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
                    backgroundColor: 'transparent' 
                }}>
                <CircularProgress color="success" />
            </Box>
        );
    }
  return (
    
    <List sx={{ width: '100%', bgcolor: 'background.paper' }} style={{height:'85vh'}}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 12,marginLeft:'3%' }}>
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
      </FormControl>
      {list.map((item) => (
        <ListItem key={item.id}>
          <ListItemAvatar>
            <Avatar>
                <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={`${item.OvertimeDate.split('T')[0]}`} secondary={`時數: ${item.OverHours} 審核情況${getValidationStatus(item.IsValidate)}`}  />
            <Tooltip title={item.Reason}>
                <IconButton>
                  <WorkHistoryIcon />
                </IconButton>
            </Tooltip>
        </ListItem>
      ))}
    </List>
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
