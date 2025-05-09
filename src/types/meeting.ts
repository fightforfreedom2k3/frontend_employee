export interface Meeting {
  name: string;
  description: string;
  department: {
    _id: string;
    name: string;
  };
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
