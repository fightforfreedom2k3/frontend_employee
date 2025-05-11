import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store'; // Adjust path if needed
import { createProperty } from '../../../store/propertySlice';
import { departmentService } from '../../../services/department'; // Import department service
import { Department } from '../../../types/departments'; // Import department type

interface CreatePropertyDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreatePropertyDialog: React.FC<CreatePropertyDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.property);

  const [formData, setFormData] = useState({
    department: '',
    name: '',
    status: 'ACTIVE', // Default status
    number: 0,
  });

  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = () => {
    departmentService
      .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
      .then(response => {
        setDepartments(response.data.data ?? []);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  };

  useEffect(() => {
    // Fetch departments when the dialog opens
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async () => {
    await dispatch(createProperty(formData));
    fetchDepartments(); // Fetch the updated list of departments
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm Cơ Sở Vật Chất</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên cơ sở vật chất"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              name="department"
              value={formData.department}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Chọn phòng ban
              </MenuItem>
              {departments.map(department => (
                <MenuItem key={department._id} value={department._id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số lượng"
              name="number"
              type="number"
              value={formData.number}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>
        {loading && (
          <CircularProgress
            size={24}
            sx={{ display: 'block', margin: '16px auto' }}
          />
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePropertyDialog;
