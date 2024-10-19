export type ViewTypes =
  | "PRODUCT"
  | "PROFILE"
  | "VIEW"
  | "MESSAGE"
  | "PHONE"
  | "OTHER";

export interface CreateViewTypes {
  type: ViewTypes;
  productId: string;
  userId: string;
}

interface AnalyticsClicksData {
  clicks: number;
}
export interface GetSellerAnalyticsResponse {
  isError?: boolean;
  sucess?: boolean;
  phoneClicks: number;
  productClicks: number;
  messageClicks: number;
  productViews: number & { views: number };
  month?: string;
}

export interface ChartAnalyticsMonthlyDataResponse {
  month: string;
  // views: number;
  // clicks: number;
  phone: number;
  product: number;
  message: number;
  view: number;
}

export interface MonthlyAnalyticsResponse {
  success: boolean;
  productClicksForAllMonths: Omit<ChartAnalyticsMonthlyDataResponse, "views">[];
  phoneClicksForAllMonths: Omit<ChartAnalyticsMonthlyDataResponse, "views">[];
  messageClicksForAllMonths: Omit<ChartAnalyticsMonthlyDataResponse, "views">[];
  productViewsForAllMonths: Omit<ChartAnalyticsMonthlyDataResponse, "clicks">[];
  monthsInOrder: MonthNamesType;
}

export type MonthNamesType = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
