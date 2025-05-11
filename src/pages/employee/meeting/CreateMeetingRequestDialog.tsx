import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { createMeeting } from '../../../store/meetingSlice';

interface CreateMeetingRequestDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMeetingRequestDialog({
  open,
  onClose,
}: CreateMeetingRequestDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const departmentId = localStorage.getItem('departmentId') || '';

  const handleSubmit = async () => {
    if (!name || !description || !date) {
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      await dispatch(
        createMeeting({
          name,
          description,
          department: departmentId,
          date,
          status: 'PENDING', // Default status
        })
      ).unwrap();
      setSnackbarMessage('Yêu cầu tạo lịch họp thành công');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      setSnackbarMessage('Lỗi khi gửi yêu cầu tạo lịch họp');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Yêu Cầu Tạo Lịch Họp</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên cuộc họp"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Mô tả"
            variant="outlined"
            margin="normal"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Ngày họp"
            type="datetime-local"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Gửi Yêu Cầu
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
