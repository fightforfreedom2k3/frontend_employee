import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { departmentService } from '../services/department';
import { Department } from '../types/departments';

interface DepartmentState {
  departments: Department[];
  selectedDepartment: Department | null;
  department: Department | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPage: number;
    totalDepartment: number;
    pageSize: number;
  };
}

const initialState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  department: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPage: 1,
    totalDepartment: 10,
    pageSize: 10,
  },
};

export const fetchDepartments = createAsyncThunk(
  `department/fetchDepartments`,
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
      const response = await departmentService.getAllDepartment(
        page,
        size,
        sort,
        order,
        value
      );

      if (!Array.isArray(response.data.data)) {
        return rejectWithValue('Lỗi client không lấy đúng dữ liệu từ server');
      }

      return {
        departments: response.data.data,
        total: response.data.totalCount ? response.data.totalCount : 10,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi lấy dữ liệu từ server'
      );
    }
  }
);

export const createDepartment = createAsyncThunk(
  `department/createDepartment`,
  async (
    {
      name,
      description,
      manager,
    }: {
      name: string;
      description: string;
      manager: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await departmentService.createDepartment(
        name,
        description,
        manager
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi dấy dữ liệu từ server'
      );
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  `department/deleteDepartment`,
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await departmentService.deleteDepartment(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi xóa phòng ban'
      );
    }
  }
);

export const updateDepartment = createAsyncThunk(
  `department/updateDepartment`,
  async (
    { id, name, desciption }: { id: string; name: string; desciption: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await departmentService.updateDepartment(
        id,
        name,
        desciption
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi cập nhật phòng ban'
      );
    }
  }
);

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //GetAllDepartment
      .addCase(fetchDepartments.pending, state => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.departments;
        state.pagination.totalDepartment = action.payload.total;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //CreateDepartment
      .addCase(createDepartment.pending, state => {
        state.loading = true;
      })
      //add action to this case if u need reponse.data to do sth
      .addCase(createDepartment.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //DeleteDepartment
      .addCase(deleteDepartment.pending, state => {
        state.loading = true;
      })
      .addCase(deleteDepartment.fulfilled, state => {
        state.loading = false;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //update department
      .addCase(updateDepartment.pending, state => {
        state.loading = true;
      })
      .addCase(updateDepartment.fulfilled, state => {
        state.loading = false;
        //no need to response.data to do sth
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default departmentSlice.reducer;
