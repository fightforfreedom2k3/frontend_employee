import { BankAccount, Insurance } from "./common";

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
    fullName: string;
    dob: string;  // Date string
    department: Department | null; // Sửa lại kiểu dữ liệu
    position: string;
    role: string;
    baseSalary: number;
    bankAccount: BankAccount;
    insurance: Insurance;
    taxCode: string;
    createdAt: string;
    updatedAt: string;
}
