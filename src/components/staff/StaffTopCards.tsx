"use client";

import React from "react";
import AnalyticsTopCards from "../analytics/AnalyticsTopCards";
import AnalyticsTopCardsHOC from "../analytics/AnalyticsTopCardsHOC";
import { formatPriceCompact } from "@/utils";
import { ITargetTransaction } from "@/interface/target";
import { PAID_SELLERS_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";

interface Props {
  data: ITargetTransaction;
  totalPaidSellers?: number;
  allowance: number;
}
const StaffTopCards = (props: Props) => {
  const { push } = useRouter();
  return (
    <AnalyticsTopCardsHOC>
      <AnalyticsTopCards
        isTotalViews
        title="Commission"
        description="20% of your total sales"
        isClickable
        number={formatPriceCompact(props?.data?.commission, true) || "0"}
      />
      <AnalyticsTopCards
        title="Allowance"
        description="₦5K for every three sales and above"
        isClickable
        number={
          formatPriceCompact(props?.allowance as number, true || 0) || "0"
        }
      />
      <AnalyticsTopCards
        title="Target pay"
        description="Salary pay for meeting your target point"
        isClickable
        number={formatPriceCompact(props?.data?.targetSalary, true) || "0"}
      />
      <AnalyticsTopCards
        title="Paid sellers"
        description="The total numbers of your paid sellers"
        isClickable
        onClick={() => push(PAID_SELLERS_ROUTE)}
        number={props?.totalPaidSellers?.toLocaleString() || "0"}
      />
    </AnalyticsTopCardsHOC>
  );
};

export default StaffTopCards;
