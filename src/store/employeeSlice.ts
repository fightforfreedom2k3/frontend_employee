import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeService } from "../services/employee";
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

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export default employeeSlice.reducer;
