import {
  Box,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import React, { useEffect, useState } from 'react';
import { fetchAllAttendanceRecords } from '../../../store/attendanceSlice';
import { convertToVietnamTime } from '../../../lib/formatDateTime';
import { departmentService } from '../../../services/department';
import { Department } from '../../../types/departments';

export default function AttendanceRecordList() {
  const dispatch = useDispatch<AppDispatch>();
  const { allAttendanceRecords, loading, error, pagination } = useSelector(
    (state: RootState) => state.attendance
  );

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //filter by department
  const [departmentId, setDepartmentId] = useState<string>('');
  const [departments, setDepartments] = useState<Department[] | undefined>([]);
  const [departmentsLoaded, setDepartmentsLoaded] = useState(false); // Trạng thái để theo dõi khi danh sách phòng ban đã tải xong

  //filter by status
  const [status, setStatus] = useState<string>('PRESENT');

  useEffect(() => {
    departmentService
      .getAllDepartment(1, 100, 'createdAt', 'ASC', '')
      .then(response => {
        const fetchedDepartments = response.data.data;
        setDepartments(fetchedDepartments);
        if (fetchedDepartments.length > 0) {
          setDepartmentId(fetchedDepartments[0]._id); // Đặt phòng ban mặc định là phòng đầu tiên
        }
        setDepartmentsLoaded(true); // Đánh dấu danh sách phòng ban đã tải xong
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (departmentsLoaded) {
      // Chỉ gọi API lấy danh sách chấm công khi danh sách phòng ban đã tải xong
      dispatch(
        fetchAllAttendanceRecords({
          page: page + 1,
          size: rowsPerPage,
          sort: 'checkIn',
          order: 'DESC',
          value: departmentId,
          status: status,
        })
      );
    }
  }, [dispatch, page, rowsPerPage, departmentId, status, departmentsLoaded]);

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

  //Giao diện quản lý Chấm công
  return (
    <Container
      maxWidth={'lg'}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Grid container mt={2} spacing={2} sx={{ mb: 2, width: '100%' }}>
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={departmentId}
            onChange={event => setDepartmentId(event.target.value)}
            displayEmpty
          >
            {departments?.map(department => (
              <MenuItem key={department._id} value={department._id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {/* Thêm ô chọn trạng thái */}
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={status}
            onChange={event => setStatus(event.target.value)}
            displayEmpty
          >
            <MenuItem value="PRESENT">Đúng giờ</MenuItem>
            <MenuItem value="LATE">Đi muộn</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'auto',
          maxHeight: '65vh',
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
            {/* Head */}
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Tên nhân viên</b>
                </TableCell>
                <TableCell>
                  <b>Thời gian chấm công</b>
                </TableCell>
                <TableCell>
                  <b>Kết thúc ca</b>
                </TableCell>
                <TableCell>
                  <b>Trạng thái</b>
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
                  <TableCell>
                    {convertToVietnamTime(attendanceRecord.checkIn)}
                  </TableCell>
                  <TableCell>
                    {attendanceRecord.checkOut
                      ? convertToVietnamTime(attendanceRecord.checkOut)
                      : 'Chưa kết thúc ca'}
                  </TableCell>
                  <TableCell>
                    {attendanceRecord.status === 'LATE'
                      ? 'Đi muộn'
                      : 'Đúng giờ'}
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
          count={pagination.totalRecord || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Số phòng mỗi trang"
        />
      </Box>
    </Container>
  );
}
