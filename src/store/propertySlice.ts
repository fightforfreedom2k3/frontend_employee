import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Property } from '../types/property';
import { propertyService } from '../services/property';

interface PropertyState {
  properties: Property[];
  property: Property | undefined;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
  };
}

const initialState: PropertyState = {
  properties: [],
  property: undefined,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
  },
};

// get all property
export const fetchProperties = createAsyncThunk(
  `property/fetchProperties`,
  async (
    {
      page,
      size,
      sort,
      order,
      value,
    }: {
      page: number;
      size: number;
      sort: string;
      order: string;
      value: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await propertyService.getAllProperty(
        page,
        size,
        sort,
        order,
        value
      );
      return {
        properties: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(`Lỗi khi lấy cơ sở vật chất`);
    }
  }
);

//get all property by department and status
export const getAllPropertyByDepartmentAndStatus = createAsyncThunk(
  `property/getAllPropertyByDepartmentAndStatus`,
  async (
    {
      departmentId,
      status,
      page,
      size,
      sort,
      order,
      value,
    }: {
      departmentId: string;
      status: string;
      page: number;
      size: number;
      sort: string;
      order: string;
      value: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await propertyService.getAllPropertyByDepartmentAndStatus(
          departmentId,
          status,
          page,
          size,
          sort,
          order,
          value
        );
      return {
        properties: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(`Lỗi khi lấy cơ sở vật chất`);
    }
  }
);

// create property
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
      return {
        properties: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi khi tạo cơ sở vật chất`
      );
    }
  }
);

//request maintance
export const requestMaintenance = createAsyncThunk(
  `property/requestMaintenance`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await propertyService.requestMaintenance(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          ` Lỗi khi yêu cầu bảo trì cơ sở vật chất`
      );
    }
  }
);

//return property
export const returnProperty = createAsyncThunk(
  `property/returnProperty`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await propertyService.returnProperty(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || ` Lỗi khi trả lại cơ sở vật chất`
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
      // get all property
      .addCase(fetchProperties.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //get all property by departmnet and status
      .addCase(getAllPropertyByDepartmentAndStatus.pending, state => {
        state.loading = true;
      })
      .addCase(
        getAllPropertyByDepartmentAndStatus.fulfilled,
        (state, action) => {
          state.loading = false;
          state.properties = action.payload.properties;
          state.pagination.total = action.payload.total;
        }
      )
      .addCase(
        getAllPropertyByDepartmentAndStatus.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
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
      //request maintenance
      .addCase(requestMaintenance.pending, state => {
        state.loading = true;
      })
      .addCase(requestMaintenance.fulfilled, state => {
        state.loading = false;
      })
      .addCase(requestMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //return property
      .addCase(returnProperty.pending, state => {
        state.loading = true;
      })
      .addCase(returnProperty.fulfilled, state => {
        state.loading = false;
      })
      .addCase(returnProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default propertySlice.reducer;
