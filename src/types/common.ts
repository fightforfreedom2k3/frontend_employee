export interface BankAccount {
  bankName: string | undefined;
  accountNumber: string | undefined;
}

export interface Insurance {
  socialInsuranceRate: number;
  healthInsuranceRate: number;
  unemploymentInsuranceRate: number;
}

export interface Attachments {
  fileName: string;
  fileUrl: string;
}
