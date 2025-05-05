import api from './api';

export const propertyService = {
  getAllProperty: () => api.get(`/property/getAllProperty`),
  createProperty: (
    department: string,
    name: string,
    status: string,
    number: number
  ) =>
    api.post(`/property/createProperty`, { department, name, status, number }),
  getAllPropertyByDepartment: (id: string) =>
    api.get(`/property/getAllPropertyByDepartment/${id}`, {
      params: {
        id,
      },
    }),
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
