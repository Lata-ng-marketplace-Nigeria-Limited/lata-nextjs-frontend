import { getSellerAnalyticsApi } from "@/api/view";
import React from "react";
import AnalyticsTopCards from "./AnalyticsTopCards";
import { GetSellerAnalyticsResponse } from "@/interface/views";

const AnalyticsCardsWrapper = async () => {
  const response: GetSellerAnalyticsResponse = await getSellerAnalyticsApi();

  return (
    <div>
      <section className="border-grey2 border-[1px] border-solid rounded-xl py-[2.1875rem] px-[1.1rem] tablet:px-[1.4375rem] mb-8 mt-6">
        <div className="grid grid-cols-4 gap-2 tablet:gap-4">
          <AnalyticsTopCards
            isTotalViews
            title="Total Views"
            description="Total view of all products"
            number={response?.productViews?.views ?? 0}
          />
          <AnalyticsTopCards
            title="Total product clicks"
            number={response?.productClicks?.clicks ?? 0}
            description="Total product clicks"
          />
          <AnalyticsTopCards
            title="Total phone clicks"
            number={response?.phoneClicks?.clicks ?? 0}
            description="Total phone clicks"
          />
          <AnalyticsTopCards
            title="Total message clicks"
            number={response?.messageClicks?.clicks ?? 0}
            description="Total message clicks"
          />
        </div>
      </section>
    </div>
  );
};

export default AnalyticsCardsWrapper;
