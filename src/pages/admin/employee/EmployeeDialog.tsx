import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { employeeService } from '../../../services/employee';
import { Employee } from '../../../types/employee';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

interface EmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId: string | null;
}

export default function EmployeeDialog({
  open,
  onClose,
  employeeId,
}: EmployeeDialogProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      setError(null);

      employeeService
        .getEmployeeById(employeeId)
        .then(response => {
          //lỗi ư! Không vấn đề
          setEmployee(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError(`Lỗi khi tải thông tin nhân viên ${err}`);
          setLoading(false);
        });
    }
  }, [open, employeeId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Thông tin nhân viên
        <Button
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          X
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : employee ? (
          <Grid container spacing={2}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar sx={{ width: 80, height: 80 }} src={''} />
                    </Grid>
                    <Grid item xs>
                      <Typography>
                        <b>Họ và tên:</b> {employee.fullName}
                      </Typography>
                      <Typography>
                        <b>Ngày sinh:</b>{' '}
                        {convertToVietnamDate(employee.dob) || 'N/A'}
                      </Typography>
                      <Typography>
                        <b>Chức vụ:</b>{' '}
                        {employee.role === 'ADMIN'
                          ? 'Trưởng phòng'
                          : 'Nhân viên'}
                      </Typography>
                      <Typography>
                        <b>Phòng ban:</b> {employee.department.name || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Thông tin liên hệ */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Thông tin liên hệ
                  </Typography>
                  <Typography>
                    <b>Số điện thoại:</b> {employee.phoneNumber}
                  </Typography>
                  <Typography>
                    <b>Email:</b> {employee.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography color="error">Không tìm thấy nhân viên</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
