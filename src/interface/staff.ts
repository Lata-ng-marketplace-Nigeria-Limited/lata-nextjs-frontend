export interface BonusTransaction {
  id: string;
  week: number;
  amount: number;
  staff_id: string;
  bonus_information: string;
  meta: null | any;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  userId: string;
  bonusAmount: number;
  commissionPercentage: number;
  meta?: string;
  isOutdated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceOverview {
  allTimeTotalSales: number;
  highestSales: number | null;
  lowestSales: number | null;
  bestMonth: string | null;
  worstMonth: string | null;
  month: string | null;
  monthlySales: number;
  totalPaidSellers: number;
  allowance: number;
  commission?: number
  reward: Reward | null;
}
