import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fecthLeaveRequests } from '../../../store/leaveRequestSlice';
import { convertToVietnamDate } from '../../../lib/formatDateTime';
import LeaveRequestDetailDialog from './LeaveRequestDetailDialog';

export default function LeaveRequestList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState<
    string | null
  >(null);

  const dispatch = useDispatch<AppDispatch>();
  const { leaveRequests, loading, error, pagination } = useSelector(
    (state: RootState) => state.leaveRequest
  );

  useEffect(() => {
    dispatch(
      fecthLeaveRequests({
        page: page + 1,
        size: rowsPerPage,
        field: 'createdAt',
        order: 'desc',
        value: searchQuery.trim(),
        status: statusFilter,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery, statusFilter]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleRowClick = (id: string) => {
    setSelectedLeaveRequestId(id);
  };

  const handleCloseDialog = () => {
    setSelectedLeaveRequestId(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách yêu cầu nghỉ phép
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
        <Select
          value={statusFilter}
          onChange={handleStatusChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>Tất cả trạng thái</em>
          </MenuItem>
          <MenuItem value="PENDING">Đang chờ</MenuItem>
          <MenuItem value="APPROVED">Đã duyệt</MenuItem>
          <MenuItem value="REJECTED">Từ chối</MenuItem>
        </Select>
      </Box>

      {/* Table */}
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
                <b>Nhân viên</b>
              </TableCell>
              <TableCell>
                <b>Phòng ban</b>
              </TableCell>
              <TableCell>
                <b>Ngày bắt đầu</b>
              </TableCell>
              <TableCell>
                <b>Ngày kết thúc</b>
              </TableCell>
              <TableCell>
                <b>Lý do</b>
              </TableCell>
              <TableCell>
                <b>Trạng thái</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="error">Đã xảy ra lỗi!</Typography>
                </TableCell>
              </TableRow>
            ) : leaveRequests.length > 0 ? (
              leaveRequests.map(request => (
                <TableRow
                  key={request._id}
                  hover
                  onClick={() => handleRowClick(request._id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{request.employeeId.name}</TableCell>
                  <TableCell>{request.employeeId.department}</TableCell>
                  <TableCell>
                    {convertToVietnamDate(request.startDate)}
                  </TableCell>
                  <TableCell>{convertToVietnamDate(request.endDate)}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    {request.status === 'PENDING'
                      ? 'Đang chờ duyệt'
                      : request.status === 'APPROVED'
                      ? ' Đã phê duyệt'
                      : 'Đã từ chối'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có yêu cầu nghỉ phép nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={pagination?.totalRequest || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Detail Dialog */}
      {selectedLeaveRequestId && (
        <LeaveRequestDetailDialog
          open={!!selectedLeaveRequestId}
          onClose={handleCloseDialog}
          leaveRequestId={selectedLeaveRequestId}
        />
      )}
    </Container>
  );
}
