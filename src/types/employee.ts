export interface BankAccount {
    bankName: string;
    accountNumber: string;
}

export interface Insurance {
    socialInsuranceRate: number;
    healthInsuranceRate: number;
    unemploymentInsuranceRate: number;
}

export interface Department {
    _id: string;
    name: string;
    description: string;
}

export interface Employee {
    _id: string;
    userName: string;
    fullName: string;
    dob: string;  // Date string
    department: Department; // Sửa lại kiểu dữ liệu
    position: string;
    role: string;
    baseSalary: number;
    bankAccount: BankAccount;
    insurance: Insurance;
    taxCode: string;
    createdAt: string;
    updatedAt: string;
}
