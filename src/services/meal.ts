import { ApiResponse } from '../types/api';
import { Meal } from '../types/meal';
import api from './api';

export const mealService = {
  getMyOrder: (id: string) =>
    api.get<ApiResponse<Meal[]>>(`/meal-ordering/getMyOrder/${id}`),
  createMenu: (date: string | null, items: string[], price: number) =>
    api.post<ApiResponse<Meal>>(`/meal-menu/createMenu`, {
      date: date,
      price: price,
      items: items,
    }),
};
