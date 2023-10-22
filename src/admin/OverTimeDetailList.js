import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import appsetting from '../Appsetting';


// 获取当前日期
const currentDate = new Date();

// 将当前日期设置为本月的第一天
currentDate.setDate(1);

// 获取上个月的日期
currentDate.setMonth(currentDate.getMonth() - 1);

// 获取上个月的第一天
const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// 获取上个月的最后一天
const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 添加前导零
  const day = date.getDate().toString().padStart(2, '0'); // 添加前导零
  return `${year}-${month}-${day}`;
}

// 将日期转换为字符串
const firstDayString = formatDate(firstDayOfLastMonth);
const lastDayString = formatDate(lastDayOfLastMonth);

export default function OverTimeDetailList({staffId}) {
  const [overTimes,setOverTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = {
    headers: {
      'X-Ap-Token': appsetting.token,
      'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
      'X-Ap-UserId': sessionStorage.getItem('UserId'),
      'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
    }
  };
  const fetchOverTimeData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/staff/overtime?start=${firstDayString}&end=${lastDayString}&staffId=${staffId}`,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setOverTimes(response.data);
        setLoading(false); 
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
    };
    useEffect(() => {
        fetchOverTimeData();
    }, []); 
    return (
      <List sx={{ width: '100%', minWidth: 200, bgcolor: 'background.paper' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : overTimes.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography textAlign="center" color="text.secondary">
              尚無加班資料
            </Typography>
          </Box>
        ) : (
          overTimes.map((overtime) => (
            <React.Fragment key={overtime.Id /* 如果每个overtime对象有一个唯一的Id字段，请使用它作为key */}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={overtime.OvertimeDate.split("T")[0]} 
                  secondary={`加班時數:${overtime.OverHours} `}
                />
                <Tooltip title={`審核者:${overtime.Inspector}--審核日:${overtime.ValidateDate.split("T")[0]}`}>
                  <IconButton>
                    <WorkHistoryIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            </React.Fragment>
          ))
        )}
      </List>
    );   
}
