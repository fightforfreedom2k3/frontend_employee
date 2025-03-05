import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useEffect, useState } from 'react';
import { fetchDepartments } from '../../store/departmentSlice';
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

export default function DepartmentList() {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading, pagination, error } = useSelector(
    (state: RootState) => state.department
  );

  //State phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchDepartments({
        page: page + 1,
        size: rowsPerPage,
        sort: 'ASC',
        order: 'createdAt',
      })
    );
  }, [dispatch, page, rowsPerPage]);

  const handleRowClick = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDepartmentId(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (loading)
    return (
      <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />
    );
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
        {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column' }}>
      {
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: '100vh',
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ overflow: 'auto', width: '100%', maxWidth: '900px' }}
          >
            <Table>
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
                    }}
                  >
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell>{department.manager.fullName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      }
      {/* Phân trang */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
        <TablePagination
          component={'div'}
          count={pagination.totalDepartment || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]} // số hàng mỗi cột
          labelRowsPerPage="Số phòng mỗi trang"
        />
      </Box>

      {/* Hiển thị dialog chi tiết phòng ban */}
    </Container>
  );
}
