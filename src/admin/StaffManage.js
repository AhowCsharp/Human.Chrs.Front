import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import StaffSearch from './StaffSearch';

const Transition = React.forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);



export default function StaffManage() {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const columns = [
     
        {   field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'StaffNo',
            headerName: '員工編號',
            width: 100,
            editable: true,
        },
        {
            field: 'StaffName',
            headerName: '姓名',
            width: 150,
            editable: true,
        },
        {
            field: 'Department',
            headerName: '部門',
            width: 100,
            editable: true,
        },
        {
            field: 'LevelPosition',
            headerName: '職稱',
            width: 100,
            editable: true,
        },
        {
            field: 'Email',
            headerName: '信箱',
            width: 200,
            editable: true,
        },
        {
            field: 'StaffPhoneNumber',
            headerName: '手機號碼',
            width: 150,
            editable: true,
        },
        {
            field: 'EntryDate',
            headerName: '入職日期',
            width: 150,
            editable: true,
            renderCell: (params) => {
                const date = new Date(params.value);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            },
        },
        {
            field: 'WorkPosition',
            headerName: '工作地點',
            width: 150,
            editable: true,
        },
        {
            field: 'details',
            headerName: '個人詳細資料',
            width: 200,
            renderCell: (params) => (
              <Button onClick={() => handleDetailsClick(params.row.id)}>
                查看詳細資料
              </Button>
            ),
        } 
    ];
    const [open, setOpen] = useState(false);
    const [isCreate,setIsCreate] = useState(false);
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [departments,setDepartments] = useState([]);
    const [gender,setGender] = useState('男性');
    const [staff, setStaff] = useState({
        id: 0,
        StaffNo: '',
        CompanyId: parseInt(sessionStorage.getItem('CompanyId'), 10),
        StaffAccount: '',
        StaffPassWord: '',
        Department: '',
        EntryDate: dayjs(getCurrentDate()),
        ResignationDate: dayjs(getCurrentDate()),
        LevelPosition: '',
        WorkPosition: '',
        Email: '',
        Status: 1,
        SpecialRestDays: 0,
        SickDays: 30,
        ThingDays: 14,
        ChildbirthDays: 0,
        DeathDays: 8,
        MarryDays: 8,
        SpecialRestHours: 0,
        SickHours: 0,
        ThingHours: 0,
        ChildbirthHours: 0,
        DeathHours: 0,
        MarryHours: 0,
        EmploymentTypeId: 1,
        StaffPhoneNumber: '',
        StaffName: '',
        Auth: 0,
        DepartmentId: 1,
        MenstruationDays: 1,
        MenstruationHours: 0,
        TocolysisDays: 7,
        TocolysisHours: 0,
        TackeCareBabyDays: 730,
        TackeCareBabyHours: 0,
        PrenatalCheckUpDays: 7,
        PrenatalCheckUpHours: 0,
        OverTimeHours: 0,
        StayInCompanyDays: 0,
        Gender: gender
    });
    
    

    // const navigate = useNavigate();

    // useEffect(() => {
    //     const token = sessionStorage.getItem('jwtData');
    //     if (!token) {
    //         navigate('/login');
    //     }
    // }, [navigate]);
    function handleDetailsClick(id) {
        console.log("查看詳細資料的ID:", id);
        // 根据ID做您想要的操作，例如导航到详细页面、打开模态框等。
    }
    const handleClickOpen = (status) => {
        setIsCreate(status)
        setOpen(true);
    };
    
      const handleClose = () => {
        setStaff({
            id: 0,
            StaffNo: '',
            CompanyId: parseInt(sessionStorage.getItem('CompanyId'), 10),
            StaffAccount: '',
            StaffPassWord: '',
            Department: '',
            EntryDate: dayjs(getCurrentDate()),
            ResignationDate: dayjs(getCurrentDate()),
            LevelPosition: '',
            WorkPosition: '',
            Email: '',
            Status: 1,
            SpecialRestDays: 0,
            SickDays: 30,
            ThingDays: 14,
            ChildbirthDays: 0,
            DeathDays: 8,
            MarryDays: 8,
            SpecialRestHours: 0,
            SickHours: 0,
            ThingHours: 0,
            ChildbirthHours: 0,
            DeathHours: 0,
            MarryHours: 0,
            EmploymentTypeId: 1,
            StaffPhoneNumber: '',
            StaffName: '',
            Auth: 0,
            DepartmentId: 1,
            MenstruationDays: 1,
            MenstruationHours: 0,
            TocolysisDays: 7,
            TocolysisHours: 0,
            TackeCareBabyDays: 730,
            TackeCareBabyHours: 0,
            PrenatalCheckUpDays: 7,
            PrenatalCheckUpHours: 0,
            OverTimeHours: 0,
            StayInCompanyDays: 0,
            Gender: gender
        })
        setOpen(false);
    };
    const fetchData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/admin/staffs`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setRows(response.data);
            setFilterRows(response.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    const fetchDepartmentsData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/admin/departments`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setDepartments(response.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchDepartmentsData();
        fetchData();
    }, []); 
    useEffect(() => {
        if(isCreate) {
            setStaff({
            ...staff, 
            ChildbirthDays: gender === '女性'? 56 : 0, 
            TocolysisDays:gender === '女性'? 7 : 0,
            MenstruationDays:gender === '女性'? 1 : 0
            });
        }
    }, [gender]);
    
    useEffect(() => {
        if(isCreate) {
            setStaff({
                id: 0,
                StaffNo: '',
                CompanyId: parseInt(sessionStorage.getItem('CompanyId'), 10),
                StaffAccount: '',
                StaffPassWord: '',
                Department: '',
                EntryDate: getCurrentDate(), 
                LevelPosition: '',
                WorkPosition: '',
                Email: '',
                Status: 1,
                SpecialRestDays: 0,
                SickDays: 30,
                ThingDays: 14,
                ChildbirthDays: 0,
                DeathDays: 8,
                MarryDays: 8,
                SpecialRestHours: 0,
                SickHours: 0,
                ThingHours: 0,
                ChildbirthHours: 0,
                DeathHours: 0,
                MarryHours: 0,
                EmploymentTypeId: 1,
                StaffPhoneNumber: '',
                StaffName: '',
                Auth: 0,
                DepartmentId: 1,
                MenstruationDays: 1,
                MenstruationHours: 0,
                TocolysisDays: 7,
                TocolysisHours: 0,
                TackeCareBabyDays: 730,
                TackeCareBabyHours: 0,
                PrenatalCheckUpDays: 7,
                PrenatalCheckUpHours: 0,
                OverTimeHours: 0,
                StayInCompanyDays: 0,
                Gender: gender
            });
        }
    }, [isCreate]);

    const handleGetDetail = async (params) => {
        handleClickOpen(false);
        console.log(dayjs(params.row.ResignationDate))
        setStaff({
          Id: params.row.id, // 如果为 NULL，设置为空字符串
          StaffNo: params.row.StaffNo,
          CompanyId: params.row.CompanyId,
          StaffAccount: params.row.StaffAccount,
          StaffPassWord: params.row.StaffPassWord,
          Department: params.row.Department,
          EntryDate: dayjs(params.row.EntryDate),
          ResignationDate: dayjs(params.row.ResignationDate),
          LevelPosition: params.row.LevelPosition,
          WorkPosition: params.row.WorkPosition,
          Email: params.row.Email,
          Status: params.row.Status,
          SpecialRestDays: params.row.SpecialRestDays,
          SickDays: params.row.SickDays,
          ThingDays: params.row.ThingDays,
          ChildbirthDays: params.row.ChildbirthDays,
          DeathDays: params.row.DeathDays,
          MarryDays: params.row.MarryDays,
          EmploymentTypeId: params.row.EmploymentTypeId,
          StaffPhoneNumber: params.row.StaffPhoneNumber,
          StaffName: params.row.StaffName,
          Auth: params.row.Auth,
          DepartmentId: params.row.DepartmentId,
          MenstruationDays: params.row.MenstruationDays,
          TocolysisDays: params.row.TocolysisDays,
          TackeCareBabyDays: params.row.TackeCareBabyDays,
          PrenatalCheckUpDays: params.row.PrenatalCheckUpDays,
          StayInCompanyDays: params.row.StayInCompanyDays,
          Gender: params.row.Gender,
          SpecialRestHours:params.row.SpecialRestHours,
          SickHours:params.row.SickHours,
          ThingHours:params.row.ThingHours,
          ChildbirthHours:params.row.ChildbirthHours,
          DeathHours:params.row.DeathHours,
          MarryHours:params.row.MarryHours,
          MenstruationHours:params.row.MenstruationHours,
          TocolysisHours:params.row.TocolysisHours,
          TackeCareBabyHours:params.row.TackeCareBabyHours,
          PrenatalCheckUpHours:params.row.PrenatalCheckUpHours,
          OverTimeHours:params.row.OverTimeHours,
        });
        
    };
    const handleInputChange = (event, propertyName) => {
        const value = event.target ? event.target.value : event;
        console.log(value)
        setStaff((prevData) => ({
            ...prevData,
            [propertyName]: value,
        }));
    
    };

    const handleSubmit = async () => {

        const staffRequest = {
            ...staff,
            EntryDate: staff.EntryDate.format('YYYY-MM-DD'),
            ResignationDate: staff.ResignationDate.format('YYYY-MM-DD')
        }       
            try {
              const response = await axios.post(`${appsetting.apiUrl}/admin/newstaff`, staffRequest,config);
              if (response.status === 200) {
                alert('成功');
                fetchData();
                handleClose();
              }
            } catch (error) {
              console.error("Error logging in:", error);
              alert('失敗 欄位有誤');
            }          
    }
    // const destorySubmit = async (seq) => {
    //     // const config = {
    //     //         headers: {
    //     //         'X-Ap-Token': appsetting.token,
    //     //         'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
    //     //         'X-Ap-UserId': sessionStorage.getItem('UserId'),
    //     //         }
    //     //     };     
    //         try {
    //           const response = await axios.get(`${apiUrl}/Manufacturer/delete/${seq}`);
    //           if (response.status === 200) {
    //             alert('成功');
    //             fetchData();
    //           }
    //         } catch (error) {
    //           console.error("Error logging in:", error);
    //           alert('失敗 欄位有誤');
    //         }          
    // }

  return (
    <>
    <Box
      sx={{
        margin:'2%',
        width: '95%',
        height: 700,
      }}
    >
        <Grid container spacing={3} style={{marginBottom:'1%'}}>
            <Grid item xs={6}>      
                <StaffSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>
            <Grid item xs={6}/>
            <Grid item xs={2}>      
                <Button variant="outlined" endIcon={<PersonAddIcon/>} onClick={()=>handleClickOpen(true)}>新增員工</Button>
            </Grid>     
        </Grid>
        
        <DataGrid
            rows={filterRows}
            columns={columns}
            onCellDoubleClick={handleGetDetail}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 30,
                },
            },
            }}
            pageSizeOptions={[30,20,10]}
            disableRowSelectionOnClick
        />
    </Box>
    <Dialog open={open} 
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted>
        <DialogTitle>{isCreate?'新增員工資料':'修改員工資料'}</DialogTitle>
        <DialogContent>
            <Box
                sx={{
                    margin:'auto',
                    width: '100%',
                    height: 'auto',                    
                }}
                >
                    <Grid container spacing={2} >
                        <Grid item xs={4} >      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                性別
                            </InputLabel>   
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={gender}
                                onChange={(e)=>setGender(e.target.value)}
                            >
                                <FormControlLabel 
                                    value="男性" 
                                    control={<Radio size="small" />} 
                                    label="男性" 
                                    labelPlacement="end"
                                />
                                <FormControlLabel 
                                    value="女性" 
                                    control={<Radio size="small" />} 
                                    label="女性" 
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </Grid>                       
                        <Grid item xs={4}>      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                姓名
                            </InputLabel>       
                            <TextField id="StaffName" 
                                type="search" size="small"
                                value={staff.StaffName}
                                onChange={(e) => handleInputChange(e, 'StaffName')}/>
                        </Grid>       
                        <Grid item xs={4}>      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                員工編號
                            </InputLabel>       
                            <TextField id="StaffNo" 
                                type="search" size="small"
                                value={staff.StaffNo}
                                onChange={(e) => handleInputChange(e, 'StaffNo')}/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                員工帳號
                            </InputLabel>       
                            <TextField id="StaffAccount" 
                                type="search" size="small"
                                style={{ width: '100%'}}
                                value={staff.StaffAccount}
                                onChange={(e) => handleInputChange(e, 'StaffAccount')}/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                員工密碼
                            </InputLabel>       
                            <TextField id="StaffPassWord" 
                                type="search" size="small"
                                style={{ width: '100%'}}
                                value={staff.StaffPassWord}
                                onChange={(e) => handleInputChange(e, 'StaffPassWord')}/>
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    components={[
                                    'DesktopDatePicker',
                                    ]}
                                >
                                    <DatePicker 
                                    label="入職時間"
                                    value={staff.EntryDate}
                                    onChange={(e) => handleInputChange(e, 'EntryDate')}
                                    format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD 
                                    style={{ width: '100%'}}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    components={[
                                    'DesktopDatePicker',
                                    ]}
                                >
                                    <DatePicker 
                                    label="註冊時間"
                                    value={staff.ResignationDate}
                                    onChange={(e) => handleInputChange(e, 'ResignationDate')}
                                    format="YYYY-MM-DD" // 指定日期格式为 YYYY-MM-DD
                                    style={{ width: '100%'}}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={3}>      
                            <InputLabel shrink htmlFor="LevelPosition">
                                職位名稱
                            </InputLabel>       
                            <TextField id="outlined-search" 
                                type="search" size="small"
                                value={staff.LevelPosition}
                                onChange={(e) => handleInputChange(e, 'LevelPosition')}/>
                        </Grid>                        
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                是否在職
                            </InputLabel>       
                            <TextField id="Status" 
                                type="search" size="small"
                                value={staff.Status}
                                onChange={(e) => handleInputChange(e, 'Status')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                雇用類型
                            </InputLabel>  
                            <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={staff.EmploymentTypeId}
                            label="typeId"
                            size="small"
                            style={{width:'100%'}}
                            onChange={(e) => handleInputChange(e, 'EmploymentTypeId')}
                            >
                                <MenuItem value={1}>全職</MenuItem>
                                <MenuItem value={2}>部分工時</MenuItem>
                                <MenuItem value={3}>外包</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                            部門
                            </InputLabel>  
                            <Select
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                value={staff.DepartmentId}
                                label="typeId"
                                size="small"
                                style={{width:'100%'}}
                                onChange={(e) => handleInputChange(e, 'DepartmentId')}
                                >
                                    {departments.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.DepartmentName}
                                        </MenuItem>
                                    ))}
                                </Select>      
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                工作地點
                            </InputLabel>       
                            <TextField id="WorkPosition" 
                                type="search" size="small"
                                style={{width:'100%'}}
                                value={staff.WorkPosition}
                                onChange={(e) => handleInputChange(e, 'WorkPosition')}/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                信箱
                            </InputLabel>       
                            <TextField id="Email" 
                                type="search" size="small"
                                style={{width:'100%'}}
                                value={staff.Email}
                                onChange={(e) => handleInputChange(e, 'Email')}/>
                        </Grid>                       
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                特休餘日
                            </InputLabel>       
                            <TextField id="SpecialRestDays" 
                                type="search" size="small"
                                value={staff.SpecialRestDays}
                                onChange={(e) => handleInputChange(e, 'SpecialRestDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                病假餘日
                            </InputLabel>       
                            <TextField id="SickDays" 
                                type="search" size="small"
                                value={staff.SickDays}
                                onChange={(e) => handleInputChange(e, 'SickDays')}/>
                        </Grid>
                        <Grid item xs={3}>      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                事假餘日
                            </InputLabel>       
                            <TextField id="ThingDays" 
                                type="search" size="small"
                                value={staff.ThingDays}
                                onChange={(e) => handleInputChange(e, 'ThingDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                產假餘日
                            </InputLabel>       
                            <TextField id="ChildbirthDays" 
                                type="search" size="small"
                                value={staff.ChildbirthDays}
                                onChange={(e) => handleInputChange(e, 'ChildbirthDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                喪假餘日
                            </InputLabel>       
                            <TextField id="DeathDays" 
                                type="search" size="small"
                                value={staff.DeathDays}
                                onChange={(e) => handleInputChange(e, 'DeathDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                婚假餘日
                            </InputLabel>       
                            <TextField id="MarryDays" 
                                type="search" size="small"
                                value={staff.MarryDays}
                                onChange={(e) => handleInputChange(e, 'MarryDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                生理假餘日
                            </InputLabel>       
                            <TextField id="MenstruationDays" 
                                type="search" size="small"
                                value={staff.MenstruationDays}
                                onChange={(e) => handleInputChange(e, 'MenstruationDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                安胎假餘日
                            </InputLabel>       
                            <TextField id="TocolysisDays" 
                                type="search" size="small"
                                value={staff.TocolysisDays}
                                onChange={(e) => handleInputChange(e, 'TocolysisDays')}/>
                        </Grid>
                        <Grid item xs={3}>      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                育嬰假餘日
                            </InputLabel>       
                            <TextField id="TackeCareBabyDays" 
                                type="search" size="small"
                                value={staff.TackeCareBabyDays}
                                onChange={(e) => handleInputChange(e, 'TackeCareBabyDays')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                產檢假餘日
                            </InputLabel>       
                            <TextField id="PrenatalCheckUpDays" 
                                type="search" size="small"
                                value={staff.PrenatalCheckUpDays}
                                onChange={(e) => handleInputChange(e, 'PrenatalCheckUpDays')}/>
                        </Grid>

                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                特休餘時
                            </InputLabel>       
                            <TextField id="SpecialRestHours" 
                                type="search" size="small"
                                value={staff.SpecialRestHours}
                                onChange={(e) => handleInputChange(e, 'SpecialRestHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                病假餘時
                            </InputLabel>       
                            <TextField id="SickHours" 
                                type="search" size="small"
                                value={staff.SickHours}
                                onChange={(e) => handleInputChange(e, 'SickHours')}/>
                        </Grid>
                        <Grid item xs={3}>      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                事假餘時
                            </InputLabel>       
                            <TextField id="ThingHours" 
                                type="search" size="small"
                                value={staff.ThingHours}
                                onChange={(e) => handleInputChange(e, 'ThingHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                產假餘時
                            </InputLabel>       
                            <TextField id="ChildbirthHours" 
                                type="search" size="small"
                                value={staff.ChildbirthHours}
                                onChange={(e) => handleInputChange(e, 'ChildbirthHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                喪假餘時
                            </InputLabel>       
                            <TextField id="DeathHours" 
                                type="search" size="small"
                                value={staff.DeathHours}
                                onChange={(e) => handleInputChange(e, 'DeathHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                婚假餘時
                            </InputLabel>       
                            <TextField id="MarryHours" 
                                type="search" size="small"
                                value={staff.MarryHours}
                                onChange={(e) => handleInputChange(e, 'MarryHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                生理假餘時
                            </InputLabel>       
                            <TextField id="MenstruationHours" 
                                type="search" size="small"
                                value={staff.MenstruationHours}
                                onChange={(e) => handleInputChange(e, 'MenstruationHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                安胎假餘時
                            </InputLabel>       
                            <TextField id="TocolysisHours" 
                                type="search" size="small"
                                value={staff.TocolysisHours}
                                onChange={(e) => handleInputChange(e, 'TocolysisHours')}/>
                        </Grid>
                        <Grid item xs={3}>      
                            <InputLabel shrink htmlFor="bootstrap-input">
                                育嬰假餘時
                            </InputLabel>       
                            <TextField id="TackeCareBabyHours" 
                                type="search" size="small"
                                value={staff.TackeCareBabyHours}
                                onChange={(e) => handleInputChange(e, 'TackeCareBabyHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                產檢假餘時
                            </InputLabel>       
                            <TextField id="PrenatalCheckUpHours" 
                                type="search" size="small"
                                value={staff.PrenatalCheckUpHours}
                                onChange={(e) => handleInputChange(e, 'PrenatalCheckUpHours')}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                加班假餘時
                            </InputLabel>       
                            <TextField id="OverTimeHours" 
                                type="search" size="small"
                                value={staff.OverTimeHours}
                                onChange={(e) => handleInputChange(e, 'OverTimeHours')}/>
                        </Grid>

                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                已入職日
                            </InputLabel>       
                            <TextField id="StayInCompanyDays" 
                                type="search" size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={daysBetweenDates(formatDateToYYYYMMDD(staff.EntryDate),getCurrentDate())}/>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel shrink htmlFor="bootstrap-input">
                                權限級別
                            </InputLabel>       
                            <TextField id="StayInCompanyDays" 
                                type="search" size="small"
                                value={staff.Auth}
                                onChange={(e) => handleInputChange(e, 'StayInCompanyDays')}/>
                        </Grid>
                    </Grid>
                </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit}>{isCreate?'新增':'修改'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function formatDateToYYYYMMDD(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function daysBetweenDates(date1Str, date2Str) {
    // 将日期字符串转换为日期对象
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
  
    // 计算两个日期对象的时间戳，并找出它们之间的差异（以毫秒为单位）
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  
    // 将时间差异转换为天数
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    return diffDays;
}
    