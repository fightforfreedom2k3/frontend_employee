import { ApiResponse } from '../types/api';
import { Contract } from '../types/contract';
import api from './api';

export const contractrService = {
  getAllContract: (
    page: number,
    size: number,
    sort: string,
    order: string,
    value: string
  ) =>
    api.get<ApiResponse<Contract[]>>(`/contract/getAllContract`, {
      params: { page, size, sort, order, value },
    }),
};
