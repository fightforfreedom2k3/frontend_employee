import {
  Card,
  CardContent,
  Typography,
  Stack,
  Collapse,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { Meal } from '../../types/meal';
import { useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { mealService } from '../../services/meal';
import lunchImg from '../../assets/lunch.jpg';

export default function LunchCard(data: Meal) {
  const userId = localStorage.getItem('userId');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const handleOrder = async () => {
    try {
      await mealService.orderMeal(data.menu._id, userId, quantity, data.date);
      setSnackbarMessage('Đặt hàng thành công!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Đặt hàng thất bại. Vui lòng thử lại.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: 'auto',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Grid container spacing={2} gap={2}>
          <Grid item xs={12} sm={5}>
            {/* Title */}
            <Typography variant="h6" color="primary" gutterBottom>
              {data.day || 'N/A'}
            </Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Bữa trưa
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Date: {data.date || 'N/A'}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Price: {data.menu?.price ? `${data.menu.price} VNĐ` : 'N/A'}
            </Typography>
          </Grid>
          {/* img */}
          <Grid item xs={12} sm={5}>
            <img
              src={lunchImg}
              alt="Lunch"
              style={{ width: '130%', height: '100%', borderRadius: '8px' }}
            />
          </Grid>
        </Grid>
        {/* View Menu */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: 'pointer', mt: 2 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Typography variant="body1" fontWeight={'bold'}>
            View Menu
          </Typography>
          <KeyboardArrowRightIcon
            sx={{
              transition: 'transform 0.3s ease',
              transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>
        <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
            Menu:
          </Typography>
          {data.menu?.items && data.menu.items.length > 0 ? (
            <Typography color="textSecondary">
              {data.menu.items.join(', ')}
            </Typography>
          ) : (
            <Typography color="textSecondary">Blind Box {`;-)`}</Typography>
          )}
        </Collapse>

        {/* Quantity Controls */}
        <Stack direction="row" alignItems="center" spacing={2} mt={3}>
          <IconButton
            onClick={() => setQuantity(prev => Math.max(prev - 1, 0))}
            disabled={quantity === 0}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6">{quantity}</Typography>
          <IconButton onClick={() => setQuantity(prev => prev + 1)}>
            <AddIcon />
          </IconButton>
        </Stack>
        {/* Order Button */}
        {quantity > 0 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleOrder}
          >
            Đặt hàng
          </Button>
        )}
      </CardContent>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
