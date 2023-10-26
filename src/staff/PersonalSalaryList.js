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
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PageDeviceError from '../pages/PageDeviceError';
import { useLanguage } from '../layouts/LanguageContext'
import appsetting from '../Appsetting';

export default function PersonalSalaryList() {

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

    const fetchSalaryListData = async () => {
        setIsLoading(true);  // 開始加載
        try {       
            const response = await axios.get(`${appsetting.apiUrl}/staff/salary`,config);
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
            fetchSalaryListData();
    }, []); 
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
    <>
      {list.length === 0?     
      <Alert severity="success" color="info" style={{marginTop:'80%'}}>
        目前還沒有資料<br/>
        There is no data available at the moment!
      </Alert>:null}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} style={{height:'80vh'}}>
        {list.map((item) => (
          <ListItem key={item.id}>
            <ListItemAvatar onClick={()=>handleSalaryDetailClick(item.id)}>
              <Avatar>
                  <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${item.SalaryOfMonth}${language === 'TW' ? '月薪資單' : ' Monthly Salary Statement'}`}
              secondary={`發放日期: ${item.IssueDate.split('T')[0]}`}
            />
          </ListItem>
        ))}
      </List>
    </>
   
  );
}