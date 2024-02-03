import { getSellerAnalyticsApi } from "@/api/view";
import React from "react";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { GetSellerAnalyticsResponse } from "@/interface/views";

const AnalyticsCardsWrapper = async () => {
  const response: GetSellerAnalyticsResponse = await getSellerAnalyticsApi();

  const formatNumber = (number: number | undefined | null) => {
    if (!number || typeof number !== "number") return 0;
    return number.toLocaleString();
  };
  const productViews = formatNumber(response?.productViews);
  const productClicks = formatNumber(response?.productClicks);
  const phoneClicks = formatNumber(response?.phoneClicks);
  const messageClicks = formatNumber(response?.messageClicks);

  return (
    <div>
      <section className="mb-8 mt-6 rounded-[0.625rem] border border-solid border-grey2 px-6 py-6 lg:py-[2.19rem]">
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2  lg:grid-cols-4">
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
