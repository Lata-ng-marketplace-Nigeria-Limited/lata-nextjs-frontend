import { Status } from "./general";
import { User } from "./user";

export type PlanName =
  | "Free"
  | "Premium"
  | "VIP"
  | "Gold"
  | "Pro Sales"
  | "Verified";

export type SubscriptionType = "PROPERTY" | "CARS" | "OTHERS" | "COMBO";

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  meta: SubscriptionMeta;
  createdAt: string;
  updatedAt: string;
  plans?: Plan[];
}

export interface SubscriptionMeta {
  image: string;
  color: string;
  order: number;
  [key: string]: any;
}

export interface Plan {
  id: string;
  features: string[];
  price: number;
  currency: string;
  name: PlanName;
  duration: number;
  meta: null | Record<string, any>;
  subscriptionId: string;
  status: Status;
  discountPercentage: number;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  balance: number;
  totalBalance: number;
  totalSpent: number;
  meta: Record<string, any> | null;
  currency: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  planId?: string;
  amount: number;
  actualAmount: number;
  currency: AcceptedCurrencies;
  status: TransactionStatus;
  provider?: string;
  providerStatus: string;
  sessionId?: string;
  type: TransactionType;
  date: string | null;
  narration?: string;
  reference: string;
  isVerified?: boolean;
  verifyNarration?: string;
  meta?: string | null;
  plan?: Plan;
  createdAt: string;
  updatedAt: string;
}

export type AcceptedCurrencies = "NGN" | "GHS" | "ZAR" | "USD";

export type PaymentProviders = "paystack" | "flutterwave";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAIL" | "INITIALIZE";

export type TransactionType = "subscription" | "wallet:credit" | "wallet:debit";

export interface PaystackMetadata {
  type?: TransactionType;
  transactionId?: string;
  amount?: number;
  walletAmount?: number;
  fee?: number;
  referrer: string;
  custom_fields?: PaystackCustomFields[];
  cancel_action?: string;
  custom_filters?: PaystackCustomFilter;
  [key: string]: any;
}

interface PaystackCustomFilter {
  recurring?: boolean;
  banks?: string[];
  card_brands?: Array<"visa" | "verve" | "master" | string>;
}

interface PaystackCustomFields {
  display_name?: string;
  variable_name?: string;
  value?: any;
}

export interface PaystackConfig {
  publicKey: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: number | string;
  amount: number;
  ref?: string;
  reference?: string;
  metadata?: Partial<PaystackMetadata>;
  currency?: "NGN" | "GHS" | "USD" | "ZAR" | string;
  channels?: PaymentChannels[];
  label?: string;
  plan?: string;
  quantity?: number;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: Bearer;
  split_code?: string;
  split?: Record<string, any>;
  "data-custom-button"?: string;
}

type PaymentChannels =
  | "bank"
  | "card"
  | "qr"
  | "ussd"
  | "mobile_money"
  | "bank_transfer"
  | string;

type Bearer = "account" | "subaccount" | string;

export interface Invoice {
  id: number;
  userId: string;
  amount: number;
  wallet?: number;
  amountWithoutWallet?: number;
  vat: number;
  discount: number;
  paymentId: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  dueDate: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  invoiceData: InvoiceData;
  meta: Record<string, any> | null | string;
  planId: string;
  subscriptionId: string;
  transactionId: string;
  plan?: Plan;
  subscription?: Subscription;
  user?: User;
  admin?: User;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceData {
  tableData: InvoiceTableData[];
  [key: string]: any;
}

export interface InvoiceTableData {
  description: string;
  unitPrice: string;
  vat: string;
  total: string;
}

export interface PaystackSuccessResponse {
  message?: string;
  redirecturl?: string;
  reference?: string;
  status?: string;
  trans?: string;
  transaction?: string;
  trxref?: string;
  [key: string]: any;
}

export type PaystackMainConfig = PaystackConfig & {
  key: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onCancel: () => void;
  onBankTransferConfirmationPending?: () => void;
};
