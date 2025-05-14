import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  AddNewEmployeeRequest,
  employeeService,
  UpdateEmployeeRequest,
  UpdateEmployeePassword,
} from '../services/employee';
import { Employee } from '../types/employee';

interface EmployeeState {
  employeeById: { [id: string]: Employee };
  employee: Employee | undefined;
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPage: number;
    totalEmployee: number;
    pageSize: number;
  };
}

const initialState: EmployeeState = {
  employeeById: {},
  employee: undefined,
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPage: 1,
    totalEmployee: 0,
    pageSize: 10,
  },
};

// Gọi API lấy danh sách nhân viên
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
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
      const response = await employeeService.getAllEmployee(
        page,
        size,
        sort,
        order,
        value
      );

      if (!Array.isArray(response.data.data)) {
        return rejectWithValue('Dữ liệu không hợp lệ từ server.');
      }
      return {
        employees: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi lấy danh sách nhân viên'
      );
    }
  }
);

//Gọi API lấy nhân viên theo phòng ban
export const getAllEmployeeByDepartment = createAsyncThunk(
  'employee/getAllEmployeeByDepartment',
  async (
    {
      department,
      page,
      size,
      sort,
      order,
      value,
    }: {
      department: string;
      page: number;
      size: number;
      sort: string;
      order: string;
      value: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await employeeService.getAllEmployeeByDepartment(
        department,
        page,
        size,
        sort,
        order,
        value
      );

      if (!Array.isArray(response.data.data)) {
        return rejectWithValue('Dữ liệu không hợp lệ từ server.');
      }
      return {
        employees: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi lấy danh sách nhân viên'
      );
    }
  }
);

//Gọi API tạo nhân viên mới
export const addNewEmployee = createAsyncThunk(
  'employee/addNewEmployee',
  async (employeeData: AddNewEmployeeRequest, { rejectWithValue }) => {
    try {
      const response = await employeeService.addNewEmployee(employeeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi tạo nhân viên mới'
      );
    }
  }
);

//Gọi API sửa nhân viên
export const updateEmployee = createAsyncThunk(
  `employee/updateEmployee`,
  async (
    { _id, employeeData }: { _id: string; employeeData: UpdateEmployeeRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await employeeService.updateEmployee(_id, employeeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi cập nhật nhân viên'
      );
    }
  }
);

//Gọi API xóa nhân viên
export const deleteEmployee = createAsyncThunk(
  `employee/deleteEmployee`,
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await employeeService.deleteEmployee(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi xóa nhân viên'
      );
    }
  }
);

//Gọi API lấy thông tin nhân viên theo id
export const getEmployeeById = createAsyncThunk(
  `employee/getEmployeeById`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await employeeService.getEmployeeById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi lấy thông tin nhân viên'
      );
    }
  }
);

//Gọi api cập nhật mật khẩu nhân viên
export const updateEmployeePassword = createAsyncThunk(
  `employee/updateEmployeePassword`,
  async (
    {
      _id,
      employeeData,
    }: { _id: string; employeeData: UpdateEmployeePassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await employeeService.updateEmployee(_id, employeeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi cập nhật mật khẩu nhân viên'
      );
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //getAllEmployee
      .addCase(fetchEmployees.pending, state => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination.totalEmployee = action.payload.total;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //getAllEmployeeByDepartment
      .addCase(getAllEmployeeByDepartment.pending, state => {
        state.loading = true;
      })
      .addCase(getAllEmployeeByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination.totalEmployee = action.payload.total;
      })
      .addCase(getAllEmployeeByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //addEmployee
      .addCase(addNewEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewEmployee.fulfilled, state => {
        state.loading = false;
      })
      .addCase(addNewEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //updateEmployee
      .addCase(updateEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, state => {
        state.loading = false;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //deleteEmployee
      .addCase(deleteEmployee.pending, state => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, state => {
        state.loading = false;
        //maybe add action
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //getEmployeeById
      .addCase(getEmployeeById.pending, state => {
        state.loading = true;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
        const employeeData = action.payload.data;
        if (employeeData) {
          state.employeeById[employeeData._id] = employeeData;
        }
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //updateEmployeePassword
      .addCase(updateEmployeePassword.pending, state => {
        state.loading = true;
      })
      .addCase(updateEmployeePassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(updateEmployeePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
