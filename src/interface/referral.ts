export interface IReferral{
    id: string;
    userId: string;
    referralCode: string;
    usedCount?: number;
    meta?: string;
    createdAt: string;
    updatedAt: string;
  }