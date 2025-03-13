import { ApiResponse } from '../types/api';
import { AttendanceRecord } from '../types/attendance';
import api from './api';

export interface CheckInData {
  id: string | null;
  checkInHour: string;
  workHour: string;
}

export const attendanceService = {
  getAllAttendanceRecord: (
    page = 1,
    size = 10,
    sort = 'ASC',
    order = 'checkIn'
  ) =>
    api.get<ApiResponse<AttendanceRecord[]>>(
      `/attendance-record/getAllAttendanceRecord`,
      {
        params: { page, size, sort, order },
      }
    ),
  checkIn: (id: string | null, checkInData: CheckInData) =>
    api.post<ApiResponse<AttendanceRecord>>(
      `/attendance-record/checkIn/${id}`,
      checkInData
    ),
  getAllMyAttendanceRecord: (id: string) =>
    api.get<ApiResponse<AttendanceRecord[]>>(
      `/attendance-record/getAllMyAttendanceRecord/${id}`
    ),
};
