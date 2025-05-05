import React, { useEffect } from 'react';
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
  Paper, // Thêm Paper để tạo nền cho bảng
  Box, // Thêm Box để căn giữa CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { getAllPropertyByDepartment } from '../../../store/propertySlice';

interface Property {
  _id: string;
  name: string;
  status: string;
  number: number;
  // Thêm các thuộc tính khác nếu cần
}

interface PropertyDialogProps {
  open: boolean;
  onClose: () => void;
  departmentId: string | null; // ID của phòng ban
}

const PropertyDialog: React.FC<PropertyDialogProps> = ({
  open,
  onClose,
  departmentId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // Đảm bảo kiểu dữ liệu của properties khớp với interface Property
  const { properties, loading } = useSelector(
    (state: RootState) =>
      state.property as { properties: Property[]; loading: boolean }
  );

  useEffect(() => {
    if (open && departmentId) {
      dispatch(getAllPropertyByDepartment(departmentId));
    }
  }, [open, departmentId, dispatch]);

  if (departmentId) {
    return (
      // Tăng maxWidth để bảng có không gian hiển thị tốt hơn
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Danh sách tài sản</DialogTitle>
        <DialogContent>
          {loading ? (
            // Căn giữa CircularProgress
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: 150 }}
            >
              <CircularProgress />
            </Box>
          ) : properties.length > 0 ? (
            // Sử dụng TableContainer với Paper để có giao diện bảng chuẩn
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{
                  borderCollapse: 'collapse', // Đảm bảo các border không bị chồng chéo
                  '& td, & th': {
                    border: '1px solid #e0e0e0', // Thêm border cho các ô trong bảng
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ cursor: 'pointer' }}>
                    {/* Định nghĩa các cột */}
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
                  </TableRow>
                </TableHead>
                <TableBody sx={{ cursor: 'pointer' }}>
                  {properties.map((property, index) => (
                    <TableRow
                      key={property._id}
                      // Thêm hover effect cho từng dòng
                      sx={{
                        '&:hover': {
                          backgroundColor: theme => theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{property.name}</TableCell>
                      <TableCell>{property.status}</TableCell>
                      <TableCell align="right">{property.number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // Giữ lại thông báo khi không có dữ liệu
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Không có tài sản nào trong phòng ban này.
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
  } else {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Danh sách tài sản</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Lỗi khi lấy danh sách tài sản. Xin vui lòng đăng nhập lại.
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
};

export default PropertyDialog;
