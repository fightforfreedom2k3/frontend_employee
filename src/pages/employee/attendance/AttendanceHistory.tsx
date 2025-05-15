import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination, // Thêm dòng này
} from '@mui/material';
import { convertToVietnamTime } from '../../../lib/formatDateTime';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect, useState } from 'react'; // Thêm useState
import { getAllMyAttendanceRecord } from '../../../store/attendanceSlice';

export const AttendanceHistory = () => {
  const { attendanceRecords } = useSelector(
    (state: RootState) => state.attendance
  );

  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem('userId');

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAllMyAttendanceRecord(userId || ''));
  }, [dispatch]);

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lấy dữ liệu cho trang hiện tại
  const paginatedRecords = attendanceRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lịch sử chấm công
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            borderCollapse: 'collapse',
            '& td, & th': {
              border: '1px solid #e0e0e0',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Chấm vào</TableCell>
              <TableCell>Kết thúc ca</TableCell>
              <TableCell>Đi muộn</TableCell>
              <TableCell>Đúng giờ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{convertToVietnamTime(record.checkIn)}</TableCell>
                <TableCell>
                  {record.checkOut
                    ? convertToVietnamTime(record.checkOut)
                    : 'Chưa kết thúc ca'}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={record.status === 'LATE'}
                    disabled
                    sx={{
                      color: record.status === 'LATE' ? 'red' : 'default',
                      '&.Mui-checked': {
                        color: 'red',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={record.status === 'PRESENT'}
                    disabled
                    sx={{
                      color: record.status === 'PRESENT' ? 'green' : 'default',
                      '&.Mui-checked': {
                        color: 'green',
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={attendanceRecords.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </TableContainer>
    </Container>
  );
};
