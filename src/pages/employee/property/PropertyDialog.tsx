import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  getAllPropertyByDepartmentAndStatus,
  requestMaintenance,
} from '../../../store/propertySlice';

interface Property {
  _id: string;
  name: string;
  status: string;
  number: number;
}

interface PropertyDialogProps {
  open: boolean;
  onClose: () => void;
}

const PropertyDialog: React.FC<PropertyDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, pagination } = useSelector(
    (state: RootState) =>
      state.property as {
        properties: Property[];
        loading: boolean;
        pagination: { total: number; page: number; size: number };
      }
  );

  const [page, setPage] = useState<number>(0); // Current page (0-based index)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Rows per page
  const departmentId = localStorage.getItem('departmentId'); // Lấy departmentId từ localStorage

  const handleRequestMaintenance = async (propertyId: string) => {
    await dispatch(requestMaintenance(propertyId));
    fetchProperties();
  };

  const fetchProperties = () => {
    if (departmentId) {
      dispatch(
        getAllPropertyByDepartmentAndStatus({
          departmentId,
          status: 'ACTIVE',
          page: page + 1, // API expects 1-based index
          size: rowsPerPage,
          sort: 'createdAt',
          order: 'desc',
          value: '',
        })
      );
    }
  };

  useEffect(() => {
    if (open) {
      fetchProperties();
    }
  }, [open, departmentId, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  if (!departmentId) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Danh sách tài sản</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Lỗi khi lấy danh sách tài sản. Không tìm thấy ID phòng ban.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Danh sách tài sản</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: 150 }}
          >
            <CircularProgress />
          </Box>
        ) : properties.length > 0 ? (
          <>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{
                  borderCollapse: 'collapse',
                  '& td, & th': {
                    border: '1px solid #e0e0e0',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Tên tài sản
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Trạng thái
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Số lượng
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((property, index) => (
                    <TableRow
                      key={property._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme => theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell>{property.name}</TableCell>
                      <TableCell>{property.status}</TableCell>
                      <TableCell align="right">{property.number}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleRequestMaintenance(property._id)}
                          disabled={property.status === 'MAINTAINING'} // Disable nếu trạng thái là MAINTAINING
                        >
                          Yêu cầu bảo trì
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
          </>
        ) : (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Không có tài sản nào phù hợp với bộ lọc.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDialog;
