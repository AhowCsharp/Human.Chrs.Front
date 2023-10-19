import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
// @mui
import CircularProgress from '@mui/material/CircularProgress';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Box,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import appsetting from '../Appsetting';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'UserName', label: 'Name', alignRight: false },
  { id: 'CompanyName', label: 'Company', alignRight: false },
  { id: 'StaffNo', label: 'StaffNo', alignRight: false },
  { id: 'Auth', label: 'Auth', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: '' , label: 'Operate', alignRight: true },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (admin) => admin.UserName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}




export default function AdminPage() {
  const [open, setOpen] = useState(null);

  const [isCreate ,setIsCreate] = useState(true); 

  const [chooseRow,setChooseRow] = useState(null);

  const [formOpen, setFormOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(true); 

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [admins,setAdmins] = useState([]);

  const [departments,setDepartments] = useState([]);

  const [adminRequest,setAdminRequest] = useState({
    id:0,
    CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
    UserName:'',
    Account:'',
    Password:'',
    PrePassword:'',
    Auth:0,
    WorkPosition:'',
    StaffNo:'',
    DepartmentId:parseInt(sessionStorage.getItem('DepartmentId'), 10),
    Status:true
  });

  const Auth = parseInt(sessionStorage.getItem('Auth'), 10);
  const nowAdminId = parseInt(sessionStorage.getItem('UserId').split(',')[0],10);

  const config = {
    headers: {
      'X-Ap-Token': appsetting.token,
      'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
      'X-Ap-UserId': sessionStorage.getItem('UserId'),
      'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
    }
};
  const handleClickOpen = (isCreate) => {
    if(isCreate) {
      setAdminRequest({
        id:0,
        CompanyId:parseInt(sessionStorage.getItem('CompanyId'), 10),
        UserName:'',
        Account:'',
        Password:'',
        Auth:0,
        WorkPosition:'',
        StaffNo:'',
        PrePassword:'',
        DepartmentId:parseInt(sessionStorage.getItem('DepartmentId'), 10),
        Status:true
      })
    }

    setIsCreate(isCreate)
    setFormOpen(true);
  };

  const handleClose = () => {
    handleCloseMenu();
    setFormOpen(false);
  };
  const fetchAdminsData = async () => {
    setIsLoading(true);  // 開始加載
    try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/alladmins`,config);
        if (response.status === 200) {
          setAdmins(response.data);

        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);  // 結束加載
    }
  };

  useEffect(() => {
          fetchAdminsData();
  }, []); 

  const handleOpenMenu = (event,row) => {
    setChooseRow(row)
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setChooseRow(null)
    setOpen(null);
  };
  const fetchDepartmentData = async () => {
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

  const submitNewAdmin = async () => {
    if(adminRequest.Auth > Auth)  {
      alert('權限不足 新增的管理員權限最高只能等於自身');
      return;
    }

    if(adminRequest.Auth > 10)  {
      alert('權限最高為10');
      return;
    }
    try {       
      const response = await axios.post(`${appsetting.apiUrl}/admin/manager`,adminRequest,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setAdmins(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if(chooseRow) {
      setAdminRequest({
        id:chooseRow.id,
        StaffNo:chooseRow.StaffNo,
        CompanyId:chooseRow.CompanyId,
        UserName:chooseRow.UserName,
        Account:chooseRow.Account,
        Auth:chooseRow.Auth,
        WorkPosition:chooseRow.WorkPosition,
        DepartmentId:chooseRow.DepartmentId,
        PrePassword:'',
        Password:''
      })
    }
  }, [chooseRow]); 


  const handleEditAdmin = async () => {


    if(Auth > 10)  {
      alert('權限不足 新增的管理員權限最高只能等於自身');
      return;
    }

    if(adminRequest.Auth > Auth)  {
      alert('權限不足 新增的管理員權限最高只能等於自身');
      return;
    }

    try {       
      const response = await axios.post(`${appsetting.apiUrl}/admin/manager`,adminRequest,config);
      // 檢查響應的結果，並設置到 state
      if (response.status === 200) {
        setAdmins(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('先前密碼錯誤')
    }
  };
  useEffect(() => {
    fetchDepartmentData();
  }, []); 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    console.log(event)
    if (event.target.checked) {
      const newSelecteds = admins.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleAdminDelete = async () => {
    try {
      const response = await axios.delete(`${appsetting.apiUrl}/admin/manager?id=${chooseRow.id}`,config);
        if (response.status === 200) {
          setAdmins(response.data);
          handleCloseMenu();
        } 
    } catch (error) {
        alert('系統錯誤')
        console.error('Error calling API:', error);
        handleCloseMenu();
    }
  };

  const handleAdminSwitch = async () => {
    try {
      const response = await axios.put(
          `${appsetting.apiUrl}/admin/manager`, 
          null, // 如果你不需要傳遞body，可以設為null
          {
              ...config, // 展開你的config，使其成為這個配置對象的一部分
              params: {
                  id: chooseRow.id
              },
          }
      );
      if (response.status === 200) {
          setAdmins(response.data);
      } 
      handleCloseMenu();
  } catch (error) {
      alert('系統錯誤');
      handleCloseMenu();
      console.error('Error calling API:', error);
  }
};

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleInputChange = (event, propertyName) => {
    const value = event.target ? event.target.value : event;
    setAdminRequest((prevData) => ({
        ...prevData,
        [propertyName]: value,
    }));   
};

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - admins.length) : 0;

  const filteredUsers = applySortFilter(admins, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  if (isLoading) {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '85vh', 
                backgroundColor: 'white' 
            }}>
            <CircularProgress color="success" />
        </Box>
    );
}


  return (
    <>
      <Helmet>
        <title> Dorey Chrs </title>
      </Helmet>

      <Container  sx={{width:'95%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            管理者列表
          </Typography>
          <Button variant="outlined" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>handleClickOpen(true)}>
            新增管理者
          </Button>

          <Dialog open={formOpen} onClose={handleClose}>
            <DialogTitle>{isCreate?'新增管理者':'修改管理者'}</DialogTitle>
            <DialogContent>
              <DialogContentText  style={{marginBottom:'5%'}}>
                  請確認自身權限是否足夠  權限10為上限 為最高管理者
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
                          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">部門</InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={adminRequest.DepartmentId}
                              label="Age"
                              onChange={(e) => handleInputChange(e, 'DepartmentId')}
                            >
                                <MenuItem  key={0} value={0}>
                                  超級管理員
                                </MenuItem >
                              {departments.map((option) => (
                                <MenuItem  key={option.id} value={option.id}>
                                  {option.DepartmentName}
                                </MenuItem >
                              ))}
                            </Select>
                          </FormControl>
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
                        {isCreate?                        
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
                          </Grid>:null }


                          {!isCreate && chooseRow?.id === nowAdminId ?                        
                              <Grid item xs={3}> 
                                  <TextField
                                      autoFocus
                                      margin="dense"
                                      id="name"
                                      label="先前密碼"
                                      variant="standard"
                                      value={adminRequest.PrePassword}
                                      onChange={(e) => handleInputChange(e, 'PrePassword')}
                                  />
                              </Grid>
                          : null }

                          {!isCreate && chooseRow?.id === nowAdminId ?                        
                              <Grid item xs={3}> 
                                  <TextField
                                      autoFocus
                                      margin="dense"
                                      id="name"
                                      label="新密碼"
                                      variant="standard"
                                      value={adminRequest.Password}
                                      onChange={(e) => handleInputChange(e, 'Password')}
                                  />
                              </Grid>
                          : null }

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
              <Button onClick={isCreate ? submitNewAdmin : handleEditAdmin}>
                  {isCreate ? '新增' : '編輯'}
              </Button>

            </DialogActions>
          </Dialog>
        </Stack>

        <Card  sx={{width:'100%' }}>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 900,padding:'2%',width:'100%' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={admins.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id,StaffNo ,UserName, Auth, Status, CompanyName, AvatarUrl} = row;
                    const selectedUser = selected.indexOf(UserName) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, UserName)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={UserName} src={`${appsetting.apiUrl}${AvatarUrl}`} />
                            <Typography variant="subtitle2" noWrap>
                              {UserName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{CompanyName}</TableCell>

                        <TableCell align="left">{StaffNo}</TableCell>

                        <TableCell align="left">{Auth}</TableCell>

                        <TableCell align="left">
                            <Label color={Status ? 'success' : 'error'}>
                                {Status ? 'Active' : 'Banned'}
                            </Label>
                        </TableCell>


                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e)=>handleOpenMenu(e,row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={admins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
      <MenuItem>
        <Button 
            variant="text" 
            fullWidth
            startIcon={<ModeEditIcon sx={{ mr: 2, width: '100%' }} />}
            onClick={()=>handleClickOpen(false)}>
            Modify
        </Button>       
      </MenuItem>

      <MenuItem sx={{ color: 'error.main' }}>
          <Button 
              variant="text" 
              fullWidth
              startIcon={<DeleteForeverIcon sx={{ mr: 2, width: '100%' }} />}
              onClick={()=>handleAdminDelete()}>
              Delete
          </Button>
      </MenuItem>

      <MenuItem sx={{ color: 'error.main' }}>
          <Button 
              variant="text" 
              fullWidth
              startIcon={<DoDisturbIcon sx={{ mr: 2, width: '100%' }} />}
              onClick={()=>handleAdminSwitch()}>
              Status
          </Button>
      </MenuItem>

      </Popover>
    </>
  );
}
