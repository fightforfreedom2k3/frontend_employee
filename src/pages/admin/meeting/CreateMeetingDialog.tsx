import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { departmentService } from '../../../services/department';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { createMeeting } from '../../../store/meetingSlice';

interface CreateMeetingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMeetingDialog({
  open,
  onClose,
}: CreateMeetingDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      departmentService
        .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
        .then(response => {
          setDepartments(response.data.data || []);
          if ((response.data.data ?? []).length > 0) {
            setDepartmentId(response.data.data[0]._id); // Set default department
          }
        })
        .catch(err => {
          setError('Lỗi khi tải danh sách phòng ban');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name || !description || !date || !departmentId) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        createMeeting({
          name,
          description,
          department: departmentId,
          date,
          status: 'APPROVED', // Default status
        })
      ).unwrap();
      onClose();
    } catch (err) {
      setError('Lỗi khi tạo cuộc họp');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tạo Lịch Họp</DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Tên cuộc họp"
          variant="outlined"
          margin="none"
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
        <Select
          fullWidth
          value={departmentId}
          onChange={e => setDepartmentId(e.target.value)}
          displayEmpty
          margin="none"
        >
          {departments.map((department: any) => (
            <MenuItem key={department._id} value={department._id}>
              {department.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
