"use client";

import React from "react";
import AnalyticsTopCards from "../analytics/AnalyticsTopCards";
import AnalyticsTopCardsHOC from "../analytics/AnalyticsTopCardsHOC";
import { formatPriceCompact } from "@/utils";
import { ITargetTransaction } from "@/interface/target";
import { PAID_SELLERS_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { PerformanceOverview } from "@/interface/staff";

interface Props {
  data: ITargetTransaction;
  statsOverview: PerformanceOverview;
  staffId: string;
}
const StaffTopCards = (props: Props) => {
  const reward = () => {
    let commission;
    let bonus;
    if (props?.statsOverview?.reward) {
      commission = (
        props.statsOverview.reward?.commissionPercentage * 100
      ).toFixed(0);
      bonus = formatPriceCompact(props.statsOverview.reward?.bonusAmount);
    }
    return {
      commission,
      bonus,
    };
  };

  const { push } = useRouter();
  return (
    <AnalyticsTopCardsHOC>
      <AnalyticsTopCards
        isTotalViews
        title="Commission"
        description={`${reward().commission}% of your total sales`}
        isClickable
        number={
          formatPriceCompact(
            props?.statsOverview?.commission as number,
            true,
          ) || "0"
        }
      />
      <AnalyticsTopCards
        title="Allowance"
        description={`${reward().bonus} for every three sales and above`}
        isClickable
        number={
          formatPriceCompact(props?.statsOverview?.allowance, true || 0) || "0"
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
        onClick={() => push(`${PAID_SELLERS_ROUTE}/${props.staffId}`)}
        number={props?.statsOverview?.totalPaidSellers?.toLocaleString() || "0"}
      />
    </AnalyticsTopCardsHOC>
  );
};

export default StaffTopCards;
