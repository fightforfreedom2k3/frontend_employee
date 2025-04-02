import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { Meal } from '../../types/meal';

export default function LunchCard(data: Meal) {
  return (
    <Card sx={{ height: '40vh', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" color={'primary'}>
          {data.day || 'N/A'}
        </Typography>
        <Typography variant="h5">Bữa trưa</Typography>
        <Typography color="textSecondary">
          Date: {data.date || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Price: {data.menu?.price ? `${data.menu.price} VNĐ` : 'N/A'}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Menu:
        </Typography>
        {data.menu?.items && data.menu.items.length > 0 ? (
          <Typography color="textSecondary">
            {data.menu.items.join(', ')}
          </Typography>
        ) : (
          <Typography color="textSecondary">Bữa trưa bí mật {`;-)`}</Typography>
        )}
      </CardContent>
      <Box sx={{ padding: 2 }}>
        <Button variant="contained" fullWidth>
          View menu
        </Button>
      </Box>
    </Card>
  );
}
