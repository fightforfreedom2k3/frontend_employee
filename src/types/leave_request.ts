interface EmployeeDetails {
  name: string;
  department: string;
}

export interface LeaveRequest {
  _id: string;
  employeeId: EmployeeDetails;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  totalDays: number;
  createdAt: string;
  updatedAt: string;
}
