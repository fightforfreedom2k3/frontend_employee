export interface Meal {
  _id: string;
  day: string;
  date: string;
  menu: {
    price: number;
    items: string[];
  };
  order: {
    quantity: number;
    totalPrice: number;
  };
}

export interface OrderMealResponse {
  employeeId: string;
  menuId: string;
  quantity: number;
  price: number;
  _id: string;
  date: string;
}
