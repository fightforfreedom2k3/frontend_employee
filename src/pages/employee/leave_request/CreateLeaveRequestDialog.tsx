import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { createLeaveRequest } from '../../../store/leaveRequestSlice';

interface CreateLeaveRequestDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateLeaveRequestDialog({
  open,
  onClose,
}: CreateLeaveRequestDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.leaveRequest);

  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !leaveType || !reason || !startDate || !endDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    await dispatch(
      createLeaveRequest({
        id: userId,
        data: { leaveType, reason, startDate, endDate },
      })
    );

    // Đóng dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tạo đơn xin nghỉ phép</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            sx={{ mt: 2 }}
            select
            label="Loại nghỉ phép"
            value={leaveType}
            onChange={e => setLeaveType(e.target.value)}
            fullWidth
          >
            <MenuItem value="ANNUAL_LEAVE">Nghỉ phép năm</MenuItem>
            <MenuItem value="SICK_LEAVE">Nghỉ ốm</MenuItem>
            <MenuItem value="UNPAID_LEAVE">Nghỉ không lương</MenuItem>
            <MenuItem value="MATERNITY_LEAVE">Nghỉ thai sản</MenuItem>
          </TextField>
          <TextField
            label="Lý do"
            value={reason}
            onChange={e => setReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
