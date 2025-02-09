import { Employee } from "./employee"

export interface ApiResponse<T> {
    succeed: boolean,
    message?: string,
    data?: T,
    code?: string,
    errors?: string[]
    statusCode: number
    acessToken: string
    employees: Employee[]
}


export interface AuthResponse {
    token: string,
}