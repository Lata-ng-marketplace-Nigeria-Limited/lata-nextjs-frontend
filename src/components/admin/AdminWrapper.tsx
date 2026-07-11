import { getAdminAnalyticsApi } from "@/api/admin";
import AdminAnalyticsWrapper from "@/components/admin/AdminAnalytics";
import HeaderSubText from "@/components/atom/HeaderSubText";
import HeaderText from "@/components/atom/HeaderText";
import RecentPosts from "@/components/admin/RecentPosts";
import { getAnalyticsClicksAndViews } from "@/api/view";
import AnalyticsChart from "@/components/analytics/DynamicAnalyticsChart";
import AnalyticsSideCard from "@/components/analytics/AnalyticsSideCard";
import { formatNumber } from "@/utils";
import AnalyticsChartAreaHOC from "@components/analytics/AnalyticsChartAreaHOC";
import AnalyticsSideCardsHOC from "@components/analytics/AnalyticsSideCardsHOC";
import ProductInsights from "../analytics/ProductInsights";
import { getAllStatesApi } from "@/api/location";
import EmailBroadcastDialog from "@/components/admin/EmailBroadcastDialog";
import { getInActiveReelsApi } from "@/api/reels";
import { ReviewReel } from "@components/review-reels/ReviewReel";
import AdminHomeTabs from "@/components/admin/AdminHomeTabs";

interface Props {
  username: string;
  month: string;
  type: string;
  page: string;
  search: string;
}

export default async function AdminDashboardWrapper(props: Props) {
  const isReels = props.type === "reels";

  const [response, states, chartsData, reelsResponse] = await Promise.all([
    getAdminAnalyticsApi(props.month),
    getAllStatesApi(),
    getAnalyticsClicksAndViews(),
    isReels
      ? getInActiveReelsApi({ page: props.page, search: props.search })
      : Promise.resolve(null),
  ]);

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
        <EmailBroadcastDialog />
      </div>

      <AdminAnalyticsWrapper analyticsCount={response?.counts} />

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
              title="Monthly Sales"
              titleClassName="text-success"
              isMoney
              clicksCount={
                formatNumber(Number(response?.sales?.monthlySales)) || 0
              }
              description={response?.sales?.month}
            />

            <AnalyticsSideCard
              title="Total Sales"
              titleClassName="text-grey10"
              clicksCount={
                "₦" + formatNumber(Number(response?.sales?.totalSales)) || 0
              }
              description="All time sales"
            />
          </AnalyticsSideCardsHOC>
        </AnalyticsChartAreaHOC>
      </div>

      <div>
        <HeaderText title className="mb-7 md:mb-7">
          Recent Uploads
        </HeaderText>
        <AdminHomeTabs activeTab={props.type} />

        {isReels ? (
          <ReviewReel
            reels={reelsResponse?.data || []}
            meta={reelsResponse?.meta}
            page={props.page}
            urlSearch={props.search}
          />
        ) : (
          <RecentPosts
            reposts={response?.recentPosts?.data}
            meta={response.recentPosts?.meta}
            states={states?.data || []}
          />
        )}
      </div>
    </div>
  );
}
