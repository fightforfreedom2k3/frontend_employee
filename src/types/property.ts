import { Department } from './departments';

export interface Property {
  _id: string;
  department: Department;
  name: string;
  status: string;
  number: number;
  createdAt: string;
  updatedAt: string;
}
