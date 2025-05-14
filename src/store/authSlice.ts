import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  authService,
  ChangePasswordData,
  LoginRequest,
} from '../services/auth';
import { Employee } from '../types/employee';

interface AuthState {
  user: Employee | null;
  userId: string | null;
  role: string | null;
  fullName: string;
  departmentId: string;
  token: string | null;
  loading: boolean;
  statusCode: number | null;
  error: string | null;
  message: string | null;
  username: string;
}

const initialState: AuthState = {
  user: null,
  userId: localStorage.getItem('userId'),
  role: localStorage.getItem('role'),
  token: localStorage.getItem('token'),
  fullName: localStorage.getItem('fullName') || '',
  departmentId: localStorage.getItem('departmentId') || '',
  loading: false,
  error: null,
  statusCode: null,
  message: null,
  username: localStorage.getItem('username') || '',
};

const login = createAsyncThunk(
  '/auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Kiểm tra xem API có trả về accessToken hợp lệ không
      if (!response.data || !response.data.acessToken) {
        throw new Error('Invalid response from server');
      }
      return {
        user: response.data.user,
        token: response.data.acessToken,
        role: response.data.user.role,
        userId: response.data.user._id,
        fullName: response.data.user.fullName,
        departmentId: response.data.user.department._id,
        username: response.data.user.userName,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  `auth/changePassword`,
  async (data: ChangePasswordData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Đổi mật khẩu thất bại'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },

  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.fullName = action.payload.fullName;
        state.departmentId = action.payload.departmentId;
        state.username = action.payload.username;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Lưu message từ API vào Redux state
      })
      //change password
      .addCase(changePassword.pending, state => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export { login };
