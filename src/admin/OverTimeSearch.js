import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, OutlinedInput, InputAdornment } from '@mui/material';
import Iconify from '../components/iconify/Iconify';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export default function OverTimeSearch({ rows, setFilterRows }) {
  const [filterValue, setFilterValue] = useState('');


  
  const handleFilter = (event) => {
    const searchValue = event.target.value;
    setFilterValue(searchValue);

      if (searchValue === '') {
        // 如果搜索值為空，返回原始行
        setFilterRows(rows);
      } else if (searchValue === '未審核') {
        const filteredOverTimeLogs = rows.filter((OverTimeLog) => OverTimeLog.IsPass === 0);
        setFilterRows(filteredOverTimeLogs);
      }else if (searchValue === '未通過') {
        const filteredOverTimeLogs = rows.filter((OverTimeLog) => OverTimeLog.IsPass === -1);
        setFilterRows(filteredOverTimeLogs);
      }else if (searchValue === '已通過') {
        const filteredOverTimeLogs = rows.filter((OverTimeLog) => OverTimeLog.IsPass === 1);
        setFilterRows(filteredOverTimeLogs);
      } else {
      const filteredOverTimeLogs = rows.filter((OverTimeLog) =>
          OverTimeLog.StaffName.toLowerCase().includes(searchValue.toLowerCase())||
          OverTimeLog.StaffNo.toString().includes(searchValue.toLowerCase())||
          OverTimeLog.OverTimeLogTypeName.toLowerCase().includes(searchValue.toLowerCase())||
          OverTimeLog.ApproverName.toLowerCase().includes(searchValue.toLowerCase())
      );

      setFilterRows(filteredOverTimeLogs);
    }
  };

  return (
    <StyledRoot>
      <StyledSearch
        value={filterValue}
        onChange={handleFilter}
        placeholder="Search OverTimeLog..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      {/* <Tooltip title="Filter list">
        <IconButton>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Tooltip> */}
    </StyledRoot>
  );
}
