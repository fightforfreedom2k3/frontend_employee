import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LeaveRequest } from '../types/leave_request';
import { leaveRequestService } from '../services/leave_request';

interface LeaveRequestState {
  leaveRequests: LeaveRequest[];
  leaveRequest: LeaveRequest | undefined;
  selectedLeaveRequest: LeaveRequest | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPage: number;
    totalRequest: number;
    pageSize: number;
  };
}

const initialState: LeaveRequestState = {
  leaveRequests: [],
  leaveRequest: undefined,
  selectedLeaveRequest: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPage: 1,
    totalRequest: 0,
    pageSize: 10,
  },
};

//Api get all leave request
export const fecthLeaveRequests = createAsyncThunk(
  `leaveRequest/fetchLeaveRequests`,
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
      const response = await leaveRequestService.getAllLeaveRequest(
        page,
        size,
        sort,
        order,
        value
      );
      return {
        leaveRequests: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//approve leave request
export const approveLeaveRequest = createAsyncThunk(
  `leaveRequest/approveLeaveRequest`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await leaveRequestService.approveLeaveRequest(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi phê duyệt đơn nghỉ phép'
      );
    }
  }
);

//reject leave request
export const rejectLeaveRequest = createAsyncThunk(
  `leaveRequest/rejectLeaveRequest`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await leaveRequestService.rejectLeaveRequest(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi từ chối đơn nghỉ phép'
      );
    }
  }
);

//get all my leave request
export const getAllMyLeaveRequest = createAsyncThunk(
  `leaveRequest/getAllMyLeaveRequest`,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await leaveRequestService.getAllMyLeaveRequest(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Lỗi khi lấy danh sách đơn nghỉ phép của tôi'
      );
    }
  }
);

//create leacve request
export const createLeaveRequest = createAsyncThunk(
  `leaveRequest/createLeaveRequest`,
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        leaveType: string;
        reason: string;
        startDate: string;
        endDate: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await leaveRequestService.createLeaveRequest(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi tạo đơn nghỉ phép'
      );
    }
  }
);

const leaveRequestSlice = createSlice({
  name: `leaveRequest`,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //getAllLeaveRequest
      .addCase(fecthLeaveRequests.pending, state => {
        state.loading = true;
      })
      .addCase(fecthLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload.leaveRequests;
        state.pagination.totalRequest = action.payload.total;
      })
      .addCase(fecthLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //createLeaveRequest
      .addCase(createLeaveRequest.pending, state => {
        state.loading = true;
      })
      .addCase(createLeaveRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //approveLeaveRequest
      .addCase(approveLeaveRequest.pending, state => {
        state.loading = true;
      })
      .addCase(approveLeaveRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(approveLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //rejectLeaveRequest
      .addCase(rejectLeaveRequest.pending, state => {
        state.loading = true;
      })
      .addCase(rejectLeaveRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(rejectLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //getAllMyLeaveRequest
      .addCase(getAllMyLeaveRequest.pending, state => {
        state.loading = true;
      })
      .addCase(getAllMyLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(getAllMyLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default leaveRequestSlice.reducer;
