import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Department } from '../../../types/departments';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect } from 'react';
import { getAllEmployeeByDepartment } from '../../../store/employeeSlice';

export interface DepartmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
}

export const DepartmentDetailDialog = (props: DepartmentDetailDialogProps) => {
  const { open, onClose, department } = props;
  const { employees, loading, pagination } = useSelector(
    (state: RootState) => state.employee
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (department?._id) {
      dispatch(
        getAllEmployeeByDepartment({
          department: department._id,
          page: 1,
          size: 100,
          sort: 'role',
          order: 'ASC',
          value: '',
        })
      );
    }
  }, [department, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {/* Tên phòng ban */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              {department?.name}
            </Typography>
          </Grid>

          {/* Thông tin người quản lý */}
          <Grid item xs={12} container alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h6">
                <strong>Quản lý</strong>: {department?.manager?.fullName}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: 'black' }}>
              <strong>Mô tả:</strong> {department?.description}
            </Typography>
          </Grid>

          {/* Danh sách nhân viên */}
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{ marginBottom: 2, color: 'black' }}
            >
              <strong>Số lượng</strong>: {pagination?.totalEmployee || 0}
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Danh sách nhân viên:
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Họ tên</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Vai trò</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map(employee => (
                      <TableRow key={employee._id}>
                        <TableCell>{employee.fullName}</TableCell>
                        <TableCell>
                          {employee.role === 'ADMIN'
                            ? 'Trưởng phòng'
                            : 'Nhân viên'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
