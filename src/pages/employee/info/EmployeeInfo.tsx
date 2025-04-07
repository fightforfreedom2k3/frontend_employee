import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { getEmployeeById } from '../../../store/employeeSlice';
import { useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

export default function EmployeeInfo() {
  const { employee, loading, error } = useSelector((state: RootState) => {
    console.log(state.employee);
    return state.employee;
  });

  const dispatch = useDispatch<AppDispatch>();

  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    dispatch(getEmployeeById(userId));
  }, [dispatch, userId]);
  // Kiểm tra giá trị của employee

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  if (loading) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  console.log(employee);

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Quản lý tài khoản Thông tin cá nhân
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={employee?.fullName || ''}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    value={convertToVietnamDate(employee?.dob || '')}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={employee?.phoneNumber || ''}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={employee?.email || ''}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
