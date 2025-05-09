import api from './api';

export interface CreateMeetingData {
  name: string;
  description: string;
  department: string;
  date: string;
  status: string;
}

export const meetingService = {
  getAllMeetingByDepartmentAndStatus: (
    page: number,
    size: number,
    field: string,
    order: string,
    departmentId: string,
    status: string
  ) =>
    api.get(`/meeting/getAllMeetingByDepartmentAndStatus`, {
      params: {
        page,
        size,
        field,
        order,
        departmentId,
        status,
      },
    }),
  createMeeting: (data: CreateMeetingData) =>
    api.post(`/meeting/createMeeting`, data),
  approveMeeting: (meetingId: string) =>
    api.get(`/meeting, approveMeeing`, {
      params: {
        meetingId,
      },
    }),
  rejectMeeting: (meetingId: string) =>
    api.get(`/meeting/rejectMeeting`, {
      params: {
        meetingId,
      },
    }),
};
