import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AttendanceRecord } from '../types/attendance';
import { attendanceService, CheckInData } from '../services/attendance';

interface AttendanceState {
  attendanceRecord: AttendanceRecord | null;
  attendanceRecords: AttendanceRecord[];
  selectedAttendanceRecord: AttendanceRecord | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalRecord: number;
  };
}

const initialState: AttendanceState = {
  attendanceRecord: null,
  attendanceRecords: [],
  selectedAttendanceRecord: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPage: 1,
    pageSize: 10,
    totalRecord: 0,
  },
};

// fecth api get all attendance record
export const fetchAttendance = createAsyncThunk(
  'attendance-record/getAllAttendaceRecord',
  async (
    {
      page,
      size,
      sort,
      order,
    }: { page: number; size: number; sort: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await attendanceService.getAllAttendanceRecord(
        page,
        size,
        sort,
        order
      );

      if (!Array.isArray(response.data.data)) {
        return rejectWithValue('Dữ liệu không hợp lệ từ server.');
      }
      return {
        attendanceRecords: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Loi lay danh sach cham cong'
      );
    }
  }
);

export const takeAttendance = createAsyncThunk(
  'attendance-record/checkIn',
  async (
    { id, checkInData }: { id: string; checkInData: CheckInData },
    { rejectWithValue }
  ) => {
    try {
      const response = await attendanceService.checkIn(id, checkInData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi khi chấm công`
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //getAllAttendanceRecord
      .addCase(fetchAttendance.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload.attendanceRecords;
        state.pagination.totalRecord = action.payload.total;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //CheckIn
      .addCase(takeAttendance.pending, state => {
        state.loading = true;
      })
      .addCase(takeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecord = action.payload.attendanceRecord;
      })
      .addCase(takeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default attendanceSlice.reducer;
