import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams  } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import ReplyIcon from '@mui/icons-material/Reply';
import InputLabel from '@mui/material/InputLabel';
import SendIcon from '@mui/icons-material/Send';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Alert from '@mui/material/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import SearchIcon from '@mui/icons-material/Search';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import AlertTitle from '@mui/material/AlertTitle';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import { DataGrid } from '@mui/x-data-grid';
import appsetting from '../Appsetting';
import ErrorAlert from '../errorView/ErrorAlert';
import FinishedAlert from '../finishView/FinishedAlert';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


export default function DepartmentManage() {
    const config = {
        headers: {
          'X-Ap-Token': appsetting.token,
          'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
          'X-Ap-UserId': sessionStorage.getItem('UserId'),
          'X-Ap-AdminToken':sessionStorage.getItem('AdminToken')
        }
    };
    const columns = [
     
        {   field: 'id', headerName: 'ID', width: 150 },
        {
            field: 'CompanyName',
            headerName: '公司名稱',
            width: 200,
            editable: true,
        },
        {
            field: 'DepartmentName',
            headerName: '部門/分店名稱',
            width: 150,
            editable: true,
        },
        {
            field: 'CompanyRuleId',
            headerName: '部門準則編號',
            width: 150,
            editable: false,
        },
        {
          field: 'Actions',
          headerName: '刪除',
          width: 120,
          renderCell: (params) => {
            // 假设 yourArray 是您想检查的数组
            const isButtonDisabled = filterRows.length < 2;
        
            return (
              <>
                <IconButton 
                  aria-label="delete" 
                  onClick={() => handleRmDepartment(params.row.id)}
                  disabled={isButtonDisabled}  // 根据条件禁用或启用按钮
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </>
            );
          },
        }
        
    ];
    const [rows,setRows] = useState([]);
    const [editedRows, setEditedRows] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [rmRequest,setRmquest] = useState({
      DepartmentId:0,
      OtherDepartmentId:0
    })
    const [filterRows,setFilterRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [rmOpen, setRmOpen] = useState(false);
    const [departmentName,setDepartmentName] = useState('');
    const [errOpen,setErropen] = useState(false);
    const [errMsg ,setErrMsg]= useState('');		
    const [okOpen,setOkopen] = useState(false);

    const handleOkOpen = () => {
      setOkopen(true);
    }

    const handleErrOpen = () => {
      setErropen(true);
    }
    const isDisabled = editedRows.length === 0;

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleRmDepartment = (id) => {
      // 使用filter方法创建一个新数组，其中不包含具有指定id的项
      setRmquest(prevState => ({
        ...prevState,
        DepartmentId: id
      }));
      const newDepartments = filterRows.filter((item) => item.id !== id);
      setDepartments(newDepartments);
      handleRmClickOpen();
    };
    

    const handleRmClickOpen = () => {
      setRmOpen(true);
    };
  
    const handleRmClose = () => {
      setRmOpen(false);
    };
    
    const fetchData = async () => {
      try {       
        const response = await axios.get(`${appsetting.apiUrl}/admin/departments`,config);
        // 檢查響應的結果，並設置到 state
        if (response.status === 200) {
          setRows(response.data);
          setFilterRows(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {         
          console.error('Server Response', error.response);
          const serverMessage = error.response.data;
  
          handleErrOpen();
          setErrMsg(serverMessage);
        }
      }
  };
  const deleteDepartment = async () => {
    if(rmRequest.OtherDepartmentId === 0) {
      handleErrOpen();
      setErrMsg('尚未選擇替補部門');
      return;
    }

    try {
      const url = `${appsetting.apiUrl}/admin/department?departmentId=${rmRequest.DepartmentId}&otherDepartmentId=${rmRequest.OtherDepartmentId}`;

      // 发送带有配置的请求
      const response = await axios.delete(url, config);
  
      // 检查响应状态
      if (response.status === 200) {
        handleOkOpen();
        handleRmClose();
        fetchData();
      } else {
        handleErrOpen();
        setErrMsg('刪除失敗');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      if (error.response) {         
        console.error('Server Response', error.response);
        const serverMessage = error.response.data;

        handleErrOpen();
        setErrMsg(serverMessage);
      }
    }
  };

    useEffect(() => {
      fetchData();
    }, []); 

    const handleInsertSubmmit = async () => {     
        const request = {
          DepartmentName :departmentName,
        }
        try {
          const response = await axios.post(`${appsetting.apiUrl}/admin/newdepartment`,request,config);
          if (response.status === 200) {
            setRows(response.data);
            setFilterRows(response.data);
            handleOkOpen();
            handleClose();
          }
        } catch (error) {
          console.error("Error logging in:", error);
          if (error.response) {         
            console.error('Server Response', error.response);
            const serverMessage = error.response.data;
    
            handleErrOpen();
            setErrMsg(serverMessage);
          }
        }          
    }
    const processRowUpdate = (newRow, oldRow) => {
      // 透過 newRow 的 id 找到 editedRows 陣列中的索引
      const index = editedRows.findIndex(row => row.id === newRow.id);
    
      // 若找到相同的 id，則先刪除
      if (index > -1) {
        editedRows.splice(index, 1);
      }
    
      // 將 newRow 加入 editedRows 陣列
      setEditedRows([...editedRows, newRow]);
      return newRow;
    };
    const handleChange = (event) => {
      // 用当前的 rmRequest 对象更新状态，但只更改 OtherDepartmentId
      setRmquest(prevState => ({
        ...prevState,
        OtherDepartmentId: event.target.value,
      }));
    };

    const handleMultUpdateSave = async () => {
      const modifiedRows = editedRows.map(item => ({
        ...item,
      }));
      console.log(modifiedRows)
      try {
        const response = await axios.patch(`${appsetting.apiUrl}/admin/modifydepartment`, modifiedRows,config);
        if(response.status === 200) {     

          handleOkOpen();
          setRows(response.data);
          setFilterRows(response.data);
          setEditedRows([]);
        }
  
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (error.response) {         
          console.error('Server Response', error.response);
          const serverMessage = error.response.data;
  
          handleErrOpen();
          setErrMsg(serverMessage);
        }
      }
  };

  return (
    <>
      <Box
        sx={{
          margin:'auto',
          width: '60%',
          height: 700,
        }}
      >
        <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    公司部門列表
                </Typography>
            </Grid>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Alert severity="warning">
                  <AlertTitle>請注意</AlertTitle>
                  若是部門準則編號為0 即代表該部門尚未設置上下班時間<strong>--請馬上處理 避免打卡錯誤</strong><br/>
                  若刪除該部門 請選擇替補部門 以免該部門員工打卡失敗<strong>--刪除部門會跟著刪除該部門規定設置</strong>
                </Alert>
            </Grid>
            {/* <Grid item xs={12}>      
                <SalarySettingSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid> */}

            <Grid item xs={2}>      
                <Button variant="outlined" endIcon={<MapsHomeWorkIcon/>} onClick={handleClickOpen}>新增部門</Button>
            </Grid>
            <Grid item xs={2}>  
                <Button variant="outlined" disabled={isDisabled} onClick={handleMultUpdateSave}  startIcon={<SaveIcon />}> 
                儲存修改
                </Button>
            </Grid>
            <Grid item xs={2}>  
                <Button variant="outlined" disabled={isDisabled} onClick={()=>setEditedRows([])}  startIcon={<ClearIcon />}> 
                  取消修改
                </Button>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>新增部門</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="部門名稱"
                  type="email"
                  fullWidth
                  variant="standard"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleInsertSubmmit}>送出</Button>
              </DialogActions>
          </Dialog>   



          <Dialog open={rmOpen} onClose={handleRmClose}>
            <DialogTitle>請選擇替補部門</DialogTitle>
            <DialogContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
              <DialogContentText style={{marginBottom:'5%'}}>
                刪除部門之後<br/><br/>底下員工會改採用替補部門的設置
              </DialogContentText>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">替補部門</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={rmRequest.OtherDepartmentId}
                    label="Age"
                    onChange={handleChange} // 使用 handleChange 方法处理变化
                  >
                    <MenuItem value={0}>
                      <em>None</em>
                    </MenuItem>
                    {departments.map((department) => ( // 使用数组动态生成选项
                      <MenuItem key={department.id} value={department.id}>
                        {department.DepartmentName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleRmClose}>取消</Button>
              <Button onClick={deleteDepartment}>送出</Button>
            </DialogActions>
          </Dialog>  
        </Grid>
        <DataGrid
            rows={filterRows}
            columns={columns}
            // onCellDoubleClick={(params) => handleClickOpen(params)}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 30,
                },
            },
            }}
            pageSizeOptions={[30,20,10]}
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={error=>alert(error)}
            onRowEditCommit={(rowId, e) => {
              handleMultUpdateSave(rowId,e);
            }}
        />
      </Box>
      <ErrorAlert errorOpen={errOpen} handleErrClose={()=>setErropen(false)} errMsg={errMsg} />
      <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)}/>
    </>
  );
}

    