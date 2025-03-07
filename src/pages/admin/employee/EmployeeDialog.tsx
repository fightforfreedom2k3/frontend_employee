import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { employeeService } from '../../../services/employee';
import { Employee } from '../../../types/employee';

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : employee ? (
          <>
            <Typography>
              <b>Họ và tên:</b> {employee.fullName}
            </Typography>
            <Typography>
              <b>Chức vụ:</b> {employee.position}
            </Typography>
            <Typography>
              <b>Phòng ban:</b>{' '}
              {employee.department ? employee.department.name : ''}
            </Typography>
            <Typography>
              <b>Lương cơ bản:</b> {employee.baseSalary.toLocaleString()} VND
            </Typography>
            <Typography>
              <b>Ngân hàng:</b> {employee.bankAccount.bankName}
            </Typography>
            <Typography>
              <b>Số tài khoản:</b> {employee.bankAccount.accountNumber}
            </Typography>
            <Typography>
              <b>Mã số thuế:</b> {employee.taxCode}
            </Typography>
            <Typography>
              <b>Bảo hiểm xã hội:</b>{' '}
              {employee.insurance.socialInsuranceRate * 100}%
            </Typography>
            <Typography>
              <b>Bảo hiểm y tế:</b>{' '}
              {employee.insurance.healthInsuranceRate * 100}%
            </Typography>
            <Typography>
              <b>Bảo hiểm thất nghiệp:</b>{' '}
              {employee.insurance.unemploymentInsuranceRate * 100}%
            </Typography>
          </>
        ) : (
          <Typography color="error">Không tìm thấy nhân viên</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
