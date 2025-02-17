import api from "./api";
import { api2 } from "./api";
import { ApiResponse } from "../types/api";
import { Employee } from "../types/employee";
import { Attachments, BankAccount, Insurance } from "../types/common";

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
    role: "DEPARTMENT_MANAGER" | "EMPLOYEE" | "HR" | "OTHER";// Có thể thêm role khác
    position: string;
    baseSalary: number;
    bankAccount: BankAccount;
    insurance: Insurance;
    taxCode: string;
    contract: {
        startDate: string;
        endDate: string | null;
        contractType: "PERMANENT" | "TEMPORARY"; // Thêm các loại hợp đồng khác nếu cần
        status: "ACTIVE" | "INACTIVE";
        signDate: string;
        attachments: Attachments[];
    };
}

export const employeeService = {
    getAllEmployee: (page = 1, size = 10, sort = "ASC", order = "username") =>
        api.get<ApiResponse<Employee[]>>(`/employee/getAllEmployee`, {
            params: { page, size, sort, order },
        }),
    getEmployeeById: (_id: string) =>
        api.get<ApiResponse<Employee>>(`/employee/getEmployeeById/${_id}`),
    addNewEmployee: (employeeData: AddNewEmployeeRequest) => 
        api2.post<ApiResponse<Employee>>(`/employee/addNewEmployee`, employeeData),
};
