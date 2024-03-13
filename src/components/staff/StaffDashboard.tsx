import React from "react";
import StaffTopCards from "./StaffTopCards";
import { staffPerformance } from "@/api/staff";
import AnalyticsSideCard from "../analytics/AnalyticsSideCard";
import AnalyticsSideCardsHOC from "../analytics/AnalyticsSideCardsHOC";
import AnalyticsChartAreaHOC from "../analytics/AnalyticsChartAreaHOC";
import { formatNumber } from "@/utils";
import ProductInsights from "../analytics/ProductInsights";
import Targets from "@components/staff/Targets";
import Bonuses from "@components/staff/Bonuses";
import StaffAnalytics from "./StaffAnalytics";
import { months } from "@/store/data/analytics";
import { PerformanceOverview } from "@/interface/staff";

interface Props {
  staffId: string;
  month: string;
}

const StaffDashboard = async (props: Props) => {
  const staffPerf = await staffPerformance({
    staffId: props.staffId,
    month: props.month,
  });
  const monthInFull =
    months[Number(staffPerf?.statsOverView?.month) - 1]?.extra ?? "";

  return (
    <div>
      <StaffTopCards
        data={staffPerf?.data}
        statsOverview={staffPerf?.statsOverView as PerformanceOverview}
      />
      <div className="mb-8">
        <ProductInsights
          selectedMonth={props.month}
          title="Sales Chart"
          titleClass="!text-sm md:!text-[1.1rem] text-grey10 font-semibold md:font-medium"
        />
        <AnalyticsChartAreaHOC>
          <StaffAnalytics data={staffPerf?.staffAnalytics} />

          <AnalyticsSideCardsHOC>
            <AnalyticsSideCard
              title="Total Sales"
              isMoney
              clicksCount={
                formatNumber(staffPerf?.statsOverView?.monthlySales) || 0
              }
              description={monthInFull}
            />

            <AnalyticsSideCard
              title="Best Month"
              isMoney
              titleClassName="text-success"
              clicksCount={
                formatNumber(staffPerf?.statsOverView?.highestSales || 0) || 0
              }
              description={staffPerf?.statsOverView?.bestMonth || ""}
            />

            <AnalyticsSideCard
              title="Worst Month"
              isMoney
              titleClassName="text-danger"
              clicksCount={
                formatNumber(staffPerf?.statsOverView?.lowestSales || 0) || 0
              }
              description={staffPerf?.statsOverView?.worstMonth || ""}
            />
          </AnalyticsSideCardsHOC>
        </AnalyticsChartAreaHOC>
      </div>

      <div className="gap-3 xms:flex sm:block">
        <Targets
          wrapperClass="basis-[50%]"
          targets={staffPerf?.targets}
          sales={staffPerf?.data?.amount}
          targetPay={JSON.parse(staffPerf?.data?.targetInformation || "{}")}
        />
        <Bonuses wrapperClass="basis-[50%]" bonuses={staffPerf?.bonuses} />
      </div>
    </div>
  );
};

export default StaffDashboard;
