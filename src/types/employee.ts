import { Department } from './departments';

export interface Employee {
  _id: string;
  userName: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: string; // Date string
  department: Department;
  position: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
