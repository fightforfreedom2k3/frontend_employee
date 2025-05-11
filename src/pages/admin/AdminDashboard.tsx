import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import MeetingCard from '../../components/card/MeetingCard';
import MeetingListDialog from './meeting/MeetingListDialog';
import CreateMeetingDialog from './meeting/CreateMeetingDialog';
import { convertToVietnamTime } from '../../lib/formatDateTime';
import { Meeting } from '../../types/meeting';
import { meetingService } from '../../services/meeting'; // Import service
import LeaveRequestListDialog from './leave-request/LeaveRequestList';
import PropertyMaintenanceApprovalDialog from './property/PropertyDialog';

export const AdminDashboard = () => {
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [createMeetingDialogOpen, setCreateMeetingDialogOpen] = useState(false);
  const [meetingList, setMeetingList] = useState<Meeting[]>([]); // Giá trị mặc định là mảng rỗng
  const [openLeaveRequestDialog, setOpenLeaveRequestDialog] = useState(false);
  const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false);
  const departmentId = localStorage.getItem('departmentId') || '';

  const handleOpenMeetingDialog = () => {
    setOpenMeetingDialog(true);
  };

  const handleCloseMeetingDialog = () => {
    setOpenMeetingDialog(false);
  };

  const handleOpenCreateMeetingDialog = () => setCreateMeetingDialogOpen(true);
  const handleCloseCreateMeetingDialog = () =>
    setCreateMeetingDialogOpen(false);

  const handleOpenLeaveRequestDialog = () => setOpenLeaveRequestDialog(true);
  const handleCloseLeaveRequestDialog = () => setOpenLeaveRequestDialog(false);

  const handleOpenMaintenanceDialog = () => setOpenMaintenanceDialog(true);
  const handleCloseMaintenanceDialog = () => setOpenMaintenanceDialog(false);

  // Gọi API để lấy danh sách lịch họp
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response =
          await meetingService.getAllMeetingByDepartmentAndStatus(
            1, // page
            10, // size
            'date', // field
            'asc', // order
            departmentId, // Thay bằng ID phòng ban phù hợp
            'APPROVED' // Trạng thái lịch họp
          );
        setMeetingList(response.data.data); // Cập nhật danh sách lịch họp
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Grid container gap={5} pt={5}>
        <Grid item xs={12} sm={7}>
          <Container
            sx={{
              backgroundColor: 'rgba(240, 241, 255, 1)',
              padding: 3,
              borderRadius: '8px',
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Hòm thư công việc
            </Typography>
            <Grid container gap={2} ml={2}>
              <Grid
                item
                xs={12}
                sm={5.5}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer', // Thêm con trỏ chuột
                    transition: 'transform 0.2s, box-shadow 0.2s', // Hiệu ứng chuyển đổi
                    '&:hover': {
                      transform: 'scale(1.05)', // Phóng to nhẹ khi hover
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Thêm bóng
                    },
                  }}
                  onClick={handleOpenCreateMeetingDialog}
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Tạo lịch họp
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={5.5}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={handleOpenMeetingDialog} // Mở dialog khi nhấp
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Lịch họp chờ duyệt
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={5.5}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={handleOpenMaintenanceDialog}
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Tài sản bảo trì chờ duyệt
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={5.5}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={handleOpenLeaveRequestDialog}
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Đơn nghỉ phép chờ duyệt
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Container
            sx={{
              backgroundColor: 'rgba(240, 241, 255, 1)',
              padding: 3,
              borderRadius: '8px',
            }}
          >
            <Typography
              display={'flex'}
              justifyContent={'center'}
              variant="h6"
              fontWeight="bold"
              mb={2}
            >
              Lịch họp sắp tới
            </Typography>
            {meetingList.map((meeting, index) => (
              <MeetingCard
                key={index}
                title={meeting.name}
                description={meeting.description}
                time={convertToVietnamTime(meeting.date)}
              />
            ))}
          </Container>
        </Grid>
      </Grid>
      <MeetingListDialog
        open={openMeetingDialog}
        onClose={handleCloseMeetingDialog}
      />
      <CreateMeetingDialog
        open={createMeetingDialogOpen}
        onClose={handleCloseCreateMeetingDialog}
      />
      <LeaveRequestListDialog
        open={openLeaveRequestDialog}
        onClose={handleCloseLeaveRequestDialog}
      />
      <PropertyMaintenanceApprovalDialog
        open={openMaintenanceDialog}
        onClose={handleCloseMaintenanceDialog}
      />
    </Box>
  );
};
