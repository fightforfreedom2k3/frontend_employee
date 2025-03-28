import { ApiResponse } from '../types/api';
import { Meal } from '../types/meal';
import api from './api';

export const mealService = {
  getMyOrder: (id: string) =>
    api.get<ApiResponse<Meal[]>>(`/meal-ordering/getMyOrder/${id}`),
};
