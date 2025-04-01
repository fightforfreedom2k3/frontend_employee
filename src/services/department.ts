import api from './api';
import { ApiResponse } from '../types/api';
import { Department } from '../types/departments';

export const departmentService = {
  getAllDepartment: (
    page: number,
    size: number,
    sort: string,
    order: string,
    value: string
  ) =>
    api.get<ApiResponse<Department[] | undefined>>(
      `/department/getAllDepartment`,
      {
        params: { page, size, sort, order, value },
      }
    ),
  createDepartment: (name: string, description: string, manager: string) =>
    api.post<ApiResponse<Department>>(`/department/createDepartment`, {
      name,
      description,
      manager,
    }),
  deleteDepartment: (id: string) =>
    api.delete<ApiResponse<Department>>(`/department/deleteDepartment/${id}`),
};
