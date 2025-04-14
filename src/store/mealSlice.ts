import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Meal, OrderByDay, OrderMealResponse } from '../types/meal';
import { mealService } from '../services/meal';

interface MealState {
  orderResponse: OrderMealResponse | null;
  meals: Meal[];
  meal: Meal | null;
  selectedMeal: Meal | null;
  loading: boolean;
  error: string | null;
  orders: OrderByDay[] | null;
}

const initialState: MealState = {
  orderResponse: null,
  meals: [],
  meal: null,
  selectedMeal: null,
  loading: false,
  error: null,
  orders: null,
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

export const createMenu = createAsyncThunk(
  `meal-menu/createMenu`,
  async (
    { date, items, price }: { date: string; items: string[]; price: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await mealService.createMenu(date, items, price);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const orderMeal = createAsyncThunk(
  `meal-ordering/orderMeal`,
  async (
    {
      menuId,
      employeeId,
      quantity,
      date,
    }: { menuId: string; employeeId: string; quantity: number; date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await mealService.orderMeal(
        menuId,
        employeeId,
        quantity,
        date
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderList = createAsyncThunk(
  `meal-ordering/getAllOrderInOneDay`,
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await mealService.getOrderList(date);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || `Lỗi khi lấy danh sách đặt cơm`);
    }
  }
);

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //getMyOrder
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
      })
      //createMenu
      .addCase(createMenu.pending, state => {
        state.loading = true;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.meal = action.payload.data || null;
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //orderMeal
      .addCase(orderMeal.pending, state => {
        state.loading = true;
      })
      .addCase(orderMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.orderResponse = action.payload.data || null;
      })
      .addCase(orderMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //getOrderList
      .addCase(getOrderList.pending, state => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || null;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mealSlice.reducer;
