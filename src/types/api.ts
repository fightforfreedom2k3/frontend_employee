import { AttendanceRecord } from './attendance';
import { Employee } from './employee';

export interface ApiResponse<T> {
  succeed: boolean;
  message?: string;
  data?: T;
  code?: string;
  errors?: string[];
  statusCode: number;
  acessToken: string;
  employee: Employee;
  totalCount: number;
  user: Employee;
  attendanceRecord: AttendanceRecord;
  weekRange?: T;
  weeklyData?: T;
}

export interface AuthResponse {
  token: string;
}
