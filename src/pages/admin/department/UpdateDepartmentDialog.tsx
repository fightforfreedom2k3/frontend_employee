import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  updateDepartment,
  fetchDepartments,
} from '../../../store/departmentSlice';

interface EditDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department: {
    _id: string;
    name: string;
    description: string;
  } | null;
}

export const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({
  open,
  onClose,
  department,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description);
    }
  }, [department]);

  const handleSave = () => {
    if (department) {
      dispatch(
        updateDepartment({
          id: department._id,
          name,
          description,
        })
      )
        .then(() => {
          dispatch(
            fetchDepartments({
              page: 1,
              size: 10,
              sort: 'createdAt',
              order: 'ASC',
              value: '',
            })
          );
          onClose();
        })
        .catch(error => {
          console.error('Failed to update department', error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa phòng ban</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Vui lòng chỉnh sửa thông tin phòng ban bên dưới.
        </Typography>
        <TextField
          fullWidth
          label="Tên phòng ban"
          variant="outlined"
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Mô tả"
          variant="outlined"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
