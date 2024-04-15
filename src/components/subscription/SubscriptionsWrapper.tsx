import { getAllSubscriptionsApi } from "@/api/subscription";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { Subscriptions } from "@components/subscription/Subscriptions";

interface Props {
  queries: SwitchedRoleQueries
}

export const SubscriptionsWrapper = async (props: Props) => {
  const subscriptions = await getAllSubscriptionsApi(props.queries);

  return <Subscriptions subscriptions={subscriptions?.subscriptions} />;
};
