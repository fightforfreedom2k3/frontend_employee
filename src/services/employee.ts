import api from "./api";
import { ApiResponse } from "../types/api";
import { Employee } from "../types/employee";

export interface GetAllEmployeeResponse {
    employees: Employee[];
    page: number;
    size: number;
    sort: string;
    order: string;
}

export const employeeService = {
    getAllEmployee: (page = 1, size = 10, sort = "ASC", order = "username") =>
        api.get<ApiResponse<Employee[]>>(`/employee/getAllEmployee`, {
            params: { page, size, sort, order },
        }),
    getEmployeeById: (_id: string) =>
        api.get<ApiResponse<Employee>>(`/employee/getEmployeeById/${_id}`),
};
