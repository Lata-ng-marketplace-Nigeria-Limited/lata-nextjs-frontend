import { getSellerAnalyticsApi } from "@/api/view";
import Analytics from "@components/analytics/Analytics";

export const AnalyticsWrapper = async () => {
  const data = await getSellerAnalyticsApi();

  return <Analytics data={data} />;
};
