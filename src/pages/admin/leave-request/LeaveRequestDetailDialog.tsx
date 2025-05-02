import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  approveLeaveRequest,
  rejectLeaveRequest,
  fecthLeaveRequests,
} from '../../../store/leaveRequestSlice';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

interface LeaveRequestDetailDialogProps {
  open: boolean;
  onClose: () => void;
  leaveRequestId: string | null;
}

export default function LeaveRequestDetailDialog({
  open,
  onClose,
  leaveRequestId,
}: LeaveRequestDetailDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { leaveRequests, loading } = useSelector(
    (state: RootState) => state.leaveRequest
  );

  const leaveRequest = leaveRequests.find(
    request => request._id === leaveRequestId
  );

  const refreshLeaveRequests = async () => {
    await dispatch(
      fecthLeaveRequests({
        page: 1,
        size: 10,
        field: 'createdAt',
        order: 'desc',
        value: '',
        status: '',
      })
    );
  };

  const handleApprove = async () => {
    if (leaveRequestId) {
      await dispatch(approveLeaveRequest(leaveRequestId));
      await refreshLeaveRequests(); // Gọi lại API để cập nhật danh sách
      onClose();
    }
  };

  const handleReject = async () => {
    if (leaveRequestId) {
      await dispatch(rejectLeaveRequest(leaveRequestId));
      await refreshLeaveRequests(); // Gọi lại API để cập nhật danh sách
      onClose();
    }
  };

  if (loading || !leaveRequest) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi tiết đơn xin nghỉ phép</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <b>Nhân viên:</b> {leaveRequest.employeeId.name}
        </Typography>
        <Typography variant="body1">
          <b>Phòng ban:</b> {leaveRequest.employeeId.department}
        </Typography>
        <Typography variant="body1">
          <b>Loại nghỉ phép:</b>{' '}
          {leaveRequest.leaveType === 'ANNUAL_LEAVE'
            ? 'Nghỉ phép năm'
            : leaveRequest.leaveType === 'SICK_LEAVE'
            ? 'Nghỉ ốm'
            : leaveRequest.leaveType === 'MATERNITY_LEAVE'
            ? 'Nghỉ thai sản'
            : 'Nghỉ không lương'}
        </Typography>
        <Typography variant="body1">
          <b>Ngày bắt đầu:</b> {convertToVietnamDate(leaveRequest.startDate)}
        </Typography>
        <Typography variant="body1">
          <b>Ngày kết thúc:</b> {convertToVietnamDate(leaveRequest.endDate)}
        </Typography>
        <Typography variant="body1">
          <b>Lý do:</b> {leaveRequest.reason}
        </Typography>
        <Typography variant="body1">
          <b>Trạng thái:</b>{' '}
          {leaveRequest.status === 'PENDING'
            ? 'Đang chờ duyệt'
            : leaveRequest.status === 'APPROVED'
            ? 'Đã phê duyệt'
            : 'Đã từ chối'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject} color="error" variant="contained">
          Từ chối
        </Button>
        <Button onClick={handleApprove} color="primary" variant="contained">
          Phê duyệt
        </Button>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
