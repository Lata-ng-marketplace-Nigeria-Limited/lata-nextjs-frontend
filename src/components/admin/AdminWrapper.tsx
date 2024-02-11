import { getAdminAnalyticsApi } from "@/api/analytics";
import AdminAnalyticsWrapper from "@/components/analytics/AdminAnalytics";
import HeaderSubText from "@/components/atom/HeaderSubText";
import HeaderText from "@/components/atom/HeaderText";
import Button from "@/components/atom/Button";
import RecentPosts from "@/components/posts/RecentPosts";
import { getAnalyticsClicksAndViews } from "@/api/view";
import AnalyticsChart from "@/components/analytics/AnalyticsChart";
import AnalyticsSideCard from "@/components/analytics/AnalyticsSideCard";
import AnalyticsSideCardsHOC from "@/components/analytics/AnalyticsSideCardsHOC";
import AnalyticsChartAreaHOC from "@/components/analytics/AnalyticsChartAreaHOC";
import { formatNumber } from "@/utils";

interface Props {
  username: string;
}
export default async function AdminDashboardWrapper(props: Props) {
  const response = await getAdminAnalyticsApi();
  const chartsData = await getAnalyticsClicksAndViews();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <HeaderText title className="mb-7">
            Admin Dashboard
          </HeaderText>
          <HeaderSubText>
            Hi {props?.username || "Admin"}, Welcome back!
          </HeaderSubText>
        </div>
        <Button format="primary">Account Email</Button>
      </div>

      <AdminAnalyticsWrapper analyticsCount={response?.counts} />

      <div className="mb-8">
        <HeaderText title className="mb-7 md:mb-7">
          Analytics Chart
        </HeaderText>

        <AnalyticsChartAreaHOC>
          <AnalyticsChart chartsData={chartsData} />

          <AnalyticsSideCardsHOC>
            <AnalyticsSideCard
              title="Monthly Sales"
              titleClassName="text-success"
              clicksCount={formatNumber(response?.sales?.monthlySales) || 0}
              description={response?.sales?.month}
            />

            <AnalyticsSideCard
              title="Total Sales"
              clicksCount={
                formatNumber(response?.sales?.totalSales)?.toLocaleString() || 0
              }
              description="All time sales"
            />
          </AnalyticsSideCardsHOC>
        </AnalyticsChartAreaHOC>
      </div>

      <div>
        <HeaderText title className="mb-7 md:mb-7">
          Recent Posts
        </HeaderText>

        <RecentPosts reposts={response?.recentPosts} />
      </div>
    </div>
  );
}
