import { Employee } from './employee';

export interface Contract {
  _id: string;
  employeeId: Employee | null;
  startDate: string;
  endDate: string;
  signDate: string;
  contractType: string;
}
