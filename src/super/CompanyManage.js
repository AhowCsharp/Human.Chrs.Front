import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import Iconify from '../components/iconify';
import appsetting from '../Appsetting';


const Transition = React.forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);



export default function CompanyManage() {
      
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken'),
          'X-Ap-SuperToken':sessionStorage.getItem('SuperToken'),
        }
    };

    const columns = [
     
        {   field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'CompanyName',
            headerName: '公司名稱',
            width: 150,
            editable: true,
        },
        {
            field: 'CapitalAmount',
            headerName: '資本額',
            width: 100,
            editable: true,
        },
        {
            field: 'Address',
            headerName: '公司地址',
            width: 300,
            editable: true,
        },
        {
            field: 'ContractStartDate',
            headerName: '合約起始日',
            width: 100,
            editable: true,
            renderCell: (params) => {
                const date = new Date(params.value);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            },
        },
        {
            field: 'ContractEndDate',
            headerName: '合約截止日',
            width: 100,
            editable: true,
            renderCell: (params) => {
                const date = new Date(params.value);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            },
        },
        {
            field: 'ContractType',
            headerName: '合約類型',
            width: 100,
            editable: true,
        }
    ];
    const [rows,setRows] = useState([]);
    const [filterRows,setFilterRows] = useState([]);
    const [formOpen, setFormOpen] = React.useState(false);
    const [comOpen, setComOpen] = React.useState(false);
    const [adminRequest,setAdminRequest] = useState({
        id:0,
        CompanyId:0,
        UserName:'',
        Account:'',
        Password:'',
        PrePassword:'',
        Auth:10,
        WorkPosition:'',
        StaffNo:'',
        DepartmentId:0,
        Status:true
    });
    const [comRequest,setComRequest] = useState({
        id:0,
        CompanyName:'',
        CapitalAmount:0,
        Address:'',
        ContractStartDate:'',
        ContractEndDate:'',
        ContractType:1,
    });

    const fetchData = async () => {
        try {       
          const response = await axios.get(`${appsetting.apiUrl}/super/companys`,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            setRows(response.data);
            setFilterRows(response.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    const handleClickOpen = () => {
        setFormOpen(true);
    };
    const handleClose = () => {
        setFormOpen(false);
    };
    const handleComClickOpen = () => {
        setComOpen(true);
    };
    const handleComClose = () => {
        setComOpen(false);
    };

    const handleInputChange = (event, propertyName) => {
        const value = event.target ? event.target.value : event;
        setAdminRequest((prevData) => ({
            ...prevData,
            [propertyName]: value,
        }));   
    };

    const handleComInputChange = (event, propertyName) => {
        const value = event.target ? event.target.value : event;
        setComRequest((prevData) => ({
            ...prevData,
            [propertyName]: value,
        }));   
    };

    const submitNewAdmin = async () => {
        try {       
          const response = await axios.post(`${appsetting.apiUrl}/super/newadmin`,adminRequest,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            alert('成功')
            handleClose();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    const submitNewCom = async () => {
        try {       
          const response = await axios.post(`${appsetting.apiUrl}/super/newcompany`,comRequest,config);
          // 檢查響應的結果，並設置到 state
          if (response.status === 200) {
            alert('成功')
            fetchData()
            handleComClose();
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []); 
 
  return (
    <>
    <Box
      sx={{
        margin:'2%',
        width: '95%',
        height: 700,
      }}
    >

        <Grid container spacing={0} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    簽約公司列表
                </Typography>
            </Grid>
            {/* <Grid item xs={6}>      
                <StaffSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>
            <Grid item xs={6}/> */}
            <Grid item xs={3}>   
                <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleComClickOpen}>
                新增公司
                </Button>   
                <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen} style={{marginLeft:'2%'}}>
                新增管理者
                </Button>
            </Grid>     
        </Grid>
        
        <DataGrid
            rows={filterRows}
            columns={columns}
            // onCellDoubleClick={handleGetDetail}
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

        <Dialog open={formOpen} onClose={handleClose}>
            <DialogTitle>新增管理者</DialogTitle>
            <DialogContent>
              <DialogContentText  style={{marginBottom:'5%'}}>
                  請確認好公司，再行新增
              </DialogContentText>
              <Grid container spacing={2} style={{marginBottom:'1%'}}>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="管理者名稱"
                              variant="standard"
                              value={adminRequest.UserName}
                              onChange={(e) => handleInputChange(e, 'UserName')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="管理者公司"
                              variant="standard"
                              value={adminRequest.CompanyId}
                              onChange={(e) => handleInputChange(e, 'CompanyId')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="部門"
                              variant="standard"
                              value={adminRequest.DepartmentId}
                              onChange={(e) => handleInputChange(e, 'DepartmentId')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="帳號"
                              variant="standard"
                              value={adminRequest.Account}
                              onChange={(e) => handleInputChange(e, 'Account')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="權限"
                              type='number'
                              variant="standard"
                              value={adminRequest.Auth}
                              onChange={(e) => handleInputChange(e, 'Auth')}
                            />
                        </Grid>                       
                          <Grid item xs={3}> 
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="密碼"
                                variant="standard"
                                value={adminRequest.Password}
                                onChange={(e) => handleInputChange(e, 'Password')}
                              />
                          </Grid>

                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="職位"
                              variant="standard"
                              value={adminRequest.WorkPosition}
                              onChange={(e) => handleInputChange(e, 'WorkPosition')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="員編"
                              variant="standard"
                              placeholder='自由設定'
                              value={adminRequest.StaffNo}
                              onChange={(e) => handleInputChange(e, 'StaffNo')}
                            />
                        </Grid>
                    </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={submitNewAdmin}>
                  新增
              </Button>

            </DialogActions>
          </Dialog>

          <Dialog open={comOpen} onClose={handleComClose}>
            <DialogTitle>新增公司</DialogTitle>
            <DialogContent>
              <DialogContentText  style={{marginBottom:'5%'}}>
                  請確認好公司合約
              </DialogContentText>
              <Grid container spacing={2} style={{marginBottom:'1%'}}>
                        <Grid item xs={3}> 
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="公司名稱"
                              variant="standard"
                              value={comRequest.CompanyName}
                              onChange={(e) => handleComInputChange(e, 'CompanyName')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                        <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="資本額"
                              variant="standard"
                              value={comRequest.CapitalAmount}
                              onChange={(e) => handleComInputChange(e, 'CapitalAmount')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                        <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="地址"
                              variant="standard"
                              value={comRequest.Address}
                              onChange={(e) => handleComInputChange(e, 'Address')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                        <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="合約起始日"
                              variant="standard"
                              value={comRequest.ContractStartDate}
                              onChange={(e) => handleComInputChange(e, 'ContractStartDate')}
                            />
                        </Grid>
                        <Grid item xs={3}> 
                        <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="合約終止日"
                              variant="standard"
                              value={comRequest.ContractEndDate}
                              onChange={(e) => handleComInputChange(e, 'ContractEndDate')}
                            />
                        </Grid>                       
                          <Grid item xs={3}> 
                          <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="合約類別"
                              variant="standard"
                              value={comRequest.ContractType}
                              onChange={(e) => handleComInputChange(e, 'ContractType')}
                            />
                          </Grid>
                    </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleComClose}>取消</Button>
              <Button onClick={submitNewCom}>
                  新增
              </Button>

            </DialogActions>
          </Dialog>
    </Box>
    </>
  );
}

