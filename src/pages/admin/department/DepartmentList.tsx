import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect, useState } from 'react';
import {
  deleteDepartment,
  fetchDepartments,
} from '../../../store/departmentSlice';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DepartmentDetailDialog } from './DepartmentDetailDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CreateDepartmentDialog } from './CreateDepartmentDialog';

export default function DepartmentList() {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, pagination } = useSelector(
    (state: RootState) => state.department
  );

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //State for confirm delete
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // State for dialog visibility
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize data
  useEffect(() => {
    dispatch(
      fetchDepartments({
        page: page + 1,
        size: rowsPerPage,
        sort: 'ASC',
        order: 'createdAt',
        value: searchQuery,
        // Add search query if needed
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle row click for department details
  const handleRowClick = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDepartmentId(null);
  };

  // Handle creating a new department
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => setCreateDialogOpen(false);

  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //handle delete
  const handleDeleteButton = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setConfirmDeleteOpen(true);
  };
  const handleDelete = () => {
    if (selectedDepartmentId !== null) {
      dispatch(deleteDepartment({ id: selectedDepartmentId }))
        .then(() => {
          setConfirmDeleteOpen(false);
          dispatch(
            fetchDepartments({
              page: 1,
              size: 10,
              sort: 'createdAt',
              order: 'ASC',
              value: '',
            })
          );
        })
        .catch(error => {
          console.error('Failed to delete department', error);
        });
    }
  };
  //handle update

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Search and Create Department Section */}
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            label="Tìm kiếm tên phòng ban"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={6} sx={{ textAlign: 'right' }}>
          <Button
            onClick={handleCreateDialogOpen}
            variant="contained"
            color="primary"
          >
            Tạo mới phòng ban
          </Button>
        </Grid>
      </Grid>

      {/* Department List Table */}
      <Box
        maxHeight={'65vh'}
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
                  <b>Tên phòng</b>
                </TableCell>
                <TableCell>
                  <b>Mô tả</b>
                </TableCell>
                <TableCell>
                  <b>Quản lý</b>
                </TableCell>
                <TableCell>
                  <b>Hành động</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map(department => (
                <TableRow
                  key={department._id}
                  onClick={() => handleRowClick(department._id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderBottom: '1px solid #ccc', // Thêm border giữa các hàng
                  }}
                >
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    {department.manager.fullName || 'Chưa có quản lý'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={event => {
                        event.stopPropagation();
                        handleDeleteButton(department._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={event => {
                        event.stopPropagation();
                        // handleUpdate
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
          component={'div'}
          count={pagination.totalDepartment || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Số phòng mỗi trang"
        />
      </Box>

      {/* Dialogs */}
      <DepartmentDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        department={
          departments.find(
            department => department._id === selectedDepartmentId
          ) || null
        }
      />
      <CreateDepartmentDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
      />
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa phòng ban này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
