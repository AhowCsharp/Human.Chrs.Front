import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ErrorAlert({errorOpen, handleErrClose, errMsg}) {
  return (
    <div>
      <Dialog
        open={errorOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleErrClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }} // 设置更高的z-index
      >
        <DialogTitle>發生錯誤</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            錯誤原因 : {errMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
