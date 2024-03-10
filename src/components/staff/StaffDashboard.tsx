import React from "react";
import StaffTopCards from "./StaffTopCards";
import { staffPerformance } from "@/api/grade";
import AnalyticsSideCard from "../analytics/AnalyticsSideCard";
import AnalyticsSideCardsHOC from "../analytics/AnalyticsSideCardsHOC";
import AnalyticsChart from "../analytics/AnalyticsChart";
import AnalyticsChartAreaHOC from "../analytics/AnalyticsChartAreaHOC";
import { getAnalyticsClicksAndViews } from "@/api/view";
import { formatNumber } from "@/utils";
import ProductInsights from "../analytics/ProductInsights";
import Grades from "./Grades";
import Bonuses from "./Bonuses";

interface Props {
  staffId: string;
  month: string;
}

const StaffDashboard = async (props: Props) => {
  const staffPerf = await staffPerformance({ staffId: props.staffId });
  const chartsData = await getAnalyticsClicksAndViews();

  return (
    <div>
      <StaffTopCards data={staffPerf?.data} />
      <div className="mb-8">
        <ProductInsights
          selectedMonth={props.month}
          title="Analytics Chart"
          titleClass="!text-sm md:!text-[1.1rem] text-grey10 font-semibold md:font-medium"
        />
        <AnalyticsChartAreaHOC>
          <AnalyticsChart chartsData={chartsData} />

          <AnalyticsSideCardsHOC>
            <AnalyticsSideCard
              title="Total Sales"
              isMoney
              clicksCount={0}
              description={"March"}
            />

            <AnalyticsSideCard
              title="Best Month"
              isMoney
              titleClassName="text-success"
              clicksCount={0}
              description="March"
            />

            <AnalyticsSideCard
              title="Worst Month"
              isMoney
              titleClassName="text-danger"
              clicksCount={0}
              description="March"
            />
          </AnalyticsSideCardsHOC>
        </AnalyticsChartAreaHOC>
      </div>

      <div className="gap-3 xms:flex sm:block">
        <Grades
          wrapperClass="basis-[50%]"
          grades={staffPerf?.grades}
          sales={staffPerf?.data?.amount}
          gradePay={JSON.parse(staffPerf?.data?.gradeInformation)}
        />
        <Bonuses wrapperClass="basis-[50%]" />
      </div>
    </div>
  );
};

export default StaffDashboard;
