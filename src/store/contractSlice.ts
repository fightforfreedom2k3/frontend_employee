import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Contract } from '../types/contract';
import { contractrService } from '../services/contract';

interface ContractState {
  contracts: Contract[];
  contract: Contract | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPage: number;
    totalContract: number;
    pageSize: number;
  };
}

const initialState: ContractState = {
  contracts: [],
  contract: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPage: 1,
    totalContract: 10,
    pageSize: 10,
  },
};

export const getAllContract = createAsyncThunk(
  `contract/getAllContract`,
  async (
    {
      page,
      size,
      sort,
      order,
    }: {
      page: number;
      size: number;
      sort: string;
      order: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await contractrService.getAllContract(
        page,
        size,
        sort,
        order
      );
      if (!Array.isArray(response.data.datta)) {
        return rejectWithValue(
          'Lỗi client không lấy được danh sách hợp đồng do mảng ko hợp lệ'
        );
      }
      return {
        total: response.data.totalCount,
        contracts: response.data.datta,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Lỗi lấy danh sách hợp đồng`
      );
    }
  }
);

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //GetAllContract
      .addCase(getAllContract.pending, state => {
        state.loading = true;
      })
      .addCase(getAllContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.contracts;
      })
      .addCase(getAllContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default contractSlice.reducer;
