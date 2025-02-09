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

            // API trả về ngay Employee[], không có `data`
            if (!Array.isArray(response.data)) {
                return rejectWithValue("Dữ liệu không hợp lệ từ server.");
            }

            return response.data; // Trả về danh sách Employee[]
        } catch (error: any) {
            if (error.response?.status === 401) {
                return rejectWithValue("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
            }
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
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.employees = action.payload;
                    state.pagination = {
                        ...state.pagination,
                        totalEmployee: action.payload.length,
                    };
                }
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default employeeSlice.reducer;
