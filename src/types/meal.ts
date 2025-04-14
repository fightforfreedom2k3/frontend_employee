export interface Meal {
  _id: string;
  day: string;
  date: string;
  menu: {
    _id: string;
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

export interface OrderInfo {
  quantity: number;
  fullName: string;
  department: string;
  email: string;
  phoneNumber: string;
}

export interface OrderByDay {
  day: string;
  date: string;
  order: {
    total: number;
    info: OrderInfo[];
  };
}
