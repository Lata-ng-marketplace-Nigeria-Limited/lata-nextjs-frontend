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
  phoneClicks: AnalyticsClicksData;
  productClicks: AnalyticsClicksData;
  messageClicks: AnalyticsClicksData;
  productViews: AnalyticsClicksData & { views: number };
  month?: string;
}

export interface ChartAnalyticsMonthlyDataResponse {
  month: string;
  views: number;
  clicks: number;
}

export interface MonthlyAnalyticsResponse {
  success: boolean;
  productClicksForAllMonths: Omit<ChartAnalyticsMonthlyDataResponse, "views">[];
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
