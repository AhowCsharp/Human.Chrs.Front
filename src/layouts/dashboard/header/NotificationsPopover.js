import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import TextsmsIcon from '@mui/icons-material/Textsms';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import ErrorAlert from '../../../errorView/ErrorAlert';
import appsetting from '../../../Appsetting';
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [errOpen,setErropen] = useState(false);
  const [errMsg ,setErrMsg]= useState('');		

  const handleErrOpen = () => {
    setErropen(true);
  }
    const adminToken = sessionStorage.getItem('AdminToken');
    const isStaff = !adminToken;
    const baseHeaders = {
      'X-Ap-Token': appsetting.token,
      'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
      'X-Ap-UserId': sessionStorage.getItem('UserId')
  };
  
  const adminHeaders = isStaff ? {} : { 'X-Ap-AdminToken': sessionStorage.getItem('AdminToken') };
  
  const config = {
      headers: {
          ...baseHeaders,
          ...adminHeaders
      }
  };
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let ws;
    const staffId = parseInt(sessionStorage.getItem('UserId').split(',')[0], 10);
    const connect = () => {
        // 根據是員工還是管理者，建立不同的WebSocket URL
        const wsURL = isStaff 
            ? `${appsetting.wss}?staffId=${staffId}`
            : `${appsetting.wss}?AdminToken=${adminToken}&AdminId=${staffId}`;

        ws = new WebSocket(wsURL);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send('heartbeat');
                }
            }, 30000);
        };

        ws.onmessage = (event) => {
            if (event.data !== 'heartbeat') {
                const newNotificationJsonArray = JSON.parse(event.data);
                console.log(newNotificationJsonArray)
                setNotifications(newNotificationJsonArray);
            }
        };

        ws.onclose = (e) => {
            console.log('WebSocket Disconnected', e.reason);
            if (e.code !== 1000) {
                setTimeout(connect, 1000);
            }
        };
    };

    connect();

    return () => {
        if (ws) {
            ws.close(1000, "React component unmounting");
        }
    };
}, []);


  const totalUnRead = notifications.filter((item) => item.IsUnRead === true).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };


  const handleReadAllStatus = async () => {
    const notificationIds = notifications.map((notification) => notification.id);

    try {
        const baseUrl = appsetting.apiUrl;
        const path = isStaff ? 'staff' : 'admin';
        const url = `${baseUrl}/${path}/readallstatus`;

        const request = { NotificationIds: notificationIds };
        const response = await axios.patch(url, request, config);
      
        if (response.status === 200) {
            console.log('通知所有读取状态已更改成功');
        }
    } catch (error) {
        console.error("Error updating notification read status:", error);
        if (error.response) {         
          console.error('Server Response', error.response);
          const serverMessage = error.response.data;
  
          handleErrOpen();
          setErrMsg(serverMessage);
        }
    }
}

  

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              你有 {totalUnRead} 條未讀訊息
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleReadAllStatus}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
          {notifications
            .filter((notification) => notification.IsUnRead === true)
            .map((notification) => (
              <NotificationItem key={notification.id} notification={notification} isStaff={isStaff}/>
            ))}

          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
          {notifications
            .filter((notification) => notification.IsUnRead === false)
            .map((notification) => (
              <NotificationItem key={notification.id} notification={notification} isStaff={isStaff}/>
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={handleReadAllStatus}>
            已讀所有訊息
          </Button>
        </Box>
      </Popover>
      <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    CreateDate: PropTypes.string,
    id: PropTypes.number,
    IsUnRead: PropTypes.bool,
    Title: PropTypes.string,
    Description: PropTypes.string,
    Type: PropTypes.string,
    Avatar: PropTypes.any,
    EventDetail: PropTypes.string,
    EventType: PropTypes.string,
  }),
};

function NotificationItem({ notification,isStaff }) {

  const baseHeaders = {
    'X-Ap-Token': appsetting.token,
    'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
    'X-Ap-UserId': sessionStorage.getItem('UserId')
  };

  const adminHeaders = isStaff ? {} : { 'X-Ap-AdminToken': sessionStorage.getItem('AdminToken') };

  const config = {
    headers: {
        ...baseHeaders,
        ...adminHeaders
    }
};

  const handleReadLogInsert = async (notificationId) => {
    console.log(isStaff)
    try {
        const baseUrl = appsetting.apiUrl;
        const path = isStaff ? 'staff' : 'admin';
        const url = `${baseUrl}/${path}/readstatus?notificationId=${notificationId}`;

        const response = await axios.patch(url, null, config);
        if (response.status === 200) {
            console.log('通知读取状态已更改成功');
        }
    } catch (error) {
        console.error("Error updating notification read status:", error);
        alert('發生錯誤');
    }
}


  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.IsUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={()=>handleReadLogInsert(notification.id)}
    >
      <ListItemAvatar>
        <Avatar>
          <TextsmsIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={isStaff?notification.Title:notification.EventType}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
              justifyContent: 'space-between', // 使用 justify-content 将子元素分散放置
            }}
          >
            {isStaff?notification.Description:notification.EventDetail}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: '115px',marginLeft:'5px' }}>
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {formatDateTime(notification.CreateDate)}
            </div>
          </Typography>
        }
      />

    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.Title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.Description)}
      </Typography>
    </Typography>
  );

  if (notification.Type === 'order_placed') {
    return {
      avatar: <img alt={notification.Title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.Type === 'order_shipped') {
    return {
      avatar: <img alt={notification.Title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.Type === 'mail') {
    return {
      avatar: <img alt={notification.Title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.Type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.Avatar ? <img alt={notification.Title} src={notification.Avatar} /> : null,
    title,
  };
}

function formatDateTime(inputDateString) {
  const inputDate = new Date(inputDateString);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');
  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
