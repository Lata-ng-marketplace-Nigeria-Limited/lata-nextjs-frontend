import { getAllSubscriptionsApi } from "@/api/subscription";
import { Subscriptions } from "@components/subscription/Subscriptions";

export const SubscriptionsWrapper = async () => {
  const subscriptions = await getAllSubscriptionsApi();

  return <Subscriptions subscriptions={subscriptions?.subscriptions} />;
};
