import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Meeting } from '../types/meeting';
import { CreateMeetingData, meetingService } from '../services/meeting';

interface MeetingState {
  meetings: Meeting[];
  meeting: Meeting | undefined;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
  };
}

const initialState: MeetingState = {
  meetings: [],
  meeting: undefined,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
  },
};

export const fetchMeetings = createAsyncThunk(
  `meeting/fetchMeetings`,
  async (
    {
      page,
      size,
      field,
      order,
      departmentId,
      status,
    }: {
      page: number;
      size: number;
      field: string;
      order: string;
      departmentId: string;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await meetingService.getAllMeetingByDepartmentAndStatus(
        page,
        size,
        field,
        order,
        departmentId,
        status
      );
      return {
        meetings: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createMeeting = createAsyncThunk(
  `meeting/createMeeting`,
  async (data: CreateMeetingData, { rejectWithValue }) => {
    try {
      const response = await meetingService.createMeeting(data);
      return response.data;
    } catch (error: any) {
      rejectWithValue(error.response?.data?.message || `Lỗi khi tạo cuộc họp`);
    }
  }
);

export const approveMeeting = createAsyncThunk(
  `meeting/approveMeeting`,
  async (meetingId: string, { rejectWithValue }) => {
    try {
      const response = await meetingService.approveMeeting(meetingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi khi phê duyệt cuộc hợp`
      );
    }
  }
);

export const rejectMeeting = createAsyncThunk(
  `meeting/rejectMeeting`,
  async (meetingId: string, { rejectWithValue }) => {
    try {
      const response = await meetingService.rejectMeeting(meetingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi khi từ chối cuộc hợp`
      );
    }
  }
);

const meetingSlice = createSlice({
  name: `meeting`,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //get all meetings
      .addCase(fetchMeetings.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload.meetings;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //create meeting
      .addCase(createMeeting.pending, state => {
        state.loading = true;
      })
      .addCase(createMeeting.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //approve meeting
      .addCase(approveMeeting.pending, state => {
        state.loading = true;
      })
      .addCase(approveMeeting.fulfilled, state => {
        state.loading = false;
      })
      .addCase(approveMeeting.rejected, (state, aciton) => {
        state.loading = false;
        state.error = aciton.payload as string;
      })
      //reject meeting
      .addCase(rejectMeeting.pending, state => {
        state.loading = true;
      })
      .addCase(rejectMeeting.fulfilled, state => {
        state.loading = false;
      })
      .addCase(rejectMeeting.rejected, (state, aciton) => {
        state.loading = false;
        state.error = aciton.payload as string;
      });
  },
});

export default meetingSlice.reducer;
