import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { approveMeeting, rejectMeeting } from '../../../store/meetingSlice';
import { AppDispatch } from '../../../store';
import { convertToVietnamTime } from '../../../lib/formatDateTime';

interface MeetingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  meeting: any;
}

const MeetingDetailsDialog: React.FC<MeetingDetailsDialogProps> = ({
  open,
  onClose,
  meeting,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleApprove = () => {
    dispatch(approveMeeting(meeting._id));
    onClose();
  };

  const handleReject = () => {
    dispatch(rejectMeeting(meeting._id));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi tiết cuộc họp</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Tên cuộc họp: {meeting.name}</Typography>
        <Typography>Phòng ban: {meeting.department.name}</Typography>
        <Typography>Thời gian: {convertToVietnamTime(meeting.date)}</Typography>
        <Typography>Mô tả: {meeting.description}</Typography>
        <Typography>Trạng thái: {meeting.status}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject} color="secondary">
          Từ chối
        </Button>
        <Button onClick={handleApprove} color="primary">
          Phê duyệt
        </Button>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeetingDetailsDialog;
