import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Container,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  checkOut,
  getAllMyAttendanceRecord,
  takeAttendance,
} from '../../store/attendanceSlice';
import { useEffect, useState } from 'react';
import MeetingCard from '../../components/card/MeetingCard'; // Import MeetingCard
import CreateLeaveRequestDialog from './leave_request/CreateLeaveRequestDialog'; // Import dialog
import LeaveRequestsDialog from './leave_request/LeaveRequestsDialog'; // Import dialog
import PropertyDialog from './property/PropertyDialog'; // Import dialog

export default function EmployeeDashboard() {
  const departmentId = localStorage.getItem('departmentId');
  const userId = localStorage.getItem('userId');
  const today = new Date();
  const dispatch = useDispatch<AppDispatch>();
  const { attendanceRecords } = useSelector(
    (state: RootState) => state.attendance
  );

  // Fake data for meetings
  const meetingList = [
    {
      title: 'Cuộc họp dự án A',
      description: 'Thảo luận tiến độ và kế hoạch dự án A.',
      time: '10:00 AM - 11:00 AM, 24/04/2025',
    },
    {
      title: 'Họp nhóm phát triển',
      description: 'Trao đổi về các vấn đề kỹ thuật trong nhóm.',
      time: '2:00 PM - 3:00 PM, 25/04/2025',
    },
    {
      title: 'Đánh giá quý I',
      description: 'Tổng kết và đánh giá hiệu quả công việc quý I.',
      time: '9:00 AM - 10:30 AM, 26/04/2025',
    },
  ];

  // Trạng thái chấm công
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);

  // Trạng thái cho Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  // Trạng thái mở/đóng dialog
  const [openLeaveRequestDialog, setOpenLeaveRequestDialog] = useState(false);
  const [openLeaveRequestsDialog, setOpenLeaveRequestsDialog] = useState(false);
  const [openPropertyDialog, setOpenPropertyDialog] = useState(false);

  // Hàm đóng Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbar(false);
  };

  // Hàm mở/đóng dialog
  const handleOpenLeaveRequestDialog = () => {
    setOpenLeaveRequestDialog(true);
  };

  const handleCloseLeaveRequestDialog = () => {
    setOpenLeaveRequestDialog(false);
  };

  const handleOpenLeaveRequestsDialog = () => {
    setOpenLeaveRequestsDialog(true);
  };

  const handleCloseLeaveRequestsDialog = () => {
    setOpenLeaveRequestsDialog(false);
  };

  const handleOpenPropertyDialog = () => {
    setOpenPropertyDialog(true);
  };

  const handleClosePropertyDialog = () => {
    setOpenPropertyDialog(false);
  };

  // Hàm lấy giờ làm việc
  function getWorkHour() {
    const workHour = new Date(today); // Tạo một bản sao của today
    workHour.setHours(8, 0, 0, 0);
    return workHour.toISOString();
  }

  // Hàm chấm công
  const handleCheckIn = () => {
    if (!userId) return;
    const currentTime = new Date();
    dispatch(
      takeAttendance({
        id: userId,
        checkInData: {
          work_hour: getWorkHour(),
          check_in_hour: currentTime.toISOString(),
          id: userId,
        },
      })
    ).then(() => {
      dispatch(getAllMyAttendanceRecord(userId)); // Gọi lại api để cập nhật lịch sử chấm công
      setIsCheckIn(true);
      setSuccessSnackbar(true);
    });
  };

  // Hàm chấm công ra
  const hadleCheckOut = () => {
    if (!isCheckIn) {
      setOpenSnackbar(true);
      return;
    }
    if (!userId) return;
    const currentTime = new Date();
    dispatch(
      checkOut({
        id: userId,
        check_out_hour: currentTime.toISOString(),
        note: 'Check out',
      })
    ).then(() => {
      dispatch(getAllMyAttendanceRecord(userId)); // Gọi lại api để cập nhật lịch sử chấm công
      setIsCheckOut(true);
      setSuccessSnackbar(true);
    });
  };

  // Lấy lịch sử chấm công
  useEffect(() => {
    if (userId) {
      dispatch(getAllMyAttendanceRecord(userId));
    }
  }, [dispatch, userId]);

  // useEffect riêng để xử lý việc kiểm tra trạng thái checkIn và checkOut
  useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0) {
      try {
        // Kiểm tra checkin
        const nearestCheckIn = new Date(
          attendanceRecords[attendanceRecords.length - 1].checkIn
        );
        if (
          today.getDate() === nearestCheckIn.getDate() &&
          today.getMonth() === nearestCheckIn.getMonth() &&
          today.getFullYear() === nearestCheckIn.getFullYear()
        ) {
          setIsCheckIn(true);
        }
        // Kiểm tra checkOut
        const nearestCheckOut = new Date(
          attendanceRecords[attendanceRecords.length - 1].checkOut
        );
        if (
          today.getDate() === nearestCheckOut.getDate() &&
          today.getMonth() === nearestCheckOut.getMonth() &&
          today.getFullYear() === nearestCheckOut.getFullYear()
        ) {
          setIsCheckOut(true);
        }
      } catch (error) {
        console.error('Lỗi khi xử lý dữ liệu attendanceRecords:', error);
      }
    }
  }, [attendanceRecords]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Button
            disabled={isCheckIn}
            variant="contained"
            color="success"
            onClick={handleCheckIn}
            sx={{ mr: 2 }}
          >
            {isCheckIn ? 'Đã chấm công' : 'Chấm công'}
          </Button>
          <Button
            disabled={isCheckOut}
            variant="contained"
            color="error"
            onClick={hadleCheckOut}
          >
            {isCheckOut ? 'Đã kết thúc ca' : 'Kết thúc ca'}
          </Button>
        </Box>
      </Grid>

      {/* Danh sách mục */}
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
                  onClick={handleOpenLeaveRequestDialog} // Mở dialog khi nhấp
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Yêu cầu nghỉ phép
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
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Yêu cầu đặt lịch họp
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
                  onClick={handleOpenLeaveRequestsDialog} // Mở dialog khi nhấp
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Yêu cầu đã được duyệt
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
                  onClick={handleOpenPropertyDialog} // Mở dialog khi nhấp
                >
                  <CardContent>
                    <Typography
                      fontWeight={700}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      Yêu cầu bảo trì tài sản
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
            {/* Hiển thị danh sách MeetingCard */}
            {meetingList.map((meeting, index) => (
              <MeetingCard
                key={index}
                title={meeting.title}
                description={meeting.description}
                time={meeting.time}
              />
            ))}
          </Container>
        </Grid>
      </Grid>

      {/* Dialog Tạo Đơn Xin Nghỉ Phép */}
      <CreateLeaveRequestDialog
        open={openLeaveRequestDialog}
        onClose={handleCloseLeaveRequestDialog}
      />

      {/* Dialog Hiển Thị Danh Sách Yêu Cầu Nghỉ Phép */}
      <LeaveRequestsDialog
        open={openLeaveRequestsDialog}
        onClose={handleCloseLeaveRequestsDialog}
      />

      {/* Dialog hiển thị danh sách tài sản */}
      <PropertyDialog
        open={openPropertyDialog}
        onClose={handleClosePropertyDialog}
      />

      {/* Thông báo phải checkin trước khi checkout */}
      <Snackbar
        className="snackbar-name123"
        style={{ left: 'auto' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: '100%' }}
        >
          Bạn phải chấm công trước khi kết thúc ca!
        </Alert>
      </Snackbar>

      {/* Thông báo chấm công thành công */}
      <Snackbar
        className="snackbar-name123"
        style={{ left: 'auto' }}
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Chấm công thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
}
