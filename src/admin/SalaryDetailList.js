import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Typography from '@mui/material/Typography';

export default function SalaryDetailList({detail,plusTotal,minusTotal,companyCostTotal}) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle2" gutterBottom>
          實發金額
      </Typography>
      <Typography variant="h6" gutterBottom>
          {plusTotal-minusTotal}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
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
      {detail.OverTimeMoney !== 0 && detail.OverTimeMoney !== null?
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
        <ListItemText primary="加項總額" secondary={plusTotal} />
      </ListItem>

      <Typography variant="subtitle2" gutterBottom>
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
        <ListItemText primary="減項總額" secondary={minusTotal} />
      </ListItem>
      <Typography variant="subtitle2" gutterBottom>
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
        <ListItemText primary="雇主負擔總額" secondary={companyCostTotal} />
      </ListItem>
    </List>
  );
}