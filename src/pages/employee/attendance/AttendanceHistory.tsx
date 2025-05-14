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
} from '@mui/material';
import { convertToVietnamTime } from '../../../lib/formatDateTime';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect } from 'react';
import { getAllMyAttendanceRecord } from '../../../store/attendanceSlice';

export const AttendanceHistory = () => {
  const { attendanceRecords } = useSelector(
    (state: RootState) => state.attendance
  );

  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    dispatch(getAllMyAttendanceRecord(userId || ''));
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lịch sử chấm công
      </Typography>
      <TableContainer component={Paper}>
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
              <TableCell>Chấm vào</TableCell>
              <TableCell>Kết thúc ca</TableCell>
              <TableCell>Đi muộn</TableCell>
              <TableCell>Đúng giờ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.map((record: any, index: number) => (
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
                        color: 'red', // Khi checkbox được chọn, màu sẽ là đỏ
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
                        color: 'green', // Khi checkbox được chọn, màu sẽ là xanh
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
