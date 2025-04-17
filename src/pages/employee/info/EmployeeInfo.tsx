import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { getEmployeeById } from '../../../store/employeeSlice';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { convertToVietnamDate } from '../../../lib/formatDateTime';
import ChangePasswordDialog from '../../../components/dialog/ChangePasswordDialog';

export default function EmployeeInfo() {
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem('userId') || '';
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);

  useEffect(() => {
    dispatch(getEmployeeById(userId));
  }, [dispatch, userId]);

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
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      style: { pointerEvents: 'none' }, // Ngăn chặn chọn và hover
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#ccc', // Màu viền cố định
                        },
                        '&:hover fieldset': {
                          borderColor: '#ccc', // Không thay đổi màu viền khi hover
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    value={convertToVietnamDate(employee?.dob || '')}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      style: { pointerEvents: 'none' }, // Ngăn chặn chọn và hover
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#ccc', // Màu viền cố định
                        },
                        '&:hover fieldset': {
                          borderColor: '#ccc', // Không thay đổi màu viền khi hover
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={employee?.phoneNumber || ''}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      style: { pointerEvents: 'none' }, // Ngăn chặn chọn và hover
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#ccc', // Màu viền cố định
                        },
                        '&:hover fieldset': {
                          borderColor: '#ccc', // Không thay đổi màu viền khi hover
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={employee?.email || ''}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      style: { pointerEvents: 'none' }, // Ngăn chặn chọn và hover
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#ccc', // Màu viền cố định
                        },
                        '&:hover fieldset': {
                          borderColor: '#ccc', // Không thay đổi màu viền khi hover
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenChangePasswordDialog(true)} // Mở dialog khi nhấn nút
                  >
                    Đổi mật khẩu
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog đổi mật khẩu */}
      <ChangePasswordDialog
        open={openChangePasswordDialog}
        onClose={() => setOpenChangePasswordDialog(false)} // Đóng dialog
      />
    </Container>
  );
}
