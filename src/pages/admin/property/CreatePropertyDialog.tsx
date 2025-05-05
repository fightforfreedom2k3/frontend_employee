import React, { useState } from 'react';
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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store'; // Adjust path if needed
import { createProperty } from '../../../store/propertySlice';

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
    status: '',
    number: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async () => {
    await dispatch(createProperty(formData));
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
            <TextField
              fullWidth
              label="Phòng ban"
              name="department"
              value={formData.department}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={handleChange}
              variant="outlined"
            />
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
