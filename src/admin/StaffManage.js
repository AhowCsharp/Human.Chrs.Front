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
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';

const config = {
    headers: {
      'X-Ap-Token': appsetting.token,
      'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
      'X-Ap-UserId': sessionStorage.getItem('UserId'),
    }
};

export default function StaffManage() {
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
    ];
    const [rows,setRows] = useState([])
    const [staff,setStaff] = useState({
        Id:0,
        StaffNo:'',
        CompanyId:'',
        StaffAccount:'',
        StaffPassWord:'',
        Department:'',
        EntryDate:'',
        ResignationDate:'',
        LevelPosition:'',
        WorkPosition:'',
        Email:'',
        Status:'',
        SpecialRestDays:'',
        SickDays:'',
        ThingDays:'',
        ChildbirthDays:'',
        DeathDays:'',
        MarryDays:'',
        EmploymentTypeId:'',
        StaffPhoneNumber:'',
        StaffName:'',
        Auth:'',
        DepartmentId:'',
        WorkHurtDays:'',
        WorkThingsDays:'',
        MenstruationDays:'',
        TocolysisDays:'',
        TackeCareBabyDays:'',
        PrenatalCheckUpDays:'',
        StayInCompanyDays:'',
        Gender:'',
    })

    // const navigate = useNavigate();

    // useEffect(() => {
    //     const token = sessionStorage.getItem('jwtData');
    //     if (!token) {
    //         navigate('/login');
    //     }
    // }, [navigate]);
    const fetchData = async () => {
        try {
          
          const response = await axios.get(`${appsetting.apiUrl}/admin/Infos`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setRows(response.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        // 定義非同步 function 來獲取數據
        fetchData();
    }, []); 

    const handleGetDetail = async (params) => {
        setStaff({
          Id: params.row.id, // 如果为 NULL，设置为空字符串
          StaffNo: params.row.StaffNo,
          CompanyId: params.row.CompanyId,
          StaffAccount: params.row.StaffAccount,
          StaffPassWord: params.row.StaffPassWord,
          Department: params.row.Department,
          EntryDate: params.row.EntryDate,
          ResignationDate: params.row.ResignationDate,
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
          WorkHurtDays: params.row.WorkHurtDays,
          WorkThingsDays: params.row.WorkThingsDays,
          MenstruationDays: params.row.MenstruationDays,
          TocolysisDays: params.row.TocolysisDays,
          TackeCareBabyDays: params.row.TackeCareBabyDays,
          PrenatalCheckUpDays: params.row.PrenatalCheckUpDays,
          StayInCompanyDays: params.row.StayInCompanyDays,
          Gender: params.row.Gender,
        });
    };
    // const handleInputChange = (event, propertyName) => {
    //     const value = event.target.value;

    //     setManufacturer((prevData) => ({
    //         ...prevData,
    //         [propertyName]: value,
    //     }));
    // };

    // const handleSubmit = async () => {
    //     // const config = {
    //     //         headers: {
    //     //         'X-Ap-Token': appsetting.token,
    //     //         'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
    //     //         'X-Ap-UserId': sessionStorage.getItem('UserId'),
    //     //         }
    //     //     };     
    //         try {
    //           const response = await axios.post(`${apiUrl}/Manufacturer/UpdateRow`, manufacturer);
    //           if (response.status === 200) {
    //             alert('成功');
    //             fetchData();
    //           }
    //         } catch (error) {
    //           console.error("Error logging in:", error);
    //           alert('失敗 欄位有誤');
    //         }          
    // }
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
        margin:'auto',
        width: '70%',
        height: 350,
      }}
    >
        <Grid container spacing={3}>
        <Grid item xs={2}>      
                <InputLabel shrink htmlFor="bootstrap-input">
                    姓名
                </InputLabel>       
                <TextField id="StaffName" 
                    type="search" size="small"
                    value={staff.StaffName}/>
            </Grid>       
            <Grid item xs={2}>      
                <InputLabel shrink htmlFor="bootstrap-input">
                    員工編號
                </InputLabel>       
                <TextField id="StaffNo" 
                    type="search" size="small"
                    value={staff.StaffNo}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    員工帳號
                </InputLabel>       
                <TextField id="StaffAccount" 
                    type="search" size="small"
                    value={staff.StaffAccount}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    員工密碼
                </InputLabel>       
                <TextField id="StaffPassWord" 
                    type="search" size="small"
                    value={staff.StaffPassWord}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    部門
                </InputLabel>       
                <TextField id="Department" 
                    type="search" size="small"
                    value={staff.Department}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    入職時間
                </InputLabel>       
                <TextField id="EntryDate" 
                    type="search" size="small"
                    value={staff.EntryDate}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    註冊時間
                </InputLabel>       
                <TextField id="ResignationDate" 
                    type="search" size="small"
                    value={staff.ResignationDate}/>
            </Grid>
            <Grid item xs={2}>      
                <InputLabel shrink htmlFor="LevelPosition">
                    職位名稱
                </InputLabel>       
                <TextField id="outlined-search" 
                    type="search" size="small"
                    value={staff.LevelPosition}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    工作地點
                </InputLabel>       
                <TextField id="WorkPosition" 
                    type="search" size="small"
                    value={staff.WorkPosition}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    信箱
                </InputLabel>       
                <TextField id="Email" 
                    type="search" size="small"
                    value={staff.Email}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    是否在職
                </InputLabel>       
                <TextField id="Status" 
                    type="search" size="small"
                    value={staff.Status}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    特休餘數
                </InputLabel>       
                <TextField id="SpecialRestDays" 
                    type="search" size="small"
                    value={staff.SpecialRestDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    病假餘數
                </InputLabel>       
                <TextField id="SickDays" 
                    type="search" size="small"
                    value={staff.SickDays}/>
            </Grid>
            <Grid item xs={2}>      
                <InputLabel shrink htmlFor="bootstrap-input">
                    事假餘數
                </InputLabel>       
                <TextField id="ThingDays" 
                    type="search" size="small"
                    value={staff.ThingDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    產假餘數
                </InputLabel>       
                <TextField id="ChildbirthDays" 
                    type="search" size="small"
                    value={staff.ChildbirthDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    喪假餘數
                </InputLabel>       
                <TextField id="DeathDays" 
                    type="search" size="small"
                    value={staff.DeathDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    婚假餘數
                </InputLabel>       
                <TextField id="MarryDays" 
                    type="search" size="small"
                    value={staff.MarryDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    生理假餘數
                </InputLabel>       
                <TextField id="MenstruationDays" 
                    type="search" size="small"
                    value={staff.MenstruationDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    安胎假餘數
                </InputLabel>       
                <TextField id="TocolysisDays" 
                    type="search" size="small"
                    value={staff.TocolysisDays}/>
            </Grid>
            <Grid item xs={2}>      
                <InputLabel shrink htmlFor="bootstrap-input">
                    育嬰假
                </InputLabel>       
                <TextField id="TackeCareBabyDays" 
                    type="search" size="small"
                    value={staff.TackeCareBabyDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    產檢假
                </InputLabel>       
                <TextField id="PrenatalCheckUpDays" 
                    type="search" size="small"
                    value={staff.PrenatalCheckUpDays}/>
            </Grid>
            <Grid item xs={2}>
                <InputLabel shrink htmlFor="bootstrap-input">
                    雇用類型
                </InputLabel>       
                <TextField id="EmploymentTypeId" 
                    type="search" size="small"
                    value={staff.EmploymentTypeId}/>
            </Grid>
        </Grid>
    </Box>
    <Box
      sx={{
        margin:'2%',
        width: '95%',
        height: 700,
      }}
    >
        <DataGrid
            rows={rows}
            columns={columns}
            onCellClick={handleGetDetail}
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
    </>
  );
}
