import api from "./api";

export const propertyService = {
    getAllProperty: () => 
        api.get(`/property/getAllProperty`),
}