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
import ErrorAlert from '../errorView/ErrorAlert';
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
  const Language = sessionStorage.getItem('Language');
  const [errOpen,setErropen] = useState(false);
  const [errMsg ,setErrMsg]= useState('');		

  const handleErrOpen = () => {
    setErropen(true);
  }
  const fetchSalaryDetailData = async () => {
    setIsLoading(true);  // 開始加載
    try {       
        const response = await axios.get(`${appsetting.apiUrl}/staff/salarydetail?id=${id}`,config);
        if (response.status === 200) {
          setDetail(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {         
          console.error('Server Response', error.response);
          const serverMessage = error.response.data;
  
          handleErrOpen();
          setErrMsg(serverMessage);
        }
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
    <>
    <List sx={{ width: '95%', bgcolor: 'background.paper',margin:'auto',overflow:'auto' }} style={{height:'80vh',marginTop:'5%'}}>
      <Button variant="text" style={{margin:'1%'}} onClick={handleBackClick}>返回</Button>
      <Typography variant="subtitle2" gutterBottom style={{ marginLeft: '5%' }}>
        {Language === 'TW' ? '實發金額' : 'Net Amount'}
      </Typography>
      <Typography variant="h6" gutterBottom style={{margin:'5%'}}>
          {detail.StaffActualIncomeAmount}
      </Typography>
      <Typography variant="subtitle2" gutterBottom style={{ margin: '5%' }}>
        {Language === 'TW' ? '薪資加項' : 'Salary Additions'}
      </Typography>

      {detail.BasicSalary !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '本薪' : 'Base Salary'} secondary={detail.BasicSalary} />
      </ListItem>:null
      }
      {detail.ParttimeSalary !== 0 && detail.ParttimeSalary?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '時薪*時數' : 'Hourly Rate * Hours'} secondary={detail.ParttimeSalary} />
      </ListItem>:null
      }
      {detail.TotalDaySalary !== 0 && detail.TotalDaySalary?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '日薪*工作天數' : 'TotalDaySalary'} secondary={detail.TotalDaySalary} />
      </ListItem>:null
      }
      {detail.FullCheckInMoney !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '全勤獎金' : 'Attendance Bonus'} secondary={detail.FullCheckInMoney} />
      </ListItem>:null
      }
      {detail.FoodSuportMoney !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '伙食津貼' : 'Meal Allowance'} secondary={detail.FoodSuportMoney} />
      </ListItem>:null
      }
      {detail.Bonus !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '績效獎金' : 'Performance Bonus'} secondary={detail.Bonus} />
      </ListItem>:null
      }
      {detail.OverTimeAmount !== 0 && detail.OverTimeAmount !== null?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '加班費' : 'Overtime Pay'} secondary={detail.OverTimeAmount} />
      </ListItem>:null
      }
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '加項總額' : 'Total Additional Income'} secondary={detail.StaffIncomeAmount} />
      </ListItem>

      <Typography variant="subtitle2" gutterBottom style={{ margin: '5%' }}>
        {Language === 'TW' ? '薪資減項' : 'Deductions'}
      </Typography>
      {detail.ThingHours !== 0?
      <ListItem >
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '事假' : 'Personal Leave'} secondary={detail.ThingHours} />
      </ListItem>:null
      }
      {detail.SickHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '病假' : 'Sick Leave'} secondary={detail.SickHours} />
      </ListItem>:null
      }
      {detail.MenstruationHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '生理假' : 'Menstrual Leave'} secondary={detail.MenstruationHours} />
      </ListItem>:null
      }
      {detail.TakeCareBabyHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '育嬰假' : 'Parental Leave'} secondary={detail.TakeCareBabyHours} />
      </ListItem>:null
      }
      {detail.ChildbirthHours !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '產假' : 'Maternity Leave'} secondary={detail.ChildbirthHours} />
      </ListItem>:null
      }
      {detail.EarlyOrLateAmount !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '遲到早退' : 'Late or Early Leaving'} secondary={detail.EarlyOrLateAmount} />
      </ListItem>:null
      }
      {detail.OutLocationAmount !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '打卡超出範圍' : 'Check-in Out of Range'} secondary={detail.OutLocationAmount} />
      </ListItem>:null
      }
      {detail.IncomeTax !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '所得稅代扣' : 'Income Tax Withholding'} secondary={detail.IncomeTax} />
      </ListItem>:null
      }
      {detail.HealthInsurance !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '健保費' : 'Health Insurance'} secondary={detail.HealthInsurance} />
      </ListItem>:null
      }
      {detail.WorkerInsurance !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '勞保費' : 'Worker\'s Insurance'} secondary={detail.WorkerInsurance} />
      </ListItem>:null
      }
      {detail.EmployeeRetirement !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '員工勞退' : 'Employee Retirement'} secondary={detail.EmployeeRetirement} />
      </ListItem>:null
      }
      {detail.SupplementaryPremium !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '補充保費' : 'Supplementary Premium'} secondary={detail.SupplementaryPremium} />
      </ListItem>:null
      }
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '減項總額' : 'Total Deductions'} secondary={detail.StaffDeductionAmount} />
      </ListItem>
      {/* <Typography variant="subtitle2" gutterBottom style={{ margin: '5%' }}>
        {Language === 'TW' ? '雇主負擔名細' : 'Employer Contributions Details'}
      </Typography>
      {detail.HealthInsuranceFromCompany !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '健保費-雇主負擔' : 'Health Insurance - Employer Contribution'} secondary={detail.HealthInsuranceFromCompany} />
      </ListItem>:null
      }
      {detail.WorkerInsuranceFromCompany !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={Language === 'TW' ? '勞保費-雇主負擔' : 'Worker\'s Insurance - Employer Contribution'} secondary={detail.WorkerInsuranceFromCompany} />
      </ListItem>:null
      }
      {detail.EmployeeRetirementFromCompany !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={Language === 'TW' ? '勞退提繳-雇主' : 'Employee Retirement - Employer Contribution'}
          secondary={detail.EmployeeRetirementFromCompany}
        />
      </ListItem>:null
      }
       {detail.AdvanceFundFromCompany !== 0?
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={Language === 'TW' ? '墊償基金' : 'Advance Fund'}
          secondary={detail.AdvanceFundFromCompany}
        />
      </ListItem>:null
      }
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={Language === 'TW' ? '雇主負擔總額' : 'Total Employer Contributions'}
          secondary={detail.CompanyCostAmount}
        />
      </ListItem> */}
    </List>
    <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
    </>
  );
}