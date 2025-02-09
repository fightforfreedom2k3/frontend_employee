import api from "./api";
import { ApiResponse, AuthResponse } from "../types/api";

export interface LoginRequest {
    userName: string,
    password: string
}

export const authService = {
    login: (data: LoginRequest) => 
        api.post<ApiResponse<AuthResponse>>('/auth/login', data),
}