export type IEnv =
  | "NEXT_PUBLIC_LATA_API_URL"
  | "NEXT_PUBLIC_IP_DATA_API_KEY"
  | "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
  | "NEXT_PUBLIC_CHAT_API_URL";

export type ICookies = "token" | "role";

export type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "CANCELLED";

export interface ApiErrorResponse<T = any> {
  data: {
    error?: any;
    errors: errorArrayMember<T>[];
    errorInfo: string;
    message: string;
    [key: string]: any;
  };
  status: number;
  statusText: string;
  [key: string]: any;
}

export interface errorArrayMember<T> {
  message: string;
  field?: T extends undefined ? string : keyof T | string;
  retryAfter?: number;
}

export interface FetchMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string;
  previous_page_url: string;
}

export interface SearchQuery {
  page?: number | string;
  limit?: number | string;
}
