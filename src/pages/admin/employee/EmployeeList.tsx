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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { deleteEmployee, fetchEmployees } from '../../../store/employeeSlice';
import EmployeeDialog from './EmployeeDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import UpdateEmployeeDialog from './UpdateEmployeeDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function EmployeeList() {
  console.log(localStorage.getItem('token'));
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error, pagination } = useSelector(
    (state: RootState) => state.employee
  );

  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Dialog xác nhận xóa

  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: page + 1,
        size: rowsPerPage,
        sort: 'createdAt',
        order: 'DESC',
        value: searchQuery.trim(),
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  // Các hàm xử lý dialog
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

  // Xử lý phân trang
  const handleChangePage = (event: unknown, newPage: number) =>
    setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Xử lý xóa nhân viên và load lại trang
  const handleDeleteEmployee = () => {
    dispatch(deleteEmployee({ id: selectedEmployeeId }))
      .then(() => {
        // Sau khi xóa thành công, đóng dialog xác nhận xóa và load lại dữ liệu
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

  // Hiển thị Loading và Error
  // if (loading)
  //   return (
  //     <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />
  //   );
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tìm kiếm nhân viên"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            onClick={handleCreateDialogOpen}
            variant="contained"
            color="secondary"
          >
            Tạo mới người dùng
          </Button>
        </Grid>
      </Grid>

      {/* Bảng nhân viên */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxHeight: '62vh',
        }}
      >
        <TableContainer
          component={Paper}
          sx={{ overflowX: 'auto', width: '100%', maxWidth: '1200px' }}
        >
          <Table>
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
                <TableCell sx={{ ml: 3 }}>Hành động</TableCell>
                <TableCell />
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
                      <TableCell>
                        {emp.department ? emp.department.name : ''}
                      </TableCell>
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
                        <Typography>Xóa</Typography>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={event => {
                          event.stopPropagation();
                          handleUpdateDialogOpen(emp._id);
                        }}
                      >
                        <Typography>Chỉnh sửa</Typography>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Phân trang */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
        <TablePagination
          component="div"
          count={pagination.totalEmployee || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="Số nhân viên mỗi trang"
        />
      </Box>

      {/* Hiển thị Dialog xác nhận xóa */}
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

      {/* Hiển thị các Dialog khác */}
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
