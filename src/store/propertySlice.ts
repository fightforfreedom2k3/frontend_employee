import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Property } from '../types/property';
import { propertyService } from '../services/property';

interface PropertyState {
  properties: Property[];
  property: Property | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  property: undefined,
  loading: false,
  error: null,
};

// get all property
export const fetchProperties = createAsyncThunk(
  `property/fetchProperties`,
  async () => {
    try {
      const response = await propertyService.getAllProperty();
      return response.data;
    } catch (error: any) {
      return `Lỗi khi lấy cơ sở vật chất`;
    }
  }
);

const propertySlice = createSlice({
  name: `property`,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProperties.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default propertySlice.reducer;
