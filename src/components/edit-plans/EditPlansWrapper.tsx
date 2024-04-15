import { getAllSubscriptionsApi } from "@/api/subscription";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { EditPlans } from "@components/edit-plans/EditPlans";

interface Props {
  queries: SwitchedRoleQueries
}
export const EditPlansWrapper = async (props: Props) => {
  const subscriptions = await getAllSubscriptionsApi(props.queries);

  return <EditPlans subscriptions={subscriptions?.subscriptions} />;
};
