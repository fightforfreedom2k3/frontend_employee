import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { getAllMyLeaveRequest } from '../../../store/leaveRequestSlice';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

interface LeaveRequestsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LeaveRequestsDialog({
  open,
  onClose,
}: LeaveRequestsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { leaveRequests, loading } = useSelector(
    (state: RootState) => state.leaveRequest
  );

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (open && userId) {
      dispatch(getAllMyLeaveRequest(userId));
    }
  }, [open, userId, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Danh sách yêu cầu nghỉ phép của tôi</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : leaveRequests.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Loại nghỉ phép</b>
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
                {leaveRequests.map(request => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {request.leaveType === 'ANNUAL_LEAVE'
                        ? 'Nghỉ phép năm'
                        : request.leaveType === 'SICK_LEAVE'
                        ? 'Nghỉ ốm'
                        : request.leaveType === 'MATERNITY_LEAVE'
                        ? 'Nghỉ thai sản'
                        : 'Nghỉ không lương'}
                    </TableCell>
                    <TableCell>
                      {convertToVietnamDate(request.startDate)}
                    </TableCell>
                    <TableCell>
                      {convertToVietnamDate(request.endDate)}
                    </TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      {request.status === 'PENDING'
                        ? 'Đang chờ duyệt'
                        : request.status === 'APPROVED'
                        ? 'Đã phê duyệt'
                        : 'Đã từ chối'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Không có yêu cầu nghỉ phép nào.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
