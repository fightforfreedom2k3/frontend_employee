import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  getAllMyAttendanceRecord,
  takeAttendance,
} from '../store/attendanceSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  // Dữ liệu các mục
  const items = [{ title: 'Truy cập lịch sử chấm công' }];
  const [isCheckIn, setIsCheckIn] = useState(false);
  const userId = localStorage.getItem('userId');
  const today = new Date();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { attendanceRecords, attendanceRecord, loading, error, pagination } =
    useSelector((state: RootState) => state.attendance);

  //Hàm lấy giờ làm việc
  function getWorkHour() {
    //default 8h
    const workHour = new Date(today); // Tạo một bản sao của today
    workHour.setHours(8, 0, 0, 0);
    return workHour.toISOString();
  }
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
    );
    setIsCheckIn(true);
  };
  //Lay lich su cham cong
  useEffect(() => {
    if (userId) {
      dispatch(getAllMyAttendanceRecord(userId));
    }
  }, [dispatch, userId]);
  //useEffect riêng để xử lí chấm công
  // useEffect riêng để xử lý việc kiểm tra trạng thái checkIn
  useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0) {
      try {
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
      } catch (error) {
        console.error('Lỗi khi xử lý dữ liệu attendanceRecords:', error);
      }
    }
  }, [attendanceRecords]);
  console.log(attendanceRecords);

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
        <Button
          disabled={isCheckIn}
          variant="contained"
          color="success"
          onClick={handleCheckIn}
        >
          {isCheckIn ? 'Đã chấm công' : 'Chấm công'}
        </Button>
      </Grid>

      {/* Danh sách mục */}
      <Grid container spacing={7}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <CardContent
                sx={{ flexGrow: 1 }}
                onClick={() =>
                  navigate('/attendance-history', {
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
    </Box>
  );
}
