import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService, LoginRequest } from '../services/auth';

interface AuthState {
  userId: string | null;
  role: string | null;
  token: string | null;
  loading: boolean;
  statusCode: number | null;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId'),
  role: localStorage.getItem('role'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  statusCode: null,
  message: null,
};

const login = createAsyncThunk(
  '/auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      console.log(response.data.user._id);
      // Kiểm tra xem API có trả về accessToken hợp lệ không
      if (!response.data || !response.data.acessToken) {
        throw new Error('Invalid response from server');
      }
      return {
        token: response.data.acessToken,
        role: response.data.user.role,
        userId: response.data.user._id,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Lưu message từ API vào Redux state
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export { login };
