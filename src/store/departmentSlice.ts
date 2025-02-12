import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { departmentService } from "../services/department";
import { Department } from "../types/departments";

interface DepartmentState {
    departments: Department[];
    selectedDepartment: Department | null;
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number,
        totalPage: number,
        totalDepartment: number,
        pageSize: number,
    }
}

const initialState: DepartmentState = {
    departments: [],
    selectedDepartment: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPage: 1,
        totalDepartment: 10,
        pageSize: 10
    }
}

export const fetchDepartments = createAsyncThunk(
    `department/fetchDepartments`,
    async ({page, size, sort, order}: {page: number, size: number, sort: string, order: string}, {rejectWithValue}) => {
        try {
            const response = await departmentService.getAllDepartment(page, size, sort, order);
            
            if (!Array.isArray(response.data.data)) {
                return rejectWithValue("Lỗi client không lấy đúng dữ liệu từ server")
            }

            return {
                departments: response.data.data,
                total: response.data.totalCount? response.data.totalCount : 10,
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi lấy dữ liệu từ server")
        }
    }
)

const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //GetAllDepartment
            .addCase(fetchDepartments.pending, (state) => {
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
    }
})

export default departmentSlice.reducer;