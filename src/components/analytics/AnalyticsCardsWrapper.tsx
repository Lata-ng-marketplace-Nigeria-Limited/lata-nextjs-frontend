import { getSellerAnalyticsApi } from "@/api/view";
import React from "react";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { GetSellerAnalyticsResponse } from "@/interface/views";

const AnalyticsCardsWrapper = async () => {
  const response: GetSellerAnalyticsResponse = await getSellerAnalyticsApi();

  const formatNumber = (number: number) => {
    return Number(new Intl.NumberFormat("en-US").format(number));
  };
  const productClicks = formatNumber(response?.productClicks?.clicks ?? 0);
  const productViews = formatNumber(response?.productViews?.views ?? 0);
  const phoneClicks = formatNumber(response?.phoneClicks?.clicks ?? 0);
  const messageClicks = formatNumber(response?.messageClicks?.clicks ?? 0);

  return (
    <div>
      <section className="border-grey2 border border-solid rounded-[0.625rem] py-6 lg:py-[2.19rem] px-6 mb-8 mt-6">
        <div className="grid grid-cols-autoFit gap-6">
          <AnalyticsTopCards
            isTotalViews
            title="Total Views"
            description="Total view of all products"
            number={productViews}
          />
          <AnalyticsTopCards
            title="Total product clicks"
            number={productClicks}
            description="Total product clicks"
          />
          <AnalyticsTopCards
            title="Total phone clicks"
            number={phoneClicks}
            description="Total phone clicks"
          />
          <AnalyticsTopCards
            title="Total message clicks"
            number={messageClicks}
            description="Total message clicks"
          />
        </div>
      </section>
    </div>
  );
};

export default AnalyticsCardsWrapper;
