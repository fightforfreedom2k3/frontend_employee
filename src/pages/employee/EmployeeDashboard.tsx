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

export default function EmployeeDashboard() {
  const userId = localStorage.getItem('userId');
  const today = new Date();
  const dispatch = useDispatch<AppDispatch>();
  const { attendanceRecords } = useSelector(
    (state: RootState) => state.attendance
  );

  //Trạng thái chấm công
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);

  // Trạng thái cho Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  // Hàm đóng Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbar(false);
  };

  //Hàm lấy giờ làm việc
  function getWorkHour() {
    //default 8h
    const workHour = new Date(today); // Tạo một bản sao của today
    workHour.setHours(8, 0, 0, 0);
    return workHour.toISOString();
  }

  //Hàm chấm công
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
      dispatch(getAllMyAttendanceRecord(userId)); //Gọi lại api để cập nhật lịch sử chấm công
      setIsCheckIn(true);
      setSuccessSnackbar(true);
    });
  };

  //Hàm chấm công ra
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
      dispatch(getAllMyAttendanceRecord(userId)); //Gọi lại api để cập nhật lịch sử chấm công
      setIsCheckOut(true);
      setSuccessSnackbar(true);
    });
  };

  //Lấy lịch sử chấm công
  useEffect(() => {
    if (userId) {
      dispatch(getAllMyAttendanceRecord(userId));
    }
  }, [dispatch, userId]);

  // useEffect riêng để xử lý việc kiểm tra trạng thái checkIn và checkOut
  useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0) {
      try {
        //Kiểm tra checkin
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
        //Kiểm tra checkOut
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
        <Typography variant="h4" fontWeight="bold">
          Xin chào!
        </Typography>
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
                  }}
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
                  }}
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
                  }}
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
          </Container>
        </Grid>
      </Grid>

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
