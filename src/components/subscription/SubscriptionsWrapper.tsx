import { getAllSubscriptionsApi } from "@/api/subscription";
import { Subscriptions } from "@components/subscription/Subscriptions";

interface Props {
  sellerId?: string;
}
export const SubscriptionsWrapper = async (props: Props) => {
  const subscriptions = await getAllSubscriptionsApi();

  return (
    <Subscriptions
      subscriptions={subscriptions?.subscriptions}
      sellerId={props.sellerId}
    />
  );
};
