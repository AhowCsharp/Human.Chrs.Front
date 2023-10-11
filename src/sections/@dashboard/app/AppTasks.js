import PropTypes from 'prop-types';
import { useState } from 'react';
import dayjs from 'dayjs';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import {
  Card,
  Stack,
  Divider,
  Popover,
  Checkbox,
  MenuItem,
  IconButton,
  CardHeader,
  FormControlLabel,
} from '@mui/material';
import Typography from '@mui/material/Typography';
// components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { useLanguage } from '../../../layouts/LanguageContext'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

AppTasks.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppTasks({ title, subheader, list, ...other }) {
  const { control } = useForm({
    defaultValues: {
      taskCompleted: ['2'],
    },
  });
  const { language } = useLanguage();
  return (
      <Card {...other} style={{width:'90%'}}>
        <CardHeader title={title} subheader={subheader} style={{marginBottom:'5%'}}/>
        <Controller
          name="taskCompleted"
          control={control}
          render={({ field }) => {
            const onSelected = (task) =>
              field.value.includes(task) ? field.value.filter((value) => value !== task) : [...field.value, task];

            return (
              <>
                {list.length === 0 ? (
                  <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100px">
                    <Typography variant="h6" color="textSecondary">
                      {language === 'TW' ? '目前沒有資料' : 'No data available'}
                    </Typography>
                  </Box>
                ) : (
                  list.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      checked={field.value.includes(task.id)}
                      onChange={() => field.onChange(onSelected(task.id))}
                    />
                  ))
                )}
              </>
            );
          }}
        />
      </Card>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.shape({
    Id: PropTypes.number,
    VacationTypeName: PropTypes.string,
  }),
};

function TaskItem({ task, checked, onChange }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleMarkComplete = () => {
    handleCloseMenu();
    console.log('MARK COMPLETE', task.id);
  };

  const handleShare = () => {
    handleCloseMenu();
    console.log('SHARE', task.id);
  };

  const handleEdit = () => {
    handleCloseMenu();
    console.log('EDIT', task.id);
  };

  const handleDelete = () => {
    handleCloseMenu();
    console.log('DELETE', task.id);
  };

  return (
    <Stack
      direction="row"
      sx={{
        px: 1,
        py: 0,
        ...(checked && {
          color: 'text.disabled',
          textDecoration: 'line-through',
        }),
        marginBottom:'10%',
      }}
    >
      {/* 移除或注釋掉以下的FormControlLabel */}
      {/* <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} />}
        label={task.label}
        sx={{ flexGrow: 1, m: 0 }}
      /> */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0} rowSpacing={0}>
          <Grid item xs={3} >
            <Item>
              <Chip label={task.VacationTypeName} style={{alignItems:"center",justifyContent:"center"}} color="primary" size="small"/>           
            </Item>
          </Grid>
          <Grid item xs={9} />
          
          <Grid item xs={9}>
    <Item>
      <Box display="flex" alignItems="center" justifyContent="center" style={{ height: "100%", fontSize: "13px"}}>
        {dayjs(task.ActualStartDate).format("YYYY-MM-DD HH:mm")}~{dayjs(task.ActualEndDate).format("YYYY-MM-DD HH:mm")}
      </Box>
    </Item>
  </Grid>
  <Grid item xs={3}>
    <Item>
      <Box display="flex" alignItems="center" justifyContent="center" style={{ height: "100%" }}>
        {task.IsPass === 0 && task.AuditDate === null ? <Chip label='審核中' color="warning" size="small" style={{color:'white',paddingBottom:'2px'}}/> : null}
        {task.IsPass === -1 && task.AuditDate !== null ? <Chip label='未通過' color="error" size="small" style={{color:'white',paddingBottom:'2px'}}/> : null}
        {task.IsPass === 1 && task.AuditDate !== null ? <Chip label='已通過' color="success" size="small" style={{color:'white',paddingBottom:'2px'}}/> : null}
      </Box>
    </Item>
  </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
