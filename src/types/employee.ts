export interface Department {
  _id: string;
  name: string;
  description: string;
  manager: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Employee {
  _id: string;
  userName: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: string; // Date string
  department: Department;
  position: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
