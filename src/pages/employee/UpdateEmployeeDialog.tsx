import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect, useState } from 'react';
import { employeeService } from '../../services/employee';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Department, Employee } from '../../types/employee';
import { departmentService } from '../../services/department';
import { fetchEmployees, updateEmployee } from '../../store/employeeSlice'; // import update action

interface UpdateEmployeeDialog {
  open: boolean;
  onClose: () => void;
  employeeId: string;
}

export default function UpdateEmployeeDialog({
  open,
  onClose,
  employeeId,
}: UpdateEmployeeDialog) {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[] | undefined>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);

  // Lấy danh sách phòng ban
  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      departmentService
        .getAllDepartment()
        .then(response => {
          setDepartments(response.data.data);
          setLoading(false);
        })
        .catch(err => {
          setError(`Lỗi khi lấy danh sách phòng ban: ${err}`);
          setLoading(false);
        });

      employeeService
        .getEmployeeById(employeeId)
        .then(reponse => {
          setEmployee(reponse.data);
          setLoading(false);
        })
        .catch(err => {
          setError(`Lỗi khi tải thông tin nhân viên ${err}`);
          setLoading(false);
        });
    }
  }, [open, employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (employee) {
      const { name, value } = e.target;

      if (name.startsWith('bankAccount')) {
        // Cập nhật bankAccount
        const fieldName = name.split('.')[1];
        setEmployee({
          ...employee,
          bankAccount: {
            ...employee.bankAccount,
            [fieldName]: value,
          },
        });
      } else if (name.startsWith('insurance')) {
        // Cập nhật insurance
        const fieldName = name.split('.')[1];
        setEmployee({
          ...employee,
          insurance: {
            ...employee.insurance,
            [fieldName]: value,
          },
        });
      } else {
        // Cập nhật các trường khác
        setEmployee({
          ...employee,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (employee) {
      try {
        setLoading(true);

        // Cấu trúc dữ liệu theo API yêu cầu
        const employeeData = {
          fullName: employee.fullName,
          dob: employee.dob,
          department: employee.department,
          userName: employee.userName,
          role: employee.role,
          position: employee.position,
          baseSalary: employee.baseSalary,
          bankAccount: {
            bankName: employee.bankAccount.bankName,
            accountNumber: employee.bankAccount.accountNumber,
          },
          insurance: {
            socialInsuranceRate: employee.insurance.socialInsuranceRate,
            healthInsuranceRate: employee.insurance.healthInsuranceRate,
            unemploymentInsuranceRate:
              employee.insurance.unemploymentInsuranceRate,
          },
          taxCode: employee.taxCode,
        };

        // Gọi API update
        await dispatch(updateEmployee({ _id: employee._id, employeeData }));
        setSuccessMessage('Cập nhật thành công!');
        setLoading(false);
        dispatch(
          fetchEmployees({
            page: 1,
            size: 10,
            sort: 'createdAt',
            order: 'DESC',
          })
        );
        onClose(); // Đóng dialog sau khi cập nhật
      } catch (error) {
        setLoading(false);
        setError('Cập nhật thất bại, vui lòng thử lại!');
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'}>
        <DialogTitle>Cập nhật nhân viên</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : employee ? (
            <>
              <TextField
                label={'Tài khoản'}
                name="userName"
                fullWidth
                margin="dense"
                value={employee.userName}
                onChange={handleChange}
              />
              <TextField
                label={'Họ và tên'}
                name="fullName"
                fullWidth
                margin="dense"
                value={employee.fullName || ''}
                onChange={handleChange}
              />
              <TextField
                label={'Vai trò'}
                name="role"
                fullWidth
                margin="dense"
                value={employee.role}
                select
                onChange={handleChange}
              >
                <MenuItem value={'DEPARTMENT_MANAGER'}>Quản lý</MenuItem>
                <MenuItem value={'EMPLOYEE'}>Nhân viên</MenuItem>
                <MenuItem value={'HR'}>Nhân sự</MenuItem>
                <MenuItem value={'OTHER'}>Khác</MenuItem>
              </TextField>
              <TextField
                label={'Vị trí'}
                name="position"
                fullWidth
                margin="dense"
                value={employee.position}
                select
                onChange={handleChange}
              >
                <MenuItem value={'MANAGER'}>MANAGER</MenuItem>
                <MenuItem value={'CEO'}>CEO</MenuItem>
                <MenuItem value={'TEAM_LEAD'}>TEAM_LEAD</MenuItem>
                <MenuItem value={'EMPLOYEE'}>EMPLOYEE</MenuItem>
              </TextField>
              <TextField
                label={'Phòng ban'}
                name="department"
                fullWidth
                select
                margin="dense"
                value={employee.department}
                onChange={handleChange}
              >
                {departments?.map(department => (
                  <MenuItem key={department._id} value={department._id}>
                    {department.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={'Ngày sinh'}
                name="dob"
                value={employee.dob}
                margin="dense"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
              <TextField
                label="Lương cơ bản"
                name="baseSalary"
                type="number"
                fullWidth
                margin="dense"
                value={employee.baseSalary}
                onChange={handleChange}
              />
              <TextField
                label={'Ngân hàng'}
                name="bankAccount.bankName"
                value={employee.bankAccount.bankName}
                fullWidth
                margin="dense"
                onChange={handleChange}
              />
              <TextField
                label={'Số tài khoản'}
                name="bankAccount.accountNumber"
                value={employee.bankAccount.accountNumber}
                fullWidth
                margin="dense"
                onChange={handleChange}
              />
              <TextField
                label="Bảo hiểm y tế"
                name="insurance.healthInsuranceRate"
                fullWidth
                type="number"
                margin="dense"
                value={employee.insurance.healthInsuranceRate}
                onChange={handleChange}
              />
              <TextField
                label="Bảo hiểm xã hội"
                name="insurance.socialInsuranceRate"
                fullWidth
                type="number"
                margin="dense"
                value={employee.insurance.socialInsuranceRate}
                onChange={handleChange}
              />
              <TextField
                label="Bảo hiểm thất nghiệp"
                name="insurance.unemploymentInsuranceRate"
                fullWidth
                type="number"
                margin="dense"
                value={employee.insurance.unemploymentInsuranceRate}
                onChange={handleChange}
              />
              <TextField
                label="Mã số thuế"
                name="taxCode"
                fullWidth
                margin="dense"
                value={employee.taxCode}
                onChange={handleChange}
              />
            </>
          ) : (
            <Typography color="error">Lỗi tải thông tin nhân viên</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            Đóng
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo lỗi */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* Thông báo thành công */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </>
  );
}
