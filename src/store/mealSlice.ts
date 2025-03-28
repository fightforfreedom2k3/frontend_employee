import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Meal } from '../types/meal';
import { mealService } from '../services/meal';

interface MealState {
  meals: Meal[];
  meal: Meal | null;
  selectedMeal: Meal | null;
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  meal: null,
  selectedMeal: null,
  loading: false,
  error: null,
};

export const getMyOrder = createAsyncThunk(
  `meal-ordering/getMyOrder`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await mealService.getMyOrder(id);

      if (!Array.isArray(response.data.weeklyData)) {
        return rejectWithValue('Lỗi client không lấy đúng dữ liệu từ server');
      }

      return {
        weekRange: response.data.weekRange,
        weeklyData: response.data.weeklyData,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getMyOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrder.fulfilled, (state, action) => {
        state.meals = action.payload.weeklyData || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(getMyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mealSlice.reducer;
