export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  checkIn: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  checkOut: string;
  workHours: number;
  __v: number;
}
