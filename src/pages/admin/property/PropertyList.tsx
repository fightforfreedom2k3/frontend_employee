import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect, useState } from 'react';
import {
  getAllPropertyByDepartmentAndStatus,
  returnProperty,
  requestMaintenance, // Import action
} from '../../../store/propertySlice';
import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { convertToVietnamDate } from '../../../lib/formatDateTime';
import CreatePropertyDialog from './CreatePropertyDialog';
import { departmentService } from '../../../services/department';
import { Department } from '../../../types/departments';

export default function PropertyList() {
  const { properties, loading, error, pagination } = useSelector(
    (state: RootState) => state.property
  );
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');
  const [departments, setDepartments] = useState<Department[] | undefined>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch departments and set default department
    departmentService
      .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
      .then(response => {
        const departmentList = response.data.data ?? [];
        setDepartments(departmentList);
        if (departmentList.length > 0) {
          setSelectedDepartmentId(departmentList[0]._id); // Set default department to the first one
        }
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch properties based on filters
    if (selectedDepartmentId) {
      dispatch(
        getAllPropertyByDepartmentAndStatus({
          departmentId: selectedDepartmentId,
          status: selectedStatus,
          page: page + 1,
          size: rowsPerPage,
          sort: 'createdAt',
          order: 'DESC',
          value: searchQuery.trim(),
        })
      );
    }
  }, [
    dispatch,
    selectedDepartmentId,
    selectedStatus,
    page,
    rowsPerPage,
    searchQuery,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
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

  const handleCreateDialogOpen = () => setCreateDialogOpen(true);
  const handleCreateDialogClose = () => setCreateDialogOpen(false);

  const handleReturnProperty = async (propertyId: string) => {
    try {
      await dispatch(returnProperty(propertyId)).unwrap(); // Call returnProperty API
      dispatch(
        getAllPropertyByDepartmentAndStatus({
          departmentId: selectedDepartmentId,
          status: selectedStatus,
          page: page + 1,
          size: rowsPerPage,
          sort: 'createdAt',
          order: 'DESC',
          value: searchQuery.trim(),
        })
      ); // Refresh the property list
    } catch (error) {
      console.error('Error returning property:', error);
    }
  };

  const handleRequestMaintenance = async (propertyId: string) => {
    try {
      await dispatch(requestMaintenance(propertyId)).unwrap(); // Call requestMaintenance API
      dispatch(
        getAllPropertyByDepartmentAndStatus({
          departmentId: selectedDepartmentId,
          status: selectedStatus,
          page: page + 1,
          size: rowsPerPage,
          sort: 'createdAt',
          order: 'DESC',
          value: searchQuery.trim(),
        })
      ); // Refresh the property list
    } catch (error) {
      console.error('Error requesting maintenance:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Lỗi khi tải dữ liệu cơ sở vật chất:{' '}
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      );
    }

    if (!properties || properties.length === 0) {
      return (
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Không có cơ sở vật chất nào trong hệ thống.
        </Typography>
      );
    }

    return (
      <>
        <Box>
          <TableContainer
            sx={{
              overflowX: 'auto',
              width: '100%',
              maxWidth: '1200px',
              border: '1px solid #e0e0e0',
              maxHeight: '60vh',
              boxShadow: 'none',
            }}
            component={Paper}
          >
            <Table
              sx={{
                borderCollapse: 'collapse',
                '& td, & th': {
                  border: '1px solid #e0e0e0',
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    '& th': { fontWeight: 'bold', backgroundColor: 'grey.100' },
                  }}
                >
                  <TableCell>Tên cơ sở vật chất</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map(property => (
                  <TableRow key={property._id} hover>
                    <TableCell component="th" scope="row">
                      {property.name}
                    </TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell align="right">{property.number}</TableCell>
                    <TableCell>
                      {property.department?.name || 'Không xác định'}
                    </TableCell>
                    <TableCell>
                      {convertToVietnamDate(property.createdAt)}
                    </TableCell>
                    <TableCell>
                      {/* Add Maintenance button */}
                      {property.status === 'ACTIVE' && (
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => handleRequestMaintenance(property._id)}
                        >
                          Bảo trì
                        </Button>
                      )}
                      {/* Add Return button */}
                      {property.status === 'MAINTAINING' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleReturnProperty(property._id)}
                        >
                          Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 25]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} / ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Box>
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        component="div"
        sx={{ fontWeight: 'medium' }}
      >
        Quản Lý Cơ Sở Vật Chất
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Tìm kiếm cơ sở vật chất"
            variant="outlined"
            size="small"
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
            {departments?.map(department => (
              <MenuItem key={department._id} value={department._id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={selectedStatus}
            onChange={event => setSelectedStatus(event.target.value)}
            displayEmpty
          >
            <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
            <MenuItem value="MAINTAINING">Bảo trì</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {renderContent()}

      <CreatePropertyDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
      />
    </Container>
  );
}
