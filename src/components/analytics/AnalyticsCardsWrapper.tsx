import React from "react";
import AnalyticsTopCards from "./AnalyticsTopCards";
import { getViewsApi } from "@/service/views";

interface Props {}

const AnalyticsCardsWrapper = ({}: Props) => {
  const [phoneClicks, setPhoneClicks] = React.useState(0);
  const [productClicks, setProductClicks] = React.useState(0);
  const [messageClicks, setMessageClicks] = React.useState(0);

  const formatNumber = (number: number) => {
    return Number(new Intl.NumberFormat("en-US").format(number));
  };

  const itemViewsAndClicks = async () => {
    const [phone, products, message] = await Promise.all([
      await getViewsApi("PHONE"),
      await getViewsApi("PRODUCT"),
      await getViewsApi("MESSAGE"),
    ]);

    console.log({ phone, products, message });

    setPhoneClicks(formatNumber(phone.noOfClicks));
    setProductClicks(formatNumber(products.noOfClicks));
    setMessageClicks(formatNumber(message.noOfClicks));
  };

  React.useEffect(() => {
    itemViewsAndClicks();
  }, []);

  return (
    <section className="border-grey2 border-[1px] border-solid rounded-xl py-[2.1875rem] px-[1.4375rem] mb-8 mt-6">
      <div className="grid grid-cols-4 gap-4">
        <AnalyticsTopCards
          isTotalViews
          title="Total Views"
          description="Total view of all products"
          number={"25,000"}
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
  );
};

export default AnalyticsCardsWrapper;
