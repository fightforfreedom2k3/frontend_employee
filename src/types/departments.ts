export interface Department {
  _id: string;
  name: string;
  description: string;
  manager: {
    fullName: string;
  };
  managerName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
