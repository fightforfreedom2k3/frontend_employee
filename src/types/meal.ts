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
