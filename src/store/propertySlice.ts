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

export const createProperty = createAsyncThunk(
  `property/createProperty`,
  async (
    {
      department,
      name,
      status,
      number,
    }: { department: string; name: string; status: string; number: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await propertyService.createProperty(
        department,
        name,
        status,
        number
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi khi tạo cơ sở vật chất`
      );
    }
  }
);

export const getAllPropertyByDepartment = createAsyncThunk(
  `property/getAllPropertyByDepartment`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await propertyService.getAllPropertyByDepartment(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          `Lỗi khi lấy cơ sở vật chất theo phòng ban`
      );
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
      //create property
      .addCase(createProperty.pending, state => {
        state.loading = true;
      })
      .addCase(createProperty.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //get properties by department
      .addCase(getAllPropertyByDepartment.pending, state => {
        state.loading = true;
      })
      .addCase(getAllPropertyByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(getAllPropertyByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default propertySlice.reducer;
