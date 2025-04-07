import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  AttendanceRecord,
  GetAllttendanceRecordResponse,
} from '../types/attendance';
import { attendanceService, CheckInData } from '../services/attendance';

interface AttendanceState {
  attendanceRecord: AttendanceRecord | null;
  attendanceRecords: AttendanceRecord[];
  allAttendanceRecords: GetAllttendanceRecordResponse[];
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
  allAttendanceRecords: [],
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
export const fetchAllAttendanceRecords = createAsyncThunk(
  'attendance-record/getAllAttendaceRecords',
  async (
    {
      page,
      size,
      sort,
      order,
      value,
      status,
    }: {
      page: number;
      size: number;
      sort: string;
      order: string;
      value: string;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await attendanceService.getAllAttendanceRecord(
        page,
        size,
        sort,
        order,
        value,
        status
      );

      if (!Array.isArray(response.data.data)) {
        return rejectWithValue('Dữ liệu không hợp lệ từ server.');
      }
      return {
        allAttendanceRecords: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Loi lay danh sach cham cong'
      );
    }
  }
);

//Post Api CheckIn
export const takeAttendance = createAsyncThunk(
  'attendance-record/checkIn',
  async (
    { id, checkInData }: { id: string | null; checkInData: CheckInData },
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

//post api checkOut
export const checkOut = createAsyncThunk(
  'attendance-record/checkOut',
  async (
    {
      id,
      check_out_hour,
      note,
    }: { id: string; check_out_hour: string; note: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await attendanceService.checkOut(
        id,
        check_out_hour,
        note
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi khi chấm công`
      );
    }
  }
);

//get api all my attendance record
export const getAllMyAttendanceRecord = createAsyncThunk(
  'attendance-record/getAllMyAttendanceRecord',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAllMyAttendanceRecord(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.reponse?.data?.message || `Lỗi khi lấy lịch sử chấm công`
      );
    }
  }
);

//attendance slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //getAllAttendanceRecord
      .addCase(fetchAllAttendanceRecords.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.allAttendanceRecords = action.payload.allAttendanceRecords;
        state.pagination.totalRecord = action.payload.total;
      })
      .addCase(fetchAllAttendanceRecords.rejected, (state, action) => {
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
      })
      //getAllMyAttendanceRecord
      .addCase(getAllMyAttendanceRecord.pending, state => {
        state.loading = true;
      })
      .addCase(getAllMyAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords =
          action.payload as unknown as AttendanceRecord[];
      })
      .addCase(getAllMyAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //checkOut
      .addCase(checkOut.pending, state => {
        state.loading = true;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecord = action.payload.attendanceRecord;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default attendanceSlice.reducer;
