import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Dashboard() {
  // Dữ liệu các mục
  const items = [
    { title: 'Truy cập danh sách dự án của tôi', trend: 'up' },
    { title: 'Truy cập lịch sử chấm công', trend: 'up' },
    { title: 'Truy cập danh sách tạo đơn từ', trend: 'down' },
  ];

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
        <Button variant="contained" color="success">
          Chấm công
        </Button>
      </Grid>

      {/* Danh sách mục */}
      <Grid container spacing={7}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{item.title}</Typography>
              </CardContent>
              <ArrowForwardIcon />
              <Box sx={{ ml: 2, color: item.trend === 'up' ? 'green' : 'red' }}>
                {item.trend === 'up' ? '📈' : '📉'}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
