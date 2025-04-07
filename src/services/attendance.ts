import { ApiResponse } from '../types/api';
import {
  AttendanceRecord,
  GetAllttendanceRecordResponse,
} from '../types/attendance';
import api from './api';

export interface CheckInData {
  id: string | null;
  check_in_hour: string;
  work_hour: string;
}

export const attendanceService = {
  getAllAttendanceRecord: (
    page = 1,
    size = 10,
    sort = 'ASC',
    order = 'checkIn',
    value = '',
    status = ''
  ) =>
    api.get<ApiResponse<GetAllttendanceRecordResponse[]>>(
      `/attendance-record/getAllAttendanceRecord`,
      {
        params: { page, size, sort, order, value, status },
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
  checkOut: (id: string, check_out_hour: string, note: string) =>
    api.post<ApiResponse<AttendanceRecord>>(
      `/attendance-record/checkOut/${id}`,
      { id, check_out_hour, note }
    ),
};
