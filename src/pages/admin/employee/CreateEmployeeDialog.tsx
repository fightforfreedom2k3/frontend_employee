import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { useEffect, useState } from 'react';
import { AddNewEmployeeRequest } from '../../../services/employee';
import { addNewEmployee, fetchEmployees } from '../../../store/employeeSlice';
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
import { Department } from '../../../types/employee';
import { departmentService } from '../../../services/department';

interface CreateEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateEmployeeDialog({
  open,
  onClose,
}: CreateEmployeeDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[] | undefined>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  //Lấy danh sách phòng ban
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
    }
  }, [open]);

  //dữ liệu gửi lên
  const [employeeData, setEmployeeData] = useState<AddNewEmployeeRequest>({
    fullName: '',
    dob: '',
    department: '',
    userName: '',
    password: '',
    role: 'OTHER',
    position: '',
    baseSalary: 0,
    bankAccount: {
      accountNumber: '',
      bankName: '',
    },
    insurance: {
      healthInsuranceRate: 0,
      socialInsuranceRate: 0,
      unemploymentInsuranceRate: 0,
    },
    taxCode: '',
    contract: {
      startDate: '',
      endDate: null,
      contractType: 'PERMANENT',
      status: 'ACTIVE',
      signDate: '',
      attachments: [],
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    //Chuyển đổi kiểu số
    const parseValue = [
      'baseSalary',
      'insurance.healthInsuranceRate',
      'insurance.socialInsuranceRate',
      'insurance.unemploymentInsuranceRate',
    ].includes(name)
      ? parseFloat(value) || 0
      : value;

    // Kiểm tra nếu name là của bankAccount (ví dụ: bankAccount.bankName hoặc bankAccount.accountNumber)
    if (name.includes('bankAccount')) {
      const field = name.split('.')[1]; // Phân tích ra trường "bankName" hoặc "accountNumber"
      setEmployeeData(prev => ({
        ...prev,
        bankAccount: {
          ...prev.bankAccount,
          [field]: parseValue, // Cập nhật giá trị trường con tương ứng trong bankAccount
        },
      }));
    } else if (name.includes('insurance')) {
      const field = name.split('.')[1];
      setEmployeeData(prev => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          [field]: parseValue, // Cập nhật giá trị trường con tương ứng trong insurance
        },
      }));
    } else if (name.includes('contract')) {
      const field = name.split('.')[1];
      setEmployeeData(prev => ({
        ...prev,
        contract: {
          ...prev.contract,
          [field]: parseValue, //Cập nhật giá trị của các trường trong contract
        },
      }));
    } else {
      // Xử lý các trường không phải bankAccount và insurance
      setEmployeeData({
        ...employeeData,
        [name]: parseValue,
      });
    }
  };

  const handleSubmit = async () => {
    const employeeDataFormat = {
      ...employeeData,
      dob: new Date(employeeData.dob).toISOString(),
      contract: {
        ...employeeData.contract,
        startDate: new Date(employeeData.contract.startDate).toISOString(),
        endDate: employeeData.contract.endDate
          ? new Date(employeeData.contract.endDate).toISOString()
          : null, // Nếu có endDate, chuyển đổi
        signDate: new Date(employeeData.contract.signDate).toISOString(),
      },
      baseSalary: Number(employeeData.baseSalary) || 0,
      insurance: {
        ...employeeData.insurance,
        healthInsuranceRate:
          Number(employeeData.insurance.healthInsuranceRate) || 0,
        socialInsuranceRate:
          Number(employeeData.insurance.socialInsuranceRate) || 0,
        unemploymentInsuranceRate:
          Number(employeeData.insurance.unemploymentInsuranceRate) || 0,
      },
    };
    setLoading(true);
    setError(null);
    try {
      await dispatch(addNewEmployee(employeeDataFormat));
      setSuccessMessage('Nhân viên đã được tạo thành công!');
      console.log(successMessage);
      setTimeout(() => {
        onClose();
        dispatch(
          fetchEmployees({
            page: 1,
            size: 10,
            sort: 'createdAt',
            order: 'DESC',
            value: '',
          })
        );
      }, 5000);
    } catch (err: any) {
      setError(`Lỗi khi tạo nhân viên: ${err.message || err}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'}>
        <DialogTitle>Thêm nhân viên mới</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : departments ? (
            <>
              <TextField
                label={'Tài khoản'}
                name="userName"
                fullWidth
                margin="dense"
                value={employeeData.userName}
                onChange={handleChange}
              />
              <TextField
                label={'Mật khẩu'}
                name="password"
                fullWidth
                margin="dense"
                value={employeeData.password}
                onChange={handleChange}
              />
              <TextField
                label={'Họ và tên'}
                name="fullName"
                fullWidth
                margin="dense"
                value={employeeData.fullName}
                onChange={handleChange}
              />
              <TextField
                label={'Vai trò'}
                name="role"
                fullWidth
                margin="dense"
                value={employeeData.role}
                select
                onChange={handleChange}
              >
                {/* Sửa để thêm role */}
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
                value={employeeData.position}
                select
                onChange={handleChange}
              >
                {/* Sửa để thêm position */}
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
                value={employeeData.department}
                onChange={handleChange}
              >
                {departments.map(department => {
                  return (
                    <MenuItem value={department._id}>
                      {department.name}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                label={'Ngày sinh'}
                name="dob"
                value={employeeData.dob}
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
                value={employeeData.baseSalary}
                onChange={handleChange}
              />
              <TextField
                label={'Ngân hàng'}
                name="bankAccount.bankName"
                value={employeeData.bankAccount.bankName}
                fullWidth
                margin="dense"
                onChange={handleChange}
              />
              <TextField
                label={'Số tài khoản'}
                name="bankAccount.accountNumber"
                value={employeeData.bankAccount.accountNumber}
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
                value={employeeData.insurance.healthInsuranceRate}
                onChange={handleChange}
              />
              <TextField
                label="Bảo hiểm xã hội"
                name="insurance.socialInsuranceRate"
                fullWidth
                type="number"
                margin="dense"
                value={employeeData.insurance.socialInsuranceRate}
                onChange={handleChange}
              />
              <TextField
                label="Bảo hiểm thất nghiệp"
                name="insurance.unemploymentInsuranceRate"
                fullWidth
                type="number"
                margin="dense"
                value={employeeData.insurance.unemploymentInsuranceRate}
                onChange={handleChange}
              />
              <TextField
                label="Mã số thuế"
                name="taxCode"
                fullWidth
                margin="dense"
                value={employeeData.taxCode}
                onChange={handleChange}
              />
              <TextField
                label="Ngày bắt đầu hợp đồng"
                name="contract.startDate"
                InputLabelProps={{ shrink: true }}
                fullWidth
                type="date"
                margin="dense"
                value={employeeData.contract.startDate}
                onChange={handleChange}
              />
              <TextField
                label="Ngày kết thúc hợp đồng"
                name="contract.endDate"
                InputLabelProps={{ shrink: true }}
                fullWidth
                type="date"
                margin="dense"
                value={employeeData.contract.endDate}
                onChange={handleChange}
              />
              <TextField
                label="Loại hợp đồng"
                name="contract.contractType"
                fullWidth
                select
                margin="dense"
                value={employeeData.contract.contractType}
                onChange={handleChange}
              >
                <MenuItem value={'PERMANENT'}>PERMANENT</MenuItem>
                <MenuItem value={'TEMPORARY'}>TEMPORARY</MenuItem>
              </TextField>
              <TextField
                label="Trạng thái"
                name="contract.status"
                fullWidth
                select
                margin="dense"
                value={employeeData.contract.status}
                onChange={handleChange}
              >
                <MenuItem value={'ACTIVE'}>ACTIVE</MenuItem>
                <MenuItem value={'INACTIVE'}>INACTIVE</MenuItem>
              </TextField>
              <TextField
                label="Ngày ký hợp đồng"
                name="contract.signDate"
                InputLabelProps={{ shrink: true }}
                fullWidth
                type="date"
                margin="dense"
                value={employeeData.contract.signDate}
                onChange={handleChange}
              />
            </>
          ) : (
            <Typography color="error">Lỗi không lấy được department</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            {' '}
            Đóng{' '}
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">
            Tạo mới
          </Button>
        </DialogActions>
      </Dialog>
      {/* Hiển thị thông báo lỗi nếu có */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      {/* Thông báo thành công */}
      <Snackbar
        open={successMessage !== null}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </>
  );
}
