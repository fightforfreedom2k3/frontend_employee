import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { deleteEmployee, fetchEmployees } from '../../../store/employeeSlice';
import EmployeeDialog from './EmployeeDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import UpdateEmployeeDialog from './UpdateEmployeeDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { departmentService } from '../../../services/department';
import { Department } from '../../../types/departments';

export default function EmployeeList() {
  console.log(localStorage.getItem('token'));
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [departments, setDepartments] = useState<Department[] | undefined>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error, pagination } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: page + 1,
        size: rowsPerPage,
        sort: 'createdAt',
        order: 'DESC',
        value: searchQuery.trim(),
        department: selectedDepartmentId,
      })
    );
    departmentService
      .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
      .then(response => {
        setDepartments(response.data.data);
      })
      .catch(error => {
        //maybe i'll add alert or sth
      });
  }, [dispatch, page, rowsPerPage, searchQuery, selectedDepartmentId]);

  // Dialog handling
  const handleRowClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEmployeeId('');
  };

  const handleCreateDialogOpen = () => setCreateDialogOpen(true);
  const handleCreateDialogClose = () => setCreateDialogOpen(false);

  const handleUpdateDialogOpen = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setUpdateDialogOpen(true);
  };

  const handleUpdateDialogClose = () => setUpdateDialogOpen(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteEmployee = () => {
    dispatch(deleteEmployee({ id: selectedEmployeeId }))
      .then(() => {
        setConfirmDeleteOpen(false);
        dispatch(
          fetchEmployees({
            page: page + 1,
            size: rowsPerPage,
            sort: 'createdAt',
            order: 'DESC',
            value: searchQuery.trim(),
          })
        );
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
        setConfirmDeleteOpen(false);
      });
  };

  const handleDeleteButtonClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setConfirmDeleteOpen(true);
  };

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Tìm kiếm nhân viên"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={selectedDepartmentId}
            onChange={event => setSelectedDepartmentId(event.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Tất cả phòng ban</em>
            </MenuItem>
            {departments?.map(department => (
              <MenuItem key={department._id} value={department._id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
          <Button
            onClick={handleCreateDialogOpen}
            variant="contained"
            color="primary"
          >
            Tạo mới người dùng
          </Button>
        </Grid>
      </Grid>

      {/* Employee Table */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'auto',
          maxHeight: '62vh',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            overflowX: 'auto',
            width: '100%',
            maxWidth: '1200px',
            border: '1px solid #e0e0e0', // Thêm border cho TableContainer
          }}
        >
          <Table
            sx={{
              borderCollapse: 'collapse', // Đảm bảo các border không bị chồng chéo
              '& td, & th': {
                border: '1px solid #e0e0e0', // Thêm border cho các ô trong bảng
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Họ & Tên</b>
                </TableCell>
                <TableCell>
                  <b>Chức vụ</b>
                </TableCell>
                {!isSmallScreen && (
                  <TableCell>
                    <b>Phòng ban</b>
                  </TableCell>
                )}
                {!isSmallScreen && (
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                )}
                <TableCell>
                  <b>Số điện thoại</b>
                </TableCell>
                <TableCell sx={{ ml: 3 }}>
                  <b>Hành động</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees &&
                employees.map(emp => (
                  <TableRow
                    key={emp._id}
                    onClick={() => handleRowClick(emp._id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <TableCell>{emp.fullName}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    {!isSmallScreen && (
                      <TableCell>{emp.department?.name}</TableCell>
                    )}
                    {!isSmallScreen && <TableCell>{emp.email}</TableCell>}
                    <TableCell>{emp.phoneNumber}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={event => {
                          event.stopPropagation();
                          handleDeleteButtonClick(emp._id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={event => {
                          event.stopPropagation();
                          handleUpdateDialogOpen(emp._id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
        <TablePagination
          component="div"
          count={pagination.totalEmployee || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
        />
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa nhân viên này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleDeleteEmployee} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogs */}
      <EmployeeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        employeeId={selectedEmployeeId}
      />
      <CreateEmployeeDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
      />
      <UpdateEmployeeDialog
        open={updateDialogOpen}
        onClose={handleUpdateDialogClose}
        employeeId={selectedEmployeeId}
      />
    </Container>
  );
}
