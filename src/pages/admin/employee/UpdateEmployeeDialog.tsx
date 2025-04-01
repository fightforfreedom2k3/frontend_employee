import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { useEffect, useState } from 'react';
import { employeeService } from '../../../services/employee';
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
import { Employee } from '../../../types/employee';
import { departmentService } from '../../../services/department';
import { fetchEmployees, updateEmployee } from '../../../store/employeeSlice'; // import update action
import { Department } from '../../../types/departments';

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
        .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
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
          const employeeData = reponse.data;
          setEmployee({
            //no match no big deals
            ...employeeData,
            department: employeeData.department._id,
          });
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
      setEmployee({
        ...employee,
        [name]: value,
      });
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
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          role: employee.role,
          position: employee.position,
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
            value: '',
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
                label={'Email'}
                name="email"
                fullWidth
                margin="dense"
                value={employee.email}
                onChange={handleChange}
              />
              <TextField
                label={'Số điện thoại'}
                name="phoneNumber"
                fullWidth
                margin="dense"
                value={employee.phoneNumber}
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
                <MenuItem value={'EMPLOYEE'}>Nhân viên</MenuItem>
                <MenuItem value={'ADMIN'}>Quản trị viên</MenuItem>
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
                <MenuItem value={'INTERN'}>INTERN</MenuItem>
                <MenuItem value={'STAFF'}>STAFF</MenuItem>
                <MenuItem value={'SENIOR_STAFF'}>SENIOR_STAFF</MenuItem>
                <MenuItem value={'DIRECTOR'}>DIRECTOR</MenuItem>
                <MenuItem value={'FREELANCER'}>FREELANCER</MenuItem>
                <MenuItem value={'OTHER'}>OTHER</MenuItem>
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
                value={
                  employee.dob
                    ? new Date(employee.dob).toISOString().split('T')[0]
                    : ''
                }
                margin="dense"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
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
