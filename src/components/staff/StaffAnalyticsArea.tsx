import React from "react";
import AnalyticsChartAreaHOC from "../analytics/AnalyticsChartAreaHOC";
import StaffAnalytics from "./StaffAnalytics";
import AnalyticsSideCardsHOC from "../analytics/AnalyticsSideCardsHOC";
import AnalyticsSideCard from "../analytics/AnalyticsSideCard";
import { IGetTargets } from "@/api/staff";
import { formatNumber } from "@/utils";
import { months } from "@/store/data/analytics";
import ProductInsights from "../analytics/ProductInsights";

interface Props {
  staffPerf: IGetTargets;
  month: string;
}
const StaffAnalyticsArea = (props: Props) => {
  const monthInFull =
    months[Number(props.staffPerf?.statsOverView?.month) - 1]?.extra ?? "";

  return (
    <div className="mb-8">
      <ProductInsights
        selectedMonth={props.month}
        title="Sales Chart"
        titleClass="!text-sm md:!text-[1.1rem] text-grey10 font-semibold md:font-medium"
      />
      <AnalyticsChartAreaHOC>
        <StaffAnalytics data={props.staffPerf?.staffAnalytics} />

        <AnalyticsSideCardsHOC>
          <AnalyticsSideCard
            title="Total Sales"
            isMoney
            clicksCount={
              formatNumber(props.staffPerf?.statsOverView?.monthlySales) || 0
            }
            description={monthInFull}
          />

          <AnalyticsSideCard
            title="Best Month"
            isMoney
            titleClassName="text-success"
            clicksCount={
              formatNumber(props.staffPerf?.statsOverView?.highestSales || 0) ||
              0
            }
            description={props.staffPerf?.statsOverView?.bestMonth || ""}
          />

          <AnalyticsSideCard
            title="Worst Month"
            isMoney
            titleClassName="text-danger"
            clicksCount={
              formatNumber(props.staffPerf?.statsOverView?.lowestSales || 0) ||
              0
            }
            description={props.staffPerf?.statsOverView?.worstMonth || ""}
          />
        </AnalyticsSideCardsHOC>
      </AnalyticsChartAreaHOC>
    </div>
  );
};

export default StaffAnalyticsArea;
