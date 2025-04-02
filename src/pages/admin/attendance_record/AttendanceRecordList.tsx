import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import React, { useEffect, useState } from 'react';
import { fetchAllAttendanceRecords } from '../../../store/attendanceSlice';
import { convertToVietnamTime } from '../../../lib/formatDateTime';

export default function AttendanceRecordList() {
  const dispatch = useDispatch<AppDispatch>();
  const { allAttendanceRecords, loading, error, pagination } = useSelector(
    (state: RootState) => state.attendance
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedAttendaceRecordId, setSelectedAttendanceRecordId] =
    useState<string>('');

  useEffect(() => {
    dispatch(
      fetchAllAttendanceRecords({
        page: page + 1,
        size: rowsPerPage,
        sort: 'checkIn',
        order: 'DESC',
      })
    );
  }, [dispatch, page, rowsPerPage]);

  //Xử lí phân trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  //Xử lí chọn số hàng mỗi trang
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(allAttendanceRecords);

  //Giao diện quản lý Chấm công
  return (
    <Container
      maxWidth={'lg'}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
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
          sx={{
            overflow: 'auto',
            width: '100%',
            maxWidth: '900px',
            border: '1px solid #e0e0e0', // Thêm border cho TableContainer
            borderRadius: '5px', // Bo góc
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng
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
            {/* Head */}
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Tên nhân viên</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Tên phòng</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Thời gian chấm công</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Kết thúc ca</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Trạng thái</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {/* Body */}
            <TableBody>
              {allAttendanceRecords.map(attendanceRecord => (
                <TableRow
                  key={attendanceRecord._id}
                  onClick={() => {}}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderBottom: '1px solid #ccc', // Thêm border giữa các hàng
                  }}
                >
                  <TableCell>
                    {attendanceRecord.employeeDetails
                      ? attendanceRecord.employeeDetails.fullName
                      : ''}
                  </TableCell>
                  <TableCell>Nothing</TableCell>
                  <TableCell>
                    {convertToVietnamTime(attendanceRecord.checkIn)}
                  </TableCell>
                  <TableCell>
                    {convertToVietnamTime(attendanceRecord.checkOut)}
                  </TableCell>
                  <TableCell>{attendanceRecord.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
