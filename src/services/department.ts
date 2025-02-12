import { api2 } from "./api";
import { ApiResponse } from "../types/api";
import { Department } from "../types/departments";

export interface GetAllDepartment {
    departments: Department[];
    page: number;
    sise: number;
    sort: string;
    order: string;
}

export const departmentService = {
    getAllDepartment: (page = 1, size = 10, sort = "ASC", order ="name") =>
        api2.get<ApiResponse<Department[]>>(`/department/getAllDepartment`, {
            params: {page, size, sort, order},
        }),
}