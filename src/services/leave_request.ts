import api from './api';

interface LeaveRequestData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export const leaveRequestService = {
  getAllLeaveRequest: (
    page = 1,
    size = 10,
    field = 'ASC',
    order = 'username',
    value = '',
    status = ''
  ) =>
    api.get(`/leave-request/getAllLeaveRequest`, {
      params: { page, size, field, order, value, status },
    }),
  createLeaveRequest: (id: string, data: LeaveRequestData) =>
    api.post(`/leave-request/createLeaveRequest/${id}`, data),
  approveLeaveRequest: (id: string) =>
    api.get(`/leave-request/approveLeaveRequest/${id}`),
  rejectLeaveRequest: (id: string) =>
    api.get(`/leave-request/rejectLeaveRequest/${id}`),
  getAllMyLeaveRequest: (id: string) =>
    api.get(`/leave-request/getAllMyleaveRequest/${id}`),
};
