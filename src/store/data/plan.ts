import { PlanName } from "../../interface/payment";
import { FetchMeta } from "../../interface/general";

export const planList: PlanName[] = [
  "Free",

  "Premium",

  "VIP",

  "Gold",

  "Pro Sales",
];

export const defaultFetchMeta: FetchMeta = {
  current_page: 1,
  first_page: 1,
  first_page_url: "",
  last_page: 1,
  last_page_url: "",
  next_page_url: "",
  per_page: 10,
  previous_page_url: "",
  total: 1,
};

export const planDurationList = [
  {
    value: "1",
    label: "1 month",
  },
  {
    value: "3",
    label: "3 month",
  },
  {
    value: "6",
    label: "6 month",
  },
  {
    value: "12",
    label: "12 month",
  },
]
