import api from './api';
import { ApiResponse } from '../types/api';
import { Employee } from '../types/employee';
import { Attachments } from '../types/common';
import { Department } from '../types/departments';

//getAllEmployee
// export interface GetAllEmployeeResponse {
//     employees: Employee[];
//     page: number;
//     size: number;
//     sort: string;
//     order: string;
// }

export interface AddNewEmployeeRequest {
  fullName: string;
  dob: string;
  department: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  role: 'DEPARTMENT_MANAGER' | 'EMPLOYEE' | 'HR' | 'OTHER'; // Có thể thêm role khác
  position: string;
  contract: {
    startDate: string;
    endDate: string | null;
    contractType: 'PERMANENT' | 'TEMPORARY'; // Thêm các loại hợp đồng khác nếu cần
    status: 'ACTIVE' | 'INACTIVE';
    signDate: string;
    attachments: Attachments[];
  };
}

export interface UpdateEmployeeRequest {
  fullName: string;
  dob: string;
  department: Department | string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  position: string;
}

export interface UpdateEmployeePassword {
  fullName: string;
  password: string;
  dob: string;
  department: Department | string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  position: string;
}

export const employeeService = {
  getAllEmployee: (
    page = 1,
    size = 10,
    sort = 'ASC',
    order = 'username',
    value = ''
  ) =>
    api.get<ApiResponse<Employee[]>>(`/employee/getAllEmployee`, {
      params: { page, size, sort, order, value },
    }),
  getEmployeeById: (_id: string) =>
    api.get<ApiResponse<Employee>>(`/employee/getEmployeeById/${_id}`),
  addNewEmployee: (employeeData: AddNewEmployeeRequest) =>
    api.post<ApiResponse<Employee>>(`/employee/addNewEmployee`, employeeData),
  updateEmployee: (_id: string, employeeData: UpdateEmployeeRequest) =>
    api.post<ApiResponse<Employee>>(
      `employee/updateEmployee/${_id}`,
      employeeData
    ),
  deleteEmployee: (id: string) =>
    api.delete<ApiResponse<Employee>>(
      `/employee/deleteEmployeeByAdminAndManager/${id}`
    ),
  getAllEmployeeByDepartment: (
    department = '',
    page = 1,
    size = 10,
    sort = 'createdAt',
    order = 'ASC',
    value = ''
  ) =>
    api.get<ApiResponse<Employee[]>>(`/employee/getAllEmployeeByDepartment`, {
      params: { department, page, size, sort, order, value },
    }),
  updateEmployeePassword: (_id: string, employeeData: UpdateEmployeePassword) =>
    api.post<ApiResponse<Employee>>(
      `employee/updateEmployee/${_id}`,
      employeeData
    ),
};
