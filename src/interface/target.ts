export interface ITarget {
  id: string;
  level: string;
  amount: number;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITargetTransaction {
  id: string;
  staffId: string;
  commission: number;
  amount: number;
  targetInformation: string;
  targetSalary: number;
  year: string;
  month: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}
