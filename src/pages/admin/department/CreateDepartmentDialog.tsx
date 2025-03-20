import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  createDepartment,
  fetchDepartments,
} from '../../../store/departmentSlice';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';

interface CreateDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateDepartmentDialog = ({
  open,
  onClose,
}: CreateDepartmentDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // State for form loading, errors, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for department data
  const [departmentData, setDepartmentData] = useState({
    name: '',
    description: '',
  });

  // Handle change in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDepartmentData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a new request
    setSuccessMessage(null); // Reset success message before making a new request

    try {
      await dispatch(createDepartment(departmentData));
      setSuccessMessage('Tạo phòng ban thành công');
      setTimeout(() => {
        onClose();
        dispatch(
          fetchDepartments({
            page: 1,
            size: 10,
            sort: 'createdAt',
            order: 'DESC',
          })
        );
      }, 1000);
    } catch (error: any) {
      setError(`Lỗi khi tạo phòng ban: ${error.message || error}`);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Mới Phòng Ban</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && (
          <Typography color="primary">{successMessage}</Typography>
        )}

        <TextField
          label="Tên phòng ban"
          name="name"
          value={departmentData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Mô tả phòng ban"
          name="description"
          value={departmentData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={
            loading || !departmentData.name || !departmentData.description
          }
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
