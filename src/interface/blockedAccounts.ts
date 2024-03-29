import { User } from "./user";

type BlockedAccountStatus = "BLOCKED" | "UNBLOCKED" | "OTHER";
export type AppealStatus = "APPROVED" | "REJECTED" | "PENDING";
type FileType =
  | "NIN"
  | "DRIVERS_LICENSE"
  | "VOTERS_CARD"
  | "INTERNATIONAL_PASSPORT"
  | "OTHER";

export interface BlockedAccount {
  id: string;
  status: BlockedAccountStatus;
  allow: boolean;
  userId: string;
  blockerId: string;
  appealStatus?: AppealStatus;
  file?: File;
  fileType?: FileType;
  user?: User;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedUserDetails {
  id: number;
  email: string;
  name: string;
  avatar: string;
  managerName: string;
  address: string;
  managerEmail: string;
  createdAt: string;
}

