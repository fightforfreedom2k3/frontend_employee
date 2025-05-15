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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeetings } from '../../../store/meetingSlice';
import { AppDispatch, RootState } from '../../../store';
import MeetingDetailsDialog from './MeetingDetailsDialog';
import { convertToVietnamTime } from '../../../lib/formatDateTime';

interface MeetingListDialogProps {
  open: boolean;
  onClose: () => void;
}

const MeetingListDialog: React.FC<MeetingListDialogProps> = ({
  open,
  onClose,
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const departmentId = localStorage.getItem('departmentId') || '';
  const dispatch = useDispatch<AppDispatch>();
  const { meetings, loading, error } = useSelector(
    (state: RootState) => state.meeting
  );

  useEffect(() => {
    if (open) {
      dispatch(
        fetchMeetings({
          page: 1,
          size: 10,
          field: 'date',
          order: 'asc',
          departmentId: departmentId,
          status: 'PENDING',
        })
      );
    }
  }, [open, dispatch]);

  const handleRowClick = (meeting: any) => {
    setSelectedMeeting(meeting);
    setDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Danh sách lịch họp chờ duyệt</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : meetings.length === 0 ? (
            <Typography>Không có lịch họp nào chờ duyệt.</Typography>
          ) : (
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
                  <TableRow
                    sx={{
                      '& th': {
                        fontWeight: 'bold',
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    <TableCell>Tên cuộc họp</TableCell>
                    <TableCell>Phòng ban</TableCell>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings
                    .filter(
                      meeting =>
                        new Date(meeting.date).setHours(0, 0, 0, 0) >=
                        new Date().setHours(0, 0, 0, 0)
                    )
                    .map(meeting => (
                      <TableRow
                        key={meeting.name}
                        hover
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(meeting)}
                      >
                        <TableCell>{meeting.name}</TableCell>
                        <TableCell>{meeting.department.name}</TableCell>
                        <TableCell>
                          {convertToVietnamTime(meeting.date)}
                        </TableCell>
                        <TableCell>Đang chờ duyệt</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {selectedMeeting && (
        <MeetingDetailsDialog
          open={detailsDialogOpen}
          onClose={handleDetailsDialogClose}
          meeting={selectedMeeting}
        />
      )}
    </>
  );
};

export default MeetingListDialog;
