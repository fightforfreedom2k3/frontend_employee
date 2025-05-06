import api from './api';

export const propertyService = {
  getAllProperty: (
    page: number,
    size: number,
    sort: string,
    order: string,
    value: string
  ) =>
    api.get(`/property/getAllProperty`, {
      params: {
        page,
        size,
        sort,
        order,
        value,
      },
    }),
  createProperty: (
    department: string,
    name: string,
    status: string,
    number: number
  ) =>
    api.post(`/property/createProperty`, { department, name, status, number }),
  getAllPropertyByDepartmentAndStatus: (
    departmentId: string,
    status: string,
    page: number,
    size: number,
    sort: string,
    order: string,
    value: string
  ) =>
    api.get(
      `/property/getAllPropertyByDepartmentAndStatus/${departmentId}/${status}`,
      {
        params: {
          departmentId,
          status,
          page,
          size,
          sort,
          order,
          value,
        },
      }
    ),
  requestMaintenance: (id: string) =>
    api.get(`/property/requestMaintenance/${id}`, {
      params: {
        id,
      },
    }),
  returnProperty: (id: string) =>
    api.get(`/property/returnProperty/${id}`, {
      params: {
        id,
      },
    }),
};
