import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import MeetingCard from '../../components/card/MeetingCard';

export const AdminDashboard = () => {
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
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
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
                  onClick={() => {}} // Mở dialog khi nhấp
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
                  onClick={() => {}} // Mở dialog khi nhấp
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
                  onClick={() => {}} // Mở dialog khi nhấp
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
    </Box>
  );
};
