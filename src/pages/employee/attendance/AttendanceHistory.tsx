import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';

export const AttendanceHistory = () => {
  const location = useLocation();
  const { attendanceRecords } = location.state;
  console.log(attendanceRecords);

  // Hàm chuyển đổi sang giờ Việt Nam
  const convertToVietnamTime = (isoString: string): string => {
    const date = new Date(isoString);

    const vietnamTime = date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false, // sử dụng định dạng 24 giờ
    });

    return vietnamTime;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lịch sử chấm công
      </Typography>
      <Button variant="outlined" sx={{ mb: 2 }}>
        Tháng 03/2025
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Chấm vào</TableCell>
              <TableCell>Chấm ra</TableCell>
              <TableCell>Đi muộn</TableCell>
              <TableCell>Đúng giờ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.map((record: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{convertToVietnamTime(record.checkIn)}</TableCell>
                <TableCell>{convertToVietnamTime(record.checkOut)}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={record.status === 'LATE'}
                    disabled
                    sx={{
                      color: record.status === 'LATE' ? 'red' : 'default',
                      '&.Mui-checked': {
                        color: 'red', // Khi checkbox được chọn, màu sẽ là đỏ
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={record.status === 'PRESENT'}
                    disabled
                    sx={{
                      color: record.status === 'PRESENT' ? 'green' : 'default',
                      '&.Mui-checked': {
                        color: 'green', // Khi checkbox được chọn, màu sẽ là xanh
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
