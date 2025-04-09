import { Container, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useEffect } from 'react';
import { getMyOrder } from '../../../store/mealSlice';
import LunchCard from '../../../components/card/LunchCard';

export default function LunchRegistration() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem('userId');
  const { meals, loading, error } = useSelector(
    (state: RootState) => state.meal
  );

  useEffect(() => {
    dispatch(getMyOrder(userId || ''));
  }, [dispatch, userId]);

  const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay ở định dạng "YYYY-MM-DD"
  const filteredMeals = meals.filter(meal => meal.date >= today); // Lọc các bữa ăn có ngày >= hôm nay
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} mt={2}>
        {filteredMeals.map((meal, index) => (
          <Grid item xs={12} md={6} key={index}>
            <LunchCard {...meal} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
