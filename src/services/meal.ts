import { ApiResponse } from '../types/api';
import { Meal, OrderByDay, OrderMealResponse } from '../types/meal';
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
  orderMeal: (
    menuId: string,
    employeeId: string | null,
    quantity: number,
    date: string
  ) =>
    api.post<ApiResponse<OrderMealResponse>>(`/meal-ordering/orderMeal`, {
      menuId: menuId,
      employeeId: employeeId,
      quantity: quantity,
      date: date,
    }),
  getOrderList: (date: string) =>
    api.get<ApiResponse<OrderByDay[]>>(`/meal-ordering/getAllOrderInOneDay`, {
      params: { date },
    }),
};
