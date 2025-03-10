import { Employee } from './employee';

export interface AttendanceRecord {
  _id: string;
  employeeId: Employee;
  checkIn: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  checkout: string | null;
  workHours: number | null;
}
