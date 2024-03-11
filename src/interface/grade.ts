export interface IGrade {
  id: string;
  level: string;
  amount: number;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGradeTransaction {
  id: string;
  staffId: string;
  commission: number;
  amount: number;
  gradeInformation: string;
  gradeSalary: number;
  year: string;
  month: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}
