import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  checkOut,
  getAllMyAttendanceRecord,
  takeAttendance,
} from '../../store/attendanceSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const userId = localStorage.getItem('userId');
  const today = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { attendanceRecords, attendanceRecord, loading, error, pagination } =
    useSelector((state: RootState) => state.attendance);

  // Dữ liệu các mục
  const items = [
    { title: 'Xem thông tin cá nhân', navigateTo: '/user-information' },
    { title: 'Truy cập lịch sử chấm công', navigateTo: '/attendance-history' },
  ];

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
      <Grid container spacing={7}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <CardContent
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() =>
                  navigate(`${item.navigateTo}`, {
                    state: { attendanceRecords },
                  })
                }
              >
                <Typography variant="subtitle1">{item.title}</Typography>
              </CardContent>
              <ArrowForwardIcon />
              <Box sx={{ ml: 2 }}></Box>
            </Card>
          </Grid>
        ))}
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
