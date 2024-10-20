import AnalyticsChart from "@components/analytics/AnalyticsChart";
import AnalyticsSideCardsWrapper from "@components/analytics/AnalyticsSideCardsWrapper";
import AnalyticsChartAreaHOC from "./AnalyticsChartAreaHOC";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { MonthlyAnalyticsResponse } from "@/interface/views";

interface Props {
  selectedMonth: string;
  queries: SwitchedRoleQueries;
  chartsData: MonthlyAnalyticsResponse;
}

const AnalyticsChartArea = ({ selectedMonth, chartsData, queries }: Props) => {
  return (
    <AnalyticsChartAreaHOC>
      <AnalyticsChart chartsData={chartsData} />
      <AnalyticsSideCardsWrapper
        selectedMonth={selectedMonth}
        queries={queries}
      />
    </AnalyticsChartAreaHOC>
  );
};

export default AnalyticsChartArea;
