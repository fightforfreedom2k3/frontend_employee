import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AddNewEmployeeRequest, employeeService } from "../services/employee";
import { Employee } from "../types/employee";

interface EmployeeState {
    employees: Employee[],
    selectedEmployee: Employee | null,
    loading: boolean,
    error: string | null,
    pagination: {
        currentPage: number,
        totalPage: number,
        totalEmployee: number,
        pageSize: number
    }
}

const initialState: EmployeeState = {
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPage: 1,
        totalEmployee: 0,
        pageSize: 10
    }
};

// Gọi API lấy danh sách nhân viên
export const fetchEmployees = createAsyncThunk(
    'employee/fetchEmployees',
    async ({ page, size, sort, order }: { page: number, size: number, sort: string, order: string }, { rejectWithValue }) => {
        try {
            const response = await employeeService.getAllEmployee(page, size, sort, order);

            if (!Array.isArray(response.data.data)) {
                return rejectWithValue("Dữ liệu không hợp lệ từ server.");
            }
            return {
                employees: response.data.data,
                total: response.data.totalCount,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi lấy danh sách nhân viên");
        }
    }
);
//Gọi API tạo nhân viên mới
export const addNewEmployee = createAsyncThunk(
    'employee/addNewEmployee',
    async(employeeData: AddNewEmployeeRequest, {rejectWithValue}) => {
        try {
            const response = await employeeService.addNewEmployee(employeeData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi tạo nhân viên mới")
        }
    }
)

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        //getAllEmployee
            .addCase(fetchEmployees.pending, (state) => {
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
        //addEmployee
            .addCase(addNewEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewEmployee.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addNewEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default employeeSlice.reducer;
