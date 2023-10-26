import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getDaysInMonth, getDay, format } from 'date-fns';
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
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import appsetting from '../Appsetting';


// 获取当前日期
const  currentDate = new Date();

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

export default function CheckInOutDetailList({staffId}) {
  const [records,setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      'X-Ap-Token': appsetting.token,
      'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
      'X-Ap-UserId': sessionStorage.getItem('UserId'),
      'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
    }
  };
  const fetchCheckInOutData = async () => {
    try {       
      const response = await axios.get(`${appsetting.apiUrl}/staff/checkdetails?start=${firstDayString}&end=${lastDayString}&staffId=${staffId}`,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setRecords(response.data);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  const calculateWorkdays = (month) => {
    console.log(month)
    const daysInMonth = getDaysInMonth(new Date(new Date().getFullYear(), month - 1));
    let numWorkdays = 0;
    let numHolidays = 0;

    // eslint-disable-next-line no-plusplus
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = getDay(new Date(new Date().getFullYear(), month - 1, day)); // 星期天 = 0, 星期六 = 6
      if (currentDay !== 0 && currentDay !== 6) {
        numWorkdays += 1;
      } else {
        numHolidays += 1;
      }
    }

    // 此处您可以添加检测公共假日的代码，并相应地调整numWorkdays和numHolidays

    return `正常工作日: ${numWorkdays} 假日: ${numHolidays} 實際出勤天數: ${records.length}`;
  };


    useEffect(() => {
        fetchCheckInOutData();
    }, []); 
    return (
      <List sx={{ width: '100%', minWidth: 300, bgcolor: 'background.paper' }}>
        <Typography variant="button" display="block" gutterBottom>
          {calculateWorkdays((new Date().getMonth()))} <br/>
          假日並不包含國定假日
        </Typography>
        {
          loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <CircularProgress />
            </div>
          ) : (
            records.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',color:'red',marginTop:'20px'}}>
                <Typography variant="subtitle1">該員工本月並未出勤</Typography>
              </div>
            ) : (
              records.map((record) => (
                <ListItem key={uuidv4()}>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={record.CheckInTime.split("T")[0]} 
                    secondary={`上班打卡${record.CheckInTime.split("T")[1].match(/^(\d{2}:\d{2})/)[1]} 下班打卡${record.CheckOutTime.split("T")[1].match(/^(\d{2}:\d{2})/)[1]}`} 
                  />
                  <Tooltip title={generateTooltip(record)}>
                    <IconButton>
                      <WorkHistoryIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            )
          )
        }
      </List>
    );    
}


function generateTooltip(record) {
  const messages = [];

  if (record.IsCheckInLate === 1) {
    messages.push(`遲到${record.CheckInLateTimes}分鐘`);
  }

  if (record.IsCheckOutEarly === 1) {
    messages.push(`早退${record.CheckOutEarlyTimes}分鐘`);
  }

  if (record.IsCheckInOutLocation === 1) {
    messages.push(`上班打卡位於定位外`);
  }

  if (record.IsCheckOutOutLocation === 1) {
    messages.push(`下班打卡位於定位外`);
  }

  return messages.join(', ');
}