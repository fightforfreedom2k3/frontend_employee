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
              <TableCell>Đi muộn</TableCell>
              <TableCell>Đúng giờ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.map((record: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>
                  <Checkbox checked={record.status === 'LATE'} disabled />
                </TableCell>
                <TableCell>
                  <Checkbox checked={record.status === 'PRESENT'} disabled />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
