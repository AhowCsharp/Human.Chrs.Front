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
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PageDeviceError from '../pages/PageDeviceError';
import appsetting from '../Appsetting';

export default function PersonalSalaryDetail() {

  const { id } = useParams();
  const config = {
      headers: {
        'X-Ap-Token': appsetting.token,
        'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
        'X-Ap-UserId': sessionStorage.getItem('UserId'),
      }
  };
  const [isLoading, setIsLoading] = useState(true); 
  const [detail,setDetail] = useState([]); 

  const fetchSalaryDetailData = async () => {
    setIsLoading(true);  // 開始加載
    try {       
        const response = await axios.get(`${appsetting.apiUrl}/staff/salarydetail?id=${id}`,config);
        if (response.status === 200) {
          setDetail(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);  // 結束加載
    }
    };
    useEffect(() => {
            fetchSalaryDetailData();
    }, []); 

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(`/staff/salarylist`);
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
    <List sx={{ width: '95%', bgcolor: 'background.paper',margin:'auto' }} style={{height:'85vh'}}>
      <Button variant="text" style={{margin:'1%'}} onClick={handleBackClick}>返回</Button>
      <Typography variant="subtitle2" gutterBottom style={{marginLeft:'5%'}}>
          實發金額
      </Typography>
      <Typography variant="h6" gutterBottom style={{margin:'5%'}}>
          {detail.StaffActualIncomeAmount}
      </Typography>
      <Typography variant="subtitle2" gutterBottom style={{margin:'5%'}}>
          薪資加項
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="本薪" secondary={detail.BasicSalary} />
      </ListItem>
      {detail.FullCheckInMoney !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="全勤獎金" secondary={detail.FullCheckInMoney}/>
      </ListItem>:null
      }
      {detail.Bonus !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="績效獎金" secondary={detail.Bonus} />
      </ListItem>:null
      }
      {detail.OverTimeAmount !== 0 && detail.OverTimeAmount !== null?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="加班費" secondary={detail.OverTimeMoney}/>
      </ListItem>:null
      }
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="加項總額" secondary={detail.StaffIncomeAmount} />
      </ListItem>

      <Typography variant="subtitle2" gutterBottom style={{margin:'5%'}}>
          薪資減項
      </Typography>
      {detail.ThingHours !== 0?
      <ListItem >
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="事假" secondary={detail.ThingHours} />
      </ListItem>:null
      }
      {detail.SickHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="病假" secondary={detail.SickHours}  />
      </ListItem>:null
      }
      {detail.MenstruationHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="生理假" secondary={detail.MenstruationHours}  />
      </ListItem>:null
      }
      {detail.TakeCareBabyHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="育嬰假" secondary={detail.TakeCareBabyHours} />
      </ListItem>:null
      }
      {detail.ChildbirthHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="產假" secondary={detail.ChildbirthHours} />
      </ListItem>:null
      }
      {detail.EarlyOrLateAmount !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="遲到早退" secondary={detail.EarlyOrLateAmount} />
      </ListItem>:null
      }
      {detail.OutLocationAmount !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="打卡超出範圍" secondary={detail.OutLocationAmount}  />
      </ListItem>:null
      }
      {detail.IncomeTax !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="所得稅代扣" secondary={detail.IncomeTax} />
      </ListItem>:null
      }
      {detail.HealthInsurance !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="健保費" secondary={detail.HealthInsurance} />
      </ListItem>:null
      }
      {detail.WorkerInsurance !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="勞保費" secondary={detail.WorkerInsurance} />
      </ListItem>:null
      }
      {detail.EmployeeRetirement !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="員工勞退" secondary={detail.EmployeeRetirement} />
      </ListItem>:null
      }
      {detail.SupplementaryPremium !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="補充保費" secondary= {detail.SupplementaryPremium}/>
      </ListItem>:null
      }
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="減項總額" secondary={detail.StaffDeductionAmount} />
      </ListItem>
      <Typography variant="subtitle2" gutterBottom style={{margin:'5%'}}>
          雇主負擔名細
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="健保費-雇主負擔" secondary={detail.HealthInsuranceFromCompany} />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="勞保費-雇主負擔" secondary={detail.WorkerInsuranceFromCompany} />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="勞退提繳-雇主" secondary={detail.EmployeeRetirementFromCompany}  />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="墊償基金" secondary={detail.AdvanceFundFromCompany} />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="雇主負擔總額" secondary={detail.CompanyCostAmount} />
      </ListItem>
    </List>
  );
}