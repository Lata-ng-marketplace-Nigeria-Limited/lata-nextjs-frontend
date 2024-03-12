import React from "react";
import AnalyticsTopCards from "../analytics/AnalyticsTopCards";
import AnalyticsTopCardsHOC from "../analytics/AnalyticsTopCardsHOC";
import { formatPriceCompact } from "@/utils";
import { IGradeTransaction } from "@/interface/grade";
import { DateTime } from "luxon";

interface Props {
  data: IGradeTransaction;
  totalPaidSellers?: number;
  allowance: number;
}
const StaffTopCards = (props: Props) => {
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
        title="Grade pay"
        description="Salary pay for meeting your grade point"
        isClickable
        number={formatPriceCompact(props?.data?.gradeSalary, true) || "0"}
      />
      <AnalyticsTopCards
        title="Paid sellers"
        description="The total numbers of your paid sellers"
        isClickable
        number={props?.totalPaidSellers?.toLocaleString() || "0"}
      />
    </AnalyticsTopCardsHOC>
  );
};

export default StaffTopCards;
