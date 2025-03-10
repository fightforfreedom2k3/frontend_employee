import { ApiResponse } from '../types/api';
import { AttendanceRecord } from '../types/attendance';
import api from './api';

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
};
