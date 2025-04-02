import { Employee } from './employee';

export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  employeeDetails: Employee;
  checkIn: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  checkOut: string;
  workHours: number;
  __v: number;
}

export interface GetAllttendanceRecordResponse {
  _id: string;
  employeeId: Employee;
  employeeDetails: Employee;
  checkIn: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  checkOut: string;
  workHours: number;
  __v: number;
}
