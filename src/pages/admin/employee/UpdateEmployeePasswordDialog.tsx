import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { updateEmployeePassword } from '../../../store/employeeSlice';
import { employeeService } from '../../../services/employee';
import { Employee } from '../../../types/employee';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: string;
}

const UpdateEmployeePasswordDialog: React.FC<Props> = ({
  open,
  onClose,
  employeeId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch employee data when dialog opens
  useEffect(() => {
    if (open && employeeId) {
      setFetching(true);
      setEmployee(null);
      setPassword('');
      setError('');
      setSuccess('');
      employeeService
        .getEmployeeById(employeeId)
        .then(res => {
          const employeeData = res.data;
          setEmployee({
            // no match type no big deals
            ...employeeData,
            department: employeeData.department._id,
          });
          setFetching(false);
        })
        .catch(() => {
          setError('Không tìm thấy thông tin nhân viên');
          setFetching(false);
        });
    }
  }, [open, employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (!employee) {
      setError('Không tìm thấy thông tin nhân viên');
      return;
    }
    try {
      setLoading(true);
      await dispatch(
        updateEmployeePassword({
          _id: employeeId,
          employeeData: { ...employee, password },
        })
      ).unwrap();
      setLoading(false);
      setSuccess('Cập nhật mật khẩu thành công!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Cập nhật mật khẩu nhân viên</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {fetching ? (
              <CircularProgress />
            ) : error && !employee ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TextField
                label="Mật khẩu mới"
                type="password"
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                required
                autoFocus
              />
            )}
            {error && employee && (
              <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading || fetching}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || fetching || !employee}
            >
              {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={!!success}
        autoHideDuration={2000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </>
  );
};

export default UpdateEmployeePasswordDialog;
